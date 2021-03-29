const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const { nanoid } = require("nanoid");

const PORT = process.env.PORT || 1337;

const app = express();

function isValidJSON(text) {
  try {
    if (typeof text === "object") {
      return true;
    }
    JSON.parse(text);
    return true;
  } catch (error) {
    return false;
  }
}

const databaseFile = path.join(__dirname, "database.json");

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/todo", (req, res) => {
  res.status(200).send(JSON.parse(fs.readFileSync(databaseFile, "utf-8")));
});

app.post("/todo", (req, res) => {
  console.log(req.body);

  if (isValidJSON(req.body)) {
    const modifiedDatabase = JSON.parse(fs.readFileSync(databaseFile, "utf-8"));
    modifiedDatabase.list.unshift({
      id: nanoid(),
      ...req.body,
      done: false,
    });
    fs.writeFileSync(databaseFile, JSON.stringify(modifiedDatabase));
    res.status(201).send(JSON.parse(fs.readFileSync(databaseFile, "utf-8")));
  } else {
    res.status(400).send();
  }
});

app.post("/todo/update", (req, res) => {
  if (isValidJSON(req.body)) {
    const database = JSON.parse(fs.readFileSync(databaseFile, "utf-8"));
    const updatedIndexes = req.body;

    if (database.list.length === updatedIndexes.list.length) {
      fs.writeFileSync(databaseFile, JSON.stringify(updatedIndexes));
      res.status(200).send(JSON.parse(fs.readFileSync(databaseFile, "utf-8")));
    }

    res.status(409).send();
  }
  res.status(400).send();
});

app.post("/todo/:id", (req, res) => {
  const database = JSON.parse(fs.readFileSync(databaseFile, "utf-8"));
  const taskToModify = database.list.findIndex(
    (item) => item.id === req.params.id
  );
  if (taskToModify === -1) {
    res.status(404).send();
  }

  database.list[taskToModify] = req.body;

  fs.writeFileSync(databaseFile, JSON.stringify(database));
  res.status(200).send(JSON.parse(fs.readFileSync(databaseFile, "utf-8")));
});

app.delete("/todo", (req, res) => {
  fs.writeFileSync(databaseFile, JSON.stringify({ list: [] }));
  res.status(200).send(JSON.parse(fs.readFileSync(databaseFile, "utf-8")));
});

app.delete("/todo/:id", (req, res) => {
  if (isValidJSON(req.body)) {
    const database = JSON.parse(fs.readFileSync(databaseFile, "utf-8"));
    const taskToDelete = database.list.findIndex(
      (item) => item.id === req.params.id
    );

    if (taskToDelete === -1) {
      res.status(404).send();
    }

    database.list.splice(taskToDelete, 1);

    fs.writeFileSync(databaseFile, JSON.stringify(database));
    res.status(200).send(JSON.parse(fs.readFileSync(databaseFile, "utf-8")));
  }
});

async function checkDatabase() {
  try {
    fs.readFileSync(databaseFile, "utf-8", (err, data) => {
      if (err)
        throw "No database.json file was found. Please create it manually or check for errors.";
    });
  } catch (e) {
    console.warn(e);
  }
}
async function start() {
  try {
    await checkDatabase();
    app.listen(PORT, '0.0.0.0', () => {
      console.info(
        `Database has been connected. Used local-file database: ${databaseFile}`
      );
      console.log(`Server has been started on port: ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();
