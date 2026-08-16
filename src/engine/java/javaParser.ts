import { tokenizeJava, type Token } from './javaLexer';

export type ASTNode =
  | ProgramNode
  | ClassNode
  | MethodNode
  | BlockNode
  | VarDeclNode
  | AssignmentNode
  | IfNode
  | WhileNode
  | ForNode
  | ReturnNode
  | ExprStatementNode
  | BinaryExprNode
  | UnaryExprNode
  | ArrayAccessNode
  | MemberAccessNode
  | MethodCallNode
  | ArrayLiteralNode
  | NewArrayNode
  | NewObjectNode
  | IdentifierNode
  | LiteralNode;

export interface BaseNode {
  line: number;
}

export interface ProgramNode extends BaseNode {
  type: 'Program';
  classes: ClassNode[];
}

export interface ClassNode extends BaseNode {
  type: 'Class';
  name: string;
  methods: MethodNode[];
}

export interface MethodNode extends BaseNode {
  type: 'Method';
  name: string;
  returnType: string;
  isStatic: boolean;
  params: { name: string; type: string; isArray: boolean }[];
  body: BlockNode;
}

export interface BlockNode extends BaseNode {
  type: 'Block';
  statements: ASTNode[];
}

export interface VarDeclNode extends BaseNode {
  type: 'VarDecl';
  varType: string;
  declarations: { name: string; isArray: boolean; init?: ASTNode }[];
}

export interface AssignmentNode extends BaseNode {
  type: 'Assignment';
  operator: string; // '=', '+=', '-=', etc.
  target: IdentifierNode | ArrayAccessNode;
  value: ASTNode;
}

export interface IfNode extends BaseNode {
  type: 'If';
  condition: ASTNode;
  thenBranch: ASTNode;
  elseBranch?: ASTNode;
}

export interface WhileNode extends BaseNode {
  type: 'While';
  condition: ASTNode;
  body: ASTNode;
}

export interface ForNode extends BaseNode {
  type: 'For';
  init?: ASTNode;
  condition?: ASTNode;
  update?: ASTNode;
  body: ASTNode;
}

export interface ReturnNode extends BaseNode {
  type: 'Return';
  value?: ASTNode;
}

export interface ExprStatementNode extends BaseNode {
  type: 'ExprStatement';
  expr: ASTNode;
}

export interface BinaryExprNode extends BaseNode {
  type: 'BinaryExpr';
  operator: string;
  left: ASTNode;
  right: ASTNode;
}

export interface UnaryExprNode extends BaseNode {
  type: 'UnaryExpr';
  operator: string; // '++', '--', '!', '-', '+'
  prefix: boolean;
  argument: ASTNode;
}

export interface ArrayAccessNode extends BaseNode {
  type: 'ArrayAccess';
  array: ASTNode;
  index: ASTNode;
}

export interface MemberAccessNode extends BaseNode {
  type: 'MemberAccess';
  object: ASTNode;
  property: string;
}

export interface MethodCallNode extends BaseNode {
  type: 'MethodCall';
  callee: ASTNode; // Identifier or MemberAccess (e.g. ob.sort or sort or System.out.print)
  args: ASTNode[];
}

export interface ArrayLiteralNode extends BaseNode {
  type: 'ArrayLiteral';
  elements: ASTNode[];
}

export interface NewArrayNode extends BaseNode {
  type: 'NewArray';
  elementType: string;
  size: ASTNode;
}

export interface NewObjectNode extends BaseNode {
  type: 'NewObject';
  className: string;
  args: ASTNode[];
}

export interface IdentifierNode extends BaseNode {
  type: 'Identifier';
  name: string;
}

export interface LiteralNode extends BaseNode {
  type: 'Literal';
  value: number | string | boolean | null;
}

export class JavaParser {
  private tokens: Token[];
  private current = 0;

  constructor(source: string) {
    this.tokens = tokenizeJava(source);
  }

