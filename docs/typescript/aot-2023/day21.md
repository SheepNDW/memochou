---
outline: [1,3]
---

# Day Twenty One

> https://typehero.dev/challenge/day-21

## 題目

### What is Tic Tac Toe?

Tic-Tac-Toe is a two-player game where players alternate marking `❌`s and `⭕`s in a 3x3 grid, aiming to get three in a row.

fun fact: Did you know that tic tac toe is widely considered to be the first computer video game ever created?! That's right! A S Douglas implemented it all the way back in 1952, the same year as the coronation of Queen Elizabeth II.

### Solving Tic Tac Toe

Your goal for this challenge is to use TypeScript types to encode the game logic of Tic Tac Toe. Eventually, every game will end with one of the players winning or a draw.

### Test Cases & Initial code

::: code-group

```ts [init]
type TicTacToeChip = '❌' | '⭕';
type TicTacToeEndState = '❌ Won' | '⭕ Won' | 'Draw';
type TicTacToeState = TicTacToeChip | TicTacToeEndState;
type TicTacToeEmptyCell = '  '
type TicTacToeCell = TicTacToeChip | TicTacToeEmptyCell;
type TicTacToeYPositions = 'top' | 'middle' | 'bottom';
type TicTacToeXPositions = 'left' | 'center' | 'right';
type TicTacToePositions = `${TicTacToeYPositions}-${TicTacToeXPositions}`;
type TicTactToeBoard = TicTacToeCell[][];
type TicTacToeGame = {
  board: TicTactToeBoard;
  state: TicTacToeState;
};

type EmptyBoard = [
  ['  ', '  ', '  '], 
  ['  ', '  ', '  '], 
  ['  ', '  ', '  ']
];

type NewGame = {
  board: EmptyBoard;
  state: '❌';
};

type TicTacToe = unknown;
```

```ts [Tests]
import { Equal, Expect } from 'type-testing';

type test_move1_actual = TicTacToe<NewGame, 'top-center'>;
//   ^?
type test_move1_expected = {
  board: [
    [ '  ', '❌', '  ' ],
    [ '  ', '  ', '  ' ],
    [ '  ', '  ', '  ' ]
  ];
  state: '⭕';
};
type test_move1 = Expect<Equal<test_move1_actual, test_move1_expected>>;

type test_move2_actual = TicTacToe<test_move1_actual, 'top-left'>;
//   ^?
type test_move2_expected = {
  board: [
    ['⭕', '❌', '  '], 
    ['  ', '  ', '  '], 
    ['  ', '  ', '  ']];
  state: '❌';
}
type test_move2 = Expect<Equal<test_move2_actual, test_move2_expected>>;

type test_move3_actual = TicTacToe<test_move2_actual, 'middle-center'>;
//   ^?
type test_move3_expected = {
  board: [
    [ '⭕', '❌', '  ' ],
    [ '  ', '❌', '  ' ],
    [ '  ', '  ', '  ' ]
  ];
  state: '⭕';
};
type test_move3 = Expect<Equal<test_move3_actual, test_move3_expected>>;

type test_move4_actual = TicTacToe<test_move3_actual, 'bottom-left'>;
//   ^?
type test_move4_expected = {
  board: [
    [ '⭕', '❌', '  ' ],
    [ '  ', '❌', '  ' ],
    [ '⭕', '  ', '  ' ]
  ];
  state: '❌';
};
type test_move4 = Expect<Equal<test_move4_actual, test_move4_expected>>;


type test_x_win_actual = TicTacToe<test_move4_actual, 'bottom-center'>;
//   ^?
type test_x_win_expected = {
  board: [
    [ '⭕', '❌', '  ' ],
    [ '  ', '❌', '  ' ],
    [ '⭕', '❌', '  ' ]
  ];
  state: '❌ Won';
};
type test_x_win = Expect<Equal<test_x_win_actual, test_x_win_expected>>;

type type_move5_actual = TicTacToe<test_move4_actual, 'bottom-right'>;
//   ^?
type type_move5_expected = {
  board: [
    [ '⭕', '❌', '  ' ],
    [ '  ', '❌', '  ' ],
    [ '⭕', '  ', '❌' ]
  ];
  state: '⭕';
};
type test_move5 = Expect<Equal<type_move5_actual, type_move5_expected>>;

type test_o_win_actual = TicTacToe<type_move5_actual, 'middle-left'>;
//   ^?
type test_o_win_expected = {
  board: [
    [ '⭕', '❌', '  ' ],
    [ '⭕', '❌', '  ' ],
    [ '⭕', '  ', '❌' ]
  ];
  state: '⭕ Won';
};

// invalid move don't change the board and state
type test_invalid_actual = TicTacToe<test_move1_actual, 'top-center'>;
//   ^?
type test_invalid_expected = {
  board: [
    [ '  ', '❌', '  ' ],
    [ '  ', '  ', '  ' ],
    [ '  ', '  ', '  ' ]
  ];
  state: '⭕';
};
type test_invalid = Expect<Equal<test_invalid_actual, test_invalid_expected>>;

type test_before_draw = {
  board: [
    ['⭕', '❌', '⭕'], 
    ['⭕', '❌', '❌'], 
    ['❌', '⭕', '  ']];
  state: '⭕';
}
type test_draw_actual = TicTacToe<test_before_draw, 'bottom-right'>;
//   ^?
type test_draw_expected = {
  board: [
    ['⭕', '❌', '⭕'], 
    ['⭕', '❌', '❌'], 
    ['❌', '⭕', '⭕']];
  state: 'Draw';
}
type test_draw = Expect<Equal<test_draw_actual, test_draw_expected>>;
```

