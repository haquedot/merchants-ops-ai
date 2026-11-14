import process from "node:process";
import { SarvamAIClient } from "sarvamai";

if (process.loadEnvFile) {
  process.loadEnvFile();
}

const apiKey = process.env.SARVAM_API_KEY;

if (!apiKey || apiKey.trim() === "") {
  console.error("Error: SARVAM_API_KEY is not set in .env");
  process.exit(1);
}

const client = new SarvamAIClient({
  apiSubscriptionKey: apiKey,
});

async function main() {
  const response = await client.chat.completions({
    model: "sarvam-105b-conversations",
    messages: [
      {
        role: "user",
        content: "Hello! Reply with one short sentence acknowledging this connection.",
      },
    ],
  });

  const reply =
    response.choices?.[0]?.message?.content ?? JSON.stringify(response, null, 2);
  console.log("Response from Sarvam AI:\n" + reply);
}

main().catch((err) => {
  console.error("Sarvam API Error:", err.message || err);
  process.exit(1);
});

