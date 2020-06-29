var notifyDays = 5;

function getOwnerOrCreatorEmail(d) {

  if (d.properties["cm:owner"]) {
 	var assignee = d.properties["cm:owner"];
  } else {
     var assignee = d.properties["cm:creator"];
  }
 
  if (logger.debugLoggingEnabled) {
    logger.debug("******* getOwnerOrCreatorEmail assignee: " + assignee);	 
  }

  if (assignee.toLowerCase() == "system") {
    logger.error("getOwnerOrCreatorEmail cannot send email to System user")
 	return null;
  } else {
    return people.getPerson(assignee).properties["cm:email"];
  }
	
}

function sendMail(d) {

  var assigneeEmail = getOwnerOrCreatorEmail(d);
  if (assigneeEmail != null) { 
    // Create mail action   
    var mail = actions.create("mail");   
    mail.parameters.to = assigneeEmail;   
    mail.parameters.subject = "Content Expiry Notification";   
    mail.parameters.from = "admin@alfresco.com";   
    // Cannot use companyhome root object in a scheduled action
    // Use a custom email ftl template that does not include person as we don't have person in scope
    // get the html ftl email template, fallback to plain text email if not found
    var template = search.selectNodes("/app:company_home/app:dictionary/app:email_templates/app:notify_email_templates/cm:custom_notify_user_email.html.ftl")[0];
    if (template) {
    	mail.parameters.template = template;
    	// Pass the notifyDays to the email template as a parameter
    	//mail.parameters.notifyDays = "Content is due to expire in " + notifyDays + " days, please review and update expiry date";  
	    var templateArgs = new Array();
        templateArgs['notifyDays'] = notifyDays;
        var templateModel = new Array();
        templateModel['args'] = templateArgs;
        mail.parameters.template_model = templateModel;
    } else {
    	logger.warn("Failed to find email template /Company Home/Email Templates/Notify Email Templates/custom_notify_user_email.html.ftl message sent as plain text")
    	mail.parameters.text = "Content is due to expire in " + notifyDays + " days, please review and update expiry date";
    }
    // execute action against a document       
    mail.execute(d); 
    if (logger.debugLoggingEnabled) {
      logger.debug("**** Sending notification email to: " + assigneeEmail);
    }
  } else {
  	logger.error("Cannot send email to user null");
  }

}

function getDueToExpire() {

	if (logger.debugLoggingEnabled) {
		logger.debug("Executing scheduled-script-action: getDueToExpire");
	}

	// Get the notification days from alfresco-global.properities, use global var notifyDays if not defined
	try { 
	  var globalProperties = jmx.queryMBeans("Alfresco:Name=GlobalProperties");
	  var customNotifyDays = globalProperties[0].attributes["custom-scheduled-script.expire.notification.days"].value;
	} catch(err) {
		logger.warn("custom-scheduled-script.expire.notification.days property not found, using default " + notifyDays + " days");
	}
	if (customNotifyDays != null) {
		notifyDays = customNotifyDays;
	}

    /* Build effectiviity date search predicate */
	var dateNow = new Date();
	var startingDate = dateNow;
	startingDate.setDate(startingDate.getDate() + parseInt(notifyDays));
	var effectiveToStartDate= startingDate.getFullYear() + "-" + (startingDate.getMonth()+1) + "-" + startingDate.getDate() + "T00:00:00.000Z";
    var effectiveToEndDate= startingDate.getFullYear() + "-" + (startingDate.getMonth()+1) + "-" + startingDate.getDate() + "T23:59:59.999Z";

	if (logger.debugLoggingEnabled) {
		logger.debug("Logger effectiveToStartDate: " + effectiveToStartDate);
		logger.debug("Logger effectiveToEndDate: " + effectiveToEndDate);
	}

	var paging = { 
	  maxItems: 1000, 
	  skipCount: 0 
	}; 

    var query = "SELECT D.*, E.* FROM cmis:document AS D JOIN cm:effectivity AS E ON D.cmis:objectId = E.cmis:objectId WHERE E.cm:to > TIMESTAMP '" + effectiveToStartDate + "' AND E.cm:to < TIMESTAMP '" + effectiveToEndDate + "'";
    if (logger.debugLoggingEnabled) {
		logger.debug("Query: " + query);
	}
	var def = { 
	  query: query,
	  language: "db-cmis",  
	  page: paging 
	}; 

	var results = search.query(def);

	for each(var n in results) {
	  if (logger.debugLoggingEnabled) {
	    logger.debug("Due to expire in " + notifyDays + " days from now: " + n.name + " Expires: " + n.properties["cm:to"]);
		try {
		  if (n.properties["sch:notifyOwner"] != true) {
 			sendMail(n);
		    n.properties["sch:notifyOwner"] = true;
		    n.save();
		  }
		}
		catch(err) {
		  logger.error("Failed to apply sch:declareRecord property to node: " + n.nodeRef);
		  logger.error(err);
		}

	  }
	}

}

function getExpired() {

	if (logger.debugLoggingEnabled) {
		logger.debug("Executing scheduled-script-action: getExpired");
	}

    /* Build effectiviity date search predicate */
	var dateNow = new Date();
	var startingDate = dateNow;
	var effectiveToStartDate= startingDate.getFullYear() + "-" + (startingDate.getMonth()+1) + "-" + startingDate.getDate() + "T23:59:59.999Z";

	if (logger.debugLoggingEnabled) {
		logger.debug("Logger effectiveToStartDate: " + effectiveToStartDate);
	}

	var paging = { 
	  maxItems: 1000, 
	  skipCount: 0 
	}; 

    var query = "SELECT D.*, E.* FROM cmis:document AS D JOIN cm:effectivity AS E ON D.cmis:objectId = E.cmis:objectId WHERE E.cm:to <= TIMESTAMP '" + effectiveToStartDate + "'";
    if (logger.debugLoggingEnabled) {
		logger.debug("Query: " + query);
	}
	var def = { 
	  query: query,
	  language: "db-cmis",  
	  page: paging 
	}; 

	var results = search.query(def);

	for each(var n in results) {
	  if (logger.debugLoggingEnabled) {
	    logger.debug("Expired: " + n.name + " Expired: " + n.properties["cm:to"]);
		try {
		  n.properties["sch:declareRecord"] = true;
		  n.save();
		}
		catch(err) {
		  logger.error("Failed to apply sch:declareRecord property to node: " + n.nodeRef);
		}
	  }
	}

}

getDueToExpire();

getExpired();
