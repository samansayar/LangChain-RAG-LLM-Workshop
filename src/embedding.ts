import { PrismaClient } from "@prisma/client";
import { prisma } from './utils/prisma';
import { HfInference } from "@huggingface/inference";


const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

type TData = {
    content: string,
    roomName: string
}

export async function getEmbeddings({ content, roomName }: TData) {
    const embeddingResponse = await hf.featureExtraction({
        model: 'sentence-transformers/all-mpnet-base-v2',
        inputs: content,
    });

    // check if content and room exists to db, throw error
    const contentExists = await prisma.embedding.findFirst({
        where: {
            content, Index: {
                roomName
            }
        }
    });

    if (contentExists) {
        console.error('This Content was already stored!');
        return null
    }

    // Store the embedding in the database
    await prisma.roomChat.upsert({
        where: { roomName },
        update: {
            embeddings: {
                create: { content, vector: embeddingResponse as any }
            }
        },
        create: {
            roomName,
            embeddings: {
                create: { content, vector: embeddingResponse as any }
            }
        }
    });

    return { ok: true, message: 'Successfully stored!' }
}
