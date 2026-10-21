import { getmodel } from "../config/llmModel.js";
import { generatePdf } from "../utills/generatePdf.js";
import { getFromS3 } from "../utills/getFromS3.js";
import { uploadToS3 } from "../utills/uploadToS3.js";

export const pdfAgent = async (state) => {
  try {
    const llm = await getmodel("pdf");

    const prompt = `
You are an expert document writer.

Return ONLY valid JSON.

Do NOT return markdown.

Do NOT return explanations.

Structure:

{
  "title": "",
  "subtitle": "",
  "sections": [
    {
      "heading": "",
      "points": []
    }
  ]
}

genrate 4-8 sections

each section should have 3-6 concise points .

Topic :

User Request:
${state.prompt}
`;

    const res = await llm.invoke(prompt);

    const data = JSON.parse(res.content);

    const pdfBuffer = await generatePdf(data)


    const filename = `pdf-${Date.now()}.pdf`

    await uploadToS3(filename,pdfBuffer,"application/pdf")

    const downloadUrl = await getFromS3(filename,24*60)

    return {
      ...state,
      aiResponse:`# PDF Generated

      **${data.title}**

      [Download PDF](${downloadUrl})

      _link expires in 10 minutes._

      `
    };
  } catch (error) {
    console.error("PDF Agent Error:", error);

    return {
      ...state,
      aiResponse: "❌ Failed to generate PDF content.",
    };
  }
};
