// --- ITEMS PER LINGUA ---

const englishItems = [
  ["the", "red", "big", "old", "dog"],
  ["the", "young", "small", "blue", "cat"],
  ["the", "good", "big", "green", "book"],
  ["the", "old", "bad", "transparent", "glass"],
  ["the", "red", "rough", "small", "plate"],
  ["the", "slow", "old", "big", "truck"],
  ["the", "green", "young", "tall", "tree"],
  ["the", "small", "good", "blue", "watch"],
  ["the", "big", "red", "old", "shoe"],
  ["the", "bad", "small", "yellow", "flower"],
  ["the", "old", "rough", "big", "table"],
  ["the", "good", "small", "blue", "jacket"],
  ["the", "slow", "old", "red", "bicycle"],
  ["the", "good", "small", "green", "pen"],
  ["the", "old", "big", "yellow", "pencil"],
  ["the", "old", "red", "rough", "door"],
  ["the", "bad", "small", "blue", "window"],
  ["the", "slow", "big", "old", "shoe"],
  ["the", "fast", "bad", "red", "truck"],
  ["the", "good", "old", "green", "book"]
];

const italianItems = [
  ["il", "nero", "grande", "cane", "vecchio"],
  ["il", "giovane", "piccolo", "gatto", "marrone"],
  ["il", "noioso", "grande", "libro", "verde"],
  ["il", "vecchio", "brutto", "bicchiere", "trasparente"],
  ["il", "bianco", "ruvido", "piatto", "piccolo"],
  ["il", "lento", "vecchio", "camion", "grande"],
  ["il", "verde", "giovane", "albero", "alto"],
  ["il", "piccolo", "brutto", "anatroccolo", "grigio"],
  ["la", "grande", "rossa", "scarpa", "vecchio"],
  ["il", "carino", "piccolo", "fiore", "giallo"],
  ["il", "vecchio", "ruvido", "tavolo", "grande"],
  ["la", "giacca", "blu", "corta", "buona"],
  ["la", "bicicletta", "lenta", "vecchia", "rossa"],
  ["la", "penna", "verde", "piccola", "eccellente"],
  ["la", "matita", "gialla", "grossa", "nuova"],
  ["la", "porta", "rossa", "antica", "ruvida"],
  ["la", "finestra", "verde", "piccola", "brutta"],
  ["la", "macchina", "grande", "vecchia", "lenta"],
  ["la", "macchina", "rossa", "ottima", "lento"],
  ["il", "libro", "eccellente", "vecchio", "verde"]
];

let items = englishItems;
let currentLanguage = "en";

let indiceItem = 0;
let risultati = [];
let nomePartecipante = "";
let startTime = 0;

// --- SCELTA LINGUA ---

function setLanguage(lang) {
  currentLanguage = lang;
  items = lang === "it" ? italianItems : englishItems;

  // elementi che potremmo aggiornare (alcuni non esistono ancora alla prima schermata)
  const introText = document.getElementById("intro-text");
  const nameLabel = document.getElementById("name-label");
  const beginButton = document.getElementById("begin-button");
  const confirmButton = document.getElementById("confirm-button");
  const sendResultsButton = document.getElementById("send-results");
  const summaryTitle = document.getElementById("summary-title");

  if (lang === "it") {
    if (introText) {
      introText.textContent =
        "In questo esperimento ti verranno presentati 20 insiemi di parole che formano dei sintagmi nominali. " +
        "Il tuo compito è di disporre le parole nell'ordine che ti sembra più naturale trascinandole. " +
        "Quando pensi che l’ordine sia corretto, clicca su \"Conferma ordine\" per passare all’item successivo. " +
        "Grazie per la partecipazione!";
    }
    if (nameLabel) nameLabel.textContent = "Inserisci il tuo nome:";
    if (beginButton) beginButton.textContent = "Inizia il test";
    if (confirmButton) confirmButton.textContent = "Conferma ordine";
    if (sendResultsButton) sendResultsButton.textContent = "Invia risultati via email";
    if (summaryTitle) summaryTitle.textContent = "Riepilogo del test";
  } else {
    if (introText) {
      introText.textContent =
        "In this experiment, you will be presented with 20 sets of words that form noun phrases. " +
        "Your task is to arrange the words in the order that feels most natural to you by dragging them into place. " +
        "When you think the order is correct, click \"Confirm Order\" to move to the next item. " +
        "Thank you for your participation!";
    }
    if (nameLabel) nameLabel.textContent = "Enter your name:";
    if (beginButton) beginButton.textContent = "Begin Test";
    if (confirmButton) confirmButton.textContent = "Confirm Order";
    if (sendResultsButton) sendResultsButton.textContent = "Send Results via Email";
    if (summaryTitle) summaryTitle.textContent = "Test Summary";
  }

  // reset stato
  indiceItem = 0;
  risultati = [];
  const nomeInput = document.getElementById("nome");
  if (nomeInput) nomeInput.value = "";

  showNameInput();
}

