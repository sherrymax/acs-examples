#### This article details the steps required to configure a custom Advanced Search template

### Use-Case / Requirement

The admin user should be able to create a customised Advanced Search template for searching a specific document type (eg: Contract Document).

### Prerequisites to run this demo end-2-end

* Alfresco Content Services (Version 6.1 and above)
* Alfresco Demo Platform (ADP) : Only for ADP Users

## Configuration Steps

1. Download and Import a model to apply.

* [Contracts](../acs-model-examples/CLM.zip)

![model-manager](assets/1.png)

2. The default list of what is searched against for documents can be found in the following locations:

* share-config.xml - This file lists the document type to be searched.
* share-form-config.xml - This file has the `search-form` where the user enters the search criteria.

In Alfresco Demo Platform (ADP), the location of files in SHARE container will be:

```
1. /usr/local/tomcat/webapps/share/WEB-INF/classes/alfresco/share-config.xml
2. /usr/local/tomcat/webapps/share/WEB-INF/classes/alfresco/share-form-config.xml
```

> <b>Note for ADP Users :</b> These files will be in the SHARE container. Hence you've to shell into container by running following commands <li>`./adp.py shell share`  <li>`cd /usr/local/tomcat/webapps/share/WEB-INF/classes/alfresco/` <li>`vim share-config.xml` <li>`vim share-form-config.xml`

The following files have to be updated for a custom Advanced Search on a certain document type.

## Step 1: Update the share-config.xml

``` xml
<config evaluator="string-compare" condition="AdvancedSearch">
    <advanced-search>
        <!-- Forms for the advanced search type list -->
        <forms>
            <form labelId="search.form.label.cm_content" descriptionId="search.form.desc.cm_content">cm:content</form>
            <form labelId="search.form.label.cm_folder" descriptionId="search.form.desc.cm_folder">cm:folder</form>            
            <form label="Contracts" description="Contract Documents">lm:contractDocument</form>
        </forms>
    </advanced-search>
</config>
```

## Result

![search-by-doc-type](assets/2.png)

## Step 2 : Update the share-form-config.xml

All types of <b>Form Controls</b> are available at : <https://docs.alfresco.com/content-services/latest/develop/reference/share-document-library-ref/#form-controls>

``` xml
<!-- lm:Contracts type (new nodes) -->
<config evaluator="model-type" condition="lm:contractDocument">
    <forms>
        <!-- Search form -->
        <form id="search">
            <field-visibility>
                <show id="lm:contractName" force="true"/>
                <show id="lm:contractType" force="true" />
            </field-visibility>
            <appearance>
                <field id="lm:contractName">
                    <control template="/org/alfresco/components/form/controls/textfield.ftl" />
                </field>
                <field id="lm:contractType">
                    <control template="/org/alfresco/components/form/controls/textfield.ftl" />
                </field>
            </appearance>
        </form>
    </forms>
</config>
```

## Result

![search-form-by-doc-type](assets/3.png)

## Save the files and restart Alfresco

> **Note**: ADP Users should save the files followed by STOP and START of SHARE container.

### ACS : RUN the DEMO

### References

1. <https://ecmarchitect.com/alfresco-developer-series-tutorials/content/tutorial/tutorial.html#configuring-advanced-search-in-alfresco-share>
2. <https://hub.alfresco.com/t5/alfresco-content-services-hub/share-advanced-search/ba-p/291116#Search_Forms>
3. <https://docs.alfresco.com/content-services/6.2/develop/reference/share-document-library-ref/#form-controls>
