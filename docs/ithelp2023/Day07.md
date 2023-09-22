---
outline: deep
---

# 鏈結串列 Linked List (1)

> 本文同步發布於 2023 iThome 鐵人賽：[那些前端不用會，但是可以會的資料結構與演算法](https://ithelp.ithome.com.tw/users/20152758/ironman/6714) 系列文中。

我們先簡單回顧陣列，作為一個被廣泛內建在各語言中的資料結構，它是在記憶體中開一塊連續的空間，然後把資料依序放進去，每個元素都有一個索引值，可以直接存取。在靜態語言中，陣列的長度是固定的，例如一個長度為 7 的陣列，我們就只能存取索引值為 0 到 6 的元素，如果要存取索引值為 7 的元素，就會出現錯誤，不過在 JavaScript 中只會回傳 `undefined`。這是因為 JavaScript 的陣列是動態陣列，它可以在執行時去跟系統索取需要的記憶體空間，讓我們能夠自由擴充長度。陣列在讀取資料時只要知道索引值就能直接找到，但是要將元素從中間會前面插入的時候，為了保持其連續性，必須將後面的所有元素都往後移動一位，刪除靠前的元素也是，要把後面的元素往前移動，所以在插入和刪除時的時間複雜度都是 $O(n)$。

現在讓我們回過頭來看 linked list，JavaScript 並沒有內建 linked list，我們可以想像成它是一個個連接起來的物件，每個物件都有一個 `next` 屬性指向下一個物件。從記憶體的角度來看，它是不連續分配的，每個物件都可以散落在記憶體的任何地方。

linked list 也分成很多種，它本身是複合資料結構，最基本單位是節點（Node），每個節點都有兩個屬性，一個是資料（data），另一個是指向下一個節點的指標（pointer）。如下圖所示：

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

為了方便使用，通常會為 linked list 加上一些和陣列同樣功能的方法與屬性，用於增刪改查。

## 單向鏈結串列 Singly Linked List

單向鏈結串列是最簡單的一種 linked list，特色是每兩個節點之間只有一個單向的連結。想像一群小朋友需要有序的入場，為了防止人員走散，後面的人都會拉著前面的人的衣服（next），依此構建了如下圖所示的一個單向鏈結串列：

![singly-linked-list](https://github.com/SheepNDW/data-structures-and-algorithms/raw/main/src/data-structures/linked-list/images/singly-linked-list.png)

Singly Linked List 通常包含如下操作：

- `head`：插入節點的起點。
- `insertAt(index, data)`：插入一個節點到指定位置。
- `removeAt(index)`：移除指定位置的節點。
- `findIndex(index)`：尋找一個節點。
- `forEach(cb)`：遍歷所有節點。
- `size`：回傳串列長度。
- `isEmpty`：判斷串列是否為空。
- `clear`：清空所有資料。

在開始用程式碼實作之前，我們先來理解一下 linked list 在新增與刪除節點時是怎麼運作的，這是一個比較抽象的概念，我建議在初學時可以直接畫出來，這樣會比較好理解。

### 新增節點

在新增時我們會有三種情況，從尾端新增時我們只要接著串下去就好，而在 list 的前端插入時會需要多做一點事，假設我們有一個 list，裡面有三個節點，我們要在 list 的前端插入一個新的節點，那麼我們要做的事情就是把新的節點的 `next` 指向原本的 `head`，然後把 `head` 指向新的節點，這樣就完成了一次插入。

<div align="center">
  <img src="https://hackmd.io/_uploads/HyesK29kp.png" width="500px">
  <p>在 list 的前端插入一個新的節點</p>
</div>

再來是第三種情況，假設我們要在 list 的中間插入一個新的節點，那麼我們要做的事情就是先找到要插入的位置，先找到前一個節點，然後把新的節點的 `next` 指向前一個節點的 `next`，然後把前一個節點的 `next` 指向新的節點，這樣就完成了一次插入。這裡假設要插在第三個的位置上：

<div align="center">
  <img src="https://hackmd.io/_uploads/BkLn509kp.png" width="500px">
  <p>在 list 的中間插入一個新的節點</p>
</div>

:::warning
在操作 linked list 的 pointer 時要非常小心，順序一定不能搞錯，如果不小心把順序搞錯，就會找不到要連接的節點，例如我們先把 12 指向了 86，就會發現再也找不到 6 在哪了，因為此時 86 的 `next` 還是 `null`。
:::

### 刪除節點

在刪除節點時也有三種情況，一種是刪除 list 的第一個節點，另外則是刪除 list 的中間節點或最後一個節點，我們先來看第一種情況，我們要刪除 list 的第一個節點，那麼我們要做的事情就是把 `head` 指向下一個節點，這樣就完成了一次刪除。

<div align="center">
  <img src="https://hackmd.io/_uploads/HJnBRA9kT.png" width="500px">
  <p>刪除 list 的第一個節點</p>
</div>

再來是第二種情況，假設我們要刪除 list 的中間節點，那麼我們要做的事情就是先找到要刪除的位置，先找到前一個節點，然後把前一個節點的 `next` 指向要刪除節點的 `next`，這樣就完成了一次刪除。

<div align="center">
  <img src="https://hackmd.io/_uploads/HyOC11o1T.png" width="500px">
  <p>刪除 list 的中間節點</p>
</div>

刪掉最後一個也是同理，找到前一個然後指到 `null` 即可。

### 實作一個 Singly Linked List

大致上了解 pointer 的操作後，我們就可以來用程式碼實作一個 singly linked list 了：

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

這邊稍微提一下在我們專案中單元測試的部分，如果有在控制台上打印出 list 應該會發現它會是一個巢狀的結構，我們需要不斷的點開 `next` 才能看到我們要的資料，這樣很不方便，所以我們可以利用一個 `helper` 來將 list 的資料轉換成陣列，這樣會比較好觀察跟測試：

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

接著讓我們來看一道進階一點的題目加深一下對於 linked list 操作的熟悉度，這是 LeetCode 上的原題，題目如下：

給你一個 singly linked list 的頭節點 `head`，請你反轉它，並返回反轉後的 list。像這樣：

![](https://hackmd.io/_uploads/SyS-uF5Ja.png)


思路：我們會遍歷整個 list，每次都把目前節點的 `next` 指向前一個節點，但是這樣會導致目前節點的 `next` 丟失，所以我們需要一個變數 `prev` 來保存目前節點的 `next`，然後再把目前節點的 `next` 指向前一個節點，最後把 `prev` 賦值給目前節點，這樣就完成了一次反轉。

```js
function reverseList(head) {
  let prev = null; // 初始值設為 null，表示 list 的最後一個節點的 next 為 null
  let curr = head; // curr 從頭節點 head 開始

  while (curr !== null) {
    const temp = curr.next; // 先把 curr 的 next 指向的節點保存起來
    curr.next = prev; // 反轉 curr 的 next 指向
    prev = curr; // 把 prev 移動到 curr 的位置
    curr = temp; // 把 curr 移動到 temp 的位置（原本的 curr.next）
  }

  // 最後 prev 會指向 list 的最後一個節點，也就是反轉後的 head
  return prev;
}
```

只有程式碼可能不好理解，我們一樣實際去畫出來輔助理解，下面是將上面的操作畫出來的圖：

第一步先初始化我們的輔助變數 `prev` 和 `curr`：

![](https://hackmd.io/_uploads/ry_zOYc16.png)

然後進入 `While` 迴圈中：

* 宣告一個 `temp` 記錄我們原本的 `next` 指向。
* 反轉目前 `curr` 的 `next` 指向。
* 移動 `prev` 到 `curr`
* 移動 `curr` 到最開始我們事先記錄下的 `temp`，準備下一次的迭代。

![](https://hackmd.io/_uploads/ry5OK-iya.png)

然後重複同樣的動作直到 `curr` 指向 `null`：

![](https://hackmd.io/_uploads/rJcoK-iJ6.png)

## 雙向鏈結串列 Doubly Linked List

單向鏈結串列只能從一個方向開始遍歷，即使我們知道這個 list 的長度為 1000，要存取它的第 1000 個元素也要從頭開始遍歷所有元素，為了改進這種效率，又出現了雙向鏈結串列。

雙向鏈結串列的每一個節點比起單向鏈結串列多了一個指向前一個節點的指標（prev），list 本身也多了一個 `tail` 屬性指向最後一個節點。每次在增刪節點時，我們會呼叫一個更快的 `findIndex` 方法，它會根據傳入的索引值決定是從頭或尾開始搜尋。

雙向鏈結串列可以想像成幾個人站成一排，但不是手拉手，左邊的人用右手（next）拉右邊的人的衣角，右邊的人用左手（prev）拉左邊的人的衣角。如果從中間插入一個人，就要斷開重連，此時涉及 4 個屬性的修改。

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

## 小結

我們今天認識了一個對於一般前端工程師比較陌生的一種資料結構 linked list，一開始會覺得指標操作比較抽象不好理解，我們可以實際去畫出來幫助我們加深印象。

最後讓我們把鏈結串列拿來跟陣列做簡單比較，由於 linked list 沒有索引值這種可以一次到位的“神器”，要存取某個元素都必須遍歷整串 list，所以時間複雜度是 O(n)，但是在插入和刪除元素時，linked list 的效率就比陣列高了，因為它不需要像陣列一樣，去移動裡面的元素，只需要改變指標的指向就可以了，所以時間複雜度是 O(1)，不過要注意的是，當我們在操作 list 的指標時要特別小心，一旦不小心丟失指標我們就找不到節點位置了。

| 操作 | Array | Linked List |
| ---- | ----- | ----------- |
| 存取 | O(1)  | O(n)        |
| 插入 | O(n)  | O(1)        |
| 刪除 | O(n)  | O(1)        |

## 參考資料

- [《JavaScript 算法：基本原理與代碼實現》](https://www.tenlong.com.tw/products/9787115596154?list_name=r-zh_cn)
