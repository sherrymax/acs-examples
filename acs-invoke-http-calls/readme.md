#### This article details the steps required to invoke an APS workflow/process from ACS.

### Use-Case / Requirement
An HTTP call (GET, POST, PUT etc) has to be triggered from ACS.

### Prerequisites to run this demo end-2-end

* Alfresco Content Services (Version 6.1 and above)
* [HTTP Activiti Client](../alfresco-http-activiti-client) ([.amp](assets/http_js.amp) or .jar)
* [JS Console - Repo](assets/javascript-console-repo-0.7-SNAPSHOT.amp)  (if running on ACS v7.x)
* [JS Console - Share](assets/javascript-console-share-0.7-SNAPSHOT.amp)  (if running on ACS v7.x)


## Configuration Steps
1. Deploy the [http_js.amp](assets/http_js.amp) file to ACS. Full credits and thanks to [Rui Fernandes](https://github.com/rjmfernandes).
2. Restart ACS Server/Container.


## Configuration Step in ADP/Orca (Only for Orca/ADP users)
```
Location to deploy http_js.amp and alfresco-global.properties in ADP/Orca will be: 
adp/data/services/content/http_js.amp
adp/data/services/content/javascript-console-repo-0.7-SNAPSHOT.amp (if running on ACS v7.x)
adp/data/services/content/javascript-console-share-0.7-SNAPSHOT.amp (if running on ACS v7.x)
```


## Javascript examples that invoke HTTP

```javascript
var r = http.get("http://www.google.com");
print(r);
```

```javascript
var requestBody = '{ "Id": 78912,  "Customer": "Jason Sweet", "Quantity": 1,  "Price": 18.00 }';
var r = http.post('https://reqbin.com/echo/post/json',requestBody,"application/json",'myuser','mypassword');
print(r);
```

```javascript
var requestBody = '{ "id": "9909", "name": "Sam Jackson M.D", "address": "123 Sample Ave, Harford, CT 08661"}';
var r = http.post('http://ec2-1-2-3-4.compute-1.amazonaws.com:4000/doctors', requestBody, "", "", "");
logger.error(r);
```

## Run the DEMO.
