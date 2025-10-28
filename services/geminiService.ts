import { GoogleGenAI, Type } from "@google/genai";
// Fix: Corrected import path for types
import type { ChatMessage, DietPlan, Language, CustomMeal, WorkoutPlan } from '../types';

const workoutPlanSchema = {
    type: Type.OBJECT,
    properties: {
        notes: {
            type: Type.STRING,
            description: "A brief, encouraging note for the user about their new workout plan."
        },
        days: {
            type: Type.ARRAY,
            description: "A list of workout days, typically 3-5 days.",
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.STRING, description: "e.g., 'Day 1' or 'Monday'" },
                    focus: { type: Type.STRING, description: "The main focus of the day, e.g., 'Full Body Strength' or 'Cardio & Core'" },
                    exercises: {
                        type: Type.ARRAY,
                        description: "A list of 3-5 exercises for the day.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING, description: "The name of the exercise." },
                                sets: { type: Type.STRING, description: "Number of sets, e.g., '3 sets'" },
                                reps: { type: Type.STRING, description: "Number of reps or duration, e.g., '10-12 reps' or '30 seconds'" },
                                description: { type: Type.STRING, description: "A brief description of how to perform the exercise." }
                            },
                            required: ["name", "sets", "reps", "description"],
                        },
                    },
                },
                required: ["day", "focus", "exercises"],
            }
        }
    },
    required: ["notes", "days"],
};


const createSystemInstruction = (language: Language, hasDietPlan: boolean, hasWorkoutPlan: boolean): string => {
    // Phase 1: Nutritionist
    if (!hasDietPlan) {
        const baseInstructionEN = `You are Calorina, an expert AI nutritionist. Your goal is to have a friendly conversation to understand the user's needs before a diet plan is created for them. First, introduce yourself and ask the user about their primary goal (e.g., weight loss, muscle gain, healthy lifestyle). Then, ask clarifying questions ONE BY ONE to gather necessary information. The questions you must ask are about: 1. Age, 2. Gender, 3. Weight and Height, 4. Activity level, 5. Dietary preferences or foods they dislike, 6. Any food allergies. This MUST be your last question. Wait for the user's response after each question. Keep your responses conversational and brief. After the user answers the final question about allergies, your response must be ONLY the exact string 'PLAN_READY' and nothing else.`;
        const baseInstructionAR = `أنت كالورينا، خبيرة تغذية تعمل بالذكاء الاصطناعي. هدفك هو إجراء محادثة ودية لفهم احتياجات المستخدم قبل إنشاء خطة نظام غذائي له. أولاً، قدمي نفسك واسألي المستخدم عن هدفه الأساسي (على سبيل المثال، فقدان الوزن، زيادة العضلات، نمط حياة صحي). بعد ذلك، اطرحي أسئلة توضيحية واحدًا تلو الآخر لجمع المعلومات الضرورية. الأسئلة التي يجب أن تطرحيها هي عن: ١. العمر، ٢. الجنس، ٣. الوزن والطول، ٤. مستوى النشاط، ٥. التفضيلات الغذائية أو الأطعمة التي لا يحبها، ٦. أي حساسية تجاه طعام. يجب أن يكون هذا سؤالك الأخير. انتظري رد المستخدم بعد كل سؤال. حافظي على أن تكون ردودك قصيرة وودية. بعد أن يجيب المستخدم على السؤال الأخير حول الحساسية، يجب أن يكون ردك فقط هو النص الدقيق 'PLAN_READY' ولا شيء غير ذلك.`;
        return language === 'ar' ? baseInstructionAR : baseInstructionEN;
    } 
    // Phase 2: Personal Trainer
    else if (hasDietPlan && !hasWorkoutPlan) {
        const baseInstructionEN = `You are Calorina, now acting as an expert AI personal trainer. The user has already provided their health details and has a diet plan. Your new goal is to create a personalized workout plan for them based on the conversation history. First, greet the user back and acknowledge their request for a workout plan. Then, ask them ONE clarifying question: "What kind of equipment do you have access to (e.g., full gym, dumbbells only, no equipment)?". Once they answer, respond with a final confirmation message and then generate a workout plan in a valid JSON format that adheres to the provided schema. The confirmation message should be something like: "Perfect! Based on your goals and equipment, here is a workout plan to get you started." The JSON object must be enclosed in a markdown code block (\`\`\`json).`;
        const baseInstructionAR = `أنت كالورينا، وتعملين الآن كمدربة شخصية خبيرة بالذكاء الاصطناعي. لقد قدم المستخدم بالفعل تفاصيله الصحية ولديه خطة نظام غذائي. هدفك الجديد هو إنشاء خطة تمارين رياضية مخصصة له بناءً على سجل المحادثة. أولاً، رحبي بالمستخدم مرة أخرى وأكدي طلبه لخطة تمارين. بعد ذلك، اطرحي عليه سؤالاً توضيحيًا واحدًا: "ما هي المعدات التي يمكنك الوصول إليها (على سبيل المثال، صالة رياضية كاملة، دمبل فقط، لا توجد معدات)؟". بمجر أن يجيب، ردي برسالة تأكيد نهائية ثم قومي بإنشاء خطة تمارين بتنسيق JSON صالح يلتزم بالمخطط المقدم. يجب أن تكون رسالة التأكيد شيئًا مثل: "ممتاز! بناءً على أهدافك والمعدات المتاحة، إليك خطة تمارين لتبدأ بها." يجب أن يكون كائن JSON محاطًا بكتلة كود ماركداون (\`\`\`json).`;
        return language === 'ar' ? baseInstructionAR : baseInstructionEN;
    }
    // Phase 3: Health Consultant
    else {
        const baseInstructionEN = `You are Calorina, an expert AI health consultant. The user already has a diet and workout plan. Your role is now to be a helpful, ongoing assistant. The user may ask for additional meal suggestions, new exercises, or general health advice. Analyze the conversation history to understand their profile. Provide supportive, concise, and helpful answers to their questions. Be conversational and encouraging.`;
        const baseInstructionAR = `أنت كالورينا، مستشارة صحية خبيرة تعمل بالذكاء الاصطناعي. المستخدم لديه بالفعل خطة نظام غذائي وتمارين رياضية. دورك الآن هو أن تكوني مساعدة مستمرة ومفيدة. قد يطلب المستخدم اقتراحات وجبات إضافية، أو تمارين جديدة، أو نصائح صحية عامة. قومي بتحليل سجل المحادثة لفهم ملفه الشخصي. قدمي إجابات داعمة وموجزة ومفيدة لأسئلته. كوني ودودة ومشجعة في حديثك.`;
        return language === 'ar' ? baseInstructionAR : baseInstructionEN;
    }
};

