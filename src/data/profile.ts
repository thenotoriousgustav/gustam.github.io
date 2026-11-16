/**
 * "Tools I use" on the home page. `icon` and `preview` live in public/tools/
 * (previews are 800px-wide screenshots of each tool's homepage).
 */
export const TOOLS = [
  { name: "VS Code", url: "https://code.visualstudio.com/", icon: "/tools/vscode.png", preview: "/tools/vscode.jpg" },
  { name: "Xcode", url: "https://developer.apple.com/xcode/", icon: "/tools/xcode.png", preview: "/tools/xcode.jpg" },
  { name: "IntelliJ IDEA", url: "https://www.jetbrains.com/idea/", icon: "/tools/intellij-idea.svg", preview: "/tools/intellij-idea.jpg" },
  { name: "DataGrip", url: "https://www.jetbrains.com/datagrip/", icon: "/tools/datagrip.svg", preview: "/tools/datagrip.jpg" },
  { name: "Git", url: "https://git-scm.com/", icon: "/tools/git.svg", preview: "/tools/git.jpg" },
  { name: "Jira", url: "https://www.atlassian.com/software/jira", icon: "/tools/jira.svg", preview: "/tools/jira.jpg" },
  { name: "pnpm", url: "https://pnpm.io/", icon: "/tools/pnpm.svg", preview: "/tools/pnpm.jpg" },
];

/** "AI I use" on the home page. `icon` and `preview` live in public/ai/ (800x500 homepage screenshots). */
export const AI_TOOLS = [
  { name: "Claude", url: "https://claude.ai/", icon: "/ai/claude.svg", preview: "/ai/claude.jpg" },
  { name: "Claude Code", url: "https://www.claude.com/product/claude-code", icon: "/tools/claude-code.png", preview: "/tools/claude-code.jpg" },
  { name: "ChatGPT", url: "https://chatgpt.com/", icon: "/ai/chatgpt.svg", preview: "/ai/chatgpt.jpg" },
  { name: "Antigravity", url: "https://antigravity.google/", icon: "/ai/antigravity.png", preview: "/ai/antigravity.jpg" },
  { name: "GitHub Copilot", url: "https://github.com/features/copilot", icon: "/ai/github-copilot.svg", preview: "/ai/github-copilot.jpg" },
  { name: "Google Stitch", url: "https://stitch.withgoogle.com/", icon: "/ai/google-stitch.png", preview: "/ai/google-stitch.jpg" },
  { name: "pen.dev", url: "https://pen.dev/", icon: "/ai/pen-dev.png", preview: "/ai/pen-dev.jpg" },
  { name: "NotebookLM", url: "https://notebooklm.google/", icon: "/ai/notebooklm.svg", preview: "/ai/notebooklm.jpg" },
];

/** "Research & papers" on the home page, from each paper's cover and abstract. `project` links to the work page the research became. */
export const PAPERS = [
  {
    type: "Undergraduate thesis",
    year: 2025,
    title: "Pengembangan Aplikasi Manajemen Lamaran Pekerjaan dengan Analisis Resume dan Pembuatan Surat Lamaran Otomatis Berbasis Artificial Intelligence",
    english: "Development of a job application management app with AI-based resume analysis and automatic cover letter generation",
    summary: "A web app that scores how well a resume matches a job description, lists missing and present keywords with concrete suggestions, drafts a tailored cover letter, and keeps every application in one tracker. Built with Next.js 15, Supabase and GPT-4o mini, and validated with black-box testing and user acceptance testing.",
    institution: "Universitas Gunadarma, Information Systems",
    supervisor: "Dr. Tristyanti Yusnitasari, SKom., MMSI.",
    project: { title: "Silamar", slug: "silamar" },
  },
  {
    type: "Scientific paper",
    year: 2024,
    title: "Implementasi Artificial Intelligence ke dalam Computer Assisted Test untuk Mendeteksi Kecurangan saat Ujian",
    english: "Implementing artificial intelligence in a computer-assisted test to detect cheating during exams",
    summary: "An online exam system that watches for participant switching, forbidden objects and talking during a test, using face detection and recognition, object detection and voice activity detection in the browser (TensorFlow.js, face-api.js). Built with Next.js, NestJS and PostgreSQL.",
    institution: "Universitas Gunadarma, Information Systems",
    supervisor: "Agry Alfiah, ST., MMSI.",
    project: { title: "Evaluation CAT", slug: "evaluation-cat" },
  },
];
