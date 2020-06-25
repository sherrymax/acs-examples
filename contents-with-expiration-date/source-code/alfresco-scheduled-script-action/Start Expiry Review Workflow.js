function getOwnerOrCreator(d) {

  if (d.properties["cm:owner"]) {
 	  var assignee = d.properties["cm:owner"];
  } else {
	  var assignee = d.properties["cm:creator"];
  }
	 
  if (assignee.toLowerCase() == "system") {
    logger.error("getOwnerOrCreatorEmail cannot assign workflow to System user")
    return null;
  } else {
    return people.getPerson(assignee);
  }
	
}

function format(date) {
  var d = date.getDate();
  var m = date.getMonth() + 1;
  var y = date.getFullYear();
//  return '' + y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
  return '' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d) + "-" + y; // m-d-y for US
}

function startReviewWorkflow(d,assignee) {

	var assignee = getOwnerOrCreator(d);
  if (assignee != null) {
    var workflow = actions.create("start-workflow");
    workflow.parameters.workflowName = "activiti$activitiReview";
    workflow.parameters["bpm:assignee"] = assignee;
    workflow.parameters["bpm:workflowDescription"] = "Document due to expire in 5 days (" + format(d.properties["cm:to"]) + ") . Please review";
    workflow.parameters["bpm:workflowPriority"] = "2";
    workflow.parameters["bpm:sendEMailNotifications"] = true;
    workflow.parameters["initiator"] = assignee; // not sure initiator can be system 
    var targetDate = new Date()
    targetDate.setDate(targetDate.getDate() + 5);
    logger.debug(targetDate);
    workflow.parameters["bpm:workflowDueDate"] = targetDate;
    workflow.execute(d);
  } else {
    logger.error("Cannot assign workflow to user null");
  }

}

//var d = search.findNode("workspace://SpacesStore/cb3afd5b-1ebe-48f3-aad5-7dd431afb5b2",);
startReviewWorkflow(document,getOwnerOrCreator(document));