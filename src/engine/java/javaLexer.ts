export type TokenType =
  | 'KEYWORD'
  | 'IDENTIFIER'
  | 'NUMBER'
  | 'STRING'
  | 'OPERATOR'
  | 'PUNCTUATION'
  | 'EOF';

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  col: number;
}

const KEYWORDS = new Set([
  'class', 'public', 'private', 'protected', 'static', 'final', 'void',
  'int', 'boolean', 'char', 'double', 'float', 'long', 'short', 'byte', 'String',
  'if', 'else', 'while', 'for', 'return', 'new', 'this', 'true', 'false', 'null'
]);

export function tokenizeJava(source: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;
  let line = 1;
  let col = 1;

  while (index < source.length) {
    const char = source[index];

    // Handle newlines
    if (char === '\n') {
      line++;
      col = 1;
      index++;
      continue;
    }

    // Handle whitespace
    if (/\s/.test(char)) {
      col++;
      index++;
      continue;
    }

    // Handle line comments //
    if (char === '/' && source[index + 1] === '/') {
      while (index < source.length && source[index] !== '\n') {
        index++;
      }
      continue;
    }

    // Handle block comments /* ... */
    if (char === '/' && source[index + 1] === '*') {
      index += 2;
      col += 2;
      while (index < source.length && !(source[index] === '*' && source[index + 1] === '/')) {
        if (source[index] === '\n') {
          line++;
          col = 1;
        } else {
          col++;
        }
        index++;
      }
      if (index < source.length) {
        index += 2;
        col += 2;
      }
      continue;
    }

    // Handle Numbers
    if (/[0-9]/.test(char)) {
      const startCol = col;
      let numStr = '';
      while (index < source.length && /[0-9.]/.test(source[index])) {
        numStr += source[index];
        index++;
        col++;
      }
      tokens.push({ type: 'NUMBER', value: numStr, line, col: startCol });
      continue;
    }

    // Handle Strings "..."
    if (char === '"' || char === "'") {
      const quote = char;
      const startCol = col;
      let str = '';
      index++;
      col++;
      while (index < source.length && source[index] !== quote && source[index] !== '\n') {
        str += source[index];
        index++;
        col++;
      }
      if (index < source.length && source[index] === quote) {
        index++;
        col++;
      }
      tokens.push({ type: 'STRING', value: str, line, col: startCol });
      continue;
    }

    // Handle Identifiers and Keywords
    if (/[a-zA-Z_$]/.test(char)) {
      const startCol = col;
      let ident = '';
      while (index < source.length && /[a-zA-Z0-9_$]/.test(source[index])) {
        ident += source[index];
        index++;
        col++;
      }
      const type: TokenType = KEYWORDS.has(ident) ? 'KEYWORD' : 'IDENTIFIER';
      tokens.push({ type, value: ident, line, col: startCol });
      continue;
    }

    // Handle Multi-char Operators: <=, >=, ==, !=, &&, ||, ++, --, +=, -=, *=, /=
    const twoChars = source.slice(index, index + 2);
    if (['<=', '>=', '==', '!=', '&&', '||', '++', '--', '+=', '-=', '*=', '/='].includes(twoChars)) {
      tokens.push({ type: 'OPERATOR', value: twoChars, line, col });
      index += 2;
      col += 2;
      continue;
    }

    // Single-char operators and punctuation
    if ('+-*/%<>=!'.includes(char)) {
      tokens.push({ type: 'OPERATOR', value: char, line, col });
      index++;
      col++;
      continue;
    }

    if ('(){}[];,.:'.includes(char)) {
      tokens.push({ type: 'PUNCTUATION', value: char, line, col });
      index++;
      col++;
      continue;
    }

    // Unknown character, skip
    index++;
    col++;
  }

  tokens.push({ type: 'EOF', value: '', line, col });
  return tokens;
}
