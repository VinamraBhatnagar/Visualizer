import type { TopicContent } from '@/types/problem';

export const topics: TopicContent[] = [
  {
    id: 'arrays-intro',
    title: 'Introduction to Arrays',
    category: 'arrays',
    icon: '📊',
    description: 'The foundation of data structures. Learn how contiguous memory allocation works and the tradeoffs of arrays.',
    whatIsIt: 'An array is a collection of items stored at contiguous memory locations. The idea is to store multiple items of the same type together.',
    whyWeNeedIt: 'Arrays are the most basic data structure. They are used when we need to store a list of items and access them quickly by their position (index).',
    howItWorks: 'When you declare an array, a single block of contiguous memory is allocated. Because the size of each element is known, the computer can instantly calculate the exact memory address of any element using its index.',
    analogy: 'Think of a row of lockers in a hallway. The lockers are right next to each other (contiguous), and if you know locker #5 is 5 lockers down from the start, you can walk straight to it.',
    codeExamples: {
      javascript: `// Creating and accessing an array
const arr = [10, 20, 30, 40, 50];

// Accessing an element (O(1))
console.log(arr[2]); // Outputs 30

// Modifying an element (O(1))
arr[1] = 25;`,
    },
    commonMistakes: [
      'Off-by-one errors (forgetting arrays are 0-indexed).',
      'Index out of bounds exceptions.',
      'Assuming inserting into the middle of an array is fast (it takes O(n) because subsequent elements must shift).'
    ],
    complexity: {
      time: {
        access: 'O(1)',
        search: 'O(n)',
        insertion: 'O(n)',
        deletion: 'O(n)'
      },
      space: {
        worst: 'O(n)'
      }
    },
    problems: ['two-sum', 'remove-duplicates']
  },
  {
    id: 'bubble-sort',
    title: 'Bubble Sort',
    category: 'sorting',
    icon: '🔄',
    description: 'A simple comparison-based sorting algorithm that repeatedly steps through the list, swaps adjacent elements if they are in the wrong order.',
    whatIsIt: 'Bubble Sort is the simplest sorting algorithm that works by repeatedly swapping the adjacent elements if they are in wrong order.',
    whyWeNeedIt: 'While not efficient for large datasets, Bubble Sort is conceptually simple and helps build a foundation for understanding more complex algorithms.',
    howItWorks: 'In each pass, we compare adjacent elements. If the left element is greater than the right, we swap them. With each complete pass, the largest remaining element "bubbles" up to its correct position at the end of the array.',
    analogy: 'Imagine a line of people sorting themselves by height. You compare yourself with the person next to you, swap if you are taller, and keep moving down the line.',
    codeExamples: {
      javascript: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}`,
    },
    commonMistakes: [
      'Iterating all the way to n in the inner loop instead of n-i-1 (inefficient).',
      'Not adding an early exit flag if the array is already sorted.'
    ],
    complexity: {
      time: {
        best: 'O(n)',
        average: 'O(n²)',
        worst: 'O(n²)'
      },
      space: {
        worst: 'O(1)'
      }
    },
    problems: ['sort-colors']
  }
];
