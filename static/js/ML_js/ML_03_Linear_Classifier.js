export const ML_03_Linear_Classifier = {
  id: 3,
  name: "ML_03_Linear_Classifier",
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
{
    "line": `
import numpy as np
import pandas as pd
import seaborn as sns
import plotly.express as px
from matplotlib import pyplot as plt
from plotly import graph_objects as go
    `,
    "desc": `
<h5>Python 常用資料科學與視覺化套件匯入解析</h5><br><br>

這五行程式碼是資料科學與視覺化的基礎套件：

<hr>

<h6>1️⃣ NumPy (np) 與 Pandas (pd)</h6><br>
<div style="margin-left: 32px;">
- <strong>NumPy (np)</strong>：Python 數值運算核心，提供高效能陣列與矩陣運算。
- <strong>Pandas (pd)</strong>：資料處理利器，擅長操作表格資料 (DataFrame)。
</div>

<hr>

<h6>2️⃣ Matplotlib (plt) 與 Seaborn (sns)</h6><br>
<div style="margin-left: 32px;">
- <strong>Matplotlib (plt)</strong>：Python 最基礎的靜態畫圖套件，<code style="color:red;">pyplot</code> 提供繪圖介面。
- <strong>Seaborn (sns)</strong>：基於 Matplotlib 的高階視覺化套件，專注於統計圖表。
</div>

<hr>

<h6>3️⃣ Plotly Express (px) 與 Plotly (go)</h6><br>
<div style="margin-left: 32px;">
- <strong>Plotly Express (px)</strong>：高階互動式視覺化套件，可用於生成滑鼠可操作的 2D/3D 圖表。
- <strong>Plotly (go)</strong>：Plotly 基礎模組，用於精確控制圖表物件 (如在本專案中用於添加 3D 平面)。
</div>
`
},
{
    "line": `
# --- 核心函數定義 ---

# 定義 Sigmoid 函數，用於將線性得分轉換為 (0, 1) 之間的機率值。
def my_sigmoid(x):
  return 1 / (1 + np.exp(-x))

# 產生極座標分佈的樣本，用於創建線性不可分的環形資料集。
def create_polar_samples(loc, scale, hit, n_samples):
  # loc: 中心半徑, scale: 半徑標準差, hit: 類別標籤 (True/False)
  r = np.random.normal(loc, scale, n_samples)
  theta = np.random.uniform(0, 2*np.pi, n_samples)
  x = r * np.cos(theta)
  y = r * np.sin(theta)
  return pd.DataFrame({'x': x, 'y': y, 'hit': [hit]*n_samples})

# 模擬線性模型輸出並通過 Sigmoid 轉換得到信心分數。
# d 是點到直線 a*x + b*y + c = 0 的帶符號距離。
def get_line_confidence(x0, y0, a=-0.375, b=-1.0, c=1.5, d_scale=5):
  d = (a * x0 + b * y0 + c) / np.sqrt(a ** 2 + b ** 2)
  return 1.0 / (1.0 + np.exp(-d*d_scale))
    `,
    "desc": `
<h5>⚙️ 分類器核心函數解析</h5><br><br>

<hr>

<h6>1️⃣ Sigmoid 函數 (<code style="color:red;">my_sigmoid</code>)</h6><br>
<div style="margin-left: 32px;">
- **功能：** Logistic Regression 的激勵函數。它將任意實數 (線性得分 $x$) 映射到 <code style="color:red;">(0, 1)</code> 範圍，代表屬於某類別的機率。
- **作用：** 實現分類判斷，當得分 $x=0$ 時，機率為 $0.5$ (決策臨界點)。
</div>

<hr>

<h6>2️⃣ 環形資料生成 (<code style="color:red;">create_polar_samples</code>)</h6><br>
<div style="margin-left: 32px;">
- **目的：** 透過極座標隨機生成，創建**同心圓環**分佈的資料。
- **意義：** 這種資料在 2D 平面上**線性不可分**，用於展示線性分類器的限制。
</div>

<hr>

<h6>3️⃣ 信心分數計算 (<code style="color:red;">get_line_confidence</code>)</h6><br>
<div style="margin-left: 32px;">
- **目的：** 模擬線性模型 $a x_0 + b y_0 + c$ 的輸出，並通過 Sigmoid 轉換得到分類信心分數。
- **核心：** 計算點到決策邊界 (直線) 的距離 $d$，距離越遠，分數越趨近 0 或 1。
</div>
`
},
{
    "line": `
# --- 產生並繪製線性不可分的環形資料 ---
df_polar = pd.concat([create_polar_samples(0, 1, True, 100), # 內環 (True)
            create_polar_samples(6, 1, False, 100)]) # 外環 (False)
px.scatter(df_polar, x='x', y='y', color='hit', title="2D 環形資料 (線性不可分)").show()

# --- 載入經典 Iris 資料集 ---
df_orig = sns.load_dataset('iris')
df = df_orig.copy()
    `,
    "desc": `
<h5>📊 資料集初始化與挑戰展示</h5><br><br>

<hr>

<h6>1️⃣ 環形資料集 (<code style="color:red;">df_polar</code>)</h6><br>
<div style="margin-left: 32px;">
- **生成：** 組合內環 (中心半徑 0) 和外環 (中心半徑 6) 的點。
- **視覺結果：** <code style="color:red;">px.scatter</code> 繪製的 2D 散佈圖顯示，兩組點呈現同心圓分佈，無法用一條直線將 True 和 False 兩種顏色的點完美分開。
- **意義：** 凸顯了標準線性分類器在處理非線性邊界時的限制。
</div>

<hr>

<h6>2️⃣ Iris 資料集 (<code style="color:red;">df</code>)</h6><br>
<div style="margin-left: 32px;">
- **載入：** 使用 <code style="color:red;">sns.load_dataset('iris')</code> 載入著名的 Iris 資料集，用於後續的分類視覺化。
- **複製：** 複製一份資料 (<code style="color:red;">df = df_orig.copy()</code>) 以便進行後續的標籤轉換和特徵計算。
</div>
`
},
{
    "line": `
feature_names = df.columns[:-1]
label_name = df.columns[-1]

# --- 繪製 Iris 特徵對的散佈圖 (Pair Plot) ---
plt.figure(figsize=(10,10)) # 調整圖形大小
lf = len(feature_names)
for i in range(lf):
  for j in range(i+1,lf):
    feature_x = feature_names[i]
    feature_y = feature_names[j]
    # 繪製子圖
    plt.subplot(lf-1, lf-1, i*(lf-1)+j)
    sns.scatterplot(df, x=feature_x, y=feature_y, hue=label_name)
plt.suptitle("Iris 資料集特徵對散佈圖", fontsize=16)
plt.tight_layout(rect=[0, 0.03, 1, 0.95]) # 調整佈局以容納標題
plt.show()

# 針對 'setosa' 建立二元分類目標 (目標變數轉換)
df['is_setosa'] = (df['species'] == 'setosa').astype(float)
    `,
    "desc": `
<h5>🔍 Iris 資料探索：尋找線性可分性</h5><br><br>

<hr>

<h6>1️⃣ 特徵對散佈圖 (Pair Plot)</h6><br>
<div style="margin-left: 32px;">
- **目的：** 透過 <code style="color:red;">sns.scatterplot</code> 繪製所有特徵兩兩組合的圖表。
- **觀察重點：** 觀察圖表，尋找哪個特徵組合可以被一條直線清晰地分開。通常 **Petal Length vs. Petal Width** (花瓣長度 vs. 花瓣寬度) 能最明顯地將 <code style="color:red;">Iris-setosa</code> 類別分離出來，這表示這兩個特徵是**線性可分**的。
</div>

<hr>

<h6>2️⃣ 建立二元分類目標</h6><br>
<div style="margin-left: 32px;">
- **轉換：** 將原本的三類別 (<code style="color:red;">species</code>) 轉換為二元目標 <code style="color:red;">is_setosa</code> (是/否為 setosa)。
- **意義：** 將問題簡化為 Logistic Regression 最適合處理的二元分類形式。
</div>
`
},
{
    "line": `
# --- 視覺化 Sigmoid 函數曲線 ---
xs = np.linspace(-5, 5, 101)
ys = my_sigmoid(xs)
px.line(x=xs, y=ys, title="Sigmoid 函數 (將線性得分轉換為機率)").show()

# --- 特徵工程：將環形資料轉換為 3D 線性可分 ---
df_polar['z'] = df_polar['x'] ** 2 + df_polar['y'] ** 2
px.scatter_3d(df_polar, x='x', y='y', z='z', color='hit',
            title="環形資料 3D 視覺化 (加入 z = x²+y² 後線性可分)").show()
    `,
    "desc": `
<h5>💡 Sigmoid 應用與維度提升</h5><br><br>

<hr>

<h6>1️⃣ 獨立視覺化 Sigmoid 曲線</h6><br>
<div style="margin-left: 32px;">
- **目的：** 獨立展示 S 形曲線，以確認 <code style="color:red;">my_sigmoid</code> 函數將線性得分 $x$ 成功映射到 $0 \sim 1$ 的區間。
</div>

<hr>

<h6>2️⃣ 環形資料的 3D 特徵工程</h6><br>
<div style="margin-left: 32px;">
- **新特徵：** <code style="color:red;">z = x² + y²</code> (距離中心的平方)。
- **目的：** 解決原本 2D 資料的**線性不可分**問題。當引入 $z$ 軸後，內環和外環的 $z$ 值差異極大。
- **結果：** <code style="color:red;">px.scatter_3d</code> 顯示，資料點在 3D 空間中可以被一個水平平面 (如 $z=\text{constant}$) 輕鬆分隔，證明特徵工程能讓資料線性可分。
</div>
`
},
{
    "line": `
# --- 決策邊界網格資料準備 (以 Iris 的 petal_length/petal_width 為例) ---
x_ticks = np.linspace(0, 7, 21)
y_ticks = np.linspace(0, 2.5, 21)
xs, ys = np.meshgrid(x_ticks, y_ticks)
xs = np.reshape(xs, xs.shape[0]*xs.shape[1])
ys = np.reshape(ys, ys.shape[0]*xs.shape[1])
df_mesh = pd.DataFrame({'x': xs, 'y': ys})

# 繪製網格點
px.scatter(df_mesh, x='x', y='y', title="決策邊界網格點").show()

# --- 視覺化 3D 信心平面 ---
# 計算網格點的分類信心分數
df_mesh['z'] = get_line_confidence(df_mesh['x'], df_mesh['y'], a=-1.0, b=-2.5, c=8) # 調整參數以擬合 Iris 邊界

fig_mesh = px.scatter_3d(df_mesh, x='x', y='y', z='z', color='z',
                        title="網格點 3D 信心平面")
fig_mesh.show()
    `,
    "desc": `
<h5>🌐 構建 3D 信心平面 (Decision Surface)</h5><br><br>

<hr>

<h6>1️⃣ 網格點生成 (<code style="color:red;">np.meshgrid</code>)</h6><br>
<div style="margin-left: 32px;">
- **目的：** 在特徵空間 (Petal Length/Width) 上創建一個密集的網格點，用於描繪整個空間的分類情況。
- **作用：** 確保我們能看到分類器在每個點上的預測結果。
</div>

<hr>

<h6>2️⃣ 3D 信心平面繪製</h6><br>
<div style="margin-left: 32px;">
- **計算：** 使用 <code style="color:red;">get_line_confidence</code> 為每個網格點計算 $z$ (信心分數)。
- **結果：** 繪製出一個平滑的 S 形曲面，這就是 Logistic Regression 的**決策曲面**。這個曲面將特徵空間劃分為兩個區域 (信心分數 $\gt 0.5$ 和 $\lt 0.5$)。
</div>
`
},
{
    "line": `
# --- 將 Iris 資料點與決策平面疊加顯示 ---
# 針對 Iris 的 Petal Length 和 Petal Width 計算信心分數
df['confidence'] = get_line_confidence(df['petal_length'], df['petal_width'], a=-1.0, b=-2.5, c=8)

# 繪製 Iris 資料點，Z軸為信心分數
fig_iris = px.scatter_3d(df, x='petal_length', y='petal_width', z='confidence',
                        color='species', symbol='species',
                        title="Iris 資料點與 3D 決策平面 (Petal Length/Width)")

# 添加決策邊界平面 (Z=0.5，這是分類的臨界點)
# x=[0, 7], y=[0, 2.5] 涵蓋 Petal Length 和 Petal Width 的範圍
fig_iris.add_surface(x=[0, 7], y=[0, 2.5], z=[[0.5, 0.5], [0.5, 0.5]],
        visible=True, opacity=0.4, colorscale=[[0, 'gray'], [1, 'gray']], showscale=False, name="決策邊界 Z=0.5")
fig_iris.show()
    `,
    "desc": `
<h5>✅ 最終視覺化：資料點與決策邊界</h5><br><br>

<hr>

<h6>1️⃣ 資料點的 3D 投影</h6><br>
<div style="margin-left: 32px;">
- **Z 軸意義：** 每個 Iris 資料點的 $Z$ 軸值代表其被分類為 <code style="color:red;">setosa</code> 的信心分數。
- **觀察：** 線性可分的 <code style="color:red;">setosa</code> (通常是紫色) 點將聚集在 $Z=1$ 附近。
</div>

<hr>

<h6>2️⃣ 決策邊界平面 (<code style="color:red;">Z=0.5</code>)</h6><br>
<div style="margin-left: 32px;">
- **添加：** 使用 <code style="color:red;">fig_iris.add_surface</code> 在 $Z=0.5$ 高度處添加一個平面。
- **解讀：** 該平面是分類的**臨界點**。
    - 點位於平面上方 ($Z > 0.5$)，分類器判斷為 <code style="color:red;">setosa</code>。
    - 點位於平面下方 ($Z < 0.5$)，分類器判斷為非 <code style="color:red;">setosa</code>。
- **結論：** 這張圖直觀地展示了 Logistic Regression 如何透過一個 3D 平面來實現 2D 資料的分類。
</div>
`
},
]
};