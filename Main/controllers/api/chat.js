const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');

// Load your OpenAI API key from environment variables
require('dotenv').config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// POST route to handle chat requests
router.post('/', async (req, res) => {
    // Extract user input, chat history, and personality from the request body
    const { userInput, chatHistory, personality } = req.body;

    // Build the message list for the OpenAI API
    let messageList = chatHistory.map(msg => ({
        role: msg.role, // Ensure the role is one of 'system', 'assistant', 'user', or 'function'
        content: msg.content
    }));

    // Include the personality in the system message, if provided
    if (personality) {
        messageList.unshift({ role: "system", content: `respondto me as if you are ${personality}.` });
    }

    // Add the user's input to the message list
    messageList.push({ role: "user", content: userInput });

    try {
        // Call the OpenAI API using the chat completions method
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: messageList
        });

        // Extract and send the AI's response
        const aiResponse = response.choices[0].message.content;
        res.json({ aiResponse, chatHistory: [...chatHistory, { role: "user", content: userInput, aiResponse }] });
    } catch (error) {
        // Handle any errors from the API call
        console.error("Error calling OpenAI:", error);
        res.status(500).send(error.message);
    }
});

// Export the router so it can be used in your main server file
module.exports = router;
