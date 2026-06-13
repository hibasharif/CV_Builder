import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { type, context } = await req.json();

  const prompts: Record<string, string> = {
    summary: `Write a compelling professional summary for a CV. Context: ${context}. 
      Return 2-3 short variations (2-3 sentences each), numbered 1. 2. 3. Keep them professional, achievement-focused, and ATS-friendly.`,
    achievement: `Improve this work achievement for a CV: "${context}". 
      Return 3 improved versions using strong action verbs and quantifiable results where possible. Number them 1. 2. 3.`,
    skills: `Suggest 10 relevant professional skills for someone with this background: ${context}. 
      Return as a JSON array of strings only, no explanation. Example: ["Skill1","Skill2"]`,
    description: `Write a job description bullet point for this role: ${context}.
      Return 3 strong, achievement-oriented bullet points. Number them 1. 2. 3.`,
  };

  const prompt = prompts[type];
  if (!prompt) return NextResponse.json({ error: "Invalid type" }, { status: 400 });

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 600,
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";
  return NextResponse.json({ suggestion: text });
}
