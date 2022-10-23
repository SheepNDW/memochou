# 圈圈叉叉 (Tic Tac Toe)

JS 小遊戲 - 圈圈叉叉 開發筆記 
* [線上 Demo](https://sheepndw.github.io/Game-Development/002/Vanilla/index.html)
* [原始碼](https://github.com/SheepNDW/Game-Development/tree/master/002)

## 專案簡介
圈圈叉叉 (井字棋)

![](https://i.imgur.com/DoX9BFe.png)

### 功能需求：
* 由叉叉先下再來是圈圈來回交換
* 三點連線或是下滿未分勝負則結束遊戲
* 結束畫面有再來一局功能

### 練習目標：

使用原生 JS 進行第一次開發，再用 Vue 重構一次

## JS 版

html 布局：
```html
<div class="board" id="board">
  <div class="cell" data-cell></div>
  <div class="cell" data-cell></div>
  <div class="cell" data-cell></div>
  <div class="cell" data-cell></div>
  <div class="cell" data-cell></div>
  <div class="cell" data-cell></div>
  <div class="cell" data-cell></div>
  <div class="cell" data-cell></div>
  <div class="cell" data-cell></div>
</div>
<div class="winning-message" id="winningMessage">
  <div data-winning-message-text>X 贏了!</div>
  <button type="button" id="restartButton">再來一局</button>
</div>
```

定義常量資料：
```js
const X_CLASS = 'x'
const CIRCLE_CLASS = 'circle'
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]
```

1. 拿到所有 DOM 元素：
```js
const cellElements = document.querySelectorAll('[data-cell]')
const board = document.getElementById('board')
const restartButton = document.getElementById('restartButton')
const winningMessageElement = document.getElementById('winningMessage')
const winningMessageTextElement = document.querySelector('[data-winning-message-text]')
```

2. 替 cell 掛上點擊事件：
```js
cellElements.forEach(cell => {
  cell.addEventListener('click', handleClick, { once: true })
})
```

3. 定義 `handleClick()`：

```js
let circleTurn

function handleClick(e) {
  // #1 落子 placeMark
  // #2 檢查勝利 Check For Win
  // #3 檢查和局 Check For Draw
  // #4 換人 Switch Turn
  const cell = e.target
  const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS
  placeMark(cell, currentClass)
}
```

4. 定義 `placeMark()`：

```js
function placeMark(cell, currentClass) {
  cell.classList.add(currentClass)
}
```

5. 定義 `swapTurn()`：

```js
function swapTurns() {
  circleTurn = !circleTurn
}
```
```js
function handleClick(e) {
  // #1 落子 placeMark
  // #2 檢查勝利 Check For Win
  // #3 檢查和局 Check For Draw
  // #4 換人 Switch Turn
  const cell = e.target
  const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS
  placeMark(cell, currentClass)
  swapTurns()
}
```
    到這邊已經可以正常地交替落子下滿整個九宮格了，但是會發現到並沒有 hover 效果。

6. 定義 `setBoardHoverClass()`：

```js
function setBoardHoverClass() {
  board.classList.remove(X_CLASS)
  board.classList.remove(CIRCLE_CLASS)
  if (circleTurn) {
    board.classList.add(CIRCLE_CLASS)
  } else {
    board.classList.add(X_CLASS)
  }
}
```

7. 定義 `startGame()` 讓遊戲一開始就會產生 hover 效果：

```js
startGame()

function startGame() {
  circleTurn = false
  cellElements.forEach(cell => {
    cell.addEventListener('click', handleClick, { once: true })
  })
  setBoardHoverClass()
}
```

8. 定義檢查勝利條件的函式：

```js
function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => {
      return cellElements[index].classList.contains(currentClass)
    })
  })
}
// Note: arr.some()只要有其中一個符合就會回傳true 而`arr.every()`則是要全部符合才會回傳true
```
參考連結 [every](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Array/every)、[some](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Array/some)

9. 判斷勝利並新增結束遊戲方法：

```js
function handleClick(e) {
  // 略...

  // 檢查勝利 Check For Win
  if (checkWin(currentClass)) {
    endGame(false)
  } else if (isDraw()) {
    endGame(true)
  } else {
    swapTurns()
    setBoardHoverClass()
  }  
}
```

```js
function endGame(draw) {
  if (draw) {
    winningMessageTextElement.innerText = '和局!'
  } else {
    winningMessageTextElement.innerText = `${circleTurn ? 'O ' : 'X '}贏了!`
  }
  winningMessageElement.classList.add('show')
}
```

10. 判斷和局，做法和檢查勝利雷同：

```js
function isDraw() {
  // Note: 要先將 cellElements 轉為真正的 array 才有 every 方法
  return [...cellElements].every(cell => {
    return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)
  })
}
```

11. 再來一局功能：

```js
restartButton.addEventListener('click', startGame)

function startGame() {
  circleTurn = false
  cellElements.forEach(cell => {
    cell.classList.remove(X_CLASS)
    cell.classList.remove(CIRCLE_CLASS)
    cell.removeEventListener('click', handleClick)
    cell.addEventListener('click', handleClick, { once: true })
  })
  setBoardHoverClass()
  winningMessageElement.classList.remove('show')
}
```

## Vue 版

### html重構：

```html
<div id="app">
  <div class="board" :class="[isXTurn ? 'x' : 'circle']">
    <div
      :ref="setCellRefs"
      class="cell"
      v-for="cell in cells"
      :key="cell.key"
      @click.once="handleClick"
    ></div>
  </div>
  <div class="winning-message" :class="{show: isShowRestart}">
    <div>{{ winningMessageText }}</div>
    <button type="button" @click="startGame">再來一局</button>
  </div>
</div>
```

### JS 部分：

#### 模板引用 ([參考連結](https://v3.cn.vuejs.org/guide/composition-api-template-refs.html#v-for-%E4%B8%AD%E7%9A%84%E7%94%A8%E6%B3%95))
在 Vue3 中要在 v-for 中使用 refs 的話需要透過函式的方式取得，並使用`onBeforeUpdate()`在每一次重新渲染的時候可以再次獲取所有的 cell
```js
const useCheckWin = () => {
  let cellRefs = []
  const setCellRefs = (el) => {
    if (el) cellRefs.push(el)
  }
  onBeforeUpdate(() => cellRefs = [])

  const checkWin = (currentClass) => {
    return WINNING_COMBINATIONS.some(combination => {
      return combination.every(index => {
        return cellRefs[index].classList.contains(currentClass)
      })
    })
  }
  const isDraw = () => {
    return cellRefs.every(cell => {
      return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)
    })
  }

  return {
    setCellRefs,
    checkWin,
    isDraw
  }
}
```

#### 重置 v-for 渲染出的 cell 上的點擊事件：
由於我在 @click 有下 .once 修飾子，如果只是把 cell 上的 class 清除會出現空格無法點擊的情況發生，但是在 Vue 裡又不能像原生 JS 那樣直接操縱 cell 去 removeEventListener 或 addEventListener，於是這裡我的解法就是去讓 v-for 重新渲染，這樣就能做到一樣的效果。

使用更新 key 值實現 v-for 的重新渲染：

```js
// #1 替 cells 列表新增 key 值
const cells = ref([
  { key: '1' },
  { key: '2' },
  { key: '3' },
  { key: '4' },
  { key: '5' },
  { key: '6' },
  { key: '7' },
  { key: '8' },
  { key: '9' }
])

// #2 將 key 值改變，vue 發現到唯一的 key 值出現變化後就會重新執行 v-for
const reRenderCells = () => {
  cells.value.forEach((cell, i) => {
    cells.value[i].key = cells.value[i].key + '1'
  })
}

return {
  cells,
  reRenderCells
}
```