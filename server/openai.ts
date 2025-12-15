import OpenAI from "openai";
import { config } from "./config";

/**
 * The shape of the discernment result returned by the AI.
 */
export interface DiscernmentAnalysis {
  discernmentScore: number;
  faithAnalysis: string;
  tags: string[];
  verseText: string;
  verseReference: string;
  alternatives: Array<{
    title: string;
    reason: string;
  }>;
}

/**
 * Build a rich prompt for the AI based on media metadata.
 */
function buildPrompt(
  title: string,
  mediaType: string = "movie",
  releaseYear?: string | null,
  overview?: string | null
): string {
  const isBook = mediaType === "book";
  let contextInfo = `"${title}" (a ${mediaType}`;

  if (releaseYear) {
    contextInfo += `, ${isBook ? "published" : "released"} ${releaseYear}`;
  }
  contextInfo += `)`;

  if (overview) {
    contextInfo += `\n\n${isBook ? "Synopsis" : "Plot Summary"}: ${overview}`;
  }

  const instructions = `
You are a Christian media discernment expert. Analyze ${contextInfo} and provide
a concise assessment from a biblical worldview.

Return your answer as **valid JSON** ONLY, with this exact shape:

{
  "discernmentScore": <number 0-100>,
  "faithAnalysis": "<2 short paragraphs, max 4-5 sentences total>",
  "tags": ["<short tag>", "..."],
  "verseText": "<Bible verse text, NLT>",
  "verseReference": "<Book chapter:verse (NLT)>",
  "alternatives": [
    { "title": "<title>", "reason": "<1 short sentence (max 15 words)>" },
    { "title": "<title>", "reason": "<1 short sentence (max 15 words)>" },
    { "title": "<title>", "reason": "<1 short sentence (max 15 words)>" }
  ]
}

Scoring guide:
- 85–100: Faith‑safe / uplifting / aligns with Christian values
- 65–84: Mixed / some concerns / use caution
- 0–64: Significant concern / not recommended for believers

In "faithAnalysis":
- Briefly highlight any occult, sexual, violent, or anti‑biblical content.
- Then give clear, pastoral guidance for Christians (no fear‑mongering).
  `;

  return instructions.trim();
}

/**
 * Create a Perplexity AI client using the OpenAI SDK (compatible API).
 * Returns null if API key is not available.
 */
function getPerplexityClient(): OpenAI | null {
  const apiKey = config.perplexityApiKey;

  if (!apiKey) {
    return null;
  }

  return new OpenAI({
    apiKey,
    baseURL: "https://api.perplexity.ai"
  });
}

/**
 * Call Perplexity AI and parse the JSON response into our DiscernmentAnalysis type.
 * Perplexity provides real-time web access for accurate, up-to-date media information.
 */
export async function analyzeMedia(
  title: string,
  mediaType: string = "movie",
  releaseYear?: string | null,
  overview?: string | null
): Promise<DiscernmentAnalysis> {
  const client = getPerplexityClient();

  if (!client) {
    return {
      discernmentScore: 50,
      faithAnalysis: "AI service is unavailable right now.",
      tags: ["service-unavailable"],
      verseText: "",
      verseReference: "",
      alternatives: [],
    };
  }

  const prompt = buildPrompt(title, mediaType, releaseYear, overview);

  console.log(
    `[Perplexity] Analyzing media: "${title}" (${mediaType}), year=${releaseYear ?? "N/A"}`
  );

  try {
    const completion = await client.chat.completions.create({
      model: "sonar-pro",
      messages: [
        {
          role: "system",
          content:
            "You are an expert media analyst with real-time web access. Search for the specific title's parents guide, plot themes, and reviews before generating the discernment score. Be precise and cite sources.",
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const raw =
      completion.choices[0]?.message?.content?.trim() ?? "";

    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      console.error("[Perplexity] Failed to parse JSON response");
      throw new Error("Failed to parse Perplexity JSON response");
    }

    const result: DiscernmentAnalysis = {
      discernmentScore: Number(parsed.discernmentScore ?? 50),
      faithAnalysis: String(parsed.faithAnalysis ?? "No analysis was provided."),
      tags: Array.isArray(parsed.tags)
        ? parsed.tags.map((t: any) => String(t))
        : [],
      verseText: String(parsed.verseText ?? ""),
      verseReference: String(parsed.verseReference ?? ""),
      alternatives: Array.isArray(parsed.alternatives)
        ? parsed.alternatives.map((alt: any) => ({
            title: String(alt?.title ?? ""),
            reason: String(alt?.reason ?? ""),
          }))
        : [],
    };

    return result;
  } catch (error) {
    console.error("[Perplexity] Error while analyzing media:", error);

    // Safe fallback so the UI can still render something
    return {
      discernmentScore: 50,
      faithAnalysis:
        "We encountered an issue while generating a full discernment analysis for this title. Please try again later, or use prayerful wisdom and biblical principles as you decide whether to watch or read this content.",
      tags: ["analysis-error"],
      verseText: "",
      verseReference: "",
      alternatives: [],
    };
  }
}

/**
 * Placeholder IMDB fetcher – not used by routes yet,
 * but exported to keep the original API surface.
 */
export async function fetchIMDBData(title: string) {
  console.log("[Perplexity] fetchIMDBData stub called for title:", title);

  return {
    imdbRating: undefined,
    genre: undefined,
    description: undefined,
    posterUrl: undefined,
    trailerUrl: undefined,
  };
}
