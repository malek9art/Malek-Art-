import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: AI-powered formulator for projects and services
  app.post("/api/ai-formulate", async (req, res) => {
    try {
      const { type, title, description, keywords } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      const inputHint = `${title || ""} ${description || ""} ${keywords || ""}`.trim();
      const hasTopic = (term: string) => inputHint.toLowerCase().includes(term);

      // --- FALLBACK LOGIC ---
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        console.warn("GEMINI_API_KEY is not configured for formulate system. Using responsive fallback design.");

        if (type === "project") {
          // Detect template themes
          const isEcommerce = hasTopic("متجر") || hasTopic("تسوق") || hasTopic("e-commerce") || hasTopic("store") || hasTopic("shop");
          const isBranding = hasTopic("شعار") || hasTopic("هوية") || hasTopic("brand") || hasTopic("logo") || hasTopic("identity");
          const isApp = hasTopic("تطبيق") || hasTopic("جوال") || hasTopic("app") || hasTopic("mobile");

          if (isEcommerce) {
            return res.json({
              titleAr: "متجر الكتروني تفاعلي متكامل",
              titleEn: "Fully Integrated Interactive E-Commerce Platform",
              descriptionAr: "منصة تجارة جيل جديد تمتاز بأداء برميوم وحركات ناعمة وتكامل مع السيرفر.",
              descriptionEn: "Next-gen storefront with high performance, fluid motion layouts and backend integration.",
              contentAr: "تم ابتكار هذا المتجر ليمنح المستهلكين تجربة غامرة ومريحة. تم استخدام تقنيات React و Tailwind CSS v4 لبناء بطاقات المنتجات مع دمج Motion للألعاب الحركية وإتمام الدفع السريع والآمن. يدعم النظام لغتين وتخصيص سهل للمنتجات.",
              contentEn: "Constructed to offer high efficiency. Integrated with React and Tailwind CSS v4, utilizing custom micro-interaction shaders for high attention to detail. This e-commerce setup guarantees load speeds below 1.2s.",
              categoryAr: "تطوير واجهات / تجارة رقمية",
              categoryEn: "Frontend Dev / E-Commerce",
              date: "2026-06"
            });
          } else if (isBranding) {
            return res.json({
              titleAr: "إعادة بناء الهوية البصرية وشعارات البراند",
              titleEn: "Premium Brand Identity System & Creative Assets",
              descriptionAr: "حزمة شعارات وهوية كاملة تعبر عن الروح الفنية والتقنية للمشروع الجديد.",
              descriptionEn: "Premium brand suite with modern logos, design matrices, and design language documentation.",
              contentAr: "تجسد هذه الهوية البصيرة فلسفة العميل وتلبي تطلعاته عبر ألوان متقاطعة وتدرجات نيون فخمة. قمنا برسم الدلائل الارشادية وتصميم الأوراق الرسمية والمنشورات الاجتماعية وقوالب الموشن بجودة لا تضاهى لتترك انطباعاً دائماً.",
              contentEn: "A complete visual reinvention. Formulated a pristine and scalable design matrix around neon layout styles. Created custom guidelines, social vectors, and interactive mockup styles for ultimate branding leverage.",
              categoryAr: "تجديد هويات وشعارات",
              categoryEn: "Branding & Visual Arts",
              date: "2026-06"
            });
          } else if (isApp) {
            return res.json({
              titleAr: "تطبيق موبايل تفاعلي رائد",
              titleEn: "Immersive Smart Mobile App Prototype",
              descriptionAr: "تجربة تطبيق للهواتف الذكية مع نظام ملاحة انسيابي وواجهات تفاعلية مذهلة.",
              descriptionEn: "High-fidelity mobile application interface featuring fluid gestures and unified dark themes.",
              contentAr: "تم تخصيص هذا التطبيق لتقديم خدمة سلسة للمستخدمين بالاعتماد على دراسات تجربة المستخدم العميقة. الواجهات تتبع أفضل موجهات التصميم العصرية بلمسات مالك الفنية وحركات ناعمة تبرز كل تفصيل مهم.",
              contentEn: "A magnificent mobile interface built around fluid human gestures. Leveraging dark ambient layout variables and high visual density, it sets a gold standard in modern user experience.",
              categoryAr: "تصميم واجهات تطبيقات",
              categoryEn: "Mobile UI/UX Design",
              date: "2026-06"
            });
          } else {
            // General Fallback crafted on the provided inputs if possible
            const cleanTitle = title || "مشروع رقمي إبداعي مخصص";
            const cleanTitleEn = title ? `${title} Custom Implementation` : "Creative Custom Digital Implementation";
            return res.json({
              titleAr: cleanTitle,
              titleEn: cleanTitleEn,
              descriptionAr: description || "عمل فني ورقمي تم تنفيذه بهندسة دقيقة وتصميم برميوم.",
              descriptionEn: description ? `English version: ${description}` : "A customized digital project implemented with premium details and neat interfaces.",
              contentAr: `مشروع متكامل ومحسّن تكنولوجياً يركز على التفرد وراحة العين والمحاذاة البصرية المتقنة. يعبر عن رؤية فريدة ويسهل التحكم بإعداداته وتعديل نصوصه حسب الرغبة. الكلمات المفتاحية: ${keywords || "عام"}`,
              contentEn: `A completely responsive digital project showcasing high developer craftsmanship. Configured with a dark futuristic background and interactive layout hooks. Input keywords: ${keywords || "General"}`,
              categoryAr: "حلول رقمية متكاملة",
              categoryEn: "Integrated Digital Solutions",
              date: "2026-06"
            });
          }
        } else {
          // service fallback
          return res.json({
            titleAr: title || "خدمة تصميم وبرمجة متقدمة",
            titleEn: title ? `Creative ${title}` : "Premium Design & Technical Service",
            descriptionAr: description || "حلول برميوم تشمل رسم الواجهات والتطوير البرمجي الأحدث مع ضمان الجمال الفني المالي.",
            descriptionEn: description ? `English translation: ${description}` : "Premium solutions featuring full-scale layout drafts and contemporary frontend pipelines.",
            icon: hasTopic("برمجة") || hasTopic("كود") || hasTopic("code") || hasTopic("dev") ? "Code" :
                  hasTopic("حركات") || hasTopic("ذكاء") || hasTopic("sparkle") || hasTopic("motion") ? "Sparkles" :
                  hasTopic("طبقات") || hasTopic("هوية") || hasTopic("layers") ? "Layers" : "Layout"
          });
        }
      }

      // --- GEMINI POWERED INTELLIGENT PROCESSING ---
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          }
        }
      });

      let prompt = "";
      let responseSchema: any = null;

      if (type === "project") {
        prompt = `
Analyze these sketchy user inputs and draft a beautifully crafted portfolio project.
Rewrite and polish the Arabic texts to sound elegant, creative and grand, suitable for "Malek Art".
Formulate, translate, and craft stunning professional English counterparts with design-forward vocabulary.

User Title Draft: "${title || ""}"
User Description Draft: "${description || ""}"
User Keywords/Preferences: "${keywords || ""}"

Requirements:
- titleAr, titleEn: Inspiring and memorable titles.
- descriptionAr, descriptionEn: High-impact short summary paragraphs (max 150 chars).
- contentAr, contentEn: Deep long-form descriptions detailing the visual identity, technological choice (React, Tailwind CSS v4, Motion), UX principles, and custom features (approx 3-4 professional sentences).
- categoryAr, categoryEn: Perfect matching category (e.g. "تصميم واجهات", "تطوير واجهات", "تطوير ويب", "تجديد هويات" and English equivalents).
- date: Today/current month formatted as "YYYY-MM".
`;

        responseSchema = {
          type: Type.OBJECT,
          properties: {
            titleAr: { type: Type.STRING },
            titleEn: { type: Type.STRING },
            descriptionAr: { type: Type.STRING },
            descriptionEn: { type: Type.STRING },
            contentAr: { type: Type.STRING },
            contentEn: { type: Type.STRING },
            categoryAr: { type: Type.STRING },
            categoryEn: { type: Type.STRING },
            date: { type: Type.STRING }
          },
          required: ["titleAr", "titleEn", "descriptionAr", "descriptionEn", "contentAr", "contentEn", "categoryAr", "categoryEn", "date"]
        };
      } else {
        prompt = `
Analyze these sketchy user inputs and draft a professional web/creative service item.
Rewrite and polish the Arabic texts to sound highly enticing and premium.
Formulate and translate into highly technical yet readable English equivalents.
Specify a matching icon name from the approved list: "Layout", "Layers", "Code", "Sparkles".

User Title Draft: "${title || ""}"
User Description Draft: "${description || ""}"
User Keywords/Preferences: "${keywords || ""}"
`;

        responseSchema = {
          type: Type.OBJECT,
          properties: {
            titleAr: { type: Type.STRING },
            titleEn: { type: Type.STRING },
            descriptionAr: { type: Type.STRING },
            descriptionEn: { type: Type.STRING },
            icon: { type: Type.STRING, description: "Must be exactly one of: Layout, Layers, Code, Sparkles" }
          },
          required: ["titleAr", "titleEn", "descriptionAr", "descriptionEn", "icon"]
        };
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an expert bilingual copywriter and professional product marketer for high-end digital agency 'Malek Art'. You output flawless JSON matches.",
          responseMimeType: "application/json",
          responseSchema,
          temperature: 0.8
        }
      });

      const data = JSON.parse(response.text || "{}");
      return res.json(data);

    } catch (error: any) {
      console.error("Error in AI Formulate route:", error);
      res.status(500).json({ error: error.message || "Failed to formulate content with AI" });
    }
  });

  // API Route: AI project advisor matching
  app.post("/api/matchmaker", async (req, res) => {
    try {
      const { idea, budget, language, projects, aiCustomPromptAr, aiCustomPromptEn, basics } = req.body;

      if (!idea) {
        return res.status(400).json({ error: "Mission idea parameter is required" });
      }

      const isAr = language === "ar";
      const apiKey = process.env.GEMINI_API_KEY;

      // Safe Fallback: Check if API key is not present or remains as placeholder
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        console.warn("GEMINI_API_KEY is not configured or in fallback state. Returning local intelligence.");
        
        // Smart Local Response Generation based on Arabic/English and keyword match
        const lowerIdea = idea.toLowerCase();
        let matchedIndex = 0; // Default to first project
        if (lowerIdea.includes("متجر") || lowerIdea.includes("تسوق") || lowerIdea.includes("e-commerce") || lowerIdea.includes("store") || lowerIdea.includes("shop") || (basics && basics.serviceType === 'ecommerce')) {
          matchedIndex = 2; // Creative E-commerce custom project index
        } else if (lowerIdea.includes("مهام") || lowerIdea.includes("إدارة") || lowerIdea.includes("task") || lowerIdea.includes("manage") || lowerIdea.includes("todo") || (basics && basics.serviceType === 'dashboard')) {
          matchedIndex = 1; // Task manager
        } else if (lowerIdea.includes("هوية") || lowerIdea.includes("شعار") || lowerIdea.includes("brand") || lowerIdea.includes("logo") || lowerIdea.includes("identity") || (basics && basics.serviceType === 'branding')) {
          matchedIndex = 3; // RedRed branding
        } else if (lowerIdea.includes("صحة") || lowerIdea.includes("تمارين") || lowerIdea.includes("health") || lowerIdea.includes("fit") || lowerIdea.includes("gym")) {
          matchedIndex = 4; // Health app
        } else if (lowerIdea.includes("بلوك") || lowerIdea.includes("تشفير") || lowerIdea.includes("crypto") || lowerIdea.includes("web3") || lowerIdea.includes("nft")) {
          matchedIndex = 5; // Web3 hub
        }

        const relatedProject = projects && projects[matchedIndex] ? projects[matchedIndex] : null;

        const selServAr = basics?.serviceType === 'landing_page' ? 'صفحة هبوط إعلانية وثنائية اللغة لترويج حملتك' : basics?.serviceType === 'ecommerce' ? 'متجر تجارة إلكتروني متكامل مزود ببوابة دفع وسلة تسوق مدمجة' : basics?.serviceType === 'dashboard' ? 'نظام إدارة مخصص مع لوحة تحكم إدارية ذكية ومخططات بيانية' : basics?.serviceType === 'branding' ? 'هوية بصرية كاملة وتصميم شعار ملهم ومتميز' : 'نموذج تطبيق جوال ذكي تفاعلي بالكامل لخدمة عملائك';
        const selColorAr = basics?.colorVibe === 'dark_navy' ? 'لوحة ألوان كحلية داكنة بلمسات زرقاء كهربائية' : basics?.colorVibe === 'minimal_light' ? 'أسلوب سويسري أبيض ناصع وتصميم مبسط فائق النقاء' : basics?.colorVibe === 'botanical' ? 'لوحة ألوان نباتية ترابية هادئة ومنعشة ومريحة للعين' : 'لوحة ألوان كحلية احترافية ومظهر وقار تنفيذي للشركات';
        const selStyleAr = basics?.designStyle === 'minimalist' ? 'مبسط جداً يركز على المحتوى والمساحات السلبية الأنيقة' : basics?.designStyle === 'cyber' ? 'أسلوب مستقبلي جريء يتضمن عناصر زجاجية Glassmorphism عالية التأثير' : basics?.designStyle === 'classy' ? 'أسلوب كلاسيكي راقٍ يتميز بخطوط Serif الأنيقة والتفاصيل الذهبية الفخمة' : 'طابع مفعم بالجرأة، ذو تباين عالٍ وحشوات ثقيلة ملفتة للنظر';
        const selFeaturesAr = (basics?.features || []).map((f: string) => f === 'bilingual' ? 'دعم العربية والإنجليزية' : f === 'seo' ? 'تهيئة شاملة لمحركات البحث (SEO)' : f === 'motion' ? 'حركات انتقالية وتفاعل سلس مع التمرير (Motion)' : f === 'dark_mode' ? 'دعم الوضع الداكن التلقائي' : f === 'auth' ? 'نظام مستخدمين وتسجيل آمن' : 'تنبيهات فورية مرنة').join('، ') || 'المميزات القياسية، متجاوبة للـ Mobile والويب';

        const defaultApproachAr = `### 🌟 التحليل الأولي المخصص لفكرتك
تعتبر فكرتك لبناء **${idea}** ممتازة وواعدة جداً! وحسب رغبتك في بناء **${selServAr}**، فقد قمنا بصياغة هذا التقرير الاستشاري ليطابق تطلعاتك.

### 🎨 الهوية البصرية وأسلوب التصميم:
1. **لوحة الألوان المحددة**: سنعتمد **${selColorAr}** لتمنح عملاءك تجربة مميزة تناسب العصر.
2. **الطابع العام للواجهات**: اخترنا تطبيق الأسلوب الـ **${selStyleAr}** لتحقيق التناسق واكتساب ولاء زوارك فور الدخول للموقع.
3. **الخصائص والوظائف المدمجة**: سنقوم بـتضمين: **${selFeaturesAr}**.

### 🛠️ الأدوات والخطوات التقنية المقترحة من مالك أرت:
- **واجهة العميل (Frontend)**: استخدام **React 19** مع **Vite** لتأمين بنية مستدامة سريعة التحميل، مع تحري الـ Mini-bundles لضمان تحميل الصفحة في أقل من 1.5 ثانية.
- **التفاعل الفائق**: دمج مكتبة **Motion** لتنفيذ تأثيرات تمرير ثلاثية الأبعاد خفيفة تعطي الزوار شعوراً بالتكامل والفخامة.
- **النظام الخلفي واستضافة البيانات**: دمج قاعدة بيانات سحابية متجاوبة توفر تحديثات فورية وإشعار ذكي فوري للمطور.

### ⏱️ الإطار الزمني المقدر:
- **مرحلة التصميم والتخطيط (UI/UX)**: 7 إلى 10 أيام عمل لمطابقة الأساسيات المعروضة.
- **مرحلة البرمجة والتطوير واختبار الأداء**: 14 إلى 20 يوم عمل.
- **الإطلاق والصيانة والتحسين لـ SEO**: 3 أيام عمل.

*(هذا التحليل تم إنتاجه بمحاكي الذكاء الاصطناعي مدمجاً بخياراتك الأساسية. لتفعيل الاستشارة الحية من طراز Gemini AI، يرجى تزويد مفتاح GEMINI_API_KEY في إعدادات التطبيق)*`;

        const selServEn = basics?.serviceType === 'landing_page' ? 'High-converting Promotional Landing Page' : basics?.serviceType === 'ecommerce' ? 'E-Commerce system equipped with Stripe and Cart controls' : basics?.serviceType === 'dashboard' ? 'Custom system with administrative controls, dashboard grids, and custom metrics' : basics?.serviceType === 'branding' ? 'Inspired Brand Identity & Custom Logo' : 'Interactive Prototype Mobile Application';
        const selColorEn = basics?.colorVibe === 'dark_navy' ? 'Dark Navy with Electric Blue accents' : basics?.colorVibe === 'minimal_light' ? 'Pure Swiss Minimalist off-white concept' : basics?.colorVibe === 'botanical' ? 'Soothing Botanical Ecology theme' : 'Executive Professional Corporate Blue tone';
        const selStyleEn = basics?.designStyle === 'minimalist' ? 'Minimalist focus leveraging luxury typography and generous padding' : basics?.designStyle === 'cyber' ? 'Sci-Fi cyberpunk aesthetic featuring interactive Glassmorphism grids' : basics?.designStyle === 'classy' ? 'Classy Serif editorial design' : 'Bold high-contrast brutalist layout';
        const selFeaturesEn = (basics?.features || []).join(', ') || 'Standard responsive elements';

        const defaultApproachEn = `### 🌟 Customized Product Strategy
Your vision to design **${idea}** is highly promising! Based on your preferred choice of a **${selServEn}**, here is Malek Art's custom strategized analysis sheet.

### 🎨 Visual Architecture & Selected Basics:
1. **Interactive Color Theme**: We have integrated the **${selColorEn}** to guarantee your audience can engage instantly.
2. **Dominant Aesthetic Vibe**: We will adopt a **${selStyleEn}** to augment user satisfaction and ensure elegant modern readability.
3. **Core Integrated Features**: The implementation will feature: **${selFeaturesEn}**.

### 🛠️ Recommended Technological Stack:
- **Frontend Architecture**: **React 19** paired with **Vite** to formulate a super lightweight frame of high responsive fidelity.
- **Motion Design**: Integrating **Motion** to deploy immersive scroll animations and page transitions that augment retention.
- **Backend Database**: Integrating real-time cloud data streams to authorize micro-interactions and instant email/notification updates.

### ⏱️ Estimated Execution Timeline:
- **UI/UX Strategy & Prototyping Phase**: 7 to 10 Business Days.
- **Development & Analytics Integration Phase**: 14 to 20 Business Days.
- **SEO Tuning & Public Production Launch**: 3 Business Days.

*(This report is generated locally with your custom-selected basics. To unlock deeper Gemini AI powered recommendations, hook up your GEMINI_API_KEY in the app's Secrets menu.)*`;

        return res.json({
          matchedProjectId: relatedProject ? relatedProject.id : "3",
          approach: isAr ? defaultApproachAr : defaultApproachEn,
          warning: "Fallback mode active. Hook up GEMINI_API_KEY for real live AI consultations!"
        });
      }

      // Initialize GoogleGenAI SDK
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          }
        }
      });

      // Construct projects summary to feed to the model
      const formattedProjects = (projects || [])
        .map((p: any) => `- ID: ${p.id}, Title: ${p.titleEn} (${p.titleAr}), Category: ${p.categoryEn}, Desc: ${p.descriptionEn}`)
        .join("\n");

      // Set system instructions based on language
      let systemInstruction = isAr
        ? "أنت المستشار التقني الافتراضي للمصمم ومطور المواقع المحترف 'مالك أرت (Malek Art)'. قم بتحليل فكرة المشروع المقدمة من العميل بأسلوب إبداعي، راقٍ ومقنع يبرز خبرات وجماليات أعمال مالك. تحدث بضمير المتكلم نيابة عن فريق مالك أرت أو مالك نفسه (مثال: 'أقترح عليك'، 'في مشروعنا السابق'). انصح العميل بأفضل التقنيات (Front-end, UX, Motion, Database) والإطار الزمني، واقترح المشروع الشبيه جداً من قائمة أعمال مالك السابقة واذكر سبب الشبه بشكل دقيق."
        : "You are the smart AI Project Strategist representing the creative designer & web developer 'Malek Art'. Analyze the client's project idea with high professionalism, design-forward terms, and eloquent articulation. Speak in the first person on behalf of Malek Art (e.g., 'I recommend', 'In my previous project'). Advise them on optimal technical stacks (Front-end, Motion design, UX structure, Database solutions) and timelines. Select the most relevant project from Malek's collection and explain why it provides the perfect benchmark.";

      const customPersona = isAr ? aiCustomPromptAr : aiCustomPromptEn;
      if (customPersona && customPersona.trim()) {
        systemInstruction += `\n\nإرشادات مخصصة وموجهة إضافية من مالك أرت (Strict Custom Advisor Guidelines): ${customPersona}`;
      }

      const prompt = `
Client Request Language: ${language}
Project Idea: "${idea}"
Client Budget Level: ${budget}

Chosen Design Basics by Client:
- Service/Project Type: ${basics?.serviceType || 'Not specified'}
- Visual Theme / Colors: ${basics?.colorVibe || 'Not specified'}
- Design Style: ${basics?.designStyle || 'Not specified'}
- Demanded Features: ${(basics?.features || []).join(', ') || 'Not specified'}

Available Portfolio Projects to reference or match:
${formattedProjects}

Provide your response in Markdown layout. Integrate their selected design basics (Project Type, Colors, Design Style, Features) harmoniously into your suggestions. Include:
1. Initial Encouragement & Analytical breakdown (What makes this project exciting).
2. Malek's Suggested Technological Stack & Aesthetics (referencing themes, motion, or custom responsive design).
3. Estimated Strategic Timeline (broken down into UI/UX Design and Frontend Development).
4. Direct Reference matching: Identify ONLY ONE project from the list above that matches best, and write a specific paragraph explaining why this project is the perfect benchmark. At the very end of your response, output a single line with the matched project ID like this: MATCHED_PROJECT_ID: [id_number] (Replace [id_number] with the exact matching ID from the list, e.g. MATCHED_PROJECT_ID: 3).
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const responseText = response.text || "";
      
      // Parse the matched project ID from the model output
      let matchedProjectId = "3"; // default to creative ecommerce
      const matchRegex = /MATCHED_PROJECT_ID:\s*([^\s\n\r]+)/i;
      const match = responseText.match(matchRegex);
      if (match && match[1]) {
        matchedProjectId = match[1].trim().replace(/[\[\]]/g, "");
      }

      // Clean the MATCHED_PROJECT_ID text from the user response so it looks professional
      const cleanedApproach = responseText.replace(/MATCHED_PROJECT_ID:?.*/i, "").trim();

      return res.json({
        matchedProjectId: matchedProjectId,
        approach: cleanedApproach
      });

    } catch (error: any) {
      console.error("Gemini API Error in route:", error);
      res.status(500).json({ error: error.message || "Failed to make intelligent AI consultation" });
    }
  });

  // Serve static assets in production, otherwise Vite handles it
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Malek Logic Server running on http://localhost:${PORT}`);
  });
}

startServer();
