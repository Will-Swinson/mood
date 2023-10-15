import z from "zod";
import { StructuredOutputParser } from "langchain/output_parsers";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";

// define the schema for the output
// this is what the AI will be generating
// This will also filter out the output to only include the fields we want
const parser = StructuredOutputParser.fromZodSchema(
  z.object({
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
