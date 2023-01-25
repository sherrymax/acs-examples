#### This article details the steps required to get hostname of ACS Server

### Use-Case / Requirement

The server-side Javascripts have the need to get the hostname of Alfresco Server instead of hard coding.

### Prerequisites to run this demo end-2-end

* Alfresco Content Services (Version 6.1 and above)
* [Custom JAR File](../action-script-sample-1.0-SNAPSHOT.jar)

## Configuration Steps

1. Deploy the [action-script-sample-1.0-SNAPSHOT.jar](assets/action-script-sample-1.0-SNAPSHOT.jar) file to ACS. Full credits and thanks to [Angel Borroy](https://github.com/aborroy).
2. Restart ACS Server/Container.

## Configuration Step in ADP/Orca (Only for Orca/ADP users)

```
Location to deploy action-script-sample-1.0-SNAPSHOT.jar in ADP/Orca will be: 
adp/data/services/content/custom/action-script-sample-1.0-SNAPSHOT.jar
```

## Javascript examples that invoke HTTP

```javascript
var hostName = 'http://' + sysAdmin.getHost();
logger.system.out(hostName);
```

## Run the DEMO

## References

* <https://docs.alfresco.com/content-services/latest/develop/repo-ext-points/javascript-root-objects/>
