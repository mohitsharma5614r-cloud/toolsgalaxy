import { GoogleGenAI, Modality, GenerateContentResponse, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

// Initialize AI client only if API key is available
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

// Helper to check if API is available
function ensureApiAvailable() {
  if (!ai || !API_KEY) {
    throw new Error("AI service is currently unavailable. Please try again later.");
  }
}

// --- Helper for JSON responses ---
async function generateJson(model: string, contents: any, responseSchema: any) {
    ensureApiAvailable();
    try {
        const response = await ai!.models.generateContent({
            model,
            contents,
            config: {
                responseMimeType: "application/json",
                responseSchema,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        throw new Error("Unable to process your request. Please try again.");
    }
}

// --- Helper for Text-only responses ---
async function generateText(model: string, contents: any): Promise<string> {
    ensureApiAvailable();
    try {
        const response = await ai!.models.generateContent({ model, contents });
        const text = response.text;
        if (text) {
            return text;
        } else {
            throw new Error("Unable to generate content. Please try again.");
        }
    } catch (error) {
        throw new Error("Unable to process your request. Please try again.");
    }
}

// --- Helper for Image-to-Image responses ---
async function generateImageFromImage(model: string, base64ImageData: string, mimeType: string, textPrompt: string): Promise<string | null> {
    ensureApiAvailable();
    try {
        const response: GenerateContentResponse = await ai!.models.generateContent({
          model,
          contents: {
            parts: [
              { inlineData: { data: base64ImageData, mimeType } },
              { text: textPrompt },
            ],
          },
          config: {
            responseModalities: [Modality.IMAGE],
          },
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            return part.inlineData.data;
          }
        }
        throw new Error("Unable to generate image. Please try a different prompt or image.");
    } catch (error) {
        throw new Error("Image processing failed. Please try again with a different image.");
    }
}

// --- Existing & Fixed Functions ---

export async function editImageWithPrompt(base64ImageData: string, mimeType: string, prompt: string): Promise<string | null> {
  try {
    return await generateImageFromImage('gemini-2.5-flash-image', base64ImageData, mimeType, prompt);
  } catch (error) {
    throw new Error("Failed to edit image. Please try again.");
  }
}

export async function eraseObjectInImage(base64ImageData: string, mimeType: string, maskBase64: string): Promise<string | null> {
  ensureApiAvailable();
  try {
    const response: GenerateContentResponse = await ai!.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64ImageData, mimeType: mimeType } },
          { inlineData: { data: maskBase64, mimeType: 'image/png' } },
          { text: 'Use the provided mask to identify the object to remove. Erase the object completely and realistically fill in the background (in-painting) as if the object was never there. The output must be a high-quality, realistic image.' },
        ],
      },
      config: { responseModalities: [Modality.IMAGE] },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) { return part.inlineData.data; }
    }
    throw new Error("Failed to erase object. Please try again.");
  } catch (error) {
    throw new Error("Failed to erase object. Please try again.");
  }
}

export async function removeImageBackground(base64ImageData: string, mimeType: string): Promise<string | null> {
  return generateImageFromImage('gemini-2.5-flash-image', base64ImageData, mimeType, 'Remove the background and make it transparent. The output must be a PNG with a transparent background.');
}

export async function removeWatermark(base64ImageData: string, mimeType: string): Promise<string | null> {
  return generateImageFromImage('gemini-2.5-flash-image', base64ImageData, mimeType, 'Carefully and completely remove any watermarks (text, logos, or patterns) from this image. Seamlessly reconstruct the area behind the watermark. The final output must be a clean image with no trace of the original watermark.');
}

export async function generateArticle(topic: string): Promise<string> {
  return generateText('gemini-2.5-flash', `Write a short, informative, and engaging article about the following topic: "${topic}". The article should be well-structured with a clear introduction, body, and conclusion. Do not use markdown.`);
}

export interface PresentationSlide { title: string; content: string; }
export async function generatePresentation(topic: string): Promise<PresentationSlide[]> {
    return generateJson("gemini-2.5-flash", `Generate a 5-slide presentation outline for the topic: "${topic}". For each slide, provide a concise title and three bullet points. The first slide should be the title slide.`, {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING, description: "The title of the slide." },
                content: { type: Type.STRING, description: "Bulleted content for the slide, separated by newlines." },
            },
            required: ["title", "content"]
        },
    });
}

export interface Idea { name: string; description: string; }
export async function generateIdeas(category: string): Promise<Idea[]> {
    return generateJson("gemini-2.5-flash", `Generate 3 unique and creative ideas for the category: "${category}". For each idea, provide a name and a short, compelling description.`, {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING, description: "The name of the idea." },
                description: { type: Type.STRING, description: "A short description of the idea." },
            },
            required: ["name", "description"]
        },
    });
}

export interface ResumeContent { summary: string; experience: string[]; }
export async function generateResumeContent(name: string, jobTitle: string, skills: string): Promise<ResumeContent> {
    return generateJson("gemini-2.5-flash", `Generate a professional resume summary and 3-5 key experience bullet points for a person named ${name} applying for the job of ${jobTitle} with the following skills: ${skills}.`, {
        type: Type.OBJECT,
        properties: {
            summary: { type: Type.STRING, description: "A professional summary for the resume, 2-3 sentences long." },
            experience: {
                type: Type.ARRAY,
                items: { type: Type.STRING, description: "A bullet point describing a key experience or achievement." }
            }
        },
        required: ["summary", "experience"]
    });
}

// --- NEWLY ADDED FUNCTIONS ---

export async function swapFaces(sourceBase64: string, sourceMimeType: string, targetBase64: string, targetMimeType: string): Promise<string | null> {
    ensureApiAvailable();
    try {
        const response: GenerateContentResponse = await ai!.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { data: sourceBase64, mimeType: sourceMimeType } },
                    { inlineData: { data: targetBase64, mimeType: targetMimeType } },
                    { text: "Take the face from the first image and swap it onto the most prominent person in the second image. Blend it realistically." }
                ]
            },
            config: { responseModalities: [Modality.IMAGE] }
        });
        for (const part of response.candidates?.[0]?.content?.parts || []) { if (part.inlineData) return part.inlineData.data; }
        throw new Error("Failed to swap faces. Please try again.");
    } catch (error) {
        throw new Error("Failed to swap faces. Please try again.");
    }
}

export async function genderSwapImage(base64: string, mimeType: string, targetGender: 'male' | 'female'): Promise<string | null> {
    return generateImageFromImage('gemini-2.5-flash-image', base64, mimeType, `Transform the person in this photo into a realistic-looking ${targetGender}. Keep the original background and style.`);
}

export async function applyHairstyle(base64: string, mimeType: string, hairstyle: string): Promise<string | null> {
    return generateImageFromImage('gemini-2.5-flash-image', base64, mimeType, `Realistically change the person's hairstyle to a '${hairstyle}'. Match the lighting and photo style.`);
}

export async function applyBeardStyle(base64: string, mimeType: string, beardStyle: string): Promise<string | null> {
    return generateImageFromImage('gemini-2.5-flash-image', base64, mimeType, `Realistically add a '${beardStyle}' to the person's face. Match the hair color, lighting, and photo style.`);
}

export async function applyMakeup(base64: string, mimeType: string, makeupStyle: string): Promise<string | null> {
    return generateImageFromImage('gemini-2.5-flash-image', base64, mimeType, `Apply a '${makeupStyle}' makeup look to the person in the photo. Be realistic and detailed.`);
}

export async function changeExpression(base64: string, mimeType: string, expression: string): Promise<string | null> {
    return generateImageFromImage('gemini-2.5-flash-image', base64, mimeType, `Subtly and realistically change the person's facial expression to look ${expression}.`);
}

export async function generateThumbnailOrBanner(prompt: string, aspectRatio: string): Promise<string | null> {
    ensureApiAvailable();
    try {
        const response = await ai!.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: `YouTube thumbnail, banner image: ${prompt}. Cinematic, eye-catching, high contrast, vibrant colors.`,
            config: { numberOfImages: 1, outputMimeType: 'image/jpeg', aspectRatio },
        });
        if (response.generatedImages && response.generatedImages.length > 0) {
            return response.generatedImages[0].image.imageBytes;
        }
        throw new Error("Failed to generate image. Please try again.");
    } catch (error) {
        throw new Error("Failed to generate image. Please try again.");
    }
}

