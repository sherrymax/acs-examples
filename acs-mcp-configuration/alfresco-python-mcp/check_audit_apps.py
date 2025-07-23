from tools.alfrescoAPI import getAuditApps
import json

# Get audit apps and print them in a formatted way
audit_apps = getAuditApps()
print("\nConfigured Audit Applications:")
print(json.dumps(json.loads(audit_apps), indent=2))
