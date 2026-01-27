## Marketing Messages
Use this endpoint to obtain details, create, update or delete Mautic's messages.

```php
<?php
use Mautic\MauticApi;
use Mautic\Auth\ApiAuth;

// ...
$initAuth = new ApiAuth();
$auth     = $initAuth->newAuth($settings);
$apiUrl   = "https://your-mautic.com";
$api      = new MauticApi();
$messageApi = $api->newApi("messages", $auth, $apiUrl);
```

### Get Marketing Message
```php
<?php

//...
$message = $messageApi->get($id);
```
```json
{
    "message": {
        "isPublished": true,
        "dateAdded": "2017-02-08T15:00:34+01:00",
        "dateModified": "2017-02-08T15:00:35+01:00",
        "createdBy": 1,
        "createdByUser": "John Doe",
        "modifiedBy": 1,
        "modifiedByUser": "John Doe",
        "id": 26,
        "name": "Thanks for the feedback!",
        "description": "",
        "publishUp": null,
        "publishDown": null,
        "channels": [
            {
                "id": 55,
                "channel": "email",
                "channelId": 1197,
                "channelName": "Email A",
                "isEnabled": true
            },
            {
                "id": 57,
                "channel": "notification",
                "channelId": null,
                "channelName": null,
                "isEnabled": false
            },
            {
                "id": 56,
                "channel": "sms",
                "channelId": 103,
                "channelName": "SMS A",
                "isEnabled": false
            },
            {
                "id": 91,
                "channel": "tweet",
                "channelId": null,
                "channelName": null,
                "isEnabled": false
            }
        ]
    }
}
```
Get an individual marketing message by ID.

#### HTTP Request

`GET /messages/ID`

#### Response

`Expected Response Code: 200`

See JSON code example.

**Marketing Message Properties**

Name|Type|Description
----|----|-----------
id|int|ID of the message
name|string|Internal name of the message
isPublished|bool|Published state
publishUp|datetime/null|Date/time when the message should be published
publishDown|datetime/null|Date/time the message should be un published
dateAdded|datetime|Date/time message was created
createdBy|int|ID of the user that created the message
createdByUser|string|Name of the user that created the message
dateModified|datetime/null|Date/time message was last modified
modifiedBy|int|ID of the user that last modified the message
modifiedByUser|string|Name of the user that last modified the message
channels|array|Array of channels configured for the marketing message

### List Marketing Messages
```php
<?php
// ...

$messages = $messageApi->getList($searchFilter, $start, $limit, $orderBy, $orderByDir, $publishedOnly, $minimal);
```
```json
{
    "total": 1,
    "messages": {
        "1": {
            "isPublished": true,
            "dateAdded": "2017-02-03T16:51:58+00:00",
            "dateModified": "2017-02-03T19:11:41+00:00",
            "createdBy": 1,
            "createdByUser": "John Doe",
            "modifiedBy": 1,
            "modifiedByUser": "John Doe",
            "id": 1,
            "name": "Live long and prosper",
            "description": null,
            "publishUp": null,
            "publishDown": null,
            "channels": [
                {
                    "id": 1,
                    "channel": "email",
                    "channelId": 44,
                    "channelName": "Email A",
                    "isEnabled": true
                },
                {
                    "id": 2,
                    "channel": "sms",
                    "channelId": 1,
                    "channelName": "SMS A",
                    "isEnabled": true
                },
                {
                    "id": 3,
                    "channel": "notification",
                    "channelId": 75,
                    "channelName": null,
                    "isEnabled": false
                }
            ]
        }
    }
}
```
#### HTTP Request

`GET /messages`

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

Same as [Get Marketing Message](#get-message).

### Create Marketing Message
```php
<?php 

$data = array(
    'name'        => 'Marketing Message A',
    'description' => 'This is my first message created via API.',
    'isPublished' => 1,
    'channels' => array(
        'email' => array(
            'channel' => 'email',
            'channelId' => 44,
            'isEnabled' => true,
        ),
        'sms' => array(
            'channel' => 'sms',
            'channelId' => 1,
            'isEnabled' => true,
        ),
        'notification' => array(
            'channel' => 'notification',
            'channelId' => 75,
            'isEnabled' => false,
        )
    )
);

$message = $messageApi->create($data);
```
Create a new message.

#### HTTP Request

`POST /messages/new`

**Post Parameters**

Name|Type|Description
----|----|-----------
id|int|ID of the message
name|string|Internal name of the message
isPublished|bool|Published state
publishUp|datetime/null|Date/time when the message should be published
publishDown|datetime/null|Date/time the message should be un published
channels|array|Array of channels

#### Response

`Expected Response Code: 201`

**Properties**

Same as [Get Marketing Message](#get-message).

### Edit Marketing Message
```php
<?php

$id   = 1;
$data = array(
    'name'        => 'New message title',
    'isPublished' => 0
);

// Create new a message of ID 1 is not found?
$createIfNotFound = true;

$message = $messageApi->edit($id, $data, $createIfNotFound);
```
Edit a new message. Note that this supports PUT or PATCH depending on the desired behavior.

**PUT** creates a message if the given ID does not exist and clears all the message information, adds the information from the request.
**PATCH** fails if the message with the given ID does not exist and updates the message field values with the values form the request.

#### HTTP Request

To edit a message and return a 404 if the message is not found:

`PATCH /messages/ID/edit`

To edit a message and create a new one if the message is not found:

`PUT /messages/ID/edit`

**Post Parameters**

Name|Type|Description
----|----|-----------
id|int|ID of the message
name|string|Internal name of the message
isPublished|bool|Published state
publishUp|datetime/null|Date/time when the message should be published
publishDown|datetime/null|Date/time the message should be un published
channels|array|Array of channels

#### Response

If `PUT`, the expected response code is `200` if the message was edited or `201` if created.

If `PATCH`, the expected response code is `200`.

**Properties**

Same as [Get Marketing Message](#get-message).

### Delete Marketing Message
```php
<?php

$message = $messageApi->delete($id);
```
Delete a message.

#### HTTP Request

`DELETE /messages/ID/delete`

#### Response

`Expected Response Code: 200`

**Properties**

Same as [Get Marketing Message](#get-message).
