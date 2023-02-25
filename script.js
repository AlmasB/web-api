var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var colors = [ 'aqua' , 'azure' , 'beige', 'bisque',  'fuchsia', 'ghostwhite', 'gold', 'goldenrod'];

const recognition = new SpeechRecognition();

//if (SpeechGrammarList) {
//    // SpeechGrammarList is not currently available in Safari, and does not have any effect in any other browser.
//    // This code is provided as a demonstration of possible capability. You may choose not to use it.
//    var speechRecognitionList = new SpeechGrammarList();
//    var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'
//    speechRecognitionList.addFromString(grammar, 1);
//    recognition.grammars = speechRecognitionList;
//}
recognition.continuous = true;
recognition.lang = 'en-GB';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

var diagnostic = document.querySelector('.output');
var bg = document.querySelector('html');
var hints = document.querySelector('.hints');
hints.innerHTML = 'Tap/click to start listening';






// Create WebSocket connection.
const socket = new WebSocket('ws://localhost:55555');

// Connection opened
socket.addEventListener('open', function (event) {
    console.log("Connection to server open!");
});

// Listen for messages
socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
});




document.body.onclick = function() {
    recognition.start();
    console.log('Ready to receive a color command.');
}

//setInterval(function () {
//    recognition.start();
//}, 2000);

recognition.onresult = (event) => {
    // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
    // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
    // It has a getter so it can be accessed like an array
    // The first [0] returns the SpeechRecognitionResult at the last position.
    // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
    // These also have getters so they can be accessed like arrays.
    // The second [0] returns the SpeechRecognitionAlternative at position 0.
    // We then return the transcript property of the SpeechRecognitionAlternative object
    var result = event.results[event.results.length - 1][0];
    var inputText = result.transcript;
    diagnostic.textContent = 'Result received: ' + inputText + '.';

    //socket.send(inputText);

    console.log('Confidence: ' + result.confidence);
}

recognition.onspeechend = function() {
    //recognition.stop();
}

recognition.onend = (event) => {
    recognition.start();
}

//recognition.onnomatch = function(event) {
//    diagnostic.textContent = "I didn't recognise that color.";
//}

recognition.onerror = function(event) {
    diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
    recognition.start();
}

recognition.start();