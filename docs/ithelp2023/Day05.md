# 選擇排序法與插入排序法

接續前一天，讓我們繼續來看兩個平均複雜度為 $O(n^2)$ 的排序法，分別是選擇排序法與插入排序法。

## 選擇排序法（Selection Sort）

選擇排序的行為與氣泡排序相反，它每一次遍歷都是找到最小的數然後放到前面，第一次遍歷放在第一個位置，第二次遍歷放在第二個位置...依此類推。因此我們需要一個變數來記錄目前遍歷的最小值索引。

| 步驟   | 陣列狀態（刪除線代表已排序）          | 註解                                          |
| ------ | ------------------------------------- | --------------------------------------------- |
| 初始   | [ 3, 6, 4, 2, 11, 10, 5 ]             | 初始狀態                                      |
| Step 1 | [ **2**, 6, 4, **3**, 11, 10, 5 ]     | 2 是最小值，與第一個元素 3 交換               |
| Step 2 | [ ~~2~~, **3**, 4, **6**, 11, 10, 5 ] | 在剩餘元素中 3 是最小值，與第二個元素 6 交換  |
| Step 3 | [ ~~2, 3~~, **4**, 6, 11, 10, 5 ]     | 在剩餘元素中 4 是最小值，已在正確位置         |
| Step 4 | [ ~~2, 3, 4~~, **5**, 11, 10, **6** ] | 在剩餘元素中 5 是最小值，與第四個元素 6 交換  |
| Step 5 | [ ~~2, 3, 4, 5~~, **6**, 10, **11** ] | 在剩餘元素中 6 是最小值，與第五個元素 11 交換 |
| Step 6 | [ ~~2, 3, 4, 5, 6~~, **10**, 11 ]     | 在剩餘元素中 10 是最小值，已在正確位置        |
| Step 7 | [ ~~2, 3, 4, 5, 6, 10~~, **11** ]     | 在剩餘元素中 11 是最小值，已在正確位置        |
| 最終   | [ 2, 3, 4, 5, 6, 10, 11 ]             | 排序完成                                      |

這是 wiki 上的 gif 圖，可以更清楚的看到過程：

