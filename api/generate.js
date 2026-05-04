export default async function handler(req, res) {

  const { imageUrl } = req.body;

  const response = await fetch("https://api.openai.com/v1/images/edits", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + process.env.OPENAI_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt: "Trasforma questa stanza in un soggiorno moderno, luminoso, elegante",
      image: imageUrl,
      size: "1024x1024"
    })
  });

  const data = await response.json();

  res.status(200).json(data);
}
