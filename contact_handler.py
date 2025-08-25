#!/usr/bin/env python3
"""
Contact Form Handler for EduFun Library
Handles form submissions and saves data to CSV and JSON files
"""

import json
import csv
import os
from datetime import datetime
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlparse
import re

class ContactFormHandler(BaseHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        # Define file paths for storing contact data
        self.csv_file = 'contact_submissions.csv'
        self.json_file = 'contact_submissions.json'
        self.backup_dir = 'contact_backups'
        super().__init__(*args, **kwargs)

    def do_GET(self):
        """Handle GET requests"""
        parsed_path = urlparse(self.path)

        if parsed_path.path == '/contact/submissions':
            # Return list of all submissions
            self.serve_submissions()
        elif parsed_path.path == '/contact/export':
            # Export submissions as downloadable file
            self.export_submissions()
        else:
            self.send_error(404, "Not Found")

    def do_POST(self):
        """Handle POST requests for form submissions"""
        if self.path == '/contact/submit':
            self.handle_contact_form()
        else:
            self.send_error(404, "Not Found")

    def do_OPTIONS(self):
        """Handle OPTIONS requests for CORS"""
        self.send_response(200)
        self.send_cors_headers()
        self.end_headers()

    def send_cors_headers(self):
        """Send CORS headers"""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def handle_contact_form(self):
        """Process contact form submission"""
        try:
            # Get content length
            content_length = int(self.headers['Content-Length'])

            # Read the form data
            post_data = self.rfile.read(content_length).decode('utf-8')

            # Parse form data
            form_data = parse_qs(post_data)

            # Extract form fields
            submission = {
                'id': self.generate_submission_id(),
                'timestamp': datetime.now().isoformat(),
                'name': form_data.get('name', [''])[0],
                'email': form_data.get('email', [''])[0],
                'phone': form_data.get('phone', [''])[0],
                'subject': form_data.get('subject', [''])[0],
                'message': form_data.get('message', [''])[0],
                'ip_address': self.client_address[0],
                'user_agent': self.headers.get('User-Agent', '')
            }

            # Validate required fields
            validation_result = self.validate_submission(submission)
            if not validation_result['valid']:
                self.send_error_response(400, validation_result['errors'])
                return

            # Save to both CSV and JSON
            self.save_to_csv(submission)
            self.save_to_json(submission)

            # Create backup if needed
            self.create_backup_if_needed()

            # Send success response
            self.send_success_response(submission)

            # Log the submission
            self.log_submission(submission)

        except Exception as e:
            print(f"Error processing form: {str(e)}")
            self.send_error_response(500, "Internal server error")

    def validate_submission(self, submission):
        """Validate form submission data"""
        errors = []

        # Check required fields
        required_fields = ['name', 'email', 'subject', 'message']
        for field in required_fields:
            if not submission.get(field, '').strip():
                errors.append(f"{field.capitalize()} is required")

        # Validate email format
        email = submission.get('email', '').strip()
        if email and not self.is_valid_email(email):
            errors.append("Invalid email format")

        # Validate message length
        message = submission.get('message', '').strip()
        if len(message) > 5000:
            errors.append("Message is too long (maximum 5000 characters)")

        # Check for potential spam
        if self.is_potential_spam(submission):
            errors.append("Submission flagged as potential spam")

        return {
            'valid': len(errors) == 0,
            'errors': errors
        }

    def is_valid_email(self, email):
        """Validate email format"""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None

    def is_potential_spam(self, submission):
        """Basic spam detection"""
        spam_keywords = ['viagra', 'casino', 'lottery', 'winner', 'prize', 'urgent', 'confidential']
        message = submission.get('message', '').lower()

        # Check for excessive links
        if message.count('http') > 3:
            return True

        # Check for spam keywords
        for keyword in spam_keywords:
            if keyword in message:
                return True

        return False

    def generate_submission_id(self):
        """Generate unique submission ID"""
        return f"CONTACT_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{os.getpid()}"

    def save_to_csv(self, submission):
        """Save submission to CSV file"""
        file_exists = os.path.exists(self.csv_file)

        with open(self.csv_file, 'a', newline='', encoding='utf-8') as csvfile:
            fieldnames = ['id', 'timestamp', 'name', 'email', 'phone', 'subject', 'message', 'ip_address', 'user_agent']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

            # Write header if file is new
            if not file_exists:
                writer.writeheader()

            # Write submission data
            writer.writerow(submission)

    def save_to_json(self, submission):
        """Save submission to JSON file"""
        submissions = []

        # Load existing submissions if file exists
        if os.path.exists(self.json_file):
            try:
                with open(self.json_file, 'r', encoding='utf-8') as jsonfile:
                    submissions = json.load(jsonfile)
            except (json.JSONDecodeError, FileNotFoundError):
                submissions = []

        # Add new submission
        submissions.append(submission)

        # Save back to file
        with open(self.json_file, 'w', encoding='utf-8') as jsonfile:
            json.dump(submissions, jsonfile, indent=2, ensure_ascii=False)

    def create_backup_if_needed(self):
        """Create backup files periodically"""
        if not os.path.exists(self.backup_dir):
            os.makedirs(self.backup_dir)

        # Create backup every 100 submissions
        if os.path.exists(self.json_file):
            with open(self.json_file, 'r', encoding='utf-8') as f:
                submissions = json.load(f)

            if len(submissions) % 100 == 0:
                backup_timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                backup_file = os.path.join(self.backup_dir, f'submissions_backup_{backup_timestamp}.json')

                with open(backup_file, 'w', encoding='utf-8') as f:
                    json.dump(submissions, f, indent=2, ensure_ascii=False)

    def serve_submissions(self):
        """Serve list of submissions (for admin interface)"""
        try:
            if os.path.exists(self.json_file):
                with open(self.json_file, 'r', encoding='utf-8') as f:
                    submissions = json.load(f)

                # Remove sensitive information for public view
                public_submissions = []
                for sub in submissions:
                    public_sub = {
                        'id': sub['id'],
                        'timestamp': sub['timestamp'],
                        'subject': sub['subject'],
                        'name': sub['name'][:1] + '*' * (len(sub['name']) - 1) if sub['name'] else '',
                        'email': sub['email'][:3] + '*' * (len(sub['email']) - 6) + sub['email'][-3:] if len(sub['email']) > 6 else sub['email']
                    }
                    public_submissions.append(public_sub)

                self.send_json_response(public_submissions)
            else:
                self.send_json_response([])
        except Exception as e:
            self.send_error_response(500, f"Error retrieving submissions: {str(e)}")

    def export_submissions(self):
        """Export submissions as CSV download"""
        try:
            if os.path.exists(self.csv_file):
                with open(self.csv_file, 'r', encoding='utf-8') as f:
                    csv_content = f.read()

                self.send_response(200)
                self.send_header('Content-Type', 'text/csv')
                self.send_header('Content-Disposition', 'attachment; filename="contact_submissions.csv"')
                self.send_cors_headers()
                self.end_headers()
                self.wfile.write(csv_content.encode('utf-8'))
            else:
                self.send_error_response(404, "No submissions found")
        except Exception as e:
            self.send_error_response(500, f"Error exporting submissions: {str(e)}")

    def send_success_response(self, submission):
        """Send success response"""
        response_data = {
            'success': True,
            'message': 'Thank you for your message! We will get back to you soon.',
            'submission_id': submission['id'],
            'timestamp': submission['timestamp']
        }
        self.send_json_response(response_data)

    def send_error_response(self, status_code, message):
        """Send error response"""
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_cors_headers()
        self.end_headers()

        error_data = {
            'success': False,
            'error': message if isinstance(message, str) else ', '.join(message)
        }
        self.wfile.write(json.dumps(error_data).encode('utf-8'))

    def send_json_response(self, data):
        """Send JSON response"""
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_cors_headers()
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))

    def log_submission(self, submission):
        """Log submission to console"""
        print(f"📧 New contact form submission:")
        print(f"   ID: {submission['id']}")
        print(f"   From: {submission['name']} ({submission['email']})")
        print(f"   Subject: {submission['subject']}")
        print(f"   Time: {submission['timestamp']}")
        print(f"   IP: {submission['ip_address']}")
        print("=" * 50)

def run_server(port=8081):
    """Run the contact form handler server"""
    server_address = ('', port)
    httpd = HTTPServer(server_address, ContactFormHandler)

    print(f"🚀 Contact Form Handler running on port {port}")
    print(f"📝 Form endpoint: http://localhost:{port}/contact/submit")
    print(f"📊 Submissions view: http://localhost:{port}/contact/submissions")
    print(f"📁 Export CSV: http://localhost:{port}/contact/export")
    print("Press Ctrl+C to stop the server")

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped")
        httpd.server_close()

if __name__ == '__main__':
    # Create data directory if it doesn't exist
    if not os.path.exists('contact_data'):
        os.makedirs('contact_data')

    # Change to data directory
    os.chdir('contact_data')

    run_server()
