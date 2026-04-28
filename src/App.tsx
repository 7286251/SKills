import { useState } from "react";
import { HomeTab } from "./components/HomeTab";
import { LibraryTab } from "./components/LibraryTab";
import { TutorialTab } from "./components/TutorialTab";
import { Sparkles, Library, BookText } from "lucide-react";
import { cn } from "./lib/utils";

type Tab = "home" | "library" | "tutorial";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("home");

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="bg-gradient-to-r from-cyan-400 via-yellow-300 to-pink-400 text-white shadow-lg relative overflow-hidden border-b-4 border-white/40">
        <div className="absolute top-0 right-0 opacity-20 pointer-events-none">
           <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="m16 12-4-4-4 4"></path><path d="M12 16V8"></path></svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-ny-gold rounded-full flex items-center justify-center text-ny-red-dark font-bold text-xl shadow-inner">
                SK
              </div>
              <h1 className="text-2xl font-black tracking-tight tracking-wider text-ny-paper">
                SKills 助手 <span className="text-sm border ml-2 border-ny-gold text-ny-gold px-2 py-0.5 rounded-full font-normal">新年贺岁版</span>
              </h1>
            </div>
            
            <nav className="flex space-x-3 sm:space-x-6">
              <button 
                onClick={() => setActiveTab("home")}
                className={cn("flex items-center px-4 py-2 text-sm sm:text-base font-medium", activeTab === "home" ? "neu-button-active text-white" : "neu-button text-ny-paper/80 hover:text-white")}
              >
                <Sparkles className="w-4 h-4 mr-1.5" /> 创作与生成
              </button>
              <button 
                onClick={() => setActiveTab("library")}
                className={cn("flex items-center px-4 py-2 text-sm sm:text-base font-medium", activeTab === "library" ? "neu-button-active text-white" : "neu-button text-ny-paper/80 hover:text-white")}
              >
                <Library className="w-4 h-4 mr-1.5" /> 技能库(500+)
              </button>
              <button 
                onClick={() => setActiveTab("tutorial")}
                className={cn("flex items-center px-4 py-2 text-sm sm:text-base font-medium", activeTab === "tutorial" ? "neu-button-active text-white" : "neu-button text-ny-paper/80 hover:text-white")}
              >
                <BookText className="w-4 h-4 mr-1.5" /> 部署教程
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          {activeTab === "home" && <HomeTab />}
          {activeTab === "library" && <LibraryTab />}
          {activeTab === "tutorial" && <TutorialTab />}
      </main>
    </div>
  );
}
