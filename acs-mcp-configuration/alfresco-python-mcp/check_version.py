from tools.alfrescoAPI import runQuery
import os
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

# Get Alfresco version info using the admin console endpoint
url = os.getenv("BASE_URL") + "/alfresco/service/api/server"
response = runQuery('get', url, '', os.getenv("user"), os.getenv("pass"))

print("\nAlfresco System Information:")
print(json.dumps(response, indent=2))
