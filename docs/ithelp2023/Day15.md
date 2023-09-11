---
outline: deep
---

# 鏈結串列 Linked List (1)

JavaScript 並沒有內建 Linked List，我們可以想像成它是一個個連接起來的物件，每個物件都有一個 `next` 屬性指向下一個物件。從記憶體的角度來看，它是不連續分配的，每個物件都可以散落在記憶體的任何地方。

Linked list 也分成很多種，它本身是複合資料結構，最基本單位是節點（Node），每個節點都有兩個屬性，一個是資料（data），另一個是指向下一個節點的指標（pointer）。如下圖所示：

![linked-list](https://github.com/SheepNDW/data-structures-and-algorithms/raw/main/src/data-structures/linked-list/images/linked-list.png)

對於這個 Node，可以用下面的程式碼表示：

```js
class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}
```

為了方便使用，通常會為 Linked List 加上一些和陣列同樣功能的方法與屬性，用於增刪改查。

## 單向鏈結串列 Singly Linked List

Singly Linked List 是最簡單的一種 Linked List，特色是每兩個節點之間只有一個單向的連結。想像一群小朋友需要有序的入場，為了防止人員走散，後面的人都會拉著前面的人的衣服（next），依此構建了如下圖所示的一個 Singly Linked List：

![singly-linked-list](https://github.com/SheepNDW/data-structures-and-algorithms/raw/main/src/data-structures/linked-list/images/singly-linked-list.png)

Singly Linked List 通常包含如下操作：

- **head**：插入節點的起點。
- **insertAt(index, data)**：插入一個節點到指定位置。
- **removeAt(index)**：移除指定位置的節點。
- **findIndex(index)**：尋找一個節點。
- **forEach(cb)**：遍歷所有節點。
- **size**：回傳串列長度。
- **isEmpty**：判斷串列是否為空。
- **clear**：清空所有資料。

實作程式碼如下：

```js
class List {
  constructor() {
    this.head = null;
    this.length = 0;
  }

  size() {
    return this.length;
  }

  isEmpty() {
    return this.size() === 0;
  }

  clear() {
    this.head = null;
    this.length = 0;
  }

  forEach(cb) {
    let current = this.head;
    let index = 0;
    while (current) {
      cb(current.data, index++);
      current = current.next;
    }
  }

  findIndex(index) {
    let current = this.head;
    let i = 0;
    while (current) {
      if (index === i) {
        return current;
      }
      current = current.next;
      i++;
    }
    return null;
  }

  insertAt(index, data) {
    if (index >= 0 && index <= this.length) {
      const node = new Node(data);
      if (index === 0) {
        const current = this.head;
        node.next = current;
        this.head = node;
      } else {
        const prev = this.findIndex(index - 1);
        node.next = prev.next;
        prev.next = node;
      }
      this.length++;
    } else {
      throw `${index} 超過 list 長度 ${this.length}`;
    }
  }

  removeAt(index) {
    if (this.head && index >= 0 && index < this.length) {
      const prev = this.findIndex(index - 1);
      const current = this.findIndex(index);
      if (!prev) { // 前面沒有節點，代表要移除的是第一個
        this.head = current.next;
      } else {
        prev.next = current.next;
      }
      this.length--;
    } else {
      throw `${index} 超過 list 長度 ${this.length}`;
    }
  }
}

// 可以執行下面的程式碼在瀏覽器的 console 上測試
const list = new List();
list.insertAt(0, 111);
list.insertAt(1, 222);
list.insertAt(1, 333);
list.insertAt(3, 444);
list.forEach((el, i) => console.log(el, i));
try {
  list.insertAt(8, 333);
} catch (error) {
  console.log(error);
}
list.removeAt(1);
list.forEach((el, i) => console.log(el, i));
```

這邊稍微提一下單元測試的部分，如果有在控制台上打印出 List 應該會發現它會是一個巢狀的結構，我們需要不斷的點開 `next` 才能看到我們要的資料，這樣很不方便，所以我們可以利用一個 `helper` 來將 List 的資料轉換成陣列，這樣會比較好觀察跟測試：

```js
function listToArray(head) {
  const result = [];
  let current = head;

  while (current !== null) {
    result.push(current.data);
    current = current.next;
  }

  return result;
}

// 測試程式碼
it('should insert an element at a given position in the list', () => {
  const list = new List();
  list.insertAt(0, 1);
  list.insertAt(1, 2);
  list.insertAt(2, 3);
  list.insertAt(3, 4);
  list.insertAt(2, 5);

  const listArr = listToArray(list.head);
  const expected = [1, 2, 5, 3, 4];

  expect(listArr).toEqual(expected);
});
```
> 還有一種做法是寫一個 `toString` 方法轉成字串，那樣也行，但這裡就不去實作了。

### 練習：反轉鏈結串列

接著讓我們來看一道題目熟悉一下對於 Linked List 的操作，這是 LeetCode 上的原題，題目如下：

給你一個 singly linked list 的頭節點 `head`，請你反轉它，並返回反轉後的 list。像這樣：

![](https://assets.leetcode.com/uploads/2021/02/19/rev1ex1.jpg)

思路：我們會遍歷整個 list，每次都把當前節點的 `next` 指向前一個節點，但是這樣會導致當前節點的 `next` 丟失，所以我們需要一個變數 `prev` 來保存當前節點的 `next`，然後再把當前節點的 `next` 指向前一個節點，最後把 `prev` 賦值給當前節點，這樣就完成了一次反轉。

```js
function reverseList(head) {
  let prev = null; // 初始值設為 null，表示 list 的最後一個節點的 next 為 null
  let curr = head; // curr 從頭節點 head 開始

  while (curr !== null) {
    const next = curr.next; // 先把 curr 的 next 指向的節點保存起來
    curr.next = prev; // 反轉 curr 的 next 指向
    prev = curr; // 把 prev 移動到 curr 的位置
    curr = next; // 把 curr 移動到 next 的位置（原本的 curr.next）
  }

  // 最後 prev 會指向 list 的最後一個節點，也就是反轉後的 head
  return prev;
}
```

最後讓我們把鏈結串列拿來跟陣列做比較，由於 Linked list 沒有索引值這種可以一次到位的“神器”，要存取某個元素都必須遍歷整串 list，所以時間複雜度是 O(n)，但是在增刪元素時，Linked list 的效率就比陣列高了，因為它不需要像陣列一樣，把後面的元素都往後移動，只需要改變指標的指向就可以了，所以時間複雜度是 O(1)，不過要注意的是，當我們在操作 list 的指標時要特別小心，一旦不小心丟失指標我們就找不到節點位置了。

| 操作 | Array | Linked List |
| ---- | ----- | ----------- |
| 存取 | O(1)  | O(n)        |
| 插入 | O(n)  | O(1)        |
| 刪除 | O(n)  | O(1)        |

## 雙向鏈結串列 Doubly Linked List

單向鏈結串列只能從一個方向開始遍歷，即使我們知道這個 list 的長度為 1000，要存取它的第 1000 個元素也要從頭開始遍歷所有元素，為了改進這種效率，又出現了雙向鏈結串列。

雙向鏈結串列的每一個節點比起單向鏈結串列多了一個指向前一個節點的指標（prev），list 本身也多了一個 tail 屬性指向最後一個節點。每次在增刪節點時，我們會呼叫一個更快的 `findIndex` 方法，它會根據傳入的索引值決定是從頭或尾開始搜尋。

Doubly Linked List 可以想像成幾個人站成一排，但不是手拉手，左邊的人用右手（next）拉右邊的人的衣角，右邊的人用左手（prev）拉左邊的人的衣角。如果從中間插入一個人，就要斷開重連，此時涉及 4 個屬性的修改。

可以參考這個示意圖：

![Doubly Linked List](https://github.com/SheepNDW/data-structures-and-algorithms/raw/main/src/data-structures/linked-list/doubly-linked-list/images/doubly-linked-list.png)

實作程式碼如下：

```js
class DoublyNode {
  constructor(data) {
    this.data = data;
    this.next = null;
    this.prev = null;
  }
}

class DoublyList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  size() {
    return this.length;
  }

  clear() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  isEmpty() {
    return this.size() === 0;
  }

  getHead() {
    return this.head;
  }

  getTail() {
    return this.tail;
  }

  findIndex(index) {
    const n = this.length;
    if (index > n) {
      throw `Index ${index} is greater than list size ${n}`;
    }
    // 判斷查詢方向
    const dir = index > n >> 1;
    let current = dir ? this.tail : this.head;
    let prop = dir ? 'prev' : 'next';
    let add = dir ? -1 : 1;
    let i = dir ? n - 1 : 0;
    while (current) {
      if (index === i) {
        return current;
      }
      current = current[prop];
      i = i + add;
    }
    return null;
  }

  forEach(cb) {
    let current = this.head;
    let i = 0;
    while (current) {
      cb(current.data, i);
      current = current.next;
      i++;
    }
  }

  insertAt(index, data) {
    if (index <= this.length) {
      let node = new DoublyNode(data);

      if (index === 0 && !this.head) {
        this.tail = this.head = node;
      } else {
        let prev = this.findIndex(index - 1);
        if (!prev) {
          // 前面節點不存在，說明插入的是第一個節點，把 head 指向新節點
          node.next = this.head;
          this.head.prev = node;
          this.head = node;
        } else {
          let curr = prev.next; // curr 如果不存在代表從尾部插入
          prev.next = node;
          node.prev = prev;

          node.next = curr;
          if (curr) {
            curr.prev = node;
          }
        }
      }

      if (index === this.length) {
        this.tail = node;
      }

      this.length++;
    } else {
      throw `Index ${index} is greater than list size ${this.length}`;
    }
  }

  removeAt(index) {
    if (this.head && index < this.length) {
      let prev = this.findIndex(index - 1);
      let curr = this.findIndex(index);
      let next = curr.next;

      if (!prev) {
        // 前面節點不存在，說明移除的是第一個節點，把 head 指向下一個節點
        this.head = next;
      } else {
        prev.next = next;
      }

      if (next) {
        // 如果 next 存在，說明移除的不是最後一個節點，把 next 的 prev 指向 prev
        next.prev = prev;
      } else {
        // 如果 next 不存在，說明移除的是最後一個節點，把 tail 指向 prev
        this.tail = prev;
      }

      this.length--;
      return curr.data;
    }

    return null;
  }
}

const list = new DoublyList();

list.insertAt(0, 111);
list.insertAt(1, 222);
list.insertAt(2, 333);
list.insertAt(3, 444);
list.insertAt(4, 555);
list.insertAt(5, 666);
list.insertAt(0, 888);

list.forEach((el, i) => console.log(el, i));

try {
  list.insertAt(10, 777);
} catch (error) {
  console.log(error);
}

list.removeAt(1);
list.forEach((el, i) => console.log(el, i));
```

## 參考資料

- [《JavaScript 算法：基本原理與代碼實現》](https://www.tenlong.com.tw/products/9787115596154?list_name=r-zh_cn)
