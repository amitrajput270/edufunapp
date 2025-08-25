# EduFun Library Contact Form System

This system allows visitors to submit contact forms on your website and automatically saves the data to files for easy management.

## 📋 Features

- **Contact Form**: Professional contact form with validation
- **Data Storage**: Submissions saved to both CSV and JSON formats
- **Admin Interface**: Web-based admin panel to view submissions
- **Local Backup**: Automatic local storage backup when server is unavailable
- **Export Options**: Download submissions as CSV file
- **Real-time Updates**: Admin panel refreshes automatically
- **Spam Protection**: Basic spam detection and validation
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Quick Start

### 1. Start the Servers

```bash
# Method 1: Use the startup script (recommended)
./start_servers.sh

# Method 2: Start individually
# Terminal 1 - Web server
python3 -m http.server 8080

# Terminal 2 - Contact form handler
python3 contact_handler.py
```

### 2. Access the Website

- **Main Website**: http://localhost:8080
- **Contact Form**: http://localhost:8080/contact.html
- **Admin Panel**: http://localhost:8080/admin-submissions.html

## 📁 Data Storage

When someone submits the contact form, their data is automatically saved to:

### Files Created:

- `contact_data/contact_submissions.csv` - Spreadsheet format for easy viewing
- `contact_data/contact_submissions.json` - Structured data format
- `contact_data/contact_backups/` - Automatic backups every 100 submissions

### Data Fields Saved:

- Unique submission ID
- Timestamp
- Name, Email, Phone
- Subject category
- Message content
- IP address (for security)
- User agent (for analytics)

## 🔧 Admin Interface Features

The admin panel (`admin-submissions.html`) provides:

### Dashboard Statistics:

- Total submissions
- Today's submissions
- This week's submissions
- This month's submissions

### Management Features:

- **Search**: Find submissions by name, email, or ID
- **Filter**: Filter by subject category
- **View Details**: Click to see full submission details
- **Export**: Download all submissions as CSV
- **Real-time Updates**: Automatic refresh every 30 seconds

### Local Storage Viewer:

- View submissions saved locally when server was offline
- Useful for backup and recovery

## 🛠️ Customization

### Form Fields

To modify the contact form fields, edit `contact.html`:

- Add new `<input>` or `<select>` elements
- Update the JavaScript validation in `js/script.js`
- Modify the backend handler in `contact_handler.py`

### Styling

- Edit `css/styles.css` to change the form appearance
- Admin panel styles are in `admin-submissions.html`

### Backend Configuration

Modify `contact_handler.py` to:

- Change server port (default: 8081)
- Add email notifications
- Integrate with databases
- Add more spam protection
- Customize file formats

## 📧 Email Notifications (Optional)

To add email notifications when forms are submitted, you can modify `contact_handler.py`:

```python
import smtplib
from email.mime.text import MIMEText

def send_email_notification(submission):
    # Configure your email settings
    smtp_server = "your-smtp-server.com"
    smtp_port = 587
    email_user = "your-email@domain.com"
    email_password = "your-password"

    # Create email content
    subject = f"New Contact Form: {submission['subject']}"
    body = f"""
    New contact form submission:

    Name: {submission['name']}
    Email: {submission['email']}
    Subject: {submission['subject']}
    Message: {submission['message']}
    """

    # Send email
    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = email_user
    msg['To'] = "admin@yourlibrary.com"

    with smtplib.SMTP(smtp_server, smtp_port) as server:
        server.starttls()
        server.login(email_user, email_password)
        server.send_message(msg)
```

## 🔒 Security Features

### Built-in Protection:

- Email format validation
- Required field validation
- Message length limits (5000 characters)
- Basic spam keyword detection
- IP address logging for security

### Additional Security (Recommended):

- Add CAPTCHA for production use
- Implement rate limiting
- Add CSRF protection
- Use HTTPS in production
- Regular backup of data files

## 📱 Mobile Responsiveness

The contact form and admin interface are fully responsive:

- Touch-friendly form inputs
- Responsive table layouts
- Mobile-optimized navigation
- Adaptive text sizes

## 🚨 Troubleshooting

### Common Issues:

1. **Form not submitting**:

   - Check if contact handler server is running on port 8081
   - Look for JavaScript errors in browser console
   - Verify form fields are properly filled

2. **Admin panel not loading submissions**:

   - Ensure contact handler is running
   - Check browser console for network errors
   - Verify server URL in admin panel

3. **Data not saving**:

   - Check file permissions in contact_data directory
   - Verify Python script has write access
   - Look at server console for error messages

4. **Local storage fallback**:

   - When server is unavailable, forms save to browser's local storage
   - View saved data using "Local Storage" button in admin panel
   - Data persists until manually cleared

### Debug Mode:

Enable debug output by running the contact handler with:

```bash
python3 contact_handler.py --debug
```

## 📈 Analytics and Reporting

The system provides basic analytics through the admin interface:

- Submission trends (daily, weekly, monthly)
- Popular subject categories
- Response time tracking

For advanced analytics, you can:

- Import CSV data into Excel/Google Sheets
- Use the JSON data with analytics tools
- Build custom reports using the stored data

## 🔄 Backup and Recovery

### Automatic Backups:

- System creates backups every 100 submissions
- Backups stored in `contact_data/contact_backups/`
- Each backup includes timestamp in filename

### Manual Backup:

```bash
# Copy data files
cp -r contact_data/ backup_$(date +%Y%m%d)/

# Export via admin interface
# Visit http://localhost:8080/admin-submissions.html
# Click "Export CSV" button
```

### Recovery:

```bash
# Restore from backup
cp backup_YYYYMMDD/* contact_data/

# Or restore individual files
cp backup_YYYYMMDD/contact_submissions.json contact_data/
```

## 📞 Support

For issues or questions:

1. Check this README for troubleshooting steps
2. Review server console logs for errors
3. Check browser developer tools for JavaScript errors
4. Verify all files are present and permissions are correct

## 🎯 Production Deployment

For production use, consider:

1. Using a proper web server (Apache/Nginx)
2. Adding SSL/HTTPS certificates
3. Implementing database storage instead of files
4. Adding email notifications
5. Setting up monitoring and logging
6. Implementing user authentication for admin panel
7. Adding CAPTCHA for spam protection

---

_This contact form system is designed to be simple, reliable, and easy to customize for your library's needs._
