import { builtInSkills } from "../data/skills";
import { Search, Sparkles, Download, Clock, X, Star, CheckCircle as CheckCircleIcon, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { generateSkillPackage } from "../services/gemini";
import { downloadPackage } from "../lib/packager";
import { cn } from "../lib/utils";

export function LibraryTab() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("全部");
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'} | null>(null);
  
  const showToast = (msg: string, type: 'success'|'error') => {
    setToast({msg, type});
    setTimeout(() => setToast(null), 3000);
  };

  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem("skill_favorites");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
        const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
        localStorage.setItem("skill_favorites", JSON.stringify(next));
        return next;
    });
  };
  
  // Search history state
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("skill_search_history");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const categories = ["全部", ...Array.from(new Set(builtInSkills.map((s) => s.category)))];

  const filtered = builtInSkills.filter((s) => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "全部" || s.category === category;
    const matchFav = showFavoritesOnly ? favorites.includes(s.id) : true;
    return matchSearch && matchCat && matchFav;
  });

  const handleApplySkill = async (skill: any) => {
    if (loadingId) return;
    setLoadingId(skill.id);
    try {
        const result = await generateSkillPackage(skill.title + ": " + skill.description);
        await downloadPackage(skill.title, result);
        showToast("生成并打包成功！", "success");
    } catch (e: any) {
        showToast(e.message || "生成失败", "error");
    } finally {
        setLoadingId(null);
    }
  };

  const handleSearchCommit = (term: string) => {
    if (!term.trim()) return;
    setSearch(term);
    setSearchHistory((prev: string[]) => {
      const updated = [term, ...prev.filter(t => t !== term)].slice(0, 10);
      localStorage.setItem("skill_search_history", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="bg-ny-paper rounded-xl shadow-lg border border-ny-gold/30 p-6 h-[calc(100vh-180px)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-ny-red-dark flex items-center shrink-0">
            <Sparkles className="w-6 h-6 mr-2 text-ny-gold-dark" />
            内置 1000+ 海量技能库
        </h2>
        <div className="flex flex-col w-full md:w-auto self-stretch md:self-auto">
          <div className="flex gap-2">
            <button
               onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
               className={cn("px-3 py-2 rounded-lg border text-sm font-medium transition-colors shrink-0 flex items-center", showFavoritesOnly ? "bg-amber-100 border-amber-300 text-amber-700" : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100")}
            >
               <Star className={cn("w-4 h-4 mr-1", showFavoritesOnly ? "fill-amber-500 text-amber-500" : "text-gray-400")} /> 收藏
            </button>
            <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="输入并按回车搜索技能..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === 'Enter') {
                            handleSearchCommit(search);
                        }
                    }}
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-ny-red text-sm"
                />
            </div>
            <select 
              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-ny-red shrink-0"
              value={category}
              onChange={e => setCategory(e.target.value)}
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          {searchHistory.length > 0 && (
             <div className="flex flex-wrap items-center gap-2 mt-3 p-1">
                <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <span className="text-xs text-gray-500 mr-1">搜索记录:</span>
                {searchHistory.map((term, idx) => (
                    <button
                        key={idx}
                        title="点击搜索"
                        onClick={() => { setSearch(term); handleSearchCommit(term); }}
                        className="text-xs font-medium bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full transition-colors truncate max-w-[120px]"
                    >
                        {term}
                    </button>
                ))}
                <button
                    onClick={() => { setSearchHistory([]); localStorage.removeItem("skill_search_history"); }}
                    className="text-xs text-ny-red hover:text-ny-red-dark flex items-center ml-auto"
                >
                    <X className="w-3 h-3 mr-0.5" />
                    清除历史
                </button>
             </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((skill) => (
                <div key={skill.id} className="border border-ny-gold/20 rounded-lg p-5 hover:border-ny-red hover:shadow-md transition-all flex flex-col bg-white">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-semibold px-2 py-1 bg-ny-red/10 text-ny-red-dark rounded-md">
                            {skill.category}
                        </span>
                        <div className="flex items-center space-x-2">
                           <skill.icon className="w-5 h-5 text-ny-gold-dark" />
                           <button onClick={() => toggleFavorite(skill.id)} className="text-gray-300 hover:text-amber-500 transition-colors" title="收藏">
                              <Star className={cn("w-5 h-5", favorites.includes(skill.id) ? "fill-amber-500 text-amber-500" : "")} />
                           </button>
                        </div>
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2 truncate">{skill.title}</h3>
                    <p className="text-xs text-gray-500 mb-4 line-clamp-2 flex-1">{skill.description}</p>
                    <button 
                        onClick={() => handleApplySkill(skill)}
                        disabled={loadingId === skill.id}
                        className="w-full py-2 bg-gray-50 hover:bg-ny-bg border border-ny-gold/50 text-ny-red-dark rounded font-medium text-sm transition-colors flex justify-center items-center"
                    >
                        {loadingId === skill.id ? "打包中..." : (
                            <><Download className="w-4 h-4 mr-1" /> 云端打包</>
                        )}
                    </button>
                </div>
            ))}
            {filtered.length === 0 && (
                <div className="col-span-full py-12 text-center text-gray-400">
                    没有找到符合条件的技能 🏮
                </div>
            )}
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={cn("fixed bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-xl text-white text-sm font-medium transition-all z-[100] flex items-center animate-in fade-in slide-in-from-bottom-5", toast.type === 'success' ? 'bg-green-600' : 'bg-red-600')}>
            {toast.type === 'success' ? <CheckCircleIcon className="w-4 h-4 mr-2" /> : <AlertCircle className="w-4 h-4 mr-2" />}
            {toast.msg}
        </div>
      )}
    </div>
  );
}
