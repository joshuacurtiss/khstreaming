/*
 *   This code handles loading the Cognito form and then
 *   display the YouTube embedded video after successful submission.
 */

// Initiates showing the video on submitting the Cognito form
function CognitoSuccess() {
    ExoJQuery(function() {
        ExoJQuery(document)
            .on('afterSubmit.cognito', function(e, data) {
                app.$data.showVideo=true;
            });
    });
}

// Handles loading the Cognito form. If the Cognito object does not exist yet, it waits and tries again.
var loadCognitoTimeout;
function loadCognito() {
    if( typeof Cognito !== 'undefined' ) {
        clearTimeout(loadCognitoTimeout);
        Cognito.load("forms", {id:app.$data.congregation.formId}, {success:CognitoSuccess});
    } else {
        loadCognitoTimeout=setTimeout(loadCognito,200);
    }
}

// Main Vue app
var app = new Vue({
    el: '#app',
    data: {
        "name": 'Kingdom Hall Streaming',
        "message": '',
        "showVideo": false,
        "congregation": {
            "name": '',
            "formId": '1',
            "formUrl": '',
            "channel": '',
            "apikey": ''
        },
        "videos": [],
        "congregations": []
    },
    computed: {
        youtubeUrl: function() {
            // Returns a full YouTube embed URL, with the congregation channel 
            if( this.congregation.channel ) return "https://www.youtube.com/embed/live_stream?channel=" + this.congregation.channel + ";modestbranding=1&amp;wmode=transparent&amp;rel=0";
            else return "";
        },
        videosUrl: function() {
            return 'https://www.googleapis.com/youtube/v3/search?order=date&part=id&channelId=' +
                this.congregation.channel +
                '&maxResults=2' +
                '&key=' +
                this.congregation.apikey;
        }
    },
    methods: {
        loadCong: function(url) {
            this.message='';
            // Get the congregation config and act onit
            var d=new Date();
            this.$http.get(url+'?tick='+d.getTime()).then(response => {
                if( response.body ) {
                    this.congregation = response.body;
                    // Create a script tag to load the Cognito form.
                    var scr = document.createElement('script');
                    scr.setAttribute('src', this.congregation.formUrl);
                    document.head.appendChild(scr);
                    // Then execute the function to actually load up the Cognito form on the screen.
                    loadCognito();
                    // Load previous YouTube videos if we have an API key
                    this.loadVideos();
                } else {
                    this.message="Could not load congregation configuration!";
                }
            }, error => {
                this.message=error.statusText;
            });
        },
        loadVideos: function() {
            if( this.congregation.apikey.length ) {
                this.$http.get(this.videosUrl).then(response => {
                    if( response.body.items ) this.videos=response.body.items.map(item=>item.id.videoId);
                    else this.message="Could not find YouTube recordings.";
                }, error => {
                    this.message=error.statusText;
                });
            }
        },
        recordingUrl: function(videoId) {
            if( videoId ) return 'https://www.youtube.com/embed/'+videoId+'?rel=0';
            else return '';
        }
    },
    mounted() {
        // When mounted, display stuff
        document.getElementById("app").style.display="block";
        document.getElementById("alert-container").style.display="block";
        document.getElementById("copyright-container").style.display="block";
        // Load global configs
        var d=new Date();
        this.$http.get('config.json?tick='+d.getTime()).then(response => {
            this.name = response.body.name;
            this.congregations = response.body.congregations;
        }, error => {
            this.message=error.statusText;
        });
    }
});