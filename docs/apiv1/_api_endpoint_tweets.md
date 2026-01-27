## Tweets
Use this endpoint to obtain details on Mautic's tweets. Implemented in Mautic 2.8.0.

```php
<?php
use Mautic\MauticApi;
use Mautic\Auth\ApiAuth;

// ...
$initAuth        = new ApiAuth();
$auth            = $initAuth->newAuth($settings);
$apiUrl          = "https://your-mautic.com";
$api             = new MauticApi();
$tweetApi = $api->newApi("tweets", $auth, $apiUrl);
```

### Get Tweet
```php
<?php

//...
$tweet = $tweetApi->get($id);
```
```json
{  
    "tweet": {
        "isPublished": true,
        "dateAdded": "2017-02-03T17:51:58+01:00",
        "dateModified": "2017-03-28T11:03:03+02:00",
        "createdBy": 1,
        "createdByUser": "John Doe",
        "modifiedBy": 1,
        "modifiedByUser": "John Doe",
        "id": 1,
        "name": "Thank you tweet",
        "text": "Hi {twitter_handle}\n\nThanks for ...",
        "language": "en",
        "category": {
            "createdByUser": "John Doe",
            "modifiedByUser": null,
            "id": 185,
            "title": "Thank you tweets",
            "alias": "thank-you-tweets",
            "description": null,
            "color": "244bc9",
            "bundle": "global"
        },
        "tweetId": null,
        "mediaId": null,
        "mediaPath": null,
        "sentCount": 3,
        "favoriteCount": 0,
        "retweetCount": 0,
        "description": "Used in the Product A campaign 1"
    }
}
```
Get an individual tweet by ID.

#### HTTP Request

`GET /tweets/ID`

#### Response

`Expected Response Code: 200`

See JSON code example.

**Tweet Properties**

Name|Type|Description
----|----|-----------
id|int|ID of the tweet
name|string|Title of the tweet
text|string|Message of the tweet
isPublished|bool|Published state
publishUp|datetime/null|Date/time when the tweet should be published
publishDown|datetime/null|Date/time the tweet should be un published
dateAdded|datetime|Date/time tweet was created
createdBy|int|ID of the user that created the tweet
createdByUser|string|Name of the user that created the tweet
dateModified|datetime/null|Date/time tweet was last modified
modifiedBy|int|ID of the user that last modified the tweet
modifiedByUser|string|Name of the user that last modified the tweet
language|string|Language locale of the tweet
category|null/object|Category

### List Tweets
```php
<?php
// ...

$tweets = $tweetApi->getList($searchFilter, $start, $limit, $orderBy, $orderByDir, $publishedOnly, $minimal);
```
```json
{  
    "total":1,
    "tweets":[  
        {
            "isPublished": true,
            "dateAdded": "2017-02-03T17:51:58+01:00",
            "dateModified": "2017-03-28T11:03:03+02:00",
            "createdBy": 1,
            "createdByUser": "John Doe",
            "modifiedBy": 1,
            "modifiedByUser": "John Doe",
            "id": 1,
            "name": "Thank you tweet",
            "text": "Hi {twitter_handle}\n\nThanks for ...",
            "language": "en",
            "category": null,
            "tweetId": null,
            "mediaId": null,
            "mediaPath": null,
            "favoriteCount": 0,
            "retweetCount": 0,
            "description": "Used in the Product A campaign 1"
        }
    ]
}
```
#### HTTP Request

`GET /tweets`

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

Same as [Get Tweet](#get-tweet).

### Create Tweet
```php
<?php 

$data = array(
    'name'    => 'Tweet A',
    'heading' => 'Hello World!'
    'message' => 'This is my first tweet created via API.',
);

$tweet = $tweetApi->create($data);
```
Create a new tweet.

#### HTTP Request

`POST /tweets/new`

**Post Parameters**

Name|Type|Description
----|----|-----------
id|int|ID of the tweet
name|string|Title of the tweet
text|string|Message of the tweet
url|string|URL to go to when the tweet is clicked
isPublished|bool|Published state
publishUp|datetime/null|Date/time when the tweet should be published
publishDown|datetime/null|Date/time the tweet should be un published
language|string|Language locale of the tweet

#### Response

`Expected Response Code: 201`

**Properties**

Same as [Get Tweet](#get-tweet).

### Edit Tweet
```php
<?php

$id   = 1;
$data = array(
    'name' => 'Tweet A',
    'text' => 'This is my first tweet created via API.',
);

// Create new a tweet of ID 1 is not found?
$createIfNotFound = true;

$tweet = $tweetApi->edit($id, $data, $createIfNotFound);
```
Edit a new tweet. Note that this supports PUT or PATCH depending on the desired behavior.

**PUT** creates a tweet if the given ID does not exist and clears all the tweet information, adds the information from the request.
**PATCH** fails if the tweet with the given ID does not exist and updates the tweet field values with the values form the request.

#### HTTP Request

To edit a tweet and return a 404 if the tweet is not found:

`PATCH /tweets/ID/edit`

To edit a tweet and create a new one if the tweet is not found:

`PUT /tweets/ID/edit`

**Post Parameters**

Name|Type|Description
----|----|-----------
id|int|ID of the tweet
name|string|Title of the tweet
text|string|Message of the tweet
url|string|URL to go to when the tweet is clicked
isPublished|bool|Published state
publishUp|datetime/null|Date/time when the tweet should be published
publishDown|datetime/null|Date/time the tweet should be un published
language|string|Language locale of the tweet

#### Response

If `PUT`, the expected response code is `200` if the tweet was edited or `201` if created.

If `PATCH`, the expected response code is `200`.

**Properties**

Same as [Get Tweet](#get-tweet).

### Delete Tweet
```php
<?php

$tweet = $tweetApi->delete($id);
```
Delete a tweet.

#### HTTP Request

`DELETE /tweets/ID/delete`

#### Response

`Expected Response Code: 200`

**Properties**

Same as [Get Tweet](#get-tweet).