:::


## 實作

### 思路：

回傳的型別格式是一個類似這樣的物件：

```ts
{
  board: [
    [ '  ', '❌', '  ' ],
    [ '  ', '  ', '  ' ],
    [ '  ', '  ', '  ' ]
  ];
  state: '⭕';
}
// or
{
  board: [
    [ '⭕', '❌', '  ' ],
    [ '  ', '❌', '  ' ],
    [ '⭕', '❌', '  ' ]
  ];
  state: '❌ Won';
}
```

可以拆成兩個工具型別分別去計算，當成在寫函式一樣：

1. 落字 - `SetChip`
    - 在棋盤上新增棋子，如果是空格就新增，不是就不動作。
2. 計算狀態 - `CalculateState`
    - 如果還沒結束，則顯示下一個玩家，如果結束了，則顯示勝利者或平手。

```ts
type TicTacToe<
  T extends TicTacToeGame,
  U extends TicTacToePositions
> = {
  board: SetChip<T['board'],Split<U>,T['state']>;
  state: CalculateState<T['board'],SetChip<T['board'],Split<U>,T['state']>, T['state']>
};
```

### 實作 `SetChip<Board, Position, State>`

接收三個型別參數：`棋盤`、`落子位置`、`目前狀態`。

落子的格式是一個字串，格式是先決定列，再決定行，例如 `top-center` 就是第一列的中間。所以我們可以將字串拆成 `['top','center']`，再依照這兩個值去找出對應的位置，並且判斷是否為空格，如果是就落子，不是就不動作。

這邊需要一個額外的工具型別 `Split`，用來將字串拆成陣列。

```ts
type Split<T extends string> = T extends `${infer Y}-${infer X}`
  ? [Y, X]
  : never  
;
```

然後就可以來實作 `SetChip` 了：

```ts
type SetChip<
  Board extends TicTactToeBoard,
  Position extends [TicTacToeYPositions, TicTacToeXPositions],
  Chip extends TicTacToeState
> =
  Chip extends TicTacToeChip
  ? Position[0] extends 'top'
    ? [
        setChipRow<Board[0], Position[1], Chip>,
        Board[1],
        Board[2]
      ]
    : Position[0] extends 'middle'
      ? [
          Board[0],
          setChipRow<Board[1], Position[1], Chip>,
          Board[2]
        ]
      : [
          Board[0],
          Board[1],
          setChipRow<Board[2], Position[1], Chip>
        ]
  : Board
;
```

首先 `Chip` 是狀態，我們必須要確保他是 `TicTacToeChip`，也就是 `❌` 或 `⭕`，如果不是就代表已經結束了，直接回傳 `Board`。

然後是 `Position`，他代表的是座標 `[row, col]`，我們透過 `Position[0]` 找出他是在哪一列，再利用 `setChipRow` 來處理。

#### `setChipRow`

接收三個型別參數：`棋盤的某一列`、`落子位置 (X座標)`、`棋子`。

```ts
type setChipRow<
  Row extends TicTacToeCell[],
  X extends TicTacToeXPositions,
  Chip extends TicTacToeChip
> =
  X extends 'left'
  ? Row[0] extends '  '
    ? [Chip, Row[1], Row[2]]
    : Row
  : X extends 'center'
    ? Row[1] extends '  '
      ? [Row[0], Chip, Row[2]]
      : Row
    : Row[2] extends '  '
      ? [Row[0], Row[1], Chip]
      : Row
;
```

