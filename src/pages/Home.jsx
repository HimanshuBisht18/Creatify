
import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Select from 'react-select';
import { BsStars } from 'react-icons/bs';
import { HiOutlineCode } from 'react-icons/hi';
import Editor from '@monaco-editor/react';
import { IoCloseSharp, IoCopy } from 'react-icons/io5';
import { PiExportBold } from 'react-icons/pi';
import { ImNewTab } from 'react-icons/im';
import { FiRefreshCcw } from 'react-icons/fi';
import { GoogleGenAI } from "@google/genai";
import { ClipLoader } from 'react-spinners';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Home = () => {
  const options = [
    { value: 'html-css', label: 'HTML + CSS' },
    { value: 'html-tailwind', label: 'HTML + Tailwind CSS' },
    { value: 'html-bootstrap', label: 'HTML + Bootstrap' },
    { value: 'html-css-js', label: 'HTML + CSS + JS' },
    { value: 'html-tailwind-bootstrap', label: 'HTML + Tailwind + Bootstrap' },
  ];

  const [outputScreen, setOutputScreen] = useState(false);
  const [tab, setTab] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [frameWork, setFrameWork] = useState(options[0]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNewTabOpen, setIsNewTabOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  function extractCode(responseText) {
    const match = responseText.match(/```(?:\w+)?\n?([\s\S]*?)```/);
    return match ? match[1].trim() : responseText.trim();
  }

 const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY
});

  async function getResponse() {
    if (!prompt.trim()) return toast.error("⚠️ Please describe your component first");

    try {
      setLoading(true);
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
        Generate a modern, animated and responsive UI component.
        Component: ${prompt}
        Framework: ${frameWork.value}
        Rules: return ONLY code in one complete HTML file inside markdown fences.
        `,
      });

      const text = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
      setCode(extractCode(text));
      setOutputScreen(true);
    } catch (error) {
      console.error(error);
      toast.error("❌ Something went wrong while generating code");
    } finally {
      setLoading(false);
    }
  }

  const copyCode = async () => {
    if (!code.trim()) return toast.error("No code to copy");
    try {
      await navigator.clipboard.writeText(code);
      toast.success("✅ Code copied!");
    } catch {
      toast.error("❌ Failed to copy");
    }
  };

  const downloadFile = () => {
    if (!code.trim()) return toast.error("No code to download");

    const fileName = "GeneratedUI.html";
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("💾 File downloaded");
  };

  return (
    <>
      <Navbar />
      <ToastContainer position="bottom-right" theme="dark" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 lg:px-16">
        {/* Left */}
        <div className="w-full py-6 rounded-xl bg-[#141319] mt-5 p-5 shadow-lg shadow-purple-900/30">
          <h3 className='text-2xl font-semibold'>AI Component Generator</h3>
          <p className='text-gray-400 mt-2 text-[15px]'>Describe your component and let AI code it for you.</p>

          <p className='text-[15px] font-bold mt-4'>Framework</p>
          <Select
            className='mt-2'
            options={options}
            value={frameWork}
            styles={{
              control: (base) => ({ ...base, backgroundColor: "#111", borderColor: "#333", color: "#fff" }),
              menu: (base) => ({ ...base, backgroundColor: "#111" }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isSelected ? "#6b21a8" : state.isFocused ? "#333" : "#111",
                color: "#fff"
              }),
              singleValue: (base) => ({ ...base, color: "#fff" }),
            }}
            onChange={setFrameWork}
          />

          <p className='text-[15px] font-bold mt-5'>Describe your component</p>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className='w-full min-h-[200px] rounded-xl bg-[#09090B] mt-3 p-3 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500 resize-none'
            placeholder="Describe your component..."
          ></textarea>

          <div className="flex items-center justify-between mt-4">
            <p className='text-gray-400 text-sm'>Click on generate button</p>
            <button
              onClick={getResponse}
              disabled={loading}
              className="flex items-center px-5 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {loading ? <ClipLoader size={18} color="#fff" /> : <BsStars />}
              Generate
            </button>
          </div>
        </div>

        {/* Right */}
        <div className="relative mt-2 w-full h-[80vh] bg-[#141319] rounded-xl overflow-hidden shadow-lg shadow-purple-900/20">
          {!outputScreen ? (
            <div className="w-full h-full flex items-center flex-col justify-center">
              <div className="p-5 w-[70px] flex items-center justify-center text-[30px] h-[70px] rounded-full bg-gradient-to-r from-purple-500 to-pink-600">
                <HiOutlineCode />
              </div>
              <p className='text-gray-400 mt-3'>Your code will appear here</p>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="bg-[#17171C] w-full h-[50px] flex items-center">
                <button
                  onClick={() => setTab(1)}
                  className={`w-1/2 py-2 rounded-lg transition-all ${tab === 1 ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white" : "bg-zinc-800 text-gray-300"}`}
                >
                  Code
                </button>
                <button
                  onClick={() => setTab(2)}
                  className={`w-1/2 py-2 rounded-lg transition-all ${tab === 2 ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white" : "bg-zinc-800 text-gray-300"}`}
                >
                  Preview
                </button>
              </div>

              {/* Toolbar */}
              <div className="bg-[#17171C] h-[50px] flex items-center justify-between px-4">
                <p className='font-bold text-gray-200'>Code Editor</p>
                <div className="flex items-center gap-2">
                  {tab === 1 ? (
                    <>
                      <button onClick={copyCode} className="w-10 h-10 rounded-lg border border-zinc-800 flex items-center justify-center hover:bg-[#333]"><IoCopy /></button>
                      <button onClick={downloadFile} className="w-10 h-10 rounded-lg border border-zinc-800 flex items-center justify-center hover:bg-[#333]"><PiExportBold /></button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => setIsNewTabOpen(true)} className="w-10 h-10 rounded-lg border border-zinc-800 flex items-center justify-center hover:bg-[#333]"><ImNewTab /></button>
                      <button onClick={() => setRefreshKey(prev => prev + 1)} className="w-10 h-10 rounded-lg border border-zinc-800 flex items-center justify-center hover:bg-[#333]"><FiRefreshCcw /></button>
                    </>
                  )}
                </div>
              </div>

              {/* Code / Preview */}
              <div className="h-full">
                {tab === 1 ? (
                  <Editor value={code} height="100%" theme='vs-dark' language="html" />
                ) : (
                  <iframe key={refreshKey} srcDoc={code} className="w-full h-full bg-white"></iframe>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Fullscreen Preview */}
      {isNewTabOpen && (
        <div className="absolute inset-0 bg-white w-screen h-screen overflow-auto z-50">
          <div className="text-black h-[60px] flex items-center justify-between px-5 bg-gray-100 shadow">
            <p className='font-bold'>Preview</p>
            <button onClick={() => setIsNewTabOpen(false)} className="w-10 h-10 rounded-lg border border-zinc-300 flex items-center justify-center hover:bg-gray-200">
              <IoCloseSharp />
            </button>
          </div>
          <iframe srcDoc={code} className="w-full h-[calc(100vh-60px)]"></iframe>
        </div>
      )}
    </>
  )
}

export default Home
