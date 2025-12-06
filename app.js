let model; 
const URL = "https://teachablemachine.withgoogle.com/models/OeC5YGU3N/";

async function loadModel() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    console.log("Model loaded!");
}

async function predict(imageElement) {
    const predictions = await model.predict(imageElement);
    
    let resultText = "";
    predictions.forEach(p => {
        resultText += `${p.className}: ${(p.probability * 100).toFixed(2)}%<br>`;
    });

    document.getElementById("result").innerHTML = resultText;
}

document.getElementById("file-input").addEventListener("change", event => {
    const file = event.target.files[0];
    if (!file) return;

    const img = document.getElementById("preview");
    img.src = URL.createObjectURL(file);
    img.style.display = "block";

    img.onload = () => {
        predict(img);
    };
});

// Загружаем модель при старте
loadModel();
