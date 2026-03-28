import os
import sys
import django

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "b2b_backend.settings")
django.setup()

from django.test import Client
from django.contrib.auth.models import User

try:
    client = Client()
    user = User.objects.get(username="MurarSelçukTekin")
    client.force_login(user)

    response = client.get("/admin/core/firebaseorder/")
    print("STATUS:", response.status_code)
    if response.status_code >= 400:
        import re
        content = response.content.decode('utf-8')
        match = re.search(r'<title>(.*?)</title>', content)
        if match:
             print("ERROR:", match.group(1))
        # tracebacks usually in <textarea> or similar in django
except Exception as e:
    import traceback
    traceback.print_exc()
