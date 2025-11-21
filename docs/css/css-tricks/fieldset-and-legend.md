---
outline: deep
---

# `<fieldset>` 與 `<legend>` 標籤
> 參考資料：[生僻標籤fieldset 與legend 的妙用](https://segmentfault.com/a/1190000039079630)

`<fieldset>` 與 `<legend>` 通常會使用在表單當中，fieldset 可以單獨使用，而 legend 則需要和 fieldset 一起使用，作為分組的標題。

* `<fieldset>` 標籤 (tag) 用來對表單 (form) 中的控制元件做分組 (group)
* `<legend>` 標籤通常是 `<fieldset>` 裡面的第一個元素作為該分組的標題 (caption)

## 基本使用

最簡單的例子如下：

```html
<fieldset>
  <legend>Form</legend>
  <div>
    <label>Name :</label><input type="text" />
  </div>
  <div>
    <label>Password :</label><input type="text" />
  </div>
</fieldset>
```

```scss
fieldset {
  border: 1px solid #ddd;
  padding: 12px;
}

legend {
  font-size: 18px;
  font-weight: bold;
  padding: 0 10px;
}

label {
  display: inline-block;
  width: 100px;
  text-align: right;
}

input {
  width: 200px;
  outline: none;
  margin-left: 12px;
  font-size: 14px;
  padding: 4px;
  border: 1px solid #ddd;
  border-radius: 2px;
}
```

![](https://i.imgur.com/uEbhQtn.png)

如果給 `fieldset` 設一個 border，`legend` 將會作為標題嵌入 border 之中。

### 控制 `legend` 的位置和樣式

`legend` 的位置可以透過左右 `margin` 去移動，而給 `legend` 寫左右 `padding` 可以調整標題跟邊框的間隔。

```scss {4-5}
legend {
  font-size: 18px;
  font-weight: bold;
  padding: 0 16px;
  margin: 0 auto;
}
```

![](https://i.imgur.com/a53tYxo.png)

線上 DEMO：

<iframe height="300" style="width: 100%;" scrolling="no" title="fieldset &amp; legend" src="https://codepen.io/SheepNDW/embed/BarvXvE?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true"></iframe>


## 應用場景

### 標題兩側橫線

![](https://i.imgur.com/JCtl5me.png)

以前的做法都是使用偽元素來產生兩側橫線，這裡改用 `fieldset` 和 `legend` 來實作：

```html
<fieldset><legend>排行榜</legend></fieldset>
```

```scss
fieldset {
  width: 300px;
  height: 24px;
  border: 1px solid transparent;
  border-top-color: black; // 只設定 border top 的顏色
  box-sizing: border-box;
}

legend {
  font-size: 16px;
  line-height: 24px;
  margin: auto;
  padding: 0 10px; // 值越大兩側留白就越大
}
```

### 在邊框嵌套文字 Text in Borders

![](https://i.imgur.com/95owz36.png)

<iframe height="300" style="width: 100%;" scrolling="no" title="fieldset &amp; legend 2" src="https://codepen.io/SheepNDW/embed/rNdPBvJ?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true"></iframe>
