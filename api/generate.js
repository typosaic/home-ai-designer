export default async function handler(req, res) {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: "Manca imageUrl" });
    }

    const imageResponse = await fetch(imageUrl);
    const imageBlob = await imageResponse.blob();

    const formData = new FormData();
    formData.append("model", "gpt-image-1");
    formData.append(
      "prompt",
      "Trasforma questa stanza in un soggiorno moderno, luminoso, realistico, con mobili eleganti, colori neutri e stile da catalogo ecommerce. Mantieni prospettiva, pareti, pavimento e finestre della foto originale."
    );
    formData.append("size", "1024x1024");
    formData.append("image", imageBlob, "room.png");

    const aiResponse = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + process.env.OPENAI_API_KEY
      },
      body: formData
    });

    const data = await aiResponse.json();

    if (!aiResponse.ok) {
      return res.status(500).json({ error: data });
    }

    const base64Image = data.data[0].b64_json;
    const imageDataUrl = "data:image/png;base64," + base64Image;

    return res.status(200).json({
      image: imageDataUrl
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}
