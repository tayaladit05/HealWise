import express from "express";
import OpenAI from "openai";

const router = express.Router();

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const specialtyRules = [
  {
    specialty: "Cardiologist",
    keywords: ["chest pain", "palpitation", "heart", "bp", "blood pressure", "shortness of breath"],
  },
  {
    specialty: "Dermatologist",
    keywords: ["rash", "acne", "itching", "eczema", "skin", "fungal", "allergy"],
  },
  {
    specialty: "Neurologist",
    keywords: ["headache", "migraine", "seizure", "numbness", "dizziness", "stroke"],
  },
  {
    specialty: "Gastroenterologist",
    keywords: ["stomach", "abdominal", "vomit", "nausea", "acidity", "constipation", "diarrhea", "liver"],
  },
  {
    specialty: "Gynecologist",
    keywords: ["period", "pregnancy", "pcod", "pcos", "menstrual", "uterus", "vaginal"],
  },
  {
    specialty: "Pediatrician",
    keywords: ["child", "baby", "infant", "newborn", "kid"],
  },
  {
    specialty: "Orthopedic",
    keywords: ["joint", "knee", "back pain", "fracture", "bone", "shoulder", "neck pain"],
  },
  {
    specialty: "ENT Specialist",
    keywords: ["ear", "nose", "throat", "sinus", "tonsil", "hearing"],
  },
  {
    specialty: "Pulmonologist",
    keywords: ["cough", "wheezing", "asthma", "breathing", "lung", "phlegm"],
  },
  {
    specialty: "Psychiatrist",
    keywords: ["anxiety", "depression", "panic", "insomnia", "stress", "mood"],
  },
];

function fallbackSpecialty(symptoms) {
  const text = (symptoms || "").toLowerCase();
  let best = { specialty: "General Physician", score: 0 };

  for (const rule of specialtyRules) {
    const score = rule.keywords.reduce((acc, key) => (text.includes(key) ? acc + 1 : acc), 0);
    if (score > best.score) {
      best = { specialty: rule.specialty, score };
    }
  }

  return best.specialty;
}

router.post("/symptom-checker", async (req, res) => {
  const { symptoms } = req.body;

  // Validate input
  if (!symptoms || !symptoms.trim()) {
    return res.status(400).json({ message: "Please provide symptoms." });
  }

  if (!openai) {
    return res.json({ specialty: fallbackSpecialty(symptoms), source: "fallback" });
  }

  try {
  
    const prompt = `
You are a medical assistant AI.

Your job is to read the user's symptoms or disease name and identify
the single most appropriate doctor specialty that they should consult.

Respond ONLY with the doctor's specialty name (e.g., "Cardiologist", "Dermatologist", "Orthopedic", "Psychiatrist", "General Physician").
Do NOT include any explanations or additional text.

User input: ${symptoms}
Answer:
`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // fast + smart
      messages: [{ role: "user", content: prompt }],
      temperature: 0, // deterministic output
    });

    const specialty = completion.choices?.[0]?.message?.content?.trim();
    if (!specialty) {
      return res.json({ specialty: fallbackSpecialty(symptoms), source: "fallback" });
    }

    res.json({ specialty: specialty.replace(/["`]/g, ""), source: "ai" });
  } catch (error) {
    console.error("OpenAI Error:", error.message);
    res.json({ specialty: fallbackSpecialty(symptoms), source: "fallback" });
  }
});

export default router;
