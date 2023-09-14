# 基數排序法 Radix Sort

基數排序法（Radix Sort）是一種非比較性質的整數排序演算法。其基本原理是，將整數的每個位數上的值進行分組，在分組的過程中對於不足位的數值補零。

Radix Sort 按照對位數分組的順序的不同，可以分為 LSD（Least Significant Digit）和 MSD（Most Significant Digit）兩種。
LSD Radix Sort 是按照從低位數到高位數的順序進行分組，而 MSD Radix Sort 則是按照從高位數到低位數的順序進行分組。兩種方式不僅僅是對位數分組的順序不同，其實作原理也不同。

## LSD Radix Sort

在 LSD Radix Sort 中，序列中每個整數的每一位數都可以看成一個桶子，而該位數上的數字就可以認為是這個桶子的鍵值。例如下面的陣列：

```txt
[ 170, 45, 75, 90, 802, 2, 24, 66 ]
```

首先，我們要確認最大值，因為最大值的位數最多。
然後，建立 10 個桶子，亦即 10 個陣列。
接著遍歷所有元素，取其個位數，個位數是什麼就放進對應編號的陣列，例如 1 放進 1 號桶，將上面的陣列進行遍歷後的結果為：

```txt
0 號 bucket: [ 170, 90 ]
1 號 bucket: []
2 號 bucket: [ 802, 2 ]
3 號 bucket: []
4 號 bucket: [ 24 ]
5 號 bucket: [ 45, 75 ]
6 號 bucket: [ 66 ]
7 號 bucket: []
8 號 bucket: []
9 號 bucket: []
```

然後依次將元素從桶子中取出，覆蓋原始陣列或是放到一個新陣列，我們把經過第一次排序的陣列叫 `sorted`：

```txt
sorted = [ 170, 90, 802, 2, 24, 45, 75, 66 ]
```

再一次遍歷 `sorted` 陣列的元素，這次取十位數的值。這時要注意，2 不存在十位數，所以預設為 0：

```txt
0 號 bucket: [ 2, 802 ]
1 號 bucket: []
2 號 bucket: [ 24 ]
3 號 bucket: []
4 號 bucket: [ 45 ]
5 號 bucket: []
6 號 bucket: [ 66 ]
7 號 bucket: [ 170, 75 ]
8 號 bucket: []
9 號 bucket: [ 90 ]
```

再全部取出：

```txt
sorted = [ 2, 802, 24, 45, 66, 170, 75, 90 ]
```

開始百位數的入桶操作，沒有百位就預設為 0：

```txt
0 號 bucket: [ 2, 24, 45, 66, 75, 90 ]
1 號 bucket: [ 170 ]
2 - 7 號 bucket: []
8 號 bucket: [ 802 ]
9 號 bucket: []
```

全部取出：

```txt
sorted = [ 2, 24, 45, 66, 75, 90, 170, 802 ]
```

沒有千位數，排序完成，回傳 `sorted`。具體執行過程如下圖所示：

