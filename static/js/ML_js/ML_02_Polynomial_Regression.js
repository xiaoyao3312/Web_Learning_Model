export const ML_02_Polynomial_Regression = {
  id: 1,
  name: "ML_02_Polynomial_Regression",
  code: [
{
    "line": `
# ==========================
# 多項式迴歸專案大綱
# ==========================
    `,
    "desc": `
<span style="font-size:26px; font-weight:bold;">📝 多項式迴歸專案大綱解析</span><br><br>

本專案以手動多項式迴歸為例，完整展示從資料生成、標準化、模型訓練到預測與視覺化的流程，幫助學生理解梯度下降、標準化、預測與可視化。

<hr>

<span style="font-size:22px; font-weight:bold;">1️⃣ 目的</span><br>
<div style="margin-left:32px;">
<ul>
<li>建立線性回歸模型 <code style="color:red;">y = a0 + a1 * x</code>，理解模型訓練流程</li>
<li>觀察手動梯度下降訓練過程，理解參數收斂</li>
<li>資料標準化與反標準化，提高梯度下降收斂效率</li>
<li>實作「身高 → 體重」及「體重 → 身高」的預測功能</li>
<li>視覺化資料點、回歸線及 RMSE 變化，驗證模型效果</li>
</ul>
</div>

<hr>

<span style="font-size:22px; font-weight:bold;">2️⃣ 流程</span><br>
<div style="margin-left:32px;">
<ol>
<li>資料生成：
<pre><code style="color:red;">heights = np.random.uniform(140,180,300)
weights = generate_weights(heights, sigma=10, height_ans=1.0, weight_ans=-100)
df = pd.DataFrame({'height': heights, 'weight': weights})
</code></pre>
</li>
<li>資料標準化：
<pre><code style="color:red;">height_std = MyZStandardization()
weight_std = MyZStandardization()
height_std.fit(df['height'])
weight_std.fit(df['weight'])
df['height_Z'] = height_std.transform(df['height'])
df['weight_Z'] = weight_std.transform(df['weight'])
</code></pre>
</li>
<li>模型初始化：
<pre><code style="color:red;">model = MyLinear(a0=0, a1=-1)   # 或 MyQuadratic, MyCubic
</code></pre>
</li>
<li>損失函式與訓練器：
<pre><code style="color:red;">loss_fn = MyMSELoss(model)
trainer = MyTrainer(loss_fn)
</code></pre>
</li>
<li>模型訓練：
<pre><code style="color:red;">train_model(df, model, trainer, height_std, weight_std,
            learning_rate=0.01, num_epochs=200, plot_every=50)
</code></pre>
</li>
<li>模型預測：
<pre><code style="color:red;">predicted_weight = predict_weight(170, model, height_std, weight_std)
predicted_height = predict_height(60, model, height_std, weight_std)
</code></pre>
</li>
<li>視覺化與驗證：
<pre><code style="color:red;">sns.scatterplot(x='height', y='weight', data=df)
plt.plot(x_line, y_line, color='red')  # 回歸線
plt.show()
</code></pre>
</li>
</ol>
</div>

<hr>

<span style="font-size:22px; font-weight:bold;">3️⃣ 小結</span><br>
<div style="margin-left:32px;">
- 展示完整流程：資料生成 → 標準化 → 模型初始化 → 訓練 → 預測 → 視覺化<br>
- 手動梯度下降 + Z-score 標準化，直觀理解線性與多項式迴歸內部運作<br>
- 支援不同階數回歸模型（線性 / 二次 / 三次），靈活切換並驗證效果
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
    `,
    "desc": `
<span style="font-size:26px; font-weight:bold;">Python 常用資料科學與視覺化套件匯入解析</span><br><br>

這五行程式碼都是資料科學、機器學習與資料視覺化的基礎套件，逐行解析如下：

<hr>

<span style="font-size:22px; font-weight:bold;">1️⃣ import numpy as np</span><br>
<div style="margin-left: 32px;">
- NumPy 是 Python 的數值運算核心套件，簡稱 np。<br>
- 提供高效能陣列運算、矩陣運算與線性代數功能。<br>
- 幾乎所有科學計算都會用到 NumPy。<br>
- 範例：<br>
<code>arr = np.array([1, 2, 3])<br>
mean_val = np.mean(arr)  # 計算平均值<br>
</code>
</div>

<hr>

<span style="font-size:22px; font-weight:bold;">2️⃣ import pandas as pd</span><br>
<div style="margin-left: 32px;">
- Pandas 是 Python 的資料處理利器，簡稱 pd。<br>
- 擅長操作表格資料（DataFrame）與時間序列資料（Series）。<br>
- 常用於資料清理、分析與匯出 CSV/Excel。<br>
- 範例：<br>
<code>df = pd.read_csv("data.csv")   # 讀取 CSV 檔案<br>
print(df.head())                  # 顯示前 5 筆資料<br>
</code>
</div>

<hr>

<span style="font-size:22px; font-weight:bold;">3️⃣ import seaborn as sns</span><br>
<div style="margin-left: 32px;">
- Seaborn 是基於 Matplotlib 的高階視覺化套件，簡稱 sns。<br>
- 主要用於統計圖表，如箱型圖、直方圖、散佈圖與熱力圖。<br>
- 可以快速畫出漂亮、易讀的圖表。<br>
- 範例：<br>
<code>sns.boxplot(x="age", y="salary", data=df)  # 畫箱型圖<br>
sns.histplot(df['salary'], bins=20)           # 畫直方圖<br>
</code>
</div>

<hr>

<span style="font-size:22px; font-weight:bold;">4️⃣ import plotly.express as px</span><br>
<div style="margin-left: 32px;">
- Plotly Express 是互動式視覺化套件，簡稱 px。<br>
- 可以建立滑鼠可互動的圖表，例如放大縮小、滑鼠提示資訊。<br>
- 適合做網頁展示或交互式報表。<br>
- 範例：<br>
<code>fig = px.scatter(df, x="age", y="salary", color="department")<br>
fig.show()  # 互動式散佈圖<br>
</code>
</div>

<hr>

<span style="font-size:22px; font-weight:bold;">5️⃣ from matplotlib import pyplot as plt</span><br>
<div style="margin-left: 32px;">
- Matplotlib 是 Python 最基礎的畫圖套件，pyplot 提供類似 MATLAB 的繪圖介面，簡稱 plt。<br>
- 適合畫靜態圖表，例如折線圖、長條圖、散佈圖。<br>
- 範例：<br>
<code>plt.plot([1,2,3], [4,5,6], label="線條")<br>
plt.xlabel("X 軸")<br>
plt.ylabel("Y 軸")<br>
plt.title("範例圖")<br>
plt.legend()<br>
plt.show()<br>
</code>
- 若要示意回歸公式，可用：
<code>y = a0 + a1 * x + a2 * x**2 + a3 * x**3</code><br>
</div>

<hr>

<span style="font-size:22px; font-weight:bold;">總結：</span><br>
<div style="margin-left:32px;">
- <strong>NumPy</strong> → 科學運算、矩陣運算<br>
- <strong>Pandas</strong> → 資料整理、表格操作<br>
- <strong>Seaborn / Matplotlib</strong> → 靜態圖表繪製<br>
- <strong>Plotly Express</strong> → 互動式圖表<br>
- 這些套件經常一起使用，是 Python 資料科學與機器學習專案的核心基礎。
</div>
`
},

{
    "line": `
class MyLinear():
    def __init__(self, a0 = 0.0, a1 = 1.0):
        """線性模型: y = a0 + a1 * x"""
        self.set_trainables([a0, a1])

    def set_trainables(self, params):
        self.params = np.array(params, np.float64)

    def get_trainables(self):
        return self.params

    def get_y(self, x):
        a0, a1 = self.params
        return a0 + a1 * x

    def get_line(self, xmin = 0.0, xmax = 15.0, nsamples = 11):
        xs = np.linspace(xmin, xmax, nsamples)
        ys = self.get_y(xs)
        return xs, ys
    `,
    
    "desc": `
<span style="font-size:26px; font-weight:bold;">MyLinear 類別：一次線性模型完整解說</span><br><br>

<span style="font-size:22px; font-weight:bold;">📌 模型概念</span><br>
<div style="margin-left: 32px;">
此類別實作的模型為：<br>
<code>y = a0 + a1 * x</code><br><br>
a0 → 截距（intercept）<br>
a1 → 斜率（slope）<br><br>

它封裝了線性模型常見的功能：<br>
<ul>
  <li>設定參數（set_trainables）</li>
  <li>取得參數（get_trainables）</li>
  <li>計算輸出 y（get_y）</li>
  <li>生成畫線座標（get_line）</li>
</ul>
支援 NumPy 陣列，使其能進行向量化運算，適合教學與視覺化。<br><br>
</div>

<hr>

<span style="font-size:22px; font-weight:bold;">🔹 __init__：初始化模型參數</span><br>
<div style="margin-left: 32px;">
建立 MyLinear() 物件時會自動呼叫。<br>
預設參數：a0 = 0.0（截距）、a1 = 1.0（斜率）。<br>
並透過 <code>self.set_trainables([a0, a1])</code> 將參數儲存在物件中。<br><br>
</div>

<span style="font-size:22px; font-weight:bold;">🔹 set_trainables：設定模型參數</span><br>
<div style="margin-left: 32px;">
將傳入的參數（如 <code>[a0, a1]</code>）轉為 NumPy 陣列，方便做矩陣/向量運算。<br>
並存進 <code>self.params</code>。<br><br>
</div>

<span style="font-size:22px; font-weight:bold;">🔹 get_trainables：取得目前參數</span><br>
<div style="margin-left: 32px;">
回傳模型參數 <code>[a0, a1]</code>。<br>
可用於顯示、紀錄或做優化計算。<br><br>
</div>

<span style="font-size:22px; font-weight:bold;">🔹 get_y：根據 x 計算 y</span><br>
<div style="margin-left: 32px;">
將參數拆成 <code>a0</code> 與 <code>a1</code>，並套入公式：<br>
<code>y = a0 + a1 * x</code><br><br>

支援：<br>
• 單一數值（例如 3）<br>
• NumPy 陣列（例如 <code>np.array([1,2,3])</code>）<br><br>

適合大量資料的批次運算（向量化）。<br><br>
</div>

<span style="font-size:22px; font-weight:bold;">🔹 get_line：產生繪製直線用的資料</span><br>
<div style="margin-left: 32px;">
用於產生等距 x 值與對應的 y 值，方便繪圖。<br><br>

參數說明：<br>
xmin → x 最小值（預設 0）<br>
xmax → x 最大值（預設 15）<br>
nsamples → 取樣點數量（預設 11）<br><br>

透過 <code>np.linspace</code> 產生 x 陣列，再用 <code>get_y</code> 計算 y。<br><br>

可直接繪圖：<br>
<code>
model = MyLinear(2, 3)<br>
xs, ys = model.get_line()<br>
plt.plot(xs, ys)<br>
plt.show()
</code>
<br><br>
</div>
    `
},

{
    "line": `
class MyQuadratic():
    def __init__(self, a0 = 0.0, a1 = 0.3, a2 = -0.5):
        """二次模型: y = a0 + a1 * x + a2 * x^2"""
        self.set_trainables([a0, a1, a2])

    def set_trainables(self, params):
        self.params = np.array(params, np.float64)

    def get_trainables(self):
        return self.params

    def get_y(self, x):
        a0, a1, a2 = self.params
        return a0 + a1 * x + a2 * x ** 2

    def get_line(self, xmin = 0.0, xmax = 15.0, nsamples = 11):
        xs = np.linspace(xmin, xmax, nsamples)
        ys = self.get_y(xs)
        return xs, ys
    `,

    "desc": `
<span style="font-size:26px; font-weight:bold;">MyQuadratic 類別：二次曲線模型完整解說</span><br><br>

<span style="font-size:22px; font-weight:bold;">📌 模型概念</span><br>
<div style="margin-left: 32px;">
此類別實作的模型為：<br>
<code>y = a0 + a1 * x + a2 * x^2</code><br><br>

a0 → 截距（intercept）<br>
a1 → 一次項係數（linear term）<br>
a2 → 二次項係數（curvature，決定彎曲方向與強度）<br><br>

它封裝了曲線模型常見的功能：<br>
<ul>
  <li>設定參數（set_trainables）</li>
  <li>取得參數（get_trainables）</li>
  <li>計算輸出 y（get_y）</li>
  <li>生成畫曲線座標（get_line）</li>
</ul>

支援 NumPy 陣列，能一次處理大量 x 值，適合視覺化與教學。<br><br>
</div>

<hr>

<span style="font-size:22px; font-weight:bold;">🔹 __init__：初始化模型參數</span><br>
<div style="margin-left: 32px;">
建立 <code>MyQuadratic()</code> 物件時會自動呼叫。<br>
預設參數：<br>
• <code>a0 = 0.0</code>（截距）<br>
• <code>a1 = 0.3</code>（一次項斜率）<br>
• <code>a2 = -0.5</code>（決定曲線開口方向）<br><br>

並透過 <code>self.set_trainables([a0, a1, a2])</code> 將參數存入物件中。<br><br>
</div>

<span style="font-size:22px; font-weight:bold;">🔹 set_trainables：設定模型參數</span><br>
<div style="margin-left: 32px;">
將傳入參數（例如 <code>[a0, a1, a2]</code>）轉成 NumPy 陣列，並儲存到 <code>self.params</code>。<br>
這可讓後續的計算（尤其是向量化運算）更加快速與穩定。<br><br>
</div>

<span style="font-size:22px; font-weight:bold;">🔹 get_trainables：取得目前參數</span><br>
<div style="margin-left: 32px;">
回傳模型當前的三個參數：<code>[a0, a1, a2]</code>。<br>
可用於訓練過程紀錄、debug、視覺化等用途。<br><br>
</div>

<span style="font-size:22px; font-weight:bold;">🔹 get_y：根據 x 計算 y</span><br>
<div style="margin-left: 32px;">
先將參數拆解成 <code>a0</code>、<code>a1</code>、<code>a2</code>，套用公式：<br>
<code>y = a0 + a1 * x + a2 * x^2</code><br><br>

支援：<br>
• 單一數字 x<br>
• NumPy 陣列（例如 <code>np.array([1,2,3])</code>）<br><br>

因此能一次計算多個 y 值，適合畫曲線。<br><br>
</div>

<span style="font-size:22px; font-weight:bold;">🔹 get_line：產生繪製曲線用的資料</span><br>
<div style="margin-left: 32px;">
用於繪圖時，產生一組等距的 x 與對應的 y。<br><br>

參數說明：<br>
xmin → x 的最小值（預設 0）<br>
xmax → x 的最大值（預設 15）<br>
nsamples → 取樣點數（預設 11）<br><br>

透過 <code>np.linspace</code> 生成 x 序列，再用 <code>get_y</code> 轉換成 y。<br><br>

可直接用於繪圖：<br>
<code>
model = MyQuadratic(1, 2, -0.1)<br>
xs, ys = model.get_line()<br>
plt.plot(xs, ys)<br>
plt.show()
</code>
<br><br>
</div>
    `
},

{
    "line": `
class MyCubic():
    def __init__(self, a0 = 0.0, a1 = 0.3, a2 = -0.5, a3 = 0.1):
        """三次模型: y = a0 + a1*x + a2*x^2 + a3*x^3"""
        self.set_trainables([a0, a1, a2, a3])

    def set_trainables(self, params):
        self.params = np.array(params, np.float64)

    def get_trainables(self):
        return self.params

    def get_y(self, x):
        a0, a1, a2, a3 = self.params
        return a0 + a1 * x + a2 * x ** 2 + a3 * x ** 3

    def get_line(self, xmin = 0.0, xmax = 15.0, nsamples = 11):
        xs = np.linspace(xmin, xmax, nsamples)
        ys = self.get_y(xs)
        return xs, ys
    `,

    "desc": `
<span style="font-size:26px; font-weight:bold;">MyCubic 類別：三次曲線模型完整解說</span><br><br>

<span style="font-size:22px; font-weight:bold;">📌 模型概念</span><br>
<div style="margin-left: 32px;">
此類別實作的模型為：<br>
<code>y = a0 + a1 * x + a2 * x^2 + a3 * x^3</code><br><br>

a0 → 截距（intercept）<br>
a1 → 一次項係數（slope）<br>
a2 → 二次項係數（curvature，彎曲強度）<br>
a3 → 三次項係數（控制 S 型彎曲、多變化形狀）<br><br>

三次模型能表達比一次、二次更複雜的曲線形狀，例如：  
• S 形轉折  
• 先增後減再增的曲線  
• 多拐點（inflection point）<br><br>

此類別包含：<br>
<ul>
  <li>設定參數（set_trainables）</li>
  <li>取得參數（get_trainables）</li>
  <li>計算輸出 y（get_y）</li>
  <li>生成畫曲線座標（get_line）</li>
</ul>

支援 NumPy 陣列的向量化運算，適合用於機器學習模型展示與可視化。<br><br>
</div>

<hr>

<span style="font-size:22px; font-weight:bold;">🔹 __init__：初始化模型參數</span><br>
<div style="margin-left: 32px;">
建立 <code>MyCubic()</code> 物件時自動呼叫。<br>
預設參數：<br>
• <code>a0 = 0.0</code>（截距）<br>
• <code>a1 = 0.3</code>（一次項斜率）<br>
• <code>a2 = -0.5</code>（二次彎曲）<br>
• <code>a3 = 0.1</code>（三次彎曲與 S 型特性）<br><br>

透過 <code>self.set_trainables([a0, a1, a2, a3])</code> 儲存參數。<br><br>
</div>

<span style="font-size:22px; font-weight:bold;">🔹 set_trainables：設定模型參數</span><br>
<div style="margin-left: 32px;">
將 <code>[a0, a1, a2, a3]</code> 轉換為 NumPy 陣列，儲存在 <code>self.params</code>。<br>
這能讓模型能利用 NumPy 的向量化加速運算。<br><br>
</div>

<span style="font-size:22px; font-weight:bold;">🔹 get_trainables：取得目前參數</span><br>
<div style="margin-left: 32px;">
回傳目前模型參數：<code>[a0, a1, a2, a3]</code>。<br>
可用於顯示、記錄或訓練過程的調整。<br><br>
</div>

<span style="font-size:22px; font-weight:bold;">🔹 get_y：根據 x 計算 y</span><br>
<div style="margin-left: 32px;">
將參數拆解為 <code>a0</code>、<code>a1</code>、<code>a2</code>、<code>a3</code>，帶入公式：<br>
<code>y = a0 + a1 * x + a2 * x^2 + a3 * x^3</code><br><br>

支援輸入：<br>
• 單一數字<br>
• NumPy 陣列（如 <code>np.array([...])</code>）<br><br>

可高效產生大量 y 值，適合畫三次曲線。<br><br>
</div>

<span style="font-size:22px; font-weight:bold;">🔹 get_line：產生繪製曲線用的資料</span><br>
<div style="margin-left: 32px;">
用於產生畫圖所需的 (xs, ys)。<br><br>

參數：<br>
xmin → x 最小值（預設 0）<br>
xmax → x 最大值（預設 15）<br>
nsamples → 取樣點數（預設 11）<br><br>

透過 <code>np.linspace</code> 產生等距 x 值，再計算對應 y。<br><br>

繪圖範例：<br>
<code>
model = MyCubic(1, -0.2, 0.05, 0.01)<br>
xs, ys = model.get_line()<br>
plt.plot(xs, ys)<br>
plt.show()
</code>
<br><br>
</div>
    `
},

{
    "line": `
class MyMSELoss():
    def __init__(self, model):
        self.model = model

    def get_model(self):
        return self.model

    def get_loss(self, x, y_true):
        y_pred = self.model.get_y(x)
        se = (y_true - y_pred) ** 2
        return np.sqrt(se.mean())
    `,

    "desc": `
<span style="font-size:26px; font-weight:bold;">MyMSELoss 類別：MSE 損失函數完整解說</span><br><br>

<span style="font-size:22px; font-weight:bold;">📌 這個類別的用途</span><br>
<div style="margin-left: 32px;">
MyMSELoss 用來計算模型的預測誤差。<br>
它接收一個模型（如 MyLinear 或 MyQuadratic），並提供一個方法 <code>get_loss()</code>：<br><br>

<strong>計算 RMSE（Root Mean Squared Error, 均方根誤差）</strong><br>

公式：<br>
<div style="margin-left: 32px;">
RMSE = √(平均( (y_true − y_pred)² ))
</div><br>

RMSE 越小，表示模型對資料的擬合越好。<br><br>
</div>

<hr>

<span style="font-size:22px; font-weight:bold;">🔹 __init__：初始化損失函數並綁定模型</span><br>
<div style="margin-left: 32px;">
建立 MyMSELoss 時必須傳入一個模型物件：<br><br>

<code>loss_fn = MyMSELoss(model)</code><br><br>

此模型（Linear / Quadratic 皆可）會儲存在 <code>self.model</code>。<br>
之後用 <code>get_loss()</code> 計算誤差時會用到它的 <code>get_y()</code> 做預測。<br><br>
</div>

<span style="font-size:22px; font-weight:bold;">🔹 get_model：回傳綁定的模型</span><br>
<div style="margin-left: 32px;">
單純提供一個方法取得目前使用的模型。<br>
常用於：<br>
<ul>
  <li>檢查目前正在評估哪個模型</li>
  <li>debug</li>
  <li>將模型記錄於訓練流程中</li>
</ul>
</div><br>

<span style="font-size:22px; font-weight:bold;">🔹 get_loss：計算 RMSE（均方根誤差）</span><br>
<div style="margin-left: 32px;">
整個類別的核心功能。<br><br>

步驟如下：<br>

1. **取得模型預測**  
使用綁定模型的 <code>get_y(x)</code> 方法：  
<code>y_pred = self.model.get_y(x)</code>

2. **計算誤差平方（Squared Error, SE）**  
<code>se = (y_true - y_pred) ** 2</code>

3. **取平均（Mean Squared Error, MSE）**

4. **開根號變成 RMSE（均方根誤差）**  
<code>return np.sqrt(se.mean())</code><br><br>

為什麼用 RMSE 而不是 MSE？<br>
<div style="margin-left: 24px;">
因為 RMSE 的單位和 y 相同，更容易了解誤差大小。<br>
MSE 單位會變成平方，不直觀。<br>
</div><br>
</div>

<hr>

<span style="font-size:22px; font-weight:bold;">📌 使用範例</span><br>
<div style="margin-left: 32px;">
<code>
model = MyLinear(1, 2)<br>
loss_fn = MyMSELoss(model)<br><br>
x = np.array([1, 2, 3])<br>
y = np.array([2, 5, 10])<br><br>
loss = loss_fn.get_loss(x, y)<br>
print(loss)
</code><br><br>

此範例會輸出模型預測與真實資料之間的 RMSE。<br>
</div>
    `
},

{
    "line": `
class MyZStandardization():
    def __init__(self):
        self.mean = None
        self.std = None

    def fit(self, data):
        self.mean = data.mean()
        self.std = data.std()
        return self.mean, self.std

    def transform(self, data):
        return (np.array(data) - self.mean) / self.std

    def inverse_transform(self, dataZ):
        return np.array(dataZ) * self.std + self.mean
    `,

    "desc": `
<span style="font-size:26px; font-weight:bold;">MyZStandardization 類別：Z-score 標準化完整解說</span><br><br>

<span style="font-size:22px; font-weight:bold;">📌 這個類別的用途</span><br>
<div style="margin-left: 32px;">
此類別專門用來做「Z-score 標準化（Standardization）」。<br><br>

標準化的公式為：  
<div style="margin-left: 32px;">
Z = (x − mean) / std  
</div><br>

作用：  
<ul>
  <li>中心化資料（平均變成 0）</li>
  <li>縮放資料（標準差變成 1）</li>
  <li>提升模型訓練穩定度，避免特徵尺度不同造成偏差</li>
</ul>
另外也提供 <code>inverse_transform()</code> 將標準化數值還原成原資料尺度。<br>
</div>

<hr>

<span style="font-size:22px; font-weight:bold;">🔹 __init__：初始化（尚未計算 mean 與 std）</span><br>
<div style="margin-left: 32px;">
初始化後預設：  
<ul>
  <li><code>self.mean = None</code></li>
  <li><code>self.std = None</code></li>
</ul>
代表還未對任何資料進行 fit。<br>
這讓使用者知道標準化器尚未建立轉換所需的統計量。<br>
</div><br>

<span style="font-size:22px; font-weight:bold;">🔹 fit：從資料計算平均與標準差</span><br>
<div style="margin-left: 32px;">
<code>fit(data)</code> 用來學習資料的分佈。<br><br>

計算方式：  
<ul>
  <li><code>self.mean = data.mean()</code></li>
  <li><code>self.std = data.std()</code></li>
</ul>

其後，物件便可用來做 transform。<br><br>

回傳值：  
<code>(mean, std)</code>  
方便在外部檢查。<br>
</div><br>

<span style="font-size:22px; font-weight:bold;">🔹 transform：將資料轉成標準化後的 Z 分數</span><br>
<div style="margin-left: 32px;">
使用公式：  
<div style="margin-left: 32px;">
Z = (x − mean) / std  
</div><br>

特點：  
<ul>
  <li>支援 list / NumPy array</li>
  <li>計算後變成平均 0、標準差 1 的資料</li>
</ul>
</div><br>

<span style="font-size:22px; font-weight:bold;">🔹 inverse_transform：還原回原資料</span><br>
<div style="margin-left: 32px;">
使用逆轉換公式：  
<div style="margin-left: 32px;">
x = Z * std + mean  
</div><br>

用途：  
<ul>
  <li>模型預測後數值通常需還原回原本尺度</li>
  <li>容易比較真實值與模型輸出</li>
</ul>
</div>

<hr>

<span style="font-size:22px; font-weight:bold;">📌 使用範例</span><br>
<div style="margin-left: 32px;">
<code>
data = np.array([10, 12, 14, 16])<br><br>

scaler = MyZStandardization()<br>
mean, std = scaler.fit(data)<br><br>

dataZ = scaler.transform(data)<br>
print(dataZ)   # 標準化結果<br><br>

original = scaler.inverse_transform(dataZ)<br>
print(original)  # 還原到原資料
</code><br><br>

此流程模擬 sklearn.preprocessing.StandardScaler 的核心功能。<br>
</div>
    `
},

{
    "line": `
def generate_weights(heights, sigma = 5, height_ans = 1, weight_ans = -100):
    return weight_ans + height_ans * heights + np.random.normal(0, sigma, heights.shape)
    `,

    "desc": `
<span style="font-size:26px; font-weight:bold;">generate_weights 函式：模擬「身高 → 體重」資料的生成器</span><br><br>

<span style="font-size:22px; font-weight:bold;">📌 函式用途</span><br>
<div style="margin-left: 32px;">
這個函式用來「隨機生成」身高與體重的關係資料。<br>
它模擬一個線性模型：  
<div style="margin-left: 32px;">
<code>weight = weight_ans + height_ans * height + noise</code>
</div>

其中 noise 來自常態分佈，可讓資料更像真實世界的測量數據。<br><br>

用途：  
<ul>
  <li>教學用：線性回歸示範</li>
  <li>測試模型：練習訓練與評估</li>
  <li>可控性高：可改變斜率、截距、雜訊大小</li>
</ul>
</div>

<hr>

<span style="font-size:22px; font-weight:bold;">🔹 函式參數說明</span><br>

<div style="margin-left: 32px;">
<strong>1. heights</strong><br>
使用者提供的「身高資料」陣列 (NumPy array)。<br>
例如：<code>np.array([150,160,170])</code><br><br>

<strong>2. sigma（預設 5）</strong><br>
噪聲（noise）的標準差。<br>
<ul>
  <li>數值越大 → 資料越散亂</li>
  <li>數值越小 → 越接近完美線性關係</li>
</ul><br>

<strong>3. height_ans（預設 1）</strong><br>
身高與體重的「斜率」。  
表示：身高每增加 1 單位，體重增加多少。<br><br>

<strong>4. weight_ans（預設 -100）</strong><br>
體重模型的「截距」。<br>
控制整體往上或往下平移。<br><br>
</div>

<hr>

<span style="font-size:22px; font-weight:bold;">🔹 函數如何運作</span><br>

<div style="margin-left: 32px;">
整個回傳值由三個部分組成：<br><br>

1. **線性關係：**  
<code>height_ans * heights</code><br>

2. **截距：**  
<code>weight_ans</code><br>

3. **雜訊 noise：**  
使用常態分佈產生：  
<code>np.random.normal(0, sigma, heights.shape)</code><br>
→ 產出與 heights 同形狀的噪聲陣列<br><br>

組合結果：  
<code>
weight = weight_ans + height_ans * heights + noise
</code><br><br>

這樣產生的體重資料彷彿真實世界一樣帶有自然波動。<br>
</div>

<hr>

<span style="font-size:22px; font-weight:bold;">📌 使用範例</span><br>

<div style="margin-left: 32px;">
<code>
heights = np.array([150, 160, 170, 180])<br>
weights = generate_weights(heights, sigma=4, height_ans=0.9, weight_ans=-80)<br>
print(weights)
</code><br><br>

輸出會類似：  
<code>[55.1, 63.8, 72.2, 80.5]</code><br>
（每次執行都會略有不同，因為 noise 會隨機生成）<br>
</div>
    `
},

{
    "line": `
def train_model(df, model, trainer, height_std, weight_std,
                learning_rate = 0.01, num_epochs = 500, plot_every = 50):

    print("=" * 70)
    print("📋 訓練設定摘要")
    print("=" * 70)
    print(f"資料筆數: {len(df)}")
    print(f"Height 範圍: {df['height'].min():.2f} ~ {df['height'].max():.2f}")
    print(f"Weight 範圍: {df['weight'].min():.2f} ~ {df['weight'].max():.2f}")
    print(f"Height Z-score: mean={height_std.mean:.4f}, std={height_std.std:.4f}")
    print(f"Weight Z-score: mean={weight_std.mean:.4f}, std={weight_std.std:.4f}")
    print("-" * 70)
    print(f"模型類型: {type(model).__name__}")
    print(f"初始參數: {model.get_trainables()}")
    print(f"學習率: {learning_rate}")
    print(f"訓練迴圈次數: {num_epochs}")
    print("=" * 70)
    print()

    for epoch in range(num_epochs):
        grads = trainer.get_gradient(df['height_Z'], df['weight_Z'])
        new_params = model.get_trainables() - learning_rate * grads
        model.set_trainables(new_params)

        if (epoch + 1) % plot_every == 0 or epoch == 0:
            current_loss = trainer.loss_fn.get_loss(df['height_Z'], df['weight_Z'])
            params = model.get_trainables()
            print(f"Epoch {epoch + 1:3d} - RMSE: {current_loss:.4f} - Params: {params}")

            xs_Z, ys_Z = model.get_line(df['height_Z'].min(), df['height_Z'].max(), nsamples = len(df))
            xs_orig = height_std.inverse_transform(xs_Z)
            ys_orig = weight_std.inverse_transform(ys_Z)

            plt.figure(figsize = (4, 3))
            sns.scatterplot(data = df, x = 'height', y = 'weight')
            sns.lineplot(x = xs_orig, y = ys_orig, color = 'red')
            plt.title(f'Epoch {epoch + 1} - RMSE: {current_loss:.4f}')
            plt.xlabel('Height (cm)')
            plt.ylabel('Weight (kg)')
            plt.show()
    `,
    "desc": `
<span style="font-size:26px; font-weight:bold;">train_model：執行模型訓練與視覺化的主函式</span><br><br>

這個函式是整個專案的核心流程：  
✔ 取得資料  
✔ 計算梯度  
✔ 更新模型參數  
✔ 顯示訓練過程  
✔ 每隔幾次迴圈視覺化模型線條  
<br>

用於線性與二次模型皆可使用，具有高度泛用性。

<hr>

<span style="font-size:22px; font-weight:bold;">📌 函式用途</span><br>

<div style="margin-left: 32px;">
此函式負責「完整的機器學習訓練迴圈」（手動版 Gradient Descent）。<br><br>

它會執行：  
<ul>
  <li>讀取資料並印出資料統計（含 Z-score）</li>
  <li>呼叫 trainer 計算梯度</li>
  <li>更新 model 的參數</li>
  <li>每隔 N 次顯示 RMSE 與參數變化</li>
  <li>繪製模型線條 vs 真實資料點</li>
</ul>

非常適合用於教學，讓學生完整看到訓練過程。
</div>

<hr>

<span style="font-size:22px; font-weight:bold;">🔹 參數說明</span>

<div style="margin-left: 32px;">

<strong>1. df</strong><br>
Pandas 資料表，含有 height、weight、height_Z、weight_Z。<br><br>

<strong>2. model</strong><br>
模型物件，例如：<code>MyLinear() 或 MyQuadratic()</code><br>
提供：  
<ul>
  <li>get_trainables()</li>
  <li>set_trainables()</li>
  <li>get_line()</li>
</ul>

<strong>3. trainer</strong><br>
訓練器物件，負責計算梯度：  
<code>trainer.get_gradient(x, y)</code><br><br>

<strong>4. height_std, weight_std</strong><br>
標準化工具，負責：  
<ul>
  <li>標準化 Z-score</li>
  <li>反標準化 inverse_transform</li>
</ul><br>

<strong>5. learning_rate（預設 0.01）</strong><br>
梯度下降步長。<br><br>

<strong>6. num_epochs（預設 500）</strong><br>
總訓練迴圈次數。<br><br>

<strong>7. plot_every（預設 50）</strong><br>
每多少回合繪製一次模型線條。
</div>

<hr>

<span style="font-size:22px; font-weight:bold;">🔹 訓練核心流程（Epoch Loop）</span>

<div style="margin-left: 32px;">

<strong>1. 計算梯度：</strong><br>
<code>grads = trainer.get_gradient(df['height_Z'], df['weight_Z'])</code><br>
這邊完全依賴 trainer 物件的實作。<br><br>

<strong>2. 更新參數（Gradient Descent）：</strong><br>
<code>new_params = old_params - learning_rate * grads</code><br>
這就是手寫版的梯度下降。<br><br>

<strong>3. 設定回模型中：</strong><br>
<code>model.set_trainables(new_params)</code><br><br>

</div>

<hr>

<span style="font-size:22px; font-weight:bold;">🔹 可視化與訓練紀錄</span>

<div style="margin-left: 32px;">
只要符合下列任一條件就會印出資訊並畫圖：  
<ul>
  <li>第 1 次 epoch（epoch == 0）</li>
  <li>每 plot_every 次迴圈一次</li>
</ul>

輸出資訊包含：  
<ul>
  <li>當前 RMSE（模型誤差）</li>
  <li>更新後的參數值</li>
</ul>

接著會：  

1. 呼叫模型 get_line() 取得 Z-score 空間的線  
2. 使用 inverse_transform 轉回實際身高與體重  
3. 畫出  
   - 藍色：原始資料點  
   - 紅色：模型預測線  
</div>

<hr>

<span style="font-size:22px; font-weight:bold;">📌 小結：這個函式的角色</span>

<div style="margin-left: 32px;">
它就像「訓練跑步機」：  
<ul>
  <li>trainer：提供坡度（梯度）</li>
  <li>model：被訓練的運動員</li>
  <li>train_model：整個訓練場地（控制流程）</li>
</ul>

所有更新規則、顯示文字、繪圖都集中在這一個函式中。
</div>
    `
},

{
    "line": `
def predict_weight(height, model, height_std, weight_std):
    """給定身高預測體重"""
    height_Z = height_std.transform([height])[0]
    params = model.get_trainables()

    if len(params) == 2:      # 線性模型
        a0, a1 = params
        weight_Z = a0 + a1 * height_Z
    elif len(params) == 3:    # 二次模型
        a0, a1, a2 = params
        weight_Z = a0 + a1 * height_Z + a2 * height_Z ** 2
    elif len(params) == 4:    # 三次模型
        a0, a1, a2, a3 = params
        weight_Z = a0 + a1 * height_Z + a2 * height_Z ** 2 + a3 * height_Z ** 3

    return weight_std.inverse_transform([weight_Z])[0]

def predict_height(weight, model, height_std, weight_std):
    """給定體重預測身高（數值搜尋）"""
    params = model.get_trainables()
    weight_Z = weight_std.transform([weight])[0]
    possible_heights = np.linspace(-3, 3, 1000)

    if len(params) == 2:
        a0, a1 = params
        predicted_weights = a0 + a1 * possible_heights
    elif len(params) == 3:
        a0, a1, a2 = params
        predicted_weights = a0 + a1 * possible_heights + a2 * possible_heights ** 2
    elif len(params) == 4:
        a0, a1, a2, a3 = params
        predicted_weights = a0 + a1 * possible_heights + a2 * possible_heights ** 2 + a3 * possible_heights ** 3

    idx = np.argmin(np.abs(predicted_weights - weight_Z))
    height_Z = possible_heights[idx]
    return height_std.inverse_transform([height_Z])[0]
    `,
    "desc": `
<span style="font-size:26px; font-weight:bold;">預測函式：根據身高推估體重 & 根據體重推估身高</span><br><br>

這兩個函式負責把「模型訓練結果」應用到實際預測上：  
✔ <strong>predict_weight</strong>：輸入身高 → 預測體重  
✔ <strong>predict_height</strong>：輸入體重 → 反推身高  
<br>
並支援 **線性、二次、三次模型**。

<hr>

<span style="font-size:22px; font-weight:bold;">📌 predict_weight：依身高預測體重</span><br>

<div style="margin-left: 32px;">
此函式的流程分為三步：  
<ul>
  <li>把輸入身高轉成 Z-score</li>
  <li>根據模型參數（線性/二次/三次）計算 Z-score 下的預測體重</li>
  <li>再反標準化回原始體重單位（kg）</li>
</ul>
</div>

<strong style="font-size:20px;">🔹 Step 1：標準化身高</strong><br>
<div style="margin-left: 32px;">
<code>height_Z = height_std.transform([height])[0]</code><br>
模型是在 Z-score 空間訓練的，因此預測時也要轉換。
</div><br>

<strong style="font-size:20px;">🔹 Step 2：依照模型階數做推論</strong><br>

<div style="margin-left: 32px;">
根據參數數量自動判斷模型是：  
<ul>
  <li>2 個參數 → 線性 (a0 + a1 x)</li>
  <li>3 個參數 → 二次 (a0 + a1 x + a2 x²)</li>
  <li>4 個參數 → 三次 (a0 + a1 x + a2 x² + a3 x³)</li>
</ul>

這樣使用者不需要知道模型類型，函式會自動判斷。
</div><br>

<strong style="font-size:20px;">🔹 Step 3：反標準化回真實體重</strong><br>

<div style="margin-left: 32px;">
<code>weight_std.inverse_transform([weight_Z])[0]</code><br>
讓結果回到原本單位（公斤）。
</div>

<hr>

<span style="font-size:22px; font-weight:bold;">📌 predict_height：依體重反推身高（數值搜尋法）</span><br>

<div style="margin-left: 32px;">
這個函式比較特別：因為一次、二次、三次方程式反解過程複雜，  
因此採用「數值搜尋」方式找到最佳身高。
</div>

<br>

<strong style="font-size:20px;">🔹 Step 1：標準化體重</strong>
<div style="margin-left: 32px;">
<code>weight_Z = weight_std.transform([weight])[0]</code><br>
</div><br>

<strong style="font-size:20px;">🔹 Step 2：建立可能的 Z-score 身高範圍</strong>
<div style="margin-left: 32px;">
<code>possible_heights = np.linspace(-3, 3, 1000)</code><br>
表示在 Z-score 空間中從平均 -3σ 到 +3σ 列舉 1000 個可能身高。
</div><br>

<strong style="font-size:20px;">🔹 Step 3：把所有候選身高代入模型計算對應體重</strong>
<div style="margin-left: 32px;">
依照模型階數動態決定：線性/二次/三次。
</div><br>

<strong style="font-size:20px;">🔹 Step 4：找出最接近目標體重的那個身高</strong>
<div style="margin-left: 32px;">
<code>idx = np.argmin(np.abs(predicted_weights - weight_Z))</code><br>
這行的作用是：  
「找出模型預測體重最接近 weight_Z 的 Z-score 身高」。
</div><br>

<strong style="font-size:20px;">🔹 Step 5：反標準化回真實身高單位（cm）</strong>
<div style="margin-left: 32px;">
<code>height_std.inverse_transform([height_Z])[0]</code>
</div>

<hr>

<span style="font-size:22px; font-weight:bold;">📌 小結：兩個預測函式的差異</span>

<div style="margin-left: 32px;">
<ul>
  <li><strong>predict_weight</strong>：直接帶入公式 → 解析解</li>
  <li><strong>predict_height</strong>：沒有解析解 → 數值搜尋</li>
</ul>

這樣的設計能同時支援：  
✔ 線性回歸  
✔ 二次曲線  
✔ 三次曲線  
且無需額外寫不同版本的預測器。
</div>
    `
},

{
    "line": `
# ==========================================================
# 主程式執行區
# ==========================================================
# 🔧 模型訓練與資料設定參數
data_size = 300        # 資料筆數
heights_min = 140      # 身高最小值（cm）
heights_max = 180      # 身高最大值（cm）
sigma = 10             # 體重生成時的隨機雜訊標準差（越大表示資料越分散）
height_ans = 1.0       # 真實斜率（每增加 1 cm 身高，體重平均增加 1.0 kg）
weight_ans = -100      # 真實截距（身高 0 cm 時的理論體重）
a0 = 0                 # 模型截距（y = a0 + ...）
a1 = -1                # 線性影響
a2 = -0.5              # 二次影響（曲線彎曲度）
a3 = 0.1               # 三次影響（曲線更高階彎曲度）
learning_rate = 0.01   # 學習率 (learning rate)：控制每次梯度下降更新參數的幅度  
num_epochs = 200       # 訓練迴圈次數 (number of epochs)
plot_every = 50        # 每隔多少次迴圈繪製一次回歸線

# 產生身高資料
heights = np.random.uniform(heights_min, heights_max, data_size)
weights = generate_weights(heights, sigma, height_ans, weight_ans)

df = pd.DataFrame({'height': heights, 'weight': weights})

# 標準化
height_std = MyZStandardization()
weight_std = MyZStandardization()
height_std.fit(df['height'])
weight_std.fit(df['weight'])
df['height_Z'] = height_std.transform(df['height'])
df['weight_Z'] = weight_std.transform(df['weight'])

# 選擇模型
# model = MyLinear(a0, a1)
# model = MyQuadratic(a0, a1, a2)
model = MyCubic(a0, a1, a2, a3)  # 三次模型

loss_fn = MyMSELoss(model)
trainer = MyTrainer(loss_fn)

# 訓練模型
train_model(df, model, trainer, height_std, weight_std,
            learning_rate, num_epochs, plot_every)

# 測試預測
test_height = 170
predicted_weight = predict_weight(test_height, model, height_std, weight_std)
print(f"\\n預測身高 {test_height} cm 對應體重 ≈ {predicted_weight:.2f} kg")
    `,
    "desc": `
<span style="font-size:26px; font-weight:bold;">主程式執行區解析：從資料生成到模型訓練與預測</span><br><br>

這個程式區塊是整個專案的「入口點」，負責完成以下流程：  
✔ 設定參數  
✔ 生成模擬資料（身高→體重）  
✔ 標準化資料  
✔ 選擇模型並訓練  
✔ 測試預測功能  
<br>

<hr>

<span style="font-size:22px; font-weight:bold;">📌 1️⃣ 模型訓練與資料設定參數</span><br>
<div style="margin-left: 32px;">
- <strong>data_size</strong>：生成的資料筆數<br>
- <strong>heights_min / heights_max</strong>：身高範圍 (cm)<br>
- <strong>sigma</strong>：體重生成時的隨機雜訊標準差<br>
- <strong>height_ans / weight_ans</strong>：真實線性模型的斜率與截距<br>
- <strong>a0 ~ a3</strong>：選擇模型的初始參數<br>
- <strong>learning_rate</strong>：梯度下降步長<br>
- <strong>num_epochs</strong>：總訓練迴圈次數<br>
- <strong>plot_every</strong>：每隔多少回合繪圖觀察模型收斂
</div>

<hr>

<span style="font-size:22px; font-weight:bold;">📌 2️⃣ 產生資料</span><br>
<div style="margin-left: 32px;">
- 使用 <code>np.random.uniform</code> 生成身高資料<br>
- 使用 <code>generate_weights()</code> 將身高轉成帶有隨機雜訊的體重<br>
- 最終放入 <code>pd.DataFrame</code> 方便操作
</div>

<hr>

<span style="font-size:22px; font-weight:bold;">📌 3️⃣ 標準化資料</span><br>
<div style="margin-left: 32px;">
- 使用 <code>MyZStandardization</code> 將身高與體重轉成 Z-score<br>
- 生成 <code>height_Z</code> 和 <code>weight_Z</code>，供模型訓練使用
</div>

<hr>

<span style="font-size:22px; font-weight:bold;">📌 4️⃣ 選擇模型與訓練器</span><br>
<div style="margin-left: 32px;">
- 可選擇 <code>MyLinear</code> / <code>MyQuadratic</code> / <code>MyCubic</code><br>
- 訓練器 <code>MyTrainer</code> 搭配損失函式 <code>MyMSELoss</code><br>
- 所有參數初始化完成後即可進行訓練
</div>

<hr>

<span style="font-size:22px; font-weight:bold;">📌 5️⃣ 訓練模型</span><br>
<div style="margin-left: 32px;">
- 使用 <code>train_model()</code> 執行完整訓練迴圈<br>
- 功能包含：
<ul>
  <li>計算梯度</li>
  <li>更新模型參數</li>
  <li>每隔 <code>plot_every</code> 次迴圈印出 RMSE 與參數</li>
  <li>可視化模型預測線與資料點</li>
</ul>
</div>

<hr>

<span style="font-size:22px; font-weight:bold;">📌 6️⃣ 測試預測</span><br>
<div style="margin-left: 32px;">
- 選擇測試身高 <code>test_height = 170</code> cm<br>
- 呼叫 <code>predict_weight()</code> 得到預測體重<br>
- 將結果列印出，方便檢查模型是否合理
</div>

<hr>

<span style="font-size:22px; font-weight:bold;">📌 小結：主程式角色</span><br>
<div style="margin-left: 32px;">
- 整合前面所有模組：資料生成、標準化、模型選擇、訓練與預測<br>
- 可透過修改參數快速切換不同資料量、模型階數與學習率<br>
- 適合教學與實驗，完整展示從資料到模型的流程
</div>
    `
},

  ]
};
