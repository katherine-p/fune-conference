apiRTC.setLogLevel(10);

var connectedConversation = null;
var localStream = null;
var cloudUrl = 'https://cloud.apizee.com';
var connectedSession = null;
var screensharingStream = null;

//==============================
// 1/ CREATE USER AGENT
//==============================
var ua = new apiRTC.UserAgent({
    uri: 'apzkey:myDemoApiKey'
});

//==============================
// 2/ REGISTER
//==============================
ua.register({
    cloudUrl: cloudUrl,
    username: 'katherine'
}).then(function(session) {
    // Save session
    connectedSession = session;
    
    // Join conference
    joinConference('tkA');

    //Display joinConference button when registered
    //document.getElementById('create').style.display = 'inline-block';
});

function joinConference(name) {
    connectedSession.on("contactListUpdate", function(updatedContacts) { //display a list of connected users
        console.log("MAIN - contactListUpdate", updatedContacts);
        if (connectedConversation !== null) {
            let contactList = connectedConversation.getContacts();
            console.info("contactList  connectedConversation.getContacts() :", contactList);
        }
    });

    //==============================
    // 3/ CREATE CONVERSATION
    //==============================
    connectedConversation = connectedSession.getConversation(name);

    //==========================================================
    // 4/ ADD EVENT LISTENER : WHEN NEW STREAM IS AVAILABLE IN CONVERSATION
    //==========================================================
    connectedConversation.on('streamListChanged', function(streamInfo) {
        console.log("streamListChanged :", streamInfo);
        if (streamInfo.listEventType === 'added') {
            if (streamInfo.isRemote === true) {
                connectedConversation.subscribeToMedia(streamInfo.streamId)
                .then(function(stream) {
                    console.log('subscribeToMedia success');
                }).catch(function(err) {
                    console.error('subscribeToMedia error', err);
                });
            }
        }
    });

    //=====================================================
    // 4 BIS/ ADD EVENT LISTENER : WHEN STREAM IS ADDED/REMOVED TO/FROM THE CONVERSATION
    //=====================================================
    connectedConversation.on('streamAdded', function(stream) {
        //alert(stream.streamId);

        let Scenary = document.getElementById('conference');
        let Camera = document.createElement('div');
        Camera.className = 'Camera remotecont';
        Camera.id = 'remote-container-'+stream.streamId;
        Scenary.appendChild(Camera);
        Dish();
        stream.addInDiv('remote-container-'+stream.streamId, 'remote-media-' + stream.streamId, {}, false);
    }).on('streamRemoved', function(stream) {
        //alert('remove');

        let remote = document.getElementById('remote-container-'+stream.streamId);
        remote.remove();
        Dish();

        stream.removeFromDiv('remote-container-'+stream.streamId, 'remote-media-' + stream.streamId);
    });

    //==============================
    // 5/ CREATE LOCAL STREAM
    //==============================
    var createStreamOptions = {};
    createStreamOptions.constraints = {
        audio: true,
        video: true
    };

    ua.createStream(createStreamOptions).then(function(stream) {
        console.log('createStream :', stream);
        // Save local stream
        localStream = stream;
        //let contacts = connectedConversation.getContacts();

        // let label = document.createElement('div');
        // label.className = "userLabel";
        // label.innerHTML = connectedSession.getUsername();
        // document.getElementById('local-container').appendChild(label);
        stream.removeFromDiv('local-container', 'local-media');
        stream.addInDiv('local-container', 'local-media', {}, true);


        //==============================
        // 6/ JOIN CONVERSATION
        //==============================
        connectedConversation.join().then(function(response) {
            //==============================
            // 7/ PUBLISH OWN STREAM
            //==============================
            connectedConversation.publish(localStream);
        }).catch(function(err) {
            console.error('Conversation join error', err);
        });
    }).catch(function(err) {
        console.error('create stream error', err);
    });
}

function leaveConference()
{
    console.log("leaveConference");

    document.getElementById('conference').style.display = 'none';
    document.getElementById('leaving').style.display = 'inline-block';
    document.getElementById('footer').style.display = 'none';

    // Leave Conversation
    if (connectedConversation !== null) {
        // Leaving actual conversation
        connectedConversation.leave()
        .then(function() {
            console.debug('Conversation leave OK');
            connectedConversation.destroy();
            connectedConversation = null;           
        }).catch(function(err) {
            console.error('Conversation leave error', err);
        });
        $('#remote-container').empty();
    }

    //Release localStream
    if (localStream !== null) {
        //Releasing LocalStream
    }
}

