// Darkmode- und Sprach-Umschaltung
let darkmode = localStorage.getItem("darkmode");
const themeSwitch = document.getElementById("theme-switch");
const langSwitch = document.getElementById("lang-switch");

const enableDarkmode = () => {
  document.body.classList.add("darkmode");
  localStorage.setItem("darkmode", "active");
};
const disableDarkmode = () => {
  document.body.classList.remove("darkmode");
  localStorage.setItem("darkmode", "null");
};

// Beim Laden der Seite: Darkmode-Einstellung anwenden, falls aktiv
if (darkmode === "active") {
  enableDarkmode();
}

// Klick-Event für Darkmode-Schalter
themeSwitch.addEventListener("click", () => {
  darkmode = localStorage.getItem("darkmode");
  if (darkmode !== "active") {
    enableDarkmode();
  } else {
    disableDarkmode();
  }
});

// Sprachübersetzungen für Deutsch und Englisch
const translations = {
  de: {
    formTitle: "PDF gestalten",
    previewTitle: "Live-Vorschau",
    textLabel: "Textinhalt:",
    textPlaceholder: "Gib hier deinen Text ein...",
    headerLabel: "Überschrift:",
    headerPlaceholder: "Deine Überschrift",
    fontSizeLabel: "Schriftgröße:",
    lineSpacingLabel: "Zeilenabstand:",
    fontTypeLabel: "Schriftart:",
    alignmentLabel: "Textausrichtung:",
    alignments: { left: "links", right: "rechts", center: "mitte" },
    submitButton: "PDF erstellen",
    defaultHeader: "PDF.TEXT - Ihr Dokument",
    charCountLabel: "Zeichen",
    wordCountLabel: "Wörter",
    readingTimeLabel: "Geschätzte Lesezeit",
    generating: "PDF wird erstellt...",
    success: "PDF erfolgreich erstellt.",
    errorTextEmpty: "Der eingegebene Text darf nicht leer sein.",
    errorServer: "Interner Serverfehler bei der PDF-Erstellung."
  },
  en: {
    formTitle: "Design PDF",
    previewTitle: "Live Preview",
    textLabel: "Text content:",
    textPlaceholder: "Enter your text here...",
    headerLabel: "Header:",
    headerPlaceholder: "Your header",
    fontSizeLabel: "Font size:",
    lineSpacingLabel: "Line spacing:",
    fontTypeLabel: "Font:",
    alignmentLabel: "Alignment:",
    alignments: { left: "left", right: "right", center: "center" },
    submitButton: "Create PDF",
    defaultHeader: "PDF.TEXT - Your Document",
    charCountLabel: "Characters",
    wordCountLabel: "Words",
    readingTimeLabel: "Estimated reading time",
    generating: "Generating PDF...",
    success: "PDF successfully generated.",
    errorTextEmpty: "The text must not be empty.",
    errorServer: "Internal server error during PDF generation."
  }
};

// Aktuelle Sprache aus LocalStorage (Standard: de)
let currentLang = localStorage.getItem("lang") || "de";

// Funktion, um alle Textinhalte an die gewählte Sprache anzupassen
function applyTranslations(lang) {
  document.querySelector(".form-card h2").textContent = translations[lang].formTitle;
  document.getElementById("preview-title").textContent = translations[lang].previewTitle;
  document.querySelector('label[for="text"]').textContent = translations[lang].textLabel;
  document.getElementById("text").placeholder = translations[lang].textPlaceholder;
  document.querySelector('label[for="header"]').textContent = translations[lang].headerLabel;
  document.getElementById("header").placeholder = translations[lang].headerPlaceholder;
  document.querySelector('label[for="fontSize"]').textContent = translations[lang].fontSizeLabel;
  document.querySelector('label[for="lineSpacing"]').textContent = translations[lang].lineSpacingLabel;
  document.querySelector('label[for="font-typ"]').textContent = translations[lang].fontTypeLabel;
  document.querySelector('label[for="text-alignment"]').textContent = translations[lang].alignmentLabel;
  const alignOptions = document.getElementById("text-alignment").options;
  alignOptions[0].textContent = translations[lang].alignments.left;
  alignOptions[1].textContent = translations[lang].alignments.right;
  alignOptions[2].textContent = translations[lang].alignments.center;
  document.querySelector(".main-btn").textContent = translations[lang].submitButton;
  // Button-Text des Sprachumschalters anpassen (zeigt immer die Gegensprache an)
  langSwitch.textContent = lang === "de" ? "EN" : "DE";
}

// Initiale Anwendung der Übersetzungen
applyTranslations(currentLang);

// Klick-Event für Sprachumschalter (wechseln zwischen DE und EN)
langSwitch.addEventListener("click", () => {
  currentLang = currentLang === "de" ? "en" : "de";
  localStorage.setItem("lang", currentLang);
  applyTranslations(currentLang);
  updateAnalysis();  // Nach Sprachwechsel auch die Textanalyse aktualisieren
});

