import Markdown from "react-markdown";
import { BookOpen, GraduationCap, ChevronRight, MessageCircle, Send, Loader2 } from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils";
import { askTutorialQuestion } from "../services/gemini";

const beginnerTutorial = `
# 🐣 小白零基础部署教程

如果你之前没有接触过代码或者 AI 平台，完全不需要担心！只需跟着以下 **最详细的教程**，我们一起完成设定，将生成的技能赋予到 AI 机器人上。

## 步骤 1：生成你的专属技能
在【创作与生成】页面，思考你希望解决什么痛点。
- 在输入框内输入你的想法（例如："作为电商文案小助手，帮我写小红书文案"）。
- 或者：如果你暂时没有头绪，可以直接点击右侧的 **骰子🎲** 随机抽取一个我们的自带精选模版。
- 最后，点击红色的 **一键生成** 按钮。稍等几十秒，系统会将一整套结构化的指令内容展示在下方。

## 步骤 2：下载并解压文件
生成的内容实际上是一个"压缩包"，我们需要把它下载到本地电脑上。
1. 将网页往下滑，你会看到一个大大的 **一键打包下载 (ZIP)** 按钮，点击它。
2. 浏览器会自动下载一个名为 \`skill-package.zip\` 的文件到你的电脑里。
3. 找到这个文件，右键点击它，选择 **"解压到当前文件夹"** （Mac用户直接双击即可解压）。
4. 你会看到解压出的文件夹内有若干文件，我们主要只需要在这个时候使用名为 \`SKILL.md\` 的文件。**你可以使用电脑自带的"记事本"或"文本编辑"来打开它**。里面全部都是文字内容。

## 步骤 3：导入到各大 AI 平台

### 选项 A：使用 扣子 (Coze) —— 推荐国内用户
1. 打开浏览器登录 [Coze 官网 (coze.cn)](https://www.coze.cn)。
2. 在左侧菜单点击 **"个人空间"** 或 **"团队空间"**，并在右上角点击蓝色的 **"创建 Bot"** 按钮。为你的机器人起个名字。
3. 进入机器人的工作台之后，找到左侧面积最大的那个框框，名字叫做 **“人设与回复逻辑 (Prompt)”**。
4. 将你刚才用记事本打开的 \`SKILL.md\` 里面的所有的文字，一行不落地全部复制，然后粘贴到这个输入框中！

### 选项 B：使用 ChatGPT (自定义 GPTs)
1. 登录 ChatGPT网页端，并在左下角点击 **"Explore GPTs"** -> 右上角选择 **"+ Create"**。
2. 在弹出的页面上方，切换到 **"Configure"** (配置) 标签页。
3. 你会看到一个名为 **"Instructions"** 的大文本框。将 \`SKILL.md\` 中的文字完整复制、并粘贴到这里。
4. (可选进阶) 如果解压包内还有其他文件，可以点击底部的 \`Knowledge\` 并上传它们。

### 选项 C：直接发送给任意 AI 助手 (Kimi、深言、文心等)
如果你不想进行复杂配置，只是临时想用一次：
1. 打开任何你习惯使用的 AI 会话窗口。
2. 直接给它发这一句话作为开场白：
> 请你从现在起扮演这个角色并严格遵守以下规则工作，如果同意请回复“收到”：
> *(在这里粘贴你刚才复制的 SKILL.md 中的全部内容！)*
3. 当 AI 回复“收到”后，你就可以开始命令它工作了。

## 步骤 4：搞定！开始测试 
如果在刚才配置的平台上，你可以找到一个类似 **"发布"** 的按钮，点击它保存。
现在你可以像平时和 AI 聊天一样测试它。你会发现，配置了专业技能包以后，AI 的输出规范、专业度、严谨性，将会出现质的飞跃！再也不会出现敷衍了事、满嘴跑火车的回答啦！
`;

