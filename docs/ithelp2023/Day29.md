---
outline: deep
---

# 動態規劃 Dynamic Programming (2)

## 最長不下降子序列 Longest Non-decreasing Subsequence

有一個由 n (`n <= 1 <= 200`) 個整數組成的數列，標記為：$a_1, a_2, ..., a_n$。請你從中找出一個**最長的不下降子序列**，也就是說找出一個最長的整數序列 $i_1, i_2, ..., i_k$，使得對於任意的 j (`1 <= j <= k - 1`)，都滿足 $i_j < i_{j + 1}$ 且 $a_{i_j} \leq a_{i_{j + 1}}$。

例如：`[1, 2, 3, -9, 3, 9, 0, 11]`，它的最長不下降子序列為 `[1, 2, 3, 3, 9, 11]`。

思路：我們建立一個 table，長度等於原數列長度，`table[i]` 表示以 `array[i]` 為結束的非下降子序列的長度。一開始它們的值都是 1，可以參考下表。我們分別用 `[4]`、`[1,3]`、`[3,1]` 和 `[1,2,3]` 這些總長為 1、2、3 的陣列來推論規律。

| array     | table initStatus | table lastStatus |
| --------- | ---------------- | ---------------- |
| `[4]`     | `[1]`            | `[1]`            |
| `[1,3]`   | `[1,1]` j=0, i=1 | `[1,2]`          |
| `[3,1]`   | `[1,1]` j=0, i=1 | `[1,1]`          |
| `[1,2,3]` | `[1,1,1]`        | `[1,2,3]`        |

如果 `array[i] >= array[j](j < i)`，那麼 `table[i] = Math.max(table[i], table[j] + 1)`。

因此 table 中的元素隨著索引的遞增，其值即便不加 1 也不會變小，就像一個台階一樣不斷往上累加 1。

又由於 `table[i]` 的值是透過 `0 ~ i` 的子陣列推導出來的，因此我們可以用一個雙層迴圈來填表，`i` 跑整個陣列，`j` 跑 `0 ~ i` 的子陣列。實作程式碼如下：

```js
function longestNonDecreasingSequence(array) {
  const dp = new Array(array.length).fill(1);
  let max = 1;
  let maxIndex = 0;

  for (let i = 1; i < array.length; i++) {
    for (let j = 0; j < i; j++) {
      const current = array[i];
      const previous = array[j];

      if (current >= previous && dp[i] < dp[j] + 1) {
        dp[i] = dp[j] + 1;

        if (max < dp[i]) {
          max = dp[i];
          maxIndex = i;
        }
      }
    }
  }

  const result = [array[maxIndex]];
  let m = max;
  let i = maxIndex - 1; // 從最後一個往前找
  while (m > 1) {
    // 相鄰的 dp[i] 都是等差或是相差 1
    if (dp[i] === m - 1 && array[i] <= array[maxIndex]) {
      result.unshift(array[i]);
      maxIndex = i;
      m--;
    }
    i--;
  }

  return result;
}
```

這個問題其實就是最長遞增子序列（Longest Increasing Subsequence, LIS）的變形，多了一個等於的條件。有興趣的讀者可以參考 [300. Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/)。

## 最長共同子序列 Longest Common Subsequence

給你兩個字串，求解這兩個字串的最長共同子序列（Longest Common Subsequence, LCS）的長度。例如：`abcde` 與 `ace` 的 LCS 為 `ace`，長度為 3。

LCS 是一個很實用的問題，它可以是不連續的。它可以用在描述兩段文字之間的“相似度”，也就是雷同程度，進而去判斷是否為抄襲。對一段文字進行修改時，計算修改前後文字的 LCS，將除此子序列外的部分提取出來，用這個方式來判斷修改的部分，往往十分準確。

