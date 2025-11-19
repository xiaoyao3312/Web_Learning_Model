export const ML_01_linear_regression = {
  id: 1,
  name: "專案 1：加法範例",
  code: [
    { 
line: 
`
程式碼大綱`, 
desc: 
`
此模型目的及流程
`
    },
    { 
line: 
`
import numpy as np
import pandas as pd
import seaborn as sns
import plotly.express as px
from matplotlib import pyplot as plt
`,
desc: 
`
<span style="font-size:26px; font-weight:bold;">此段程式碼為 Python 的套件匯入指令（import），逐行解釋如下：<br><br></span>

<span style="font-size:22px; font-weight:bold;">import numpy as np</span><br>
<div style="margin-left: 32px;">
  匯入 NumPy 套件，簡稱 np。<br>
  NumPy 提供高效能的數值運算、矩陣運算、陣列操作等功能。<br>
  例子：<code>arr = np.array([1,2,3])</code><br><br>
</div>

<span style="font-size:22px; font-weight:bold;">import pandas as pd</span><br>
<div style="margin-left: 32px;">
匯入 Pandas 套件，簡稱 pd。<br>
Pandas 用來處理表格資料（DataFrame / Series），非常適合資料清理與分析。<br>
例子：<code>df = pd.read_csv("data.csv")</code><br><br>
</div>

<span style="font-size:22px; font-weight:bold;">import seaborn as sns</span><br>
<div style="margin-left: 32px;">
匯入 Seaborn，簡稱 sns。<br>
Seaborn 是基於 Matplotlib 的高階視覺化套件，方便畫統計圖表（如箱型圖、熱力圖、分布圖）。<br>
例子：<code>sns.boxplot(x="age", y="salary", data=df)</code><br><br>
</div>

<span style="font-size:22px; font-weight:bold;">import plotly.express as px</span><br>
<div style="margin-left: 32px;">
匯入 Plotly Express，簡稱 px。<br>
Plotly 提供互動式圖表功能，比 Matplotlib 更適合網頁展示和互動。<br>
例子：<code>fig = px.scatter(df, x="age", y="salary")</code><br><br>
</div>

<span style="font-size:22px; font-weight:bold;">from matplotlib import pyplot as plt</span><br>
<div style="margin-left: 32px;">
從 Matplotlib 套件匯入 pyplot 模組，簡稱 plt。<br>
Matplotlib 是 Python 最基本的畫圖工具，pyplot 提供類似 MATLAB 的繪圖介面。<br>
例子：<code>plt.plot([1,2,3], [4,5,6]); plt.show()</code><br><br>
</div>

<span style="font-size:22px; font-weight:bold;">簡單說，這五行都是 Python 資料科學與視覺化常用套件，各自用途不同，但經常一起使用：</span><br>
<ul>
<li>numpy → 數值計算</li>
<li>pandas → 資料整理</li>
<li>seaborn / matplotlib → 靜態圖表</li>
<li>plotly.express → 互動式圖表</li>
</ul>
`
    },
    { 
      line: "def add(a,b):", desc: "定義 add 函式" },
    { line: "    return a+b", desc: "回傳 a+b" },
    { line: "result = add(1,2)", desc: "呼叫函式並存結果" },
    { line: "print(result)", desc: "印出結果" }
  ]
};
