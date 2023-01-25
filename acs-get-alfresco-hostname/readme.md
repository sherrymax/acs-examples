#### This article details the steps required to get hostname of ACS Server

### Use-Case / Requirement

The server-side Javascripts have the need to get the hostname of Alfresco Server instead of hard coding.

### Prerequisites to run this demo end-2-end

* Alfresco Content Services (Version 6.1 and above)
* [Custom JAR File](../alfresco-script-root-object-1.0.0.jar)

## Configuration Steps

1. Deploy the [alfresco-script-root-object-1.0.0.jar](assets/alfresco-script-root-object-1.0.0.jar) file to ACS. Full credits and thanks to [Angel Borroy](https://github.com/aborroy).
2. Restart ACS Server/Container.

## Configuration Step in ADP/Orca (Only for Orca/ADP users)

```
Location to deploy alfresco-script-root-object-1.0.0.jar in ADP/Orca will be: 
adp/data/services/content/custom/alfresco-script-root-object-1.0.0.jar
```

## Javascript examples that invoke HTTP

```javascript
var hostName = 'http://' + sysAdmin.getAlfrescoHost();
logger.system.out(hostName);
```

## Run the DEMO

## References

* <https://docs.alfresco.com/content-services/latest/develop/repo-ext-points/javascript-root-objects/>
* <https://github.com/aborroy/alfresco-script-root-object>
* <https://github.com/aborroy/alfresco-script-root-object/releases/tag/1.0.0>