思路：這題比上一題的還難，上一題只有一個字串（或陣列），這題有兩個字串，因此填表用的 table 會變成二維陣列，也就是矩陣。矩陣的橫列表示第一個字串，縱行表示第二個字串，如果某一列與某一行相交的字元相同，我們就填 1，否則就填 0。但這樣點完之後還需要再清點一次，如圖所示：

<div align="center">
  <img src="https://github.com/SheepNDW/data-structures-and-algorithms/raw/main/src/algorithms/dynamic-programming/images/lcs.png" width="300px">
</div>

我們繼續來改進一下，如果格子對應的字元相同，那麼它的值就等於左上角格子的值加 1，如果不存在則預設為 0；如果不相同，那麼它的值就等於左邊格子與上面格子取最大值。最後右下角的值就是 LCS 的長度。如下圖所示：

<div align="center">
  <img src="https://github.com/SheepNDW/data-structures-and-algorithms/raw/main/src/algorithms/dynamic-programming/images/lcs2.png" width="300px">
</div>

根據上面的規則，我們可以寫出狀態轉移方程：

$$
f(i, j) = \begin{cases}
  0 & !s_1[i] \text{ || } !s_2[j] \\
  f(i - 1, j - 1) + 1 &  s_1[i] == s_2[j] \\
  \max \{ f(i - 1, j), f(i, j - 1) \} & s_1[i] \text{ != } s_2[j]
\end{cases}
$$

整個轉移的過程如下：

<div align="center">
  <img src="https://github.com/SheepNDW/data-structures-and-algorithms/raw/main/src/algorithms/dynamic-programming/images/lcs3.png" width="250px">
</div>

為了避免左上格子不存在的問題，我們有兩種解法：一是將 str1、str2 字串轉換成陣列，然後在陣列前面加上一個空字串，並規定空字串與其他字串比較時，結果永遠是 0；二是在矩陣左側和上方額外新增 1 行與列，並將它們的值都設為 0，效果如下圖所示：

<div align="center">
  <img src="https://github.com/SheepNDW/data-structures-and-algorithms/raw/main/src/algorithms/dynamic-programming/images/lcs4.png" width="300px">
</div>

我們用第二種方式來實作，程式碼如下：

```js
function LCS(str1, str2) {
  const m = str1.length;
  const n = str2.length;

  const dp = [new Array(n + 1).fill(0)];

  for (let i = 1; i <= m; i++) {
    dp[i] = [0];
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i][j - 1], dp[i - 1][j]);
      }
    }
  }

  return dp[m][n];
}
```

如果我們要實際求出 LCS 字串，可以從右下角開始往左上角找回去，遇到相同的字元就加入結果中，遇到不同的字元就往左或往上找，直到找到左上角為止。我們可以使用一個遞迴函式來實現，程式碼如下：

```js
function printLCS(dp, str1, str2, i, j) {
  if (i === 0 || j === 0) {
    return '';
  }

  if (str1[i - 1] === str2[j - 1]) {
    return printLCS(dp, str1, str2, i - 1, j - 1) + str1[i - 1];
  }

  if (dp[i][j - 1] > dp[i - 1][j]) {
    return printLCS(dp, str1, str2, i, j - 1);
  }

  return printLCS(dp, str1, str2, i - 1, j);
}

function LCS(str1, str2) {
  // 略
  const lcs = printLCS(dp, str1, str2, m, n);
  console.log(lcs);
  return dp[m][n];
}

LCS('DACB', 'ABC'); // AC
```

## 爬樓梯 Climbing Stairs