### 實作 `CalculateState<Board, NewBoard, State>`

最後是實作計算狀態的工具型別，接收三個型別參數：`棋盤`、`落子後的棋盤`、`目前狀態`。

```ts
type CalculateState<
  Board extends TicTactToeBoard,
  NewBoard extends TicTactToeBoard,
  State extends TicTacToeState
> =
  CountChips<Board> extends CountChips<NewBoard>
  ? State
  : IsNever<CheckWinner<NewBoard>> extends true  
    ? IsBoardFull<NewBoard> extends true
      ? 'Draw'
      : State extends TicTacToeChip
        ? GetNextChip<State>
        : State
    : `${CheckWinner<NewBoard>} Won`
;
```

首先，如果 `Board` 和 `NewBoard` 的棋子數量一樣，代表沒有成功落子，所以狀態不變。

接著，如果 `NewBoard` 沒有勝利者，則判斷是否平手，如果是平手就回傳 `Draw`，如果不是平手，則回傳下一個玩家，有勝利者就回傳勝利者。

#### `CountChips`

計算棋盤上的棋子數量，接收一個棋盤，回傳一個數字。

```ts
type CountChips<
  Board extends TicTactToeBoard,
  Acc extends 1[] = []
> =
  Board extends [infer Row, ...infer Rest extends TicTactToeBoard]
  ? Row extends TicTacToeCell[]
    ? CountChips<Rest, [...Acc, ...CountRow<Row>]>
    : never
  : Acc['length']
;

type CountRow<
  Row extends TicTacToeCell[],
  Acc extends 1[] = []
> =
  Row extends [infer Cell, ...infer Rest extends TicTacToeCell[]]
  ? Cell extends TicTacToeChip
    ? CountRow<Rest, [...Acc, 1]>
    : CountRow<Rest, Acc>
  : Acc
;
```

#### `IsNever`

判斷是否為 `never`，接收一個型別，回傳一個布林值。

```ts
type IsNever<T> = [T] extends [never] ? true : false;
```

#### `CheckWinner`

判斷是否有勝利者，接收一個棋盤，回傳一個勝利者或 `never`。

```ts
type CheckWinner<Board extends TicTactToeBoard> =
  Board extends [infer Row1 extends TicTacToeCell[], infer Row2 extends TicTacToeCell[], infer Row3 extends TicTacToeCell[]]
  ? | IsLine<Row1>
    | IsLine<Row2>
    | IsLine<Row3>
    | IsLine<[Row1[0], Row2[0], Row3[0]]>
    | IsLine<[Row1[1], Row2[1], Row3[1]]>
    | IsLine<[Row1[2], Row2[2], Row3[2]]>
    | IsLine<[Row1[0], Row2[1], Row3[2]]>
    | IsLine<[Row1[2], Row2[1], Row3[0]]>
  : never
;

type IsLine<Row extends TicTacToeCell[]> =
  Row extends [infer First extends TicTacToeChip, infer Second, infer Third]
  ? First extends Second 
    ? Second extends Third
      ? First 
      : never 
    : never
  : never
;
```

#### `IsBoardFull`

判斷棋盤是否已經下滿，接收一個棋盤，回傳一個布林值。

```ts
type IsBoardFull<Board extends TicTactToeBoard> =
  Board extends [TicTacToeChip[],TicTacToeChip[],TicTacToeChip[]]
  ? true
  : false
;
```

#### `GetNextChip`

取得下一個玩家，接收一個棋子，回傳另一個棋子。

```ts
type GetNextChip<T extends TicTacToeChip> = T extends '❌' ? '⭕' : '❌';
```

## 完整程式碼

