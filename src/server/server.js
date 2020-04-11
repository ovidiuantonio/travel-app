projectData = {};

const bodyParser = require("body-parser");
const express = require("express");

const app = express();

/* Middleware */

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

const cors = require("cors");
app.use(cors());

app.use(express.static("./dist"));

app.post("/", function (req, res) {
  projectData = {
    city: req.body.city_name,
    country: req.body.country,
    min_temp: req.body.data[2].min_temp,
    max_temp: req.body.data[2].max_temp,
    daysUntilTrip: req.body.daysUntilTrip,
    capital: req.body.capital,
    currency: req.body.currency,
    image: req.body.photoURL,
    error: req.body.photoError,
  };
  //for debugging
  console.log(projectData);

  res.end();
});

app.get("/trip", function (req, res) {
  res.send(JSON.stringify(projectData));
});

const server = app.listen(3000, () => {
  console.log("server is listening on port:", 3000);
});
