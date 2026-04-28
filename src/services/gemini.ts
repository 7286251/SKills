import { GoogleGenAI } from "@google/genai";

// Cache the AI instance
let ai: GoogleGenAI | null = null;

export function getAI() {
  if (!ai) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY environment variable is required.");
    }
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return ai;
}

const SYSTEM_INSTRUCTION = `
你是一个专业的 SKills 创作者和架构师。
客户会提供一个他们想要构建的技能的主题或需求。你需要通过下面给定的框架，帮客户写出开发者专业水平的技能包（包含多个文件内容）。
输出必须是合法的 JSON 格式，如下所示，每个文件的路径作为 key，文件内的具体内容作为 value：
{
  "README.md": "...",
  "SKILL.md": "...",
  "CHANGELOG.md": "...",
  "LICENSE": "...",
  ".github/CODEOWNERS": "...",
  ".github/workflows/validate-skills.yml": "...",
  "skills/feature-a/SKILL.md": "...",
  "references/taxonomy.md": "...",
  "evals/evals.json": "...",
  "scripts/validate_skills.py": "..."
}

【要求】：
1. 你的内容要极度专业，参考标准的技能框架，例如具备明确的 Boundary、Core Workflow、Input、Process、Output。
2. 尽可能细化。
3. 根目录至少要有 \`README.md\`, \`SKILL.md\`, \`CHANGELOG.md\`, \`LICENSE\`。
4. 包含子技能（例如 \`skills/xxx/SKILL.md\`），参考文件（\`references/xxx.md\`），评估用例（\`evals/xxx.json\`）和脚本（\`scripts/xxx.py\`）。
5. 直接输出唯一的、完整的、用 Markdown 格式的纯 JSON 字符串即可，不需要其他解释！请勿使用 markdown 代码块如 \`\`\`json \`\`\` 包裹，直接输出可被 JSON.parse 解析的文本。
`;

export async function generateSkillPackage(topic: string): Promise<Record<string, string>> {
  const model = getAI();
  const response = await model.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: topic,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
    },
  });

  const text = response.text;
  if (!text) throw new Error("No output generated.");

  try {
    // Attempt parse
    let cleanedText = text.trim();
    if (cleanedText.startsWith("\`\`\`json")) {
        cleanedText = cleanedText.replace(/^\`\`\`json/m, '').replace(/\`\`\`$/m, '').trim();
    }
    if (cleanedText.startsWith("\`\`\`")) {
      cleanedText = cleanedText.replace(/^\`\`\`/m, '').replace(/\`\`\`$/m, '').trim();
    }
    const json = JSON.parse(cleanedText);
    return json;
  } catch (err) {
    console.error("Failed to parse JSON", text);
    throw new Error("生成的内容格式有误，请重试。");
  }
}

export async function askTutorialQuestion(question: string, tutorialContext: string): Promise<string> {
  const model = getAI();
  const systemPrompt = `你是一个耐心且专业的平台助手。用户正在阅读【SKills助手部署教程】。
这是教程的具体内容：
---
${tutorialContext}
---
请根据以上教程内容，解答用户的疑问。回答要简洁、清晰、有针对性。如果用户问了和教程无关的问题，委婉地引导他们提问关于平台或部署的问题。`;

  const response = await model.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: question,
    config: {
      systemInstruction: systemPrompt,
      temperature: 0.5,
    },
  });

  if (!response.text) {
    throw new Error("模型没有返回任何解答。");
  }
  return response.text;
}
