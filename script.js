var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

// set up web socket
const socket = new WebSocket('ws://localhost:55555');

socket.addEventListener('open', function (event) {
    console.log("Connection to server open!");
});

socket.addEventListener('message', function (event) {
    console.log("Message from server ", event.data);
});


// set up speech recog
const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.lang = 'en-GB';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

recognition.onresult = (event) => {
    // latest result
    var result = event.results[event.results.length - 1][0];
    var inputText = result.transcript;
    console.log("Result received: " + inputText);
    console.log("Confidence: " + result.confidence);

    socket.send(inputText);

    console.log("Sent to socket: " + inputText);
}

recognition.onspeechend = function() {
    //recognition.stop();
}

recognition.onend = (event) => {
    recognition.start();
}

recognition.onerror = function(event) {
    console.log("Error occurred in recognition: " + event.error);
    recognition.start();
}

recognition.start();