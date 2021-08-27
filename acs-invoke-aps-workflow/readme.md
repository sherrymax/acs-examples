#### This article details the steps required to invoke an APS workflow/process from ACS.

### Use-Case / Requirement
An already modelled and deployed APS workflow/process has to be triggered from ACS.

### Prerequisites to run this demo end-2-end

* Alfresco Content Services (Version 6.1 and above)
* Alfresco Process Services (Version 1.11 and above)
* [HTTP Activiti Client](../alfresco-http-activiti-client) (.amp or .jar)
* [JS Console - Repo](../javascript-console-repo-0.7-SNAPSHOT.amp) (if running on ACS v7.x)
* [JS Console - Share](../javascript-console-share-0.7-SNAPSHOT.amp) (if running on ACS v7.x)


## Configuration Steps
1. Deploy the [http_js.amp](assets/http_js.amp) file to ACS. Full credits and thanks to [Rui Fernandes](https://github.com/rjmfernandes).
2. Update the `alfresco-global.properties` file.
3. Restart ACS Server/Container.
4. Import and Deploy the [aps-app.zip](assets/aps-app.zip) file to APS.

## Update the alfresco-global.properties
Set the following properties in the `<TOMCAT\_HOME\>/shared/classes/alfresco-global.properties` file:

```properties
### alfresco_http_activiti_client - https://github.com/rjmfernandes/alfresco_http_activiti_client
activiti.client.extension.endpoint=http://process:8080/activiti-app
activiti.client.extension.user=demo
activiti.client.extension.password=demo
```

## Configuration Step in ADP/Orca (if needed)
```
Location to deploy http_js.amp and alfresco-global.properties in ADP/Orca will be: 
adp/data/services/content/http_js.amp
adp/data/services/content/javascript-console-repo-0.7-SNAPSHOT.amp (if running on ACS v7.x)
adp/data/services/content/javascript-console-share-0.7-SNAPSHOT.amp (if running on ACS v7.x)
adp/data/services/content/alfresco-global.properties
```


## Custom Javascript to Invoke APS Workflow/Process

```javascript
// Code to invoke an APS Workflow from ACS along with passing the document.
// The variables meant to receive the ACS document has to be FORM UI elements in the START FORM.

logger.info('*** Starting APS Workflow ***');

var formvariables = '{' + '"acsNodeId":"'+document.id+'"' + '}'; // acsNodeId is the id of a 'Text' UI element in the Start-Form. Hence it is the variable to receive the node-id passed from ACS.
var dataObj = eval('(' + formvariables + ')');

var processToInvoke = 'InvokeThisProcess'; // Name of process/workflow to invoke.
var instanceToCreate = 'Created from ACS'; // Name of the instance that gets created.

var receivingDocumentList = ["apsdocument"];  // apsdocument is the id of an 'Attach File' UI element in the Start-Form. Hence it is the variable to receive the document passed from ACS.

logger.info(formvariables);

try{
	activiti.startDocumentProcess(processToInvoke, instanceToCreate, dataObj, receivingDocumentList, [document]);
}
catch(ex){
	logger.error('*** Exception >>> ***'+ex.message);
}

logger.info('*** Ending APS Workflow ***');
```


## Define Folder Rules in ACS to trigger this workflow
The process flow.  ![folder-rules](assets/folder-rules.png)


## Run the DEMO