import { getmodel } from "../config/llmModel.js"

export const router = async (state)=>{
  const llm = await getmodel("router")

  if(state.agent && state.agent !== "auto"){
     return {
    ...state,
    agent: state.agent
  }
  }


  const prompt = `you are an agent router.

  Available agents:
  - chat
  - search
  - codeing
  - pdf
  - ppt
  - vision

  Rules :
  chat:
  genral conversation,
  explanation,
  learning,
  questions

  serach :
  currents events,
  latest events,
  news,
  recent developments,
  internet lookup

  codeing:
  generate code,
  debug code,
  build rojects,
  architecture,
  API desings.

  pdf :
  question about generate PDFs
  or document context.

  ppt:
  question about generate ppts
  or ppt context.

  vision:
   generate image,
   create image

  return only one word:
  chat
  search
  codeing
  pdf
  ppt
  vision

  User Query:
  ${state.prompt}
    `


  const responce = await llm.invoke(prompt)

  return {
    ...state,
    agent:responce.content.trim().toLowerCase()
  }
}
