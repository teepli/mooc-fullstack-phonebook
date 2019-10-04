const express = require("express");
const app = express();
const bodyParser = require("body-parser");
var morgan = require("morgan");

app.use(bodyParser.json());
/* app.use(morgan('tiny')) */
morgan.token("body", function(req, res) {
  return JSON.stringify(req.body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let numbers = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-25321432"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "02-64564115"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "09-3259390"
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "045545415457879513456"
  }
];

app.get("/api/persons", (req, res) => {
  res.json(numbers);
});

app.get("/info", (req, res) => {
  const info = `<div> Phonebook has info for ${numbers.length} people</div>
                <div>${new Date()}</div>`;

  res.send(info);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = numbers.find(number => number.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  numbers = numbers.filter(n => n.id !== id);

  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  const nameExists = numbers.find(n => n.name === body.name);

  if (nameExists) {
    return res.status(400).json({
      error: body.name + " already exists in phonebook"
    });
  }
  if (!body.name) {
    return res.status(400).json({
      error: "Name missing"
    });
  }
  if (!body.number) {
    return res.status(400).json({
      error: "Number missing"
    });
  }

  const person = {
    id: Math.floor(Math.random() * 1000),
    name: body.name,
    number: body.number
  };

  numbers = numbers.concat(person);
  res.json(person);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
