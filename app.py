from flask import Flask, render_template, request, jsonify
import os

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/services')
def services():
    return render_template('services.html')

@app.route('/projects')
def projects():
    return render_template('projects.html')

@app.route('/project/<project_id>')
def project_detail(project_id):
    return render_template('project-detail.html', project_id=project_id)

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/insights')
def insights():
    return render_template('insights.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/request-quote', methods=['GET', 'POST'])
def request_quote():
    if request.method == 'POST':
        # Handle multi-step form data
        data = request.get_json()
        # Process the quote request
        return jsonify({'success': True, 'message': 'Quote request received!'})
    return render_template('request-quote.html')

@app.route('/request-consultation', methods=['GET', 'POST'])
def request_consultation():
    if request.method == 'POST':
        # Handle consultation form data
        data = request.get_json()
        # Process the consultation request
        print(f"Consultation request received: {data}")
        return jsonify({'success': True, 'message': 'Consultation request received!'})
    return render_template('consultation.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
