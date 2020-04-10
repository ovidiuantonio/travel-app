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

const server = app.listen(3000, () => {
  console.log("server is listening on port:", 3000);
});
