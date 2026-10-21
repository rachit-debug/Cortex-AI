import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { getmodel } from "../config/llmModel.js";
import { getMemory } from "../config/memory.js";

export const chatAgent = async (state) => {
  try {
    const llm = await getmodel("chat");
    const history = await getMemory(state.conversationId);
    const searchContext = state.searchResults
      ? `
   Web Search Results:
   ${JSON.stringify(state.searchResults)}
   Answer the user only the above search results.
   `
      : "";

    const systemPrompt = `
You are CortexAI, an intelligent AI assistant.

${searchContext}
if  searchContext exits :
- use search results to answer.
- do not mention internal tools.

Rules :
-for simple questions , greating , and short queries , respond naturally in plain text.
-for technical , educational, codeing , or detailed topixcs , use clean markdown.

Formatting:

- Use # for titles and ## for sections.
- Leave a blank line after headings.
- Use bullet points for lists.
- Use numbered lists for steps.
- Use fenced code blocks with language tags for code.
- Keep paragraphs short and readable.
- Never write headings and content on the same line.
- Never generate large walls of text.
  `;

    const messages = [new SystemMessage(systemPrompt)];

    history.forEach((msg) => {
      if (msg.role === "user") {
        messages.push(new HumanMessage(msg.content));
      }
      if (msg.role === "assistant") {
        messages.push(new AIMessage(msg.content));
      }
    });

    messages.push(new HumanMessage(state.prompt));

    const responce = await llm.invoke(messages);

    return {
      ...state,
      aiResponse: responce.content,
    };
  } catch (error) {
    return {
      ...state,
      aiResponse: "❌ Failed to generate responce",
    };
  }
};
