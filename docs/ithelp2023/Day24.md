# 排序總結

過去一週裡我們提到了 9 種排序演算法，也提了一些各自的變化版本，現在讓我們簡單回顧一下這些排序法以及最早在介紹 Heap 時提到過的 Heap Sort。 

- Bubble Sort：

雙重迴圈，每層都從 0 到 n，每次都比較相鄰的兩個元素，如果前面的元素比後面的元素大，就交換位置，整個陣列會從後面開始逐漸排序。

- Selection Sort：

將陣列區分為已排序與未排序兩個部分，前面是已排序的，後面是未排序的。每次從未排序的部分中找出最小的元素，然後放到已排序的部分的最後面，直到全部排序完成。

- Insertion Sort：

也分成已排序與未排序兩個部分。前面為已排序的，每次會從取出未排序的第一個元素放到已排序區間中的適當位置，因此會有一個往後挪坑的過程。在陣列元素比較少的時候，效率會比較好。

- Shell Sort：

選擇一個 gap sequence，透過它每次會將陣列分成幾個子陣列（子陣列中元素不連續，它們間隔為目前的 gap），然後每個子陣列各自排序，最後再將 gap sequence 逐漸縮小，直到 gap 為 1。

- Merge Sort：

分為兩個步驟，分割與合併。將陣列分割到最小單位，然後利用一個時間複雜度為 O(n) 的 merge 函式來合併兩個已排序的陣列，一路合併到最後。

- Heap Sort：

透過將陣列當成一個二元樹，然後透過元素上浮或是下沉的方式來形成一個 max 或 min heap。然後再將根節點取出，進行選擇排序，然後重新調整 heap，重複過程直到全部取出。

- Quick Sort：

透過一個 partition 函式，將陣列分成兩個部分，左邊的部分都比 pivot 小，右邊的部分都比 pivot 大，然後再對左右兩個部分遞迴進行 quick sort。

- Counting Sort：

類似投票的概念，準備足夠的 bucket 來存放元素，每個元素放進與 bucket 編號相同的 bucket 中，bucket 計數加一，最後再根據編號順序將 bucket 中的元素取出。

- Bucket Sort：

容易跟 counting sort 搞混，counting sort 的 bucket 是足夠多的，可以不實際放東西進去，只要計數就好。bucket sort 的 bucket 比較少，每個元素在放進去之前，都需要透過計算來找到自己應該放的位置。在 bucket 內部再進行 insertion sort，最後所有 bucket 合併起來就是排序好的陣列。

- Radix Sort：

透過 LSD（Least Significant Digit）或是 MSD（Most Significant Digit）來進行排序，LSD 是從個位數開始，MSD 是從最高位數開始。每次都會將陣列分成 10 個 bucket，然後根據當前位數的數字來放進對應的 bucket 中，最後再將 bucket 中的元素合併起來。

接著來複習一下各自的複雜度分析：

| Name               |         Average         |     Best      |      Worst       |    Space    |  Method   | Stable |
| ------------------ | :---------------------: | :-----------: | :--------------: | :---------: | :-------: | :----: |
| **Bubble sort**    |        $O(n^2)$         |    $O(n)$     |     $O(n^2)$     |   $O(1)$    | In-place  |  Yes   |
| **Selection sort** |        $O(n^2)$         |   $O(n^2)$    |     $O(n^2)$     |   $O(1)$    | In-place  |   No   |
| **Insertion sort** |        $O(n^2)$         |    $O(n)$     |     $O(n^2)$     |   $O(1)$    | In-place  |  Yes   |
| **Shell sort**     | depends on gap sequence | $O(n\log n)$  | $O(n(\log n)^2)$ |   $O(1)$    | In-place  |   No   |
| **Merge sort**     |      $O(n \log n)$      | $O(n \log n)$ |  $O(n \log n)$   |   $O(n)$    | Out-place |  Yes   |
| **Quick sort**     |      $O(n \log n)$      | $O(n \log n)$ |     $O(n^2)$     | $O(\log n)$ | In-place  |   No   |
| **Heap sort**      |      $O(n \log n)$      | $O(n \log n)$ |  $O(n \log n)$   |   $O(1)$    | In-place  |   No   |
| **Counting sort**  |       $O(n + k)$        |  $O(n + k)$   |    $O(n + k)$    |   $O(k)$    | Out-place |  Yes   |
| **Bucket sort**    |       $O(n + k)$        |  $O(n + k)$   |     $O(n^2)$     | $O(n + k)$  | Out-place |  Yes   |
| **Radix sort**     |        $O(n*k)$         |   $O(n*k)$    |     $O(n*k)$     |  $O(n+k)$   | Out-place |  Yes   |

我們已經學習了如何將資料做排序，但如果今天接到需求不是叫你整理資料，而是要你將它打亂呢？明天我們就要來看隨機演算法，透過它來將我們的資料隨機且公平地打亂。
