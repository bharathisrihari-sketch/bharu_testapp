import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client safely
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Route: Live Gemini prompt generation for simulated Android app
app.post('/api/gemini/generate', async (req, res) => {
  try {
    const { prompt, modelName = 'gemini-3.8-flash', systemInstruction } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Return a friendly offline fallback if API key is not active
      res.json({
        text: `[Gemini Simulator Response]\nHello! I received your prompt: "${prompt}".\n\n(Note: To connect live Gemini API, ensure process.env.GEMINI_API_KEY is configured in Settings > Secrets).`,
        status: 'simulated',
      });
      return;
    }

    const validModel = modelName.includes('1.5') ? 'gemini-3.8-flash' : modelName;

    const response = await ai.models.generateContent({
      model: validModel,
      contents: prompt,
      ...(systemInstruction ? { config: { systemInstruction } } : {}),
    });

    const outputText = response.text || 'No response text returned.';
    res.json({ text: outputText, status: 'success' });
  } catch (error: any) {
    console.error('Error generating content with Gemini:', error);
    res.status(500).json({
      error: error.message || 'Failed to communicate with Gemini API',
    });
  }
});

// Route: Android Developer AI Assistant (for code updates, debugging, and enhancements)
app.post('/api/gemini/assistant', async (req, res) => {
  try {
    const { request, currentFiles } = req.body;

    if (!request) {
      res.status(400).json({ error: 'Request description is required' });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.json({
        suggestion: `Here is a suggested improvement for your Android project:\n- Added explicit error handling in Kotlin coroutine scope.\n- Configured ProgressBar in activity_main.xml for network status loading.`,
        codeUpdates: null,
      });
      return;
    }

    const systemPrompt = `You are an expert Senior Android Developer assisting with Kotlin and Android XML development using the official Google Gemini Android SDK (com.google.ai.client:generativeai).
The user wants to enhance, debug, or extend their Android Studio project.
Provide helpful advice and, if relevant, structured code suggestions or answers. Keep answers clear, technical, and formatted in clean markdown.`;

    const userContent = `Current project files:\n${JSON.stringify(currentFiles, null, 2)}\n\nUser Request: ${request}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userContent,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Error in Android AI assistant:', error);
    res.status(500).json({ error: error.message || 'Assistant request failed' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = await vite.transformIndexHtml(
          url,
          `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Android Studio Gemini App Workbench</title>
    <script type="module" src="/src/main.tsx"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`
        );
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  }

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer();
