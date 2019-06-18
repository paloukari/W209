from flask import Flask, render_template
app = Flask(__name__)

@app.route("/")
def w209():
    file="about9.jpg"
    return render_template("w209.html",file=file)

@app.route("/HW2")
def w209_HW2():
    return render_template("HW2/index.html")

if __name__ == "__main__":
    app.run()
