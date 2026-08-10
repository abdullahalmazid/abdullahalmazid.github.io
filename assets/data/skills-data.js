/* ==========================================================================
   Skills data. Levels are grounded in how each skill actually shows up in
   the CV/projects (used in a thesis or flagship project vs. coursework
   mention) rather than an invented self-rating — edit the `level` and
   `blurb`/`description` fields directly if you'd rate yourself differently.

   level: 1 = Familiar (coursework-level exposure)
          2 = Applied (used in a specific project)
          3 = Core (central to a major project/thesis)
   ========================================================================== */
window.SKILLS_DATA = [
  {
    category: "Optimization & Operations Research",
    skills: [
      { id: "or", name: "Operations Research", level: 3,
        blurb: "Core method behind the cafeteria production-planning project.",
        description: "Applied to formulate and solve a real production-planning problem — deciding production quantity and pricing under demand, resource, and operational constraints." },
      { id: "lp", name: "Linear Programming", level: 3,
        blurb: "The modeling approach used for the cafeteria optimization project.",
        description: "Built and solved a linear programming model for production quantity and pricing optimization under multiple real-world constraints." },
      { id: "gurobi", name: "Gurobi", level: 2,
        blurb: "Solver used to validate the cafeteria LP model.",
        description: "Used to solve and cross-check the linear programming model built for the cafeteria production-planning project." },
      { id: "excel-solver", name: "Excel Solver", level: 2,
        blurb: "Used alongside Gurobi to solve and validate the LP model.",
        description: "Used as a second, more accessible solver to validate the cafeteria production-planning LP model." },
      { id: "prod-planning", name: "Production Planning", level: 2,
        blurb: "Applied in coursework and the cafeteria optimization project.",
        description: "Covers deciding what to produce, how much, and when, under resource and demand constraints — practiced through coursework and the cafeteria LP project." },
      { id: "inventory", name: "Inventory Control", level: 1,
        blurb: "Covered in coursework (Operations Research, Supply Chain Management).",
        description: "Studied as part of Operations Research and Supply Chain Management coursework at BUET." },
    ]
  },
  {
    category: "Quality & Manufacturing",
    skills: [
      { id: "sqc", name: "Statistical Quality Control", level: 2,
        blurb: "Observed and studied in a live FMCG production line at PRAN-RFL.",
        description: "Studied statistical quality control practices during a month-long industrial attachment at PRAN-RFL Group, across beverage, dairy, biscuit, and confectionery lines." },
      { id: "mfg-systems", name: "Manufacturing Systems", level: 1,
        blurb: "Covered through coursework (Manufacturing Processes I & II).",
        description: "Studied through Manufacturing Processes I & II and Computer Integrated Manufacturing coursework at BUET." },
      { id: "process-improvement", name: "Process Improvement", level: 1,
        blurb: "Covered through coursework and exposure at PRAN-RFL.",
        description: "Studied through IPE coursework and observed applied at scale during the PRAN-RFL industrial attachment." },
      { id: "tm-analysis", name: "Time-and-Motion Analysis", level: 2,
        blurb: "Studied hands-on during the PRAN-RFL industrial attachment.",
        description: "Studied time-and-motion analysis practices in a live manufacturing environment during the PRAN-RFL Group industrial attachment." },
    ]
  },
  {
    category: "Engineering Software",
    skills: [
      { id: "solidworks", name: "SolidWorks", level: 2,
        blurb: "Used to design the semi-automated shoe cleaning machine.",
        description: "Used for mechanical design work on the semi-automated shoe cleaning machine project." },
      { id: "ansys", name: "ANSYS Mechanical", level: 2,
        blurb: "Used for stress/fatigue analysis on the shoe cleaning machine project.",
        description: "Used for stress and fatigue analysis on the shoe cleaning machine design, and for FEA work validating temperature effects on 3D-printed PLA materials." },
      { id: "autocad", name: "AutoCAD", level: 1,
        blurb: "Covered through Product Design coursework.",
        description: "Studied through Product Design I & II coursework at BUET." },
      { id: "catia", name: "CATIA", level: 1,
        blurb: "Covered through engineering design coursework.",
        description: "Studied as part of engineering design coursework at BUET." },
      { id: "arena", name: "Arena Simulation", level: 1,
        blurb: "Covered through Operations Research / simulation coursework.",
        description: "Studied as part of Operations Research coursework at BUET, for discrete-event simulation of production systems." },
      { id: "matlab", name: "MATLAB", level: 1,
        blurb: "Covered through engineering coursework.",
        description: "Used for numerical/engineering coursework at BUET." },
    ]
  },
  {
    category: "Programming & Data Analytics",
    skills: [
      { id: "python", name: "Python", level: 3,
        blurb: "Primary language behind the AutoPrompt-SAM thesis pipeline.",
        description: "Used to build the AutoPrompt-SAM defect-segmentation pipeline (YOLOv11 + LoRA-adapted SAM), and for data analysis work throughout coursework and projects." },
      { id: "numpy", name: "NumPy", level: 3,
        blurb: "Used throughout the thesis pipeline's data handling.",
        description: "Used for numerical data handling in the AutoPrompt-SAM thesis pipeline and other analysis work." },
      { id: "pandas", name: "pandas", level: 3,
        blurb: "Used for data wrangling in thesis and project work.",
        description: "Used for data wrangling and analysis across thesis and project work." },
      { id: "sklearn", name: "scikit-learn", level: 2,
        blurb: "Used for classical ML components alongside deep learning work.",
        description: "Used for classical machine learning tasks alongside the deep-learning-based thesis pipeline." },
      { id: "pytorch", name: "PyTorch", level: 3,
        blurb: "Framework behind the YOLOv11 + SAM thesis pipeline.",
        description: "Used to implement and fine-tune (via LoRA) the Segment Anything Model as part of the AutoPrompt-SAM undergraduate thesis." },
      { id: "powerbi", name: "Power BI", level: 1,
        blurb: "Used for coursework-level data visualization.",
        description: "Used for dashboarding and data visualization in coursework contexts." },
      { id: "excel", name: "Excel", level: 2,
        blurb: "Used for the cafeteria LP model and general data analysis.",
        description: "Used for the cafeteria production-planning LP model (via Excel Solver) and general data analysis." },
      { id: "sql", name: "SQL", level: 1,
        blurb: "Covered through coursework-level data work.",
        description: "Used for querying and working with structured data in coursework contexts." },
      { id: "javascript", name: "JavaScript", level: 1,
        blurb: "Used to build this portfolio site's interactivity.",
        description: "Used to build the interactive parts of this portfolio site — the theme toggle, navigation, and this skills panel." },
      { id: "htmlcss", name: "HTML/CSS", level: 2,
        blurb: "Used to build this entire portfolio site.",
        description: "Used to build this portfolio site end-to-end, including its neumorphic design system." },
    ]
  },
  {
    category: "Machine Learning & IoT",
    skills: [
      { id: "cv", name: "Computer Vision", level: 3,
        blurb: "Core focus of the AutoPrompt-SAM undergraduate thesis.",
        description: "Central to the AutoPrompt-SAM thesis: an automatic CFRP defect-segmentation pipeline combining YOLOv11-guided prompting with a LoRA-adapted SAM." },
      { id: "yolo", name: "YOLOv11", level: 3,
        blurb: "Used to auto-generate prompts for SAM in the thesis pipeline.",
        description: "Used as the automatic prompt generator in the AutoPrompt-SAM thesis, removing the need for manual SAM prompting." },
      { id: "sam", name: "SAM (Segment Anything Model)", level: 3,
        blurb: "Fine-tuned with LoRA as the core of the thesis segmentation pipeline.",
        description: "Adapted via LoRA fine-tuning (roughly 4.33% trainable parameters) as the segmentation backbone of the AutoPrompt-SAM thesis, reaching IoU/Dice of 1.0000 on held-out data." },
      { id: "nlp", name: "NLP", level: 2,
        blurb: "Applied in the eGov-Lens publication on Bengali public feedback.",
        description: "Applied in the eGov-Lens research: a multi-dimensional ML approach to aspect-based analysis of Bengali-language public feedback on e-government platforms." },
      { id: "esp32", name: "ESP32 / Arduino", level: 2,
        blurb: "Hardware behind the IoT smart conveyor project.",
        description: "Used to build the IoT smart conveyor system's defect-detection and inventory-tracking hardware." },
      { id: "dashboards", name: "Real-time monitoring dashboards", level: 2,
        blurb: "Built for the IoT smart conveyor project.",
        description: "Built a real-time monitoring dashboard for the IoT smart conveyor quality-inspection system." },
    ]
  }
];