function turnmic()
{
    if(document.getElementById('btnmic').value == "on")
    {
        localStream.muteAudio();
        document.getElementById('btnmic').value = "off";
        document.getElementById('btnmic').innerHTML = "<i class='fa fa-microphone-slash fa-3x'></i>";
        document.getElementById('btnmic').className = 'btn btn-danger';
    }
    else
    {
        localStream.unmuteAudio();
        document.getElementById('btnmic').value = "on";
        document.getElementById('btnmic').innerHTML = "<i class='fa fa-microphone fa-3x'></i>";
        document.getElementById('btnmic').className = 'btn btn-outline-dark';
    }
}

function turnvideo()
{
    if(document.getElementById('btnvideo').value == "on")
    {
        localStream.muteVideo();
        document.getElementById('btnvideo').value = "off";
        document.getElementById('btnvideo').innerHTML = "<i class='fa fa-video-slash fa-3x'></i>";
        document.getElementById('btnvideo').className = 'btn btn-danger';
    }
    else
    {
        localStream.unmuteVideo();
        document.getElementById('btnvideo').value = "on";
        document.getElementById('btnvideo').innerHTML = "<i class='fa fa-video fa-3x'></i>";
        document.getElementById('btnvideo').className = 'btn btn-outline-dark';
    }
}

function toogleScreenSharing()
{
    if (screensharingStream === null) {
        const displayMediaStreamConstraints = {
            video: {
                cursor: "always"
            },
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                sampleRate: 44100
            }
        };

        apiRTC.Stream.createDisplayMediaStream(displayMediaStreamConstraints, false)
        .then(function(stream) {
            stream.on('stopped', function() {
                        //Used to detect when user stop the screenSharing with Chrome DesktopCapture UI
                        console.log("stopped event on stream");
                        var elem = document.getElementById('local-screensharing');
                        if (elem !== null) {
                            elem.remove();
                        }
                        screensharingStream = null;

                        let screen = document.getElementById('local-container-screen');
                        screen.remove();
                        Dish();
                    });

            screensharingStream = stream;
            connectedConversation.publish(screensharingStream);
                    // Get media container
                    var newcontainer = document.createElement('div');
                    var divappend = document.getElementById('conference');
                    newcontainer.id = "local-container-screen";
                    newcontainer.className = "Camera";

                    // var container = document.getElementById('local-container');
                    // alert('bisa sampe sini');

                    // Create media element
                    var mediaElement = document.createElement('video');
                    mediaElement.id = 'local-screensharing';
                    mediaElement.autoplay = true;
                    mediaElement.setAttribute('width', '100%');

                    // Add media element to media container
                    newcontainer.appendChild(mediaElement);
                    divappend.appendChild(newcontainer);
                    Dish();


                    alert('udh ke append');

                    // Attach stream
                    screensharingStream.attachToElement(mediaElement);
                    alert('udh attachhh');

                })
        .catch(function(err) {
            console.error('Could not create screensharing stream :', err);
        });
    } else {
        connectedConversation.unpublish(screensharingStream);
        screensharingStream.release();
        screensharingStream = null;
        var elem = document.getElementById('local-screensharing');
        if (elem !== null) {
            elem.remove();
        }
    }

}


function sendMessageToConversation(message) {
    if (message !== '') {
        $('#typing-area').val('');
        $('#message-list').append('<li><b>Me</b> : ' + message + '</li>');
        connectedConversation.sendMessage(message);
    }
}

function renderUserList() {
    let contacts = connectedConversation.getContacts();
    $('#active-users').empty();
    $('#active-users').append('<li><b>Active users</b></li>');
    let keys = Object.keys(contacts);
    $('#active-users').append('<li><b>Me:</b> ' + connectedSession.getId() + '</li>');
    for (let i = 0; i < keys.length; i++) {
        $('#active-users').append('<li>' + contacts[keys[i]].getId() + '</li>');
    }
}

function updateUIState(state) {
    console.log('Update UI state', state);
    switch (state) {
        case 'initial':
        document.querySelector('#chat').style.display = 'none';
        document.querySelector('#file-transfer').style.display = 'none';
        break;
        case 'conference':
        document.querySelector('#chat').style.display = 'block';
        document.querySelector('#file-transfer').style.display = 'block';
        break;
        default:
        break;
    }
}

$('#send-message').on('click', () => {
    sendMessageToConversation($('#typing-area').val().toString());
});

$('#typing-area').keypress((e) => {
    if (e.which == 13) {
        sendMessageToConversation($('#typing-area').val().toString());
        return false;
    }
});

$('#btnchat').click(function() {
  alert("toggle chat");
});
