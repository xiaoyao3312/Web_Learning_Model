# app.py

from flask import Flask, render_template

# 假設你已創建 config.py
try:
    from config import DevelopmentConfig as Config # 載入開發環境配置
except ImportError:
    # 如果找不到 config.py，使用默認配置
    class DefaultConfig:
        DEBUG = True
        PORT = 5000
    Config = DefaultConfig


app = Flask(__name__)
app.config.from_object(Config) # 載入配置

@app.route("/")
def index(): # 路由名稱改為 index
    return render_template("index.html")

@app.route("/ml")
def ml_page(): # 路由名稱改為 ml_page
    return render_template("ML.html")

@app.route("/dl")
def dl_page(): # 路由名稱改為 dl_page
    return render_template("DL.html")

if __name__ == "__main__":
    # 使用配置中的 DEBUG 和 PORT 變數
    app.run(
        debug=app.config.get('DEBUG', True), # 如果配置中沒有，默認 True
        port=app.config.get('PORT', 5000)    # 如果配置中沒有，默認 5000
    )