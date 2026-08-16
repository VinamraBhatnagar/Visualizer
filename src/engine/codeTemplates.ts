/**
 * Standard Java Algorithm Templates.
 * No custom annotations or tracing helpers needed — the Java Execution Engine traces everything automatically!
 */

export const CODE_TEMPLATES: Record<string, { name: string; code: string }> = {
  'merge-sort': {
    name: 'Merge Sort (Java)',
    code: `// Java program for Merge Sort
class MergeSort {
    // Merges two subarrays of a[]
    void merge(int a[], int l, int m, int r) {
        int n1 = m - l + 1;
        int n2 = r - m;

        int L[] = new int[n1];
        int R[] = new int[n2];

        for (int i = 0; i < n1; ++i)
            L[i] = a[l + i];

        for (int j = 0; j < n2; ++j)
            R[j] = a[m + 1 + j];

        int i = 0, j = 0;
        int k = l;

        while (i < n1 && j < n2) {
            if (L[i] <= R[j]) {
                a[k] = L[i];
                i++;
            } else {
                a[k] = R[j];
                j++;
            }
            k++;
        }

        while (i < n1) {
            a[k] = L[i];
            i++;
            k++;
        }

        while (j < n2) {
            a[k] = R[j];
            j++;
            k++;
        }
    }

    // Main function that sorts a[l..r] using merge()
    void sort(int a[], int l, int r) {
        if (l < r) {
            int m = (l + r) / 2;

            // Sort first and second halves
            sort(a, l, m);
            sort(a, m + 1, r);

            // Merge the sorted halves
            merge(a, l, m, r);
        }
    }

    // Driver method
    public static void main(String args[]) {
        int a[] = { 12, 11, 13, 5, 6, 7 };

        MergeSort ob = new MergeSort();
        ob.sort(a, 0, a.length - 1);

        int n = a.length;
        for (int i = 0; i < n; ++i)
            System.out.print(a[i] + " ");
    }
}`,
  },

  'bubble-sort': {
    name: 'Bubble Sort (Java)',
    code: `// Java program for Bubble Sort
class BubbleSort {
    void bubbleSort(int arr[]) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    // Swap adjacent elements
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }

    public static void main(String args[]) {
        int arr[] = { 64, 34, 25, 12, 22, 11, 90 };
        BubbleSort ob = new BubbleSort();
        ob.bubbleSort(arr);

        int n = arr.length;
        for (int i = 0; i < n; ++i)
            System.out.print(arr[i] + " ");
    }
}`,
  },

  'quick-sort': {
    name: 'Quick Sort (Java)',
    code: `// Java program for Quick Sort
class QuickSort {
    int partition(int arr[], int low, int high) {
        int pivot = arr[high];
        int i = low - 1;

        for (int j = low; j <= high - 1; j++) {
            if (arr[j] < pivot) {
                i++;
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
        int temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        return i + 1;
    }

    void quickSort(int arr[], int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }

    public static void main(String args[]) {
        int arr[] = { 10, 80, 30, 90, 40, 50, 70 };
        QuickSort ob = new QuickSort();
        ob.quickSort(arr, 0, arr.length - 1);

        int n = arr.length;
        for (int i = 0; i < n; ++i)
            System.out.print(arr[i] + " ");
    }
}`,
  },

  'selection-sort': {
    name: 'Selection Sort (Java)',
    code: `// Java program for Selection Sort
class SelectionSort {
    void sort(int arr[]) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIdx]) {
                    minIdx = j;
                }
            }
            // Swap found minimum with current element
            int temp = arr[minIdx];
            arr[minIdx] = arr[i];
            arr[i] = temp;
        }
    }

    public static void main(String args[]) {
        int arr[] = { 29, 10, 14, 37, 13 };
        SelectionSort ob = new SelectionSort();
        ob.sort(arr);

        int n = arr.length;
        for (int i = 0; i < n; ++i)
            System.out.print(arr[i] + " ");
    }
}`,
  },

  'insertion-sort': {
    name: 'Insertion Sort (Java)',
    code: `// Java program for Insertion Sort
class InsertionSort {
    void sort(int arr[]) {
        int n = arr.length;
        for (int i = 1; i < n; ++i) {
            int key = arr[i];
            int j = i - 1;

            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j = j - 1;
            }
            arr[j + 1] = key;
        }
    }

    public static void main(String args[]) {
        int arr[] = { 12, 11, 13, 5, 6 };
        InsertionSort ob = new InsertionSort();
        ob.sort(arr);

        int n = arr.length;
        for (int i = 0; i < n; ++i)
            System.out.print(arr[i] + " ");
    }
}`,
  },

  'binary-search': {
    name: 'Binary Search (Java)',
    code: `// Java program for Binary Search
class BinarySearch {
    int binarySearch(int arr[], int l, int r, int x) {
        if (r >= l) {
            int mid = l + (r - l) / 2;

            if (arr[mid] == x)
                return mid;

            if (arr[mid] > x)
                return binarySearch(arr, l, mid - 1, x);

            return binarySearch(arr, mid + 1, r, x);
        }
        return -1;
    }

    public static void main(String args[]) {
        int arr[] = { 2, 3, 4, 10, 40 };
        int x = 10;
        BinarySearch ob = new BinarySearch();
        int result = ob.binarySearch(arr, 0, arr.length - 1, x);
        System.out.print("Element found at index: " + result);
    }
}`,
  },
};
