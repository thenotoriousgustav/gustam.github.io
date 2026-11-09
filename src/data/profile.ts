export const PROFILE = {
  home: {
    introTitle: "Gustam. Software engineer.",
    introDescription:
      "I build accessible web products and AI-powered applications for government and enterprise teams, with 4+ years in software engineering.",
    studyCaption:
      "Based in Jakarta. Information Systems graduate, Universitas Gunadarma (2025).",
  },
  introduction: [
    "I’m Gustam Rheza Mahendra, a software engineer based in Jakarta with over four years of experience in software engineering and AI-driven solutions.",
    "I build government and enterprise products with Next.js, React, Angular, and TypeScript. My work spans e-commerce platforms, event management, correspondence tracking, and AI-powered examination systems, with a focus on clean architecture, accessibility, security, and scalability.",
  ],
  education: [
    "Universitas Gunadarma — Depok, Indonesia",
    "Bachelor of Information Systems, 2021–2025. GPA 3.70/4.00.",
    "Coursework: Enterprise Architecture, Information Systems Audit, Information Systems Security, Decision Support Systems, ERP, IT Governance, and Artificial Intelligence.",
    "",
    "SMK Negeri 2 Jakarta — Jakarta, Indonesia",
    "Vocational Software Engineering, 2018–2021.",
    "Coursework: web, mobile and desktop development, databases, object-oriented programming, algorithms, UI/UX design, and software testing.",
  ].join("\n"),
  certifications: [
    "Master Angular — Udemy, December 2025",
    "System Analyst — BNSP, August 2025",
    "Developing Applications for iOS — Stanford CS193p, February 2024",
    "iOS App Development Bootcamp — Udemy, March 2023",
    "JavaScript Algorithms and Data Structures — freeCodeCamp, December 2022",
    "Responsive Design — freeCodeCamp, August 2022",
    "Front-End Development — Meta, August 2022",
    "KKNI Level II Software Engineering — BNSP, August 2021",
  ].join("\n"),
  skills: [
    {
      category: "Programming",
      items: "TypeScript, JavaScript, Swift, Go, Java, C#, HTML, CSS",
    },
    {
      category: "Web & mobile frameworks",
      items:
        "Next.js, React, Angular, Vue, React Native, SwiftUI, Tailwind CSS, Chakra UI, shadcn/ui",
    },
    {
      category: "Backend & databases",
      items:
        "Express.js, NestJS, Spring Boot, .NET, MongoDB, MySQL, PostgreSQL, Supabase, Firebase, Prisma, Drizzle ORM",
    },
    { category: "State & testing", items: "Zustand, Redux, Jest" },
    {
      category: "Deployment",
      items:
        "Coolify, Vercel, Netlify, Cloudflare R2, AWS S3 & EC2, DigitalOcean, CI/CD",
    },
    {
      category: "Developer tools",
      items:
        "Git, Jira, VS Code, Xcode, IntelliJ IDEA, DataGrip, npm, pnpm, Yarn, Homebrew",
    },
  ],
  languages: "Indonesian — Native\nEnglish — Professional working proficiency",
};

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
  { name: "Claude Code", url: "https://www.claude.com/product/claude-code", icon: "/tools/claude-code.png", preview: "/tools/claude-code.jpg" },
];
