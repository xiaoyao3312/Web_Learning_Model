export const ML_01_Linear_Regression = {
  id: 1,
  name: "ML_01_Linear_Regression",
  code: [
    {
      "line": `
# ==========================
# 線性回歸專案大綱
# ==========================
      `,
      "desc": `
<h5>📝 線性回歸專案大綱解析 (純線性)</h5><br><br>

本專案以手動線性回歸為例，完整展示從資料生成、標準化、模型訓練到預測與視覺化的流程，幫助學生理解梯度下降、標準化、預測與可視化。

<hr>

<h6>1️⃣ 目的</h6><br>
<div style="margin-left:10px;">
<ul>
<li>建立線性回歸模型 <code style="color:red;">y = a0 + a1 * x</code>，理解模型訓練流程</li>
<li>觀察手動梯度下降訓練過程，理解參數收斂</li>
<li>資料標準化與反標準化，提高梯度下降收斂效率</li>
<li>實作「身高 → 體重」及「體重 → 身高」的預測功能</li>
<li>視覺化資料點、回歸線及 RMSE 變化，驗證模型效果</li>
</ul>
</div>

<hr>

<h6>2️⃣ 流程</h6><br>
<div style="margin-left:10px;">
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
<pre><code style="color:red;">model = MyLinear(a0=0, a1=-1)
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
plt.plot(x_line, y_line, color='red')  # 回歸線
plt.show()
</code></pre>
</li>
</ol>
</div>

<hr>

<h6>3️⃣ 小結</h6><br>
<div style="margin-left:10px;">
- 展示完整流程：資料生成 → 標準化 → 模型初始化 → 訓練 → 預測 → 視覺化<br>
- 手動梯度下降 + Z-score 標準化，直觀理解線性回歸內部運作
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
<h5>Python 常用資料科學與視覺化套件匯入解析</h5><br><br>

這五行程式碼都是資料科學、機器學習與資料視覺化的基礎套件，逐行解析如下：

<hr>

<h6>1️⃣ import numpy as np</h6><br>
<div style="margin-left: 10px;">
- NumPy 是 Python 的數值運算核心套件，簡稱 np。<br>
- 提供高效能陣列運算、矩陣運算與線性代數功能。<br>
- 幾乎所有科學計算都會用到 NumPy。<br>
- 範例：<br>
<code>arr = np.array([1, 2, 3])<br>
mean_val = np.mean(arr)  # 計算平均值<br>
</code>
</div>

<hr>

<h6>2️⃣ import pandas as pd</h6><br>
<div style="margin-left: 10px;">
- Pandas 是 Python 的資料處理利器，簡稱 pd。<br>
- 擅長操作表格資料（DataFrame）與時間序列資料（Series）。<br>
- 常用於資料清理、分析與匯出 CSV/Excel。<br>
- 範例：<br>
<code>df = pd.read_csv("data.csv")   # 讀取 CSV 檔案<br>
print(df.head())                  # 顯示前 5 筆資料<br>
</code>
</div>

<hr>

<h6>3️⃣ import seaborn as sns</h6><br>
<div style="margin-left: 10px;">
- Seaborn 是基於 Matplotlib 的高階視覺化套件，簡稱 sns。<br>
- 主要用於統計圖表，如箱型圖、直方圖、散佈圖與熱力圖。<br>
- 可以快速畫出漂亮、易讀的圖表。<br>
- 範例：<br>
<code>sns.boxplot(x="age", y="salary", data=df)  # 畫箱型圖<br>
sns.histplot(df['salary'], bins=20)           # 畫直方圖<br>
</code>
</div>

<hr>

<h6>4️⃣ import plotly.express as px</h6><br>
<div style="margin-left: 10px;">
- Plotly Express 是互動式視覺化套件，簡稱 px。<br>
- 可以建立滑鼠可互動的圖表，例如放大縮小、滑鼠提示資訊。<br>
- 適合做網頁展示或交互式報表。<br>
- 範例：<br>
<code>fig = px.scatter(df, x="age", y="salary", color="department")<br>
fig.show()  # 互動式散佈圖<br>
</code>
</div>

<hr>

<h6>5️⃣ from matplotlib import pyplot as plt</h6><br>
<div style="margin-left: 10px;">
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
<code>y = a0 + a1 * x</code><br>
</div>

<hr>

<h6>總結：</h6><br>
<div style="margin-left:10px;">
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
<h5>MyLinear 類別：一次線性模型完整解說</h5><br><br>

<h6>📌 模型概念</h6><br>
<div style="margin-left: 10px;">
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

<h6>🔹 __init__：初始化模型參數</h6><br>
<div style="margin-left: 10px;">
建立 MyLinear() 物件時會自動呼叫。<br>
預設參數：a0 = 0.0（截距）、a1 = 1.0（斜率）。<br>
並透過 <code>self.set_trainables([a0, a1])</code> 將參數儲存在物件中。<br><br>
</div>

<h6>🔹 set_trainables：設定模型參數</h6><br>
<div style="margin-left: 10px;">
將傳入的參數（如 <code>[a0, a1]</code>）轉為 NumPy 陣列，方便做矩陣/向量運算。<br>
並存進 <code>self.params</code>。<br><br>
</div>

<h6>🔹 get_trainables：取得目前參數</h6><br>
<div style="margin-left: 10px;">
回傳模型參數 <code>[a0, a1]</code>。<br>
可用於顯示、紀錄或做優化計算。<br><br>
</div>

<h6>🔹 get_y：根據 x 計算 y</h6><br>
<div style="margin-left: 10px;">
將參數拆成 <code>a0</code> 與 <code>a1</code>，並套入公式：<br>
<code>y = a0 + a1 * x</code><br><br>

支援：<br>
• 單一數值（例如 3）<br>
• NumPy 陣列（例如 <code>np.array([1,2,3])</code>）<br><br>

適合大量資料的批次運算（向量化）。<br><br>
</div>

<h6>🔹 get_line：產生繪製直線用的資料</h6><br>
<div style="margin-left: 10px;">
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
<h5>MyMSELoss 類別：RMSE 損失函數完整解說</h5><br><br>

<h6>📌 這個類別的用途</h6><br>
<div style="margin-left: 10px;">
MyMSELoss 用來計算模型的預測誤差。<br>
它接收一個模型（如 MyLinear），並提供一個方法 <code>get_loss()</code>：<br><br>

<strong>計算 RMSE（Root Mean Squared Error, 均方根誤差）</strong><br>

公式：<br>
<div style="margin-left: 10px;">
RMSE = √(平均( (y_true − y_pred)² ))
</div><br>

RMSE 越小，表示模型對資料的擬合越好。<br><br>
</div>

<hr>

<h6>🔹 __init__：初始化損失函數並綁定模型</h6><br>
<div style="margin-left: 10px;">
建立 MyMSELoss 時必須傳入一個模型物件：<br><br>

<code>loss_fn = MyMSELoss(model)</code><br><br>

此模型（MyLinear）會儲存在 <code>self.model</code>。<br>
之後用 <code>get_loss()</code> 計算誤差時會用到它的 <code>get_y()</code> 做預測。<br><br>
</div>

<h6>🔹 get_model：回傳綁定的模型</h6><br>
<div style="margin-left: 10px;">
單純提供一個方法取得目前使用的模型。<br><br>
</div><br>

<h6>🔹 get_loss：計算 RMSE（均方根誤差）</h6><br>
<div style="margin-left: 10px;">
整個類別的核心功能。<br><br>

步驟如下：<br>

1. **取得模型預測**  
使用綁定模型的 <code>get_y(x)</code> 方法：  
<code>y_pred = self.model.get_y(x)</code>

2. **計算誤差平方（Squared Error, SE）**  
<code>se = (y_true - y_pred) ** 2</code>

3. **開根號變成 RMSE（均方根誤差）**  
<code>return np.sqrt(se.mean())</code><br><br>

為什麼用 RMSE 而不是 MSE？<br>
<div style="margin-left: 24px;">
因為 RMSE 的單位和 y 相同，更容易了解誤差大小。<br>
MSE 單位會變成平方，不直觀。<br>
</div><br>
</div>
      `
    },
    {
      "line": `
class MyTrainer():
    def __init__(self, loss_fn):
        """梯度下降訓練器: 負責計算梯度並用於更新參數"""
        self.loss_fn = loss_fn
        self.model = loss_fn.get_model()

    def get_gradient(self, x, y_true):
        """計算梯度 (只支援 MyLinear, 2個參數 a0, a1)"""
        y_pred = self.model.get_y(x)
        error = y_pred - y_true # (y_pred - y_true)

        # 梯度 for a0 (截距) : 2/N * sum(y_pred - y_true)
        grad_a0 = 2 * error.mean()

        # 梯度 for a1 (斜率) : 2/N * sum((y_pred - y_true) * x)
        grad_a1 = 2 * (error * x).mean()

        return np.array([grad_a0, grad_a1], np.float64)
      `,
      "desc": `
<h5>MyTrainer 類別：梯度下降訓練器解說</h5><br><br>

<h6>📌 這個類別的用途</h6><br>
<div style="margin-left: 10px;">
此類別專門用來計算 **梯度**，是實現梯度下降（Gradient Descent）的核心。<br>
它依賴於模型 (MyLinear) 和真實資料來計算每個參數應該調整的方向和幅度。<br><br>
</div>

<hr>

<h6>🔹 __init__：初始化並綁定模型與損失函數</h6><br>
<div style="margin-left: 10px;">
建立 Trainer 時會儲存 Loss Function (<code>loss_fn</code>) 和 Model (<code>model</code>)。<br>
Loss Function 用來計算 RMSE，而 Model 則用來進行預測。<br><br>
</div>

<h6>🔹 get_gradient：計算參數梯度（核心）</h6><br>
<div style="margin-left: 10px;">
此方法計算兩個參數 $a_0$ (截距) 和 $a_1$ (斜率) 的梯度：<br>

<strong style="font-size:20px;">1. $a_0$ 的梯度 (grad\_a0)：</strong><br>
$$\\frac{\\partial MSE}{\\partial a_0} = \\frac{2}{N} \\sum (y_{pred} - y_{true})$$<br>
實際程式碼：<code>2 * error.mean()</code><br><br>

<strong style="font-size:20px;">2. $a_1$ 的梯度 (grad\_a1)：</strong><br>
$$\\frac{\\partial MSE}{\\partial a_1} = \\frac{2}{N} \\sum (y_{pred} - y_{true}) \\cdot x$$
實際程式碼：<code>2 * (error * x).mean()</code><br><br>

回傳一個包含 $a_0$ 和 $a_1$ 梯度的 NumPy 陣列，供主程式區塊用來更新參數。<br>
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
<h5>MyZStandardization 類別：Z-score 標準化完整解說</h5><br><br>

<h6>📌 這個類別的用途</h6><br>
<div style="margin-left: 10px;">
此類別專門用來做「Z-score 標準化（Standardization）」。<br><br>

標準化的公式為：  
<div style="margin-left: 10px;">
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

<h6>🔹 __init__：初始化（尚未計算 mean 與 std）</h6><br>
<div style="margin-left: 10px;">
初始化後預設：  
<ul>
  <li><code>self.mean = None</code></li>
  <li><code>self.std = None</code></li>
</ul>
代表還未對任何資料進行 fit。<br>
這讓使用者知道標準化器尚未建立轉換所需的統計量。<br>
</div><br>

<h6>🔹 fit：從資料計算平均與標準差</h6><br>
<div style="margin-left: 10px;">
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

<h6>🔹 transform：將資料轉成標準化後的 Z 分數</h6><br>
<div style="margin-left: 10px;">
使用公式：  
<div style="margin-left: 10px;">
Z = (x − mean) / std  
</div><br>

特點：  
<ul>
  <li>支援 list / NumPy array</li>
  <li>計算後變成平均 0、標準差 1 的資料</li>
</ul>
</div><br>

<h6>🔹 inverse_transform：還原回原資料</h6><br>
<div style="margin-left: 10px;">
使用逆轉換公式：  
<div style="margin-left: 10px;">
x = Z * std + mean  
</div><br>

用途：  
<ul>
  <li>模型預測後數值通常需還原回原本尺度</li>
  <li>容易比較真實值與模型輸出</li>
</ul>
</div>
`
    },

    {
      "line": `
def generate_weights(heights, sigma = 5, height_ans = 1, weight_ans = -100):
    return weight_ans + height_ans * heights + np.random.normal(0, sigma, heights.shape)
      `,

      "desc": `
<h5>generate_weights 函式：模擬「身高 → 體重」資料的生成器</h5><br><br>

<h6>📌 函式用途</h6><br>
<div style="margin-left: 10px;">
這個函式用來「隨機生成」身高與體重的關係資料。<br>
它模擬一個線性模型：  
<div style="margin-left: 10px;">
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

<h6>🔹 函式參數說明</h6><br>

<div style="margin-left: 10px;">
<strong>1. heights</strong><br>
使用者提供的「身高資料」陣列 (NumPy array)。<br><br>

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

<h6>🔹 函數如何運作</h6><br>

<div style="margin-left: 10px;">
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
        # 1. 計算梯度
        grads = trainer.get_gradient(df['height_Z'], df['weight_Z'])
        # 2. 更新參數 (Gradient Descent)
        new_params = model.get_trainables() - learning_rate * grads
        # 3. 設定回模型中
        model.set_trainables(new_params)

        if (epoch + 1) % plot_every == 0 or epoch == 0:
            current_loss = trainer.loss_fn.get_loss(df['height_Z'], df['weight_Z'])
            params = model.get_trainables()
            print(f"Epoch {epoch + 1:3d} - RMSE: {current_loss:.4f} - Params: {params}")

            # 反標準化，產生繪圖用的原始尺度線條
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
<h5>train_model：執行模型訓練與視覺化的主函式</h5><br><br>

這個函式是整個專案的核心流程：  
✔ 取得資料  
✔ 計算梯度  
✔ 更新模型參數  
✔ 顯示訓練過程  
✔ 每隔幾次迴圈視覺化模型線條  
<br>

用於線性回歸模型訓練，具有高度泛用性。

<hr>

<h6>📌 函式用途</h6><br>

<div style="margin-left: 10px;">
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

<h6>🔹 參數說明</h6>

<div style="margin-left: 10px;">

<strong>1. df</strong><br>
Pandas 資料表，含有 height、weight、height_Z、weight_Z。<br><br>

<strong>2. model (MyLinear)</strong><br>
模型物件，提供參數存取與預測功能。<br><br>

<strong>3. trainer (MyTrainer)</strong><br>
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

<h6>🔹 訓練核心流程（Epoch Loop）</h6>

<div style="margin-left: 10px;">

<strong>1. 計算梯度：</strong><br>
<code>grads = trainer.get_gradient(df['height_Z'], df['weight_Z'])</code><br><br>

<strong>2. 更新參數（Gradient Descent）：</strong><br>
<code>new_params = old_params - learning_rate * grads</code><br>
這就是手寫版的梯度下降。<br><br>

<strong>3. 設定回模型中：</strong><br>
<code>model.set_trainables(new_params)</code><br><br>

</div>

<hr>

<h6>🔹 可視化與訓練紀錄</h6>

<div style="margin-left: 10px;">
只要符合下列任一條件就會印出資訊並畫圖：  
<ul>
  <li>第 1 次 epoch（epoch == 0）</li>
  <li>每 plot_every 次迴圈一次</li>
</ul>

接著會將模型的 Z-score 預測線條，透過反標準化還原成原始尺度，並繪製在資料點上，觀察模型收斂狀況。
</div>
`
    },

    {
      "line": `
def predict_weight(height, model, height_std, weight_std):
    """給定身高預測體重"""
    # 1. 將身高轉為 Z-score
    height_Z = height_std.transform([height])[0]
    params = model.get_trainables()

    # 2. 應用線性模型公式 (y = a0 + a1 * x)
    a0, a1 = params
    weight_Z = a0 + a1 * height_Z

    # 3. 反標準化回真實體重
    return weight_std.inverse_transform([weight_Z])[0]

def predict_height(weight, model, height_std, weight_std):
    """給定體重預測身高（數值搜尋）"""
    # 1. 將體重轉為 Z-score
    params = model.get_trainables()
    weight_Z = weight_std.transform([weight])[0]

    # 2. 建立可能的 Z-score 身高範圍 (-3σ 到 +3σ)
    possible_heights = np.linspace(-3, 3, 1000)

    # 3. 將所有候選身高代入線性模型，計算預測體重
    a0, a1 = params
    predicted_weights = a0 + a1 * possible_heights

    # 4. 找出最接近目標體重 (weight_Z) 的那個身高 Z-score
    idx = np.argmin(np.abs(predicted_weights - weight_Z))
    height_Z = possible_heights[idx]

    # 5. 反標準化回真實身高
    return height_std.inverse_transform([height_Z])[0]
      `,
      "desc": `
<h5>預測函式：根據身高推估體重 & 根據體重推估身高</h5><br><br>

這兩個函式負責將訓練好的線性模型應用到實際預測上：  
✔ <strong>predict_weight</strong>：輸入身高 → 預測體重 (直接代入公式)  
✔ <strong>predict_height</strong>：輸入體重 → 反推身高 (數值搜尋)  
<br>

<hr>

<h6>📌 predict_weight：依身高預測體重 (解析解)</h6><br>

<div style="margin-left: 10px;">
此函式的流程分為三步：  
<ul>
  <li>把輸入身高轉成 Z-score</li>
  <li>套用線性模型公式 <code>weight_Z = a0 + a1 * height_Z</code></li>
  <li>再反標準化回原始體重單位（kg）</li>
</ul>
</div>

<hr>

<h6>📌 predict_height：依體重反推身高（數值搜尋法）</h6><br>

<div style="margin-left: 10px;">
這個函式雖然對於線性模型有解析解 (<code>height_Z = (weight_Z - a0) / a1</code>)，但為了讓預測器更穩定，仍採用「數值搜尋」方式找到最佳身高。<br><br>
流程簡述：  
1. 將目標體重標準化為 <code>weight_Z</code>。  
2. 在合理的 Z-score 範圍內列舉 (<code>np.linspace</code>) 1000 個可能的身高 Z-score。  
3. 將這 1000 個候選身高代入模型，預測對應的體重 Z-score。  
4. 找出預測體重 **最接近** <code>weight_Z</code> 的那個身高 Z-score。  
5. 將找出的身高 Z-score 反標準化回真實身高（cm）。
</div>
`
    },

    {
      "line": `
# ==========================================================
# 主程式執行區
# ==========================================================
# 🔧 模型訓練與資料設定參數
data_size = 300        # 資料筆數
heights_min = 140      # 身高最小值（cm）
heights_max = 180      # 身高最大值（cm）
sigma = 10             # 體重生成時的隨機雜訊標準差（越大表示資料越分散）
height_ans = 1.0       # 真實斜率（每增加 1 cm 身高，體重平均增加 1.0 kg）
weight_ans = -100      # 真實截距（身高 0 cm 時的理論體重）
a0 = 0                 # 模型初始截距（y = a0 + ...）
a1 = -1                # 模型初始斜率
# 刪除 a2, a3
learning_rate = 0.01   # 學習率 (learning rate)：控制每次梯度下降更新參數的幅度  
num_epochs = 200       # 訓練迴圈次數 (number of epochs)
plot_every = 50        # 每隔多少次迴圈繪製一次回歸線

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

# 選擇模型 (只保留線性模型)
model = MyLinear(a0, a1) 

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
<h5>主程式執行區解析：從資料生成到模型訓練與預測</h5><br><br>

這個程式區塊是整個專案的「入口點」，負責完成以下流程：  
✔ 設定參數  
✔ 生成模擬資料（身高→體重）  
✔ 標準化資料  
✔ 選擇線性模型並訓練  
✔ 測試預測功能  
<br>

<hr>

<h6>📌 1️⃣ 模型訓練與資料設定參數</h6><br>
<div style="margin-left: 10px;">
- <strong>data_size</strong>：生成的資料筆數<br>
- <strong>heights_min / heights_max</strong>：身高範圍 (cm)<br>
- <strong>sigma</strong>：體重生成時的隨機雜訊標準差<br>
- <strong>height_ans / weight_ans</strong>：真實線性模型的斜率與截距<br>
- <strong>a0 / a1</strong>：選擇模型的初始參數<br>
- <strong>learning_rate</strong>：梯度下降步長<br>
- <strong>num_epochs</strong>：總訓練迴圈次數<br>
- <strong>plot_every</strong>：每隔多少回合繪圖觀察模型收斂
</div>

<hr>

<h6>📌 2️⃣ 產生資料</h6><br>
<div style="margin-left: 10px;">
- 使用 <code>np.random.uniform</code> 生成身高資料<br>
- 使用 <code>generate_weights()</code> 將身高轉成帶有隨機雜訊的體重<br>
- 最終放入 <code>pd.DataFrame</code> 方便操作
</div>

<hr>

<h6>📌 3️⃣ 標準化資料</h6><br>
<div style="margin-left: 10px;">
- 使用 <code>MyZStandardization</code> 將身高與體重轉成 Z-score<br>
- 生成 <code>height_Z</code> 和 <code>weight_Z</code>，供模型訓練使用
</div>

<hr>

<h6>📌 4️⃣ 選擇模型與訓練器</h6><br>
<div style="margin-left: 10px;">
- 選擇 <code>MyLinear</code> 模型<br>
- 訓練器 <code>MyTrainer</code> 搭配損失函式 <code>MyMSELoss</code><br>
- 所有參數初始化完成後即可進行訓練
</div>

<hr>

<h6>📌 5️⃣ 訓練模型</h6><br>
<div style="margin-left: 10px;">
- 使用 <code>train_model()</code> 執行完整訓練迴圈<br>
- 包含計算梯度、更新參數、輸出 RMSE 與可視化等功能
</div>

<hr>

<h6>📌 6️⃣ 測試預測</h6><br>
<div style="margin-left: 10px;">
- 選擇測試身高 <code>test_height = 170</code> cm<br>
- 呼叫 <code>predict_weight()</code> 得到預測體重<br>
- 將結果列印出，方便檢查模型是否合理
</div>
`
    },
  ]
};