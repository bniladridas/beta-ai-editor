import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Moon, Sun, Code2, Save, Wand2, Settings, Trash2, Download, Info } from 'lucide-react';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { GoogleGenerativeAI } from '@google/generative-ai';

type Language = 'c' | 'c++' | 'c#' | 'go' | 'java8' | 'javascript' | 'kotlin' | 'php' | 'python3' | 'scala' | 'swift';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

function App() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'tiger'>(() =>
    localStorage.getItem('theme') as 'light' | 'dark' | 'tiger' || 'tiger'
  );
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(() =>
    (localStorage.getItem('selectedLanguage') as Language) || 'javascript'
  );
  const [code, setCode] = useState(() => localStorage.getItem('code') || '');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [isSaved, setIsSaved] = useState(true);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('selectedLanguage', selectedLanguage);
  }, [selectedLanguage]);

  useEffect(() => {
    localStorage.setItem('code', code);
    setIsSaved(false);
  }, [code]);

  const handleSaveCode = useCallback(() => {
    const snippet = { language: selectedLanguage, code };
    localStorage.setItem('savedCode', JSON.stringify(snippet));
    setIsSaved(true);
  }, [code, selectedLanguage]);

  const handleClearCode = useCallback(() => {
    if (window.confirm('Are you sure you want to clear the code?')) {
      setCode('');
      setIsSaved(true);
    }
  }, []);

  const handleDownloadCode = useCallback(() => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${selectedLanguage}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [code, selectedLanguage]);

  const generateCode = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt first');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const promptText = `Generate ${selectedLanguage} code for: ${prompt}. Only provide the code, no explanations.`;

      const result = await model.generateContent(promptText);
      const response = await result.response;
      const generatedCode = response.text();

      setCode(generatedCode);
    } catch (err) {
      setError('Failed to generate code. Please try again.');
      console.error('Error generating code:', err);
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, selectedLanguage]);

  const getThemeColors = useMemo(() => {
    switch (theme) {
      case 'dark':
        return 'bg-gradient-to-b from-neutral-900 to-stone-900 text-white';
      case 'tiger':
        return 'bg-gradient-to-br from-orange-900 via-amber-800 to-stone-900 text-white';
      default:
        return 'bg-gradient-to-b from-orange-50 to-amber-100 text-stone-800';
    }
  }, [theme]);

  return (
    <div className={`min-h-screen ${getThemeColors} transition-all duration-700`}>
      <div className="min-h-screen bg-[url('/api/placeholder/50/50')] bg-repeat opacity-10 absolute inset-0"></div>
      <div className="min-h-screen relative flex flex-col">
        <header className="backdrop-blur-md bg-black/20 border-b border-orange-500/20 p-4 sticky top-0 z-10">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Code2 className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
              <h1 className="text-xl sm:text-2xl font-bold font-mono">Beta AI Editor</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="p-2 rounded-full hover:bg-orange-500/10 transition-colors"
                aria-label="Toggle Info"
              >
                <Info className="w-5 h-5" />
              </button>
              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'tiger' : 'light')}
                className="p-2 rounded-full hover:bg-orange-500/10 transition-colors"
                aria-label="Toggle Theme"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> :
                 theme === 'dark' ? <Settings className="w-5 h-5 text-orange-500" /> :
                                    <Sun className="w-5 h-5 text-orange-500" />}
              </button>
            </div>
          </div>
        </header>

        <main className="container mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6 flex-grow">
          {showInfo && (
            <div className="bg-black/30 backdrop-blur-md p-4 rounded-lg border border-orange-500/20">
              <h2 className="text-lg font-semibold mb-2">How to use Beta AI Editor</h2>
              <ul className="list-disc pl-5 space-y-1 text-sm sm:text-base">
                <li>Select your preferred programming language from the dropdown menu.</li>
                <li>Enter a description of the code you want to generate in the input field.</li>
                <li>Click the "Generate" button or press Enter to create the code.</li>
                <li>Edit the generated code in the editor below as needed.</li>
                <li>Use the buttons to save, clear, or download your code.</li>
              </ul>
              <h2 className="text-lg font-semibold mb-2">What's New</h2>
              <p>Introducing AI assistance powered by Google Generative AI! This feature enhances your coding experience by providing intelligent suggestions and code generation capabilities.</p>
              <p>Now you can generate code snippets, receive real-time assistance, and improve your productivity with our integrated AI tools.</p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as Language)}
              className="px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-black/30 backdrop-blur-md border border-orange-500/20 focus:ring-2 ring-orange-500 outline-none w-full sm:w-auto text-sm sm:text-base"
              aria-label="Select Language"
            >
              {['c', 'c++', 'c#', 'go', 'java8', 'javascript', 'kotlin', 'php', 'python3', 'scala', 'swift'].map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
            <div className="flex items-center gap-2">
              {[
                { label: isSaved ? 'Saved' : 'Save', icon: Save, onClick: handleSaveCode, disabled: isSaved },
                { label: 'Clear', icon: Trash2, onClick: handleClearCode },
                { label: 'Download', icon: Download, onClick: handleDownloadCode },
              ].map(({ label, icon: Icon, onClick, disabled }) => (
                <button
                  key={label}
                  onClick={onClick}
                  disabled={disabled}
                  className={`flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-black/30 hover:bg-black/40
                    transition-all backdrop-blur-md border border-orange-500/20 flex-1 sm:flex-none justify-center
                    ${disabled ? 'opacity-50 cursor-not-allowed' : ''} text-sm sm:text-base`}
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 sm:gap-3 p-2 bg-black/30 backdrop-blur-md rounded-lg border border-orange-500/20">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the code you want to generate..."
              className="flex-1 px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-black/20 placeholder-white/50 border-none focus:ring-2 ring-orange-500 outline-none text-sm sm:text-base"
              onKeyDown={(e) => e.key === 'Enter' && generateCode()}
              aria-label="Code Generation Prompt"
            />
            <button
              onClick={generateCode}
              disabled={isGenerating}
              className={`flex items-center gap-1 sm:gap-2 px-4 py-2 sm:px-6 sm:py-2 rounded-lg bg-orange-600/80 hover:bg-orange-600
                transition-all whitespace-nowrap text-sm sm:text-base
                ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-label="Generate Code"
            >
              <Wand2 className="w-4 h-4" />
              {isGenerating ? 'Generating...' : 'Generate'}
            </button>
          </div>

          {error && (
            <div className="text-red-300 text-xs sm:text-sm bg-red-950/30 backdrop-blur-md p-3 rounded-lg border border-red-500/20">
              {error}
            </div>
          )}

          <div className="rounded-lg overflow-hidden shadow-lg bg-black/30 backdrop-blur-md border border-orange-500/20">
            <CodeEditor
              value={code}
              language={selectedLanguage}
              onChange={(e) => setCode(e.target.value)}
              padding={15}
              style={{
                fontSize: '0.85rem',
                backgroundColor: 'transparent',
                fontFamily: 'ui-monospace, SFMono-Regular, SF Mono, Menlo, monospace',
                minHeight: '50vh',
              }}
              className="w-full"
              data-color-mode="dark"
            />
          </div>
        </main>

        <footer className="mt-auto p-4 text-center text-xs sm:text-sm opacity-75">
          <h2 className="font-semibold mb-1">Need Help?</h2>
          <p>If you have any questions or concerns, please contact support at <a href="mailto:bniladridas@gmail.com" className="underline hover:text-orange-300">bniladridas@gmail.com</a>.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;