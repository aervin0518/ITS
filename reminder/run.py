import os
from datetime import datetime, timezone, timedelta
from email.message import EmailMessage
import smtplib
import requests

FORM_ID = os.environ["JOTFORM_FORM_ID"]               # e.g., "12345678901234"
EMAIL_FIELD_KEY = os.environ["JOTFORM_EMAIL_KEY"]     # e.g., "email" or "q5_email"
API_KEY = os.environ["JOTFORM_API_KEY"]
SMTP_HOST = os.environ["SMTP_HOST"]                   # e.g., "smtp.gmail.com"
SMTP_PORT = int(os.environ.get("SMTP_PORT", "465"))
SMTP_USER = os.environ["SMTP_USER"]
SMTP_PASS = os.environ["SMTP_PASS"]
CUTOFF_HOURS = int(os.environ.get("CUTOFF_HOURS", "24"))

def fetch_drafts():
    url = f"https://api.jotform.com/form/{FORM_ID}/submissions"
    params = {"apiKey": API_KEY, "limit": 1000, "status": "DRAFT"}  # use "INCOMPLETE" if your account returns that
    res = requests.get(url, params=params, timeout=15)
    res.raise_for_status()
    return res.json().get("content", [])

def send_reminder(to_email, edit_link):
    msg = EmailMessage()
    msg["Subject"] = "Please complete your survey"
    msg["From"] = SMTP_USER
    msg["To"] = to_email
    msg.set_content(f"Hi,\n\nPlease finish your survey here: {edit_link}\n\nThank you.")
    with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT) as s:
        s.login(SMTP_USER, SMTP_PASS)
        s.send_message(msg)

def main():
    cutoff = datetime.now(timezone.utc) - timedelta(hours=CUTOFF_HOURS)
    for sub in fetch_drafts():
        created_ts = int(sub.get("created_at", "0"))
        created = datetime.fromtimestamp(created_ts, tz=timezone.utc)
        if created > cutoff:
            continue
        answers = sub.get("answers", {})
        email = None
        if EMAIL_FIELD_KEY in answers:
            email = answers[EMAIL_FIELD_KEY].get("answer")
        edit_link = sub.get("edit_url") or sub.get("edit_link")
        if email and edit_link:
            send_reminder(email, edit_link)

if __name__ == "__main__":
    main()
