const http = require("http");
const url = require("url");
const querystring = require("querystring");
let artikli = [
  {
    id: 1,
    naziv: "Artikal1",
    cena: "100",
    imeKompanije: "Kompanija1",
  },
  {
    id: 2,
    naziv: "Artikal2",
    cena: "100",
    imeKompanije: "Kompanija1",
  },
  {
    id: 3,
    naziv: "Artikal3",
    cena: "400",
    imeKompanije: "Kompanija3",
  },
  {
    id: 4,
    naziv: "Artikal4",
    cena: "200",
    imeKompanije: "Kompanija2",
  },
];

http
  .createServer(function (req, res) {
    let urlObj = url.parse(req.url, true, false);
    if (req.method == "GET") {
      if (urlObj.pathname == "/svi-artikli") {
        response = sviArtikli(urlObj.query.kompanija);
        res.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Svi Artikli</title>
                    <style>
                        table, th, td {
                            border: 1px solid black;
                        }
                        th,td {
                            padding: 5px 12px;
                        }
                    </style>
                </head>
                <body>
                    <h3>Artikli:</h3>
                    <a href="/dodaj-artikal">Dodaj Artikal</a>
                    <br>
                    <br>
                    <div id="prikaz">
                        <table>
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Naziv</th>
                                    <th>Cena</th>
                                    <th>Ime Kompanije</th>
                                    <th>Izmena</th>
                                    <th>Brisanje</th>
                                </tr>
                            </thead>               
                            <tbody>
            `);
        for (let o of response) {
          res.write(`
                    <tr>
                        <td>${o.id}</td>
                        <td>${o.naziv}</td>
                        <td>${o.cena}</td>
                        <td>${o.imeKompanije}</td>
                        <td><a href='/izmeni-artikal?id=${o.id}'>Izmeni Artikal</a></td>
                        <td>
                            <form action='/obrisi-artikal' method='POST'>
                                <input type='hidden' name='id' value='${o.id}'>
                                <button type='submit'>Brisanje Artikla</button>
                            </form>
                        </td>
                    </tr>
                `);
        }
        res.end(`
                            </tbody>
                        </table>
                    </body>
                </html>
            `);
      }
      if (urlObj.pathname == "/izmeni-artikal") {
        let artikal = artikli.find((x) => x.id == urlObj.query.id);
        res.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Izmeni Artikal</title>
                </head>
                <body>
                    <h3>Postavi Adresu</h3>
                    <a href="/svi-artikli">Svi Artikli</a>
                    <br><br>
                    <form action='/izmeni-artikal' method='POST'>
                        ID: <input type='number' name='id' value='${artikal.id}' readonly><br><br>
                        NAZIV: <input type='text' name='naziv' value='${artikal.naziv}'><br><br>
                        CENA: <input type='text' name='cena' value='${artikal.cena}'><br><br>
                        IME KOMPANIJE: <input type='text' name='imeKompanije' value='${artikal.imeKompanije}'><br><br>
                        <button type='submit'>IZMENI ARTIKAL</button>
                    </form>
                </body>
                </html>
            `);

        res.end();
      }
      if (urlObj.pathname == "/dodaj-artikal") {
        res.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Dodaj Artikal</title>
                </head>
                <body>
                    <h3>Dodaj Artikal</h3>
                    <a href="/svi-artikli">Svi Artikli</a>
                    <br><br>
                    <form action='/dodaj-artikal' method='POST'>
                        ID: <input type='number' name='id'><br><br>
                        NAZIV: <input type='text' name='naziv'><br><br>
                        CENA: <input type='text' name='cena'><br><br>
                        IME KOMPANIJE: <input type='text' name='imeKompanije'><br><br>
                        <button type='submit'>DODAJ ARTIKAL</button>
                    </form>
                </body>
                </html>
            `);

        res.end();
      }
    } else if (req.method == "POST") {
      if (urlObj.pathname == "/izmeni-artikal") {
        var body = "";
        req.on("data", function (data) {
          body += data;
        });
        req.on("end", function () {
          izmeniArtikal(
            querystring.parse(body).id,
            querystring.parse(body).naziv,
            querystring.parse(body).cena,
            querystring.parse(body).imeKompanije
          );
          res.writeHead(302, {
            Location: "/svi-artikli",
          });
          res.end();
        });
      }
      if (urlObj.pathname == "/obrisi-artikal") {
        var body = "";
        req.on("data", function (data) {
          body += data;
        });
        req.on("end", function () {
          obrisiArtikal(querystring.parse(body).id);
          res.writeHead(302, {
            Location: "/svi-artikli",
          });
          res.end();
        });
      }
      if (urlObj.pathname == "/dodaj-artikal") {
        var body = "";
        req.on("data", function (data) {
          body += data;
        });
        req.on("end", function () {
          dodajArtikal(
            querystring.parse(body).id,
            querystring.parse(body).naziv,
            querystring.parse(body).cena,
            querystring.parse(body).imeKompanije
          );
          res.writeHead(302, {
            Location: "/svi-artikli",
          });
          res.end();
        });
      }
    }
  })
  .listen(4000);

function sviArtikli(kompanija) {
  if (kompanija) {
    const trazeniArtikli = artikli.filter(
      (art) => art.imeKompanije === kompanija
    );
    return trazeniArtikli;
  }
  return artikli;
}
function izmeniArtikal(id, naziv, cena, kompanija) {
  for (let i = 0; i < artikli.length; i++) {
    if (artikli[i].id == id) {
      artikli[i].naziv = naziv;
      artikli[i].cena = cena;
      artikli[i].imeKompanije = kompanija;
    }
  }
}
function obrisiArtikal(id) {
  let pomocni = [];
  for (let i = 0; i < artikli.length; i++) {
    if (artikli[i].id != id) {
      pomocni.push(artikli[i]);
    }
  }
  artikli = pomocni;
  return artikli;
}
function dodajArtikal(id, naziv, cena, kompanija) {
  let artikal = {
    id,
    naziv,
    cena,
    imeKompanije: kompanija,
  };
  artikli.push(artikal);
}
