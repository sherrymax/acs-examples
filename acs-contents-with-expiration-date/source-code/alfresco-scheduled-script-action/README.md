# Alfresco Scheduled Script Action

## Description
Adds a scheduled action to run a script

## Usage
The job is enabled/disabled in alfresco-global.properties using: 
  
  custom-scheduled-script.enabled=true

The cron expression should be set in alfresco-global.properties, e.g. to run every minute use:

  custom-scheduled-script.cronExpression=0 * * * * ?

The extension can be built/rebuilt using maven:

mvn clean install