import { StateGraph } from "@langchain/langgraph";
import { agentState } from "./state.js";
import { router } from "./router.js";

import { chatAgent } from "../agents/chat.agent.js";
import { searchAgent } from "../agents/search.agent.js";
import { codeingAgent } from "../agents/codeing.agent.js";
import { pdfAgent } from "../agents/pdf.agent.js";
import { pptAgent } from "../agents/ppt.agent.js";
import { visionAgent } from "../agents/vision.agent.js";

const workFlow = new StateGraph(agentState);

// Nodes
workFlow.addNode("router", router);
workFlow.addNode("chat", chatAgent);
workFlow.addNode("search", searchAgent);
workFlow.addNode("codeing", codeingAgent);
workFlow.addNode("pdf", pdfAgent);
workFlow.addNode("ppt", pptAgent);
workFlow.addNode("vision", visionAgent);

// START → ROUTER
workFlow.addEdge("__start__", "router");

// ROUTER → AGENT
workFlow.addConditionalEdges("router", (state) => {
  switch (state.agent) {
    case "chat":
      return "chat";

    case "search":
      return "search";

    case "codeing":
      return "codeing";

    case "pdf":
      return "pdf";

    case "ppt":
      return "ppt";

    case "vision":
      return "vision";

    default:
      return "chat";
  }
},{

  chat:"chat",
  search:"search",
  codeing:"codeing",
  pdf:"pdf",
  vision:"vision",
  ppt:"ppt",

});
// Search → Chat
workFlow.addEdge("search", "chat");

// Agent → END
workFlow.addEdge("chat", "__end__");
workFlow.addEdge("codeing", "__end__");
workFlow.addEdge("pdf", "__end__");
workFlow.addEdge("ppt", "__end__");
workFlow.addEdge("vision", "__end__");

export const graph = workFlow.compile();
