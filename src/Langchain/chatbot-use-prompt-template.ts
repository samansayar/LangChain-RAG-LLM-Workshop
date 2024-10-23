import { ChatGroq } from "@langchain/groq";
import { Annotation, END, MemorySaver, MessagesAnnotation, START, StateGraph } from "@langchain/langgraph";
import {
    ChatPromptTemplate,
    MessagesPlaceholder,
} from "@langchain/core/prompts";
import { v4 as uuidv4 } from "uuid";

const llm = new ChatGroq({
    model: "mixtral-8x7b-32768",
    temperature: 0
});

// const prompt = ChatPromptTemplate.fromMessages([
//     [
//         "system",
//         "You talk like a pirate. Answer all questions to the best of your ability.",
//     ],
//     new MessagesPlaceholder("messages"),
// ]);


// // Define the function that calls the model
// const callModel = async (state: typeof MessagesAnnotation.State) => {
//     const chain = prompt.pipe(llm);
//     const response = await chain.invoke(state);
//     // Update message history with response:
//     return { messages: [response] };
// };

// // Define a new graph
// const workflow = new StateGraph(MessagesAnnotation)
//     // Define the (single) node in the graph
//     .addNode("model", callModel)
//     .addEdge(START, "model")
//     .addEdge("model", END);

// // Add memory
// const app2 = workflow.compile({ checkpointer: new MemorySaver() });


// const config3 = { configurable: { thread_id: uuidv4() } };
// const input4 = [
//     {
//         role: "user",
//         content: "Hi! I'm Jim.",
//     },
// ];
// const output5 = await app2.invoke({ messages: input4 }, config3);
// console.log("output5:::::", output5.messages[output5.messages.length - 1]);


// const input5 = [
//     {
//         role: "user",
//         content: "What is my name?",
//     },
// ];
// const output6 = await app2.invoke({ messages: input5 }, config3);
// console.log("output6::::", output6.messages[output6.messages.length - 1]);


// ---------------------------------------------------------------

const prompt2 = ChatPromptTemplate.fromMessages([
    [
        "system",
        "You are a helpful assistant. Answer all questions to the best of your ability in {language}.",
    ],
    new MessagesPlaceholder("messages"),
]);

// Define the State
const GraphAnnotation = Annotation.Root({
    ...MessagesAnnotation.spec,
    language: Annotation<string>(),
  });

  // Define the function that calls the model
  const callModel3 = async (state: typeof GraphAnnotation.State) => {
    const chain = prompt2.pipe(llm);
    const response = await chain.invoke(state);
    return { messages: [response] };
  };

  const workflow3 = new StateGraph(GraphAnnotation)
    .addNode("model", callModel3)
    .addEdge(START, "model")
    .addEdge("model", END);

  const app3 = workflow3.compile({ checkpointer: new MemorySaver() });


  const config4 = { configurable: { thread_id: uuidv4() } };
const input6 = {
  messages: [
    {
      role: "user",
      content: "Hi im bob",
    },
  ],
  language: "Spanish",
};
const output7 = await app3.invoke(input6, config4);
console.log(output7.messages[output7.messages.length - 1]); // latest answer in the array
