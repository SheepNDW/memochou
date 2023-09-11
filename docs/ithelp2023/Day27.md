---
outline: deep
---

# 回溯法 Backtracking (2)

## 排列問題的相關題目

遍歷整個排列樹需要 $O(n!)$ 的時間，因此在遞回函式中，`for` 迴圈不是從 `start` 開始，而是每次都從 `0` 或 `1` 開始，然後通過 `hash` 看某個索引是否被使用過，實現排列效果。

### 全排列問題

這題是 LeetCode [46. Permutations](https://leetcode.com/problems/permutations/) 的原題，給定一個沒有重複數字的整數陣列 `nums`，回傳所有可能的排列。

```txt
Input: nums = [1,2,3]
Output: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
```

直接套用模板，我們需要遞迴函式，透過 `hash` 對某一索引的控制，來讓對應元素加入某一個解，從而實現全排列。實作程式碼如下：

```js
function permute(nums) {
  const result = [];
  const candidate = [];
  const end = nums.length;
  const used = {};

  function backtrack(start) {
    if (start === end) {
      result.push([...candidate]);
    } else {
      for (let i = 0; i < end; i++) {
        if (!used[i]) {
          candidate.push(nums[i]);
          used[i] = true;
          backtrack(start + 1);
          candidate.pop();
          used[i] = false;
        }
      }
    }
  }

  backtrack(0);
  return result;
}
```

### 質數圓環

輸入正整數 `n`，把整數 `1~n` 組成一個圓環，使得相鄰兩個數之和都是質數，輸出時從整數 `1` 開始逆時針輸出。同一個圓環應該只輸出一次。`0 < n <= 16`，如圖所示：

<div align="center">
<img src="https://github.com/SheepNDW/data-structures-and-algorithms/raw/main/src/algorithms/backtracking/images/prime-ring.png" width="250px">
<p>Prime Ring Problem</p>
</div>

Example 1:

```txt
input: n = 6
output: 2
explanation:
  1 4 3 2 5 6
  1 6 5 2 3 4
```

Example 2:

```txt
input: n = 8
output: 4
explanation:
  1 2 3 8 5 6 7 4
  1 2 5 8 3 4 7 6
  1 4 7 6 5 8 3 2
  1 6 7 4 3 8 5 2
```

思路：首先我們要搞定質數如何判定的問題。其次是考慮環的意思，即最後一個數與第一個數也會相鄰，他們相加也要是質數。

實作程式碼如下：

```js
const primes = {
  2: true,
  3: true,
};

function isPrime(k) {
  const n = Math.sqrt(k);

  if (primes[k] !== undefined) {
    return primes[k];
  }

  if (k % 2 === 0) {
    return (primes[k] = false);
  }

  for (let i = 3; i <= n; i++) {
    if (k % i === 0) {
      return (primes[k] = false);
    }
  }

  return (primes[k] = true);
}

function getPrimeCircle(n) {
  const array = [1];
  const used = {};
  let count = 0;

  function backtrack(start) {
    if (start === n) {
      if (isPrime(array[0] + array[n - 1])) {
        count++;
      }
    } else {
      for (let i = 2; i <= n; i++) {
        // 條件為沒有使用過且前一個數值與下一個 i+1 的和為質數
        if (!used[i]) {
          used[i] = true;
          if (isPrime(array[start - 1] + i)) {
            array[start] = i;
            backtrack(start + 1);
          }
          used[i] = false;
        }
      }
    }
  }

  backtrack(1);
  return count;
}
```

### Scheduling

工廠有 `n` 份工作，每份工作都分成兩個任務，任務 A 只能在一號機中處理，任務 B 只能在二號機處理，並且每份工作只有完成任務 A 之後才能處理任務 B。每份工作的 A、B 任務在兩個機器上的處理時間都不同。對於一個確定的工作排程，假設 `Fji` 是工作 `i` 在機器 `j` 上完成處理的時間，則所有工作在二號機上完成處理的時間總和稱為該工作排程的完成時間和。

現在希望你能找出一個最佳排程，使得完成時間和最小。

Example:

```txt
input: 
n = 3 // 參數 1 為工作數
timeA = [2,3,2] // 參數 2 為工作 i 在一號機上完成處理的時間
timeB = [1,1,3] // 參數 3 為工作 i 在二號機上完成處理的時間

output:
18 // 最小完成時間和
[0, 2, 1] // 排程順序
```

本題的難點是理解完成時間這個概念。

假設我們有兩份工作，它們總共包含 4 個任務，A1、A2、B1、B2。一號機上的任務不需要等待，A1 完成後就能立即開始處理 A2。二號機需要等到一號機加工出一個任務後才能開始處理，也就是 B1 的開工時間是 A1 的結束時間，它的完成時間是 A1 + B1。A2 的開工時間是 A1 完成時間，它的結束時間就是 A1 + A2，那麼 B2 什麼時候開工呢？它需要等到 A2 與 B1 都完工後才能開始，也就是兩者的最大值，它的完成時間是 `Math.max(A1 + A2, B1) + B2`。

範例中有 3 個作業和 2 個機器，每個機器處理任務的時間如下表所示，如果排程順序分別為任務 1、任務 2、任務 3，根據上面公式我們能算出二號機的完成時間。

| 任務  | 一號機 | 二號機 | 一號機完成時間 | 二號機完成時間 |
| ----- | ------ | ------ | -------------- | -------------- |
| 工作1 | 2      | 1      | 2              | 3              |
| 工作2 | 3      | 1      | 5              | 6              |
| 工作3 | 2      | 3      | 7              | 10             |

那麼完成時間和就是 3 + 6 + 10 = 19。

實作程式碼如下：

```js
function schedule(n, timeA, timeB) {
  let bestTime = Infinity;
  const bestFlow = [];
  const candidate = [];
  const used = {};

  function backtrack(start) {
    if (start === n) {
      let prevA = 0;
      let prevB = 0;
      let time = 0;
      for (let i = 0; i < n; i++) {
        const index = candidate[i];
        const taskA = prevA + timeA[index];
        const taskB = Math.max(taskA, prevB) + timeB[index];
        prevA = taskA;
        prevB = taskB;
        time += taskB;
      }

      if (time < bestTime) {
        bestTime = time;
        bestFlow.length = 0;
        bestFlow.push(...candidate);
      }
    } else {
      for (let i = 0; i < n; i++) {
        if (!used[i]) {
          candidate.push(i);
          used[i] = true;
          backtrack(start + 1);
          used[i] = false;
          candidate.pop();
        }
      }
    }
  }

  backtrack(0);
  console.log('最小完成時間:', bestTime);
  console.log('最佳工作排程:', bestFlow.join(' -> '));
  return [bestTime, bestFlow];
}
```

### 八皇后問題

八皇后問題（Eight Queens Puzzle）是在 1848 年由西洋棋棋手 Max Bezzel 提出的。問題是：在 8x8 的棋盤上，放置 8 個皇后，使得任意兩個皇后都不能在同一行、同一列或同一斜線上（即無法互吃），一共有幾種不同的方法？

<div align="center">
<img src="https://github.com/SheepNDW/data-structures-and-algorithms/raw/main/src/algorithms/backtracking/images/8queens-puzzle.png">
<p>Eight Queens Puzzle</p>
</div>

思路：首先我們要表示皇后的座標，直接的做法是用一個二維陣列來模擬棋盤，放皇后的格子為 1，沒有放的格子為 0。但是從條件可以知道，每一列只能放一個皇后，因此我們可以用一維陣列來表示，`path[col] = row`，表示這個位於 `row` 列的皇后，其所在的行爲 `col`。

接著我們要判定兩個格子是否在同一條線上，由於每個皇后所在的列都不一樣，因此不需要判斷列所在的線，我們只需要判斷：縱向線、對角線（左上到右下）、反對角線。接下來需要判斷這些線投射到每一列時的列號。縱向線不用多說，直接取其 `y` 座標，對角線是 `x` 座標 - `y` 座標的相反數，反對角線是 `x` 座標 + `y` 座標。如下圖所示：

<div align="center">
<img src="https://github.com/SheepNDW/data-structures-and-algorithms/raw/main/src/algorithms/backtracking/images/8queens-puzzle-2.png" width="550px">
<p>Eight Queens Puzzle 2</p>
</div>

實作程式碼如下：

```js
function findQueen() {
  const result = [];
  const path = [];
  const columns = {};
  const mainDiagonal = {};
  const backDiagonal = {};

  function isSafe(row, col) {
    return !columns[col] && !mainDiagonal[-(row - col)] && !backDiagonal[row + col];
  }

  function backtrack(row) {
    if (row === 8) {
      result.push([...path]);
    } else {
      for (let col = 0; col < 8; col++) {
        if (isSafe(row, col)) {
          // 目前位置可以放置
          path[row] = col; // 紀錄放置的位置
          columns[col] = true; // 目前皇后所在位置
          mainDiagonal[-(row - col)] = true; // 主對角線在第一列行號
          backDiagonal[row + col] = true; // 反對角線第一列的行號
          backtrack(row + 1);
          // 回溯
          path[row] = undefined;
          columns[col] = false;
          mainDiagonal[-(row - col)] = false;
          backDiagonal[row + col] = false;
        }
      }
    }
  }

  backtrack(0);
  return result.length;
}
```

## 參考資料

- [《JavaScript 算法：基本原理與代碼實現》](https://www.tenlong.com.tw/products/9787115596154?list_name=r-zh_cn)
- [演算法筆記 - Backtracking](https://web.ntnu.edu.tw/~algo/Backtracking.html)
- [裝載問題 - by 司徒正美](https://zhuanlan.zhihu.com/p/84807112)
- [Eight queens puzzle](https://en.wikipedia.org/wiki/Eight_queens_puzzle)
