var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  app.post("/api/ai-formulate", async (req, res) => {
    try {
      const { type, title, description, keywords } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      const inputHint = `${title || ""} ${description || ""} ${keywords || ""}`.trim();
      const hasTopic = (term) => inputHint.toLowerCase().includes(term);
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        console.warn("GEMINI_API_KEY is not configured for formulate system. Using responsive fallback design.");
        if (type === "project") {
          const isEcommerce = hasTopic("\u0645\u062A\u062C\u0631") || hasTopic("\u062A\u0633\u0648\u0642") || hasTopic("e-commerce") || hasTopic("store") || hasTopic("shop");
          const isBranding = hasTopic("\u0634\u0639\u0627\u0631") || hasTopic("\u0647\u0648\u064A\u0629") || hasTopic("brand") || hasTopic("logo") || hasTopic("identity");
          const isApp = hasTopic("\u062A\u0637\u0628\u064A\u0642") || hasTopic("\u062C\u0648\u0627\u0644") || hasTopic("app") || hasTopic("mobile");
          if (isEcommerce) {
            return res.json({
              titleAr: "\u0645\u062A\u062C\u0631 \u0627\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u062A\u0641\u0627\u0639\u0644\u064A \u0645\u062A\u0643\u0627\u0645\u0644",
              titleEn: "Fully Integrated Interactive E-Commerce Platform",
              descriptionAr: "\u0645\u0646\u0635\u0629 \u062A\u062C\u0627\u0631\u0629 \u062C\u064A\u0644 \u062C\u062F\u064A\u062F \u062A\u0645\u062A\u0627\u0632 \u0628\u0623\u062F\u0627\u0621 \u0628\u0631\u0645\u064A\u0648\u0645 \u0648\u062D\u0631\u0643\u0627\u062A \u0646\u0627\u0639\u0645\u0629 \u0648\u062A\u0643\u0627\u0645\u0644 \u0645\u0639 \u0627\u0644\u0633\u064A\u0631\u0641\u0631.",
              descriptionEn: "Next-gen storefront with high performance, fluid motion layouts and backend integration.",
              contentAr: "\u062A\u0645 \u0627\u0628\u062A\u0643\u0627\u0631 \u0647\u0630\u0627 \u0627\u0644\u0645\u062A\u062C\u0631 \u0644\u064A\u0645\u0646\u062D \u0627\u0644\u0645\u0633\u062A\u0647\u0644\u0643\u064A\u0646 \u062A\u062C\u0631\u0628\u0629 \u063A\u0627\u0645\u0631\u0629 \u0648\u0645\u0631\u064A\u062D\u0629. \u062A\u0645 \u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u062A\u0642\u0646\u064A\u0627\u062A React \u0648 Tailwind CSS v4 \u0644\u0628\u0646\u0627\u0621 \u0628\u0637\u0627\u0642\u0627\u062A \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0645\u0639 \u062F\u0645\u062C Motion \u0644\u0644\u0623\u0644\u0639\u0627\u0628 \u0627\u0644\u062D\u0631\u0643\u064A\u0629 \u0648\u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u062F\u0641\u0639 \u0627\u0644\u0633\u0631\u064A\u0639 \u0648\u0627\u0644\u0622\u0645\u0646. \u064A\u062F\u0639\u0645 \u0627\u0644\u0646\u0638\u0627\u0645 \u0644\u063A\u062A\u064A\u0646 \u0648\u062A\u062E\u0635\u064A\u0635 \u0633\u0647\u0644 \u0644\u0644\u0645\u0646\u062A\u062C\u0627\u062A.",
              contentEn: "Constructed to offer high efficiency. Integrated with React and Tailwind CSS v4, utilizing custom micro-interaction shaders for high attention to detail. This e-commerce setup guarantees load speeds below 1.2s.",
              categoryAr: "\u062A\u0637\u0648\u064A\u0631 \u0648\u0627\u062C\u0647\u0627\u062A / \u062A\u062C\u0627\u0631\u0629 \u0631\u0642\u0645\u064A\u0629",
              categoryEn: "Frontend Dev / E-Commerce",
              date: "2026-06"
            });
          } else if (isBranding) {
            return res.json({
              titleAr: "\u0625\u0639\u0627\u062F\u0629 \u0628\u0646\u0627\u0621 \u0627\u0644\u0647\u0648\u064A\u0629 \u0627\u0644\u0628\u0635\u0631\u064A\u0629 \u0648\u0634\u0639\u0627\u0631\u0627\u062A \u0627\u0644\u0628\u0631\u0627\u0646\u062F",
              titleEn: "Premium Brand Identity System & Creative Assets",
              descriptionAr: "\u062D\u0632\u0645\u0629 \u0634\u0639\u0627\u0631\u0627\u062A \u0648\u0647\u0648\u064A\u0629 \u0643\u0627\u0645\u0644\u0629 \u062A\u0639\u0628\u0631 \u0639\u0646 \u0627\u0644\u0631\u0648\u062D \u0627\u0644\u0641\u0646\u064A\u0629 \u0648\u0627\u0644\u062A\u0642\u0646\u064A\u0629 \u0644\u0644\u0645\u0634\u0631\u0648\u0639 \u0627\u0644\u062C\u062F\u064A\u062F.",
              descriptionEn: "Premium brand suite with modern logos, design matrices, and design language documentation.",
              contentAr: "\u062A\u062C\u0633\u062F \u0647\u0630\u0647 \u0627\u0644\u0647\u0648\u064A\u0629 \u0627\u0644\u0628\u0635\u064A\u0631\u0629 \u0641\u0644\u0633\u0641\u0629 \u0627\u0644\u0639\u0645\u064A\u0644 \u0648\u062A\u0644\u0628\u064A \u062A\u0637\u0644\u0639\u0627\u062A\u0647 \u0639\u0628\u0631 \u0623\u0644\u0648\u0627\u0646 \u0645\u062A\u0642\u0627\u0637\u0639\u0629 \u0648\u062A\u062F\u0631\u062C\u0627\u062A \u0646\u064A\u0648\u0646 \u0641\u062E\u0645\u0629. \u0642\u0645\u0646\u0627 \u0628\u0631\u0633\u0645 \u0627\u0644\u062F\u0644\u0627\u0626\u0644 \u0627\u0644\u0627\u0631\u0634\u0627\u062F\u064A\u0629 \u0648\u062A\u0635\u0645\u064A\u0645 \u0627\u0644\u0623\u0648\u0631\u0627\u0642 \u0627\u0644\u0631\u0633\u0645\u064A\u0629 \u0648\u0627\u0644\u0645\u0646\u0634\u0648\u0631\u0627\u062A \u0627\u0644\u0627\u062C\u062A\u0645\u0627\u0639\u064A\u0629 \u0648\u0642\u0648\u0627\u0644\u0628 \u0627\u0644\u0645\u0648\u0634\u0646 \u0628\u062C\u0648\u062F\u0629 \u0644\u0627 \u062A\u0636\u0627\u0647\u0649 \u0644\u062A\u062A\u0631\u0643 \u0627\u0646\u0637\u0628\u0627\u0639\u0627\u064B \u062F\u0627\u0626\u0645\u0627\u064B.",
              contentEn: "A complete visual reinvention. Formulated a pristine and scalable design matrix around neon layout styles. Created custom guidelines, social vectors, and interactive mockup styles for ultimate branding leverage.",
              categoryAr: "\u062A\u062C\u062F\u064A\u062F \u0647\u0648\u064A\u0627\u062A \u0648\u0634\u0639\u0627\u0631\u0627\u062A",
              categoryEn: "Branding & Visual Arts",
              date: "2026-06"
            });
          } else if (isApp) {
            return res.json({
              titleAr: "\u062A\u0637\u0628\u064A\u0642 \u0645\u0648\u0628\u0627\u064A\u0644 \u062A\u0641\u0627\u0639\u0644\u064A \u0631\u0627\u0626\u062F",
              titleEn: "Immersive Smart Mobile App Prototype",
              descriptionAr: "\u062A\u062C\u0631\u0628\u0629 \u062A\u0637\u0628\u064A\u0642 \u0644\u0644\u0647\u0648\u0627\u062A\u0641 \u0627\u0644\u0630\u0643\u064A\u0629 \u0645\u0639 \u0646\u0638\u0627\u0645 \u0645\u0644\u0627\u062D\u0629 \u0627\u0646\u0633\u064A\u0627\u0628\u064A \u0648\u0648\u0627\u062C\u0647\u0627\u062A \u062A\u0641\u0627\u0639\u0644\u064A\u0629 \u0645\u0630\u0647\u0644\u0629.",
              descriptionEn: "High-fidelity mobile application interface featuring fluid gestures and unified dark themes.",
              contentAr: "\u062A\u0645 \u062A\u062E\u0635\u064A\u0635 \u0647\u0630\u0627 \u0627\u0644\u062A\u0637\u0628\u064A\u0642 \u0644\u062A\u0642\u062F\u064A\u0645 \u062E\u062F\u0645\u0629 \u0633\u0644\u0633\u0629 \u0644\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646 \u0628\u0627\u0644\u0627\u0639\u062A\u0645\u0627\u062F \u0639\u0644\u0649 \u062F\u0631\u0627\u0633\u0627\u062A \u062A\u062C\u0631\u0628\u0629 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645 \u0627\u0644\u0639\u0645\u064A\u0642\u0629. \u0627\u0644\u0648\u0627\u062C\u0647\u0627\u062A \u062A\u062A\u0628\u0639 \u0623\u0641\u0636\u0644 \u0645\u0648\u062C\u0647\u0627\u062A \u0627\u0644\u062A\u0635\u0645\u064A\u0645 \u0627\u0644\u0639\u0635\u0631\u064A\u0629 \u0628\u0644\u0645\u0633\u0627\u062A \u0645\u0627\u0644\u0643 \u0627\u0644\u0641\u0646\u064A\u0629 \u0648\u062D\u0631\u0643\u0627\u062A \u0646\u0627\u0639\u0645\u0629 \u062A\u0628\u0631\u0632 \u0643\u0644 \u062A\u0641\u0635\u064A\u0644 \u0645\u0647\u0645.",
              contentEn: "A magnificent mobile interface built around fluid human gestures. Leveraging dark ambient layout variables and high visual density, it sets a gold standard in modern user experience.",
              categoryAr: "\u062A\u0635\u0645\u064A\u0645 \u0648\u0627\u062C\u0647\u0627\u062A \u062A\u0637\u0628\u064A\u0642\u0627\u062A",
              categoryEn: "Mobile UI/UX Design",
              date: "2026-06"
            });
          } else {
            const cleanTitle = title || "\u0645\u0634\u0631\u0648\u0639 \u0631\u0642\u0645\u064A \u0625\u0628\u062F\u0627\u0639\u064A \u0645\u062E\u0635\u0635";
            const cleanTitleEn = title ? `${title} Custom Implementation` : "Creative Custom Digital Implementation";
            return res.json({
              titleAr: cleanTitle,
              titleEn: cleanTitleEn,
              descriptionAr: description || "\u0639\u0645\u0644 \u0641\u0646\u064A \u0648\u0631\u0642\u0645\u064A \u062A\u0645 \u062A\u0646\u0641\u064A\u0630\u0647 \u0628\u0647\u0646\u062F\u0633\u0629 \u062F\u0642\u064A\u0642\u0629 \u0648\u062A\u0635\u0645\u064A\u0645 \u0628\u0631\u0645\u064A\u0648\u0645.",
              descriptionEn: description ? `English version: ${description}` : "A customized digital project implemented with premium details and neat interfaces.",
              contentAr: `\u0645\u0634\u0631\u0648\u0639 \u0645\u062A\u0643\u0627\u0645\u0644 \u0648\u0645\u062D\u0633\u0651\u0646 \u062A\u0643\u0646\u0648\u0644\u0648\u062C\u064A\u0627\u064B \u064A\u0631\u0643\u0632 \u0639\u0644\u0649 \u0627\u0644\u062A\u0641\u0631\u062F \u0648\u0631\u0627\u062D\u0629 \u0627\u0644\u0639\u064A\u0646 \u0648\u0627\u0644\u0645\u062D\u0627\u0630\u0627\u0629 \u0627\u0644\u0628\u0635\u0631\u064A\u0629 \u0627\u0644\u0645\u062A\u0642\u0646\u0629. \u064A\u0639\u0628\u0631 \u0639\u0646 \u0631\u0624\u064A\u0629 \u0641\u0631\u064A\u062F\u0629 \u0648\u064A\u0633\u0647\u0644 \u0627\u0644\u062A\u062D\u0643\u0645 \u0628\u0625\u0639\u062F\u0627\u062F\u0627\u062A\u0647 \u0648\u062A\u0639\u062F\u064A\u0644 \u0646\u0635\u0648\u0635\u0647 \u062D\u0633\u0628 \u0627\u0644\u0631\u063A\u0628\u0629. \u0627\u0644\u0643\u0644\u0645\u0627\u062A \u0627\u0644\u0645\u0641\u062A\u0627\u062D\u064A\u0629: ${keywords || "\u0639\u0627\u0645"}`,
              contentEn: `A completely responsive digital project showcasing high developer craftsmanship. Configured with a dark futuristic background and interactive layout hooks. Input keywords: ${keywords || "General"}`,
              categoryAr: "\u062D\u0644\u0648\u0644 \u0631\u0642\u0645\u064A\u0629 \u0645\u062A\u0643\u0627\u0645\u0644\u0629",
              categoryEn: "Integrated Digital Solutions",
              date: "2026-06"
            });
          }
        } else {
          return res.json({
            titleAr: title || "\u062E\u062F\u0645\u0629 \u062A\u0635\u0645\u064A\u0645 \u0648\u0628\u0631\u0645\u062C\u0629 \u0645\u062A\u0642\u062F\u0645\u0629",
            titleEn: title ? `Creative ${title}` : "Premium Design & Technical Service",
            descriptionAr: description || "\u062D\u0644\u0648\u0644 \u0628\u0631\u0645\u064A\u0648\u0645 \u062A\u0634\u0645\u0644 \u0631\u0633\u0645 \u0627\u0644\u0648\u0627\u062C\u0647\u0627\u062A \u0648\u0627\u0644\u062A\u0637\u0648\u064A\u0631 \u0627\u0644\u0628\u0631\u0645\u062C\u064A \u0627\u0644\u0623\u062D\u062F\u062B \u0645\u0639 \u0636\u0645\u0627\u0646 \u0627\u0644\u062C\u0645\u0627\u0644 \u0627\u0644\u0641\u0646\u064A \u0627\u0644\u0645\u0627\u0644\u064A.",
            descriptionEn: description ? `English translation: ${description}` : "Premium solutions featuring full-scale layout drafts and contemporary frontend pipelines.",
            icon: hasTopic("\u0628\u0631\u0645\u062C\u0629") || hasTopic("\u0643\u0648\u062F") || hasTopic("code") || hasTopic("dev") ? "Code" : hasTopic("\u062D\u0631\u0643\u0627\u062A") || hasTopic("\u0630\u0643\u0627\u0621") || hasTopic("sparkle") || hasTopic("motion") ? "Sparkles" : hasTopic("\u0637\u0628\u0642\u0627\u062A") || hasTopic("\u0647\u0648\u064A\u0629") || hasTopic("layers") ? "Layers" : "Layout"
          });
        }
      }
      const ai = new import_genai.GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
      let prompt = "";
      let responseSchema = null;
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
- categoryAr, categoryEn: Perfect matching category (e.g. "\u062A\u0635\u0645\u064A\u0645 \u0648\u0627\u062C\u0647\u0627\u062A", "\u062A\u0637\u0648\u064A\u0631 \u0648\u0627\u062C\u0647\u0627\u062A", "\u062A\u0637\u0648\u064A\u0631 \u0648\u064A\u0628", "\u062A\u062C\u062F\u064A\u062F \u0647\u0648\u064A\u0627\u062A" and English equivalents).
- date: Today/current month formatted as "YYYY-MM".
`;
        responseSchema = {
          type: import_genai.Type.OBJECT,
          properties: {
            titleAr: { type: import_genai.Type.STRING },
            titleEn: { type: import_genai.Type.STRING },
            descriptionAr: { type: import_genai.Type.STRING },
            descriptionEn: { type: import_genai.Type.STRING },
            contentAr: { type: import_genai.Type.STRING },
            contentEn: { type: import_genai.Type.STRING },
            categoryAr: { type: import_genai.Type.STRING },
            categoryEn: { type: import_genai.Type.STRING },
            date: { type: import_genai.Type.STRING }
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
          type: import_genai.Type.OBJECT,
          properties: {
            titleAr: { type: import_genai.Type.STRING },
            titleEn: { type: import_genai.Type.STRING },
            descriptionAr: { type: import_genai.Type.STRING },
            descriptionEn: { type: import_genai.Type.STRING },
            icon: { type: import_genai.Type.STRING, description: "Must be exactly one of: Layout, Layers, Code, Sparkles" }
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
    } catch (error) {
      console.error("Error in AI Formulate route:", error);
      res.status(500).json({ error: error.message || "Failed to formulate content with AI" });
    }
  });
  app.post("/api/matchmaker", async (req, res) => {
    try {
      const { idea, budget, language, projects, aiCustomPromptAr, aiCustomPromptEn, basics } = req.body;
      if (!idea) {
        return res.status(400).json({ error: "Mission idea parameter is required" });
      }
      const isAr = language === "ar";
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        console.warn("GEMINI_API_KEY is not configured or in fallback state. Returning local intelligence.");
        const lowerIdea = idea.toLowerCase();
        let matchedIndex = 0;
        if (lowerIdea.includes("\u0645\u062A\u062C\u0631") || lowerIdea.includes("\u062A\u0633\u0648\u0642") || lowerIdea.includes("e-commerce") || lowerIdea.includes("store") || lowerIdea.includes("shop") || basics && basics.serviceType === "ecommerce") {
          matchedIndex = 2;
        } else if (lowerIdea.includes("\u0645\u0647\u0627\u0645") || lowerIdea.includes("\u0625\u062F\u0627\u0631\u0629") || lowerIdea.includes("task") || lowerIdea.includes("manage") || lowerIdea.includes("todo") || basics && basics.serviceType === "dashboard") {
          matchedIndex = 1;
        } else if (lowerIdea.includes("\u0647\u0648\u064A\u0629") || lowerIdea.includes("\u0634\u0639\u0627\u0631") || lowerIdea.includes("brand") || lowerIdea.includes("logo") || lowerIdea.includes("identity") || basics && basics.serviceType === "branding") {
          matchedIndex = 3;
        } else if (lowerIdea.includes("\u0635\u062D\u0629") || lowerIdea.includes("\u062A\u0645\u0627\u0631\u064A\u0646") || lowerIdea.includes("health") || lowerIdea.includes("fit") || lowerIdea.includes("gym")) {
          matchedIndex = 4;
        } else if (lowerIdea.includes("\u0628\u0644\u0648\u0643") || lowerIdea.includes("\u062A\u0634\u0641\u064A\u0631") || lowerIdea.includes("crypto") || lowerIdea.includes("web3") || lowerIdea.includes("nft")) {
          matchedIndex = 5;
        }
        const relatedProject = projects && projects[matchedIndex] ? projects[matchedIndex] : null;
        const selServAr = basics?.serviceType === "landing_page" ? "\u0635\u0641\u062D\u0629 \u0647\u0628\u0648\u0637 \u0625\u0639\u0644\u0627\u0646\u064A\u0629 \u0648\u062B\u0646\u0627\u0626\u064A\u0629 \u0627\u0644\u0644\u063A\u0629 \u0644\u062A\u0631\u0648\u064A\u062C \u062D\u0645\u0644\u062A\u0643" : basics?.serviceType === "ecommerce" ? "\u0645\u062A\u062C\u0631 \u062A\u062C\u0627\u0631\u0629 \u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0645\u062A\u0643\u0627\u0645\u0644 \u0645\u0632\u0648\u062F \u0628\u0628\u0648\u0627\u0628\u0629 \u062F\u0641\u0639 \u0648\u0633\u0644\u0629 \u062A\u0633\u0648\u0642 \u0645\u062F\u0645\u062C\u0629" : basics?.serviceType === "dashboard" ? "\u0646\u0638\u0627\u0645 \u0625\u062F\u0627\u0631\u0629 \u0645\u062E\u0635\u0635 \u0645\u0639 \u0644\u0648\u062D\u0629 \u062A\u062D\u0643\u0645 \u0625\u062F\u0627\u0631\u064A\u0629 \u0630\u0643\u064A\u0629 \u0648\u0645\u062E\u0637\u0637\u0627\u062A \u0628\u064A\u0627\u0646\u064A\u0629" : basics?.serviceType === "branding" ? "\u0647\u0648\u064A\u0629 \u0628\u0635\u0631\u064A\u0629 \u0643\u0627\u0645\u0644\u0629 \u0648\u062A\u0635\u0645\u064A\u0645 \u0634\u0639\u0627\u0631 \u0645\u0644\u0647\u0645 \u0648\u0645\u062A\u0645\u064A\u0632" : "\u0646\u0645\u0648\u0630\u062C \u062A\u0637\u0628\u064A\u0642 \u062C\u0648\u0627\u0644 \u0630\u0643\u064A \u062A\u0641\u0627\u0639\u0644\u064A \u0628\u0627\u0644\u0643\u0627\u0645\u0644 \u0644\u062E\u062F\u0645\u0629 \u0639\u0645\u0644\u0627\u0626\u0643";
        const selColorAr = basics?.colorVibe === "dark_navy" ? "\u0644\u0648\u062D\u0629 \u0623\u0644\u0648\u0627\u0646 \u0643\u062D\u0644\u064A\u0629 \u062F\u0627\u0643\u0646\u0629 \u0628\u0644\u0645\u0633\u0627\u062A \u0632\u0631\u0642\u0627\u0621 \u0643\u0647\u0631\u0628\u0627\u0626\u064A\u0629" : basics?.colorVibe === "minimal_light" ? "\u0623\u0633\u0644\u0648\u0628 \u0633\u0648\u064A\u0633\u0631\u064A \u0623\u0628\u064A\u0636 \u0646\u0627\u0635\u0639 \u0648\u062A\u0635\u0645\u064A\u0645 \u0645\u0628\u0633\u0637 \u0641\u0627\u0626\u0642 \u0627\u0644\u0646\u0642\u0627\u0621" : basics?.colorVibe === "botanical" ? "\u0644\u0648\u062D\u0629 \u0623\u0644\u0648\u0627\u0646 \u0646\u0628\u0627\u062A\u064A\u0629 \u062A\u0631\u0627\u0628\u064A\u0629 \u0647\u0627\u062F\u0626\u0629 \u0648\u0645\u0646\u0639\u0634\u0629 \u0648\u0645\u0631\u064A\u062D\u0629 \u0644\u0644\u0639\u064A\u0646" : "\u0644\u0648\u062D\u0629 \u0623\u0644\u0648\u0627\u0646 \u0643\u062D\u0644\u064A\u0629 \u0627\u062D\u062A\u0631\u0627\u0641\u064A\u0629 \u0648\u0645\u0638\u0647\u0631 \u0648\u0642\u0627\u0631 \u062A\u0646\u0641\u064A\u0630\u064A \u0644\u0644\u0634\u0631\u0643\u0627\u062A";
        const selStyleAr = basics?.designStyle === "minimalist" ? "\u0645\u0628\u0633\u0637 \u062C\u062F\u0627\u064B \u064A\u0631\u0643\u0632 \u0639\u0644\u0649 \u0627\u0644\u0645\u062D\u062A\u0648\u0649 \u0648\u0627\u0644\u0645\u0633\u0627\u062D\u0627\u062A \u0627\u0644\u0633\u0644\u0628\u064A\u0629 \u0627\u0644\u0623\u0646\u064A\u0642\u0629" : basics?.designStyle === "cyber" ? "\u0623\u0633\u0644\u0648\u0628 \u0645\u0633\u062A\u0642\u0628\u0644\u064A \u062C\u0631\u064A\u0621 \u064A\u062A\u0636\u0645\u0646 \u0639\u0646\u0627\u0635\u0631 \u0632\u062C\u0627\u062C\u064A\u0629 Glassmorphism \u0639\u0627\u0644\u064A\u0629 \u0627\u0644\u062A\u0623\u062B\u064A\u0631" : basics?.designStyle === "classy" ? "\u0623\u0633\u0644\u0648\u0628 \u0643\u0644\u0627\u0633\u064A\u0643\u064A \u0631\u0627\u0642\u064D \u064A\u062A\u0645\u064A\u0632 \u0628\u062E\u0637\u0648\u0637 Serif \u0627\u0644\u0623\u0646\u064A\u0642\u0629 \u0648\u0627\u0644\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0630\u0647\u0628\u064A\u0629 \u0627\u0644\u0641\u062E\u0645\u0629" : "\u0637\u0627\u0628\u0639 \u0645\u0641\u0639\u0645 \u0628\u0627\u0644\u062C\u0631\u0623\u0629\u060C \u0630\u0648 \u062A\u0628\u0627\u064A\u0646 \u0639\u0627\u0644\u064D \u0648\u062D\u0634\u0648\u0627\u062A \u062B\u0642\u064A\u0644\u0629 \u0645\u0644\u0641\u062A\u0629 \u0644\u0644\u0646\u0638\u0631";
        const selFeaturesAr = (basics?.features || []).map((f) => f === "bilingual" ? "\u062F\u0639\u0645 \u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0648\u0627\u0644\u0625\u0646\u062C\u0644\u064A\u0632\u064A\u0629" : f === "seo" ? "\u062A\u0647\u064A\u0626\u0629 \u0634\u0627\u0645\u0644\u0629 \u0644\u0645\u062D\u0631\u0643\u0627\u062A \u0627\u0644\u0628\u062D\u062B (SEO)" : f === "motion" ? "\u062D\u0631\u0643\u0627\u062A \u0627\u0646\u062A\u0642\u0627\u0644\u064A\u0629 \u0648\u062A\u0641\u0627\u0639\u0644 \u0633\u0644\u0633 \u0645\u0639 \u0627\u0644\u062A\u0645\u0631\u064A\u0631 (Motion)" : f === "dark_mode" ? "\u062F\u0639\u0645 \u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u062F\u0627\u0643\u0646 \u0627\u0644\u062A\u0644\u0642\u0627\u0626\u064A" : f === "auth" ? "\u0646\u0638\u0627\u0645 \u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646 \u0648\u062A\u0633\u062C\u064A\u0644 \u0622\u0645\u0646" : "\u062A\u0646\u0628\u064A\u0647\u0627\u062A \u0641\u0648\u0631\u064A\u0629 \u0645\u0631\u0646\u0629").join("\u060C ") || "\u0627\u0644\u0645\u0645\u064A\u0632\u0627\u062A \u0627\u0644\u0642\u064A\u0627\u0633\u064A\u0629\u060C \u0645\u062A\u062C\u0627\u0648\u0628\u0629 \u0644\u0644\u0640 Mobile \u0648\u0627\u0644\u0648\u064A\u0628";
        const defaultApproachAr = `### \u{1F31F} \u0627\u0644\u062A\u062D\u0644\u064A\u0644 \u0627\u0644\u0623\u0648\u0644\u064A \u0627\u0644\u0645\u062E\u0635\u0635 \u0644\u0641\u0643\u0631\u062A\u0643
\u062A\u0639\u062A\u0628\u0631 \u0641\u0643\u0631\u062A\u0643 \u0644\u0628\u0646\u0627\u0621 **${idea}** \u0645\u0645\u062A\u0627\u0632\u0629 \u0648\u0648\u0627\u0639\u062F\u0629 \u062C\u062F\u0627\u064B! \u0648\u062D\u0633\u0628 \u0631\u063A\u0628\u062A\u0643 \u0641\u064A \u0628\u0646\u0627\u0621 **${selServAr}**\u060C \u0641\u0642\u062F \u0642\u0645\u0646\u0627 \u0628\u0635\u064A\u0627\u063A\u0629 \u0647\u0630\u0627 \u0627\u0644\u062A\u0642\u0631\u064A\u0631 \u0627\u0644\u0627\u0633\u062A\u0634\u0627\u0631\u064A \u0644\u064A\u0637\u0627\u0628\u0642 \u062A\u0637\u0644\u0639\u0627\u062A\u0643.

### \u{1F3A8} \u0627\u0644\u0647\u0648\u064A\u0629 \u0627\u0644\u0628\u0635\u0631\u064A\u0629 \u0648\u0623\u0633\u0644\u0648\u0628 \u0627\u0644\u062A\u0635\u0645\u064A\u0645:
1. **\u0644\u0648\u062D\u0629 \u0627\u0644\u0623\u0644\u0648\u0627\u0646 \u0627\u0644\u0645\u062D\u062F\u062F\u0629**: \u0633\u0646\u0639\u062A\u0645\u062F **${selColorAr}** \u0644\u062A\u0645\u0646\u062D \u0639\u0645\u0644\u0627\u0621\u0643 \u062A\u062C\u0631\u0628\u0629 \u0645\u0645\u064A\u0632\u0629 \u062A\u0646\u0627\u0633\u0628 \u0627\u0644\u0639\u0635\u0631.
2. **\u0627\u0644\u0637\u0627\u0628\u0639 \u0627\u0644\u0639\u0627\u0645 \u0644\u0644\u0648\u0627\u062C\u0647\u0627\u062A**: \u0627\u062E\u062A\u0631\u0646\u0627 \u062A\u0637\u0628\u064A\u0642 \u0627\u0644\u0623\u0633\u0644\u0648\u0628 \u0627\u0644\u0640 **${selStyleAr}** \u0644\u062A\u062D\u0642\u064A\u0642 \u0627\u0644\u062A\u0646\u0627\u0633\u0642 \u0648\u0627\u0643\u062A\u0633\u0627\u0628 \u0648\u0644\u0627\u0621 \u0632\u0648\u0627\u0631\u0643 \u0641\u0648\u0631 \u0627\u0644\u062F\u062E\u0648\u0644 \u0644\u0644\u0645\u0648\u0642\u0639.
3. **\u0627\u0644\u062E\u0635\u0627\u0626\u0635 \u0648\u0627\u0644\u0648\u0638\u0627\u0626\u0641 \u0627\u0644\u0645\u062F\u0645\u062C\u0629**: \u0633\u0646\u0642\u0648\u0645 \u0628\u0640\u062A\u0636\u0645\u064A\u0646: **${selFeaturesAr}**.

### \u{1F6E0}\uFE0F \u0627\u0644\u0623\u062F\u0648\u0627\u062A \u0648\u0627\u0644\u062E\u0637\u0648\u0627\u062A \u0627\u0644\u062A\u0642\u0646\u064A\u0629 \u0627\u0644\u0645\u0642\u062A\u0631\u062D\u0629 \u0645\u0646 \u0645\u0627\u0644\u0643 \u0623\u0631\u062A:
- **\u0648\u0627\u062C\u0647\u0629 \u0627\u0644\u0639\u0645\u064A\u0644 (Frontend)**: \u0627\u0633\u062A\u062E\u062F\u0627\u0645 **React 19** \u0645\u0639 **Vite** \u0644\u062A\u0623\u0645\u064A\u0646 \u0628\u0646\u064A\u0629 \u0645\u0633\u062A\u062F\u0627\u0645\u0629 \u0633\u0631\u064A\u0639\u0629 \u0627\u0644\u062A\u062D\u0645\u064A\u0644\u060C \u0645\u0639 \u062A\u062D\u0631\u064A \u0627\u0644\u0640 Mini-bundles \u0644\u0636\u0645\u0627\u0646 \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0635\u0641\u062D\u0629 \u0641\u064A \u0623\u0642\u0644 \u0645\u0646 1.5 \u062B\u0627\u0646\u064A\u0629.
- **\u0627\u0644\u062A\u0641\u0627\u0639\u0644 \u0627\u0644\u0641\u0627\u0626\u0642**: \u062F\u0645\u062C \u0645\u0643\u062A\u0628\u0629 **Motion** \u0644\u062A\u0646\u0641\u064A\u0630 \u062A\u0623\u062B\u064A\u0631\u0627\u062A \u062A\u0645\u0631\u064A\u0631 \u062B\u0644\u0627\u062B\u064A\u0629 \u0627\u0644\u0623\u0628\u0639\u0627\u062F \u062E\u0641\u064A\u0641\u0629 \u062A\u0639\u0637\u064A \u0627\u0644\u0632\u0648\u0627\u0631 \u0634\u0639\u0648\u0631\u0627\u064B \u0628\u0627\u0644\u062A\u0643\u0627\u0645\u0644 \u0648\u0627\u0644\u0641\u062E\u0627\u0645\u0629.
- **\u0627\u0644\u0646\u0638\u0627\u0645 \u0627\u0644\u062E\u0644\u0641\u064A \u0648\u0627\u0633\u062A\u0636\u0627\u0641\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A**: \u062F\u0645\u062C \u0642\u0627\u0639\u062F\u0629 \u0628\u064A\u0627\u0646\u0627\u062A \u0633\u062D\u0627\u0628\u064A\u0629 \u0645\u062A\u062C\u0627\u0648\u0628\u0629 \u062A\u0648\u0641\u0631 \u062A\u062D\u062F\u064A\u062B\u0627\u062A \u0641\u0648\u0631\u064A\u0629 \u0648\u0625\u0634\u0639\u0627\u0631 \u0630\u0643\u064A \u0641\u0648\u0631\u064A \u0644\u0644\u0645\u0637\u0648\u0631.

### \u23F1\uFE0F \u0627\u0644\u0625\u0637\u0627\u0631 \u0627\u0644\u0632\u0645\u0646\u064A \u0627\u0644\u0645\u0642\u062F\u0631:
- **\u0645\u0631\u062D\u0644\u0629 \u0627\u0644\u062A\u0635\u0645\u064A\u0645 \u0648\u0627\u0644\u062A\u062E\u0637\u064A\u0637 (UI/UX)**: 7 \u0625\u0644\u0649 10 \u0623\u064A\u0627\u0645 \u0639\u0645\u0644 \u0644\u0645\u0637\u0627\u0628\u0642\u0629 \u0627\u0644\u0623\u0633\u0627\u0633\u064A\u0627\u062A \u0627\u0644\u0645\u0639\u0631\u0648\u0636\u0629.
- **\u0645\u0631\u062D\u0644\u0629 \u0627\u0644\u0628\u0631\u0645\u062C\u0629 \u0648\u0627\u0644\u062A\u0637\u0648\u064A\u0631 \u0648\u0627\u062E\u062A\u0628\u0627\u0631 \u0627\u0644\u0623\u062F\u0627\u0621**: 14 \u0625\u0644\u0649 20 \u064A\u0648\u0645 \u0639\u0645\u0644.
- **\u0627\u0644\u0625\u0637\u0644\u0627\u0642 \u0648\u0627\u0644\u0635\u064A\u0627\u0646\u0629 \u0648\u0627\u0644\u062A\u062D\u0633\u064A\u0646 \u0644\u0640 SEO**: 3 \u0623\u064A\u0627\u0645 \u0639\u0645\u0644.

*(\u0647\u0630\u0627 \u0627\u0644\u062A\u062D\u0644\u064A\u0644 \u062A\u0645 \u0625\u0646\u062A\u0627\u062C\u0647 \u0628\u0645\u062D\u0627\u0643\u064A \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A \u0645\u062F\u0645\u062C\u0627\u064B \u0628\u062E\u064A\u0627\u0631\u0627\u062A\u0643 \u0627\u0644\u0623\u0633\u0627\u0633\u064A\u0629. \u0644\u062A\u0641\u0639\u064A\u0644 \u0627\u0644\u0627\u0633\u062A\u0634\u0627\u0631\u0629 \u0627\u0644\u062D\u064A\u0629 \u0645\u0646 \u0637\u0631\u0627\u0632 Gemini AI\u060C \u064A\u0631\u062C\u0649 \u062A\u0632\u0648\u064A\u062F \u0645\u0641\u062A\u0627\u062D GEMINI_API_KEY \u0641\u064A \u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u062A\u0637\u0628\u064A\u0642)*`;
        const selServEn = basics?.serviceType === "landing_page" ? "High-converting Promotional Landing Page" : basics?.serviceType === "ecommerce" ? "E-Commerce system equipped with Stripe and Cart controls" : basics?.serviceType === "dashboard" ? "Custom system with administrative controls, dashboard grids, and custom metrics" : basics?.serviceType === "branding" ? "Inspired Brand Identity & Custom Logo" : "Interactive Prototype Mobile Application";
        const selColorEn = basics?.colorVibe === "dark_navy" ? "Dark Navy with Electric Blue accents" : basics?.colorVibe === "minimal_light" ? "Pure Swiss Minimalist off-white concept" : basics?.colorVibe === "botanical" ? "Soothing Botanical Ecology theme" : "Executive Professional Corporate Blue tone";
        const selStyleEn = basics?.designStyle === "minimalist" ? "Minimalist focus leveraging luxury typography and generous padding" : basics?.designStyle === "cyber" ? "Sci-Fi cyberpunk aesthetic featuring interactive Glassmorphism grids" : basics?.designStyle === "classy" ? "Classy Serif editorial design" : "Bold high-contrast brutalist layout";
        const selFeaturesEn = (basics?.features || []).join(", ") || "Standard responsive elements";
        const defaultApproachEn = `### \u{1F31F} Customized Product Strategy
Your vision to design **${idea}** is highly promising! Based on your preferred choice of a **${selServEn}**, here is Malek Art's custom strategized analysis sheet.

### \u{1F3A8} Visual Architecture & Selected Basics:
1. **Interactive Color Theme**: We have integrated the **${selColorEn}** to guarantee your audience can engage instantly.
2. **Dominant Aesthetic Vibe**: We will adopt a **${selStyleEn}** to augment user satisfaction and ensure elegant modern readability.
3. **Core Integrated Features**: The implementation will feature: **${selFeaturesEn}**.

### \u{1F6E0}\uFE0F Recommended Technological Stack:
- **Frontend Architecture**: **React 19** paired with **Vite** to formulate a super lightweight frame of high responsive fidelity.
- **Motion Design**: Integrating **Motion** to deploy immersive scroll animations and page transitions that augment retention.
- **Backend Database**: Integrating real-time cloud data streams to authorize micro-interactions and instant email/notification updates.

### \u23F1\uFE0F Estimated Execution Timeline:
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
      const ai = new import_genai.GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
      const formattedProjects = (projects || []).map((p) => `- ID: ${p.id}, Title: ${p.titleEn} (${p.titleAr}), Category: ${p.categoryEn}, Desc: ${p.descriptionEn}`).join("\n");
      let systemInstruction = isAr ? "\u0623\u0646\u062A \u0627\u0644\u0645\u0633\u062A\u0634\u0627\u0631 \u0627\u0644\u062A\u0642\u0646\u064A \u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A \u0644\u0644\u0645\u0635\u0645\u0645 \u0648\u0645\u0637\u0648\u0631 \u0627\u0644\u0645\u0648\u0627\u0642\u0639 \u0627\u0644\u0645\u062D\u062A\u0631\u0641 '\u0645\u0627\u0644\u0643 \u0623\u0631\u062A (Malek Art)'. \u0642\u0645 \u0628\u062A\u062D\u0644\u064A\u0644 \u0641\u0643\u0631\u0629 \u0627\u0644\u0645\u0634\u0631\u0648\u0639 \u0627\u0644\u0645\u0642\u062F\u0645\u0629 \u0645\u0646 \u0627\u0644\u0639\u0645\u064A\u0644 \u0628\u0623\u0633\u0644\u0648\u0628 \u0625\u0628\u062F\u0627\u0639\u064A\u060C \u0631\u0627\u0642\u064D \u0648\u0645\u0642\u0646\u0639 \u064A\u0628\u0631\u0632 \u062E\u0628\u0631\u0627\u062A \u0648\u062C\u0645\u0627\u0644\u064A\u0627\u062A \u0623\u0639\u0645\u0627\u0644 \u0645\u0627\u0644\u0643. \u062A\u062D\u062F\u062B \u0628\u0636\u0645\u064A\u0631 \u0627\u0644\u0645\u062A\u0643\u0644\u0645 \u0646\u064A\u0627\u0628\u0629 \u0639\u0646 \u0641\u0631\u064A\u0642 \u0645\u0627\u0644\u0643 \u0623\u0631\u062A \u0623\u0648 \u0645\u0627\u0644\u0643 \u0646\u0641\u0633\u0647 (\u0645\u062B\u0627\u0644: '\u0623\u0642\u062A\u0631\u062D \u0639\u0644\u064A\u0643'\u060C '\u0641\u064A \u0645\u0634\u0631\u0648\u0639\u0646\u0627 \u0627\u0644\u0633\u0627\u0628\u0642'). \u0627\u0646\u0635\u062D \u0627\u0644\u0639\u0645\u064A\u0644 \u0628\u0623\u0641\u0636\u0644 \u0627\u0644\u062A\u0642\u0646\u064A\u0627\u062A (Front-end, UX, Motion, Database) \u0648\u0627\u0644\u0625\u0637\u0627\u0631 \u0627\u0644\u0632\u0645\u0646\u064A\u060C \u0648\u0627\u0642\u062A\u0631\u062D \u0627\u0644\u0645\u0634\u0631\u0648\u0639 \u0627\u0644\u0634\u0628\u064A\u0647 \u062C\u062F\u0627\u064B \u0645\u0646 \u0642\u0627\u0626\u0645\u0629 \u0623\u0639\u0645\u0627\u0644 \u0645\u0627\u0644\u0643 \u0627\u0644\u0633\u0627\u0628\u0642\u0629 \u0648\u0627\u0630\u0643\u0631 \u0633\u0628\u0628 \u0627\u0644\u0634\u0628\u0647 \u0628\u0634\u0643\u0644 \u062F\u0642\u064A\u0642." : "You are the smart AI Project Strategist representing the creative designer & web developer 'Malek Art'. Analyze the client's project idea with high professionalism, design-forward terms, and eloquent articulation. Speak in the first person on behalf of Malek Art (e.g., 'I recommend', 'In my previous project'). Advise them on optimal technical stacks (Front-end, Motion design, UX structure, Database solutions) and timelines. Select the most relevant project from Malek's collection and explain why it provides the perfect benchmark.";
      const customPersona = isAr ? aiCustomPromptAr : aiCustomPromptEn;
      if (customPersona && customPersona.trim()) {
        systemInstruction += `

\u0625\u0631\u0634\u0627\u062F\u0627\u062A \u0645\u062E\u0635\u0635\u0629 \u0648\u0645\u0648\u062C\u0647\u0629 \u0625\u0636\u0627\u0641\u064A\u0629 \u0645\u0646 \u0645\u0627\u0644\u0643 \u0623\u0631\u062A (Strict Custom Advisor Guidelines): ${customPersona}`;
      }
      const prompt = `
Client Request Language: ${language}
Project Idea: "${idea}"
Client Budget Level: ${budget}

Chosen Design Basics by Client:
- Service/Project Type: ${basics?.serviceType || "Not specified"}
- Visual Theme / Colors: ${basics?.colorVibe || "Not specified"}
- Design Style: ${basics?.designStyle || "Not specified"}
- Demanded Features: ${(basics?.features || []).join(", ") || "Not specified"}

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
          temperature: 0.7
        }
      });
      const responseText = response.text || "";
      let matchedProjectId = "3";
      const matchRegex = /MATCHED_PROJECT_ID:\s*([^\s\n\r]+)/i;
      const match = responseText.match(matchRegex);
      if (match && match[1]) {
        matchedProjectId = match[1].trim().replace(/[\[\]]/g, "");
      }
      const cleanedApproach = responseText.replace(/MATCHED_PROJECT_ID:?.*/i, "").trim();
      return res.json({
        matchedProjectId,
        approach: cleanedApproach
      });
    } catch (error) {
      console.error("Gemini API Error in route:", error);
      res.status(500).json({ error: error.message || "Failed to make intelligent AI consultation" });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Malek Logic Server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