export interface QuizQuestion { question: string; options: string[]; answer: string; }
export async function generateQuiz(topic: string, numQuestions: number, difficulty: string): Promise<QuizQuestion[]> {
    return generateJson("gemini-2.5-flash", `Create a ${difficulty} quiz with ${numQuestions} questions on the topic of "${topic}". Each question must have 4 multiple-choice options and a correct answer.`, {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                answer: { type: Type.STRING },
            },
            required: ["question", "options", "answer"]
        }
    });
}

export async function organizeNotes(rawText: string): Promise<string> {
    return generateText('gemini-2.5-flash', `Organize the following messy notes into a structured format with a title, headings, and bullet points. Do not use markdown formatting.\n\nNOTES:\n${rawText}`);
}

export interface VocabularyWord { word: string; definition: string; options: string[]; }
export async function generateVocabularyWords(difficulty: string, count: number): Promise<VocabularyWord[]> {
    return generateJson("gemini-2.5-flash", `Generate ${count} ${difficulty} English vocabulary words. For each word, provide its definition and 3 incorrect multiple-choice options. The options should all be definitions.`, {
        type: Type.ARRAY, items: {
            type: Type.OBJECT, properties: {
                word: { type: Type.STRING },
                definition: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } }
            }, required: ["word", "definition", "options"]
        }
    });
}

export interface EssayOutline { title: string; introduction: { hook: string; thesis: string; }; body: { title: string; points: string[]; }[]; conclusion: { summary: string; finalThought: string; }; }
export async function generateEssayOutline(topic: string): Promise<EssayOutline> {
    return generateJson("gemini-2.5-flash", `Create a structured 5-paragraph essay outline for the topic "${topic}". Include a title, an introduction with a hook and thesis, three body paragraphs with a topic sentence and 2-3 supporting points each, and a conclusion with a summary and final thought.`, {
        type: Type.OBJECT, properties: {
            title: { type: Type.STRING },
            introduction: { type: Type.OBJECT, properties: { hook: { type: Type.STRING }, thesis: { type: Type.STRING } } },
            body: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, points: { type: Type.ARRAY, items: { type: Type.STRING } } } } },
            conclusion: { type: Type.OBJECT, properties: { summary: { type: Type.STRING }, finalThought: { type: Type.STRING } } }
        }
    });
}

export async function highlightText(rawText: string): Promise<string[]> {
    return generateJson("gemini-2.5-flash", `From the following text, extract the 3-5 most important, key sentences that summarize the main points. Return them as a JSON array of strings.\n\nTEXT:\n${rawText}`, {
        type: Type.ARRAY, items: { type: Type.STRING }
    });
}

export interface MindMapNode { text: string; children?: MindMapNode[]; }
export async function generateMindMap(topic: string): Promise<MindMapNode> {
    return generateJson("gemini-2.5-flash", `Generate a simple mind map for the central topic "${topic}". The structure should have a root node with the topic, 3-4 main branches, and 2-3 sub-branches for each main branch.`, {
        type: Type.OBJECT, properties: {
            text: { type: Type.STRING },
            children: { type: Type.ARRAY, items: {
                type: Type.OBJECT, properties: {
                    text: { type: Type.STRING },
                    children: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { text: { type: Type.STRING } } } }
                }
            }}
        }
    });
}

// All other functions follow a similar pattern using generateText or generateJson...
// This is a representative sample to fix the application. The full list is very long.
// The following are placeholders for brevity but would follow the patterns above.

export async function generateBrandNames(industry: string, vibe: string): Promise<string[]> {
    return generateJson("gemini-2.5-flash", `Generate 10 creative brand names for a business in the '${industry}' industry with a '${vibe}' vibe.`, { type: Type.ARRAY, items: { type: Type.STRING } });
}

export async function generateSlogans(productInfo: string, tone: string): Promise<string[]> {
     return generateJson("gemini-2.5-flash", `Generate 5 catchy slogans for a product described as '${productInfo}' with a '${tone}' tone.`, { type: Type.ARRAY, items: { type: Type.STRING } });
}

export async function generateTaglines(brandInfo: string, style: string): Promise<string[]> {
    return generateJson("gemini-2.5-flash", `Generate 8 memorable and impactful taglines for a brand described as '${brandInfo}' with a '${style}' style. Each tagline should be concise, catchy, and capture the brand essence.`, { type: Type.ARRAY, items: { type: Type.STRING } });
}

export interface EquationSolution { steps: { description: string; result: string }[]; finalAnswer: string; }
export async function solveEquation(equation: string): Promise<EquationSolution> {
    return generateJson('gemini-2.5-pro', `Solve the algebraic equation "${equation}" for x. Provide a step-by-step breakdown and the final answer.`, {
        type: Type.OBJECT, properties: {
            steps: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { description: { type: Type.STRING }, result: { type: Type.STRING } } } },
            finalAnswer: { type: Type.STRING }
        }
    });
}

export async function getFunFact(elementName: string): Promise<string> {
    return generateText('gemini-2.5-flash', `Tell me a fun, interesting, and little-known fact about the chemical element ${elementName}. One sentence only.`);
}

export async function balanceEquation(unbalanced: string): Promise<string> {
     return generateText('gemini-2.5-pro', `Balance the following chemical equation and return only the balanced equation as a string: ${unbalanced}`);
}

export interface PhysicsFormula { formula: string; explanation: string; variables: { symbol: string; name: string; unit: string; }[]; }
export async function findPhysicsFormula(topic: string): Promise<PhysicsFormula> {
    return generateJson('gemini-2.5-flash', `Provide the main physics formula related to "${topic}". Include the formula, a brief explanation, and define each variable with its symbol, name, and SI unit.`, {
        type: Type.OBJECT, properties: {
            formula: { type: Type.STRING },
            explanation: { type: Type.STRING },
            variables: { type: Type.ARRAY, items: {
                type: Type.OBJECT, properties: { symbol: { type: Type.STRING }, name: { type: Type.STRING }, unit: { type: Type.STRING } }
            }}
        }
    });
}

export interface HashtagResult { popular: string[]; niche: string[]; related: string[]; }
export async function generateHashtags(topic: string): Promise<HashtagResult> {
    return generateJson('gemini-2.5-flash', `Generate Instagram hashtags for a post about "${topic}". Provide 5 popular, 5 niche, and 5 related hashtags.`, {
        type: Type.OBJECT, properties: {
            popular: { type: Type.ARRAY, items: { type: Type.STRING } },
            niche: { type: Type.ARRAY, items: { type: Type.STRING } },
            related: { type: Type.ARRAY, items: { type: Type.STRING } },
        }
    });
}

export async function predictAgeFromImage(base64: string, mimeType: string): Promise<number> {
    const result = await generateText('gemini-2.5-flash-image', { parts: [{inlineData: { data: base64, mimeType } }, {text: 'Guess the age of the person in this photo. Respond with only the number.' }]});
    return parseInt(result, 10);
}

export async function generateCartoonFace(base64: string, mimeType: string): Promise<string | null> {
    return generateImageFromImage('gemini-2.5-flash-image', base64, mimeType, 'Turn the person in this photo into a modern, 3D Pixar-style cartoon character. Keep the background.');
}

export async function applyOldAgeFilter(base64: string, mimeType: string): Promise<string | null> {
    return generateImageFromImage('gemini-2.5-flash-image', base64, mimeType, 'Apply a hyper-realistic old age filter to the person in this photo, making them look about 50 years older. Add wrinkles, grey hair, and age spots.');
}

export async function predictBabyFace(base64: string, mimeType: string): Promise<string | null> {
    return generateImageFromImage('gemini-2.5-flash-image', base64, mimeType, 'Based on the person in this photo, generate a realistic image of what their baby might look like.');
}

export async function generateFutureFace(base64: string, mimeType: string): Promise<string | null> {
    return generateImageFromImage('gemini-2.5-flash-image', base64, mimeType, 'Transform the person in this photo into a futuristic cyberpunk character. Add some subtle cybernetic implants and neon lighting effects.');
}

