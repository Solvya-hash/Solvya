const express = require("express");
const OpenAI = require("openai");

const app = express();

app.use(express.json());
app.use(express.static("."));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/api/solve", async (req, res) => {
  try {
    const problem = req.body.problem;

    if (!problem || !problem.trim()) {
      return res.status(400).json({
        error: "Please tell Solvya what problem you are facing."
      });
    }

    const response = await client.responses.create({
      model: "gpt-5-mini",
      input: `You are Solvya, an everyday problem-solving assistant.

A user has this problem:
${problem}

Give them a practical, clear and helpful solution.
Break the solution into simple steps.
Be encouraging and realistic.
If the problem is serious or dangerous, recommend appropriate professional help.`
    });

    res.json({
      solution: response.output_text
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Solvya could not generate a solution right now. Please try again."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Solvya is running on port ${PORT}`);
});
