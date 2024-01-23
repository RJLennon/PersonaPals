const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');

require('dotenv').config();
const openai = new OpenAI(process.env.OPENAI_SECRET_KEY);

router.post('/', async (req, res) => {
  const { userInput, chatHistory, personality } = req.body;

  let messageList = chatHistory.map(msg => ({
    role: msg.role, 
    content: msg.content
  }));

  messageList.push({ role: "system", content: `Respond to me as if you are ${personality}.` });

  messageList.push({ role: "user", content: userInput });

  try {
    const response = await openai.createChatMessage({
      model: "gpt-3.5-turbo",
      messages: messageList
    });

    const aiResponse = response.data.choices[0].message.content;
    res.json({ aiResponse, chatHistory: [...chatHistory, { role: "user", content: userInput, aiResponse }] });
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    res.status(500).send("Error processing chat request");
  }
});

module.exports = router;
