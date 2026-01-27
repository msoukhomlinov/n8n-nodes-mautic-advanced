## Dynamic Content
Use this endpoint to obtain details on Mautic's web dynamic content.

```php
<?php
use Mautic\MauticApi;
use Mautic\Auth\ApiAuth;

// ...
$initAuth         = new ApiAuth();
$auth             = $initAuth->newAuth($settings);
$apiUrl           = "https://your-mautic.com";
$api              = new MauticApi();
$dynamicContentApi = $api->newApi("dynamicContents", $auth, $apiUrl);
```

### Get Dynamic Content
```php
<?php

//...
$dynamicContent = $dynamicContentApi->get($id);
```
```json
{
    "dynamicContent":{
        "isPublished":true,
        "dateAdded":"2016-06-20T11:26:51+00:00",
        "createdBy":1,
        "createdByUser":"John Doe",
        "dateModified":"2016-08-08T16:36:27+00:00",
        "modifiedBy":1,
        "modifiedByUser":"John Doe",
        "id":1,
        "name":"DC13",
        "category":null,
        "publishUp":null,
        "publishDown":null,
        "sentCount":0,
        "variantParent":null,
        "variantChildren":[]
    }
}
```
Get an individual dynamicContent by ID.

#### HTTP Request

`GET /dynamiccontents/ID`

#### Response

`Expected Response Code: 200`

See JSON code example.

**Dynamic Content Properties**

Name|Type|Description
----|----|-----------
id|int|ID of the dynamic content
name|string|Name of the dynamic content
description|string/null|Description of the dynamic content
isPublished|bool|Published state
publishUp|datetime/null|Date/time when the dynamic content should be published
publishDown|datetime/null|Date/time the dynamic content should be un published
dateAdded|datetime|Date/time dynamic content was created
createdBy|int|ID of the user that created the dynamic content
createdByUser|string|Name of the user that created the dynamic content
dateModified|datetime/null|Date/time dynamic content was last modified
modifiedBy|int|ID of the user that last modified the dynamic content
modifiedByUser|string|Name of the user that last modified the dynamic content
variantChildren|array|Array of Dynamic Content entities for variants of this landing dynamic content
variantParent|object|The parent/main dynamic content if this is a variant (A/B test)
sentCount|int|Count of how many times the dynamic content was sent

### List Dynamic Contents
```php
<?php
// ...

$dynamicContents = $dynamicContentApi->getList($searchFilter, $start, $limit, $orderBy, $orderByDir, $publishedOnly, $minimal);
```
```json
{
    "total":30,
    "dynamicContents":[
        {
            "isPublished":true,
            "dateAdded":"2016-06-20T11:27:09+00:00",
            "createdBy":1,
            "createdByUser":"John Doe",
            "dateModified":"2016-08-22T17:14:01+00:00",
            "modifiedBy":1,
            "modifiedByUser":"John Doe",
            "id":2,
            "name":"CD2",
            "category":null,
            "publishUp":null,
            "publishDown":null,
            "sentCount":0,
            "variantParent":null,
            "variantChildren":[]
        }
    ]
}
```
#### HTTP Request

`GET /dynamiccontents`

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

Same as [Get Dynamic Content](#get-dynamic-content).

### Create Dynamic Content
```php
<?php

$data = array(
    'name'        => 'Dynamic Content A',
    'isPublished' => 1
);

$dynamicContent = $dynamicContentApi->create($data);
```
Create a new dynamicContent.

#### HTTP Request

`POST /dynamiccontents/new`

**Post Parameters**

Name|Type|Description
----|----|-----------
id|int|ID of the dynamic content
name|string|Name of the dynamic content
description|string/null|Description of the dynamic content
isPublished|bool|Published state
publishUp|datetime/null|Date/time when the dynamic content should be published
publishDown|datetime/null|Date/time the dynamic content should be un published
dateAdded|datetime|Date/time dynamic content was created
createdBy|int|ID of the user that created the dynamic content
createdByUser|string|Name of the user that created the dynamic content
dateModified|datetime/null|Date/time dynamic content was last modified
modifiedBy|int|ID of the user that last modified the dynamic content
modifiedByUser|string|Name of the user that last modified the dynamic content
variantChildren|array|Array of Dynamic Content entities for variants of this landing dynamic content
variantParent|object|The parent/main dynamic content if this is a variant (A/B test)
sentCount|int|Count of how many times the dynamic content was sent

#### Response

`Expected Response Code: 201`

**Properties**

Same as [Get Dynamic Content](#get-dynamic-content).

### Edit Dynamic Content
```php
<?php

$id   = 1;
$data = array(
    'name'        => 'New dynamicContent name',
    'isPublished' => 0
);

// Create new a dynamicContent of ID 1 is not found?
$createIfNotFound = true;

$dynamicContent = $dynamicContentApi->edit($id, $data, $createIfNotFound);
```
Edit a new dynamicContent. Note that this supports PUT or PATCH depending on the desired behavior.

**PUT** creates a dynamicContent if the given ID does not exist and clears all the dynamic content information, adds the information from the request.
**PATCH** fails if the dynamic content with the given ID does not exist and updates the dynamic content field values with the values form the request.

#### HTTP Request

To edit a dynamicContent and return a 404 if the dynamic content is not found:

`PATCH /dynamiccontents/ID/edit`

To edit a dynamicContent and create a new one if the dynamic content is not found:

`PUT /dynamiccontents/ID/edit`

**Post Parameters**

Name|Type|Description
----|----|-----------
id|int|ID of the dynamic content
name|string|Name of the dynamic content
description|string/null|Description of the dynamic content
isPublished|bool|Published state
publishUp|datetime/null|Date/time when the dynamic content should be published
publishDown|datetime/null|Date/time the dynamic content should be un published
dateAdded|datetime|Date/time dynamic content was created
createdBy|int|ID of the user that created the dynamic content
createdByUser|string|Name of the user that created the dynamic content
dateModified|datetime/null|Date/time dynamic content was last modified
modifiedBy|int|ID of the user that last modified the dynamic content
modifiedByUser|string|Name of the user that last modified the dynamic content
variantChildren|array|Array of Dynamic Content entities for variants of this landing dynamic content
variantParent|object|The parent/main dynamic content if this is a variant (A/B test)
sentCount|int|Count of how many times the dynamic content was sent

#### Response

If `PUT`, the expected response code is `200` if the dynamic content was edited or `201` if created.

If `PATCH`, the expected response code is `200`.

**Properties**

Same as [Get Dynamic Content](#get-dynamic-content).

### Delete Dynamic Content
```php
<?php

$dynamicContent = $dynamicContentApi->delete($id);
```
Delete a dynamicContent.

#### HTTP Request

`DELETE /dynamiccontents/ID/delete`

#### Response

`Expected Response Code: 200`

**Properties**

Same as [Get Dynamic Content](#get-dynamic-content).