export interface CelebrityLookAlike { name: string; matchPercentage: number; }
export async function findCelebrityLookAlike(base64: string, mimeType: string): Promise<CelebrityLookAlike> {
     return generateJson('gemini-2.5-flash-image', { parts: [{inlineData: { data: base64, mimeType } }, {text: 'Which celebrity does this person look like most? Provide the name and a match percentage.' }]}, {
        type: Type.OBJECT, properties: {
            name: { type: Type.STRING },
            matchPercentage: { type: Type.NUMBER }
        }
    });
}

export async function generateMovieDialogue(scene: string, characters: string, tone: string): Promise<string> {
    return generateText('gemini-2.5-flash', `Write a short movie dialogue. Scene: ${scene}. Characters: ${characters}. The tone should be ${tone}. Format it like a screenplay.`);
}

export interface Quote { quote: string; author: string; }
export async function generateQuote(): Promise<Quote> {
    return generateJson('gemini-2.5-flash', 'Generate one inspiring and motivational quote and attribute it to a famous historical figure.', {
        type: Type.OBJECT, properties: { quote: { type: Type.STRING }, author: { type: Type.STRING }}
    });
}

export interface DreamInterpretation { mainInterpretation: string; alternativeInterpretations: string[]; }
export async function interpretDream(dream: string): Promise<DreamInterpretation> {
     return generateJson('gemini-2.5-flash', `Provide a psychological interpretation for the following dream: "${dream}". Include one main interpretation and 2-3 alternative meanings.`, {
        type: Type.OBJECT, properties: {
            mainInterpretation: { type: Type.STRING },
            alternativeInterpretations: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
    });
}

export async function generateLoveLetter(recipient: string, feelings: string, tone: string): Promise<string> {
    return generateText('gemini-2.5-flash', `Write a love letter to ${recipient}. The sender's feelings are: "${feelings}". The tone should be ${tone}.`);
}

export interface TestQuestion { questionText: string; questionType: string; options?: string[]; answer: string; }
export async function generateTestPaper(topic: string, numQuestions: number, types: string[]): Promise<TestQuestion[]> {
     return generateJson('gemini-2.5-pro', `Create a test paper on "${topic}" with ${numQuestions} questions. Include a mix of these types: ${types.join(', ')}. For multiple choice, provide 4 options.`, {
        type: Type.ARRAY, items: { type: Type.OBJECT, properties: {
            questionText: { type: Type.STRING },
            questionType: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true },
            answer: { type: Type.STRING }
        }}
    });
}

export async function generateReportCardComment(name: string, grades: { subject: string; grade: string }[]): Promise<string> {
    return generateText('gemini-2.5-flash', `Write a constructive and encouraging report card comment for a student named ${name} with the following grades: ${JSON.stringify(grades)}.`);
}

export interface CreditRecommendation { recommendation: string; explanation: string; }
export async function generateCreditScorePlan(score: number, paymentHistory: string, utilization: number, historyLength: string, newApplications: string, creditMix: string[]): Promise<CreditRecommendation[]> {
    const prompt = `Create a credit score improvement plan for a user with: current score ${score}, payment history is on time '${paymentHistory}', credit utilization is ${utilization}%, credit history length is ${historyLength}, ${newApplications} new applications recently, and a credit mix of ${creditMix.join(', ')}. Provide the top 5 most impactful recommendations with brief explanations for each.`;
     return generateJson('gemini-2.5-flash', prompt, {
        type: Type.ARRAY, items: { type: Type.OBJECT, properties: {
            recommendation: { type: Type.STRING },
            explanation: { type: Type.STRING }
        }}
    });
}

export interface CreditCard { cardName: string; issuer: string; description: string; feature: string; annualFee: string; bestMatch: boolean; }
export async function generateCreditCardRecommendations(spending: string[], score: string, reward: string): Promise<CreditCard[]> {
    const prompt = `I am looking for a new credit card. My main spending is on ${spending.join(', ')}. My credit score is ${score}. I prefer ${reward} rewards. Recommend 3 fictional credit cards for me. For each, give a card name, issuer, brief description, a key feature, an annual fee, and identify the single best match.`;
    return generateJson("gemini-2.5-flash", prompt, {
        type: Type.ARRAY, items: { type: Type.OBJECT, properties: {
            cardName: { type: Type.STRING }, issuer: { type: Type.STRING }, description: { type: Type.STRING },
            feature: { type: Type.STRING }, annualFee: { type: Type.STRING }, bestMatch: { type: Type.BOOLEAN }
        }}
    });
}

export interface RiskAnalysis { score: number; riskLevel: string; analysis: string; financialRisks: string[]; operationalRisks: string[]; marketRisks: string[]; recommendation: string; }
export async function analyzeInvestmentRisk(portfolio: string): Promise<RiskAnalysis> {
    const prompt = `Analyze the risk of an investment portfolio with the following allocation: "${portfolio}". Provide a risk score from 0-100, a risk level (Low, Medium, High), a brief analysis, 2-3 potential risks for each category (Financial, Operational, Market), and a final recommendation.`;
    return generateJson('gemini-2.5-pro', prompt, {
        type: Type.OBJECT, properties: {
            score: { type: Type.NUMBER }, riskLevel: { type: Type.STRING }, analysis: { type: Type.STRING },
            financialRisks: { type: Type.ARRAY, items: { type: Type.STRING } },
            operationalRisks: { type: Type.ARRAY, items: { type: Type.STRING } },
            marketRisks: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendation: { type: Type.STRING }
        }
    });
}

// FIX: Add missing RiskAnalysisResult interface and analyzeRisks function for the RiskAnalyzer tool.
export interface RiskAnalysisResult {
    overallRisk: 'Low' | 'Medium' | 'High';
    financialRisks: string[];
    operationalRisks: string[];
    marketRisks: string[];
    recommendation: string;
}

export async function analyzeRisks(plan: string): Promise<RiskAnalysisResult> {
    const prompt = `Analyze the risks for the following business idea or project plan: "${plan}". Provide an overall risk level (Low, Medium, or High), and list 2-3 potential risks for each category (Financial, Operational, Market). Finally, provide a concluding recommendation.`;
    return generateJson('gemini-2.5-pro', prompt, {
        type: Type.OBJECT, properties: {
            overallRisk: { type: Type.STRING },
            financialRisks: { type: Type.ARRAY, items: { type: Type.STRING } },
            operationalRisks: { type: Type.ARRAY, items: { type: Type.STRING } },
            marketRisks: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendation: { type: Type.STRING }
        },
        required: ["overallRisk", "financialRisks", "operationalRisks", "marketRisks", "recommendation"]
    });
}


export interface SalesPitch { hook: string; problem: string; solution: string; cta: string; }
export async function generateSalesPitch(product: string, audience: string, benefit: string, style: string): Promise<SalesPitch> {
    return generateJson("gemini-2.5-flash", `Generate a sales pitch. Product: ${product}. Audience: ${audience}. Key Benefit: ${benefit}. Style: ${style}. Provide a hook, problem, solution, and call to action.`, {
        type: Type.OBJECT, properties: {
            hook: { type: Type.STRING }, problem: { type: Type.STRING }, solution: { type: Type.STRING }, cta: { type: Type.STRING }
        }
    });
}

export interface ConceptMapNode { text: string; children?: ConceptMapNode[]; }
export async function generateConceptMap(topic: string): Promise<ConceptMapNode> {
    return generateJson("gemini-2.5-flash", `Generate a simple concept map for the central topic "${topic}". The structure should have a root node, 3-4 main branches, and 2-3 sub-branches for each.`, {
        type: Type.OBJECT, properties: {
            text: { type: Type.STRING },
            children: { type: Type.ARRAY, items: {
                type: Type.OBJECT, properties: {
                    text: { type: Type.STRING },
                    children: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { text: { type: Type.STRING } } } }
                }
            }}
        }
    });
}

export interface DailyChallenge { challenge: string; }
export async function generateDailyChallenge(category: string): Promise<DailyChallenge> {
    return generateJson("gemini-2.5-flash", `Generate one unique, actionable daily challenge for the category: "${category}".`, {
        type: Type.OBJECT, properties: { challenge: { type: Type.STRING } }
    });
}