```ts
type TicTacToeChip = '❌' | '⭕';
type TicTacToeEndState = '❌ Won' | '⭕ Won' | 'Draw';
type TicTacToeState = TicTacToeChip | TicTacToeEndState;
type TicTacToeEmptyCell = '  '
type TicTacToeCell = TicTacToeChip | TicTacToeEmptyCell;
type TicTacToeYPositions = 'top' | 'middle' | 'bottom';
type TicTacToeXPositions = 'left' | 'center' | 'right';
type TicTacToePositions = `${TicTacToeYPositions}-${TicTacToeXPositions}`;
type TicTactToeBoard = TicTacToeCell[][];
type TicTacToeGame = {
  board: TicTactToeBoard;
  state: TicTacToeState;
};

type EmptyBoard = [
  ['  ', '  ', '  '], 
  ['  ', '  ', '  '], 
  ['  ', '  ', '  ']
];

type NewGame = {
  board: EmptyBoard;
  state: '❌';
};

// ==== Utils ====
type IsNever<T> = [T] extends [never] ? true : false;
type Split<T extends string> = T extends `${infer Y}-${infer X}`
  ? [Y, X]
  : never  
;


type TicTacToe<
  T extends TicTacToeGame,
  U extends TicTacToePositions
> = {
  board: SetChip<T['board'],Split<U>,T['state']>;
  state: CalculateState<T['board'],SetChip<T['board'],Split<U>,T['state']>, T['state']>
};

type SetChip<
  Board extends TicTactToeBoard,
  Position extends [TicTacToeYPositions, TicTacToeXPositions],
  Chip extends TicTacToeState
> =
  Chip extends TicTacToeChip
  ? Position[0] extends 'top'
    ? [
        setChipRow<Board[0], Position[1], Chip>,
        Board[1],
        Board[2]
      ]
    : Position[0] extends 'middle'
      ? [
          Board[0],
          setChipRow<Board[1], Position[1], Chip>,
          Board[2]
        ]
      : [
          Board[0],
          Board[1],
          setChipRow<Board[2], Position[1], Chip>
        ]
  : Board
;

type setChipRow<
  Row extends TicTacToeCell[],
  X extends TicTacToeXPositions,
  Chip extends TicTacToeChip
> =
  X extends 'left'
  ? Row[0] extends '  '
    ? [Chip, Row[1], Row[2]]
    : Row
  : X extends 'center'
    ? Row[1] extends '  '
      ? [Row[0], Chip, Row[2]]
      : Row
    : Row[2] extends '  '
      ? [Row[0], Row[1], Chip]
      : Row
;

type CalculateState<
  Board extends TicTactToeBoard,
  NewBoard extends TicTactToeBoard,
  State extends TicTacToeState
> =
  CountChips<Board> extends CountChips<NewBoard>
  ? State
  : IsNever<CheckWinner<NewBoard>> extends true  
    ? IsBoardFull<NewBoard> extends true
      ? 'Draw'
      : State extends TicTacToeChip
        ? GetNextChip<State>
        : State
    : `${CheckWinner<NewBoard>} Won`
;

type CheckWinner<Board extends TicTactToeBoard> =
  Board extends [infer Row1 extends TicTacToeCell[], infer Row2 extends TicTacToeCell[], infer Row3 extends TicTacToeCell[]]
  ? | IsLine<Row1>
    | IsLine<Row2>
    | IsLine<Row3>
    | IsLine<[Row1[0], Row2[0], Row3[0]]>
    | IsLine<[Row1[1], Row2[1], Row3[1]]>
    | IsLine<[Row1[2], Row2[2], Row3[2]]>
    | IsLine<[Row1[0], Row2[1], Row3[2]]>
    | IsLine<[Row1[2], Row2[1], Row3[0]]>
  : never
;

type IsLine<Row extends TicTacToeCell[]> =
  Row extends [infer First extends TicTacToeChip, infer Second, infer Third]
  ? First extends Second 
    ? Second extends Third
      ? First 
      : never 
    : never
  : never
;

type IsBoardFull<Board extends TicTactToeBoard> =
  Board extends [TicTacToeChip[],TicTacToeChip[],TicTacToeChip[]]
  ? true
  : false
;

type GetNextChip<T extends TicTacToeChip> = T extends '❌' ? '⭕' : '❌';

type CountChips<
  Board extends TicTactToeBoard,
  Acc extends 1[] = []
> =
  Board extends [infer Row, ...infer Rest extends TicTactToeBoard]
  ? Row extends TicTacToeCell[]
    ? CountChips<Rest, [...Acc, ...CountRow<Row>]>
    : never
  : Acc['length']
;

type CountRow<
  Row extends TicTacToeCell[],
  Acc extends 1[] = []
> =
  Row extends [infer Cell, ...infer Rest extends TicTacToeCell[]]
  ? Cell extends TicTacToeChip
    ? CountRow<Rest, [...Acc, 1]>
    : CountRow<Rest, Acc>
  : Acc
;
```

## 寫在最後：

過程其實一直當成一般 js 去梳理邏輯，幸好還是成功解出來了，這半年辛苦刷 Type Challenges 的成果終於有了一點點回饋，感覺挺好的。
最後就是我從來沒想過還能用 TicTacToe 來跳型別體操，~~就離譜~~。
