import { getmodel } from "../config/llmModel.js";

export const codeingAgent = async (state) => {
  const intentLlm = await getmodel("intent");
  const llm = await getmodel("coding");
  const intentRes = await intentLlm.invoke(`
    you are an intent classifier.
    return ONLY one of these value.

    CODE_GENRATION
    CODE_REVIEW
    CODE_EXPLANATION
    DEBUGGING
    OPTIMIZATION
    CONVERSION
    DOCUMENTATION
    USER request :
    ${state.prompt}
    `);

  const intent = intentRes.content;

  if (intent == "CODE_GENRATION") {
    const prompt = `
      you are a CortexAI codeing Agent .

      Genrate the requested projects

      defult stack :
      -html
      -css
      -javascript

      Use React / Next.js / Vue only if explicitly  requested.

      Rules :

      -responsive
      -Morden UI
      -Css Variables
      -flexbox / grid
      -smooth scroll
      -hover effects
      -beutifull spacing
      -single page unless user ask otherwise


      IMAGES
      =====================

      Always use real unsplash images.

      Never use placeholders.

      return only valid JSON.


      Schema:

      {
      "files" : [
      {
      "name" : "index.html",
      "content" : "..."
      },
        {
      "name" : "style.css",
      "content" : "..."
      },
        {
      "name" : "script.js",
      "content" : "..."
      },

      ]
      }


      Rules :
      -Output must be start with {
      -output must be end whit }
      - no markdown
      -no explanation
      -no extra text
      -no \`\`\`
      -Never mention intent

      User Request

      ${state.prompt}
      `;

      const res = await llm.invoke(prompt);
      const data = JSON.parse(res.content);
       return {
    ...state,
    aiResponse: "Code Genrated Successfully ",
    artifacts: [
      {
        id: Date.now(),
        type: "Project",
        files: data.files || [],
        title : state.prompt
      },
    ],
  };

  }

  const res = await llm.invoke(`
    the user's request is:

    ${intent}

    return markdown only.

    never genrate project files.

    use handling like :

    # overview

    ## explanation

    ## problems

    ## improvements

    ## best practices

    ## optimized code(if needed)

    User Request :

    ${state.prompt}

    `);

    const data = res.content

    return{
      ...state,
      aiResponse : data,
      artifact : []
    }
};