  private peek(): Token {
    return this.tokens[this.current] || { type: 'EOF', value: '', line: 0, col: 0 };
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  private isAtEnd(): boolean {
    return this.peek().type === 'EOF';
  }

  private check(value: string, type?: string): boolean {
    if (this.isAtEnd()) return false;
    if (type && this.peek().type !== type) return false;
    return this.peek().value === value;
  }

  private match(...values: string[]): boolean {
    for (const val of values) {
      if (this.check(val)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private consume(value: string, message: string): Token {
    if (this.check(value)) return this.advance();
    const token = this.peek();
    throw new Error(`Line ${token.line}: ${message} (found '${token.value}')`);
  }

  public parse(): ProgramNode {
    const classes: ClassNode[] = [];
    const startLine = this.peek().line;

    while (!this.isAtEnd()) {
      // Consume any visibility or modifiers before class
      while (this.match('public', 'private', 'protected', 'static', 'final', 'abstract')) {
        // skip
      }

      if (this.match('class')) {
        classes.push(this.parseClass());
      } else if (!this.isAtEnd()) {
        this.advance();
      }
    }

    return { type: 'Program', line: startLine, classes };
  }

  private parseClass(): ClassNode {
    const line = this.previous().line;
    const nameToken = this.consume(this.peek().value, 'Expected class name');
    const className = nameToken.value;

    this.consume('{', "Expected '{' after class name");

    const methods: MethodNode[] = [];

    while (!this.check('}') && !this.isAtEnd()) {
      // Modifiers
      let isStatic = false;
      while (this.match('public', 'private', 'protected', 'static', 'final')) {
        if (this.previous().value === 'static') isStatic = true;
      }

      if (this.check('}')) break;

      // Method or field
      const returnTypeToken = this.advance();
      let returnType = returnTypeToken.value;

      // Handle returnType[]
      if (this.match('[')) {
        this.consume(']', "Expected ']'");
        returnType += '[]';
      }

      const methodNameToken = this.advance();
      const methodName = methodNameToken.value;

      if (this.match('(')) {
        // Method definition
        const params: { name: string; type: string; isArray: boolean }[] = [];
        if (!this.check(')')) {
          do {
            const pType = this.advance().value;
            let isArray = false;
            if (this.match('[')) {
              this.consume(']', "Expected ']'");
              isArray = true;
            }
            const pName = this.advance().value;
            if (this.match('[')) {
              this.consume(']', "Expected ']'");
              isArray = true;
            }
            params.push({ name: pName, type: pType, isArray });
          } while (this.match(','));
        }
        this.consume(')', "Expected ')' after parameters");

        const body = this.parseBlock();
        methods.push({
          type: 'Method',
          line: methodNameToken.line,
          name: methodName,
          returnType,
          isStatic,
          params,
          body,
        });
      } else {
        // Field definition, consume until semicolon
        while (!this.check(';') && !this.isAtEnd()) {
          this.advance();
        }
        if (this.match(';')) {
          // done
        }
      }
    }

    this.consume('}', "Expected '}' after class body");
    return { type: 'Class', line, name: className, methods };
  }

  private parseBlock(): BlockNode {
    const line = this.peek().line;
    this.consume('{', "Expected '{' to start block");
    const statements: ASTNode[] = [];

    while (!this.check('}') && !this.isAtEnd()) {
      const stmt = this.parseStatement();
      if (stmt) statements.push(stmt);
    }

    this.consume('}', "Expected '}' to end block");
    return { type: 'Block', line, statements };
  }

  private parseStatement(): ASTNode | null {
    const line = this.peek().line;

    // Block statement
    if (this.check('{')) {
      return this.parseBlock();
    }

    // If statement
    if (this.match('if')) {
      this.consume('(', "Expected '(' after 'if'");
      const condition = this.parseExpression();
      this.consume(')', "Expected ')' after if condition");
      const thenBranch = this.parseStatement() || { type: 'Block', line, statements: [] };
      let elseBranch: ASTNode | undefined;
      if (this.match('else')) {
        elseBranch = this.parseStatement() || undefined;
      }
      return { type: 'If', line, condition, thenBranch, elseBranch };
    }

    // While statement
    if (this.match('while')) {
      this.consume('(', "Expected '(' after 'while'");
      const condition = this.parseExpression();
      this.consume(')', "Expected ')' after while condition");
      const body = this.parseStatement() || { type: 'Block', line, statements: [] };
      return { type: 'While', line, condition, body };
    }

    // For statement
    if (this.match('for')) {
      this.consume('(', "Expected '(' after 'for'");

      let init: ASTNode | undefined;
      if (!this.check(';')) {
        if (this.isVarDeclaration()) {
          init = this.parseVarDeclWithoutSemicolon();
        } else {
          init = this.parseExpression();
        }
      }
      this.consume(';', "Expected ';' after for init");

      let condition: ASTNode | undefined;
      if (!this.check(';')) {
        condition = this.parseExpression();
      }
      this.consume(';', "Expected ';' after for condition");

      let update: ASTNode | undefined;
      if (!this.check(')')) {
        update = this.parseExpression();
      }
      this.consume(')', "Expected ')' after for clauses");

      const body = this.parseStatement() || { type: 'Block', line, statements: [] };
      return { type: 'For', line, init, condition, update, body };
    }

    // Return statement
    if (this.match('return')) {
      let value: ASTNode | undefined;
      if (!this.check(';')) {
        value = this.parseExpression();
      }
      this.consume(';', "Expected ';' after return value");
      return { type: 'Return', line, value };
    }

    // Variable declaration: int x = 0, y = 5; or MergeSort ob = new MergeSort();
    if (this.isVarDeclaration()) {
      const decl = this.parseVarDeclWithoutSemicolon();
      this.consume(';', "Expected ';' after variable declaration");
      return decl;
    }

    // Expression statement
    const expr = this.parseExpression();
    this.consume(';', "Expected ';' after statement");
    return { type: 'ExprStatement', line, expr };
  }

  private isTypeKeyword(val: string): boolean {
    return ['int', 'boolean', 'char', 'double', 'float', 'long', 'String', 'void'].includes(val);
  }

  private isVarDeclaration(): boolean {
    const t0 = this.peek();
    if (t0.type !== 'IDENTIFIER' && t0.type !== 'KEYWORD') return false;
    if (this.isTypeKeyword(t0.value)) return true;

    // Check lookahead for `ClassName obj` or `ClassName[] arr` or `ClassName arr[]`
    const nextIdx = this.current + 1;
    const t1 = this.tokens[nextIdx];
    if (!t1) return false;

    if (t1.type === 'IDENTIFIER') return true;
    if (t1.value === '[') {
      const t2 = this.tokens[nextIdx + 1];
      if (t2 && t2.value === ']') return true;
    }
    return false;
  }

  private parseVarDeclWithoutSemicolon(): VarDeclNode {
    const line = this.peek().line;
    const varType = this.advance().value;
    const declarations: { name: string; isArray: boolean; init?: ASTNode }[] = [];

    do {
      let isArray = false;
      if (this.match('[')) {
        this.consume(']', "Expected ']'");
        isArray = true;
      }

      const name = this.consume(this.peek().value, 'Expected variable name').value;

      if (this.match('[')) {
        this.consume(']', "Expected ']'");
        isArray = true;
      }

      let init: ASTNode | undefined;
      if (this.match('=')) {
        init = this.parseExpression();
      }

      declarations.push({ name, isArray, init });
    } while (this.match(','));

    return { type: 'VarDecl', line, varType, declarations };
  }

  private parseExpression(): ASTNode {
    return this.parseAssignment();
  }

  private parseAssignment(): ASTNode {
    const expr = this.parseLogicalOr();

    if (this.match('=', '+=', '-=', '*=', '/=')) {
      const operator = this.previous().value;
      const value = this.parseAssignment();

      if (expr.type === 'Identifier' || expr.type === 'ArrayAccess') {
        return {
          type: 'Assignment',
          line: expr.line,
          operator,
          target: expr,
          value,
        };
      }
      throw new Error(`Line ${expr.line}: Invalid assignment target.`);
    }

    return expr;
  }

  private parseLogicalOr(): ASTNode {
    let expr = this.parseLogicalAnd();
    while (this.match('||')) {
      const operator = this.previous().value;
      const right = this.parseLogicalAnd();
      expr = { type: 'BinaryExpr', line: expr.line, operator, left: expr, right };
    }
    return expr;
  }

  private parseLogicalAnd(): ASTNode {
    let expr = this.parseEquality();
    while (this.match('&&')) {
      const operator = this.previous().value;
      const right = this.parseEquality();
      expr = { type: 'BinaryExpr', line: expr.line, operator, left: expr, right };
    }
    return expr;
  }

  private parseEquality(): ASTNode {
    let expr = this.parseComparison();
    while (this.match('==', '!=')) {
      const operator = this.previous().value;
      const right = this.parseComparison();
      expr = { type: 'BinaryExpr', line: expr.line, operator, left: expr, right };
    }
    return expr;
  }

  private parseComparison(): ASTNode {
    let expr = this.parseTerm();
    while (this.match('<', '<=', '>', '>=')) {
      const operator = this.previous().value;
      const right = this.parseTerm();
      expr = { type: 'BinaryExpr', line: expr.line, operator, left: expr, right };
    }
    return expr;
  }

  private parseTerm(): ASTNode {
    let expr = this.parseFactor();
    while (this.match('+', '-')) {
      const operator = this.previous().value;
      const right = this.parseFactor();
      expr = { type: 'BinaryExpr', line: expr.line, operator, left: expr, right };
    }
    return expr;
  }

  private parseFactor(): ASTNode {
    let expr = this.parseUnary();
    while (this.match('*', '/', '%')) {
      const operator = this.previous().value;
      const right = this.parseUnary();
      expr = { type: 'BinaryExpr', line: expr.line, operator, left: expr, right };
    }
    return expr;
  }

  private parseUnary(): ASTNode {
    if (this.match('!', '-', '+', '++', '--')) {
      const operator = this.previous().value;
      const argument = this.parseUnary();
      return { type: 'UnaryExpr', line: this.previous().line, operator, prefix: true, argument };
    }
    return this.parsePostfix();
  }

  private parsePostfix(): ASTNode {
    let expr = this.parseCallAndAccess();
    while (this.match('++', '--')) {
      const operator = this.previous().value;
      expr = { type: 'UnaryExpr', line: expr.line, operator, prefix: false, argument: expr };
    }
    return expr;
  }

  private parseCallAndAccess(): ASTNode {
    let expr = this.parsePrimary();

    while (true) {
      if (this.match('[')) {
        const index = this.parseExpression();
        this.consume(']', "Expected ']' after array index");
        expr = { type: 'ArrayAccess', line: expr.line, array: expr, index };
      } else if (this.match('.')) {
        const propToken = this.consume(this.peek().value, 'Expected property or method name');
        const property = propToken.value;

        if (this.match('(')) {
          const args: ASTNode[] = [];
          if (!this.check(')')) {
            do {
              args.push(this.parseExpression());
            } while (this.match(','));
          }
          this.consume(')', "Expected ')' after arguments");
          expr = {
            type: 'MethodCall',
            line: expr.line,
            callee: { type: 'MemberAccess', line: expr.line, object: expr, property },
            args,
          };
        } else {
          expr = { type: 'MemberAccess', line: expr.line, object: expr, property };
        }
      } else if (this.match('(')) {
        const args: ASTNode[] = [];
        if (!this.check(')')) {
          do {
            args.push(this.parseExpression());
          } while (this.match(','));
        }
        this.consume(')', "Expected ')' after arguments");
        expr = { type: 'MethodCall', line: expr.line, callee: expr, args };
      } else {
        break;
      }
    }

    return expr;
  }

  private parsePrimary(): ASTNode {
    const token = this.peek();

    // Grouping (...)
    if (this.match('(')) {
      const expr = this.parseExpression();
      this.consume(')', "Expected ')' after expression");
      return expr;
    }

    // Array literal { 12, 11, 13 }
    if (this.match('{')) {
      const elements: ASTNode[] = [];
      if (!this.check('}')) {
        do {
          elements.push(this.parseExpression());
        } while (this.match(','));
      }
      this.consume('}', "Expected '}' after array literal");
      return { type: 'ArrayLiteral', line: token.line, elements };
    }

    // New expression: new int[n1] or new MergeSort()
    if (this.match('new')) {
      const typeToken = this.advance();
      if (this.match('[')) {
        const size = this.parseExpression();
        this.consume(']', "Expected ']' after array size");
        return { type: 'NewArray', line: token.line, elementType: typeToken.value, size };
      }
      if (this.match('(')) {
        const args: ASTNode[] = [];
        if (!this.check(')')) {
          do {
            args.push(this.parseExpression());
          } while (this.match(','));
        }
        this.consume(')', "Expected ')' after constructor args");
        return { type: 'NewObject', line: token.line, className: typeToken.value, args };
      }
    }

    // Number literal
    if (token.type === 'NUMBER') {
      this.advance();
      return { type: 'Literal', line: token.line, value: Number(token.value) };
    }

    // String literal
    if (token.type === 'STRING') {
      this.advance();
      return { type: 'Literal', line: token.line, value: token.value };
    }

    // Boolean / Null literals
    if (this.match('true')) return { type: 'Literal', line: token.line, value: true };
    if (this.match('false')) return { type: 'Literal', line: token.line, value: false };
    if (this.match('null')) return { type: 'Literal', line: token.line, value: null };

    // Identifier
    if (token.type === 'IDENTIFIER' || this.isTypeKeyword(token.value)) {
      this.advance();
      return { type: 'Identifier', line: token.line, name: token.value };
    }

    throw new Error(`Line ${token.line}: Unexpected token '${token.value}'`);
  }
}

export function parseJava(source: string): ProgramNode {
  const parser = new JavaParser(source);
  return parser.parse();
}
