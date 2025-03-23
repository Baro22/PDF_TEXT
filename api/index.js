import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Parser-Middleware für JSON und URL-codierte Formulardaten
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Statische Dateien aus dem "public"-Verzeichnis bereitstellen
app.use(express.static(path.join(__dirname,'..','public')));

// Hilfsfunktion zur Bereinigung von Texteingaben
function cleanText(str = '') {
  return str
    .normalize('NFC')
    .replace(/^\uFEFF/, '')
    .replace(/[\u200B-\u200D]/g, '')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, '-')
    .replace(/<[^>]+>/g, '')
    .trim();
}

// Verfügbare Schriftarten (eingebaut und externe .ttf/.otf im "public/fonts"-Verzeichnis)
const fonts = {
  "Helvetica": "Helvetica",                        // Eingebaute Schriftart in PDFKit
  "Times New Roman": "Times-Roman",                // Eingebaute Schriftart
  "DejaVuSans": path.join(__dirname, '..', 'public', 'fonts', 'DejaVuSans.ttf'),        // Externe Schriftartdatei
  "NotoSans-Regular": path.join(__dirname, '..', 'public', 'fonts', 'NotoSans-Regular.ttf'),
  "Garamond": path.join(__dirname, '..', 'public', 'fonts', 'Garamond.ttf'),
  "Futura": path.join(__dirname, '..', 'public', 'fonts', 'Futura.ttf'),
  "Montserrat": path.join(__dirname, '..', 'public', 'fonts', 'Montserrat.ttf')
};

// Basisroute: Liefert die Startseite
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// PDF-Generierung über das Formular
app.post('/generate-pdf', (req, res) => {
  try {
    const inputText = cleanText(req.body.text);
    const headerText = cleanText(req.body.header || "PDF.TEXT - Ihr Dokument");
    const fontSize = parseInt(req.body.fontSize) || 12;
    const lineSpacing = parseInt(req.body.lineSpacing) || 0;
    const textAlignment = cleanText(req.body.textAlignment);
    const fontTyp = cleanText(req.body.fontTyp);

    if (!inputText) {
      // Fehlermeldung bei leerem Texteingabefeld
      return res.status(400).send("Der eingegebene Text darf nicht leer sein.");
    }

    // Neues PDF-Dokument erstellen
    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Disposition', 'attachment; filename="download.pdf"');
    res.setHeader('Content-Type', 'application/pdf');
    doc.pipe(res);

    // Dynamisch die ausgewählte Schriftart setzen
    const selectedFont = fonts[fontTyp] || fonts["Helvetica"];
    if (selectedFont.endsWith('.ttf') || selectedFont.endsWith('.otf')) {
      // Externe Schriftart: zuerst registrieren und dann verwenden
      doc.registerFont(fontTyp, selectedFont);
      doc.font(fontTyp);
    } else {
      // Eingebaute PDFKit-Schriftart direkt setzen
      doc.font(selectedFont);
    }

    // Kopfzeile einfügen
    doc.fontSize(18)
       .text(headerText, { align: "center" })
       .moveDown();

    // Trennlinie unter der Kopfzeile
    doc.moveTo(50, 80)
       .lineTo(doc.page.width - 50, 80)
       .stroke();

    // Haupttext einfügen
    doc.moveDown()
       .fontSize(fontSize)
       .text(inputText, { align: textAlignment, lineGap: lineSpacing });

    // // Manuelle Seitenzählung für die Fußzeile
    // let pageNumber = 1;
    // const addFooter = (pdfDoc) => {
    //   pdfDoc.fontSize(10)
    //     .text(pageNumber, 50, pdfDoc.page.height - 50, {
    //       align: "center",
    //       width: pdfDoc.page.width - 100
    //     });
    //   pageNumber++;
    // };
    // addFooter(doc);
    // doc.on('pageAdded', () => addFooter(doc));

    // PDF-Dokument abschließen
    doc.end();

  } catch (error) {
    console.error("Fehler bei der PDF-Erstellung:", error);
    res.status(500).send("Interner Serverfehler bei der PDF-Erstellung.");
  }
});

// Server starten
// app.listen(3000, () => {
//   console.log("Server läuft auf Port 3000");
// });