這題的原題為 [70. Climbing Stairs](https://leetcode.com/problems/climbing-stairs/)，題目如下：假設你正在爬樓梯。需要 n 階你才能到達樓頂，每次你可以爬 1 或 2 個台階。你有多少種不同的方法可以爬到樓頂呢？（`1 <= n <= 45`）

例如：

給定 n = 2，回傳 2，因為有兩種方法可以爬到樓頂。

- 1 階 + 1 階
- 2 階

給定 n = 3，回傳 3，因為有三種方法可以爬到樓頂。

- 1 階 + 1 階 + 1 階
- 1 階 + 2 階
- 2 階 + 1 階

思路：我們可以先從範例觀察一下，`dp[1] = 1, dp[2] = 2, dp[3] = dp[1] + dp[2] = 3`。接下來確認一下 `dp[4]` 的值，有 `[1,1,1,1], [1,1,2], [1,2,1], [2,1,1], [2,2]` 這 5 種組合，然後我們發現 `dp[4] = dp[3] + dp[2]`。這樣我們就可以推論出狀態轉移方程：

$$
f(n) = \begin{cases}
  1 & \text{if } n = 1 \\
  2 & \text{if } n = 2 \\
  f(n - 1) + f(n - 2) & \text{if } n \geq 3
\end{cases}
$$

知道規律後就可以利用動態規劃來解題了，實作程式碼如下：

```js
function climbStairs(n) {
  const dp = [0, 1, 2];
  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}
```

## 背包問題 0/1 Knapsack Problem

一個背包有一定的耐重量 `W`，有一系列物品 `1, 2, ..., n`，每個物品都有自己的重量 `w[i]` 與價值 `v[i]`，在不超過耐重量的情況下，我們如何選擇物品使得總價值最高？

「0/1」的意思是每件物品只能選擇 0 個或 1 個。也就是要嘛就是放進背包，要嘛就是不放進背包。

其實這類問題和之前的 coin change 有相似之處。我們使用一個二維的 dp 陣列來記錄，其中 `dp[i][j]` 表示耐重為 `j` 時，前 `i` 個物品的最大價值。當 `i = 0` 時，也就是放入第一個物品時，則：`dp[0] = j > w[0] ? v[j] : 0`。當 `j = 0` 時，`dp[i] = 0`。當 `i > 0` 且 `j > 0` 時，我們有兩種選擇：

1. 不放入第 `i` 個物品，則 `dp[i][j] = dp[i - 1][j]`。
2. 放入第 `i` 個物品，則 `dp[i][j] = dp[i - 1][j - w[i]] + v[i]`，需要 `j >= w[i]`。

綜上，我們可以得到：`dp[i][j] = max(dp[i - 1][j], dp[i - 1][j - w[i]] + v[i])`。

實作程式碼如下：

```js
function knapsack01(w, v, W) {
  if (w.length === 0 || v.length === 0 || W === 0) {
    return 0;
  }

  const n = w.length;
  // 建立一個 n * (W + 1) 的矩陣
  const dp = new Array(n).fill(0).map(() => new Array(W + 1).fill(0));

  // 初始化第 0 列
  for (let i = 0; i <= W; i++) {
    dp[0][i] = i >= w[0] ? v[0] : 0;
  }

  // 初始化第 0 行
  for (let i = 0; i < n; i++) {
    dp[i][0] = 0;
  }

  for (let i = 1; i < n; i++) {
    for (let j = 1; j <= W; j++) {
      if (j < w[i]) {
        dp[i][j] = dp[i - 1][j];
      } else {
        dp[i][j] = Math.max(
          dp[i - 1][j],
          dp[i - 1][j - w[i]] + v[i]
        );
      }
    }
  }

  return dp[n - 1][W];
}
```

## 總結

動態規劃不像回溯法那樣有特定的套路，雖然我們可以針對可變的部分抽取出狀態，但這些狀態需要結合填表法才能找到真正的意義。此外關於狀態轉移式，有的題目已經給出前幾步的結果，你可以輕鬆地推論出來；有的題目就比較難，這些都需要透過練習去累積經驗。

## 參考資料

- [《JavaScript 算法：基本原理與代碼實現》](https://www.tenlong.com.tw/products/9787115596154?list_name=r-zh_cn)
- [演算法筆記](https://web.ntnu.edu.tw/~algo/)