![Selection Sort](https://upload.wikimedia.org/wikipedia/commons/9/94/Selection-Sort-Animation.gif)

Selection Sort 的具體實作程式碼如下：

```js
function selectSort(array) {
  let n = array.length;
  for (let i = 0; i < n; i++) {
    let minIndex = i; // 保存目前最小值的索引
    for (let j = i + 1; j < n; j++) { // 每次只從 i 的下一個開始比較
      if (array[j] < array[minIndex]) {
        minIndex = j; // 更新最小值索引
      }
    }
    if (i !== minIndex) {
      swap(array, i, minIndex);
    }
  }
}
```

我們可以發現，氣泡排序跟選擇排序都會將目前陣列劃分成兩個部分，一個是已排序的部分，一個是未排序的部分。氣泡排序的以排序部分在陣列的尾部，而選擇排序的已排序部分在陣列的頭部。

再來嘗試從兩端同時排序會如何：

```js
function selectSort2(array) {
  let left = 0;
  let right = array.length - 1;
  let min = left; // 保存目前最小值的索引
  let max = left; // 保存目前最大值的索引

  while (left <= right) {
    min = left;
    max = left;
    // 這裡只能用 <=, 因為要取 array[right] 的值
    for (let i = left; i <= right; i++) {
      if (array[i] < array[min]) {
        min = i;
      }
      if (array[i] > array[max]) {
        max = i;
      }
    }
    swap(array, left, min);
    if (left === max) {
      max = min;
    }
    swap(array, right, max);
    left++;
    right--;
  }
}
```

用測試來看一下效能，會發現並沒有提升多少，因此我們只記住 selection sort 的原始版本就好了。將這兩種寫法與 bubble sort 去跑耗時測試：

```bash
========
部分有序的情況 bubbleSort1 91
完全亂序的情況 bubbleSort1 394
========
部分有序的情況 bubbleSort2 20
完全亂序的情況 bubbleSort2 390
========
部分有序的情況 bubbleSort3 7
完全亂序的情況 bubbleSort3 335
========
部分有序的情況 selectSort 47
完全亂序的情況 selectSort 46
========
部分有序的情況 selectSort2 37
完全亂序的情況 selectSort2 35
```

### 複雜度（Complexity）

| Name               | Average  |   Best   |  Worst   | Space  |  Method  | Stable |
| ------------------ | :------: | :------: | :------: | :----: | :------: | :----: |
| **Selection sort** | $O(n^2)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | In-place |   No   |

## 插入排序法（Insertion Sort）

插入排序法（Insertion Sort），它類似選擇排序，也是將陣列分成兩個區域，左邊第 1 個數為有序區域，右邊所有數在無序區域。不同的是，插入排序每次跑迴圈時不是找最小的數，而是將無序區域的第 1 個數插入到有序區域的適當位置。這樣有序區域不斷增加，無序區域不斷減少，直到無序區域為空，排序完成。

它和我們在打撲克牌時，將手上的牌從小到大排列的方式非常相似，我們會將手上的牌分成兩堆，一堆是已經排好序的牌，另一堆是還沒排好序的牌。我們會從還沒排好序的牌中拿出一張牌，然後插入到已經排好序的牌中的適當位置。由於突出“插入”這個動作，因此稱為插入排序。

“插入”這個行為我們需要在有序區域找到要插入的位置，然後將比它大的數往後移動一格，挪出一個“坑位”，然後將無序區域的第 1 個元素放到坑位上。我們可以參考 wiki 的這張 gif：

![Insertion Sort](https://upload.wikimedia.org/wikipedia/commons/0/0f/Insertion-sort-example-300px.gif)

Insertion sort 實作起來有點複雜，需要寫兩個內部的迴圈：

```js
function insertionSort(array) {
  let n = array.length;
  for (let i = 1; i < n; i++) { // #1 搜尋：在有序區域找到目標元素
    let target = array[i];
    let j;
    for (j = i - 1; j >= 0; j--) {
      if (target > array[j]) {
        break;
      }
    }
    if (j !== i - 1) {
      // 將比 target 大的元素往後移動一位
      for (let k = i - 1; k > j; k--) { // #2 挪坑：挪到位置，留出坑位  
        array[k + 1] = array[k];
      }
      array[j + 1] = target;
    }
  }
}
```

這樣程式碼太長了，不夠清晰，我們可以把搜尋跟挪坑這兩步合併，即每次 `array[i]` 先和前一個元素 `array[i - 1]` 比較，如果 `array[i] >= array[i - 1]`，說明 `array[0...i]` 也是有序的，不需要再做任何事情；否則就令 `j = i - 1`，`target = array[i]`。然後一邊將 `array[i]` 向後移動，一邊向前搜尋，當有 `array[j] < array[i]` 時停止，並將 `target` 放到 `array[j + 1]` 的位置。

```js
function insertionSort(array) {
  const n = array.length;
  for (let i = 1; i < n; i++) {
    const target = array[i];
    let j;
    // 合併兩個內部迴圈
    for (j = i - 1; j >= 0 && array[j] > target; j--) {
      array[j + 1] = array[j]; // 挪出空位
    }
    array[j + 1] = target; // 插入目標值
  }
}
```

接著再將 for 迴圈改成 while 迴圈：

```js
function insertionSort2(array) {
  const n = array.length;
  for (let i = 1; i < n; i++) {
    const target = array[i];
    let j = i - 1;
    while (j >= 0 && array[j] > target) {
      array[j + 1] = array[j]; // 前面覆蓋後面
      j--;
    }
    array[j + 1] = target; // 插入目標值
  }
}
```

### 複雜度（Complexity）

| Name               | Average  |  Best  |  Worst   | Space  |  Method  | Stable |
| ------------------ | :------: | :----: | :------: | :----: | :------: | :----: |
| **Insertion sort** | $O(n^2)$ | $O(n)$ | $O(n^2)$ | $O(1)$ | In-place |  Yes   |

Insertion sort 的時間複雜度也是 $O(n^2)$，但經過測試後發現，在大多數情況下，Insertion sort 的效率比 Bubble sort 和 Selection sort 還要高，這是因為它的平均複雜度為 $O(n^2/4)$，最好的情況能達到 $O(n)$。我們把 Insertion sort 也加入耗時測試一起比較，得出結果為：

```bash
========
部分有序的情況 bubbleSort3 6
完全亂序的情況 bubbleSort3 330
========
部分有序的情況 selectSort 46
完全亂序的情況 selectSort 44
========
部分有序的情況 insertionSort 1
完全亂序的情況 insertionSort 20
========
部分有序的情況 insertionSort2 1
完全亂序的情況 insertionSort2 19
```

## 參考資料

- [《JavaScript 算法：基本原理與代碼實現》](https://www.tenlong.com.tw/products/9787115596154?list_name=r-zh_cn)

