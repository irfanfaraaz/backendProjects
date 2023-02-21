const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// Use body-parser middleware to parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define an array to store the questions
const questions = [
  {
    question: "What is the capital of India?",
    options: ["Delhi", "Mumbai", "Chennai", "Kolkata"],
    answer: "Delhi"
  },
  {
    question: "What is the largest ocean in the world?",
    options: ["Pacific", "Atlantic", "Indian", "Arctic"],
    answer: "Pacific"
  },
  {
    question: "What is the currency of Japan?",
    options: ["Yen", "Dollar", "Euro", "Pound"],
    answer: "Yen"
  }
];

// Define the endpoint to get the questions
app.get("/questions", (req, res) => {
  res.json(questions);
});

// Define the endpoint to submit answers
app.post("/submit-answers", (req, res) => {
  const answers = req.body.answers;
  let score = 0;

  // Check if the answers are correct
  for (let i = 0; i < answers.length; i++) {
    if (answers[i] === questions[i].answer) {
      score++;
    }
  }

  res.json({ score });
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
