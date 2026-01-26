from flask import Flask, render_template, request, jsonify, send_file
import json
import os
from weasyprint import HTML, CSS
from datetime import datetime
from logo_b64 import HEADER_LOGO_B64

app = Flask(__name__)

# Default empty brief structure
DEFAULT_BRIEF = {
    "meta": {
        "jobName": "",
        "projectLead": "",
        "hunchLead": "",
        "date": datetime.now().strftime("%d %b – v1"),
        "version": 1
    },
    "topline": {
        "need": "",       # Why does this brief exist?
        "ask": "",        # What have we been asked to do?
        "objectives": "", # What does success look like?
        "scope": "",      # What's in? What's out? What channels?
        "dates": ""       # What needs to happen when?
    },
    "springboard": {
        "q1": "",  # What's actually going on?
        "q2": "",  # Who do we need to convince?
        "q3": "",  # Why will anyone care?
        "q4": ""   # What's holding them back?
    },
    "strategy": {
        "hunch": "",
        "get": "",
        "to": "",
        "by": ""
    },
    "detail": {
        "proofPoints": "",
        "mandatories": "",
        "questions": "",
        "research": "",
        "appendix": "",
        "customSections": []
    },
    "settings": {
        "showProofPoints": True,
        "showMandatories": True,
        "showQuestions": True,
        "showResearch": False,
        "showAppendix": False
    }
}


@app.route('/')
def index():
    """Serve the brief builder interface"""
    return render_template('brief.html')


@app.route('/api/brief', methods=['GET'])
def get_blank_brief():
    """Return a blank brief structure"""
    return jsonify(DEFAULT_BRIEF)


@app.route('/api/brief', methods=['POST'])
def load_brief():
    """Load brief data and return rendered editor"""
    data = request.get_json()
    # Merge with defaults to ensure all fields exist
    brief = {**DEFAULT_BRIEF, **data}
    return jsonify(brief)


@app.route('/api/pdf', methods=['POST'])
def generate_pdf():
    """Generate PDF from brief data"""
    data = request.get_json()
    
    # Render the PDF template with logo
    html_content = render_template('brief_pdf.html', brief=data, logo_b64=HEADER_LOGO_B64)
    
    # Generate PDF
    pdf = HTML(string=html_content).write_pdf(
        stylesheets=[CSS(filename='static/pdf.css')]
    )
    
    # Create filename from job name
    job_name = data.get('meta', {}).get('jobName', 'brief')
    safe_name = "".join(c for c in job_name if c.isalnum() or c in (' ', '-', '_')).rstrip()
    filename = f"{safe_name or 'brief'}.pdf"
    
    # Return PDF
    from io import BytesIO
    pdf_buffer = BytesIO(pdf)
    pdf_buffer.seek(0)
    
    return send_file(
        pdf_buffer,
        mimetype='application/pdf',
        as_attachment=True,
        download_name=filename
    )


@app.route('/health')
def health():
    """Health check endpoint"""
    return jsonify({"status": "ok", "service": "dot-briefbuilder"})


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
