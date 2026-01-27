## Roles
Use this endpoint to obtain details on Mautic's roles (administrators).

```php
<?php
use Mautic\MauticApi;
use Mautic\Auth\ApiAuth;

// ...
$initAuth = new ApiAuth();
$auth     = $initAuth->newAuth($settings);
$apiUrl   = "https://your-mautic.com";
$api      = new MauticApi();
$roleApi  = $api->newApi("roles", $auth, $apiUrl);
```

### Get Role
```php
<?php

//...
$role = $roleApi->get($id);
```
```json
{  
  "role":{  
    "isPublished":true,
    "dateAdded":"2016-11-09T15:24:32+00:00",
    "createdBy":1,
    "createdByUser":"John Doe",
    "dateModified":null,
    "modifiedBy":null,
    "modifiedByUser":null,
    "id":13,
    "name":"API test role",
    "description":"created via AIP",
    "isAdmin":false,
    "rawPermissions":{  
      "email:emails":[  
        "viewown",
        "viewother"
      ]
    }
  }
}
```
Get an individual role by ID.

#### HTTP Request

`GET /roles/ID`

#### Response

`Expected Response Code: 200`

See JSON code example.

**Role Properties**

Name|Type|Description
----|----|-----------
id|int|ID of the contact
dateAdded|datetime|Date/time contact was created
createdBy|int|ID of the role that created the contact
createdByRole|string|Name of the role that created the contact
dateModified|datetime/null|Date/time contact was last modified
modifiedBy|int|ID of the role that last modified the contact
modifiedByRole|string|Name of the role that last modified the contact
name|string|Name of the role
description|string|Description of the role
isAdmin|boolean|Whether the role has full access or only some
rawPermissions|array|List of roles

### List Contact Roles

```php
<?php

//...
$roles = $roleApi->getList($searchFilter, $start, $limit, $orderBy, $orderByDir, $publishedOnly, $minimal);
```
```json
{  
  "total":9,
  "roles":[  
    {  
      "isPublished":true,
      "dateAdded":"2016-08-01T11:51:32+00:00",
      "createdBy":1,
      "createdByUser":"John Doe",
      "dateModified":null,
      "modifiedBy":null,
      "modifiedByUser":null,
      "id":2,
      "name":"view email",
      "description":null,
      "isAdmin":false,
      "rawPermissions":{  
        "email:emails":[  
          "viewown",
          "viewother"
        ]
      }
    },
    [...]
  ]
}
```

#### HTTP Request

`GET /roles`

#### Response

`Expected Response Code: 200`

See JSON code example.

**Role Properties**

Name|Type|Description
----|----|-----------
id|int|ID of the contact
dateAdded|datetime|Date/time contact was created
createdBy|int|ID of the role that created the contact
createdByRole|string|Name of the role that created the contact
dateModified|datetime/null|Date/time contact was last modified
modifiedBy|int|ID of the role that last modified the contact
modifiedByRole|string|Name of the role that last modified the contact
name|string|Name of the role
description|string|Description of the role
isAdmin|boolean|Whether the role has full access or only some
rawPermissions|array|List of roles

### Create Role
```php
<?php 

$data = array(
    'name' => 'API test role',
    'description' => 'created via AIP',
    'rawPermissions' => array (
        'email:emails' => 
        array (
            'viewown',
            'viewother',
        ),
    )
);

$role = $roleApi->create($data);
```
Create a new role.

#### HTTP Request

`POST /roles/new`

**Post Parameters**

Name|Description
----|-----------
name|string|Name of the role
description|string|Description of the role
isAdmin|boolean|Whether the role has full access or only some
rawPermissions|array|List of roles

#### Response

`Expected Response Code: 201`

**Properties**

Same as [Get Role](#get-role).

### Edit Role
```php
<?php

$id   = 1;
$data = array(
    'name' => 'API test role',
    'description' => 'created via AIP',
    'rawPermissions' => array (
        'email:emails' => 
        array (
            'editown',
            'editother',
        ),
    )
);

// Create new a role of ID 1 is not found?
$createIfNotFound = true;

$role = $roleApi->edit($id, $data, $createIfNotFound);
```
Edit a new role. Role that this supports PUT or PATCH depending on the desired behavior.

**PUT** creates a role if the given ID does not exist and clears all the role information, adds the information from the request.
**PATCH** fails if the role with the given ID does not exist and updates the role field values with the values form the request.

#### HTTP Request

To edit a role and return a 404 if the role is not found:

`PATCH /roles/ID/edit`

To edit a role and create a new one if the role is not found:

`PUT /roles/ID/edit`

**Post Parameters**

Name|Description
----|-----------
name|string|Name of the role
description|string|Description of the role
isAdmin|boolean|Whether the role has full access or only some
rawPermissions|array|List of roles

#### Response

If `PUT`, the expected response code is `200` if the role was edited or `201` if created.

If `PATCH`, the expected response code is `200`.

**Properties**

Same as [Get Role](#get-role).

### Delete Role
```php
<?php

$role = $roleApi->delete($id);
```
Delete a role.

#### HTTP Request

`DELETE /roles/ID/delete`

#### Response

`Expected Response Code: 200`

**Properties**

Same as [Get Role](#get-role).
