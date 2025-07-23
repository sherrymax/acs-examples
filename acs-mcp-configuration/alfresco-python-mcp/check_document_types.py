from tools.alfrescoAPI import getDocumentTypes
import json
from collections import defaultdict

# Get document types and print them in a formatted way
response = json.loads(getDocumentTypes())

print("\nContent in Repository:")
print("--------------------")

if 'list' in response and 'entries' in response['list']:
    entries = response['list']['entries']
    if entries:
        for entry in entries:
            props = entry['entry'].get('properties', {})
            name = props.get('cm:name', 'Unnamed')
            mime_type = props.get('content.mimetype', 'unknown')
            aspects = entry['entry'].get('aspectNames', [])
            
            print(f"\nDocument: {name}")
            print(f"MIME Type: {mime_type}")
            print(f"Aspects: {', '.join(aspects)}")
            print("-" * 40)
    else:
        print("No documents found in repository")
else:
    print("No documents found or empty repository")
