// This code demonstrates a basic LLM chain using LangChain.js
// It sets up a translation chain using the Groq API and Mixtral model.
// The chain translates text into a specified language.
// Resource: https://js.langchain.com/docs/tutorials/llm_chain/

import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatGroq } from "@langchain/groq";
import { StringOutputParser } from '@langchain/core/output_parsers'
import { ChatPromptTemplate } from "@langchain/core/prompts";

const systemTemplate = "Translate the following into {language}:";

const parser = new StringOutputParser();

const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "mixtral-8x7b-32768",
    temperature: 0
});
const chain = model.pipe(parser);

const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", systemTemplate],
    ["user", "{text}"],
]);

// const messages = [
//     new SystemMessage('Translate the following from English into Spanish'),
//     new HumanMessage("Hello")
// ]

// const res = await model.invoke(messages)
// const res_parser = await parser.invoke(res);
// const res_chain = await chain.invoke(messages);

const llmChain = promptTemplate.pipe(model).pipe(parser);
const res_chain = await llmChain.invoke({ language: "spanish", text: "hi" });
console.log(res_chain)