interface AiResponse {
    text: string;
    workoutPlan?: WorkoutPlan;
}

export const getAiResponse = async (conversation: ChatMessage[], language: Language, hasDietPlan: boolean, hasWorkoutPlan: boolean): Promise<AiResponse> => {
  try {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const contents = conversation.length > 0
      ? conversation.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }],
        }))
      : [{ role: 'user', parts: [{ text: language === 'ar' ? 'مرحباً، يرجى البدء.' : 'Hello, please start.' }] }];

    const systemInstruction = createSystemInstruction(language, hasDietPlan, hasWorkoutPlan);
    
    const isWorkoutPhase = hasDietPlan && !hasWorkoutPlan;

    const modelConfig = isWorkoutPhase ? {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: workoutPlanSchema,
    } : {
        systemInstruction,
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {role: 'user', parts: conversation.map(msg => msg.text)},
      config: modelConfig,
    });

    const responseText = response.text.trim();
    
    // Phase 1 (Nutritionist) or Phase 3 (Consultant) just return text
    if (!isWorkoutPhase) {
        return { text: responseText };
    }
    
    // Phase 2 (Personal Trainer) requires JSON parsing
    try {
        const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch && jsonMatch[1]) {
            const workoutPlan: WorkoutPlan = JSON.parse(jsonMatch[1]);
            const textMessage = responseText.substring(0, jsonMatch.index).trim();
            return { text: textMessage, workoutPlan: workoutPlan };
        } else {
            const workoutPlan: WorkoutPlan = JSON.parse(responseText);
            return { text: language === 'ar' ? 'تفضل خطتك الرياضية!' : 'Here is your workout plan!', workoutPlan };
        }
    } catch(e) {
        console.error("Failed to parse workout plan JSON:", e);
        return { text: responseText };
    }

  } catch (error) {
    console.error("Error generating AI response:", error);
    const errorMessage = language === 'ar'
        ? "عذرًا، أواجه مشكلة في الاتصال بخدماتي. يرجى المحاولة مرة أخرى لاحقًا."
        : "I'm sorry, I'm having trouble connecting to my services. Please try again later.";
    return { text: errorMessage };
  }
};
