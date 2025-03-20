
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit';
import { log } from 'console';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

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

const fonts = {
  "Helvetica": "Helvetica",               // Eingebaute Schriftart in PDFKit
  "Times New Roman": "Times-Roman",         // Eingebaute Schriftart
  "DejaVuSans": "./public/fonts/DejaVuSans.ttf",   // Externe Schriftartdatei
  "NotoSans-Regular": "./public/fonts/NotoSans-Regular.ttf",
  "Garamond": "./public/fonts/Garamond.ttf",
  "Futura": "./public/fonts/Futura.ttf",
  "Montserrat": "./public/fonts/Montserrat.ttf"
};

// Basisroute: Liefert die Startseite
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

  app.post('/generate-pdf', (req, res) => {
    // console.log(req.body);
    try {
      const inputText = cleanText(req.body.text);
      const headerText = cleanText(req.body.header || "PDF.TEXT - Ihr Dokument");
      const fontSize = parseInt(req.body.fontSize) || 12;
      const lineSpacing = parseInt(req.body.lineSpacing);
      const textAlignment = cleanText(req.body.textAlignment);
      const fontTyp = cleanText(req.body.fontTyp);

  
      if (!inputText) {
        return res.status(400).send("Der eingegebene Text darf nicht leer sein.");
      }
  
      
      const doc = new PDFDocument({ margin: 50 });
      res.setHeader('Content-Disposition', 'attachment; filename="download.pdf"');
      res.setHeader('Content-Type', 'application/pdf');
      doc.pipe(res);
  

      //  DEFAULT‑FONT setzen (dynamisch) 

      const selectedFont = fonts[fontTyp];

      if (selectedFont.endsWith('.ttf') || selectedFont.endsWith('.otf')) {
        // Externe Schrift: zuerst registrieren
        doc.registerFont(fontTyp, selectedFont);
        // Dann den registrierten Namen als Schriftart setzen:
        doc.font(fontTyp);
      } else {
        // Eingebaute Schrift: direkt setzen
        doc.font(selectedFont);
      }


      // Kopfzeile
      doc.fontSize(18)
         .text(headerText, { align: "center" })
         .moveDown();
  
      // Linie
      doc.moveTo(50, 80)
         .lineTo(doc.page.width - 50, 80)
         .stroke();
  
      // Haupttext
      doc.moveDown()
         .fontSize(fontSize)
         .text(inputText, { align: textAlignment, lineGap:lineSpacing, });
  
      // Fußzeile mit Seitenzahl
      const addFooter = (doc) => {
        doc.fontSize(10)
           .text("Seite " + doc.page.number, 50, doc.page.height - 50, {
             align: "center",
             width: doc.page.width - 100
           });
      };
      addFooter(doc);
      doc.on('pageAdded', () => addFooter(doc));
      doc.end();
  
    } catch (error) {
      console.error("Fehler bei der PDF-Erstellung:", error);
      res.status(500).send("Interner Serverfehler bei der PDF-Erstellung.");
    }
  });
  
  
  

  // Server starten (dynamisch)
  
  // const PORT = process.env.PORT || 8080;
  // app.listen(PORT, () => {
  //   console.log(`Server läuft auf Port ${PORT}`);
  // });

  app.listen(3000, () => {
    console,log(`Server läuft auf Port 3000`)
  })