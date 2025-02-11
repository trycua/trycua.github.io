import React, { useState, useEffect } from 'react';
import { Github, Download, Menu, X } from 'lucide-react';

const Root = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMenuOpen && !target.closest('[data-menu-container]')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [isMenuOpen]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="p-4 relative">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <a href="/" className="text-black hover:text-gray-600">
              <img src="/logo.svg" alt="TryCua Logo" className="h-10 w-10" />
            </a>
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4 ml-4">
              <a href="https://discord.com/invite/5ngXY2Wn" className="text-gray-600 hover:text-gray-900">Discord</a>
              <a href="https://github.com/trycua" className="text-gray-600 hover:text-gray-900">GitHub</a>
              <a href="https://github.com/orgs/trycua/packages" className="text-gray-600 hover:text-gray-900">Images</a>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            className="md:hidden text-gray-600 hover:text-gray-900"
            data-menu-container
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <>
            <div 
              className="absolute top-full left-0 right-0 bg-white shadow-lg p-4 md:hidden z-50"
              data-menu-container
            >
              <div className="flex flex-col space-y-4">
                <a href="https://discord.com/invite/5ngXY2Wn" className="text-gray-600 hover:text-gray-900">Discord</a>
                <a href="https://github.com/trycua" className="text-gray-600 hover:text-gray-900">GitHub</a>
                <a href="https://github.com/orgs/trycua/packages" className="text-gray-600 hover:text-gray-900">Images</a>
              </div>
            </div>
          </>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto mt-32 text-center px-4">
        <div className="flex justify-center mb-8">
          <img src="/logo.svg" alt="TryCua Logo" className="w-24 h-24" />
        </div>
        <h1 className="text-4xl font-bold mb-8">
          Get started with local sandbox.
        </h1>
        <p className="text-gray-600 mb-12">
          Run secure, isolated environments with near-native performance on Apple Silicon.
        </p>
        
        {/* Product Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* CUA Card */}
          <div className="group relative">
            <div className="bg-white p-8 rounded-xl border border-gray-200 opacity-50 flex flex-col h-full">
              <div className="absolute top-0 right-0 bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-tr-xl">Early Preview</div>
              <h3 className="font-bold text-xl mb-3 text-black">Agent</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Computer Use AI Agent (CUA) for multi-apps agentic workflows</p>
            </div>
          </div>

          {/* Computer Card */}
          <div className="group relative">
            <div className="bg-white p-8 rounded-xl border border-gray-200 opacity-50 flex flex-col h-full">
              <div className="absolute top-0 right-0 bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-tr-xl">Early Preview</div>
              <h3 className="font-bold text-xl mb-3 text-black">Computer</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Computer Use Interface (CUI) framework for interacting with sandboxes</p>
            </div>
          </div>

          {/* Lume Card */}
          <a href="https://github.com/trycua/lume" className="group">
            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:border-black transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col h-full">
              <h3 className="font-bold text-xl mb-3 text-black group-hover:text-black transition-colors">Lume</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Virtualization layer to host macOS & Linux, powered by Apple Virtualization.framework</p>
            </div>
          </a>
        </div>

        <p className="text-sm text-gray-500 mb-12">
          Available for macOS on Apple Silicon
        </p>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 w-full p-4 bg-white border-t">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 space-y-4 md:space-y-0">
          <div>© 2025 TryCua</div>
          <div className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-6">
            <a href="https://github.com/trycua/lume/blob/main/docs/FAQ.md" className="hover:text-gray-900">Docs</a>
            <a href="https://github.com/trycua" className="hover:text-gray-900">GitHub</a>
            <a href="https://discord.com/invite/5ngXY2Wn" className="hover:text-gray-900">Discord</a>
            <a href="https://twitter.com/trycua" className="hover:text-gray-900">X (Twitter)</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Root;