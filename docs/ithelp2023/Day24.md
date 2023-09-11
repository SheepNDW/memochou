---
outline: deep
---

# 隨機演算法 - Fisher-Yates Shuffle

## Shuffle an array

提到洗牌（Shuffle），我們常會想到在玩撲克牌時，為了打亂牌的順序我們會在發牌前先進行洗牌。我們可以想成要打亂一個陣列，洗牌只是一種應用。不過其實現實生活中的洗牌有很多種方式，有一般常見的交疊洗牌、印度洗牌又或是一張一張分開交疊的完美洗牌，LeetCode 上剛好有一題就是完美洗牌：[1470. Shuffle the Array](https://leetcode.com/problems/shuffle-the-array/)，簡單來說就是要將一組陣列分成兩半，然後交錯合併成一個新的陣列。

但是今天要介紹的不是現實中的洗牌，而是一種演算法，叫做 Fisher–Yates shuffle，其用意是為了公平的打亂，使得每種組合的機率相等。其實說白就是要隨機去打亂一個陣列，這個需求其實在實際開發場景中也會遇到，例如：在一個網頁中，我們想要隨機顯示一些廣告。不知道大家都是怎麼去實作這個“隨機”的呢？

### 直覺的做法

宣告一個新的 `array`，然後從原來的牌堆（陣列）中隨機取出一個牌（元素），放到新的陣列中，重複這個動作直到原來的陣列中沒有元素為止。

```js
function shuffle(deck) {
  const newDeck = [];
  while (deck.length > 0) {
    const r = Math.floor(Math.random() * deck.length);
    const card = deck.splice(r, 1);
    newDeck.push(...card);
  }
  return newDeck;
}
```

這樣寫沒什麼問題，但是我們可以發現，每次都要從原來的陣列中刪除一個元素，這樣的話時間複雜度就會變成 $O(n^2)$，如果陣列很大的話，效能就會很差。

### 直覺的做法（改良版）

我們可以直接跑迴圈從第一張牌開始，每次都隨機跟其他張牌交換位置，這樣就不用刪除元素了，時間複雜度就會變成 $O(n)$。

```js
function shuffle2(deck) {
  for (let i = 0; i < deck.length; i++) {
    const r = Math.floor(Math.random() * deck.length);
    [deck[i], deck[r]] = [deck[r], deck[i]];
  }
  return deck;
}
```

看起來很簡單，但是這個方法其實存在著一個問題，就是它並不是真的隨機，我們稍後會再來討論這個問題。

### `sort()`

在我工作中第一次遇到這個需求時，前輩教了我一種神奇的方法，就是使用 JavaScript 內建的 `sort()` 方法，然後用一種非常簡潔的寫法將一個陣列做亂數排序：

```js
function shuffle3(arr) {
  return arr.sort(() => Math.random() - 0.5);
}
```

如果你是第一次看到，讓我先來解釋一下原理，首先我們都知道 `Math.random()` 會回傳一個 `0~1` 的數字，我們把它扣掉 `0.5` 之後，就會得到一個 `-0.5~0.5` 的數字，這個數字會決定 `sort()` 方法的排序順序，因為這個數字是隨機生成的，所以結果也會是隨機的。

看起來很美好，行數少又優雅，不過其實這個寫法存在著一些問題，在前面我們學習排序演算法時，我們知道 `sort()` 方法的時間複雜度是 $O(n \log n)$，所以在對一個較龐大的陣列使用時可能會導致效能下降。

另外還有一個問題是，它的機率分佈其實也是不均勻的，讓我們來看一下用 `sort()` 還有剛才前一個的實作方式，對於一個陣列 `[1, 2, 3]`，它們的機率分佈是怎麼樣的：

```js
const count = { 123: 0, 132: 0, 213: 0, 231: 0, 312: 0, 321: 0 };

for (let i = 0; i < 600000; i++) {
  const array = [1, 2, 3];
  const rArray = shuffle(array);
  count[rArray.join('')]++;
}

for (const key in count) {
  console.log(key + ':', count[key]);
}
```

```bash
# shuffle
123: 100040
132: 100038
213: 99833
231: 99750
312: 100463
321: 99876

# shuffle2
123: 88750
132: 111122
213: 110972
231: 111228
312: 88877
321: 89051

# shuffle3
123: 225288
132: 37504
213: 74831
231: 37407
312: 37487
321: 187483
```

我們可以發現 `shuffle2` 和 `shuffle3` 的機率分佈都是不均勻的，先來看看我們使用 `sort()` 實作的 `shuffle3`，為什麼它的機率分佈會不均勻呢？因為 JavaScript 的 `sort()` 是一個黑盒子，各家瀏覽器實作的方式不同，無法保證比較的次數。不過不管如何，我們都可以確定的是它實際測試的結果是一個不均勻的機率分佈。

再來看看 `shuffle2` 的實作方式，我們帶入 `[1,2,3]` 來看看，正常打亂 123 的結果可能有 3 x 2 x 1 = 3! = 6 種，分別是 123、132、213、231、312、321。但是我們可以發現 `shuffle2` 實作的交換法會出現 $3^3$ = 27 種結果，但實際上不一樣的組合只有 6 種，所以有些組合的機率就會比較高。

### Fisher–Yates shuffle

接下來要介紹的 Fisher-Yates 演算法非常適合用來亂數排序一個陣列，這個演算法是由 Fisher 和 Yates 提出的，一樣是透過一個迴圈去迭代陣列，但是它的方式是從最後一個元素開始，每次都跟前面一個隨機的元素交換位置。這樣的話，可以保證隨機過的位置不會再被交換，就不會出現重複的情況：

```js
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]];
  }
  return arr;
}
```

整個過程可以參考下圖：

![Fisher–Yates shuffle](https://github.com/SheepNDW/data-structures-and-algorithms/raw/main/src/algorithms/fisher-yates-shuffle/images/shuffle.png)

這個演算法的時間複雜度是 $O(n)$，而且它的機率分佈也是均勻的，我們可以用剛才的例子來驗證一下得出的結果為：

```bash
# Fisher–Yates shuffle
123: 99435
132: 99885
213: 100231
231: 99867
312: 100605
321: 99977
```

知道了 Fisher-Yates shuffle 的原理之後，就可以試試去解 LeetCode 上的 [384. Shuffle an Array](https://leetcode.com/problems/shuffle-an-array/) 了，基本上是一樣的概念，這邊就留給大家自己練習了。

## 參考資料

- [Fisher–Yates shuffle](https://marsgoat.github.io/XNnote/coding/FisherYatesShuffle.html)
- [《Learning JavaScript Data Structures and Algorithms, 3/e》](https://www.tenlong.com.tw/products/9781788623872?list_name=trs-f)
- [JavaScript 學演算法（二十一）- 洗牌演算法](https://chupai.github.io/posts/2008/shuffle_algorithm/)
- [Shuffle an array](https://javascript.info/task/shuffle)
