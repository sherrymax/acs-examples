#### This article details the steps required to deal with contents that has an expiry date which is past current date.

### Use-Case / Requirement
Neither the Regular Search nor the Live Search fom within Alfresco Share does search against custom fields/properties by default.  How can I search against my custom properties?

### Prerequisites to run this demo end-2-end

* Alfresco Content Services (Version 6.1 and above)

## Concepts

* <b>Simple Search :</b> The search field at the top right corner of the Share UI window is called the "Simple Search" field. 
* <b>Live Search :</b> From version 5.0 onwards, while typing first characters into that field the so called "Live Search" is triggered. ON pressing enter, the full search is triggered and all results for the entered search term are displayed.

In both cases, the search against documents with the text entered into the search field is limited to what is pre-configured in the out-of-the-box configuration.

## Configuration Steps
The default list of what is searched against for documents can be found in the following locations:

* /alfresco/templates/webscripts/org/alfresco/slingshot/search/live-search-docs.get.config.xml
* /alfresco/templates/webscripts/org/alfresco/slingshot/search/search.get.config.xml

```
Locations in Orca will be: 
1. orca/data/services/content/live-search-docs.get.config.xml
2. orca/data/services/content/search.get.config.xml
```

You can override these files and add to the fields listing that are searched against for finding documents in simple/live search.


## Steps to add custom properties to simple/live search

<b>Step 1: </b>Edit the configuration files and add your additional custom properties.  
    
Example : 
If you have properties `my:product` and `my:version`
For Simple Search : Change `search.get.config.xml` from
```xml
<search>
    <default-query-template>%(cm:name cm:title cm:description ia:whatEvent ia:descriptionEvent lnk:title lnk:description TEXT TAG)</default-query-template>
</search>
```
to
```xml
<search>
    <default-query-template>%(cm:name cm:title cm:description my:product my:version ia:whatEvent ia:descriptionEvent lnk:title lnk:description TEXT TAG)</default-query-template>
</search>
```
For Live Search : Change `live-search-docs.get.config.xml` from
```xml
<search>
    <default-operator>AND</default-operator>
    <default-query-template>%(cm:name cm:title cm:description TEXT TAG)</default-query-template>
</search>
```
to
```xml
<search>
    <default-operator>AND</default-operator>
    <default-query-template>%(cm:name cm:title cm:description  my:product my:version TEXT TAG)</default-query-template>
</search>
```

<b>Note: </b> If your property has a hyphen in the naming you will need to escape the hyphen character with \ .  
For example: If you wanted to add `sys:node-dbid` property
```xml
<search>
   <default-query-template>%(cm:name cm:title cm:description sys:node\-dbid ia:whatEvent ia:descriptionEvent lnk:title lnk:description TEXT TAG)</default-query-template>
</search>
```

<b>Step 2: </b> Save the files and restart Alfresco

### ACS : RUN the DEMO

Metadata Of A Document
![document-metadata-image](assets/1.png)

Live Searching A Document using Metadata
![live-search-image](assets/2.png)

Simple Searching A Document using Metadata
![simple-search-image](assets/3.png)


### References
1. https://alfresco.my.salesforce.com/articles/en_US/Technical_Article/Can-we-add-custom-properties-into-the-properties-list-which-Share-Simple-Search-searches-against?popup=true