import z from "zod";
import { StructuredOutputParser } from "langchain/output_parsers";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { Document } from "langchain/document";
import { loadQARefineChain } from "langchain/chains";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

// define the schema for the output
// this is what the AI will be generating
// This will also filter out the output to only include the fields we want
const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    sentimentScore: z
      .number()
      .describe(
        "sentiment of the text and rated on a scale from -10 to 10, where -10 is extremely negative, 0 is neutral, and 10 is extremely positive."
      ),
    mood: z
      .string()
      .describe("the mood of the person who wrote the journal entry."),
    summary: z.string().describe("quick summary of the entire journal entry."),
    subject: z.string().describe("the subject of the journal entry."),
    negative: z
      .boolean()
      .describe(
        "is the journal entry negative? (i.e. does it contain negative emotions?) this will return either true or false. no matter what!"
      ),
    color: z
      .string()
      .describe(
        "give a color based on the mood of the journal entry in hexidecimal format. (i.e. #000000)"
      ),
  })
);

// function to generate a prompt for the AI to analyze
async function getPrompt(content: string) {
  // This is the instructions for the prompt to follow when generating the output
  const formattedInstructions = parser.getFormatInstructions();

  // This is the template for the prompt
  // The {formattedInstructions} will be replaced with the instructions
  const prompt = new PromptTemplate({
    // Template is a guideline for the prompt to follow
    template:
      "Analyze the following journal entry. Follow the instructions and format your response to match the format instructions, no matter what! \n {formattedInstructions} \n{entry}",
    // The input values are getting interpreted later once it is passed into the AI
    inputVariables: ["entry"],
    // These variables are getting interpreted now by the AI
    partialVariables: { formattedInstructions },
  });

  // this is where you format the input to the prompt and give it the content you want.
  // We do this so it is not hardcode and easy to reuse
  const input = await prompt.format({ entry: content });

  // return the input formatted for the prompt
  return input;
}
// function to analyze the prompt
export async function analyze(content: string) {
  // get the input for the prompt, this will take the content and format it for the prompt
  const input = await getPrompt(content);
  // create a new instance of the OpenAI class
  const model = new OpenAI({ temperature: 0, modelName: "gpt-3.5-turbo" });

  // call the AI with the prompt
  const result = await model.call(input);

  try {
    return parser.parse(result);
  } catch (err) {
    throw new Error(err.message);
  }
  console.log("RESULT:", result);
}

// Using vector database to store the question
// All the entries  will be stored in the database, BUT we are using in memory in this scenario so we have to store these entries every time
// Which will then be used to generate the prompt
export async function qa(question, entries) {
  // creating a new document for each entry so the AI can analyze it
  const docs = entries.map((entry) => {
    return new Document({
      pageContent: entry.content,
      metadata: { id: entry.id, createdAt: entry.createdAt },
    });
  });

  // creating the AI instance
  const model = new OpenAI({ temperature: 0, modelName: "gpt-3.5-turbo" });
  // creating a chain to loop of the question entries and update them sometimes as neccessary, a chain links different AI's together like a output to an input
  // Almost like summarizing the data and then refining it into a perfect summary
  const chain = loadQARefineChain(model);
  // this is a function that can be used for a chain to create embeddings AKA a vector of the data, basically you're sending this data to OPEN AI to receive back some vectors
  const embeddings = new OpenAIEmbeddings();
  // This is going to create our store of vectors for us in memory
  const store = await MemoryVectorStore.fromDocuments(docs, embeddings);

  // Takes the question you're asking and takes all the closest documents to it using the vectors and returns the relvant documents
  const relavantDocs = await store.similaritySearch(question);
  // This will then make the call to the AI with the given data and return the result
  const res = await chain.call({ input_documents: relavantDocs, question });

  // which then we can return the result with the output_text method
  return res.output_text;
}
