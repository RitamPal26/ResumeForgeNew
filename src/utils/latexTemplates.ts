export interface LaTeXTemplate {
  id: string;
  name: string;
  description: string;
  category: 'classic' | 'modern' | 'creative' | 'academic' | 'minimalist';
  content: string;
}

export const LATEX_TEMPLATES: LaTeXTemplate[] = [
  {
    id: 'classic-professional',
    name: 'Classic Professional',
    description: 'Traditional resume format with clean typography',
    category: 'classic',
    content: `\\documentclass[letterpaper,11pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[margin=0.75in]{geometry}
\\usepackage{enumitem}
\\usepackage{fancyhdr}
\\usepackage{xcolor}

\\pagestyle{fancy}
\\fancyhf{}
\\renewcommand{\\headrulewidth}{0pt}

\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{0pt}

\\begin{document}

\\begin{center}
    {\\Large \\textbf{John Doe}} \\\\
    \\vspace{2pt}
    Software Engineer \\\\
    \\vspace{2pt}
    Email: john.doe@email.com | Phone: (555) 123-4567 \\\\
    LinkedIn: linkedin.com/in/johndoe | GitHub: github.com/johndoe
\\end{center}

\\vspace{10pt}

\\textbf{\\large PROFESSIONAL SUMMARY}
\\hrule
\\vspace{5pt}

Experienced software engineer with 5+ years developing scalable web applications and leading cross-functional teams. Proficient in modern JavaScript frameworks, cloud technologies, and agile methodologies.

\\vspace{10pt}

\\textbf{\\large EXPERIENCE}
\\hrule
\\vspace{5pt}

\\textbf{Senior Software Engineer} \\hfill \\textit{Jan 2022 - Present} \\\\
\\textit{Tech Company Inc., San Francisco, CA}
\\begin{itemize}[leftmargin=20pt, topsep=3pt, itemsep=1pt]
    \\item Led development of React-based customer portal serving 10,000+ users
    \\item Improved application performance by 40\\% through code optimization
    \\item Mentored 3 junior developers and conducted technical interviews
    \\item Collaborated with product managers to define technical requirements
\\end{itemize}

\\vspace{5pt}

\\textbf{Software Engineer} \\hfill \\textit{Jun 2020 - Dec 2021} \\\\
\\textit{Startup Solutions, Austin, TX}
\\begin{itemize}[leftmargin=20pt, topsep=3pt, itemsep=1pt]
    \\item Developed RESTful APIs using Node.js and Express
    \\item Implemented automated testing reducing bugs by 60\\%
    \\item Worked with DevOps team to deploy applications on AWS
\\end{itemize}

\\vspace{10pt}

\\textbf{\\large EDUCATION}
\\hrule
\\vspace{5pt}

\\textbf{Bachelor of Science in Computer Science} \\hfill \\textit{May 2020} \\\\
\\textit{University of California, Berkeley}

\\vspace{10pt}

\\textbf{\\large TECHNICAL SKILLS}
\\hrule
\\vspace{5pt}

\\textbf{Languages:} JavaScript, TypeScript, Python, Java \\\\
\\textbf{Frameworks:} React, Node.js, Express, Django \\\\
\\textbf{Tools:} Git, Docker, AWS, MongoDB, PostgreSQL \\\\
\\textbf{Other:} Agile, TDD, RESTful APIs, Microservices

\\end{document}`
  },
  {
    id: 'modern-tech',
    name: 'Modern Tech',
    description: 'Contemporary design with color accents for tech professionals',
    category: 'modern',
    content: `\\documentclass[letterpaper,11pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[margin=0.6in]{geometry}
\\usepackage{enumitem}
\\usepackage{xcolor}
\\usepackage{fontawesome5}
\\usepackage{titlesec}

\\definecolor{primary}{HTML}{2563EB}
\\definecolor{secondary}{HTML}{64748B}

\\titleformat{\\section}{\\large\\bfseries\\color{primary}}{}{0em}{}[\\color{primary}\\titlerule]

\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{0pt}

\\begin{document}

\\begin{center}
    {\\huge \\textbf{\\color{primary}Jane Smith}} \\\\
    \\vspace{8pt}
    {\\Large Full Stack Developer} \\\\
    \\vspace{8pt}
    \\faEnvelope \\; jane.smith@email.com \\quad
    \\faPhone \\; (555) 987-6543 \\quad
    \\faLinkedin \\; linkedin.com/in/janesmith \\quad
    \\faGithub \\; github.com/janesmith
\\end{center}

\\vspace{15pt}

\\section{About Me}

Passionate full-stack developer with expertise in modern web technologies and cloud infrastructure. I love creating efficient, scalable solutions and contributing to open-source projects.

\\section{Experience}

\\textbf{Lead Full Stack Developer} \\hfill {\\color{secondary}\\textit{Mar 2023 - Present}} \\\\
\\textit{InnovateHub, Remote}
\\begin{itemize}[leftmargin=15pt, topsep=2pt, itemsep=1pt]
    \\item Architected microservices platform handling 1M+ API requests daily
    \\item Built React/Next.js applications with 99.9\\% uptime
    \\item Implemented CI/CD pipelines reducing deployment time by 75\\%
    \\item Led technical decisions for team of 8 developers
\\end{itemize}

\\vspace{8pt}

\\textbf{Senior Frontend Developer} \\hfill {\\color{secondary}\\textit{Aug 2021 - Feb 2023}} \\\\
\\textit{Digital Agency Pro, New York, NY}
\\begin{itemize}[leftmargin=15pt, topsep=2pt, itemsep=1pt]
    \\item Developed responsive web applications using React and TypeScript
    \\item Optimized bundle sizes resulting in 50\\% faster load times
    \\item Collaborated with UX designers to implement pixel-perfect designs
\\end{itemize}

\\section{Projects}

\\textbf{E-commerce Platform} \\hfill {\\color{secondary}\\textit{React, Node.js, PostgreSQL}} \\\\
Full-featured online store with payment processing, inventory management, and admin dashboard. Deployed on AWS with auto-scaling capabilities.

\\vspace{4pt}

\\textbf{Task Management App} \\hfill {\\color{secondary}\\textit{Next.js, Prisma, Supabase}} \\\\
Real-time collaborative task manager with advanced filtering and team collaboration features. Used by 500+ active users.

\\section{Education}

\\textbf{Master of Science in Computer Science} \\hfill {\\color{secondary}\\textit{2021}} \\\\
\\textit{Stanford University} \\\\
Specialization in Artificial Intelligence and Machine Learning

\\section{Technical Skills}

\\begin{tabular}{@{}ll@{}}
\\textbf{Frontend:} & React, Vue.js, TypeScript, Next.js, Tailwind CSS \\\\
\\textbf{Backend:} & Node.js, Python, Express, FastAPI, GraphQL \\\\
\\textbf{Database:} & PostgreSQL, MongoDB, Redis, Supabase \\\\
\\textbf{Cloud:} & AWS, Vercel, Docker, Kubernetes, Terraform \\\\
\\textbf{Tools:} & Git, Jest, Cypress, Figma, Linear
\\end{tabular}

\\end{document}`
  },
  {
    id: 'minimalist-clean',
    name: 'Minimalist Clean',
    description: 'Ultra-clean design focusing on content over decoration',
    category: 'minimalist',
    content: `\\documentclass[letterpaper,10pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[margin=0.8in]{geometry}
\\usepackage{enumitem}

\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{6pt}

\\renewcommand{\\baselinestretch}{1.15}

\\begin{document}

\\centerline{\\textbf{\\LARGE Alex Johnson}}
\\centerline{alex.johnson@email.com \\textbullet \\; +1 (555) 234-5678}
\\centerline{github.com/alexjohnson \\textbullet \\; linkedin.com/in/alexjohnson}

\\vspace{20pt}

\\textbf{EXPERIENCE}

\\textbf{Product Manager} \\\\
Acme Corp, San Francisco \\quad 2022 -- Present
\\begin{itemize}[leftmargin=0pt, label={}, topsep=0pt, itemsep=2pt]
    \\item Launched 3 major product features increasing user engagement by 35\\%
    \\item Managed cross-functional team of 12 engineers and designers
    \\item Defined product roadmap and prioritized features based on user research
    \\item Collaborated with stakeholders to align business and technical requirements
\\end{itemize}

\\textbf{Software Engineer} \\\\
Tech Startup Inc, Austin \\quad 2020 -- 2022
\\begin{itemize}[leftmargin=0pt, label={}, topsep=0pt, itemsep=2pt]
    \\item Built scalable backend services using Python and Django
    \\item Designed and implemented REST APIs serving mobile applications
    \\item Reduced system latency by 45\\% through database optimization
    \\item Participated in agile development and code review processes
\\end{itemize}

\\textbf{EDUCATION}

\\textbf{Bachelor of Science, Computer Science} \\\\
University of Texas at Austin \\quad 2016 -- 2020

\\textbf{SKILLS}

\\textbf{Technical:} Python, JavaScript, React, Django, PostgreSQL, AWS, Git

\\textbf{Product:} Roadmap Planning, User Research, A/B Testing, Analytics

\\textbf{Leadership:} Team Management, Stakeholder Communication, Strategic Planning

\\textbf{PROJECTS}

\\textbf{Open Source Task Tracker} \\quad github.com/alexjohnson/task-tracker
\\begin{itemize}[leftmargin=0pt, label={}, topsep=0pt, itemsep=2pt]
    \\item React-based project management tool with 2,000+ GitHub stars
    \\item Implements real-time collaboration using WebSockets
\\end{itemize}

\\textbf{Mobile Weather App} \\quad React Native, OpenWeather API
\\begin{itemize}[leftmargin=0pt, label={}, topsep=0pt, itemsep=2pt]
    \\item Cross-platform weather application with location-based forecasts
    \\item Published on App Store and Google Play with 4.8 star rating
\\end{itemize}

\\end{document}`
  },
  {
    id: 'creative-designer',
    name: 'Creative Designer',
    description: 'Bold design with creative layout for design professionals',
    category: 'creative',
    content: `\\documentclass[letterpaper,11pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[margin=0.5in]{geometry}
\\usepackage{xcolor}
\\usepackage{tikz}
\\usepackage{enumitem}
\\usepackage{multicol}

\\definecolor{accent}{HTML}{EC4899}
\\definecolor{dark}{HTML}{1F2937}
\\definecolor{light}{HTML}{F3F4F6}

\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{0pt}

\\begin{document}

\\begin{tikzpicture}[remember picture,overlay]
    \\fill[accent] (current page.north west) rectangle ([yshift=-1in]current page.north east);
\\end{tikzpicture}

\\vspace{0.3in}

\\begin{center}
    {\\Huge \\textbf{\\color{white}MARIA GARCIA}} \\\\
    \\vspace{4pt}
    {\\Large \\color{white}Creative Director \\& UI/UX Designer}
\\end{center}

\\vspace{0.4in}

\\begin{multicols}{2}

\\section*{\\color{accent}CONTACT}
\\color{dark}
\\textbf{Email} \\\\
maria.garcia@email.com

\\textbf{Phone} \\\\
(555) 345-6789

\\textbf{Portfolio} \\\\
mariagarcia.design

\\textbf{Location} \\\\
Los Angeles, CA

\\columnbreak

\\section*{\\color{accent}SKILLS}
\\color{dark}
\\textbf{Design Tools} \\\\
Figma, Adobe Creative Suite, Sketch, Principle

\\textbf{Development} \\\\
HTML/CSS, JavaScript, React, Tailwind CSS

\\textbf{Specialties} \\\\
Brand Identity, Web Design, Mobile UI, Prototyping

\\end{multicols}

\\section*{\\color{accent}EXPERIENCE}

\\textbf{\\large Creative Director} \\hfill \\textit{2023 - Present} \\\\
\\textit{Design Studio Pro, Los Angeles}
\\begin{itemize}[leftmargin=15pt, topsep=3pt, itemsep=2pt]
    \\item Lead creative vision for 20+ client projects across various industries
    \\item Manage team of 6 designers and oversee project timelines
    \\item Developed brand identity systems for Fortune 500 companies
    \\item Increased client satisfaction scores by 40\\% through design excellence
\\end{itemize}

\\vspace{8pt}

\\textbf{\\large Senior UI/UX Designer} \\hfill \\textit{2021 - 2023} \\\\
\\textit{Tech Innovators Inc, San Francisco}
\\begin{itemize}[leftmargin=15pt, topsep=3pt, itemsep=2pt]
    \\item Designed user interfaces for mobile app with 1M+ downloads
    \\item Conducted user research and usability testing sessions
    \\item Created design systems and component libraries
    \\item Collaborated with developers to ensure pixel-perfect implementation
\\end{itemize}

\\vspace{8pt}

\\textbf{\\large Product Designer} \\hfill \\textit{2019 - 2021} \\\\
\\textit{Startup Ventures, Austin}
\\begin{itemize}[leftmargin=15pt, topsep=3pt, itemsep=2pt]
    \\item Designed end-to-end user experiences for SaaS platform
    \\item Improved user onboarding flow resulting in 60\\% better retention
    \\item Created interactive prototypes for stakeholder presentations
\\end{itemize}

\\section*{\\color{accent}FEATURED PROJECTS}

\\textbf{E-commerce Mobile App Redesign} \\\\
Complete UX overhaul resulting in 45\\% increase in conversion rates. Led user research, wireframing, and high-fidelity design.

\\textbf{SaaS Dashboard Design System} \\\\
Comprehensive design system with 100+ components, reducing design-to-development time by 50\\%.

\\textbf{Brand Identity for FinTech Startup} \\\\
Full brand identity including logo, color palette, typography, and marketing materials. Featured in Design Awards 2024.

\\section*{\\color{accent}EDUCATION}

\\textbf{Bachelor of Fine Arts in Graphic Design} \\hfill \\textit{2019} \\\\
\\textit{Art Center College of Design, Pasadena}

\\end{document}`
  },
  {
    id: 'academic-researcher',
    name: 'Academic Researcher',
    description: 'Traditional academic CV format with detailed sections',
    category: 'academic',
    content: `\\documentclass[letterpaper,11pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[margin=1in]{geometry}
\\usepackage{enumitem}
\\usepackage{hanging}

\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{0pt}

\\begin{document}

\\begin{center}
    {\\Large \\textbf{Dr. Robert Chen}} \\\\
    \\vspace{4pt}
    Assistant Professor of Computer Science \\\\
    \\vspace{4pt}
    University of Technology \\\\
    Department of Computer Science \\\\
    \\vspace{4pt}
    Email: robert.chen@university.edu \\\\
    Phone: (555) 456-7890 \\\\
    ORCID: 0000-0000-0000-0000
\\end{center}

\\vspace{15pt}

\\section*{EDUCATION}

\\textbf{Ph.D. in Computer Science} \\hfill \\textit{2020} \\\\
\\textit{Massachusetts Institute of Technology, Cambridge, MA} \\\\
Dissertation: "Advanced Machine Learning Approaches for Natural Language Processing" \\\\
Advisor: Prof. Jane Smith

\\textbf{M.S. in Computer Science} \\hfill \\textit{2016} \\\\
\\textit{Stanford University, Stanford, CA}

\\textbf{B.S. in Computer Science, Summa Cum Laude} \\hfill \\textit{2014} \\\\
\\textit{University of California, Berkeley, CA}

\\section*{ACADEMIC APPOINTMENTS}

\\textbf{Assistant Professor} \\hfill \\textit{2021 - Present} \\\\
\\textit{Department of Computer Science, University of Technology}

\\textbf{Postdoctoral Research Fellow} \\hfill \\textit{2020 - 2021} \\\\
\\textit{AI Research Lab, Carnegie Mellon University}

\\section*{RESEARCH INTERESTS}

Machine Learning, Natural Language Processing, Deep Learning, Computational Linguistics, Artificial Intelligence

\\section*{PUBLICATIONS}

\\subsection*{Peer-Reviewed Journal Articles}

\\begin{hangparas}{1em}{1}
Chen, R., Smith, J., \\& Johnson, M. (2024). "Transformer-based Approaches for Low-Resource Language Translation." \\textit{Journal of Machine Learning Research}, 25, 1-28.

Chen, R., \\& Williams, K. (2023). "Attention Mechanisms in Neural Machine Translation: A Comprehensive Survey." \\textit{Computational Linguistics}, 49(2), 315-342.

Chen, R., Davis, L., Brown, P., \\& Smith, J. (2022). "Few-Shot Learning for Named Entity Recognition in Scientific Literature." \\textit{Nature Machine Intelligence}, 4, 567-578.
\\end{hangparas}

\\subsection*{Conference Proceedings}

\\begin{hangparas}{1em}{1}
Chen, R., \\& Thompson, A. (2024). "Scaling Language Models for Code Generation." In \\textit{Proceedings of the International Conference on Machine Learning} (pp. 1234-1245). PMLR.

Chen, R., Martinez, C., \\& Lee, S. (2023). "Multimodal Learning for Document Understanding." In \\textit{Proceedings of AAAI Conference on Artificial Intelligence} (pp. 5678-5687).
\\end{hangparas}

\\section*{GRANTS AND FUNDING}

\\textbf{NSF CAREER Award} \\hfill \\textit{2024-2029} \\\\
"Advancing Natural Language Understanding through Multimodal Learning" \\\\
Principal Investigator, \\$500,000

\\textbf{Google Faculty Research Award} \\hfill \\textit{2023} \\\\
"Efficient Training of Large Language Models" \\\\
Principal Investigator, \\$75,000

\\section*{TEACHING}

\\textbf{CS 4501: Advanced Machine Learning} \\hfill \\textit{Fall 2023, Fall 2024} \\\\
\\textbf{CS 3501: Introduction to Artificial Intelligence} \\hfill \\textit{Spring 2022, Spring 2023, Spring 2024} \\\\
\\textbf{CS 2501: Data Structures and Algorithms} \\hfill \\textit{Fall 2021, Fall 2022}

\\section*{SERVICE}

\\textbf{Conference Reviews:} ICML (2022-2024), NeurIPS (2021-2024), AAAI (2022-2024) \\\\
\\textbf{Journal Reviews:} JMLR, Computational Linguistics, Nature Machine Intelligence \\\\
\\textbf{Program Committee:} ACL 2024, EMNLP 2023 \\\\
\\textbf{Editorial Board:} Associate Editor, Journal of AI Research (2024-Present)

\\section*{AWARDS AND HONORS}

Outstanding Paper Award, ICML 2024 \\\\
Best Teaching Award, Department of Computer Science, 2023 \\\\
Graduate Student Research Award, MIT, 2020 \\\\
Phi Beta Kappa, UC Berkeley, 2014

\\end{document}`
  }
];

export function getDefaultTemplate(): LaTeXTemplate {
  return LATEX_TEMPLATES[0]; // Classic Professional template
}