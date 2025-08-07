import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GrokService {
  private readonly apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
  private readonly apiKey = process.env.GROK_API_KEY;

  async generateAttendanceEmail(employeeName: string, status: string, timestamp: string): Promise<string> {
    const prompt = `
Write a short, professional, and casually warm email to an employee named ${employeeName}, who just ${status === 'IN' ? 'clocked in' : 'clocked out'} at ${timestamp}.
Make it feel modern and human — 3 to 4 lines max. No over-explaining or robotic tone.
Do NOT include any intros like "Here is your email" or "This is a message".
Just output the email body as-is.
End with a short, inspiring quote in a new line — not cheesy, just motivational.
`;

    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: 'llama3-70b-8192',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data.choices[0].message.content.trim();
    } catch (error: any) {
      console.error('Groq API error:', error?.response?.data || error.message);
      return '⚠️ Failed to generate AI email.';
    }
  }
}
