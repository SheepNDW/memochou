---
outline: deep
---

# 快速排序法 Quick Sort

快速排序法（Quick Sort）是對氣泡排序法的一種改進，是一個基於分治法（Divide and conquer）的排序演算法。它不像 Merge Sort 那樣一上來就將陣列切成“碎片”，而是逐漸對要處理的陣列進行切割，每次切成兩部分，讓其左邊都小於某個數，右邊都大於某個數，然後再對左右兩邊進行同樣的操作（快速排序），直到每個子陣列長度為 1，原陣列就會變成有序的了。

從下面這段程式碼來具體理解一下，它的基本架構如下：

```js
function quickSort (array) {
  function QuickSort(array, left, right) {
    if (left < right) {
      let index = partition(array, left, right);
      QuickSort(array, left, index - 1);
      QuickSort(array, index + 1, right);
    }
  }

  QuickSort(array, 0, array.length - 1);
  return array;
}

function partition(array, left, right) { // D&C function
  // TODO
}
```

`quickSort` 是一個進入點，它會呼叫遞迴函式 `QuickSort`。`QuickSort` 內部有一個 `partition` 輔助函式，它會選中某個元素作為基準值（pivot，分界值），實作對子陣列的左右切割，保證左邊的元素都比 pivot 小，右邊的元素都比 pivot 大，最後回傳 pivot 的索引值，方便再對左右兩陣列呼叫 `QuickSort`。

## Quick Sort 的常用方法

對於 quick sort 的 `partition` 函式的實作，通常有以下 3 種。

#### 1. 左右指標法

使用左右指標法實作 `partition` 方法的步驟如下：

1. 選取某個元素作為 pivot，一般取目前陣列的第一個或最後一個元素，這裡採用最後一個元素。
2. 從 left 一直向後尋找，直到找到一個大於 pivot 的值，而 right 則從後往前尋找，直到找到一個小於 pivot 的值，然後交換兩元素的位置。
3. 重複步驟 2，直到 left 與 right 相遇，此時將 pivot 放置在 left 的位置即可。

當 `left >= right` 時，一趟 quick sort 就完成了，這時將 pivot 和 `array[left]` 的值進行一次交換：

```js
function partition(array, left, right) {
  const pivot = array[right];
  let pivotIndex = right;

  while (left < right) {
    while (left < right && array[left] <= pivot) {
      // 1. 防止越界需要 left < right
      // 2. array[left] <= pivot 因為可能存在相同元素
      left++; // 找到比 pivot 大的數
    }
    while (left < right && array[right] >= pivot) {
      right--; // 找到比 pivot 小的數
    }
    swap(array, left, right);
  }
  // 最後一個比 pivot 大的 left 元素要與 pivot 交換
  swap(array, left, pivotIndex);
  return left; // 回傳的是中間的位置
}
```

上面程式碼的執行過程可以參考這張圖：

<div align="center">
  <img src="https://github.com/SheepNDW/data-structures-and-algorithms/raw/main/src/algorithms/sorting/quick-sort/images/quick-sort1.png" alt="quick-sort" width="550px">
</div>

#### 2. 挖坑法

使用挖坑法實作 `partition` 方法的步驟如下：

1. 選取某個元素作為 pivot，這裡選擇第 1 個元素，將“它”挖出來（這只是概念上的挖，它兩側的數不會趁機佔領這個位置）。於是這個位置就是最初的“坑”。
2. 從 left 一直向後尋找，直到找到一個大於 pivot 的值，然後將該元素填入坑中，坑位變成了 `array[left]`。
3. 從 right 一直向前尋找，直到找到一個小於 pivot 的值，然後將該元素填入坑中，坑位變成了 `array[right]`。
4. 重複步驟 2、3，直到 left 與 right 相遇，然後將 pivot 填入最後一個坑位。

挖坑法的程式碼實作如下：