// --- TRANSIZIONE SCHERMATE ---

function showNameInput() {
  const langPage = document.getElementById("language-page");
  const introDiv = document.getElementById("intro");
  if (langPage) langPage.style.display = "none";
  if (introDiv) introDiv.style.display = "block";
}

function iniziaTest() {
  const nomeInput = document.getElementById("nome");
  nomePartecipante = nomeInput ? nomeInput.value.trim() : "";

  if (!nomePartecipante) {
    alert(currentLanguage === "it" ? "Il nome è obbligatorio." : "Name is required.");
    return;
  }

  const introDiv = document.getElementById("intro");
  const testDiv = document.getElementById("test");
  if (introDiv) introDiv.style.display = "none";
  if (testDiv) testDiv.style.display = "block";

  indiceItem = 0;
  risultati = [];
  avviaItem();
}

// --- LOGICA DEL TEST ---

function avviaItem() {
  if (indiceItem >= items.length) {
    mostraRiepilogo();
    return;
  }

  startTime = Date.now();
  aggiornaProgressBar();

  const elementi = shuffle([...items[indiceItem]]);

  const istruzioni = document.getElementById("istruzioni");
  if (istruzioni) {
    istruzioni.textContent =
      currentLanguage === "it"
        ? `Item ${indiceItem + 1}: Disponi le parole per formare la frase più naturale.`
        : `Item ${indiceItem + 1}: Arrange the words to form the most natural phrase.`;
  }

  const container = document.getElementById("elementi");
  if (!container) return;

  container.innerHTML = "";

  elementi.forEach(text => {
    const div = document.createElement("div");
    div.textContent = text;
    div.className = "draggable";
    container.appendChild(div);
  });

  // abilitare drag & drop
  Sortable.create(container, {
    animation: 150,
    ghostClass: "dragging"
  });
}

function confermaOrdine() {
  const container = document.getElementById("elementi");
  if (!container) return;

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
  const progressBar = document.getElementById("progress-bar");
  if (!progressBar) return;
  const progress = (indiceItem / items.length) * 100;
  progressBar.style.width = `${progress}%`;
}

function mostraRiepilogo() {
  const testDiv = document.getElementById("test");
  const summaryDiv = document.getElementById("summary");
  if (testDiv) testDiv.style.display = "none";
  if (summaryDiv) summaryDiv.style.display = "block";

  const totalTime = risultati.reduce((sum, r) => sum + r.tempo_secondi, 0);
  const avgTime = risultati.length > 0 ? totalTime / risultati.length : 0;

  const totalTimeText =
    currentLanguage === "it"
      ? `Tempo totale: ${totalTime.toFixed(1)} secondi`
      : `Total time: ${totalTime.toFixed(1)} seconds`;

  const avgTimeText =
    currentLanguage === "it"
      ? `Tempo medio per item: ${avgTime.toFixed(1)} secondi`
      : `Average time per item: ${avgTime.toFixed(1)} seconds`;

  const totalTimeEl = document.getElementById("total-time");
  const avgTimeEl = document.getElementById("average-time");
  if (totalTimeEl) totalTimeEl.textContent = totalTimeText;
  if (avgTimeEl) avgTimeEl.textContent = avgTimeText;
}

// --- INVIO RISULTATI: allegato JSON via EmailJS + fallback download ---

function scaricaRisultati() {
  const data = {
    nome: nomePartecipante,
    lingua: currentLanguage,
    risultati: risultati
  };

  const jsonString = JSON.stringify(data, null, 2);

  const params = {
    nome: nomePartecipante,
    lingua: currentLanguage,
    json: jsonString   // <-- questo è ciò che appare nel template come {{json}}
  };

  emailjs.send("service_10hsey6", "template_ptzd974", params)
    .then(() => {
      alert(
        currentLanguage === "it"
          ? "✅ Risultati inviati!"
          : "✅ Results sent!"
      );
    })
    .catch((err) => {
      console.error("EmailJS error:", err);
      alert(
        currentLanguage === "it"
          ? "❌ Errore invio email"
          : "❌ Email sending error"
      );
    });
}



