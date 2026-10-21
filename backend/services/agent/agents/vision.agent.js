import { getmodel } from "../config/llmModel.js";
import axios from "axios";
import { uploadToS3 } from "../utills/uploadToS3.js";
import { getFromS3 } from "../utills/getFromS3.js";

export const visionAgent = async (state) => {
  try {
    const llm = await getmodel("image");

    const res = await llm.invoke(`
       you are an elite AI image prompt engineer

       convert the user request into a highly detailed image generation prompt.

       Requirements :

       Cinematic lighting
       professional composition
       ultra realistic
       high details
       beautiful color palette
       sharp focus
       8k quilty
       photorealistic
       depth of field
       professional photography
       stunning visuals

       return only the image prompt.

       user request :
       ${state.prompt}

    `);

    // Simple prompt
    const prompt = res.content.trim();

    // Free model (Flux)
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?model=flux&width=1024&height=1024&nologo=true`;

    const imageRes = await axios.get(imageUrl, {
      responseType: "arraybuffer",
      timeout: 60000,
    });

    const buffer = Buffer.from(imageRes.data);
    const filename = `image-${Date.now()}.png`;

    await uploadToS3(filename, buffer, "image/png");

    const downloadUrl = await getFromS3(filename, 24*60);

    return {
      ...state,
      aiResponse: `

![Generated Image](${downloadUrl})

[Download Image](${downloadUrl})
`,
    };
  } catch (error) {
    console.error(
      "Vision Agent Error:",
      error.response?.data?.toString() || error.message,
    );

    return {
      ...state,
      aiResponse: "❌ Failed to generate image.",
    };
  }
};
