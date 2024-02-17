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

* Step 1: [Configure AWS Elastic Load Balancer](https://github.com/sherrymax/acs-examples/tree/master/aca-O365-integration#configure-aws-elastic-load-balancer)
* Step 2: [Configure O365 Web App](https://github.com/sherrymax/acs-examples/tree/master/aca-O365-integration#configure-o365-web-app)
* Step 3: [Configure Alfresco Content Accelerator (ACA)](https://github.com/sherrymax/acs-examples/tree/master/aca-O365-integration#configure-alfresco-content-accelerator-aca-for-adporca-users)

### Configure AWS Elastic Load Balancer

Run command:
```
./adp.py aws ec2 ssl
```
Once authenticated, start mapping the details from EC2 Instance.

* Please provide `region` you wish to use: `<region-of-your-ec2-instance> eg: us-east-1`
* Please specify the `elb_name` for this instance: `<myname-mycustomername> eg: sherry-mantech`
* Please specify the `ec2_public_dns` for this instance: `<Public-IPv4-DNS from AWS Instance Details Page>`
* Please specify the `instance_id` for this instance: `<Instance ID from AWS Instance Details Page>`
* Please specify the `subdomain` for this instance: `<mycustomername> eg: mantech`
* Please specify the `owner` for this instance: `<myname> eg: Sherry Mathews`
* Please specify the `is_poc` for this instance: `<true/false> eg: false`
* Please specify the `target_end_date` for this instance: `<target_end_date> eg: 12/31/2021`
* Please specify the `elb_purpose` for this instance: `<mention_your_purpose> eg: Demo`
* Please specify the `customer` for this instance: `<mycustomername> eg: ManTech` 

> **Note**: Please wait for a few minutes as the Elastic Load Balancer (ELB) will be starting up. The status can be verified from `AWS Services > Load Balancers`.

> **Note**: Once the ELB is available, navigate to the `Redirect URI`

> **Note**: The Redirect URI will be `https://<your-subdomain>.alfdemo.com`

### Configure O365 Web App

1. Login to https://portal.azure.com/#home using Alfresco Credentials.
2. Navigate to `App Registrations` within `Azure Services`.
   ![app-home](assets/spa-home.png)
3. Register your Web application. ![web-regn-1](assets/web-regn-1.png)
> **Note**: The Redirect URI will be `https://<your-subdomain>.alfdemo.com/ocms/dummy/path`
![web-authentication](assets/web-authentication.png)
![web-api-permissions](assets/web-api-permissions.png)
> **Note**: More than one Redirect URIs can be added to the list.

4. Click Register button.
5. Click the Web App that just got created.
6. Note the :
   * Application (client) ID
![web-config](assets/web-config.png)

### Configure Alfresco Content Accelerator (ACA) (For ADP/Orca users)

1. Update the `ACA Admin > Stage `.
![aca-stage](assets/aca-stage.png)

2. Do the below configurations for each 3 service.
![aca-services](assets/aca-services.png)
   
3. Now the document should be good to `Edit Online`.
![aca-menu](assets/aca-menu.png)

4. A popup will appear prompting login. Use the same login where the WEB app got created in Azure Portal. Once logged in, the cookies will be reused for same action in the future.
![aca-popup](assets/aca-popup.png)

5. ACA will show the message regareding successful online checkout.
![aca-onlinemsg](assets/aca-onlinemsg.png)

6. A new browser tab will open with the document in O365.
![aca-newtab](assets/aca-newtab.png)

7. The changes are auto saved. Close the browser tab once changes are done.
![aca-newsentence](assets/aca-newsentence.png)

8. Back to ACA Document Viewer and now the document should be good to `Check-In Online` or `Cancel Checkin`.
![aca-checkin](assets/aca-checkin.png)

9. Prompts to enter credentials may appear if your session is not active. Else the prompts will disappear by itself. Click on the Green Checkin button to finish the process.
![aca-checkin2](assets/aca-checkin2.png)

10. The ACA page will automatically refresh to see the updated document with the edits done in Office365.
![aca-final](assets/aca-final.png)


### ACS : RUN the DEMO

### References
* https://docs.alfresco.com/content-accelerator/latest/configure/integrations-and-addons/#microsoft-onedrive
