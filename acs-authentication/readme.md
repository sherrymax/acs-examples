## Authenticate with the repository

Before you can call any of the API endpoints, except a few that don’t require authentication, you need to authenticate with the repository so your operations are executed on behalf of a specific user. When you authenticate successfully a ticket is returned that can be used in subsequent calls to the API. A ticket is valid for a specific time, so if you don’t make any calls for a while, then you might get 401 errors back, which means you need to authenticate again to get a new ticket.

### Authenticating to get a ticket

To authenticate with the Repository the following URL is used, and it is part of the Authentication API:

```properties
<http://localhost:8080/alfresco/api/-default-/public/authentication/versions/1/tickets>
```

When calling this URL a `HTTP POST` should be used with the username and password as data:

```powershell
$ curl --header "Content-Type: application/json" --request POST --data '{"userId":"admin","password":"admin"}' <http://localhost:8080/alfresco/api/-default-/public/authentication/versions/1/tickets>
{"entry":
  {"id":  "TICKET_08eb7e2e2c17964ca51f0f33186cc2fc9d56d593",
   "userId":"admin"
  }
}
```

Here I’m logging in as admin with password admin, which is common for local developer/test installations of ACS. But you can use any other username/password combination that represents a user in the Alfresco User database, being it local or linked to LDAP. However, it’s good to use the admin user when you are playing around with the ReST API as you will almost always get a response back as you have full access. You don’t have to worry about the user having the correct permissions to execute the call, having access to the content, etc. A ticket is return inside a JSON object.

We can make the POST call a bit shorter as `-H` is short for `--header` and `-d` for `--data`. The `-request POST` part is optional if you use `-d`, as the `-d` flag implies a POST request. So the call can also be executed as follows:

```powershell
$ curl -H "Content-Type: application/json" -d '{"userId":"admin","password":"admin"}' <http://localhost:8080/alfresco/api/-default-/public/authentication/versions/1/tickets> | jq
{  
  "entry": {
    "id": "TICKET_08eb7e2e2c17964ca51f0f33186cc2fc9d56d593",
    "userId": "admin"  
  }
}
```

You get the same ticket back if you call the API multiple times.

### Windows users

Single quotes around JSON does not work on Windows, use double quotes instead:

```powershell
curl -H "Content-Type: application/json" -d "{\"userId\":\"admin\",\"password\":\"admin\"}" http://localhost:8080/alfresco/api/-default-/public/authentication/versions/1/tickets
```

## Base64 encoding the ticket

When we have the ticket we need to base64 encode it before we can use it in subsequent calls:

### On Mac and Linux

```powershell
$ echo -n 'TICKET_08eb7e2e2c17964ca51f0f33186cc2fc9d56d593' | openssl base64
VElDS0VUXzA4ZWI3ZTJlMmMxNzk2NGNhNTFmMGYzMzE4NmNjMmZjOWQ1NmQ1OTM=
```

### On Windows

```powershell
powershell "[convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes(\"TICKET_08eb7e2e2c17964ca51f0f33186cc2fc9d56d593\"))"
```

### Using the ticket

Now when we got a base64 encoded ticket, such as `VElDS0VUXzA4ZWI3ZTJlMmMxNzk2NGNhNTFmMGYzMzE4NmNjMmZjOWQ1NmQ1OTM=`, we can start using it in an API call. The way we use the ticket in a Curl call is to add it with the Authorization header as follows:

```powershell
curl -X GET -H 'Accept: application/json' -H 'Authorization: Basic {ticket}' '{API endpoint URL}' | jq
```

With an example ticket and an example API endpoint it will look like this:

```powershell
curl -X GET -H 'Accept: application/json' -H 'Authorization: Basic VElDS0VUXzA4ZWI3ZTJlMmMxNzk2NGNhNTFmMGYzMzE4NmNjMmZjOWQ1NmQ1OTM=' 'http://localhost:8080/alfresco/api/discovery' | jq
```

This ReST API Guide contains hundreds of examples of how to use a ticket with GET, POST, PUT, and DELETE calls.

### POSTMAN Collection

A postman collection with the above steps is [available here](https://github.com/sherrymax/acs-examples/blob/master/acs-authentication/assets/ACS%20-%20Authentication.postman_collection.json).

### Run the Demo from POSTMAN

Step 1 : Invoke API to Authenticate.
![1](assets/1.png)

Step 2 : Base64 encode the ticket.

```javascript
var CryptoJS = require("crypto-js");

//When we have the ticket we need to base64 encode it before we can use it in subsequent calls
var responseTicket = pm.globals.get('ticket'); // 'TICKET_58a4c33131837c9453fb705230208a6d430cf974'
var rawTicket = CryptoJS.enc.Utf8.parse(responseTicket);
var encodedTicket = CryptoJS.enc.Base64.stringify(rawTicket);
console.log(`Encrypted Ticket: ${encodedTicket}`);

pm.environment.set("authorizationHeader", "Basic "+encodedTicket);
```

![2](assets/2.png)
![4](assets/4.jpg)

Step 3 : Execute any API using the encoded ticket.
![3](assets/3.png)

## References

1. Base64 Encoding : <https://developer.genesys.cloud/authorization/platform-auth/base-64-encoding>
2. Alfresco Documentation on Install and Authentication : <https://docs.alfresco.com/content-services/latest/develop/rest-api-guide/install/>
3. Alfresco REST API - Postman Collection : <https://hub.alfresco.com/t5/alfresco-content-services-blog/v1-rest-api-10-things-you-should-know/ba-p/287692>