```js
function partition(array, left, right) {
  const pivot = array[right]; // 坑位為 array[right]
  while (left < right) {
    while (left < right && array[left] <= pivot) {
      left++;
    }
    array[right] = array[left]; // 坑位變成 array[left]
    while (left < right && array[right] >= pivot) {
      right--;
    }
    array[left] = array[right]; // 坑位變成 array[right]
  }
  array[right] = pivot;
  return left;
}
```

坑位在程式碼上的變化如下：

`array[left] -> array[right] -> array[left] -> array[right] -> ...`

這是填坑的示意圖：

<div align="center">
  <img src="https://github.com/SheepNDW/data-structures-and-algorithms/raw/main/src/algorithms/sorting/quick-sort/images/quick-sort2.png" alt="quick-sort" width="550px">
</div>

挖坑法比左右指標法好理解，並且不依賴額外的 `swap` 函式，具體執行過程可以參考下面這張圖：

<div align="center">
  <img src="https://github.com/SheepNDW/data-structures-and-algorithms/raw/main/src/algorithms/sorting/quick-sort/images/quick-sort3.jpg" alt="quick-sort" width="650px">
</div>

#### 3. 前後指標法

使用前後指標法實作 `partition` 方法的步驟如下：

定義兩個指標，一前一後，前面的指標尋找比 pivot 小的元素，後面的指標尋找比 pivot 大的元素。前面的指標找到符合條件的元素後，將前後指標所指向的元素交換位置，當前面的指標遍歷完整個陣列時，將 pivot 與後指標的後一位交換位置，然後回傳後指標的位置。

```js
function partition(array, left, right) {
  const pivot = array[right];
  let curr = left; // 找比 pivot 大的數
  let prev = curr - 1; // 找比 pivot 小的數

  while (curr <= right) {
    if (array[curr] <= pivot && ++prev !== curr) {
      swap(array, prev, curr);
    }
    curr++;
  }
  return prev;
}
```

前後指標法的執行過程可以參考下面這張圖：

<div align="center">
  <img src="https://github.com/SheepNDW/data-structures-and-algorithms/raw/main/src/algorithms/sorting/quick-sort/images/quick-sort4.png" alt="quick-sort" width="650px">
</div>

這個方法最大的優勢是支援對鏈結串列（Linked List）進行排序，而左右指標法和挖坑法只能針對陣列進行排序。

## Optimization

Quick Sort 的最佳化主要涉及到三個方面：

1. pivot 的選擇。最好和最壞情況的區別就是選取 pivot 不正確導致的。之前的程式碼裡，我們會選擇第一個或是最後一個元素作為 pivot，但太大或太小的元素都會影響效率。於是我們有了三數取中位數法，即隨機取 3 個元素進行排序，然後取中間的元素作為 pivot，一般我們會取第一個、中間的、最後一個元素。如果排序的陣列非常大，還可以進行九數取中位，取三次樣本，每次取三個元素，然後再取這三個元素的中位數，最後再取這三個中位數的中位數作為 pivot。
2. 改進不必要的交換。我們將 pivot 備份到 `A[0]` 中，像在前文中使用 `swap` 方法時一樣，我們只需要做交換的工作，最終 `A[i]` 與 `A[j]` 融合，再將 `A[0]` 位置的數值賦值回 `A[i]`。因為沒有了多次交換的操作，所以效率會有所提升。
3. 改進小陣列時的排序方案。對於很小的和部分有序的陣列，Quick Sort 的效率不如 Insertion Sort。因此，我們可以對陣列進行切割，當陣列的大小小於一定的值時，使用 Insertion Sort 進行排序。

待排序序列長度 N = 10，在 5 和 20 之間任一截止範圍都有可能產生類似效果。下面是小陣列使用 Insertion Sort 的程式碼：

```js
if (high - low + 1 < 10) {
  insertionSort(array, low, high);
  return;
} else {
  quickSort(array, low, high);
}
```

完整程式碼如下：

