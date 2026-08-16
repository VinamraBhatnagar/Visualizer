/**
 * Sample code templates that use the tracing API.
 * These give users a starting point and demonstrate how to use the helpers.
 */

export const CODE_TEMPLATES: Record<string, { name: string; code: string }> = {
  'bubble-sort': {
    name: 'Bubble Sort',
    code: `// Bubble Sort — uses the CodePulse tracing API
const arr = __traceArray('arr', [64, 34, 25, 12, 22]);
const n = arr.length;
__setVar('n', n);
__log('Starting Bubble Sort on array: [' + arr.toArray() + ']');

for (let i = 0; i < n - 1; i++) {
  __setVar('i', i);
  __log('--- Pass ' + (i + 1) + ' ---');

  for (let j = 0; j < n - i - 1; j++) {
    __setVar('j', j);
    __setPointer('j', j);
    __setPointer('j+1', j + 1);

    if (arr.compare(j, j + 1)) {
      arr.swap(j, j + 1);
    }
  }

  arr.markSorted(n - i - 1);
  __clearPointers();
}

arr.markSorted(0);
__log('🎉 Array is fully sorted: [' + arr.toArray() + ']');`,
  },

  'selection-sort': {
    name: 'Selection Sort',
    code: `// Selection Sort — uses the CodePulse tracing API
const arr = __traceArray('arr', [29, 10, 14, 37, 13]);
const n = arr.length;
__setVar('n', n);
__log('Starting Selection Sort on array: [' + arr.toArray() + ']');

for (let i = 0; i < n - 1; i++) {
  __setVar('i', i);
  let minIdx = i;
  __setVar('minIdx', minIdx);
  __setPointer('min', minIdx);
  __log('Pass ' + (i + 1) + ': Finding minimum from index ' + i);

  for (let j = i + 1; j < n; j++) {
    __setVar('j', j);
    __setPointer('j', j);

    if (arr.compare(minIdx, j)) {
      // compare returns true if arr[minIdx] > arr[j]
      // (compare is backwards here, so we flip)
    }
    // Actually check raw values for selection sort logic
    if (arr.get(j) < arr.get(minIdx)) {
      minIdx = j;
      __setVar('minIdx', minIdx);
      __setPointer('min', minIdx);
      __addStep(0, 'New minimum found: arr[' + j + ']=' + arr.get(j), []);
    }
  }

  if (minIdx !== i) {
    arr.swap(i, minIdx);
  }
  arr.markSorted(i);
  __clearPointers();
}

arr.markSorted(n - 1);
__log('🎉 Array is fully sorted: [' + arr.toArray() + ']');`,
  },

  'insertion-sort': {
    name: 'Insertion Sort',
    code: `// Insertion Sort — uses the CodePulse tracing API
const arr = __traceArray('arr', [12, 11, 13, 5, 6]);
const n = arr.length;
__setVar('n', n);
__log('Starting Insertion Sort on array: [' + arr.toArray() + ']');
arr.markSorted(0);

for (let i = 1; i < n; i++) {
  const key = arr.get(i);
  __setVar('i', i);
  __setVar('key', key);
  __setPointer('key', i);
  __log('Inserting key=' + key + ' (index ' + i + ') into sorted portion');

  let j = i - 1;
  while (j >= 0 && arr.get(j) > key) {
    __setVar('j', j);
    __setPointer('j', j);
    __addStep(0, 'arr[' + j + ']=' + arr.get(j) + ' > key=' + key + ' → shift right', [
      { type: 'COMPARE', target: 'arr', indices: [j, j + 1] }
    ]);
    arr.__raw[j + 1] = arr.get(j);
    __addStep(0, 'Shifted arr[' + j + '] to arr[' + (j + 1) + ']', []);
    j--;
  }
  arr.__raw[j + 1] = key;
  __setVar('j', j);
  __addStep(0, 'Placed key=' + key + ' at index ' + (j + 1), []);
  arr.markSorted(i);
  __clearPointers();
}

__log('🎉 Array is fully sorted: [' + arr.toArray() + ']');`,
  },

  'merge-sort': {
    name: 'Merge Sort',
    code: `// Merge Sort — uses the CodePulse tracing API
const arr = __traceArray('arr', [12, 11, 13, 5, 6, 7]);
__log('Initial array for Merge Sort: [' + arr.toArray() + ']');

function merge(l, m, r) {
  const n1 = m - l + 1;
  const n2 = r - m;

  const L = [];
  const R = [];

  for (let i = 0; i < n1; ++i) L[i] = arr.get(l + i);
  for (let j = 0; j < n2; ++j) R[j] = arr.get(m + 1 + j);

  __setPointer('L', l);
  __setPointer('mid', m);
  __setPointer('R', r);
  __log('Merging subarrays: [' + L + '] and [' + R + ']');

  let i = 0, j = 0, k = l;
  while (i < n1 && j < n2) {
    __setPointer('k', k);
    if (L[i] <= R[j]) {
      arr.__raw[k] = L[i];
      __addStep(0, 'Placed ' + L[i] + ' at index ' + k, [{ type: 'ASSIGN', target: 'arr', indices: [k] }]);
      i++;
    } else {
      arr.__raw[k] = R[j];
      __addStep(0, 'Placed ' + R[j] + ' at index ' + k, [{ type: 'ASSIGN', target: 'arr', indices: [k] }]);
      j++;
    }
    k++;
  }

  while (i < n1) {
    arr.__raw[k] = L[i];
    __addStep(0, 'Copied remaining ' + L[i] + ' at index ' + k, [{ type: 'ASSIGN', target: 'arr', indices: [k] }]);
    i++;
    k++;
  }

  while (j < n2) {
    arr.__raw[k] = R[j];
    __addStep(0, 'Copied remaining ' + R[j] + ' at index ' + k, [{ type: 'ASSIGN', target: 'arr', indices: [k] }]);
    j++;
    k++;
  }
}

function mergeSort(l, r) {
  if (l < r) {
    const m = Math.floor((l + r) / 2);
    __log('Dividing: left [' + l + '..' + m + '] and right [' + (m + 1) + '..' + r + ']');
    mergeSort(l, m);
    mergeSort(m + 1, r);
    merge(l, m, r);
  }
}

mergeSort(0, arr.length - 1);
for (let i = 0; i < arr.length; i++) arr.markSorted(i);
__clearPointers();
__log('🎉 Array is fully sorted: [' + arr.toArray() + ']');`,
  },

  'quick-sort': {
    name: 'Quick Sort',
    code: `// Quick Sort — uses the CodePulse tracing API
const arr = __traceArray('arr', [10, 80, 30, 90, 40, 50, 70]);
__log('Initial array for Quick Sort: [' + arr.toArray() + ']');

function partition(low, high) {
  const pivot = arr.get(high);
  __setPointer('pivot', high);
  __log('Pivot selected: arr[' + high + ']=' + pivot);

  let i = low - 1;
  for (let j = low; j <= high - 1; j++) {
    __setPointer('j', j);
    if (arr.get(j) < pivot) {
      i++;
      if (i !== j) {
        arr.swap(i, j);
      }
    }
  }
  arr.swap(i + 1, high);
  arr.markSorted(i + 1);
  return i + 1;
}

function quickSort(low, high) {
  if (low < high) {
    const pi = partition(low, high);
    __log('Partition complete at index ' + pi);
    quickSort(low, pi - 1);
    quickSort(pi + 1, high);
  } else if (low === high) {
    arr.markSorted(low);
  }
}

quickSort(0, arr.length - 1);
__clearPointers();
__log('🎉 Array is fully sorted: [' + arr.toArray() + ']');`,
  },

  'linear-search': {
    name: 'Linear Search',
    code: `// Linear Search — uses the CodePulse tracing API
const arr = __traceArray('arr', [10, 23, 45, 70, 11, 15]);
const target = 70;
__setVar('target', target);
__log('Searching for ' + target + ' in array: [' + arr.toArray() + ']');

let found = false;
for (let i = 0; i < arr.length; i++) {
  __setVar('i', i);
  __setPointer('i', i);
  __addStep(0, 'Checking index ' + i + ': arr[' + i + ']=' + arr.get(i) + (arr.get(i) === target ? ' ✓ FOUND!' : ' ✗'), [
    { type: 'COMPARE', target: 'arr', indices: [i] }
  ]);

  if (arr.get(i) === target) {
    found = true;
    __setVar('found', true);
    arr.markSorted(i);
    __log('🎉 Found ' + target + ' at index ' + i + '!');
    break;
  }
}

if (!found) {
  __log('❌ ' + target + ' not found in the array.');
}`,
  },

  'custom': {
    name: 'Custom Code',
    code: `// Write your own code using the CodePulse Tracing API!
//
// Available helpers:
//   __traceArray('name', [...])  → create a traced array
//   arr.compare(i, j)           → compare and log two indices
//   arr.swap(i, j)              → swap and log two indices
//   arr.get(i)                  → get value at index
//   arr.markSorted(i)           → mark index as sorted (turns green)
//   __setVar('name', value)     → track a variable
//   __setPointer('label', idx)  → show a pointer under an index
//   __clearPointers()           → remove all pointers
//   __log('message')            → add an explanation step
//   __addStep(line, msg, ops)   → add a custom step
//
// Example:
const arr = __traceArray('arr', [5, 3, 8, 1, 9]);
__log('My custom array: [' + arr.toArray() + ']');

for (let i = 0; i < arr.length - 1; i++) {
  __setVar('i', i);
  __setPointer('i', i);
  if (arr.compare(i, i + 1)) {
    arr.swap(i, i + 1);
  }
}
__log('Done! Result: [' + arr.toArray() + ']');`,
  },
};
