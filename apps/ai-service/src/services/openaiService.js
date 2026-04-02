import { env } from "../config/env.js";

async function callOpenAI(messages, stream = false) {
  if (!env.apiKey) {
    throw new Error("Missing OPENAI_API_KEY in environment");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.apiKey}`
    },
    body: JSON.stringify({
      model: env.model,
      stream,
      temperature: 0.8,
      messages,
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`OpenAI request failed: ${message}`);
  }

  return response;
}

export async function generateStructuredJson(prompt) {
  const response = await callOpenAI(
    [
      { role: "system", content: "You are an advertising strategist. Return valid JSON only." },
      { role: "user", content: prompt }
    ],
    false
  );

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

export async function streamStructuredJson(prompt, res) {
  const response = await callOpenAI(
    [
      { role: "system", content: "You are an advertising copywriter. Return valid JSON only." },
      { role: "user", content: prompt }
    ],
    true
  );

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      break;
    }

    const chunk = decoder.decode(value, { stream: true });
    res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
  }

  res.write("event: done\ndata: completed\n\n");
  res.end();
}