```js
function getMid(array, left, right) {
  const mid = left + Math.floor((right - left) / 2);
  if (array[left] <= array[right]) {
    if (array[mid] < array[left]) {
      return left;
    } else if (array[mid] > array[right]) {
      return right;
    } else {
      return mid;
    }
  } else {
    if (array[mid] < array[right]) {
      return right;
    } else if (array[mid] > array[left]) {
      return left;
    } else {
      return mid;
    }
  }
}

// 左右指標法
function partition(array, left, right) {
  const mid = getMid(array, left, right);
  swap(array, mid, right); // 把 pivot 移到最右邊
  const pivot = array[right];
  let pivotIndex = right;
  while (left < right) {
    while (left < right && array[left] <= pivot) {
      left++;
    }
    while (left < right && array[right] >= pivot) {
      right--;
    }
    swap(array, left, right);
  }
  swap(array, left, pivotIndex);
  return left;
}

// 挖坑法（前後指標法同理）
function partition(array, left, right) {
  const mid = getMid(array, left, right);
  swap(array, mid, right); // 把 pivot 移到最右邊
  const pivot = array[right];
  while (left < right) {
    while (left < right && array[left] <= pivot) {
      left++;
    }
    array[right] = array[left];
    while (left < right && array[right] >= pivot) {
      right--;
    }
    array[left] = array[right];
  }
  array[right] = pivot;
  return left;
}
```

## 非遞迴實作方式

遞迴主要是在劃分子區間，如果要用非遞迴的方式實作 quick sort，可以使用一個 stack 來存放區間即可。

要將遞迴程式改造成非遞迴程式，首先想到的就是使用 stack，因為遞迴的本質就是一個 push 元素到 stack 的過程。下面是一個使用 stack 的非遞迴實作方式：

```js
function quickSortStack(array, start, end) {
  const stack = [];
  stack.push(end);
  stack.push(start);
  while (stack.length) {
    const left = stack.pop();
    const right = stack.pop();
    const index = partition(array, left, right);
    if (left < index - 1) {
      stack.push(index - 1);
      stack.push(left);
    }
    if (right > index + 1) {
      stack.push(right);
      stack.push(index + 1);
    }
  }
}
```

## 應用 - TopK 問題

給你一個由整數組成的陣列，請找出其中最小的 K 個數。例如，給你的陣列是 `[11, 9, 6, 17, 0, 1, 2, 18, 3, 4, 8, 5]` 和 `K = 4`，那麼最小的 4 個數是 `[0, 1, 2, 3]`。

思路：我們知道 partition 函式會回傳一個 pivot，pivot 左邊的元素都比 pivot 小，右邊的元素都比 pivot 大。我們可以一直去呼叫 partition 函式，直到 pivot 的位置剛好是 K - 1，那麼 pivot 左邊的元素就是最小的 K 個數。

我們打開 `getTopK.js` 來實作看看：

```js
function getTopK(array, k) {
  if (array.length >= k) {
    let low = 0;
    let high = array.length - 1;
    let pivot = partition(array, low, high);
    // 不斷調整分治的範圍，直到 pivot 的 index 等於 k - 1
    while (pivot !== k - 1) {
      // 大了，往左(前)邊調整
      if (pivot > k - 1) {
        high = pivot - 1;
        pivot = partition(array, low, high);
      }
      // 小了，往右(後)邊調整
      if (pivot < k - 1) {
        low = pivot + 1;
        pivot = partition(array, low, high);
      }
    }

    let result = [];
    for (let i = 0; i < k; i++) {
      result[i] = array[i];
    }
    return result;
  }
}
```

## 複雜度（Complexity）

| Name           |    Average    |     Best      |  Worst   |    Space    |  Method  | Stable |
| -------------- | :-----------: | :-----------: | :------: | :---------: | :------: | :----: |
| **Quick sort** | $O(n \log n)$ | $O(n \log n)$ | $O(n^2)$ | $O(\log n)$ | In-place |   No   |

## 參考資料

- [《JavaScript 算法：基本原理與代碼實現》](https://www.tenlong.com.tw/products/9787115596154?list_name=r-zh_cn)
