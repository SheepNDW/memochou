# 剪刀、石頭、布 (Rock paper scissors)

JS 小遊戲 - 剪刀石頭布 開發筆記 
* [線上 Demo](https://sheepndw.github.io/Game-Development/001/Vanilla/index.html)
* [原始碼](https://github.com/SheepNDW/Game-Development/tree/master/001)

## 專案簡介

剪刀石頭布小遊戲

![](https://i.imgur.com/6DS0jhp.png)

### 功能需求：
* 玩家選擇一種拳打出，電腦會隨機選一種出
* 將每回合的結果印在畫面上並記錄分數
* 最新的一回合會渲染在最前方

### 練習目標：

使用原生 JS 進行第一次開發，再用 Vue 重構一次

## JS 版

HTML布局部分為：
```html
  <div class="selections">
    <button type="button" class="selection" data-selection="rock">✊</button>
    <button type="button" class="selection" data-selection="paper">✋</button>
    <button type="button" class="selection" data-selection="scissors">✌️</button>
  </div>
  <div class="results">
    <div>
      You
      <span class="result-score" data-your-score>0</span>
    </div>
    <div data-final-column>
      Computer
      <span class="result-score" data-computer-score>0</span>
    </div>
  </div>
```

第一步先獲取所有 DOM 元素
```javascript
const selectionButtons = document.querySelectorAll('[data-selection]')
const finalColumn = document.querySelector('[data-final-column]')
const computerScoreSpan = document.querySelector('[data-computer-score]')
const yourScoreSpan = document.querySelector('[data-your-score]')
```

再來定義一個常量資料記錄三種拳的資訊
```javascript
const SELECTIONS = [
  {
    name: 'rock',
    emoji: '✊',
    beats: 'scissors'
  },
  {
    name: 'paper',
    emoji: '✋',
    beats: 'rock'
  },
  {
    name: 'scissors',
    emoji: '✌️',
    beats: 'paper'
  }
]
```

遍歷所有按鈕並掛上事件偵聽器綁定一個點擊事件
```javascript
selectionButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    const selectionName = button.dataset.selection
    const selection = SELECTIONS.find(selection => selection.name === selectionName)
    // 將玩家的選擇當作 makeSelection 的參數傳入
    makeSelection(selection)
  })
})
```

接下來要定義核心的方法
```javascript
function makeSelection(selection) {
  // 需求：
  // #1 取得電腦的選擇
  // #2 檢查雙方是否獲勝
  // #3 將結果渲染到畫面
  // #4 計算得分
}
```

1. 取得電腦的選擇 `randomSelection()`

    ```javascript
    function randomSelection() {
      const randomIndex = Math.floor(Math.random() * SELECTIONS.length)
      return SELECTIONS[randomIndex]
    }
    ```
2. 檢查是否獲勝 `isWinner()`

    ```javascript
    function isWinner(selection, opponentSelection) {
      return selection.beats === opponentSelection.name
    }
    ```
3. 將結果渲染到畫面 `addSelectionResult()`

    ```javascript
    function addSelectionResult(selection, winner) {
      const div = document.createElement('div')
      div.innerText = selection.emoji
      div.classList.add('result-selection')
      if (winner) div.classList.add('winner')
        
      // 將生成的 div 透過 after() 插入到 data-final-column 的後面
      finalColumn.after(div)
    }
    ```
4. 計算得分 `incrementScore()`

    ```javascript
    function incrementScore(scoreSpan) {
      scoreSpan.innerText = parseInt(scoreSpan.innerText) + 1
    }
    ```

完成業務：
```javascript
function makeSelection(selection) {
  const computerSelection = randomSelection()
  const yourWinner = isWinner(selection, computerSelection)
  const computerWinner = isWinner(computerSelection, selection)

  // 註: 要從後面插入，所以要將電腦的結果先渲染在畫面
  addSelectionResult(computerSelection, computerWinner)
  addSelectionResult(selection, yourWinner)

  if (yourWinner) incrementScore(yourScoreSpan)
  if (computerWinner) incrementScore(computerScoreSpan)
}
```

## Vue 版
在透過 Vue 重構此專案時沒注意踩了一個坑，由於是透過 v-for 遍歷所有結果的，如果沒有掛上<font color="#AE3C3E">**唯一的 key 值**</font>會出現 bug。所以我額外引入了 nanoid 套件替每回合的結果掛上唯一的 id 值。

### HTML的重構：
```html
  <div id="app">
    <div class="selections">
      <button 
        type="button" 
        class="selection" 
        v-for="item in SELECTIONS" :key="item.name" 
        @click="makeSelection(item)"
      >
        {{ item.emoji }}
      </button>
    </div>
    <div class="results">
      <div>
        You
        <span class="result-score">{{ yourScore }}</span>
      </div>
      <div>
        Computer
        <span class="result-score">{{ computerScore }}</span>
      </div>
      <div 
        class="result-selection" 
        :class="{winner: result?.winner}" 
        v-for="(result) in results" :key="result.id"
      >
        {{ result.emoji }}
      </div>
    </div>
  </div>
```

### JS 的重構：
引入 Vue 3 CDN 來開發
```javascript
import { createApp, ref } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.31/vue.esm-browser.min.js'
import { nanoid } from 'https://cdn.jsdelivr.net/npm/nanoid/nanoid.js'

const app = createApp({
  setup() {
    const SELECTIONS = [
      {
        name: 'rock',
        emoji: '✊',
        beats: 'scissors'
      },
      {
        name: 'paper',
        emoji: '✋',
        beats: 'rock'
      },
      {
        name: 'scissors',
        emoji: '✌️',
        beats: 'paper'
      }
    ]

    const yourScore = ref(0)
    const computerScore = ref(0)
    const results = ref([])

    // player's choice
    const makeSelection = (selection) => {
      // #1 得到雙方出的拳資料
      const yourSelection = { ...selection }
      const computerSelection = randomSelection()

      // #2 檢查是否獲勝
      const yourWinner = isWinner(yourSelection, computerSelection)
      const computerWinner = isWinner(computerSelection, yourSelection)

      // #3 將結果推入 results
      // #3-1 將獲勝者加上 winner 屬性
      if (yourWinner) {
        yourSelection.winner = true
        yourScore.value++
      }
      if (computerWinner) {
        computerSelection.winner = true
        computerScore.value++
      }

      // #3-2 將結果掛上唯一 id
      yourSelection.id = nanoid()
      computerSelection.id = nanoid()

      // #3-3 插入到陣列
      results.value.unshift(computerSelection)
      results.value.unshift(yourSelection)
    }

    // computer's choice (random)
    const randomSelection = () => {
      const randomIndex = Math.floor(Math.random() * SELECTIONS.length)
      return { ...SELECTIONS[randomIndex] }
    }

    // check win
    const isWinner = (selection, opponentSelection) => {
      return selection.beats === opponentSelection.name
    }


    return {
      SELECTIONS,
      yourScore,
      computerScore,
      results,
      makeSelection
    }
  }
})

app.mount('#app')
```

### 注意點：
由於物件的傳參考特性，如果不把傳入的選擇或是電腦隨機的選擇做一個拷貝，會造成 SELECTIONS 的資料遭到修改導致動態加入的 id 被寫進去造成遊戲崩潰，所以要先進行複製後再將結果推進 results 陣列中去做列表渲染。


## 參考來源：

[Web Dev Simplified](https://youtu.be/1yS-JV4fWqY)
