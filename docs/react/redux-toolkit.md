---
outline: deep
---

# Redux Toolkit（RTK）

> Reference：
> - [PJChender RTK 筆記](https://pjchender.dev/react/redux-toolkit/#3-provide-the-redux-store-to-react-indexts)
> - [Redux Toolkit quick start](https://redux-toolkit.js.org/tutorials/quick-start)

## 在 React 中使用 RTK

- 安裝

```sh
# npm
npm install react-redux @reduxjs/toolkit

# pnpm
pnpm add react-redux @reduxjs/toolkit
```

- 建立 Redux Store

在 `src` 資料夾下新增一個 `store` 資料夾並建立一支 `index.js` 檔案

```js
import { configureStore } from '@reduxjs/toolkit';

// 使用 configureStore api 建立一個 store
const store = configureStore({
  reducer: {
    // ...
  },
});

export default store;
```

- 把 Redux Store 提供給整個 React App 使用

使用 `Provider` 把 App 給包起來，並把剛才建立的 `store` 給傳入到 `Provider` 裡，然後就可以在元件內部去使用了

```js
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

import store from './store' // [!code ++]
import { Provider } from 'react-redux' // [!code ++]

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}> // [!code ++]
      <App />
    </Provider> // [!code ++]
  </React.StrictMode>
)
```

## createSlice

createSlice 需要一個物件作為參數，物件中透過不同的屬性來指定 `reducer` 的設定訊息。

語法：`createSlice(configuration)`

configuration 的屬性：

- `name`：reducer 的名字，會作為 action 中 type 屬性的前綴，不要重複
- `initialState`：state的初始值
- `reducers`： reducer 的具體方法，需要一個物件作為參數，可以以方法的形式添加 reducer，RTK 會自動產生 action 物件

範例：

```js
import { createSlice } from '@reduxjs/toolkit';

const playerSlice = createSlice({
  name: 'player',
  initialState: {
    name: 'Faker',
    lane: 'mid',
    age: 26,
  },
  reducers: {
    setName(state, action) {
      state.name = action.payload;
    },
    setLane(state, action) {
      state.lane = action.payload;
    },
    setAge(state, action) {
      state.age = action.payload;
    },
  },
});
```

createSlice 回傳的並不是一個 reducer 物件而是一個 slice 物件（切片物件）。這個物件中我們需要使用的屬性現在有兩個一個叫做 `actions`，一個叫做 `reducer`。

### Actions

slice 物件會根據我們物件中的 reducers 方法來自動建立 action 物件，這些 action 物件會儲存到 slice 物件 `actions` 屬性中：

```js
// action 物件結構: { type: 'name/函式名', payload: 函式參數 }
export const { setName, setLane, setAge } = playerSlice.actions;
```

開發時會將這些取出的 action 物件作為向外匯出，再其他元件直接匯入這些 action，然後即可透過 action 來觸發 reducer

### Reducer

slice 的 reducer 屬性是 slice 根據我們傳遞的方法自動建立生成的 reducer，需要將其作為 reducer 傳遞進 configureStore 的設定物件中以使其生效：

```js
// playerSlice.js
export default playerSlice.reducer;

// store/index.js
import playerReducer from './playerSlice';

const store = configureStore({
  reducer: {
    player: playerReducer,
  },
});
```

## 在元件中使用 Redux Store

範例：

```js
import { useDispatch, useSelector } from 'react-redux';
import { setLane, setName } from './store/playerSlice';

const App = () => {
  // useSelector() 載入 store 中的資料
  const player = useSelector((state) => state.player);

  // useDispatch() 取得 dispatch 方法來觸發 reducer
  const dispatch = useDispatch();

  const setNameHandler = () => {
    dispatch(setName('sheep'));
  };

  const setLaneHandler = () => {
    dispatch(setLane('sup'));
  };

  return (
    <div>
      <p>
        {player.name} - {player.age} - {player.lane}
      </p>
      <button onClick={setNameHandler}>改名</button>
      <button onClick={setLaneHandler}>改路</button>
    </div>
  );
};

export default App;
```
