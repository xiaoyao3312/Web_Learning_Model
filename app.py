from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/ml")
def ml():
    return render_template("ml.html")

@app.route("/dl")
def dl():
    return render_template("dl.html")

if __name__ == "__main__":
    app.run(debug=True)
