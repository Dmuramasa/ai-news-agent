const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_KEY });

const prompt = `
  Extract the top 3 news stories from this markdown.
  Return ONLY a JSON array of objects with these fields:
  - title: The headline
  - url: Direct link to the story
  - image: The most relevant image URL for this specific story found in the text (if none, return null)
  - summary: A 1-sentence description
`;

exports.extractPosts = async (markdown) => {
  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: "You are a news extractor. You must return a JSON object containing an array named 'posts'." },
      { role: "user", content: prompt + "\n\nContent:\n" + markdown }
    ],
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" }
  });
  
  const rawData = JSON.parse(completion.choices[0].message.content);
  
  // LOGIC GATE: Ensure we return an array
  if (Array.isArray(rawData)) return rawData;
  if (rawData.posts && Array.isArray(rawData.posts)) return rawData.posts;
  if (rawData.articles && Array.isArray(rawData.articles)) return rawData.articles;
  
  // If it's a single object that isn't an array, wrap it in one
  return [rawData]; 
};