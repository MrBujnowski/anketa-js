const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // pro statické soubory (CSS, JS)
app.set("view engine", "ejs"); // nastavení EJS jako šablonovacího nástroje

/* Routa pro zobrazení úvodní stránky */
app.get("/", (req, res) => {
  // Zde, na úvodní stránce, budeme zobrazovat formulář pro vyplnění ankety
  res.render("index", { title: "Webová anketa" }); // index.ejs je soubor šablony
});

/* Routa pro zpracování dat z formuláře */
app.post("/submit", (req, res) => {
  const newResponse = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    answers: {
      question1: req.body.question1,
      question2: req.body.question2,
      question3: req.body.question3,
      question4: req.body.question4,
      question5: req.body.question5,
      question6: req.body.question5
    }
  };

  fs.readFile("responses.json", (err, data) => {
    if (err) throw err;
    let json = JSON.parse(data);
    json.push(newResponse);

    fs.writeFile("responses.json", JSON.stringify(json, null, 2), (err) => {
      if (err) throw err;
      console.log("Data byla úspěšně uložena.");
      res.redirect("/results");
    });
  });
});

/* Routa pro zobrazení výsledků ankety */
app.get("/results", (req, res) => {
  // Zde bude načtení dat ze souboru responses.json a jejich předání do šablony
  fs.readFile('responses.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Nastala chyba při čtení dat.');
    }
    const responses = JSON.parse(data);
    res.render('results', { title: "Výsledky ankety", responses }); // Předání dat-odpovědí šabloně results.ejs
  });
});

app.listen(PORT, () => {
  console.log(`Server běží na portu ${PORT}`);
});
