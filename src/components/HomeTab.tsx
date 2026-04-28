import { useState, useRef } from "react";
import { generateSkillPackage } from "../services/gemini";
import { downloadPackage } from "../lib/packager";
import { Loader2, Download, CheckCircle, FileText, ChevronRight, ChevronDown, Dices, Copy, Check, Upload } from "lucide-react";
import Markdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";
import { builtInSkills } from "../data/skills";
import { WaveBackground } from "./WaveBackground";
import JSZip from "jszip";

export function HomeTab() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState("");
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [expandedDirs, setExpandedDirs] = useState<Record<string, boolean>>({"root": true});
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const quickTags = [
    "Midjourney 提示词专家", 
    "小红书爆款文案高手", 
    "Python 资深架构师", 
    "商业企划书金牌导师",
    "UI/UX 交互走查体验官"
  ];

  const handleRandomSkill = () => {
    const randomSkill = builtInSkills[Math.floor(Math.random() * builtInSkills.length)];
    setTopic(`${randomSkill.title}：${randomSkill.description}`);
  };

  const handleCopy = () => {
    if (activeFile && result && result[activeFile]) {
        navigator.clipboard.writeText(result[activeFile]);
        setCopiedFile(activeFile);
        setTimeout(() => setCopiedFile(null), 2000);
    }
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("请输入要生成的技能主题！");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    setActiveFile(null);
    try {
      const generatedFiles = await generateSkillPackage(topic);
      setResult(generatedFiles);
      if (Object.keys(generatedFiles).length > 0) {
          setActiveFile(Object.keys(generatedFiles)[0]);
      }
    } catch (e: any) {
      setError(e.message || "生成失败，请重试。");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!result) return;
    try {
      await downloadPackage(topic || "skill-package", result);
    } catch (e) {
      alert("打包失败!");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError("");
    
    try {
      const isZip = file.name.endsWith('.zip');
      const filesRecord: Record<string, string> = {};
      
      if (isZip) {
        const zip = new JSZip();
        const loadedZip = await zip.loadAsync(file);
        
        for (const [relativePath, zipEntry] of Object.entries(loadedZip.files)) {
          if (!zipEntry.dir && !relativePath.includes('__MACOSX')) {
            const content = await zipEntry.async('string');
            filesRecord[relativePath] = content;
          }
        }
      } else {
        const text = await file.text();
        filesRecord[file.name] = text;
      }
      
      if (Object.keys(filesRecord).length > 0) {
        setResult(filesRecord);
        // Automatically focus SKILL.md if present, else first file
        const skillFile = Object.keys(filesRecord).find(f => f.includes('SKILL.md'));
        setActiveFile(skillFile || Object.keys(filesRecord)[0]);
        setTopic(file.name.replace(/\.[^/.]+$/, ""));
      } else {
        setError("文件中未找到有效内容。");
      }
    } catch (err: any) {
      setError("文件读取或解压失败：" + (err.message || String(err)));
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Helper to build file tree
  const buildTree = (files: Record<string,string>) => {
      const root: any = {};
      Object.keys(files).forEach(path => {
          const parts = path.split('/');
          let current = root;
          parts.forEach((part, i) => {
              if (i === parts.length - 1) {
                  current[part] = path; // Leaf node stores full path
              } else {
                  if (!current[part]) current[part] = {};
                  current = current[part];
              }
          })
      });
      return root;
  }

  const toggleDir = (dirPrefix: string) => {
      setExpandedDirs(prev => ({...prev, [dirPrefix]: !prev[dirPrefix]}));
  };

  const renderTree = (node: any, prefix = "") => {
      return Object.entries(node).map(([key, value]) => {
          const nodePath = prefix ? `${prefix}/${key}` : key;
          const isDir = typeof value === 'object';
          
          if (isDir) {
              const isExpanded = expandedDirs[nodePath];
              return (
                  <div key={nodePath} className="ml-4">
                      <div 
                        className="flex items-center space-x-1 cursor-pointer py-1 font-medium text-amber-900 hover:text-ny-red"
                        onClick={() => toggleDir(nodePath)}
                      >
                          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          <span>{key}</span>
                      </div>
                      <AnimatePresence>
                          {isExpanded && (
                            <motion.div 
                                initial={{height: 0, opacity: 0}} 
                                animate={{height: 'auto', opacity: 1}} 
                                exit={{height: 0, opacity: 0}}
                                className="overflow-hidden"
                            >
                                {renderTree(value, nodePath)}
                            </motion.div>
                          )}
                      </AnimatePresence>
                  </div>
              )
          } else {
              const filePath = value as string;
              return (
                   <div 
                      key={filePath} 
                      className={cn(
                          "ml-8 flex items-center space-x-2 py-1 px-2 cursor-pointer rounded-sm border-l-2 text-sm",
                          activeFile === filePath ? "border-ny-red bg-ny-red/5 text-ny-red-dark font-medium" : "border-transparent hover:bg-black/5 text-gray-700"
                      )}
                      onClick={() => setActiveFile(filePath)}
                    >
                        <FileText className="w-3.5 h-3.5" />
                        <span>{key}</span>
                    </div>
              )
          }
      });
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="wave-border rounded-xl shadow-lg z-10 w-full">
        <div className="bg-ny-paper rounded-[0.65rem] p-6 relative overflow-hidden h-full z-20">
          <WaveBackground />
          {/* Festive decoration */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-ny-red opacity-10 rounded-bl-full" />
          <div className="relative z-10">
            <h2 className="text-xl font-bold text-ny-red-dark mb-2 flex items-center">
                <span className="mr-2">🎊</span> 创造你的专属万能技能包
          </h2>
          <p className="text-gray-600 mb-6 text-sm">
            只需输入你的需求主题，AI将利用框架为你生成极度专业的全套代码结构和配置规范。
          </p>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <div className="relative flex-1 bg-white rounded-lg shadow-sm">
              <input
                type="text"
                className="w-full bg-transparent border border-ny-gold/40 focus:border-ny-red focus:ring-1 focus:ring-ny-red rounded-lg pl-4 pr-12 py-3 outline-none transition-shadow text-gray-800"
                placeholder="例如: 反推这张图的提示词、Python 高级代码审查员..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={loading}
              />
              <button
                onClick={handleRandomSkill}
                type="button"
                title="随机掷取爆款技能"
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-ny-gold-dark hover:text-ny-red hover:bg-ny-red/10 rounded-full transition-colors disabled:opacity-50"
              >
                <Dices className="w-6 h-6" />
              </button>
            </div>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="bg-ny-red hover:bg-ny-red-dark text-white font-medium rounded-lg px-8 py-3 flex items-center justify-center transition-colors shadow-md disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  正在生成...
                </>
              ) : (
                "一键生成"
              )}
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="bg-white hover:bg-gray-50 text-ny-red border border-ny-red font-medium rounded-lg px-4 py-3 flex items-center justify-center transition-colors shadow-sm disabled:opacity-70 flex-shrink-0"
              title="导入已有技能包ZIP或文件"
            >
              <Upload className="w-5 h-5" />
            </button>
            <input 
              type="file" 
              accept=".zip,.md,.txt" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
            />
          </div>
          {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}
          
          <div className="flex flex-wrap gap-2 mt-5">
            {quickTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setTopic(tag)}
                className="text-xs bg-ny-red/5 text-ny-red hover:bg-ny-red/10 border border-ny-red/20 px-3 py-1.5 rounded-full transition-colors font-medium"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>


      {result && (
        <motion.div 
            initial={{opacity: 0, y: 20}} 
            animate={{opacity: 1, y: 0}}
            className="flex flex-col md:flex-row gap-6 h-[600px]"
        >
          {/* File Tree */}
          <div className="w-full md:w-1/3 bg-ny-paper rounded-xl shadow-lg border border-ny-gold/30 overflow-y-auto p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
                <h3 className="font-bold text-gray-800 flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    生成成功
                </h3>
            </div>
            <div className="flex-1 overflow-y-auto -ml-4">
               {renderTree(buildTree(result))}
            </div>
            
            <button
                onClick={handleDownload}
                className="mt-4 bg-ny-gold hover:bg-ny-gold-dark text-ny-red-dark font-bold rounded-lg px-4 py-3 flex items-center justify-center transition-colors shadow-sm"
              >
                <Download className="w-5 h-5 mr-2" />
                一键打包下载 (ZIP)
            </button>
          </div>

          {/* File Viewer */}
          <div className="w-full md:w-2/3 bg-ny-paper rounded-xl shadow-lg border border-ny-gold/30 flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                <span className="font-mono text-sm text-ny-red-dark">{activeFile || '选择一个文件查看'}</span>
                {activeFile && result[activeFile] && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center text-xs text-gray-500 hover:text-ny-red transition-colors"
                  >
                    {copiedFile === activeFile ? (
                      <><Check className="w-4 h-4 mr-1 text-green-500" /> <span className="text-green-500">已复制</span></>
                    ) : (
                      <><Copy className="w-4 h-4 mr-1" /> 一键复制</>
                    )}
                  </button>
                )}
            </div>
            <div className="p-6 overflow-y-auto flex-1 font-sans">
              {activeFile && result[activeFile] ? (
                  activeFile.endsWith('.md') ? (
                    <div className="markdown-body prose prose-sm max-w-none prose-headings:text-ny-red-dark prose-a:text-ny-red">
                       <Markdown>{result[activeFile]}</Markdown>
                    </div>
                  ) : (
                    <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono whitespace-pre-wrap">
                      <code>{result[activeFile]}</code>
                    </pre>
                  )
              ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                      请在左侧选择文件
                  </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
