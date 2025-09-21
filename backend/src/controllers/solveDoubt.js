const { GoogleGenerativeAI } = require("@google/generative-ai");

const solveDoubt = async(req, res) => {
    try {
        const {messages, title, description, testCases, startCode} = req.body;
        
        // Validate required fields
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({
                message: "Messages array is required"
            });
        }

        if (!process.env.GEMINI_KEY) {
            return res.status(500).json({
                message: "AI service configuration error"
            });
        }

        const ai = new GoogleGenerativeAI(process.env.GEMINI_KEY);
        const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Convert messages to the format expected by Gemini
        const formattedMessages = messages.map(msg => {
            if (msg.role === 'user') {
                return { role: 'user', parts: [{ text: msg.parts[0].text }] };
            } else if (msg.role === 'model') {
                return { role: 'model', parts: [{ text: msg.parts[0].text }] };
            }
            return msg;
        });

        // Add system instruction with problem context
        const systemInstruction = `You are an expert Data Structures and Algorithms (DSA) tutor specializing in helping users solve coding problems. Your role is strictly limited to DSA-related assistance only.

## CURRENT PROBLEM CONTEXT:
[PROBLEM_TITLE]: ${title || 'No title provided'}
[PROBLEM_DESCRIPTION]: ${description || 'No description provided'}
[EXAMPLES]: ${testCases ? JSON.stringify(testCases) : 'No test cases provided'}
[START_CODE]: ${startCode || 'No starting code provided'}

## YOUR CAPABILITIES:
1. **Hint Provider**: Give step-by-step hints without revealing the complete solution
2. **Code Reviewer**: Debug and fix code submissions with explanations
3. **Solution Guide**: Provide optimal solutions with detailed explanations
4. **Complexity Analyzer**: Explain time and space complexity trade-offs
5. **Approach Suggester**: Recommend different algorithmic approaches

## RESPONSE GUIDELINES:
- Use clear, concise explanations
- Format code with proper syntax highlighting
- Always relate back to the current problem context
- Encourage understanding over memorization
- Guide users to discover solutions rather than just providing answers

Remember: Your goal is to help users learn and understand DSA concepts through the lens of the current problem.`;

        // Create the chat session with system instruction
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: systemInstruction }]
                },
                {
                    role: "model", 
                    parts: [{ text: "I understand. I'm ready to help you with this DSA problem. What would you like assistance with?" }]
                }
            ]
        });

        // Get the last user message
        const lastMessage = formattedMessages[formattedMessages.length - 1];
        if (!lastMessage || lastMessage.role !== 'user') {
            return res.status(400).json({
                message: "Invalid message format"
            });
        }

        const result = await chat.sendMessage(lastMessage.parts[0].text);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({
            message: text
        });

    } catch(err) {
        console.error("AI Chat Error:", err);
        res.status(500).json({
            message: "AI service temporarily unavailable. Please try again later."
        });
    }
}

module.exports = solveDoubt;
