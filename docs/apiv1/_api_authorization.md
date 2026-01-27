
## Authorization

Mautic uses OAuth or Basic Authentication (as of Mautic 2.3.0) for API authorization. It supports both [OAuth 1a](http://tools.ietf.org/html/rfc5849) and [OAuth 2](https://tools.ietf.org/html/rfc6749); however, as of 1.1.2, the administrator of the Mautic instance must choose one or the other.  Of course OAuth 2 is only recommended for servers secured behind SSL. Basic authentication must be enabled in Configuration -> API Settings.

The Mautic administrator should enable the API in the Configuration -> API Settings. This will add the "API Credentials" to the admin menu. A client/consumer ID and secret should then be generated which will be used in the following processes. 

All authorization requests should be made to the specific Mautic instances URL, i.e. `https://your-mautic.com`.

<aside class="notice">
The OAuth processes can be a pain. If possible, it's best to use an OAuth library for the language being used. If PHP, it is recommended that Mautic's <a href="#php-library">PHP library</a> be used.
</aside>