export interface CrosswordData { width: number; height: number; placedWords: { word: string; clue: string; direction: 'across' | 'down'; row: number; col: number; number: number }[]; }
export async function generateCrossword(words: { word: string; clue: string }[]): Promise<CrosswordData> {
    const prompt = `Create a crossword puzzle grid from this list of words and clues: ${JSON.stringify(words)}. Provide the grid dimensions (width, height) and an array of placed words with their word, clue, direction (across/down), starting row/col (0-indexed), and clue number. Prioritize fitting as many words as possible.`;
    return generateJson('gemini-2.5-pro', prompt, {
        type: Type.OBJECT, properties: {
            width: { type: Type.INTEGER }, height: { type: Type.INTEGER },
            placedWords: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: {
                word: { type: Type.STRING }, clue: { type: Type.STRING }, direction: { type: Type.STRING },
                row: { type: Type.INTEGER }, col: { type: Type.INTEGER }, number: { type: Type.INTEGER }
            }}}
        }
    });
}

export interface LessonPlan { learningObjectives: string[]; materials: string[]; lessonActivities: { duration: number; activity: string; }[]; assessment: string; }
export async function generateLessonPlan(topic: string, grade: string, duration: number): Promise<LessonPlan> {
    const prompt = `Create a lesson plan for a ${duration}-minute class on "${topic}" for ${grade} students. Include 3 learning objectives, a list of materials, a timeline of activities with durations, and a method of assessment.`;
    return generateJson("gemini-2.5-flash", prompt, {
        type: Type.OBJECT, properties: {
            learningObjectives: { type: Type.ARRAY, items: { type: Type.STRING } },
            materials: { type: Type.ARRAY, items: { type: Type.STRING } },
            lessonActivities: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: {
                duration: { type: Type.NUMBER }, activity: { type: Type.STRING }
            }}},
            assessment: { type: Type.STRING }
        }
    });
}

export interface FeedbackQuestion { questionText: string; questionType: 'rating' | 'short-answer' | 'multiple-choice'; options?: string[]; }
export async function generateFeedbackForm(topic: string, formType: string): Promise<FeedbackQuestion[]> {
     return generateJson("gemini-2.5-flash", `Create a 5-question student feedback form about a lesson on "${topic}". The focus should be on "${formType}". Include a mix of rating, short-answer, and multiple-choice questions.`, {
        type: Type.ARRAY, items: { type: Type.OBJECT, properties: {
            questionText: { type: Type.STRING }, questionType: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true }
        }}
    });
}

export async function generateTattooDesign(idea: string, style: string): Promise<string | null> {
    ensureApiAvailable();
    try {
        const response = await ai!.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: `A clean, black and white tattoo design of ${idea} in a ${style} style. Minimalist, on a plain white background, suitable for a tattoo stencil.`,
            config: { numberOfImages: 1, outputMimeType: 'image/jpeg', aspectRatio: '1:1' },
        });
        if (response.generatedImages?.[0]) { return response.generatedImages[0].image.imageBytes; }
        throw new Error("Failed to generate tattoo design. Please try again.");
    } catch (error) {
        throw new Error("Failed to generate tattoo design. Please try again.");
    }
}

export async function generateUsernames(keyword: string, style: string): Promise<string[]> {
    return generateJson("gemini-2.5-flash", `Generate 10 unique usernames based on the keyword "${keyword}" with a "${style}" style.`, { type: Type.ARRAY, items: { type: Type.STRING } });
}

export async function generateWallpaper(prompt: string, aspectRatio: string): Promise<string | null> {
    return generateThumbnailOrBanner(prompt, aspectRatio); // Re-use for similar functionality
}

export async function generateLogo(brandName: string, keywords: string, style: string): Promise<string | null> {
    ensureApiAvailable();
    try {
        const response = await ai!.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: `A simple, modern, minimalist logo icon for a brand named '${brandName}'. The logo should represent: ${keywords}. Style: ${style}. Vector style, on a plain white background.`,
            config: { numberOfImages: 1, outputMimeType: 'image/jpeg', aspectRatio: '1:1' },
        });
        if (response.generatedImages?.[0]) { return response.generatedImages[0].image.imageBytes; }
        throw new Error("Failed to generate logo. Please try again.");
    } catch (error) {
        throw new Error("Failed to generate logo. Please try again.");
    }
}

export interface FakeIdentity { fullName: string; dateOfBirth: string; age: number; location: string; occupation: string; bio: string; image: string; }
export async function generateFakeIdentity(): Promise<FakeIdentity> {
    ensureApiAvailable();
    try {
        const [textResponse, imageResponse] = await Promise.all([
            generateJson("gemini-2.5-flash", 'Generate a complete fake identity: full name, date of birth (e.g., "January 1, 1990"), age as a number, location (city, country), a plausible occupation, and a short bio.', {
                type: Type.OBJECT, properties: {
                    fullName: { type: Type.STRING }, dateOfBirth: { type: Type.STRING }, age: { type: Type.NUMBER },
                    location: { type: Type.STRING }, occupation: { type: Type.STRING }, bio: { type: Type.STRING }
                }
            }),
            ai!.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: 'A realistic profile picture of a person, head and shoulders, neutral background. This person does not exist.',
                config: { numberOfImages: 1, outputMimeType: 'image/jpeg', aspectRatio: '1:1' }
            })
        ]);
        if (!imageResponse.generatedImages?.[0]) throw new Error("Failed to generate identity. Please try again.");
        return { ...textResponse, image: imageResponse.generatedImages[0].image.imageBytes };
    } catch (error) {
        throw new Error("Failed to generate identity. Please try again.");
    }
}

export async function generateQuoteBackground(prompt: string): Promise<string | null> {
    ensureApiAvailable();
    try {
        const response = await ai!.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: `A beautiful, atmospheric background image suitable for a quote. Style: ${prompt}. No text.`,
            config: { numberOfImages: 1, outputMimeType: 'image/jpeg', aspectRatio: '1:1' },
        });
        if (response.generatedImages?.[0]) { return response.generatedImages[0].image.imageBytes; }
        throw new Error("Failed to generate background. Please try again.");
    } catch (error) {
        throw new Error("Failed to generate background. Please try again.");
    }
}

export async function generateThumbnailCaptions(title: string, style: string): Promise<string[]> {
    return generateJson("gemini-2.5-flash", `Generate 5 short, catchy, clickbait-style thumbnail captions for a YouTube video titled "${title}". The style should be ${style}.`, { type: Type.ARRAY, items: { type: Type.STRING } });
}

export async function generateReelHooks(topic: string, style: string): Promise<string[]> {
     return generateJson("gemini-2.5-flash", `Generate 5 scroll-stopping hook lines (the first 3 seconds) for an Instagram Reel about "${topic}". The style should be ${style}.`, { type: Type.ARRAY, items: { type: Type.STRING } });
}

export async function generateTrends(): Promise<string[]> {
    return generateJson("gemini-2.5-flash", 'List the top 10 trending topics on social media right now. Only list the topics.', { type: Type.ARRAY, items: { type: Type.STRING } });
}

export async function generateBioEmojis(bio: string): Promise<string> {
    return generateText('gemini-2.5-flash', `Suggest a short string of 5-7 emojis that would perfectly match this bio: "${bio}". Return only the emojis.`);
}

// FIX: Add missing generateYouTubeVideoIdeas function.
export async function generateYouTubeVideoIdeas(topic: string): Promise<string[]> {
    return generateJson("gemini-2.5-flash", `Generate 5 creative and engaging YouTube video ideas for a channel about "${topic}".`, {
        type: Type.ARRAY,
        items: { type: Type.STRING }
    });
}

export interface StoryPlot { title: string; protagonist: string; setting: string; conflict: string; resolution: string; }
export async function generateStoryPlot(genre: string): Promise<StoryPlot> {
    return generateJson("gemini-2.5-flash", `Generate a short story plot for the ${genre} genre. Include a title, protagonist, setting, conflict, and resolution.`, {
        type: Type.OBJECT, properties: {
            title: { type: Type.STRING }, protagonist: { type: Type.STRING }, setting: { type: Type.STRING },
            conflict: { type: Type.STRING }, resolution: { type: Type.STRING }
        }
    });
}

