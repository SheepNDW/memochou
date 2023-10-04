---
outline: deep
---

# 希爾排序法 Shell Sort

> 本文同步發布於 2023 iThome 鐵人賽：[那些前端不用會，但是可以會的資料結構與演算法](https://ithelp.ithome.com.tw/users/20152758/ironman/6714) 系列文中。

希爾排序法（Shell Sort）是 Donald Shell 於 1959 年提出的一種排序演算法，是插入排序法（Insertion Sort）的一種改良版本，也稱為縮小增量排序法（Diminishing Increment Sort），同時它也是第一批突破 $O(n^2)$ 的排序演算法之一。

這個演算法的基本思想是：將陣列分割成多個子陣列，每個子陣列是由索引值相差某個 gap（間距或間隔）的元素所組成，並對每個子陣列進行插入排序，然後減少 gap 的值，重新分割大陣列為新的子陣列，重複進行插入排序，直到 gap 為 1。

為什麼這麼做呢？因為在插入排序中有個缺點，如果我們要移動元素，它們相距越遠，需要移動的次數就越多，希爾排序的分組法就是為了減少移動次數而發明的。

我們以 4 為 gap，對陣列進行分組，如下所示，要注意的是，我們只是邏輯上進行了分組，並沒有真的將陣列分成多個子陣列。

| 原始陣列 | 5   | 7   | 8   | 3   | 1   | 2   | 4   | 6   |
| -------- | --- | --- | --- | --- | --- | --- | --- | --- |
| 第一組   | 5   | -   | -   | -   | 1   | -   | -   | -   |
| 第二組   | -   | 7   | -   | -   | -   | 2   | -   | -   |
| 第三組   | -   | -   | 8   | -   | -   | -   | 4   | -   |
| 第四組   | -   | -   | -   | 3   | -   | -   | -   | 6   |

然後對子陣列進行插入排序，這會讓原陣列部分有序，如下：

| 原始陣列 | 5   | 7   | 8   | 3   | 1   | 2   | 4   | 6   |
| -------- | --- | --- | --- | --- | --- | --- | --- | --- |
| 第一組   | 1   | -   | -   | -   | 5   | -   | -   | -   |
| 第二組   | -   | 2   | -   | -   | -   | 7   | -   | -   |
| 第三組   | -   | -   | 4   | -   | -   | -   | 8   | -   |
| 第四組   | -   | -   | -   | 3   | -   | -   | -   | 6   |
| 排序之後 | 1   | 2   | 4   | 3   | 5   | 7   | 8   | 6   |

然後我們縮減這個 gap，這個 gap 是基於某種數列算出來的，只會不斷減少。這時我們選擇 2 為 gap，原陣列便在邏輯上分成了兩個子陣列，如下：

| 原始陣列 | 1   | 2   | 4   | 3   | 5   | 7   | 8   | 6   |
| -------- | --- | --- | --- | --- | --- | --- | --- | --- |
| 第一組   | 1   | -   | 4   | -   | 5   | -   | 8   | -   |
| 第二組   | -   | 2   | -   | 3   | -   | 7   | -   | 6   |

然後對子陣列進行插入排序，得到下面的結果：

| 原始陣列 | 1   | 2   | 4   | 3   | 5   | 7   | 8   | 6   |
| -------- | --- | --- | --- | --- | --- | --- | --- | --- |
| 第一組   | 1   | -   | 4   | -   | 5   | -   | 8   | -   |
| 第二組   | -   | 2   | -   | 3   | -   | 6   | -   | 7   |
| 排序之後 | 1   | 2   | 4   | 3   | 5   | 6   | 8   | 7   |

最後我們將 gap 設為 1，這時陣列就變成了一個子陣列，也就是它本身。此時整個陣列已經接近有序了，可以發現希爾排序的效率非常高。

### 間距序列 Gap Sequence

我們每趟用到的 gap，共同組成一個陣列，稱為間距序列（Gap Sequence）。常用的 gap sequence 由 Knuth 提出，透過遞迴表達式 $h = 3 * h + 1$ 計算出來，其中 h 初始化為 1。這就是說，這個數列會是：1, 4, 13, 40,...等等。當數值超過陣列長度時，就停止這個遞迴。對於一個含有 1000 個元素的陣列，我們使用數列的前 6 個數值就可以了。

### 實作

```js
function shellSort(array) {
  // 產生 gap sequence 3x+1 [1, 4, 13, 40, 121, 364,...]
  const n = array.length;
  const gaps = [1];
  let gap = 1;
  while (true) {
    gap = 3 * gap + 1;
    if (gap > n) break; // gap 不能大於 array 長度
    gaps.push(gap);
  }

  while ((gap = gaps.pop())) {
    // 對每個子陣列進行 insertion sort
    for (let g = 0; g < gap; g++) {
      for (let i = g + gap; i < n; i += gap) {
        let target = array[i]; // 從無序區取元素
        if (target < array[i - gap]) {
          // 無序區比有序區小
          let j = i;
          while (j > 0 && array[j - gap] > target) {
            // 有序區元素往後移
            array[j] = array[j - gap];
            j -= gap; // 不是 -1 而是 -gap
          }
          array[j] = target; // 插入元素
        }
      }
    }
  }
}
```

shell sort 沒有規定要用哪種 gap 公式，不同的公式，其時間複雜度也不同。因此 shell sort 是一種不穩定的排序演算法。在 Shell 的原稿中，他建議初始的間距為 $n/2$，簡單地把每一次排序分成兩半。因此對於一個 `n=100` 的陣列，逐漸減少的間距序列會是：50, 25, 12, 6, 3, 1。具體實作如下：

```js
function shellSort2(array) {
  // shell sequence [1, 2, 4, 9, 19, 39, 78, 156, 312, 625, 1250, 2500, 5000]
  const n = array.length;
  const gaps = [];
  let gap = n;
  while (gap != 1) {
    gap = Math.floor(gap / 2);
    gaps.unshift(gap);
  }

  while ((gap = gaps.pop())) {
    // 對每個子陣列進行 insertion sort
  }
}
```

Shell Sort 的排序效率和 gap sequence 有直接關係，相關 gap sequence 如下：

1. Shell Sequence： $n/2, n/4, n/8, ..., 1$（重複除以 2）
2. Hibbard Sequence： $1, 3, 7, ..., 2^k-1$
3. Knuth Sequence： $1, 4, 13, ..., (3^k-1)/2$
4. Sedgewick Sequence： $1, 5, 19, 41, 109, ...$

目前最好的序列是 Sedgewick Sequence，它能讓 Shell Sort 的時間複雜度達到 $O(n^{4/3})$，快於 $O(n\log_2n)$ 的 heap sort，其計算公式：

```js
function getSedgewickSeq(n) {
  const array = [];
  let startup1 = 0;
  let startup2 = 2;
  for (let i = 0; i < n; i++) {
    if (i % 2 == 0) {
      array[i] = 9 * Math.pow(4, startup1) - 9 * Math.pow(2, startup1) + 1;
      startup1++;
    } else {
      array[i] = Math.pow(4, startup2) - 3 * Math.pow(2, startup2) + 1;
      startup2++;
    }
    if (array[i] >= n) {
      break;
    }
  }
  return array;
}

function shellSort3(array) {
  const n = array.length;
  const gaps = getSedgewickSeq(n);
  let gap = 1
  // 略
}
```

最後來看看幾種排序的效能比較：

```bash
========
部分有序的情況 selectSort2 37
完全亂序的情況 selectSort2 33
========
部分有序的情況 insertionSort2 2
完全亂序的情況 insertionSort2 19
========
部分有序的情況 shellSort 4
完全亂序的情況 shellSort 3
========
部分有序的情況 shellSort2 4
完全亂序的情況 shellSort2 3
========
部分有序的情況 shellSort3 4
完全亂序的情況 shellSort3 2
```

## 複雜度 Complexity

時間複雜度高度依賴於使用的 gap sequence

| Name           |         Average         |     Best     |      Worst       | Space  |  Method  | Stable |
| :------------- | :---------------------: | :----------: | :--------------: | :----: | :------: | :----: |
| **Shell sort** | depends on gap sequence | $O(n\log n)$ | $O(n(\log n)^2)$ | $O(1)$ | In-place |   No   |

## 參考資料

- [《JavaScript 算法：基本原理與代碼實現》](https://www.tenlong.com.tw/products/9787115596154?list_name=r-zh_cn)
- [Tutorials Point](https://www.tutorialspoint.com/data_structures_algorithms/shell_sort_algorithm.htm)
