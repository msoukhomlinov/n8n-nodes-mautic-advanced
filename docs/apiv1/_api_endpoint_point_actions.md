## Point Actions
Use this endpoint to obtain details on Mautic's point actions.

```php
<?php
use Mautic\MauticApi;
use Mautic\Auth\ApiAuth;

// ...
$initAuth = new ApiAuth();
$auth     = $initAuth->newAuth($settings);
$apiUrl   = "https://your-mautic.com";
$api      = new MauticApi();
$pointApi = $api->newApi("points", $auth, $apiUrl);
```

### Get Point Action
```php
<?php

//...
$point = $pointApi->get($id);
```
```json
{
    "point": {
        "id": 1,
        "name": "Opens Email",
        "description": null,
        "type": "email.send",
        "isPublished": true,
        "publishUp": null,
        "publishDown": null,
        "dateAdded": "2015-07-19T00:34:11-05:00",
        "createdBy": 1,
        "createdByUser": "Joe Smith",
        "dateModified": "2015-07-19T00:41:44-05:00",
        "modifiedBy": 1,
        "modifiedByUser": "Joe Smith",
        "delta": 10,
        "properties": {
            "emails": [
                35
            ]
        },
        "category": null
    }
}
```
Get an individual point action by ID.

#### HTTP Request

`GET /points/ID`

#### Response

`Expected Response Code: 200`

See JSON code example.

**Point Action Properties**

Name|Type|Description
----|----|-----------
id|int|ID of the point
name|string|Name of the point
description|string/null|Description of the point
category|string|Category name
type|string|Point action type
isPublished|bool|Published state
publishUp|datetime/null|Date/time when the point should be published
publishDown|datetime/null|Date/time the point should be un published
dateAdded|datetime|Date/time point was created
createdBy|int|ID of the user that created the point
createdByUser|string|Name of the user that created the point
dateModified|datetime/null|Date/time point was last modified
modifiedBy|int|ID of the user that last modified the point
modifiedByUser|string|Name of the user that last modified the point
delta|int|The number of points to give the lead when executing this action
properties|array|Configured properties for this point action

### List Point Actions

```php
<?php
// ...

$points = $pointApi->getList($searchFilter, $start, $limit, $orderBy, $orderByDir, $publishedOnly, $minimal);
```
```json
{
    "total": 1,
    "points": [
        {
            "id": 1,
            "name": "Opens Email",
            "description": null,
            "category": null
            "type": "email.send",
            "isPublished": true,
            "publishUp": null,
            "publishDown": null,
            "dateAdded": "2015-07-19T00:34:11-05:00",
            "createdBy": 1,
            "createdByUser": "Joe Smith",
            "dateModified": "2015-07-19T00:41:44-05:00",
            "modifiedBy": 1,
            "modifiedByUser": "Joe Smith",
            "delta": 10,
            "properties": {
                "emails": [
                    35
                ]
            }
        }
    ]
}
```
#### HTTP Request

`GET /points`

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

Same as [Get Point Action](#get-point-action).

### Create Point Action
```php
<?php 

$data = array(
    'name' => 'test',
    'delta' => 5,
    'type' => 'page.hit',
    'description' => 'created as a API test'
);

$point = $pointApi->create($data);
```
Create a new point action.

#### HTTP Request

`POST /points/new`

**Post Parameters**

Same as [Get Point Action](#get-point-action). Point Action fields and actions can be created/edited via the point actions/actions arrays in the point action array.

#### Response

`Expected Response Code: 201`

**Properties**

Same as [Get Point Action](#get-point-action).

### Edit Point Action
```php
<?php

$id   = 1;
$data = array(
    'name' => 'test',
    'delta' => 5,
    'type' => 'page.hit',
    'description' => 'created as a API test'
);

// Create new a point action of ID 1 is not found?
$createIfNotFound = true;

$point = $pointApi->edit($id, $data, $createIfNotFound);
```
Edit a new point action. Note that this supports PUT or PATCH depending on the desired behavior.

**PUT** creates a point action if the given ID does not exist and clears all the point action inpoint actionation, adds the inpoint actionation from the request. Point Action fields and actions will be also deleted if not present in the request.
**PATCH** fails if the point action with the given ID does not exist and updates the point action field values with the values point action the request.

#### HTTP Request

To edit a point action and return a 404 if the point action is not found:

`PATCH /points/ID/edit`

To edit a point action and create a new one if the point action is not found:

`PUT /points/ID/edit`

**Post Parameters**

Same as [Get Point Action](#get-point-action). Point Action fields and actions can be created/edited via the point actions/actions arrays in the point action array.

#### Response

If `PUT`, the expected response code is `200` if the point action was edited or `201` if created.

If `PATCH`, the expected response code is `200`.

**Properties**

Same as [Get Point Action](#get-point-action).

### Delete Point Action
```php
<?php

$point = $pointApi->delete($id);
```
Delete a point action.

#### HTTP Request

`DELETE /points/ID/delete`

#### Response

`Expected Response Code: 200`

**Properties**

Same as [Get Point Action](#get-point-action).

### Get Point Action Types
```php
<?php

$point = $pointApi->getPointActionTypes();
```
Get array of available Point Action Types

#### HTTP Request

`GET /points/actions/types`

#### Response

`Expected Response Code: 200`

```json
{  
    "pointActionTypes":{  
        "asset.download":"Downloads an asset",
        "email.send":"Is sent an email",
        "email.open":"Opens an email",
        "form.submit":"Submits a form",
        "page.hit":"Visits a landing page",
        "url.hit":"Visits specific URL"
    }
}
```
See JSON code example.
