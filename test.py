from flask import Flask, request, render_template, send_from_directory

app = Flask(__name__, template_folder=".")

@app.route('/', methods=['GET', 'POST'])
def form():
    if request.method == 'POST':
        # Handle the form submission
        return f"You submitted these values: {request.form.get('ms')}"
    else:
        # Serve the form
        return render_template('./test.html')

@app.route("/multiselect.js")
def get_js():
    return send_from_directory(".", "multiselect.js")

if __name__ == "__main__":
    app.run()

