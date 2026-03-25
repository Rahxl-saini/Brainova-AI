import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const getGroqResponse = async (message) => {
  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: message
        }
      ],
      model: "llama-3.3-70b-versatile"
    });

    return response.choices[0].message.content;

  } catch (error) {
    console.log("Groq Error:", error);
    return "Error generating response";
  }
};

export default getGroqResponse;