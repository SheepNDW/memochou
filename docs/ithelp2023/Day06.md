---
outline: deep
---

# 雙端佇列 Deque

雙端佇列（Double-ended Queue, Deque）是一種允許在前端和後端進行插入和刪除操作的特殊佇列。

以現實生活中來舉例的話，就像是排隊買電影票，先到的人先買票，後到的人後買票，如果有一個剛買完票的人只是還需要確認一些事情，那麼他可以直接插回隊伍的前面。另一方面在隊伍尾巴的人如果趕時間，他可以直接離開隊伍。

在電腦科學中，雙端佇列的一個常見應用是儲存一系列的撤銷操作，例如：在文字編輯器中，我們可以在每次輸入文字時將其儲存在雙端佇列中，當我們需要撤銷（例如 ctrl + z 還原）時，只需要從佇列的後端刪除最後一個元素即可（就像是 Stack），而當儲存的撤銷操作超過一定的數量時，我們可以從佇列的前端刪除最早的元素，這樣就可以限制撤銷操作的數量。也就是說 Deque 同時具有 Stack 和 Queue 的特性。

## Deque 的常用方法

和之前一樣我們會先定義一個 Deque 類別來實作，既然它是一個特殊的 Queue 那麼我們可以直接沿用部分程式碼：

```js
class Deque {
  #items = {};
  #headCount = 0;
  #count = 0;

  isEmpty() {
    return this.size() === 0;
  }

  size() {
    return this.#count - this.#headCount;
  }

  clear() {
    this.#items = {};
    this.#headCount = 0;
    this.#count = 0;
  }

  toString() {
    let str = '';

    for (let i = this.#headCount; i < this.#count; i++) {
      str += this.#items[i] + (i < this.#count - 1 ? ',' : '');
    }

    return str;
  }
}
```

我們會有下面幾個方法：

- **addFront(data)**：在佇列的前端新增一個元素。
- **addBack(data)**：在佇列的後端新增一個元素（和原本的 `enqueue` 方法一樣）。
- **removeFront()**：刪除佇列的前端元素（和原本的 `dequeue` 方法一樣）。
- **removeBack()**：刪除佇列的後端元素（跟 Stack 的 `pop` 方法一樣）。
- **peekFront()**：回傳佇列的前端元素（和原本的 `peek` 方法一樣）。
- **peekBack()**：回傳佇列的後端元素（跟 Stack 的 `peek` 方法一樣）。

所以我們的 Deque 目前會長這樣：

```js
class Deque {
  #items = {};
  #headCount = 0;
  #count = 0;

  addBack(data) {
    this.#items[this.#count] = data;
    this.#count++;
  }

  removeFront() {
    if (this.isEmpty()) return;
    const head = this.#items[this.#headCount];
    delete this.#items[this.#headCount];
    this.#headCount++;
    return head;
  }

  removeBack() {
    if (this.isEmpty()) return;
    this.#count--;
    const tail = this.#items[this.#count];
    delete this.#items[this.#count];
    return tail;
  }

  peekFront() {
    return this.#items[this.#headCount];
  }

  peekBack() {
    if (this.isEmpty()) return;
    return this.#items[this.#count - 1];
  }

  isEmpty() {}
  size() {}
  clear() {}
  toString() {}
}
```

### `addFront` 方法

現在讓我們來看 `addFront` 要怎麼來實作：

```js
addFront(data) {
  // #1 if empty
  if (this.isEmpty()) {
    this.addBack(data);
  } else {
    // #2 headCount > 0
    if (this.#headCount > 0) {
      this.#headCount--;
      this.#items[this.#headCount] = data;
    } else {
      // #3 headCount === 0
      for (let i = this.#count; i > 0; i--) {
        this.#items[i] = this.#items[i - 1];
      }

      this.#items[0] = data;
      this.#count++;
    }
  }
}
```

有三個情境需要考慮：

第一個是如果目前佇列是空的，那麼我們就可以直接呼叫 `addBack` 方法。因為 `addBack` 本身已經處理了 `count` 的增加，所以我們不需要再處理。

第二個情境是如果 `headCount` 大於 0，這表示已經有元素被從前端刪除過，所以 `headCount` 會大於 0，這時候我們只需要將 `headCount` 減 1，並且在 `headCount` 的位置新增元素即可。假設目前的佇列內部是：

```js
items = {
  1: 15,
  2: 32
};
count = 3;
headCount = 1;
```

如果我們要插一個 `30` 到前端，那麼就會進到這個情境，我們會將 `headCount` 減 1 變成 0，並且在 key 為 0 的位置填上 `30`。

第三個情境是如果 `headCount` 等於 0，我們可以使用負數的 key 來新增元素，然後去更新用來計算佇列長度的邏輯，讓它能夠計算包含負數 key 時的長度。這樣也能夠保持在新增元素時的時間複雜度為 O(1)。但是為了方便理解，我們這邊使用較為簡單的方式來實作，就是把它想像成是陣列，要在第一個位置新增元素時，我們需要將所有元素往後移動一個位置，將第一個位置給空出來。所以我們需要從最後一個元素開始迭代，將 `i - 1` 賦值給 `i`，最後再將 `0` 的位置填上新的元素。

## Deque 的應用

### Palindrome Checker

回文（Palindrome）是一種正向和反向讀取都相同的單詞、句子或數字的序列，例如：`racecar`、`level`。

題目需求是給你一個字串要你判斷它是否為回文，另外如果字元中間有空白的話，例如：`never odd or even`，我們可以先將空白移除後再判斷是否為回文。

有很多種方法可以判斷一個字串是否為回文，例如最簡單的方式就是將字串反轉後和原本的字串比較，如果相同就表示是回文；也可以使用 Stack 來判斷，不過如果要用資料結構來解的話，直接使用剛才封裝好的 Deque 會是最簡單的方法：

```js
function palindromeChecker(str) {
  // 移除字串中的空白
  const lowerStr = str.toLocaleLowerCase().split(' ').join('');

  const deque = new Deque();

  for (let i = 0; i < lowerStr.length; i++) {
    deque.addBack(lowerStr[i]);
  }

  while (deque.size() > 1) {
    if (deque.removeFront() !== deque.removeBack()) {
      return false;
    }
  }

  return true;
}

console.log('level', palindromeChecker('level'));
console.log('Step on no pets', palindromeChecker('Step on no pets'));
```

首先將字串進行處理，將所有字元轉成小寫並且移除空白，接著將字串中的每個字元都加入到 Deque 中，最後使用迴圈來判斷 Deque 中的第一個元素和最後一個元素是否相同，如果不相同就表示不是回文，如果相同就繼續迴圈，直到 Deque 中只剩下一個元素或是沒有元素，這時候就表示是回文。

## 總結

我們在實作 `addFront` 方法的第三個情境時模擬了陣列的 `shift` 方法的行為，所以新增元素到前端的時間複雜度會變成 O(n)，這也給了我們一個提示，陣列固然非常方便，但是在刪除或新增時都會有額外的成本，那麼有沒有一種資料結構可以在刪除或新增時都能夠保持 O(1) 的時間複雜度呢？答案是有的，那就是 Linked List，我會在明天的文章去介紹它。

## 參考資料

- [《Learning JavaScript Data Structures and Algorithms, 3/e》](https://www.tenlong.com.tw/products/9781788623872?list_name=trs-f)