// Referenzen auf Formularelemente und Anzeigebereiche
const textArea = document.getElementById("text");
const headerInput = document.getElementById("header");
const fontSizeInput = document.getElementById("fontSize");
const lineSpacingInput = document.getElementById("lineSpacing");
const fontSelect = document.getElementById("font-typ");
const alignSelect = document.getElementById("text-alignment");
const previewContent = document.getElementById("preview-content");
const analysisEl = document.getElementById("analysis");
const messageEl = document.getElementById("message");
const form = document.querySelector("form");

// Aktualisiert die Live-Vorschau anhand der aktuellen Eingaben
function updatePreview() {
  const text = textArea.value;
  const headerText = headerInput.value.trim() || translations[currentLang].defaultHeader;
  const fontSize = parseInt(fontSizeInput.value) || 12;
  const lineSpacing = parseInt(lineSpacingInput.value) || 0;
  const alignment = alignSelect.value;
  const fontName = fontSelect.value;

  // Vorherigen Inhalt löschen
  previewContent.innerHTML = "";

  // Überschrift in der Vorschau erstellen
  const headerEl = document.createElement("h2");
  headerEl.textContent = headerText;
  headerEl.style.textAlign = "center";
  headerEl.style.fontSize = "18px";
  headerEl.style.marginBottom = "0.5rem";
  previewContent.appendChild(headerEl);

  // Trennlinie (horizontale Linie) einfügen
  const hr = document.createElement("hr");
  previewContent.appendChild(hr);

  // Textinhalt einfügen
  const textEl = document.createElement("div");
  textEl.textContent = text;
  textEl.style.whiteSpace = "pre-wrap";
  textEl.style.textAlign = alignment;
  textEl.style.fontSize = fontSize + "px";
  textEl.style.lineHeight = (fontSize + lineSpacing) + "px";

  // Schriftart in der Vorschau entsprechend Auswahl setzen (Fallback-Fonts im Browser)
  switch (fontName) {
    case "Helvetica":
      textEl.style.fontFamily = 'Helvetica, Arial, sans-serif';
      break;
    case "Times New Roman":
      textEl.style.fontFamily = '"Times New Roman", Times, serif';
      break;
    case "Garamond":
      textEl.style.fontFamily = 'Garamond, serif';
      break;
    case "Futura":
      textEl.style.fontFamily = 'Futura, sans-serif';
      break;
    case "Montserrat":
      textEl.style.fontFamily = 'Montserrat, sans-serif';
      break;
    case "DejaVuSans":
      textEl.style.fontFamily = '"DejaVu Sans", sans-serif';
      break;
    case "NotoSans-Regular":
      textEl.style.fontFamily = '"Noto Sans", sans-serif';
      break;
    default:
      textEl.style.fontFamily = 'sans-serif';
  }

  previewContent.appendChild(textEl);
}

// Aktualisiert die Textanalyse (Zeichenanzahl, Wortanzahl, Lesezeit)
function updateAnalysis() {
  const text = textArea.value;
  const chars = text.length;
  const words = text.trim().split(/\s+/).filter(word => word).length;
  let minutes = Math.ceil(words / 200);
  let readingTimeText = minutes + " min";
  if (words > 0 && minutes < 1) {
    readingTimeText = "<1 min";
  }
  if (words === 0) {
    minutes = 0;
    readingTimeText = "0 min";
  }
  analysisEl.textContent =
    `${translations[currentLang].charCountLabel}: ${chars} | ` +
    `${translations[currentLang].wordCountLabel}: ${words} | ` +
    `${translations[currentLang].readingTimeLabel}: ${readingTimeText}`;
}

// Event-Listener für Eingabefelder, um Vorschau und Analyse live zu aktualisieren
textArea.addEventListener("input", () => {
  updatePreview();
  updateAnalysis();
});
headerInput.addEventListener("input", updatePreview);
fontSizeInput.addEventListener("input", updatePreview);
lineSpacingInput.addEventListener("input", updatePreview);
fontSelect.addEventListener("change", updatePreview);
alignSelect.addEventListener("change", updatePreview);

// Event-Listener für Formular-Absendung (Validierung und Statusmeldung)
form.addEventListener("submit", (e) => {
  // Wenn das Textfeld leer (nur Weißzeichen) ist -> nicht absenden, Fehler anzeigen
  if (textArea.value.trim() === "") {
    e.preventDefault();
    messageEl.textContent = translations[currentLang].errorTextEmpty;
    messageEl.classList.remove("success");
    messageEl.classList.add("error");
  } 
  //   else {
  // //   // Status "PDF wird erstellt..." anzeigen
  // //   messageEl.textContent = translations[currentLang].generating;
  // //   messageEl.classList.remove("error");
  // //   messageEl.classList.remove("success");
  // //   // Optional: Spinner-Symbol anzeigen
  // //   // const spinner = document.createElement("span");
  // //   // spinner.className = "spinner";
  // //   // messageEl.appendChild(spinner);
  // //   // // (Die PDF-Ausgabe wird im selben Tab als Download ausgeführt,
  // //   // // die Seite bleibt dabei erhalten.)
  // // }
});

// Initiale Anzeige aktualisieren
updatePreview();
updateAnalysis();