export async function generatePoem(topic: string, style: string): Promise<string> {
    return generateText('gemini-2.5-flash', `Write a ${style} about "${topic}".`);
}

export async function generateSongLyrics(topic: string, genre: string): Promise<string> {
    return generateText('gemini-2.5-flash', `Write song lyrics about "${topic}" in the style of a ${genre} song. Include at least two verses and a chorus.`);
}

export async function generateProductDescription(name: string, features: string): Promise<string> {
    return generateText('gemini-2.5-flash', `Write a compelling product description for a product named "${name}" with these features: ${features}.`);
}

export async function summarizeArticle(article: string): Promise<string> {
    return generateText('gemini-2.5-flash', `Summarize the following article into 3-5 key bullet points:\n\n${article}`);
}

export async function rewriteParagraph(paragraph: string): Promise<string> {
    return generateText('gemini-2.5-flash', `Rewrite the following paragraph to improve its clarity, style, and flow:\n\n${paragraph}`);
}

export async function expandEssay(points: string): Promise<string> {
    return generateText('gemini-2.5-flash', `Expand the following points into a well-structured short essay:\n\n${points}`);
}

export async function generateBookTitles(topic: string): Promise<string[]> {
    return generateJson("gemini-2.5-flash", `Generate 10 creative book titles for a book about "${topic}".`, { type: Type.ARRAY, items: { type: Type.STRING } });
}

export async function generateBlogTitles(topic: string, tone: string, keywords: string): Promise<string[]> {
    const keywordPrompt = keywords ? ` Include these keywords where relevant: ${keywords}.` : '';
    return generateJson("gemini-2.5-flash", `Generate 10 catchy and engaging blog post titles about "${topic}" with a ${tone} tone.${keywordPrompt} Make them click-worthy and SEO-friendly.`, { type: Type.ARRAY, items: { type: Type.STRING } });
}

export async function generateGoogleAds(product: string, audience: string, keywords: string, adType: string): Promise<{headline1: string; headline2: string; headline3: string; description1: string; description2: string}[]> {
    const audiencePrompt = audience ? ` Target audience: ${audience}.` : '';
    const keywordPrompt = keywords ? ` Keywords: ${keywords}.` : '';
    return generateJson("gemini-2.5-flash", `Generate 3 Google ${adType} ad variations for "${product}".${audiencePrompt}${keywordPrompt} Each ad needs 3 headlines (max 30 chars each) and 2 descriptions (max 90 chars each). Make them compelling and action-oriented.`, {
        type: Type.ARRAY, items: { type: Type.OBJECT, properties: {
            headline1: { type: Type.STRING }, headline2: { type: Type.STRING }, headline3: { type: Type.STRING },
            description1: { type: Type.STRING }, description2: { type: Type.STRING }
        }}
    });
}

export async function generateNewsletterNames(topic: string): Promise<string[]> {
    return generateJson("gemini-2.5-flash", `Generate 10 creative names for a newsletter about "${topic}".`, { type: Type.ARRAY, items: { type: Type.STRING } });
}

export async function generateJoke(): Promise<string> {
    return generateText('gemini-2.5-flash', 'Tell me a short, clean joke.');
}

export async function generateTweetIdeas(topic: string): Promise<string[]> {
    return generateJson("gemini-2.5-flash", `Generate 5 interesting tweet ideas about "${topic}".`, { type: Type.ARRAY, items: { type: Type.STRING } });
}

export async function generateComments(post: string, tone: string): Promise<string[]> {
    return generateJson("gemini-2.5-flash", `Generate 3 thoughtful comments for a social media post about "${post}". The tone should be ${tone}.`, { type: Type.ARRAY, items: { type: Type.STRING } });
}

export interface KeywordResult { longTail: string[]; related: string[]; questions: string[]; }
export async function generateKeywordIdeas(topic: string): Promise<KeywordResult> {
    return generateJson("gemini-2.5-flash", `Generate keyword ideas for the topic "${topic}". Provide 5 long-tail keywords, 5 related keywords, and 5 questions people ask.`, {
        type: Type.OBJECT, properties: {
            longTail: { type: Type.ARRAY, items: { type: Type.STRING } },
            related: { type: Type.ARRAY, items: { type: Type.STRING } },
            questions: { type: Type.ARRAY, items: { type: Type.STRING } },
        }
    });
}

export interface HeadlineAnalysis { score: number; analysis: string; suggestions: string[]; }
export async function analyzeHeadline(headline: string): Promise<HeadlineAnalysis> {
     return generateJson('gemini-2.5-pro', `Analyze the headline "${headline}". Provide a score from 1-10 on its effectiveness, a brief analysis of its strengths/weaknesses, and 2-3 suggestions for improvement.`, {
        type: Type.OBJECT, properties: {
            score: { type: Type.NUMBER },
            analysis: { type: Type.STRING },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
        }
    });
}

export interface AdCopy { headline: string; body: string; }
export async function generateAdCopy(product: string, tone: string): Promise<AdCopy> {
    return generateJson("gemini-2.5-flash", `Generate ad copy for a product described as "${product}" with a ${tone} tone. Provide one headline and one body text.`, {
        type: Type.OBJECT, properties: { headline: { type: Type.STRING }, body: { type: Type.STRING } }
    });
}

export async function generateBlogIntro(topic: string): Promise<string> {
    return generateText('gemini-2.5-flash', `Write an engaging, hook-driven introductory paragraph for a blog post about "${topic}".`);
}

export async function generateBlogOutro(topic: string, summary: string): Promise<string> {
    return generateText('gemini-2.5-flash', `Write a compelling concluding paragraph for a blog post on "${topic}". The main points were: ${summary}. End with a call to action or a thought-provoking question.`);
}

export async function generateShortStory(prompt: string): Promise<string> {
    return generateText('gemini-2.5-flash', `Write a short story (around 300 words) based on this prompt: "${prompt}".`);
}

export interface Recipe { title: string; description: string; ingredients: string[]; instructions: string[]; }
export async function generateRecipe(dish: string, constraints: string): Promise<Recipe> {
    return generateJson("gemini-2.5-flash", `Generate a recipe for "${dish}". Additional constraints: ${constraints || 'none'}. Include a title, short description, an array of ingredients, and an array of instructions.`, {
        type: Type.OBJECT, properties: {
            title: { type: Type.STRING }, description: { type: Type.STRING },
            ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
            instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
        }
    });
}

export async function cartoonifyImage(base64: string, mimeType: string): Promise<string | null> {
    return generateImageFromImage('gemini-2.5-flash-image', base64, mimeType, 'Turn this photo into a cartoon. Exaggerate the features slightly for a fun, stylized look.');
}

export async function extractTextFromImage(base64: string, mimeType: string): Promise<string> {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ inlineData: { data: base64, mimeType } }, { text: 'Extract all text from this image.' }] }
    });
    return response.text;
}

export interface ExtractedTable { headers: string[]; rows: string[][]; }
export async function extractTablesFromPdfText(text: string): Promise<ExtractedTable[]> {
    return generateJson('gemini-2.5-pro', `From the following text extracted from a PDF page, identify and extract any tables. For each table, provide its headers and rows. If no tables are found, return an empty array.\n\nTEXT:\n${text}`, {
        type: Type.ARRAY, items: { type: Type.OBJECT, properties: {
            headers: { type: Type.ARRAY, items: { type: Type.STRING } },
            rows: { type: Type.ARRAY, items: { type: Type.ARRAY, items: { type: Type.STRING } } }
        }}
    });
}

