// dashboard.js

let chatStep = 0;
let userMood = '';
let userGenre = '';

// Toggle between sections
document.getElementById("preferencesBtn").addEventListener("click", () => {
    document.getElementById("preferenceSection").style.display = "block";
    document.getElementById("faceRecSection").style.display = "none";
});

document.getElementById("faceRecBtn").addEventListener("click", () => {
    document.getElementById("faceRecSection").style.display = "block";
    document.getElementById("preferenceSection").style.display = "none";
});

// Chatbot logic
function handleChatInput() {
    const chatbox = document.getElementById("chatbox");
    const userInput = document.getElementById("userInput").value.trim();

    // Display user input in the chat
    if (userInput) {
        chatbox.innerHTML += `<p><strong>You:</strong> ${userInput}</p>`;
        document.getElementById("userInput").value = '';

        // Chatbot responses based on chat step
        if (chatStep === 0) {
            userGenre = userInput;  // Store genre
            chatbox.innerHTML += `<p><strong>Chatbot:</strong> Great! How are you feeling today? (e.g., happy, sad, relaxed)</p>`;
            chatStep++;
        } else if (chatStep === 1) {
            userMood = userInput;  // Store mood
            chatbox.innerHTML += `<p><strong>Chatbot:</strong> Based on your mood (${userMood}) and genre preference (${userGenre}), here's a recommendation for you:</p>`;
            chatbox.innerHTML += `<p><strong>Recommended Song:</strong> "Perfect" by Ed Sheeran</p>`;
            chatStep++; // Increment to end
        } else if (chatStep === 2) {
            chatbox.innerHTML += `<p><strong>Chatbot:</strong> Conversation ended. Enjoy your music!</p>`;
        }
    } else {
        chatbox.innerHTML += `<p><strong>Chatbot:</strong> Please enter your response.</p>`;
    }
}

// Facial recognition setup
async function loadModels() {
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    await faceapi.nets.faceExpressionNet.loadFromUri('/models');
}

// Start camera and enable capture button
async function startCamera() {
    const video = document.getElementById("camera");
    video.style.display = "block";
    document.getElementById("capturePhoto").style.display = "block";

    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    video.srcObject = stream;
}

// Capture photo and analyze for facial expression
async function capturePhoto() {
    const video = document.getElementById("camera");
    const canvas = document.getElementById("canvas");
    const emotionResult = document.getElementById("emotionResult");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    // Hide the video and show canvas with captured image
    video.style.display = "none";
    canvas.style.display = "block";

    const detections = await faceapi.detectSingleFace(canvas, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();
    if (detections) {
        const emotions = detections.expressions;
        const mainEmotion = Object.keys(emotions).reduce((a, b) => emotions[a] > emotions[b] ? a : b);

        // Display emotion and recommend a song based on it
        emotionResult.innerText = `Detected emotion: ${mainEmotion}`;

        if (mainEmotion === 'R U happy') {
            emotionResult.innerText += "\nSuggested Song: 'Happy' - Pharrell Williams";
        } else if (mainEmotion === 'R U sad') {
            emotionResult.innerText += "\nSuggested Song: 'Someone Like You' - Adele";
        } else {
            emotionResult.innerText += "\nSuggested Song: 'Weightless' - Marconi Union";
        }
    } else {
        emotionResult.innerText = "No face detected. Please try again.";
    }
}

// Start the camera and load models
document.getElementById("startCamera").addEventListener("click", startCamera);
loadModels();
