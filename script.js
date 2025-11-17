
const items = [
  ["il", "rosso", "grande", "cane", "vecchio"],
  ["il", "giovane", "piccolo", "gatto", "blu"],
  ["il", "buono", "grande", "libro", "verde"],
  ["il", "vecchio", "cattivo", "bicchiere", "trasparente"],
  ["il", "rosso", "ruvido", "piatto", "piccolo"],
  ["il", "lento", "vecchio", "camion", "grande"],
  ["il", "verde", "giovane", "albero", "alto"],
  ["il", "piccolo", "buono", "orologio", "blu"],
  ["il", "grande", "rosso", "scarpa", "vecchio"],
  ["il", "cattivo", "piccolo", "fiore", "giallo"],
  ["il", "vecchio", "ruvido", "tavolo", "grande"],
  ["il", "giacca", "blu", "piccolo", "buono"],
  ["il", "bicicletta", "lenta", "vecchia", "rossa"],
  ["il", "penna", "verde", "piccola", "buona"],
  ["il", "matita", "gialla", "grande", "vecchia"],
  ["il", "porta", "rossa", "vecchia", "ruvida"],
  ["il", "finestra", "blu", "piccola", "cattiva"],
  ["il", "scarpa", "grande", "vecchia", "lenta"],
  ["il", "camion", "rosso", "cattivo", "veloce"],
  ["il", "libro", "buono", "vecchio", "verde"]
];

let indiceItem = 0;
let risultati = [];
let nomePartecipante = "";
let startTime = 0;
let timerInterval;

function iniziaTest() {
  nomePartecipante = document.getElementById("nome").value.trim();
  if (!nomePartecipante) {
    alert("Nome obbligatorio.");
    return;
  }
  document.getElementById("intro").style.display = "none";
  document.getElementById("test").style.display = "block";
  avviaItem();
}

function avviaItem() {
  if (indiceItem >= items.length) {
    clearInterval(timerInterval);
    mostraRiepilogo();
    return;
  }


  aggiornaProgressBar();

  const elementi = shuffle([...items[indiceItem]]);

  document.getElementById("istruzioni").textContent =
    `Item ${indiceItem + 1}: Ordina le parole per formare il sintagma corretto.`;

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

  document.getElementById("total-time").textContent = `Tempo totale: ${totalTime.toFixed(1)} secondi`;
  document.getElementById("average-time").textContent = `Tempo medio per item: ${avgTime.toFixed(1)} secondi`;
}

function scaricaRisultati() {
  const blob = new Blob([JSON.stringify(risultati, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${nomePartecipante}_risultati.json`;
  link.click();
}