// Business Tools
export interface BusinessPlan {
  executiveSummary: string;
  companyDescription: string;
  marketAnalysis: string;
  organizationAndManagement: string;
  serviceOrProductLine: string;
  marketingAndSales: string;
  financialProjections: string;
}
export async function generateBusinessPlan(idea: string, audience: string, features: string): Promise<BusinessPlan> {
    const prompt = `Create a comprehensive business plan outline for a company with the following details:
    - Business Idea: "${idea}"
    - Target Audience: "${audience}"
    - Key Features/Products: "${features}"
    
    For each section of the business plan (Executive Summary, Company Description, Market Analysis, Organization and Management, Service or Product Line, Marketing and Sales Strategy, Financial Projections), provide a concise, well-written paragraph.`;
    
    return generateJson('gemini-2.5-pro', prompt, {
        type: Type.OBJECT,
        properties: {
            executiveSummary: { type: Type.STRING },
            companyDescription: { type: Type.STRING },
            marketAnalysis: { type: Type.STRING },
            organizationAndManagement: { type: Type.STRING },
            serviceOrProductLine: { type: Type.STRING },
            marketingAndSales: { type: Type.STRING },
            financialProjections: { type: Type.STRING },
        },
        required: ["executiveSummary", "companyDescription", "marketAnalysis", "organizationAndManagement", "serviceOrProductLine", "marketingAndSales", "financialProjections"]
    });
}

export interface PitchSlide {
  title: string;
  content: string;
}
export async function generateInvestorPitch(companyName: string, problem: string, solution: string, market: string, model: string): Promise<PitchSlide[]> {
    const prompt = `Generate a 10-slide investor pitch deck outline for a company named "${companyName}".
    - The problem it solves is: "${problem}"
    - The solution is: "${solution}"
    - The target market is: "${market}"
    - The business model is: "${model}"

    Provide a title and 2-3 concise bullet points for each of the 10 slides. The slides should cover: Title, Problem, Solution, Market Size, Product, Business Model, Go-to-Market Strategy, Team, Financial Projections, and The Ask.`;

    return generateJson("gemini-2.5-flash", prompt, {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING, description: "The title of the slide." },
                content: { type: Type.STRING, description: "Bulleted content for the slide, separated by newlines." },
            },
            required: ["title", "content"]
        },
    });
}

export async function generateBrandSlogans(brandName: string, description: string, audience: string, tone: string): Promise<string[]> {
     const prompt = `Generate 5 catchy and memorable slogans for a brand.
     - Brand Name: "${brandName}"
     - Description: "${description}"
     - Target Audience: "${audience}"
     - Desired Tone: "${tone}"`;
     return generateJson("gemini-2.5-flash", prompt, { type: Type.ARRAY, items: { type: Type.STRING } });
}


export async function generateBusinessNames(keywords: string, style: string): Promise<string[]> {
    const prompt = `Generate 10 creative and memorable business names based on the keywords "${keywords}" with a "${style}" style.`;
    return generateJson("gemini-2.5-flash", prompt, {
        type: Type.ARRAY,
        items: { type: Type.STRING }
    });
}

export interface MarketResearch {
    targetDemographics: string[];
    surveyQuestions: string[];
    competitors: string[];
}
export async function generateMarketResearch(productIdea: string): Promise<MarketResearch> {
    const prompt = `Generate market research insights for the following product idea: "${productIdea}". 
    Provide:
    - A list of 3-4 specific target demographics.
    - A list of 5 insightful survey questions to validate the idea.
    - A list of 3 potential competitors or types of competitors.`;

    return generateJson('gemini-2.5-pro', prompt, {
        type: Type.OBJECT,
        properties: {
            targetDemographics: { type: Type.ARRAY, items: { type: Type.STRING } },
            surveyQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            competitors: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["targetDemographics", "surveyQuestions", "competitors"]
    });
}

export interface SWOTAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}
export async function generateSWOTAnalysis(idea: string): Promise<SWOTAnalysis> {
    const prompt = `Generate a detailed SWOT analysis for the following business idea: "${idea}". For each category (Strengths, Weaknesses, Opportunities, Threats), provide 3-4 distinct bullet points.`;
    return generateJson('gemini-2.5-pro', prompt, {
        type: Type.OBJECT,
        properties: {
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
            threats: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["strengths", "weaknesses", "opportunities", "threats"]
    });
}

export interface BusinessRiskScore {
    score: number;
    analysis: string;
    recommendations: string[];
}
export async function generateBusinessRiskScore(description: string): Promise<BusinessRiskScore> {
    const prompt = `Analyze the business risk for the following idea: "${description}". Provide a risk score from 0 (very low risk) to 100 (very high risk), a brief analysis explaining the score, and 3 actionable recommendations to mitigate the highest risks.`;
    return generateJson('gemini-2.5-pro', prompt, {
        type: Type.OBJECT,
        properties: {
            score: { type: Type.NUMBER, description: "A risk score from 0 to 100." },
            analysis: { type: Type.STRING, description: "A brief summary of the key risks." },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 actionable recommendations." }
        },
        required: ["score", "analysis", "recommendations"]
    });
}

export async function generateEmailResponse(email: string, context: string, tone: string): Promise<string[]> {
    const prompt = `Given the following email I received, generate 3 professional response options. 
    The desired tone is '${tone}'.
    The main point of my reply should be: '${context}'.

    Email Received:
    ---
    ${email}
    ---
    
    Generate the responses as a JSON array of strings.`;
    
    return generateJson('gemini-2.5-flash', prompt, {
        type: Type.ARRAY,
        items: { type: Type.STRING }
    });
}

export interface Proposal {
    introduction: string;
    scope: string[];
    timeline: string;
    pricing: string;
    conclusion: string;
}
export async function generateClientProposal(client: string, project: string, scope: string, deliverables: string, price: string): Promise<Proposal> {
    const prompt = `Generate a professional client proposal outline.
    - Client Name: ${client}
    - Project Title: ${project}
    - Scope: ${scope}
    - Key Deliverables: ${deliverables}
    - Budget: ${price}

    Provide a concise paragraph for the introduction and conclusion. Provide 3-4 bullet points for the scope. Provide a simple timeline estimate (e.g., '2-3 weeks'). Provide a simple pricing summary.`;
    
    return generateJson('gemini-2.5-pro', prompt, {
        type: Type.OBJECT,
        properties: {
            introduction: { type: Type.STRING },
            scope: { type: Type.ARRAY, items: { type: Type.STRING } },
            timeline: { type: Type.STRING },
            pricing: { type: Type.STRING },
            conclusion: { type: Type.STRING },
        },
        required: ["introduction", "scope", "timeline", "pricing", "conclusion"]
    });
}

export interface FeedbackAnalysis {
    sentiment: 'Positive' | 'Negative' | 'Neutral' | 'Mixed';
    positiveThemes: string[];
    negativeThemes: string[];
    suggestions: string[];
}
export async function analyzeCustomerFeedback(feedbackText: string): Promise<FeedbackAnalysis> {
    const prompt = `Analyze the following customer feedback. Determine the overall sentiment. Identify 2-3 key positive themes and 2-3 key negative themes. Finally, provide 2 actionable suggestions for improvement based on the feedback.\n\nFeedback:\n---\n${feedbackText}\n---`;
    
    return generateJson('gemini-2.5-pro', prompt, {
        type: Type.OBJECT,
        properties: {
            sentiment: { type: Type.STRING },
            positiveThemes: { type: Type.ARRAY, items: { type: Type.STRING } },
            negativeThemes: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["sentiment", "positiveThemes", "negativeThemes", "suggestions"]
    });
}

export interface MarketingCalendar {
  week1: { blog: string; social: string; };
  week2: { blog: string; social: string; };
  week3: { blog: string; social: string; };
  week4: { blog: string; social: string; };
}
export async function generateMarketingCalendar(topic: string, audience: string, month: string): Promise<MarketingCalendar> {
    const prompt = `Generate a 4-week marketing content calendar for the month of ${month}.
    - Topic: ${topic}
    - Target Audience: ${audience}
    
    For each of the 4 weeks, provide one blog post idea and one social media post idea.`;

    const schema = {
        type: Type.OBJECT,
        properties: {},
        required: []
    };
    for(let i = 1; i <= 4; i++) {
        schema.properties[`week${i}`] = {
            type: Type.OBJECT,
            properties: {
                blog: { type: Type.STRING, description: `Blog post idea for week ${i}.` },
                social: { type: Type.STRING, description: `Social media post idea for week ${i}.` }
            },
            required: ["blog", "social"]
        };
        schema.required.push(`week${i}`);
    }

    return generateJson('gemini-2.5-flash', prompt, schema);
}

// Marketing/SaaS Tools
export interface SerpResult {
  title: string;
  url: string;
  snippet: string;
}
export async function generateSerpResults(keyword: string): Promise<SerpResult[]> {
    return generateJson("gemini-2.5-flash", `Generate a realistic-looking but fictional list of the top 10 Google search results for the keyword "${keyword}". For each result, provide a compelling title, a realistic-looking URL, and a short, descriptive snippet.`, {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                url: { type: Type.STRING },
                snippet: { type: Type.STRING },
            },
            required: ["title", "url", "snippet"]
        }
    });
}

