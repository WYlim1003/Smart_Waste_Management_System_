// let model, webcam, maxPredictions;

// async function start() {
//     const URL = "teachable_machine/"; // folder where model.json, metadata.json, and weights.bin are
//     const modelURL = URL + "model.json";
//     const metadataURL = URL + "metadata.json";

//     // Load the model and metadata
//     model = await tmImage.load(modelURL, metadataURL);
//     maxPredictions = model.getTotalClasses();

//     // Setup webcam
//     const flip = true; // flip webcam if needed
//     webcam = new tmImage.Webcam(224, 224, flip); 
//     await webcam.setup(); 
//     await webcam.play();
//     window.requestAnimationFrame(loop);

//     // Attach webcam to DOM
//     document.getElementById("webcam-container").appendChild(webcam.canvas);
// }

// async function loop() {
//     webcam.update();
//     await predict();
//     window.requestAnimationFrame(loop);
// }

// async function predict() {
//     const prediction = await model.predict(webcam.canvas);
//     const classLabels = ['Paper', 'Plastic', 'Cans']; // Edit if your model has different classes

//     // Find top prediction
//     const top = prediction.reduce((best, current) => current.probability > best.probability ? current : best);

//     document.getElementById('predictionResult').textContent = `Prediction: ${top.className}`;
//     updateBinCategory(top.className);
// }

// function updateBinCategory(category) {
//     console.log(`Object categorized as: ${category}`);
// }

// window.onload = start;

let model, webcam, labelContainer, maxPredictions;
let currentPrediction = "";

// Load the model
async function init() {
  const URL = "teachable_machine/";
  model = await tmImage.load(URL + "model.json", URL + "metadata.json");
  maxPredictions = model.getTotalClasses();

  // Setup webcam
  const flip = true;
  webcam = new tmImage.Webcam(200, 200, flip);
  await webcam.setup();
  await webcam.play();
  window.requestAnimationFrame(loop);

  document.getElementById("webcam-container").appendChild(webcam.canvas);
}

// Prediction loop
async function loop() {
  webcam.update();
  await predict();
  window.requestAnimationFrame(loop);
}

// Predict waste category
async function predict() {
  const prediction = await model.predict(webcam.canvas);
  let highest = prediction[0];

  for (let i = 1; i < prediction.length; i++) {
    if (prediction[i].probability > highest.probability) {
      highest = prediction[i];
    }
  }

  currentPrediction = highest.className;
  document.getElementById("predictionResult").innerText = `Prediction: ${currentPrediction}`;
}

// Bin clicking logic
document.addEventListener("DOMContentLoaded", () => {
  init();

  document.getElementById("canBin").addEventListener("click", () => {
    if (currentPrediction === "Cans") {
        const itemName = prompt("You are adding a can item. Please name it:");
        if (itemName) {
            saveToHistory("Cans", itemName);
            alert("✅ Cans waste added!");
        }
    } else {
      alert("❌ Only cans can go in here!");
    }
  });

  document.getElementById("plasticBin").addEventListener("click", () => {
    if (currentPrediction === "Plastic") {
        const itemName = prompt("You are adding a plastic item. Please name it:");
    if (itemName) {
        saveToHistory("Plastic", itemName);
        alert("✅ Plastic item added!");
    }
    } else {
      alert("❌ Only plastic can go in here!");
    }
  });

  document.getElementById("paperBin").addEventListener("click", () => {
    if (currentPrediction === "Paper") {
        const itemName = prompt("You are adding a paper item. Please name it:");
        if (itemName) {
            saveToHistory("Paper", itemName);
            alert("✅ Paper item added!");
        }
    } else {
      alert("❌ Only paper can go in here!");
    }
  });
});

function saveToHistory(category, itemName) {
    const history = JSON.parse(localStorage.getItem("wasteHistory")) || [];
    const timestamp = new Date().toLocaleString();
  
    history.push({ category: category, name: itemName, time: timestamp });
    localStorage.setItem("wasteHistory", JSON.stringify(history));
    
}



  

