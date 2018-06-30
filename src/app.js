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
            "channel": ''        
        },
        "congregations": []
    },
    computed: {
        youtubeUrl: function() {
            // Returns a full YouTube embed URL, with the congregation channel 
            if( this.congregation.channel ) return "https://www.youtube.com/embed/live_stream?channel=" + this.congregation.channel + ";modestbranding=1&amp;wmode=transparent&amp;rel=0";
            else return "";
        }
    },
    methods: {
        loadCong: function(url) {
            this.message='';
            // Get the congregation config and act onit
            this.$http.get(url).then(response => {
                this.congregation = response.body;
                // Create a script tag to load the Cognito form.
                var scr = document.createElement('script');
                scr.setAttribute('src', this.congregation.formUrl);
                document.head.appendChild(scr);
                // Then execute the function to actually load up the Cognito form on the screen.
                loadCognito();
            }, error => {
                this.message=error.statusText;
            });
        }
    },
    mounted() {
        // When mounted, display stuff
        document.getElementById("app").style.display="block";
        document.getElementById("alert-container").style.display="block";
        document.getElementById("copyright-container").style.display="block";
        // Load global configs
        this.$http.get('config.json').then(response => {
            this.name = response.body.name;
            this.congregations = response.body.congregations;
        }, error => {
            this.message=error.statusText;
        });
    }
});