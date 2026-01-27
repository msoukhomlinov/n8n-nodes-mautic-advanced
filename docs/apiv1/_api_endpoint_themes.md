## Themes
This endpoint is useful for working with Mautic themes.

```php
<?php
use Mautic\MauticApi;
use Mautic\Auth\ApiAuth;

$initAuth = new ApiAuth();
$auth     = $initAuth->newAuth($settings);
$apiUrl   = "https://your-mautic.com";
$api      = new MauticApi();
$themesApi = $api->newApi("themes", $auth, $apiUrl);
```

### Get theme

Returns directly the zip file in the response with the `application/zip` header on success or a JSON response body with error messages on fail. The PHP API library will save the zip file to the system temporary directory and provides you with the path.

```php
<?php
$response = $themesApi->get($themeName);
```
```json
{
    "file": "/absolute/path/to/the/system/temp/dir/with/the/theme/zip/file"
}
```

#### HTTP Request

`GET /themes/THEME_NAME`

#### Response

`Expected Response Code: 200`

### Set Temporary File Path

Changes the default temporary directory where the zip file is created. The directory is created if it does not exist.

```php
<?php
$themesApi->setTemporaryFilePath("/absolute/path/to/a/different/temp/dir");
$response = $themesApi->get($themeName);
```
```json
{
    "file": "/absolute/path/to/a/different/temp/dir/zipfile"
}
```

### Get List of themes

Lists all installed themes with the detailes stored in their config.json files.

```php
<?php
$response = $themesApi->getList();
```
```json
{
    "themes": {
        "blank": {
            "name": "Blank",
            "key": "blank",
            "config": {
                "name": "Blank",
                "author": "Mautic team",
                "authorUrl": "https:\/\/mautic.org",
                "features": [
                    "page",
                    "email",
                    "form"
                ]
            }
        },
        ...
    }
}
```

#### HTTP Request

`GET /themes`

#### Response

`Expected Response Code: 200`

See JSON code example.

**Response Properties**

Name|Type|Description
----|----|-----------
themes|array|List of installed themes and their configs

### Create Theme

Creates a new theme or updates an existing one (based on the file name) from provided zip file.

```php
<?php
$data = array(
    'file' => dirname(__DIR__).'/'.'mytheme.zip' // Must be a path to an existing file
);

$response = $themeApi->create($data);
```
The file is sent via regular POST files array like a browser sends it during file upload.

#### HTTP Request

`POST /themes/new`

#### Response

`Expected Response Code: 200`
```json
{  
  "success": true
}
```

### Delete File
```php
<?php
$response = $themeApi->delete($themeName);
```
Delete a theme. The stock themes cannot be deleted

#### HTTP Request

`DELETE /themes/THEME_NAME/delete`

#### Response

`Expected Response Code: 200`
```json
{
    "success": true
}
```
