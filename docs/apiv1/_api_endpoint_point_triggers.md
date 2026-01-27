## Point Triggers
Use this endpoint to obtain details on Mautic's point triggers.

```php
<?php
use Mautic\MauticApi;
use Mautic\Auth\ApiAuth;

// ...
$initAuth   = new ApiAuth();
$auth       = $initAuth->newAuth($settings);
$apiUrl     = "https://your-mautic.com";
$api        = new MauticApi();
$triggerApi = $api->newApi("pointTriggers", $auth, $apiUrl);
```

### Get Point Trigger
```php
<?php

//...
$trigger = $triggerApi->get($id);
```
```json
{
    "trigger": {
         "id": 1,
         "name": "Trigger test",
         "description": null,
         "category": null,      
         "isPublished": true,      
         "publishUp": null,
         "publishDown": null,
         "dateAdded": "2015-07-23T03:20:42-05:00",
         "createdBy": 1,
         "createdByUser": "Joe Smith",
         "dateModified": null,
         "modifiedBy": null,
         "modifiedByUser": null,l,
         "points": 10,
         "color": "ab5959",
         "events": {
             "1": {
                 "id": 1,
                 "type": "email.send",
                 "name": "Send email",
                 "description": null,
                 "order": 1,
                 "properties": {
                    "email": 21
                 }
             }
         }
     }
}
```
Get an individual point trigger by ID.

#### HTTP Request

`GET /points/triggers/ID`

#### Response

`Expected Response Code: 200`

See JSON code example.

**Point Trigger Properties**

