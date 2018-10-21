# KH Streaming #

This project will be a template for KH Streaming. 

Copy the `config-sample.json` files to `config.json` and adjust the settings
as needed to match your congregation and system settings.

The config in the main directory defines all the congregation config locations.
Each individual congregation's details are in a separate config file, which
you can place in a subdirectory that is password-protected. When the user 
clicks the congregation button and attempts to load the congregation's config
file, the password will be requested by the browser first. 

## Global Config

The global site config should have a `name` which is the name of the site, and an array of `congregations`, each containing an object with `name` of congregation and `url` to the config for that congregation (optionally password protected via your web host). 

```json
{
    "name": "Sample Kingdom Hall",
    "congregations": [
        {
            "name": "Sample Congregation",
            "url": "cong/config.json"
        }
    ]
}
```

## Congregation Config

A congregation's individual configs require at least the `name`, `channel`, `formId`, and  `formUrl` properties:

  - `name` is the name of this congregation as it should appear in the header.
  - `channel` is the YouTube channel ID. 
  - `formId` and `formUrl` are the URL and ID of the Cognito form you are using to collect attendance information.

For example: 

```json
{
    "name": "My Great Congregation",
    "formId": "1",
    "formUrl": "https://services.cognitoforms.com/s/your-cognito-form-goes-here",
    "channel": "your-channel-id-goes-here"
} 
```

Optionally, you can provide either `videos` or `apikey` properties.

If you provide a `videos` property, it is an array of recent YouTube video IDs that will be listed in a "Recent Meeting Recordings" section under the live stream video. 

Example of using the `videos` property: 

```json
    "videos": [
        "video-id-1",
        "video-id-2"
    ]
```

If you provide an `apikey` property, which is your YouTube API key, then the app will ask YouTube for the most recent videos on your channel and will display them. This YouTube query will override any manually entered videos you provide with the `videos` property. Note that presently it will only query "public" videos, not "unlisted" or "private" videos.

Example of using the `apikey` property:

```json
    "apikey": "your-youtube-api-key-goes-here"
```