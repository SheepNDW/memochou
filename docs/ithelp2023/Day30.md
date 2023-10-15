---
outline: deep
---

# 貪婪演算法 Greedy Algorithm

> 本文同步發布於 2023 iThome 鐵人賽：[那些前端不用會，但是可以會的資料結構與演算法](https://ithelp.ithome.com.tw/users/20152758/ironman/6714) 系列文中。

貪婪演算法（Greedy Algorithm）是一種在每一步選擇中都採取在目前狀態下最好或最佳（即最有利）的選擇，從而希望獲得全體最好或最佳解的演算法。

貪婪演算法和動態規劃都常用來解決最佳化問題。它們之間存在一些相似處，例如都依賴於最佳子結構，但工作原理不同。

* 動態規劃：根據之前階段的所有決策來考慮目前決策，並使用過去子問題的解來建構目前子問題的解。
* 貪婪演算法：不會重新考慮之前的決策，而是一路向前進行貪婪選擇，不斷縮小問題，直到問題被解決。

我們拿之前看過的 coin change 來舉例，有 `n` 種硬幣 `coins`，第 `i` 種硬幣的面額為 `coins[i - 1]`，每種硬幣都能重複選擇，問能夠湊出目標值 `amount` 的最少硬幣數量。

用 greedy 策略來解這個問題就是**我們每次都貪心地選擇不大於 `amount` 且最接近它的硬幣**，然後將 `amount` 減去該硬幣的面額，不斷地重複這兩個步驟，直到 `amount` 減為 0，這時我們就找到了最少硬幣數量。如下所示：

| amount | coins     | coins used |
| ------ | --------- | ---------- |
| 11     | [1, 2, 5] | 5          |
| 6      | [1, 2, 5] | 5          |
| 1      | [1, 2, 5] | 1          |

用程式碼來表示就是：

```js
function coinChangeGreedy(coins, amount) {
  // 假設 coins 陣列已經排序過
  let count = 0;
  let i = coins.length - 1;

  // 進行 greedy 選擇，直到 amount 為 0
  while (amount > 0) {
    // 如果當前的 coin 大於 amount，則跳過
    if (coins[i] > amount) {
      i--;
      continue;
    }

    // 進行選擇
    amount -= coins[i];
    count++;
  }

  return amount === 0 ? count : -1;
}
```

## Greedy 的優點與侷限

貪婪演算法的操作很直觀，實作簡單且通常效率也不錯。在剛才的程式碼中，設硬幣最小面額為 `min(coins)`，則 greedy 選擇最多跑 `amount / min(coins)` 次迴圈，時間複雜度為 $O(amount / \min(coins))$。相對動態規劃的時間複雜度 $O(amount * amount.length)$ 來說，提升了一個數量級。

但是對於某些硬幣面額組成，greedy 無法找到最佳解。下面舉幾個例子來說明：

* **成功案例** `coins = [1, 5, 10, 20, 50, 100]`：在這個硬幣組合下，給定任意 `amount` 都能透過 greedy 找到最佳解。
* **失敗案例** `coins = [1, 3, 4]`：假設 `amount = 6`，greedy 會選擇 `4 + 1 + 1` 得出 3 枚硬幣的解，但是我們透過動態規劃可以找到最佳解 `3 + 3` 的 2 枚硬幣。
* **失敗案例** `coins = [1, 20, 50]`：假設 `amount = 60`，greedy 會選擇 `50 + 1 * 10` 得出 11 枚硬幣的解，但是我們透過動態規劃可以找到最佳解 `20 * 3` 的 3 枚硬幣。

也就是說對於 coin change 問題，greedy 無法保證找到全局最佳解，而且還有可能找到一個非常差的解，因此它更適合使用動態規劃來解決。

一般情況下，greedy 適用於下面兩類問題：

1. **可以保證找到最佳解**：貪婪演算法在這種情況下往往是最佳選擇，通常會比回溯法或是動態規劃更快。
2. **可以找到近似最佳解**：在這種情況下，貪婪演算法也是可用的。對於很多複雜問題來說，尋找全局的最佳解是非常困難的，而貪婪演算法可以在合理的時間內給出一個非常接近最佳解的解。

## Greedy 的特性

那麼隨之而來的問題是，什麼樣的問題適合用貪婪演算法來解決呢？或者說，貪婪演算法在什麼情況下可以保證找到最佳解呢？

相比動態規劃，greedy 的使用條件更加苛刻，主要關注問題的兩個性質：

* **貪婪選擇性質（Greedy Choice Property）**：全局最佳解包含當前最佳選擇，即局部最佳選擇始終可以推導出全局最佳選擇時。
* **最佳子結構（Optimal Substructure）**：全局最佳解包含子問題的最佳解。

最佳子結構我們在介紹動態規劃時提過了，這裡主要說一下 greedy choice 的判斷方法。雖然描述上看起來比較簡單，但實際上對於許多問題來說，證明 greedy choice property 並不容易。

例如 coin change 問題，我們很容易就可以找出反例，但是證明正面例子難度就比較大了。如果要問：滿足什麼條件的硬幣組合可以使用 greedy 來求解？我們往往只能憑藉感覺或舉幾個例子來給出一個模稜兩可的答案，難以給出嚴謹的數學證明。

## Greedy 的解題流程

greedy 問題的解題流程大致分為三步：

1. **問題分析**：分析問題的特性，包括狀態定義、最佳化目標和限制條件等。
2. **確定 Greedy 策略**：確定如何在每一步中做出最佳決策。
3. **正確性證明**：通常需要證明問題具有 optimal substructure 和 greedy choice property。可能需要使用反證法或數學歸納法。

確定 greedy 策略是解題的核心步驟，但實施起來可能並不容易，因為我們常常會被一些策略給迷惑，誤以為它是最佳策略，例如前面的 coin change，然後在實作後發現無法通過部分測試案例，這是因為設計出來的貪婪策略只是“部分正確”的。

因此，我們在確定 greedy 策略後，還需要進行正確性證明，確保該策略是正確的。然而要證明正確性也可能不是一件易事，如果完全沒有頭緒，可以先嘗試用反證法，假設該策略不是最佳策略，然後找出反例，如果找不出反例，那麼該策略可能就是最佳策略了。

## 範例練習

最後讓我們來看一題 greedy 的經典題目，分數背包問題（Fractional Knapsack Problem）。

分數背包問題和先前的 0/1 背包問題很相似，但是有一點不同，就是物品可以分割，也就是說我們可以選擇物品的一部分，而不一定是全部。我們簡單用一個例子來比較一下兩者的區別：

| 物品 | weight | value |
| ---- | ------ | ----- |
| 1    | 2      | 3     |
| 2    | 3      | 4     |
| 3    | 4      | 5     |

在 0/1 背包問題中，如果背包的承重只有 6，只能選擇物品 1 和物品 3，最大價值為 8。

分數背包問題中允許我們只選擇物品的一部分，我們可以對物品進行任意分割，然後按照重量比例來計算價值。因此，我們可以先計算出每個物品的單位重量價值，然後按照單位重量價值從大到小排序，依次選擇物品，直到背包裝滿為止。

| 物品 | weight | value | unit value |
| ---- | ------ | ----- | ---------- |
| 1    | 2      | 3     | 1.5        |
| 2    | 3      | 4     | 1.33       |
| 3    | 4      | 5     | 1.25       |

我們可以選擇物品 1 和物品 2，還有 25% 的物品 3，最大價值為 8.25。

### Greedy 策略確定

要最大化背包內物品總價值，本質上是要最大化單位重量下的物品價值（白話點就是 CP 值最高），於是我們的 greedy 策略就是**價值與重量的比值最高的物品，優先放進背包**。

解題流程就會是：將物品按照單位價值從高到低排序 --> 遍歷所有物品，每次都貪婪地選擇單位價值最高的物品 --> 如果背包容量不足，則將目前物品的一部分放入背包，直到背包裝滿為止。

### 程式碼實作

```js
function fractionalKnapsack(capacity, weights, values) {
  const list = [];

  for (let i = 0; i < weights.length; i++) {
    list.push({
      num: i + 1,
      weight: weights[i],
      value: values[i],
      ratio: values[i] / weights[i],
    });
  }

  list.sort((a, b) => b.ratio - a.ratio);

  const selects = [];
  let totalValue = 0;

  for (let i = 0; i < list.length; i++) {
    let item = list[i];
    if (item.weight <= capacity) {
      selects.push({
        num: item.num,
        weight: item.weight,
        value: item.value,
        ratio: 1,
      });

      totalValue += item.value;
      capacity -= item.weight;
    } else if (capacity > 0) {
      const ratio = capacity / item.weight;
      selects.push({
        num: item.num,
        weight: item.weight * ratio,
        value: item.value * ratio,
        ratio,
      });

      totalValue += item.value * ratio;
      capacity -= item.weight * ratio;
      break;
    } else if (capacity <= 0) {
      break;
    }
  }

  return totalValue;
}
```

最壞情況下，我們會需要遍歷整個物品列表，因此時間複雜度為 $O(n)$。

### 正確性證明

採用反證法，假設物品 x 是單位重量價值最高的物品，使用某種演算法求得最大價值為 `res`，但該解中不包含物品 x。

現在我們從背包中拿出單位重量的任意物品，替換成單位重量的物品 x。由於物品 x 單位重量價值最高，因此替換後的解 `res'` 會比 `res` 更大，這與 `res` 是最大解矛盾，因此假設不成立，得證物品 x 必定在最大解中。

總是用當下單位價值最高的物品填滿背包，最後沒有留下任何空隙。每一份背包空間，都是最有價值的物品，就算是交換物品也無法增加總價值。因此，我們的 greedy 策略是正確的。

## 總結

貪婪演算法是一種求解最佳化問題的策略，其核心思想是在每一步都做出當前看似最好的選擇，希望這樣最終能達到全局最優解。然而，貪婪演算法並不是萬能的。與動態規劃相比，它有其明顯的優缺點。

優點：

1. **實作簡單**：貪婪演算法通常很直觀，實作相對簡單。
2. **計算效率高**：在許多情況下，貪婪演算法可以提供更快的解決方案。
3. **近似解**：即使貪婪演算法不能保證找到最佳解，也常常能找到近似最佳解。

缺點：

1. **局限性**：貪婪演算法不適用於所有問題，特別是當問題不滿足貪婪選擇性質（Greedy Choice Property）和最佳子結構（Optimal Substructure）時。
2. **正確性證明複雜**：不是所有問題都容易證明其貪婪選擇性質，這增加了使用貪婪演算法的風險。
3. **局部最佳與全局最佳的衝突**：在某些情況下，貪婪演算法可能僅找到局部最佳解而非全局最佳解。

## 參考資料

- [貪心算法](https://www.hello-algo.com/chapter_greedy/greedy_algorithm/)
- [演算法筆記](https://web.ntnu.edu.tw/~algo/AlgorithmDesign.html)
- [《Learning JavaScript Data Structures and Algorithms, 3/e》](https://www.tenlong.com.tw/products/9781788623872?list_name=trs-f)
