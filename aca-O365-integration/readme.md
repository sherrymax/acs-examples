#### This article details the steps required to integrate Microsoft O365 with Alfresco Content Accelerator (ACA).

> **Note**: The integration is between Microsoft O365 and Alfresco Content Accelerator (ACA)

### Use-Case / Requirement
Users should be able to contribute and collaborate MS-Office Contents in Alfresco Content Accelerator (ACA) via O365.

### Prerequisites

* AWS Cloud Hosted Alfresco Content Services (Version 6.1 and above)
* AWS Cloud Hosted Alfresco Digital Workspace
* AWS EC2 Instance Details
* AWS Elastic Load Balancer
* O365 Account
* O365 Web App

## Configuration Steps

* Step 1: [Configure O365 Web App](https://github.com/sherrymax/acs-examples/tree/master/aca-O365-integration#configure-o365-web-app)
* Step 2: [Configure Alfresco Content Accelerator (ACA)](https://github.com/sherrymax/acs-examples/tree/master/aca-O365-integration#configure-alfresco-content-accelerator-aca-for-adporca-users)

### Configure O365 Web App

1. Login to https://portal.azure.com/#home using Alfresco Credentials.
2. Navigate to `App Registrations` within `Azure Services`.
   ![app-home](assets/spa-home.png)
3. Register your Web application. ![app-regn-1](assets/web-regn-1.png)
> **Note**: The Redirect URI will be `https://<your-subdomain>.alfdemo.com/ocms/dummy/path`

> **Note**: More than one Redirect URIs can be added to the list.

4. Click Register button. ![web-regn](assets/web-regn.png)
5. Click the Web App that just got created.
6. Note the :
   * Application (client) ID
![web-config](assets/web-config.png)

### Configure Alfresco Content Accelerator (ACA) (For ADP/Orca users)

1. Update the `ACA Admin > Stage `.
![aca-stage](assets/aca-stage.png)

2. Do the below configurations.
![aca-services](assets/aca-services.png)

   
Now the document should be good to `Check-In Online`.
![aca-menu](assets/aca-menu.png)


### ACS : RUN the DEMO

### References
* https://docs.alfresco.com/content-accelerator/latest/configure/integrations-and-addons/#microsoft-onedrive