export async function generateMetaDescriptions(topic: string, keyword: string): Promise<string[]> {
    return generateJson("gemini-2.5-flash", `Generate 3 SEO-friendly meta descriptions for a web page about "${topic}" with the primary keyword "${keyword}". Each description should be compelling and under 160 characters.`, {
        type: Type.ARRAY,
        items: { type: Type.STRING }
    });
}

export async function generateMarketingBlogTitles(topic: string): Promise<string[]> {
    return generateJson("gemini-2.5-flash", `Generate 5 catchy, SEO-friendly blog post titles for the topic "${topic}". Include a mix of listicles, how-to guides, and question-based titles.`, {
        type: Type.ARRAY,
        items: { type: Type.STRING }
    });
}

export interface LandingPageAnalysis {
    score: number;
    headline: { analysis: string; suggestions: string[] };
    body: { analysis: string; suggestions: string[] };
    cta: { analysis: string; suggestions: string[] };
}
export async function analyzeLandingPage(headline: string, body: string, cta: string): Promise<LandingPageAnalysis> {
    const prompt = `Analyze the following landing page copy for a marketing website.
    - Headline: "${headline}"
    - Body Copy: "${body}"
    - Call to Action: "${cta}"

    Provide an overall effectiveness score from 0 to 100.
    For each section (headline, body, cta), provide a brief analysis of its strengths and weaknesses, and 2-3 specific, actionable suggestions for improvement.`;

    return generateJson('gemini-2.5-pro', prompt, {
        type: Type.OBJECT,
        properties: {
            score: { type: Type.NUMBER, description: "Overall score from 0-100." },
            headline: { type: Type.OBJECT, properties: { analysis: { type: Type.STRING }, suggestions: { type: Type.ARRAY, items: { type: Type.STRING } } } },
            body: { type: Type.OBJECT, properties: { analysis: { type: Type.STRING }, suggestions: { type: Type.ARRAY, items: { type: Type.STRING } } } },
            cta: { type: Type.OBJECT, properties: { analysis: { type: Type.STRING }, suggestions: { type: Type.ARRAY, items: { type: Type.STRING } } } },
        },
        required: ["score", "headline", "body", "cta"]
    });
}

export interface Email {
    subject: string;
    body: string;
}
export async function generateEmailSequence(product: string, audience: string, goal: string, numEmails: number): Promise<Email[]> {
    const prompt = `Generate a sequence of ${numEmails} marketing emails.
    - Product/Service: "${product}"
    - Target Audience: "${audience}"
    - Goal of sequence: "${goal}"

    For each email, provide a compelling subject line and a concise body text.`;

    return generateJson('gemini-2.5-flash', prompt, {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                subject: { type: Type.STRING, description: "The email subject line." },
                body: { type: Type.STRING, description: "The email body text." },
            },
            required: ["subject", "body"]
        }
    });
}

export async function generateColdEmails(myName: string, recipientName: string, myProduct: string, theirPainPoint: string, goal: string): Promise<Email[]> {
    const prompt = `Generate 3 distinct, effective cold email variations.
    - My Name/Company: "${myName}"
    - Recipient Name/Company: "${recipientName}"
    - My Product/Service: "${myProduct}"
    - Their potential pain point I'm solving: "${theirPainPoint}"
    - My goal for the email: "${goal}"

    For each variation, provide a catchy subject line and a personalized, concise body.`;
    
    return generateJson('gemini-2.5-flash', prompt, {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                subject: { type: Type.STRING },
                body: { type: Type.STRING },
            },
            required: ["subject", "body"]
        }
    });
}

export interface LeadMagnetIdea {
    type: string;
    title: string;
    outline: string[];
}
export async function generateLeadMagnetIdeas(topic: string, audience: string): Promise<LeadMagnetIdea[]> {
    const prompt = `Generate 3 diverse lead magnet ideas for a business with the topic "${topic}" targeting "${audience}". 
    For each idea, provide a type (e.g., Checklist, E-book, Webinar), a catchy title, and a 3-4 point outline.`;

    return generateJson('gemini-2.5-flash', prompt, {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                type: { type: Type.STRING, description: "The type of lead magnet." },
                title: { type: Type.STRING, description: "A catchy title for the lead magnet." },
                outline: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A few bullet points for the content outline." }
            },
            required: ["type", "title", "outline"]
        }
    });
}

export interface CalendarWeek {
    week: number;
    blogPost: string;
    socialMedia: string;
    videoIdea: string;
}
export async function generateContentCalendar(topic: string): Promise<CalendarWeek[]> {
    const prompt = `Create a 4-week content calendar for the general topic "${topic}". 
    For each week, provide one blog post title, one social media post idea, and one short-form video idea.`;

    return generateJson('gemini-2.5-flash', prompt, {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                week: { type: Type.NUMBER, description: "The week number (1-4)." },
                blogPost: { type: Type.STRING, description: "A blog post title idea." },
                socialMedia: { type: Type.STRING, description: "A social media post idea." },
                videoIdea: { type: Type.STRING, description: "A short-form video (Reel/TikTok) idea." }
            },
            required: ["week", "blogPost", "socialMedia", "videoIdea"]
        }
    });
}

export async function generateInstagramCaptions(topic: string, tone: string): Promise<string[]> {
    return generateJson("gemini-2.5-flash", `Generate 5 engaging Instagram captions for a post about "${topic}". The desired tone is ${tone}. Include relevant emojis and suggest a few hashtags.`, {
        type: Type.ARRAY,
        items: { type: Type.STRING }
    });
}

export interface YouTubeTitleTags {
  titles: string[];
  tags: string[];
}
export async function generateYouTubeTitlesAndTags(topic: string): Promise<YouTubeTitleTags> {
    const prompt = `Generate 5 SEO-optimized, catchy YouTube titles and a list of 15 relevant tags for a video about "${topic}".`;
    return generateJson("gemini-2.5-flash", prompt, {
        type: Type.OBJECT,
        properties: {
            titles: {
                type: Type.ARRAY,
                items: { type: Type.STRING, description: "A catchy YouTube video title." }
            },
            tags: {
                type: Type.ARRAY,
                items: { type: Type.STRING, description: "A relevant SEO tag." }
            }
        },
        required: ["titles", "tags"]
    });
}

export async function generateCustomerSupportScript(scenario: string, tone: string): Promise<string> {
    const prompt = `Generate a customer support script for the following scenario: "${scenario}". The desired tone is ${tone}. The script should include an opening, empathy statement, investigation/solution steps, and a closing. Format it clearly.`;
    return generateText('gemini-2.5-flash', prompt);
}

export interface AdCreativeIdea {
    concept: string;
    visual: string;
    copy: string;
}
export async function generateAdCreativeIdeas(product: string, audience: string, platform: string): Promise<AdCreativeIdea[]> {
    const prompt = `Generate 3 distinct ad creative ideas for a ${platform} campaign.
    - Product/Service: "${product}"
    - Target Audience: "${audience}"
    
    For each idea, provide a core concept, a visual description (for an image or video), and a short, catchy ad copy.`;
    
    return generateJson('gemini-2.5-flash', prompt, {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                concept: { type: Type.STRING },
                visual: { type: Type.STRING },
                copy: { type: Type.STRING },
            },
            required: ["concept", "visual", "copy"]
        }
    });
}

// --- NEW MARKETING/SAAS FUNCTIONS ---

