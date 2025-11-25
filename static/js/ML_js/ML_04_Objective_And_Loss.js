export const ML_04_Objective_And_Loss = {
  id: 4,
  name: "ML_04_Objective_And_Loss",
  code: [
{
    "line": `
# ==========================
# 線性分類器 (Logistic Regression) 專案大綱
# ==========================
    `,
    "desc": `
<h5>📝 線性分類器專案大綱解析 (以 Logistic Regression 核心概念為例)</h5><br><br>

本專案著重於**線性分類器**的核心概念視覺化，特別是 Sigmoid 函數的應用、資料的線性可分性判斷，以及如何透過特徵工程或 3D 視覺化來尋找決策邊界。

<hr>

<h6>1️⃣ 目的</h6><br>
<div style="margin-left:32px;">
<ul>
<li>理解 <code style="color:red;">Sigmoid 函數</code> 如何將線性得分轉換為機率或信心分數 (0到1)。</li>
<li>透過自定義環形資料，展示 **2D 線性不可分** 的資料集。</li>
<li>透過經典 Iris 資料集，觀察哪些特徵組合是 **線性可分** 的。</li>
<li>實作特徵工程 (<code style="color:red;">z = x² + y²</code>)，將 2D 線性不可分資料轉換為 3D 線性可分。</li>
<li>視覺化決策邊界作為一個 **3D 信心平面** (<code style="color:red;">z=0.5</code>)，直觀理解分類器如何運作。
</ul>
</div>

<hr>

<h6>2️⃣ 流程 (程式碼邏輯順序)</h6><br>
<div style="margin-left:32px;">
<ol>
<li>核心函數定義 (Sigmoid, 極座標資料生成, 信心分數計算)。
<li>環形資料生成與繪製 (展示線性不可分)。
<li>Iris 資料載入與特徵對散佈圖 (尋找線性可分特徵)。
<li>Sigmoid 曲線繪製 (理解機率轉換)。
<li>環形資料特徵工程與 3D 可視化 (解決線性不可分問題)。
<li>決策平面網格繪製與信心分數計算。
<li>Iris 資料點與 3D 決策平面疊加顯示 (驗證分類效果)。
</ol>
</div>

<hr>

<h6>3️⃣ 小結</h6><br>
<div style="margin-left:32px;">
- 專注於線性分類器 (特別是 Logistic Regression) 的數學基礎和視覺概念。<br>
- 透過 2D/3D 轉換，展示如何將看似無法直線切割的資料，透過維度提升或特徵轉換來實現分類。<br>
- 為理解更進階的分類模型（如 SVM、神經網路）打下基礎。
</div>
`
},
]
};