Name|Type|Description
----|----|-----------
id|int|ID of the point
name|string|Name of the point
description|string/null|Description of the point
category|string|Category name
isPublished|bool|Published state
publishUp|datetime/null|Date/time when the point should be published
publishDown|datetime/null|Date/time the point should be un published
dateAdded|datetime|Date/time point was created
createdBy|int|ID of the user that created the point
createdByUser|string|Name of the user that created the point
dateModified|datetime/null|Date/time point was last modified
modifiedBy|int|ID of the user that last modified the point
modifiedByUser|string|Name of the user that last modified the point
points|int|The minimum number of points before the trigger events are executed
color|string|Color hex to highlight the lead with. This value does NOT include the pound sign (#)
events|array|Array of TriggerEvent entities for this trigger. See below.

**Trigger Event Properties**

Name|Type|Description
----|----|-----------
id|int|ID of the event
type|string|Event type
name|string|Name of the event
description|string|Description of the event
order|int|Event order
properties|array|Configured properties for the event

### List Point Triggers

```php
<?php
// ...

$triggers = $triggerApi->getList($searchFilter, $start, $limit, $orderBy, $orderByDir, $publishedOnly, $minimal);
```
```json
{
    "total": 1,
    "triggers": [
        {
            "id": 1,
            "name": "Trigger test",
            "description": null,
            "category": null,      
            "isPublished": true,      
            "publishUp": null,
            "publishDown": null,
            "dateAdded": "2015-07-23T03:20:42-05:00",
            "createdBy": 1,
            "createdByUser": "Joe Smith",
            "dateModified": null,
            "modifiedBy": null,
            "modifiedByUser": null,l,
            "points": 10,
            "color": "ab5959",
            "events": {
                "1": {
                    "id": 1,
                    "type": "email.send",
                    "name": "Send email",
                    "description": null,
                    "order": 1,
                    "properties": {
                        "email": 21
                    }
                }
            }
        }
    ]
}
```
#### HTTP Request

`GET /points/triggers`

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

Same as [Get Point Trigger](#get-point-trigger).

### Create Point Trigger
```php
<?php 

$data = array(
    'name' => 'test',
    'description' => 'created as a API test',
    'points' => 5,
    'color' => '4e5d9d',
    'trigger_existing_leads' => false,
    'events' => array(
        array(
            'name' => 'tag test event',
            'description' => 'created as a API test',
            'type' => 'lead.changetags',
            'order' => 1,
            'properties' => array(
                'add_tags' => array('tag-a'),
                'remove_tags' => array()
            )
        ),
        array(
            'name' => 'send email test event',
            'description' => 'created as a API test',
            'type' => 'email.send',
            'order' => 2,
            'properties' => array(
                'email' => 1
            )
        )
    )
);

$trigger = $triggerApi->create($data);
```
Create a new point trigger.

#### HTTP Request

`POST /points/triggers/new`

**Post Parameters**

Same as [Get Point Trigger](#get-point-trigger). Point Trigger events can be created/edited via the point trigger event arrays placed in the point trigger array.

#### Response

`Expected Response Code: 201`

**Properties**

Same as [Get Point Trigger](#get-point-trigger).

### Edit Point Trigger
```php
<?php

$id   = 1;
$data = array(
    'name' => 'test',
    'description' => 'created as a API test',
    'points' => 5,
    'color' => '4e5d9d',
    'trigger_existing_leads' => false,
    'events' => array(
        array(
            'name' => 'tag test event',
            'description' => 'created as a API test',
            'type' => 'lead.changetags',
            'order' => 1,
            'properties' => array(
                'add_tags' => array('tag-a'),
                'remove_tags' => array()
            )
        ),
        array(
            'name' => 'send email test event',
            'description' => 'created as a API test',
            'type' => 'email.send',
            'order' => 2,
            'properties' => array(
                'email' => 1
            )
        )
    )
);

// Create new a point trigger of ID 1 is not found?
$createIfNotFound = true;

$trigger = $triggerApi->edit($id, $data, $createIfNotFound);
```
Edit a new point trigger. Note that this supports PUT or PATCH depending on the desired behavior.

**PUT** creates a point trigger if the given ID does not exist and clears all the point trigger information, adds the information from the request. Point Trigger events will be also deleted if not present in the request.
**PATCH** fails if the point trigger with the given ID does not exist and updates the point trigger field values with the values point trigger the request.

#### HTTP Request

To edit a point trigger and return a 404 if the point trigger is not found:

`PATCH /points/triggers/ID/edit`

To edit a point trigger and create a new one if the point trigger is not found:

`PUT /points/triggers/ID/edit`

**Post Parameters**

Same as [Get Point Trigger](#get-point-trigger). Point Trigger events can be created/edited via the point triggers event arrays placed in the point trigger array.

#### Response

If `PUT`, the expected response code is `200` if the point trigger was edited or `201` if created.

If `PATCH`, the expected response code is `200`.

**Properties**

Same as [Get Point Trigger](#get-point-trigger).

### Delete Point Trigger
```php
<?php

$trigger = $triggerApi->delete($id);
```
Delete a point trigger.

#### HTTP Request

`DELETE /points/triggers/ID/delete`

#### Response

`Expected Response Code: 200`

**Properties**

Same as [Get Point Trigger](#get-point-trigger).

### Delete Point Trigger Events

The following examples will show how to delete events with ID 56 and 59.

```php
<?php

$trigger = $triggerApi->deleteFields($triggerId, array(56, 59));
```
Delete a point trigger events.

#### HTTP Request

`DELETE /points/triggers/ID/events/delete?events[]=56&events[]=59`

#### Response

`Expected Response Code: 200`

**Properties**

Same as [Get Point Trigger](#get-point-trigger).

### Get Point Trigger Event Types
```php
<?php

$point = $pointApi->getEventTypes();
```
Get array of available Point Trigger Event Types

#### HTTP Request

`GET /points/triggers/events/types`

#### Response

`Expected Response Code: 200`

```json
{  
    "eventTypes":{  
        "campaign.changecampaign":"Modify contact's campaigns",
        "lead.changelists":"Modify contact's segments",
        "lead.changetags":"Modify contact's tags",
        "plugin.leadpush":"Push contact to integration",
        "email.send":"Send an email"
    }
}
```

