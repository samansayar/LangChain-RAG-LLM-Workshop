import { ChatGroq } from '@langchain/groq'

const llm = new ChatGroq({
    model: "mixtral-8x7b-32768",
    temperature: 0.5,
});

// This is the retriever we will use in RAG
// This is mocked out, but it could be anything we want
async function retriever(query: string) {
    return ["This is a document"];
}

// This is the end-to-end RAG chain.
// It does a retrieval step then calls OpenAI
async function rag(question: string) {
    const docs = await retriever(question);

    const systemMessage =
        "Answer the users question using only the provided information below:\n\n" +
        docs.join("\n");

    const result = await llm.invoke([
        { role: "system", content: systemMessage },
        { role: "user", content: question },
    ]);
    console.log(result.content)
    return result
}

rag("where did samansayyar work")
