---
outline: deep
---

# 二元搜尋樹 Binary Search Tree

> 本文同步發布於 2023 iThome 鐵人賽：[那些前端不用會，但是可以會的資料結構與演算法](https://ithelp.ithome.com.tw/users/20152758/ironman/6714) 系列文中。

透過實作走訪發現到，二元樹最大的優勢是對稱，從而實作各種易讀性非常強的遞迴走訪。但是二元樹的缺點也很明顯，就是沒有規則，所以在搜尋時需要遍歷所有節點，效率不高。二元搜尋樹（Binary Search Tree，BST）是一種特殊的二元樹，它的左子樹的所有節點都小於根節點，右子樹的所有節點都大於根節點。這樣一來，我們就可以在搜尋時，根據節點的值和根節點的值的大小關係，只需要遍歷一部分節點就可以了。

<div align="center">
  <img src="https://github.com/SheepNDW/data-structures-and-algorithms/raw/main/src/data-structures/tree/images/bst.png" width="500">
  <p>二元搜尋樹</p>
</div>

在搜尋方面，就跟它的名字一樣，這是它的長處，搜尋效率可以達到 $O(\log n)$，比 $O(n)$ 還要快。BST 相當於對序列建立了一個索引，可以簡單理解爲在資料結構的層面上建構了一個二分搜尋演算法。

在增刪方面，也依賴一些規則，以保證它的結構不被破壞。在插入時，保證左子樹的節點都比父節點小，右子樹的節點都比父節點大。刪除也一樣，需要做一些調整。

從上圖可以知道，二元搜尋樹的最大最小值是有規律的，總是在最左邊和最右邊的葉節點上。

接下來我們實作一個二元搜尋樹，實作程式碼如下：

```js
class TreeNode {
  constructor(data) {
    this.parent = null;
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

// 沿用之前 class Tree 的方法，僅重寫 insert、find、remove
class BST {
  constructor() {
    this.root = null;
    this._size = 0;
  }

  insert(data) {}

  find(data) {}

  transplant() {}

  remove(data) {}

  inOrder(callback) {}

  preOrder(callback) {}

  postOrder(callback) {}

  size() {}

  minNode() {}

  maxNode() {}

  min() {}

  max() {}

  getNodeSize() {}

  height() {}

  getNodeHeight() {}

  toString() {}

  printNodeByLevel() {}

  show() {}
}
```

## Predecessor 和 Successor

根據二元搜尋樹的定義，中序走訪得到的陣列是一個遞增的序列。某個節點的 Predecessor，應為小於該節點的所有節點中的最大節點。例如下圖中，節點 5 的 Predecessor 為 4，節點 12 的 Predecessor 為 10。


<div align="center">
  <img src="https://github.com/SheepNDW/data-structures-and-algorithms/raw/main/src/data-structures/tree/images/predecessor-successor.png" width="500px">
</div>

Predecessor 可能在原節點的下面（左子樹），也可能在上面（父節點）。要尋找 Predecessor 的方法如下：

```js
function predecessor(node) {
  let ret;
  if (node.left) { // 如果有左子樹
    ret = node.left;
    while (ret.right) { // 在左子樹中找到最右邊的節點
      ret = ret.right;
    }
    return ret;
  } else {
    let p = node.parent;
    while (p && p.left === node) {
      node = p; // 找到一個父節點，是其父節點的父節點的左子節點
      p = p.parent;
    }
    return p;
  }
}
```

某個節點的 Successor，應為大於該節點的所有節點中的最小節點。例如圖中，節點 5 的 Successor 為 6。尋找 Successor 的方法如下：

```js
function successor(node) {
  if (node.right) { // 如果有右子樹
    let ret = node.right;
    while (ret.left) { // 在右子樹中找到最左邊的節點
      ret = ret.left;
    }
    return ret;
  } else {
    let p = node.parent;
    while (p && p.right === node) {
      node = p; // 找到一個父節點，是其父節點的父節點的右節點
      p = p.parent;
    }
    return p;
  }
}
```

## 二元搜尋樹的插入與查詢操作

1. `insert`

由於有了數值上的約定，我們不需要像二元樹那樣搞一個 `_insertLeft` 屬性來規定插入某棵子樹。只需從根節點開始，比較每個節點的值和要插入的值的大小，決定往哪一邊尋找可以放置新節點的位置。插入過程如下圖：

<div align="center">
  <img src="https://github.com/SheepNDW/data-structures-and-algorithms/raw/main/src/data-structures/tree/images/bst-insert.png" width="600px">
</div>

實作程式碼如下：

```js
insert(data) {
  const node = new TreeNode(data);
  if (this.root === null) {
    this.root = node;
    this._size++;
    return true;
  }

  let current = this.root;
  let parent = null;
  while (current) {
    parent = current;
    if (data === current.data) return false;
    node.parent = parent;
    if (data < current.data) {
      current = current.left;
      if (current === null) {
        parent.left = node;
        this._size++;
        return true;
      }
    } else {
      current = current.right;
      if (current === null) {
        parent.right = node;
        this._size++;
        return true;
      }
    }
  }
}
```

2. `find`

查詢操作與二元樹的相似，我們透過兩值相減，根據結果決定往左子樹或右子樹尋找。實作程式碼如下：

```js
find(data) {
  let node = this.root;
  while (node) {
    if (data === node.data) {
      return node;
    } else if (data < node.data) {
      node = node.left;
    } else {
      node = node.right;
    }
  }
  return null;
}
```

## 二元搜尋樹的移除操作

在二元樹的移除操作中，我們遇到兩個子節點的情況時，是在它下方隨便找一個葉節點來頂替它。但二元搜尋樹要保證資料的有序性，所以我們通常找其 Successor 來做頂替。實作程式碼如下：

```js
remove(data) {
  const node = this.find(data);
  if (node) {
    this.removeNode(node);
    this._size--;
  }
}

removeNode(node) {
  // 如果有兩個子節點
  if (node.left !== null && node.right !== null) {
    let succ = null;
    for (succ = node.right; succ.left !== null; succ = succ.left); // 找到後繼
    node.data = succ.data; // 用後繼的值替換當前節點的值
    this.removeNode(succ); // 遞迴刪除，只可能遞迴一次
  } else {
    // 葉節點或只有一個子節點
    let child = node.left || node.right || null;
    this.transplant(node, child);
  }
}

transplant(node, child) {
  if (node.parent == null) {
    this.root = child;
  } else if (node === node.parent.left) {
    node.parent.left = child;
  } else {
    node.parent.right = child;
  }
  if (child) {
    child.parent = node.parent;
  }
}
```

## 在瀏覽器中顯示出二元搜尋樹的結構

我們可以再寫一個 `show` 方法，將二元搜尋樹的結構顯示出來。實作程式碼如下：

```js
show(node = this.root, parentNode) {
  if (!parentNode) {
    parentNode = document.createElement('div');
    parentNode.style.cssText = 'width:100%;text-align:center;';
    document.body.appendChild(parentNode);

    const top = parentNode.appendChild(document.createElement('div'));
    top.style.cssText = 'background:' + bg();
    top.innerHTML = node.data;
  }

  const a = parentNode.appendChild(document.createElement('div'));
  a.style.cssText = 'overflow:hidden';

  if (node.left) {
    const b = a.appendChild(document.createElement('div'));
    b.style.cssText = 'float:left;width:49%;background:' + bg();
    b.innerHTML = node.left.data;
    this.show(node.left, b);
  }

  if (node.right) {
    const c = a.appendChild(document.createElement('div'));
    c.style.cssText = 'float:right;width:49%;background:' + bg();
    c.innerHTML = node.right.data;
    this.show(node.right, c);
  }
}

function bg() {
  return '#' + ((Math.random() * 0xffffff) << 0).toString(16);
}
```

我們在 `main.js` 中使用 `show` 方法就可以看到在畫面中已經顯示出了二元搜尋樹的結構，如下圖：

![](https://media.discordapp.net/attachments/1080668361618362530/1149531624128647252/image.png?width=2206&height=286)

## 總結

我們瞭解了“樹”這種資料結構，其中二元樹是應用較多的一種。一個節點上最多有兩個子節點，滿足這個條件的樹我們稱為二元樹。二元樹的兩個子節點分別稱為左子樹和右子樹。

二元樹有以下屬性：

- 第 $n$ 層的節點數最多為 $2^{n-1}$ 個。
- 有 $n$ 層的二元樹節點總數最多為 $2^n-1$ 個。
- 包含 $n$ 個節點的二元樹最小高度為 $\log_2(n+1)$。

二元樹的走訪方式有如下兩種：

- 深度優先走訪：前序、中序、後序。
  - 前序：根 -> 左 -> 右
  - 中序：左 -> 根 -> 右
  - 後序：左 -> 右 -> 根
- 廣度優先走訪：層序走訪。
  - 首先以一個未被訪問過的節點作為起始頂點，訪問其所有相鄰的節點。
  - 然後對每個相鄰的節點，再依次訪問它們相鄰的未被訪問過的節點。
  - 直到所有的節點都被訪問過為止。

## 參考資料

- [《JavaScript 算法：基本原理與代碼實現》](https://www.tenlong.com.tw/products/9787115596154?list_name=r-zh_cn)
