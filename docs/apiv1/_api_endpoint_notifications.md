## Notifications
Use this endpoint to obtain details on Mautic's notifications.

```php
<?php
use Mautic\MauticApi;
use Mautic\Auth\ApiAuth;

// ...
$initAuth        = new ApiAuth();
$auth            = $initAuth->newAuth($settings);
$apiUrl          = "https://your-mautic.com";
$api             = new MauticApi();
$notificationApi = $api->newApi("notifications", $auth, $apiUrl);
```

### Get Notification
```php
<?php

//...
$notification = $notificationApi->get($id);
```
```json
{  
    "notification":{  
        "isPublished":true,
        "dateAdded":"2016-09-14T14:03:05+00:00",
        "createdBy":1,
        "createdByUser":"John Doe",
        "dateModified":"2016-09-15T08:40:46+00:00",
        "modifiedBy":1,
        "modifiedByUser":"John Doe",
        "id":1,
        "name":"The first notification",
        "heading":"The first notification Heading",
        "message":"The first notification Message",
        "url":"http:\/\/mautic.org",
        "language":"en",
        "category":null,
        "publishUp":null,
        "publishDown":null,
        "readCount":0,
        "sentCount":0
    }
}
```
Get an individual notification by ID.

#### HTTP Request

`GET /notifications/ID`

#### Response

`Expected Response Code: 200`

See JSON code example.

**Notification Properties**

Name|Type|Description
----|----|-----------
id|int|ID of the notification
name|string|Title of the notification
heading|string|Heading of the notification
message|string|Message of the notification
url|string|URL to go to when the notification is clicked
isPublished|bool|Published state
publishUp|datetime/null|Date/time when the notification should be published
publishDown|datetime/null|Date/time the notification should be un published
dateAdded|datetime|Date/time notification was created
createdBy|int|ID of the user that created the notification
createdByUser|string|Name of the user that created the notification
dateModified|datetime/null|Date/time notification was last modified
modifiedBy|int|ID of the user that last modified the notification
modifiedByUser|string|Name of the user that last modified the notification
language|string|Language locale of the notification
readCount|int|Total notification read count
sentCount|int|Unique notification sent count
category|null/object|Category

### List Notifications
```php
<?php
// ...

$notifications = $notificationApi->getList($searchFilter, $start, $limit, $orderBy, $orderByDir, $publishedOnly, $minimal);
```
```json
{  
    "total":1,
    "notifications":[  
        {  
            "isPublished":true,
            "dateAdded":"2016-09-14T14:03:05+00:00",
            "createdBy":1,
            "createdByUser":"John Doe",
            "dateModified":"2016-09-15T08:40:46+00:00",
            "modifiedBy":1,
            "modifiedByUser":"John Doe",
            "id":1,
            "name":"The first notification",
            "heading":"The first notification Heading",
            "message":"The first notification Message",
            "url":"http:\/\/mautic.org",
            "language":"en",
            "category":null,
            "publishUp":null,
            "publishDown":null,
            "readCount":0,
            "sentCount":0
        }
    ]
}
```
#### HTTP Request

`GET /notifications`

**Query Parameters**

Name|Description
----|-----------
search|String or search command to filter entities by.
start|Starting row for the entities returned. Defaults to 0.
limit|Limit number of entities to return. Defaults to the system configuration for pagination (30).
orderBy|Column to sort by. Can use any column listed in the response.
orderByDir|Sort direction: asc or desc.
publishedOnly|Only return currently published entities.
minimal|Return only array of entities without additional lists in it.

#### Response

`Expected Response Code: 200`

See JSON code example.

**Properties**

Same as [Get Notification](#get-notification).

### Create Notification
```php
<?php 

$data = array(
    'name'    => 'Notification A',
    'heading' => 'Hello World!'
    'message' => 'This is my first notification created via API.',
);

$notification = $notificationApi->create($data);
```
Create a new notification.

#### HTTP Request

`POST /notifications/new`

**Post Parameters**

Name|Type|Description
----|----|-----------
id|int|ID of the notification
name|string|Title of the notification
heading|string|Heading of the notification
message|string|Message of the notification
url|string|URL to go to when the notification is clicked
isPublished|bool|Published state
publishUp|datetime/null|Date/time when the notification should be published
publishDown|datetime/null|Date/time the notification should be un published
language|string|Language locale of the notification

#### Response

`Expected Response Code: 201`

**Properties**

Same as [Get Notification](#get-notification).

### Edit Notification
```php
<?php

$id   = 1;
$data = array(
    'name'    => 'Notification A',
    'heading' => 'Hello World!'
    'message' => 'This is my first notification created via API.',
);

// Create new a notification of ID 1 is not found?
$createIfNotFound = true;

$notification = $notificationApi->edit($id, $data, $createIfNotFound);
```
Edit a new notification. Note that this supports PUT or PATCH depending on the desired behavior.

**PUT** creates a notification if the given ID does not exist and clears all the notification information, adds the information from the request.
**PATCH** fails if the notification with the given ID does not exist and updates the notification field values with the values form the request.

#### HTTP Request

To edit a notification and return a 404 if the notification is not found:

`PATCH /notifications/ID/edit`

To edit a notification and create a new one if the notification is not found:

`PUT /notifications/ID/edit`

**Post Parameters**

Name|Type|Description
----|----|-----------
id|int|ID of the notification
name|string|Title of the notification
heading|string|Heading of the notification
message|string|Message of the notification
url|string|URL to go to when the notification is clicked
isPublished|bool|Published state
publishUp|datetime/null|Date/time when the notification should be published
publishDown|datetime/null|Date/time the notification should be un published
language|string|Language locale of the notification

#### Response

If `PUT`, the expected response code is `200` if the notification was edited or `201` if created.

If `PATCH`, the expected response code is `200`.

**Properties**

Same as [Get Notification](#get-notification).

### Delete Notification
```php
<?php

$notification = $notificationApi->delete($id);
```
Delete a notification.

#### HTTP Request

`DELETE /notifications/ID/delete`

#### Response

`Expected Response Code: 200`

**Properties**

Same as [Get Notification](#get-notification).
