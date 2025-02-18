import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. 
// do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function getChatResponse(prompt: string, userData?: any): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are AccelerateAI's intelligent assistant. You have access to user's business data and can provide detailed analysis and recommendations. 
          Always provide responses in a clear, conversational format.
          Focus on providing actionable insights and specific recommendations based on the user's business context.
          When analyzing data, highlight key trends, patterns, and areas for improvement.`
        },
        { 
          role: "user", 
          content: userData ? 
            `Context: ${JSON.stringify(userData)}\n\nUser Query: ${prompt}` : 
            prompt 
        }
      ]
    });

    return response.choices[0].message.content || "I apologize, but I couldn't generate a response.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to get AI response");
  }
}

export async function generateBusinessReport(data: any): Promise<{
  summary: string;
  insights: string[];
  recommendations: string[];
}> {
  try {
    const prompt = `As AccelerateAI's business analyst, analyze this data and provide:
    1. A comprehensive summary of the current business state
    2. Key insights discovered from the data
    3. Actionable recommendations for improvement

    Here's the data to analyze: ${JSON.stringify(data)}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }]
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response content received from OpenAI");
    }

    // Parse the content into sections
    const sections = content.split('\n\n');
    return {
      summary: sections[0]?.replace('Summary:', '').trim() || '',
      insights: sections[1]?.replace('Insights:', '')
        .split('\n')
        .filter(i => i.trim())
        .map(i => i.replace('-', '').trim()) || [],
      recommendations: sections[2]?.replace('Recommendations:', '')
        .split('\n')
        .filter(r => r.trim())
        .map(r => r.replace('-', '').trim()) || []
    };
  } catch (error) {
    console.error("Report generation error:", error);
    throw new Error("Failed to generate report");
  }
}

export async function optimizeWorkflow(workflow: any): Promise<{
  optimizedSteps: any[];
  improvements: string[];
}> {
  try {
    const prompt = `As AccelerateAI's workflow optimization expert, analyze this workflow and provide:
    1. Optimized workflow steps with clear improvements
    2. Specific recommendations for enhancing efficiency

    Here's the workflow to optimize: ${JSON.stringify(workflow)}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }]
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response content received from OpenAI");
    }

    // Parse the content into sections
    const sections = content.split('\n\n');
    const steps = sections[0]?.split('\n').filter(s => s.trim()) || [];
    const improvements = sections[1]?.split('\n').filter(i => i.trim()) || [];

    return {
      optimizedSteps: steps.map(step => ({
        id: Math.random().toString(36).substr(2, 9),
        title: step.replace(/^\d+\.\s*/, '').split(':')[0],
        description: step.split(':')[1]?.trim() || ''
      })),
      improvements: improvements.map(i => i.replace('-', '').trim())
    };
  } catch (error) {
    console.error("Workflow optimization error:", error);
    throw new Error("Failed to optimize workflow");
  }
}