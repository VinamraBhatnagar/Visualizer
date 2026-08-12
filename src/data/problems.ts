import type { Problem } from '@/types/problem';

export const problems: Problem[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    difficulty: 'easy',
    category: 'arrays',
    pattern: 'hashing',
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        expectedOutput: '[0,1]',
        isEdgeCase: false,
        description: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      }
    ],
    edgeCases: [
      {
        input: 'nums = [3,3], target = 6',
        expectedOutput: '[0,1]',
        isEdgeCase: true,
        description: 'Array with only two elements that are identical.'
      }
    ],
    hints: [
      { level: 1, type: 'conceptual', content: 'A brute force approach would be to check every possible pair. Can we do better?' },
      { level: 2, type: 'pattern', content: 'If we are currently looking at a number X, what number do we need to find to reach the target?' },
      { level: 3, type: 'algorithm', content: 'We need to find (target - X). What data structure allows us to look up whether we have seen (target - X) in O(1) time?' },
      { level: 4, type: 'pseudocode', content: 'Initialize an empty hash map. Iterate through the array. For each element, calculate the complement (target - element). If the complement is in the map, return current index and map[complement]. Otherwise, add the element and its index to the map.' },
      { level: 5, type: 'solution', content: 'Use a Map where the key is the number and the value is its index.' }
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
  // Write your code here
  
}`
    },
    solutionCode: {
      javascript: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`
    },
    complexity: {
      time: 'O(n)',
      space: 'O(n)',
      explanation: 'We traverse the list containing n elements only once. Each lookup in the table costs only O(1) time. The space complexity is O(n) because the hash map stores at most n elements.'
    },
    tags: ['Array', 'Hash Table'],
    relatedProblems: ['3sum', 'two-sum-ii-input-array-is-sorted']
  }
];
