# Alfresco + Azure BLOB Connector 
## <i>Installation and Configuration Guide</i>

This guide shows how to install **Azure BLOB Connector** on **Alfresco**

---

### Software Requirements

- Alfresco Content Services (see [supported platforms](https://docs.alfresco.com/microsoft-azure/latest/support/) for version compatibility)
- [Azure Storage Account](https://portal/azure.com) with BLOB Storage enabled
- [Module Management Tool (MMT)](https://docs.alfresco.com/content-services/latest/install/zip/amp/) - included in Alfresco distribution

### Azure Requirements

- Active Azure subscription
- Azure Storage Account configured
- Azure Blob Storage container created
- Storage account access keys or connection string
---

### Step 1: Download the Azure Connector

Go to the Alfresco Support Portal or Hyland Community
Download the `alfresco-azure-connector-x.x.x.amp` file.<br/>
[Supported Versions and Platforms](https://docs.alfresco.com/microsoft-azure/latest/support/)
> Ensure you have the correct version compatible with your Alfresco Content Services version

---

### Step 2: Stop Alfresco Content Services

Important: Ensure that Alfresco Content Services is completely stopped before installing the Azure Connector AMP.

```bash
# Stop Alfresco services
./alfresco.sh stop

# or if using systemctl
sudo systemctl stop alfresco
```
---

### Step 3: Install the AMP using Module Management Tool (MMT)

Navigate to your Alfresco installation directory and use the MMT to install the AMP:

```bash
# Navigate to the bin directory containing MMT
cd /opt/alfresco/bin

# Install the Azure Connector AMP (use -force flag)
java -jar alfresco-mmt.jar install /path/to/alfresco-azure-connector-x.x.x.amp /path/to/alfresco.war -force

# Alternative using apply_amps tool
./apply_amps.sh -force
```
---

### Step 4: Verify Installation

Check that the configuration files are properly installed:

```bash
# Verify the AMP installation
java -jar alfresco-mmt.jar list /path/to/alfresco.war
```

---


## Configuration Steps

### Step 5 : Configure Azure Storage Account
Ensure your Azure Storage Account is properly configured:

1. Create Storage Account (if not already created)
- Login to Azure Portal
- Create a new Storage Account or use existing one
- Note the account name and access keys


2. Create Blob Container
- Navigate to your Storage Account
- Create a new container for Alfresco content
- Set appropriate access level (typically Private)


3. Configure Access
- Copy the connection string from Azure Portal
- Alternatively, use account name and access key

## Step 6: Configure Azure Storage Properties

Create or modify the `alfresco-global.properties` file to include Azure configuration

```properties

# Azure connector settings

#permitted values are sharedKey, sas, managedIdentityAD, applicationAD, keyVault
connector.az.authentication.mode=sharedKey
connector.az.account.name=boeingpocstorage
connector.az.account.key=<my-azure-storage-account-key>

#connector.az.container.sasToken=
#connector.az.application.clientId=
#connector.az.application.clientSecret=
#connector.az.application.tenantId=
#connector.az.keyVault.name=
#connector.az.keyVault.secret.name=

# Please follow https://blogs.msdn.microsoft.com/jmstall/2014/06/12/azure-storage-naming-rules/
connector.az.containerName=<my-blob-container>
connector.az.deleted.containerName=<my-blob-deleted-container>

# connector.az.objectNamePrefix=
# connector.az.objectNameSuffix=
# connector.az.deleted.objectNamePrefix=
# connector.az.deleted.objectNameSuffix=

# Configuration option for the store protocol
connector.az.storeProtocol=azb

# A number of retries in case of if error occurs
connector.az.maxErrorRetries=3

#Indicates the maximum time (in seconds) allowed for any single try of an HTTP request.
connector.az.tryTimeout=10

connector.az.nativeStorageProperties=x-ms-access-tier,x-ms-archive-status,x-ms-rehydrate-priority

connector.az.restorePriorityDefault=Standard
connector.az.restoreAccessTierDefault=Cool

```

---

## Step 7: Start Alfresco Content Services

```bash
# Start Alfresco services
./alfresco.sh start
# or if using systemctl
sudo systemctl start alfresco
```

## Step 8: Verify Configuration

<b>Admin Console Verification</b>

- Access Alfresco Admin Console
- Navigate to System Summary
- Verify Azure Connector is listed in installed modules

<b>Check Alfresco Logs</b>
```bash
tail -f /opt/alfresco/tomcat/logs/catalina.out
```
Look for Azure connector initialization messages

<b>Test Content Upload</b>

- Login to Alfresco Share
- Upload a test document
- Get the NodeRef of that uploaded Document
- Go to Node Browser and get the contentURL of that Document
- Verify it appears in your Azure Blob Storage container

## Additional Notes

- <b>Version Compatibility</b> : Ensure Azure Connector version matches your Alfresco Content Services version.
- <b>Force Installation</b> : Always use the -force flag when installing the Azure Connector AMP.
- <b>Subsystem Flexibility</b> : Starting from version 1.2, use subsystem approach for better flexibility.
- <b>Migration Warning</b> : Do not switch from AzureOnPrem to pure Azure if content already exists on file system.
- <b>Performance</b> : For optimal performance, consider running Alfresco on Azure VM when using Azure Blob Storage.

---

## Resources

- [Alfresco Support](https://support.hyland.com/r/Alfresco/Alfresco-Content-Connector-for-Azure/5.0/Alfresco-Content-Connector-for-Azure/Install)
- [Alfresco's Azure Connector - Documentation](https://docs.alfresco.com/microsoft-azure/latest/config/)
- [Cert-Manager Docs](https://cert-manager.io/)
