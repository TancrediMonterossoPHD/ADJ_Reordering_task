const items = [
  ["the", "big", "old", "dog", "red"],
  ["the", "young", "small", "cat", "blue"],
  ["the", "good", "large", "book", "green"],
  ["the", "old", "bad", "glass", "clear"],
  ["the", "red", "rough", "plate", "small"],
  ["the", "slow", "old", "truck", "large"],
  ["the", "green", "young", "tree", "tall"],
  ["the", "small", "good", "watch", "blue"],
  ["the", "large", "red", "shoe", "old"],
  ["the", "bad", "small", "flower", "yellow"],
  ["the", "old", "rough", "table", "big"],
  ["the", "jacket", "blue", "small", "good"],
  ["the", "bicycle", "slow", "old", "red"],
  ["the", "pen", "green", "small", "good"],
  ["the", "pencil", "yellow", "large", "old"],
  ["the", "door", "red", "old", "rough"],
  ["the", "window", "blue", "small", "bad"],
  ["the", "shoe", "large", "old", "slow"],
  ["the", "truck", "red", "bad", "fast"],
  ["the", "book", "good", "old", "green"]
];

let indiceItem = 0;
let risultati = [];
let nomePartecipante = "";
let startTime = 0;

function showNameInput() {
  document.getElementById("intro-page").style.display = "none";
  document.getElementById("intro").style.display = "block";
}

function iniziaTest() {
  nomePartecipante = document.getElementById("nome").value.trim();
  if (!nomePartecipante) {
    alert("Name is required.");
    return;
  }
  document.getElementById("intro").style.display = "none";
  document.getElementById("test").style.display = "block";
  avviaItem();
}

function avviaItem() {
  if (indiceItem >= items.length) {
    mostraRiepilogo();
    return;
  }

  startTime = Date.now();
  aggiornaProgressBar();

  const elementi = shuffle([...items[indiceItem]]);

  document.getElementById("istruzioni").textContent =
    `Item ${indiceItem + 1}: Arrange the words to form the correct phrase.`;

  const container = document.getElementById("elementi");
  container.innerHTML = "";

  elementi.forEach(text => {
    const div = document.createElement("div");
    div.textContent = text;
    div.className = "draggable";
    container.appendChild(div);
  });

  Sortable.create(container, {
    animation: 150,
    ghostClass: "dragging"
  });
}

function confermaOrdine() {
  const container = document.getElementById("elementi");
  const ordineFinale = Array.from(container.children).map(el => el.textContent);
  const durata = (Date.now() - startTime) / 1000;
  risultati.push({
    item: indiceItem + 1,
    ordine: ordineFinale,
    tempo_secondi: durata
  });
  indiceItem++;
  avviaItem();
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function aggiornaProgressBar() {
  const progress = ((indiceItem) / items.length) * 100;
  document.getElementById("progress-bar").style.width = `${progress}%`;
}

function mostraRiepilogo() {
  document.getElementById("test").style.display = "none";
  document.getElementById("summary").style.display = "block";

  const totalTime = risultati.reduce((sum, r) => sum + r.tempo_secondi, 0);
  const avgTime = totalTime / risultati.length;

  document.getElementById("total-time").textContent = `Total time: ${totalTime.toFixed(1)} seconds`;
  document.getElementById("average-time").textContent = `Average time per item: ${avgTime.toFixed(1)} seconds`;
}

function scaricaRisultati() {
  const data = {
    nome: nomePartecipante,
    results: JSON.stringify(risultati, null, 2)
  };

  emailjs.send("service_10hsey6", "template_ptzd974", data)
    .then(() => {
      alert("✅ Results sent successfully!");
    }, (error) => {
      alert("❌ Failed to send results: " + JSON.stringify(error));
      // Fallback: download results as .txt
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `results_${nomePartecipante}.txt`;
      link.click();
    });
}