const advancedTutorial = `
# 📘 SKills 助手 - 专业部署与集成教程

欢迎使用 **SKills 助手**！生成你专属的技能包后，可以通过以下几个简单的步骤，将技能集成并生效到你的本地或云端项目中。

---

## 1. 📂 目录结构与作用解析

典型的技能包包含以下核心内容，请解压后查阅：

- \`README.md\`：提供使用指南和整体概述。
- \`SKILL.md\`：这是最核心的文件！包含 AI 需要识别的规则边界、工作流、格式定义。
- \`.github/workflows/\`：内置的自动化测试/验证 CI 跑流，供大型团队集成使用。
- \`skills/\` 与 \`references/\`：子任务拆分说明文件，让主 \`SKILL.md\` 不至于过于臃肿，利用载入机制进行组装。
- \`evals/\` 与 \`scripts/\`：用于测试能力边界和验证输出准确性的专用工具。

---

## 2. 🚀 如何实装到 AI 应用？

### A. 导入到自有平台
如你的平台支持 **SKills 技能集规范**，只需将生成的 ZIP 文件在受支持的控制台中**点击上传 / 导入**，系统将自动识别 \`SKILL.md\` 中的结构。

### B. 常规系统结合 (Prompt 预配置)
如果你使用常规调用（如 OpenAI、Gemini API），可以利用以下逻辑：
1. **读取根级 SKILL.md**，放入 AI 的 \`System Instruction\` (系统指令)。
2. **侦测子模块**：如果系统具备函数调用 / 工具调用机制，将 \`scripts\` 中的脚本解析进去作为工具。
3. **加载 Reference**：提取 \`references/\` 文件夹的信息，构建基于 RAG 的补充知识库，保证长文本不溢出。

---

## 3. 🛡️ 测试与评估
使用包内附带的 Python 代码进行评估工作体验（需要 Python 3.8+）：
\`\`\`bash
pip install -r requirements.txt # (如果有)
python scripts/validate_skills.py
\`\`\`
验证通过后，即可安心上线。所有的边界和 Gotchas（高风险点）都在生成的 \`SKILL.md\` 体系中做了完美约束，不易发生幻觉！

\`\`\`
祝你拥有美好且规范的技能开发体验！✨ 新年快乐！
\`\`\`
`;

export function TutorialTab() {
  const [activeTab, setActiveTab] = useState<"beginner" | "advanced">("beginner");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [errorInfo, setErrorInfo] = useState("");

  const handleAskQuestion = async () => {
    if (!question.trim()) return;
    setLoadingQuestion(true);
    setAnswer("");
    setErrorInfo("");
    try {
      const response = await askTutorialQuestion(question, beginnerTutorial);
      setAnswer(response);
    } catch (e: any) {
      setErrorInfo(e.message || "提问失败，请重试");
    } finally {
      setLoadingQuestion(false);
    }
  };

  return (
    <div className="bg-ny-paper rounded-xl shadow-lg border border-ny-gold/30 p-8 max-w-4xl mx-auto flex flex-col h-[calc(100vh-180px)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-4 mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <BookOpen className="w-8 h-8 text-ny-red mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">详细部署教程</h2>
        </div>
        <div className="flex space-x-2">
            <button 
                onClick={() => setActiveTab("beginner")}
                className={cn("px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center", activeTab === "beginner" ? "bg-ny-red text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}
            >
                <GraduationCap className="w-4 h-4 mr-2" />
                小白零基础教程
            </button>
            <button 
                onClick={() => setActiveTab("advanced")}
                className={cn("px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center", activeTab === "advanced" ? "bg-ny-red text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}
            >
                <ChevronRight className="w-4 h-4 mr-1" />
                专业高级教程
            </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-4 pb-12 flex flex-col">
        <div className="markdown-body prose max-w-none text-gray-700 
            prose-headings:text-ny-red-dark prose-a:text-ny-red prose-strong:text-ny-red-dark
            prose-code:text-ny-red prose-code:bg-ny-red/5 prose-code:px-1 prose-code:rounded
            prose-pre:bg-gray-800 prose-pre:text-gray-100 prose-img:rounded-xl prose-img:border prose-img:border-gray-200 prose-img:shadow-sm
        ">
          <Markdown>{activeTab === "beginner" ? beginnerTutorial : advancedTutorial}</Markdown>
        </div>
        
        {activeTab === "beginner" && (
          <div className="mt-12 bg-gray-50 border border-gray-200 rounded-xl p-6 relative flex flex-col shrink-0">
            <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
               <MessageCircle className="w-5 h-5 mr-2 text-ny-red" />
               对教程有疑问？向 AI 提问
            </h3>
            <p className="text-sm text-gray-500 mb-4">如果您在阅读以上教程时遇到了难以理解的地方，欢迎随时向智能助手提问。</p>
            
            <div className="flex space-x-3 mb-4">
               <input
                 type="text"
                 className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-ny-red focus:ring-1 focus:ring-ny-red text-sm"
                 placeholder="例如：我找不到在哪里上传文件..."
                 value={question}
                 onChange={(e) => setQuestion(e.target.value)}
                 onKeyDown={(e) => {
                   if (e.key === 'Enter') handleAskQuestion();
                 }}
                 disabled={loadingQuestion}
               />
               <button
                 onClick={handleAskQuestion}
                 disabled={loadingQuestion || !question.trim()}
                 className="px-6 py-2 bg-ny-red hover:bg-ny-red-dark text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center disabled:opacity-50"
               >
                 {loadingQuestion ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4 mr-2" /> 发送</>}
               </button>
            </div>
            {errorInfo && <p className="text-red-500 text-xs mt-1 mb-2">{errorInfo}</p>}
            
            {answer && (
               <div className="bg-white border-l-4 border-ny-red p-4 rounded-r-lg mt-2 text-sm text-gray-700 whitespace-pre-wrap shadow-sm">
                 <Markdown>{answer}</Markdown>
               </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
