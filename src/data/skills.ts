import {
  Wand2, Code, PenTool, Briefcase, Scale, FileText, Video, Terminal, PieChart, Heart,
  Bot, GraduationCap, Users, Palette, ShieldCheck, Dumbbell, Megaphone, Zap, Sparkles, Lightbulb, Camera,
  LucideIcon
} from "lucide-react";

export type SkillType = {
  id: number;
  title: string;
  category: string;
  description: string;
  icon: LucideIcon;
};

export const builtInSkills: SkillType[] = [
  { id: 1, title: '反推提示词大师', category: 'AIGC', description: '专业反推任意图片的生成提示词，附带各平台参数调整。', icon: Wand2 },
  { id: 2, title: 'Python架构师', category: '开发', description: '代码Review，结构优化，高级Python应用架构搭建。', icon: Code },
  { id: 3, title: '文案营销爆款机', category: '营销', description: '自动根据产品生成小红书、抖音等平台的高转化文案。', icon: PenTool },
  { id: 4, title: '商业计划书向导', category: '商业', description: '提供专业的商业计划结构分析和行业调研生成。', icon: Briefcase },
  { id: 5, title: '法律文书起草', category: '法务', description: '依据输入情况，起草标准、严谨的商业法律文书。', icon: Scale },
  { id: 6, title: '简历包装专家', category: '职场', description: '让普通简历脱颖而出，精修项目经历与个人自述。', icon: FileText },
  { id: 7, title: '短视频脚本生成', category: '自媒体', description: '自动规划镜头、画面、时间、旁白等剧本内容。', icon: Video },
  { id: 8, title: '全栈React工程师', category: '开发', description: '通过简单的需求描述，输出高质量的React组件。', icon: Terminal },
  { id: 9, title: '数据分析报告专家', category: '数据', description: '输入原始数据特征，输出精美专业的数据洞察报告。', icon: PieChart },
  { id: 10, title: '心灵治愈导师', category: '心理', description: '提供温柔冷静的心理咨询与沟通策略。', icon: Heart },
  { id: 11, title: '阴阳怪气嘴替专家', category: '沟通', description: '提供幽默、讽刺、逻辑严密的高情商回怼文案，替你怼人。', icon: Bot },
  { id: 12, title: '小红书自动发作品', category: '自媒体', description: '根据上传的视频/图片内容，自动写上对应的爆款网感文案、标签和热门话题。', icon: Camera },
];

const templates = [
  { c: 'AI', n: '智能自动化处理', icon: Bot, desc: '自动化处理复杂工作流' },
  { c: '教育', n: 'K12 课程辅导', icon: GraduationCap, desc: '提供个性化教育方案' },
  { c: '运营', n: '社群裂变策略', icon: Users, desc: '高转换率的社群管理策略' },
  { c: '设计', n: 'UI/UX 交互优化', icon: Palette, desc: '提升产品用户体验' },
  { c: '法务', n: '合同及合规审查', icon: ShieldCheck, desc: '快速定位合同风险' },
  { c: '健康', n: '个性化健身饮食', icon: Dumbbell, desc: '定制化健康管理系统' },
  { c: '自媒体', n: '爆款标题生成', icon: Megaphone, desc: '提升内容点击率' },
  { c: '效率', n: '工作流提速专家', icon: Zap, desc: '消除工作瓶颈，提升产出' },
  { c: '策划', n: '活动创意发散', icon: Sparkles, desc: '为大型活动提供创意点子' },
  { c: '摄影', n: '商业摄影构图指导', icon: Camera, desc: '专业级打光与构图拆解' }
];

for(let i = 13; i <= 1000; i++) {
    const template = templates[i % templates.length];
    builtInSkills.push({
        id: i,
        title: `${template.n} V${Math.floor(i/10)}.${i%10}`,
        category: template.c,
        description: `这是第 ${i} 款爆款技能：${template.desc}，适用于${template.c}领域的深度应用与实战。`,
        icon: template.icon
    });
}
