import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import React from 'react'
import ReactDom from 'react-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'


const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const platforms = ['Instagram', 'Twitter', 'LinkedIn', 'Facebook', 'YouTube'];
const styles = ['Professional', 'Casual', 'Humorous', 'Inspirational'];

function App() {
  const [platform, setPlatform] = useState('');
  const [context, setContext] = useState('');
  const [style, setStyle] = useState('');
  const [captions, setCaptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateCaption = async () => {
    if (!platform || !style || !context) {
      alert('Please fill all fields');
      return;
    }

    setLoading(true);

    const prompt = `Generate a caption in a ${style} way for the platform ${platform} the topic is ${context} Only write one caption. Do not write anything other than the caption. The caption should be not be too small.`;

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setTimeout(() => {
        setCaptions((prev) => [...prev, { platform, style, context, text }]);
        setLoading(false);
      }, 1000); // simulate loading
    } catch (err) {
      console.error(err);
      alert('Something went wrong!');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col lg:flex-row items-start justify-center gap-8">
      {/* LEFT: Input Section */}
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Caption Generator</h1>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Select a Platform..</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">-- Select --</option>
            {platforms.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Tell us the Topic/Details of the Post ..</label>
          <input
            value={context}
            onChange={(e) => setContext(e.target.value)}
            type="text"
            placeholder="e.g. Course Completion.."
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Writing Style</label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">-- Select --</option>
            {styles.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <button
          onClick={generateCaption}
          className="w-full mt-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          {loading ? 'Generating...' : '✨ Inspire Me'}
        </button>
      </div>

      {/* RIGHT: Captions Section */}
      <div className="flex-1 w-full max-w-2xl space-y-4">
        {captions.map((c, index) => (
          <div key={index} className="bg-white p-4 rounded-xl shadow-md border">
            <div className="flex gap-4 mb-2">
              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                {c.platform}
              </span>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                {c.style}
              </span>
            </div>
            <p className="text-sm text-gray-500 font-medium mb-2">
              Topic: {c.context}
            </p>
            <p className="text-gray-800 whitespace-pre-line"><ReactMarkdown>{c.text}</ReactMarkdown></p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
