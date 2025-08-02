const express = require("express");
const aiRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const { main} = require("../utils/geminiClient");

aiRouter.post("/ai/codeExplanation", userAuth, async (req, res) => {
  try {
    const codeSnippet = req.body.codeSnippet;
    if (!codeSnippet) {
      return res.status(400).json({ message: "Code snippet is required" });
    }

    const prompt = `You are a senior software engineer. Explain the following code snippet in detail in simple words 
                    explain each and every word used. If any error exists, please 
                    provide the corrected code:\n\n ${codeSnippet}`;

    const response = await main(prompt)
    res.json({ message: "Code explanation received", data: response });

  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = aiRouter;