![LSD Radix Sort](https://github.com/SheepNDW/data-structures-and-algorithms/raw/main/src/algorithms/sorting/radix-sort/images/lsd-radix-sort.gif)

程式碼實作：

```js
function radixSort(array) {
  const max = Math.max(...array);
  const times = getLoopTimes(max);
  const len = array.length;
  const buckets = [...Array(10)].map(() => []);

  for (let radix = 0; radix < times; radix++) {
    // 個位數、十位數、百位數...
    lsdRadixSort(array, buckets, len, radix);
  }

  return array;
}
/** 根據某個位數上的值得到桶子的編號 */
function getBucketNumber(num, i) {
  return Math.floor((num / Math.pow(10, i - 1)) % 10);
}
/** 獲取數字的位數 */
function getLoopTimes(num) {
  let digits = 0;
  while (num) {
    digits++;
    num = Math.floor(num / 10);
  }
  return digits;
}
function lsdRadixSort(array, buckets, len, radix) {
  // 將數字放入桶子中
  for (let i = 0; i < len; i++) {
    const el = array[i];
    const bucketNum = getBucketNumber(el, radix);
    buckets[bucketNum].push(el);
  }
  let index = 0;
  // 將桶子中的數字取出來，重寫原陣列
  for (let i = 0; i < 10; i++) {
    const bucket = buckets[i];
    for (let j = 0; j < bucket.length; j++) {
      array[index++] = bucket[j];
    }
    bucket.length = 0;
  }
}
```

## MSD Radix Sort

接下來我們來看看 MSD Radix Sort。最開始也是遍歷所有元素，取最大值，得到最大的位數，建立 10 個桶子。這次從百位數取起，不足三位的數字補 0：

```txt
0 號 bucket: [ 45, 75, 90, 2, 24, 66 ]
1 號 bucket: [ 107 ]
2 - 7 號 bucket: []
8 號 bucket: [ 802 ]
9 號 bucket: []
```

接下來就與 LSD 不一樣了。我們要對每個長度大於 1 的桶子進行內部排序，內部排序也是用 Radix Sort。因此我們需要建立另外 10 個桶子，對 0 號桶子進行入桶操作，這時比原來少一位，也就是十位數：

```txt
0 號 bucket: [ 2 ]
1 號 bucket: []
2 號 bucket: [ 24 ]
3 號 bucket: []
4 號 bucket: [ 45 ]
5 號 bucket: []
6 號 bucket: [ 66 ]
7 號 bucket: [ 75 ]
8 號 bucket: []
9 號 bucket: [ 90 ]
```

然後繼續遞迴上一步，這裡因為每個桶子長度都沒有超過 1，所以可以開始取出收集的工作：

```txt
0 號 bucket: [ 2, 24, 45, 66, 75, 90 ]
1 號 bucket: [ 107 ]
2 - 7 號 bucket: []
8 號 bucket: [ 802 ]
9 號 bucket: []
```

把這個步驟應用到後面的其他桶子就可以完成排序了。

實作程式碼如下：

```js
function radixSort2(array) {
  const max = Math.max(...array);
  const times = getLoopTimes(max);
  const len = array.length;
  msdRadixSort(array, len, times);
  return array;
}

function msdRadixSort(array, len, radix) {
  const buckets = [[], [], [], [], [], [], [], [], [], []];
  // 入桶
  for (let i = 0; i < len; i++) {
    const el = array[i];
    const index = getBucketNumber(el, radix);
    buckets[index].push(el);
  }
  // 遞迴每個子桶
  for (let i = 0; i < 10; i++) {
    const bucket = buckets[i];
    if (bucket.length > 1 && radix > 1) {
      msdRadixSort(bucket, bucket.length, radix - 1);
    }
  }
  let k = 0;
  // 重寫原陣列
  for (let i = 0; i < 10; i++) {
    const bucket = buckets[i];
    bucket.forEach((el) => (array[k++] = el));
    bucket.length = 0;
  }
}
```

## 字串使用 Radix Sort 實作字典排序

Radix Sort 只要稍作變換就可以應用於字串的字典排序（lexicographic order）中。例如對都是小寫字母的字串陣列進行排序。

小寫字母一共 26 個，考慮到長度不一樣的情況，我們需要對短的字串進行填充，這時可以補上空字串。然後根據字母與數字的對應關係，建立 27 個桶子，空字串對應 0，a 對應 1，b 對應 2，以此類推。而字典排序的規則是從左到右，所以會需要用到 MSD Radix Sort。

程式碼實作如下：

```js
const character = {};
'abcdefghijklmnopqrstuvwxyz'.split('').forEach((char, index) => {
  character[char] = index + 1;
});
function toNum(c, length) {
  const obj = {};
  obj.c = c;
  obj.arr = [];
  for (let i = 0; i < length; i++) {
    obj.arr[i] = character[c[i]] || 0;
  }
  return obj;
}
function getBucketNumber(obj, i) {
  return obj.arr[i];
}

function lexSort(array) {
  const len = array.length;
  let loopTimes = 0;

  // 求出最長的字串，並得到它的長度，那也是最高位數
  for (let i = 0; i < len; i++) {
    const el = array[i];
    const charLength = el.length;
    if (charLength > loopTimes) {
      loopTimes = charLength;
    }
  }

  // 將字串轉成數字陣列
  const nums = array.map((el) => toNum(el, loopTimes));
  // 開始多關鍵字排序
  msdRadixSort(nums, len, 0, loopTimes);
  // 變回字串
  for (let i = 0; i < len; i++) {
    array[i] = nums[i].c;
  }
  return array;
}

function msdRadixSort(array, len, radix, radixs) {
  const buckets = [];
  for (let i = 0; i <= 26; i++) {
    buckets[i] = [];
  }
  // 入桶
  for (let i = 0; i < len; i++) {
    const el = array[i];
    const index = getBucketNumber(el, radix);
    buckets[index].push(el);
  }
  // 遞迴子桶
  for (let i = 0; i <= 26; i++) {
    const bucket = buckets[i];
    if (bucket.length > 1 && radix < radixs) {
      msdRadixSort(bucket, bucket.length, radix + 1, radixs);
    }
  }
  let k = 0;
  // 重寫原陣列
  for (let i = 0; i <= 26; i++) {
    const bucket = buckets[i];
    for (let j = 0; j < bucket.length; j++) {
      array[k++] = bucket[j];
    }
    bucket.length = 0;
  }
}
```

## 複雜度（Complexity）

| Name           | Average  |   Best   |  Worst   |  Space   |  Method   | Stable |
| -------------- | :------: | :------: | :------: | :------: | :-------: | :----: |
| **Radix sort** | $O(n*k)$ | $O(n*k)$ | $O(n*k)$ | $O(n+k)$ | Out-place |  Yes   |
> k 為桶子數量

## 參考資料

- [《JavaScript 算法：基本原理與代碼實現》](https://www.tenlong.com.tw/products/9787115596154?list_name=r-zh_cn)
- [visualgo.net](https://visualgo.net/en/sorting)
