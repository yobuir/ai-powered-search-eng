import { NextResponse } from "next/server";
import OpenAI from "openai";
import axios from "axios";
import { productInsightsPrompt } from "@/prompts/ProductInsightsPrompt";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { query, location } = body;

    if (!query || !location) {
      return NextResponse.json({ error: "Query and location are required." }, { status: 400 });
    }

    // Google Custom Search API call
    const googleResponse = await axios.get("https://www.googleapis.com/customsearch/v1", {
      params: {
        key:process.env.GOOGLE_API_KEY,
        cx:process.env.GOOGLE_CX,
        q: `${query} `,
      },
    });

    const items = googleResponse.data.items || []; 
    const searchResults = items.map((item: { title: string; snippet: string; link: string }) => ({
      title: item.title,
      snippet: item.snippet,
      link: item.link,
    }));


      const completion = await openai.chat.completions.create({
      model: productInsightsPrompt.model,
      temperature: productInsightsPrompt.temperature,
      messages: [
        { role: "system", content: productInsightsPrompt.systemPrompt },
        { role: "user", content: productInsightsPrompt.userPrompt(searchResults,query,location) },
      ],
      max_tokens: 1000,
      response_format: { type: "json_object" }

    });
    
    const result = completion.choices[0].message.content; 
    return NextResponse.json({ insights: result,results: searchResults }, { status: 200 }); 

  } catch (error: unknown) { 
    return NextResponse.json({ error: "Internal Server Error", message:error}, { status: 500 });
  }
}
