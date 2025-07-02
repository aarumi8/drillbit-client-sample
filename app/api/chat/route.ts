// app/api/chat/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Mock business data - in real app this would come from your database
const businesses = [
    {
        name: "Quick Fix Appliances",
        rating: 4.8,
        price: "$80-120",
        availableTime: "Today, 2-4 PM",
        phone: "(555) 123-4567",
        services: ["washer", "dryer", "dishwasher", "refrigerator"],
    },
    {
        name: "Pro Appliance Repair",
        rating: 4.6,
        price: "$70-100",
        availableTime: "Tomorrow, 9-11 AM",
        phone: "(555) 234-5678",
        services: ["washer", "dryer", "stove", "oven"],
    },
    {
        name: "Expert Home Services",
        rating: 4.9,
        price: "$90-130",
        availableTime: "Today, 5-7 PM",
        phone: "(555) 345-6789",
        services: ["washer", "dryer", "dishwasher", "refrigerator", "stove"],
    },
];

const SYSTEM_PROMPT = `You are a helpful assistant for a home services platform. Your goal is to help users find the right service providers for their home maintenance needs.

Follow these steps:
1. First understand the user's problem in detail
2. Ask relevant follow-up questions about the specific issue to better understand the problem
3. Once you understand the problem, ask for their zip code
4. Then ask about their preferred timing for the service
5. Finally, recommend relevant service providers

Guidelines:
- Be concise but friendly
- Ask only one question at a time
- Focus on getting specific details about the problem
- If the user's message isn't clear, ask for clarification
- Don't make assumptions about the problem
- Always collect zip code and timing preferences before giving recommendations

Current conversation stage will be provided in conversationStage variable:
- "initial" - Understanding the problem
- "details" - Getting specific details
- "location" - Asking for zip code
- "timing" - Asking for preferred timing
- "recommendation" - Providing recommendations`;

interface ConversationAnalysis {
    stage: "initial" | "details" | "location" | "timing" | "recommendation";
    needsZipCode: boolean;
    needsTiming: boolean;
    problemType?: string;
    zipCode?: string;
    timing?: string;
}

async function analyzeConversation(messages: any[]): Promise<ConversationAnalysis> {
    const analysis = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `Analyze the conversation and return a JSON object with the following fields:
          - stage: conversation stage ("initial", "details", "location", "timing", "recommendation")
          - needsZipCode: boolean indicating if we still need the zip code
          - needsTiming: boolean indicating if we still need timing preference
          - problemType: the type of problem (if identified)
          - zipCode: the zip code (if provided)
          - timing: the timing preference (if provided)
          
          Base this on the full conversation history provided.`,
            },
            ...messages,
        ],
        response_format: { type: "json_object" },
    });

    return JSON.parse(analysis.choices[0].message.content) as ConversationAnalysis;
}

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        // Analyze the conversation to determine the current stage and needed information
        const analysis = await analyzeConversation(messages);

        // If we have all needed info, provide recommendations
        if (analysis.zipCode && analysis.timing && analysis.problemType) {
            // Filter businesses based on the problem type
            const relevantBusinesses = businesses
                .filter((business) =>
                    business.services.some((service) =>
                        analysis.problemType
                            ?.toLowerCase()
                            .includes(service) ?? false
                    )
                )
                .slice(0, 3);

            const businessList = relevantBusinesses
                .map(
                    (b) => `
${b.name}
Rating: ${b.rating}/5
Estimated Price: ${b.price}
Available: ${b.availableTime}
Phone: ${b.phone}`
                )
                .join("\n\n");

            const recommendationMessage = `Based on your ${analysis.problemType} issue in ${analysis.zipCode} for ${analysis.timing}, here are the best service providers I found:\n${businessList}`;

            return NextResponse.json({ message: recommendationMessage });
        }

        // Get the next appropriate message from OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
                {
                    role: "system",
                    content: `${SYSTEM_PROMPT}\nCurrent conversation stage: ${analysis.stage}`,
                },
                ...messages,
            ],
        });

        return NextResponse.json({
            message: completion.choices[0].message.content,
        });

    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}