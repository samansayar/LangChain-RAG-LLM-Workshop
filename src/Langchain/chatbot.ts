import { ChatGroq } from "@langchain/groq";
import {
    START,
    END,
    MessagesAnnotation,
    StateGraph,
    MemorySaver,
} from "@langchain/langgraph";

import { v4 as uuidv4 } from "uuid";

const llm = new ChatGroq({
    model: "mixtral-8x7b-32768",
    temperature: 0
});

// const res = await llm.invoke([{ role: "user", content: "Hi im Saman" }]);
// console.log(res);

// const res_question = await llm.invoke([{ role: "user", content: "Whats my name" }]);
// console.log(res_question);

// const res_converstation = await llm.invoke([
//     { role: "user", content: "Hi! I'm Saman" },
//     { role: "assistant", content: "Hello Saman! How can I assist you today?" },
//     { role: "user", content: "What's my name?" },
// ]);
// console.log(res_converstation);


const callModel = async (state: typeof MessagesAnnotation.State) => {
    const response = await llm.invoke(state.messages);
    return { messages: response };
};

// Define a new graph
const workflow = new StateGraph(MessagesAnnotation)
    // Define the node and edge
    .addNode("model", callModel)
    .addEdge(START, "model")
    .addEdge("model", END);

// Add memory
const memory = new MemorySaver();
const app = workflow.compile({ checkpointer: memory });


const config = { configurable: { thread_id: uuidv4() } };
const input = [
    {
        role: "user",
        content: "Hi! I'm Saman.",
    },
];
const output = await app.invoke({ messages: input }, config);
// The output contains all messages in the state.
// This will long the last message in the conversation.
console.log("[output1]::: ", output.messages[output.messages.length - 1]);


//   ------------------------------------------------------------

const input2 = [
    {
        role: "user",
        content: "What's my name?",
    },
];
const output2 = await app.invoke({ messages: input2 }, config);
console.log("[output2]::: ", output2.messages[output2.messages.length - 1]);

//   ------------------------------------------------------------

const config2 = { configurable: { thread_id: uuidv4() } };
const input3 = [
    {
        role: "user",
        content: "What's my name?",
    },
];
const output3 = await app.invoke({ messages: input3 }, config2);
console.log("[output3]::: ", output3.messages[output3.messages.length - 1]);


/**
 * @explanation of thread_id and conversation memory:
 *
 * In this code, we demonstrate the use of thread_ids to manage separate conversation contexts:
 *
 1. We create two different configs (config and config2), each with a unique thread_id.
 2. The thread_id acts as a unique identifier for a conversation thread.
 3. When using the same thread_id (config), the chatbot remembers previous interactions:
    - In output1, we introduce ourselves as Saman.
    - In output2, when we ask "What's my name?", the chatbot recalls this information.
 4. However, when we use a new thread_id (config2):
    - In output3, we ask the same question, but the chatbot doesn't know the answer.
    - This is because config2 creates a fresh conversation context.

his approach allows us to maintain multiple independent conversations or to start
a new conversation without the context of previous interactions when needed.
 */
