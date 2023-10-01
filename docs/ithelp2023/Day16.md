---
outline: deep
---

# 優先佇列 Priority Queue

> 本文同步發布於 2023 iThome 鐵人賽：[那些前端不用會，但是可以會的資料結構與演算法](https://ithelp.ithome.com.tw/users/20152758/ironman/6714) 系列文中。

首先我們來回憶一下佇列，普通的佇列是一種先進先出（FIFO）的資料結構，元素只能從佇列尾部加入，從佇列頭部取出。而優先佇列（Priority Queue）是一種特殊的佇列，它的元素是有優先級的，有最高優先級的元素會被最先取出，就像 VIP，就算他最晚來，也會被優先服務。

既然 VIP 需要最先得到服務，我們需要將優先級最高的元素在加入佇列時就調整到最前面，如果使用 linked list 或是普通陣列來實作，時間複雜度會是 $O(n)$；如果換成 max heap 或 min heap，每次加入和取出的時間複雜度都是 $O(\log n)$。我們在昨天已經學過如何構建 heap 和調整 heap，而想要實作一個 priority queue，還需要實作 heap 的移除與新增元素的方法。

![](https://hackmd.io/_uploads/Hy-d4aLg6.gif)

## 實作 Priority Queue

先來看一下 priority queue 的 API：

```js
class PriorityQueue {
  heap = [];

  push() {} // 新增元素，調整 heap

  pop() {} // 彈出最大元素，調整 heap

  peek() { // 回傳最大元素
    return this.heap[0];
  }

  size() {
    return this.heap.length;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  toString() {
    return this.heap.toString();
  }
}
```

困難的地方在新增與刪除元素兩個方法。我們先來看看新增元素，一般是將元素放到最後，然後讓它上浮到適當的位置。元素上浮是“孩子要去找父親”，父節點是基於 `parent = Math.floor((child - 1) / 2)` 計算出來的。我們現在要實作一個 max heap 的 priority queue，因此如果子節點比父節點大，就交換它們的位置，然後繼續上浮，直到無法交換為止。

### `push` & `pop` 實作

`push` 方法實作如下：

```js
push(el) {
  const array = this.heap;
  array.push(el);
  let child = array.length - 1;
  let parent = Math.floor((child - 1) / 2);

  while (array[child] > array[parent]) {
    swap(array, child, parent); // 讓大的元素往上浮
    child = parent;
    parent = Math.floor((child - 1) / 2);
  }
}
```

再來看刪除元素，我們只刪除優先級最高的，也就是第一個元素，當然也可以刪除指定的元素，只要找到目標元素後，就將它與最後一個元素交換。這時要保證新的第一個元素的優先級是最高的，又不能影響到最後一個，所以我們要從第一個元素開始下沉，當我們的元素碰到目標元素後就停止，最後把元素刪除。


`pop` 方法實作如下：

```js
pop(el) {
  const array = this.heap;
  let index = 0;
  for (let i = 0; i < array.length; i++) {
    if (array[i] === el) {
      index = i;
      break;
    }
  }

  const target = array[index];
  swap(array, index, array.length - 1);

  // 從父節點開始下沉 (陣列的右邊方向)
  let parent = 0;
  let child = parent * 2 + 1;
  while (true) {
    if (array[child] < array[child + 1] && array[child + 1] !== target) {
      child++;
    }

    if (array[parent] < array[child] && array[child] !== target) {
      swap(array, parent, child);
      parent = child;
      child = parent * 2 + 1; // 不斷向右
    } else {
      break;
    }
  }

  return array.pop();
}
```

我們可以試著執行一下下面的程式碼，可以發現 heap 值並不是完全按照順序排列的，它只保證第一個值是最大的：

```js
const pq = new PriorityQueue();

pq.push(1);
pq.push(3);
pq.push(20);
pq.push(5);

console.log(pq.toString()); // 20,5,3,1

pq.push(30);

console.log(pq.toString()); // 30,20,3,1,5

pq.push(25);

console.log(pq.toString()); // 30,20,25,1,5,3

pq.pop();

console.log(pq.toString()); // 25,20,3,1,5

pq.pop(3);

console.log(pq.toString()); // 25,20,5,1
```

透過 priority queue 我們可以很容易地解決前面的 TopK 問題，只要把陣列中的元素全部加入 priority queue，然後再從 priority queue 中 pop 出前 K 個元素即可。

### MinPriorityQueue 實作

最後再讓我們來實作一下以 min heap 為基礎的 priority queue，其實也非常簡單，只要在 pop 與 push 涉及元素比較的地方將大於和小於符號對調即可。具體程式碼如下：

```js
class MinPriorityQueue extends PriorityQueue {
  constructor() {
    super();
  }

  push(el) {
    const array = this.heap;
    array.push(el);
    let child = array.length - 1;
    let parent = Math.floor((child - 1) / 2);

    while (array[child] < array[parent]) {
      swap(array, child, parent); // 讓小的元素往上浮
      child = parent;
      parent = Math.floor((child - 1) / 2);
    }
  }

  pop(el) {
    const array = this.heap;
    let index = 0;
    for (let i = 0; i < array.length; i++) {
      if (array[i] === el) {
        index = i;
        break;
      }
    }

    const target = array[index];
    swap(array, index, array.length - 1);

    let parent = 0;
    let child = parent * 2 + 1;
    while (true) {
      if (array[child] > array[child + 1] && array[child + 1] !== target) {
        child++;
      }

      if (array[parent] > array[child] && array[child] !== target) {
        swap(array, parent, child);
        parent = child;
        child = parent * 2 + 1;
      } else {
        break;
      }
    }

    return array.pop();
  }
}
```

## 題目練習：Ugly Number

Ugly number 是一個質因數只包含 2, 3, 5 的正整數，並且我們將 1 當作第一個 ugly number。給你一個整數 `n`，請你求出第 `n` 個 ugly number。也就是要從符合條件的 ugly number 數列中如：1, 2, 3, 4, 5, 6, 8, 9, 10, 12...，找出第 `n` 個數字。

Example 1:

```txt
Input: n = 10
Output: 12
Explanation: 1, 2, 3, 4, 5, 6, 8, 9, 10, 12 is the sequence of the first 10 ugly numbers.
```

Example 2:

```txt
Input: n = 1
Output: 1
```

稍微分析一下後，我們觀察到除了第一個數字 1 以外，其他的數字都是乘以 2、3、5 得出的，在每次相乘得到的數中，移除被乘數後，找到最小的數，繼續乘以 2、3、5。也就是：

```txt
[2, 3, 5] => 彈出 2，然後乘以 2、3、5 得到 4, 6, 10 加入佇列
[3, 5, 4, 6, 10] => 彈出 3，乘以 2、3、5 加入佇列
[4, 5, 6, 10, 6, 9, 15] => priority queue 會將最小的浮上去，然後彈出 4 繼續同樣操作
```

我們可以看到會有重複的數字出現，我們可以利用 hash table 來去除重複的數字，並且使用 MinPriorityQueue 來確保每次取出的數字都是最小的。程式碼如下：

```js
function nthUglyNumber(n) {
  const hash = new Set();
  const queue = new MinPriorityQueue();
  queue.push(1);
  hash.add(1);

  const factors = [2, 3, 5];
  let result = 1;
  for (let i = 0; i < n; i++) {
    result = queue.pop();
    for (const factor of factors) {
      const next = result * factor;
      if (!hash.has(next)) {
        hash.add(next);
        queue.push(next);
      }
    }
  }

  return result;
}
```

## 總結

binary heap 是 priority queue 的實現方式之一，它有兩個特性：

1. 它是一棵完整二元樹，因此完整二元樹的特性也適用於它。
2. 每個節點都比其子節點大（或小）。

JavaScript 沒有內建 priority queue，因此需要自己封裝一個。

heap sort 是一種利用 heap 來實現的排序演算法，它的時間複雜度是 $O(n \log n)$，空間複雜度是 $O(1)$。

TopK 問題很適合使用 heap 來解決，建立 heap 的時間複雜度 $O(n)$，加入元素和取出元素的時間複雜度都是 $O(\log K)$。

## 參考資料

- [《JavaScript 算法：基本原理與代碼實現》](https://www.tenlong.com.tw/products/9787115596154?list_name=r-zh_cn)