export interface Persona {
    name: string;
    age: number;
    role: string;
    goals: string[];
    frustrations: string[];
    bio: string;
}
export async function generateCustomerPersona(product: string, audience: string): Promise<Persona> {
    const prompt = `Create a detailed customer persona for a company that sells "${product}" to "${audience}". The persona should include a fictional name, age, role/job title, 3-4 goals, 3-4 frustrations, and a short bio.`;
    return generateJson('gemini-2.5-flash', prompt, {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING },
            age: { type: Type.NUMBER },
            role: { type: Type.STRING },
            goals: { type: Type.ARRAY, items: { type: Type.STRING } },
            frustrations: { type: Type.ARRAY, items: { type: Type.STRING } },
            bio: { type: Type.STRING }
        },
        required: ["name", "age", "role", "goals", "frustrations", "bio"]
    });
}

export async function generatePressRelease(company: string, headline: string, details: string): Promise<string> {
    const prompt = `Write a professional press release in a standard format.
    - Company Name: ${company}
    - Headline: ${headline}
    - Key Details: ${details}
    
    Include a dateline, introduction, body paragraphs, a boilerplate "About" section for the company, and media contact information. Do not use markdown.`;
    return generateText('gemini-2.5-pro', prompt);
}

export interface PromoScript {
    hook: string;
    points: string[];
    cta: string;
}
export async function generatePromoScript(product: string, duration: string, platform: string): Promise<PromoScript> {
    const prompt = `Create a short promo video script outline for a "${product}".
    - Target video length: ${duration}
    - Platform: ${platform}
    
    Provide a compelling hook (first 3 seconds), 3 main talking points, and a strong call to action (CTA).`;
    return generateJson('gemini-2.5-flash', prompt, {
        type: Type.OBJECT,
        properties: {
            hook: { type: Type.STRING },
            points: { type: Type.ARRAY, items: { type: Type.STRING } },
            cta: { type: Type.STRING }
        },
        required: ["hook", "points", "cta"]
    });
}

export interface ReviewAnalysis extends FeedbackAnalysis {}
export async function analyzeReviewSentiment(reviewText: string): Promise<ReviewAnalysis> {
    return analyzeCustomerFeedback(reviewText); // Re-use the existing function
}

export interface LandingPageCopy {
    headline: string;
    subheadline: string;
    body: string;
}
export async function generateLandingPageCopy(product: string, audience: string, benefit: string): Promise<LandingPageCopy> {
    const prompt = `Generate persuasive landing page copy for a product.
    - Product: ${product}
    - Audience: ${audience}
    - Key Benefit: ${benefit}
    
    Provide a powerful headline, an explanatory subheadline, and a short body paragraph.`;
    return generateJson('gemini-2.5-flash', prompt, {
        type: Type.OBJECT,
        properties: {
            headline: { type: Type.STRING },
            subheadline: { type: Type.STRING },
            body: { type: Type.STRING }
        },
        required: ["headline", "subheadline", "body"]
    });
}

export interface GoogleAd {
    headlines: string[];
    descriptions: string[];
}
export async function generateGoogleAd(product: string, keywords: string): Promise<GoogleAd> {
    const prompt = `Create Google Ads copy.
    - Product: ${product}
    - Keywords: ${keywords}
    
    Generate 5 compelling headlines (under 30 characters each) and 3 descriptions (under 90 characters each).`;
    return generateJson('gemini-2.5-flash', prompt, {
        type: Type.OBJECT,
        properties: {
            headlines: { type: Type.ARRAY, items: { type: Type.STRING } },
            descriptions: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["headlines", "descriptions"]
    });
}

export async function generateSocialBio(keywords: string): Promise<string[]> {
    const prompt = `Generate 3 optimized social media bio options based on these keywords: "${keywords}". Include emojis and a call to action where appropriate.`;
    return generateJson('gemini-2.5-flash', prompt, { type: Type.ARRAY, items: { type: Type.STRING } });
}

export interface KeywordIntent {
    intent: 'Informational' | 'Navigational' | 'Transactional' | 'Commercial Investigation';
    explanation: string;
    exampleContent: string[];
}
export async function analyzeKeywordIntent(keyword: string): Promise<KeywordIntent> {
    const prompt = `Analyze the user search intent for the keyword "${keyword}". Classify it as one of: Informational, Navigational, Transactional, or Commercial Investigation. Provide a brief explanation for the classification and suggest 2-3 content titles that would match this intent.`;
    return generateJson('gemini-2.5-pro', prompt, {
        type: Type.OBJECT,
        properties: {
            intent: { type: Type.STRING },
            explanation: { type: Type.STRING },
            exampleContent: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["intent", "explanation", "exampleContent"]
    });
}

export interface SpamCheckResult {
    score: number;
    risk: 'Low' | 'Medium' | 'High';
    issues: string[];
}
export async function checkEmailSpamScore(emailText: string): Promise<SpamCheckResult> {
    const prompt = `Analyze the following email copy for spam trigger words and common issues that could land it in the spam folder. Provide a spam risk score from 0 (Low) to 100 (High), a risk level ('Low', 'Medium', or 'High'), and a list of 2-3 specific issues found with recommendations.
    
    Email Copy:
    ---
    ${emailText}
    ---`;
    return generateJson('gemini-2.5-pro', prompt, {
        type: Type.OBJECT,
        properties: {
            score: { type: Type.NUMBER },
            risk: { type: Type.STRING },
            issues: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["score", "risk", "issues"]
    });
}

export interface ConversionCopy {
    ctas: string[];
    valueProps: string[];
    headlines: string[];
}
export async function generateConversionCopy(product: string, action: string): Promise<ConversionCopy> {
    const prompt = `Generate conversion-focused copy for a product described as "${product}". The desired action is "${action}".
    Provide:
    - 3 short, punchy call-to-action (CTA) button texts.
    - 3 concise value propositions (one sentence each).
    - 3 benefit-driven headlines.`;
    return generateJson('gemini-2.5-flash', prompt, {
        type: Type.OBJECT,
        properties: {
            ctas: { type: Type.ARRAY, items: { type: Type.STRING } },
            valueProps: { type: Type.ARRAY, items: { type: Type.STRING } },
            headlines: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["ctas", "valueProps", "headlines"]
    });
}

// --- NEW Language/Communication Functions ---

export async function generateRhymingWords(word: string): Promise<string[]> {
    return generateJson("gemini-2.5-flash", `Generate a list of 15 diverse words (including multi-syllable if possible) that rhyme with "${word}".`, {
        type: Type.ARRAY,
        items: { type: Type.STRING }
    });
}

export async function rephraseSentence(sentence: string, tone: string): Promise<string[]> {
    return generateJson("gemini-2.5-flash", `Rephrase the following sentence in 3 different ways with a "${tone}" tone:\n\n"${sentence}"`, {
        type: Type.ARRAY,
        items: { type: Type.STRING }
    });
}

export async function convertToIPA(text: string): Promise<string> {
    return generateText('gemini-2.5-flash', `Convert the following English text to its International Phonetic Alphabet (IPA) transcription. Return only the transcription.\n\nText: "${text}"`);
}

export interface EmailTemplate { subject: string; body: string; }
export async function generateEmailTemplate(topic: string, tone: string): Promise<EmailTemplate> {
    return generateJson("gemini-2.5-flash", `Generate an email template for the following purpose: "${topic}". The tone should be ${tone}. Provide a subject line and a body with common placeholders like [Name] or [Company].`, {
        type: Type.OBJECT,
        properties: {
            subject: { type: Type.STRING },
            body: { type: Type.STRING }
        }
    });
}

export interface GrammarCorrection { correctedText: string; changes: { original: string; suggested: string; explanation: string; }[]; }
export async function checkResumeGrammar(text: string): Promise<GrammarCorrection> {
    const prompt = `Please act as a grammar and style checker for a professional resume. Analyze the following text. Provide a corrected version of the full text. Also, provide a list of the 3-5 most important changes you made, including the original phrase, the suggested change, and a brief explanation for why you made it.\n\nResume Text:\n---\n${text}\n---`;
    return generateJson('gemini-2.5-pro', prompt, {
        type: Type.OBJECT,
        properties: {
            correctedText: { type: Type.STRING },
            changes: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        original: { type: Type.STRING },
                        suggested: { type: Type.STRING },
                        explanation: { type: Type.STRING }
                    },
                    required: ["original", "suggested", "explanation"]
                }
            }
        },
         required: ["correctedText", "changes"]
    });
}