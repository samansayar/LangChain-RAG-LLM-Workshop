import { test, expect, mock } from "bun:test";
import { getEmbeddings } from "../src/embedding";
import { prisma } from '../src/utils/prisma';
import { HfInference } from "@huggingface/inference";


test("getEmbeddings", async () => {
    const testData = {
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        roomName: "Room 1"
    };

    const result = await getEmbeddings(testData);

    expect(result).toEqual({
        ok: true,
        message: "Successfully stored!",
    });
});
