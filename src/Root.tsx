import React, { useState, useEffect } from 'react';
import { Github, Menu, X, Star, Rocket, Sun, Moon, Bot, Monitor, Server, ArrowRight, ClipboardList, Play } from 'lucide-react';

const formatStarCount = (count: number | null): string => {
  if (count === null) return '0';
  if (count >= 1000) {
    // Round to nearest 100 before formatting
    const roundedCount = Math.round(count / 100) * 100;
    return `${(roundedCount / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  }
  return count.toString();
};

// Debounce helper outside component to prevent recreation
const debounce = (fn: Function, ms = 100) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

const Root = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lumeStars, setLumeStars] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage on initial render
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  // Toggle theme
  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newTheme = !prev;
      // Save to localStorage
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
      // Toggle class on html element
      document.documentElement.classList.toggle('dark');
      return newTheme;
    });
  };

  // Set initial theme class on mount
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.backgroundColor = '#171717';
      document.body.style.backgroundColor = '#171717';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.backgroundColor = 'white';
      document.body.style.backgroundColor = 'white';
    }
  }, [isDarkMode]);

  // Fetch GitHub stars
  useEffect(() => {
    const fetchStars = async () => {
      try {
        console.log('Fetching GitHub stars...');
        const response = await fetch('https://api.github.com/repos/trycua/lume', {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            // Using environment variable for the token
            ...(process.env.NEXT_PUBLIC_GITHUB_TOKEN && {
              'Authorization': `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`
            })
          }
        });
        if (!response.ok) {
          console.error('GitHub API error:', {
            status: response.status,
            statusText: response.statusText,
            rateLimitRemaining: response.headers.get('x-ratelimit-remaining'),
            rateLimitReset: response.headers.get('x-ratelimit-reset')
          });
          return;
        }
        const data = await response.json();
        console.log('GitHub API response:', data);
        if (!data || typeof data.stargazers_count !== 'number') {
          console.error('Invalid GitHub API response:', data);
          return;
        }
        setLumeStars(data.stargazers_count);
      } catch (error: any) {
        console.error('Error fetching GitHub stars:', {
          name: error?.name,
          message: error?.message,
          stack: error?.stack
        });
      }
    };
    fetchStars();
  }, []);

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

  // Add scroll detection
  useEffect(() => {
    const checkScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const hasScrollableContent = scrollHeight > clientHeight + 10; // Reduced from 20 to 10
      const hasScrolled = scrollTop > 5; // Reduced from 20 to 5
      
      setIsScrolled(hasScrollableContent && hasScrolled);
    };

    // Add a small delay before initializing to prevent initial flicker
    const initTimeout = setTimeout(() => {
      setIsInitialized(true);
      checkScroll();
    }, 100);

    const debouncedScroll = debounce(checkScroll, 50);
    const debouncedResize = debounce(checkScroll, 100);

    window.addEventListener('scroll', debouncedScroll);
    window.addEventListener('resize', debouncedResize);

    return () => {
      clearTimeout(initTimeout);
      window.removeEventListener('scroll', debouncedScroll);
      window.removeEventListener('resize', debouncedResize);
    };
  }, []);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#171717]' : 'bg-white'} transition-[background-color,border-color] duration-200 ease-in-out`}>
      {/* Header */}
      <nav className={`fixed top-0 left-0 right-0 p-4 z-50 ${isDarkMode ? 'bg-[#171717]' : 'bg-white'} transition-[background-color,border-color] duration-200 ease-in-out`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <a href="/" className={`${isDarkMode ? 'text-white hover:text-gray-200' : 'text-black hover:text-gray-600'}`}>
              <img 
                src={isDarkMode ? "/logo-white.svg" : "/logo-black.svg"} 
                alt="TryCua Logo" 
                className="h-10 w-10" 
              />
            </a>
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4 ml-4">
              <a href="https://discord.com/invite/5ngXY2Wn" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>Discord</a>
              <a href="https://github.com/trycua" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>GitHub</a>
              <a href="https://github.com/orgs/trycua/packages" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>Images</a>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            className={`md:hidden ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            data-menu-container
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {/* Theme Switch */}
          <button
            key={`theme-switch-${isDarkMode}`}
            className={`hidden md:flex items-center gap-2 fixed right-28 top-4 h-8 py-0 px-3 rounded-full border transform-gpu ${
              isDarkMode 
                ? 'text-gray-300 hover:text-white bg-[#171717] border-neutral-800 hover:border-neutral-700' 
                : 'text-gray-600 hover:text-gray-900 bg-white border-gray-200 hover:border-gray-300'
            } transition-[background-color,border-color,color] duration-200 ease-in-out`}
            onClick={toggleTheme}
          >
            {isDarkMode ? <Moon size={16} /> : <Sun size={16} />}
            <span>{isDarkMode ? 'Owl mode' : 'Eagle mode'}</span>
          </button>

          {/* GitHub Link */}
          <a 
            key={`github-${isDarkMode}`}
            href="https://github.com/trycua/lume" 
            className={`hidden md:flex items-center gap-2 fixed right-8 top-4 h-8 py-0 px-3 rounded-full border transform-gpu ${
              isDarkMode 
                ? 'text-gray-300 hover:text-white bg-[#171717] border-neutral-800 hover:border-neutral-700' 
                : 'text-gray-600 hover:text-gray-900 bg-white border-gray-200 hover:border-gray-300'
            } transition-[background-color,border-color,color] duration-200 ease-in-out`}
          >
            <Github size={16} />
            <Star size={16} className="fill-current" />
          </a>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <>
            <div 
              className={`absolute top-full left-0 right-0 p-4 md:hidden z-50 ${
                isDarkMode 
                  ? 'bg-[#171717] shadow-[0_8px_30px_rgb(0,0,0,0.4)]' 
                  : 'bg-white shadow-lg'
              }`}
              data-menu-container
            >
              <div className="flex flex-col space-y-6">
                <div className="flex flex-col space-y-4">
                  <a href="https://discord.com/invite/5ngXY2Wn" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>Discord</a>
                  <a href="https://github.com/trycua" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>GitHub</a>
                  <a href="https://github.com/orgs/trycua/packages" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>Images</a>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
                <div className="flex flex-col space-y-4">
                  <button
                    className={`flex items-center gap-2 py-2 ${
                      isDarkMode 
                        ? 'text-gray-300 hover:text-white' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={toggleTheme}
                  >
                    {isDarkMode ? <Moon size={16} /> : <Sun size={16} />}
                    <span>{isDarkMode ? 'Owl mode' : 'Eagle mode'}</span>
                  </button>
                  {/* GitHub Link in Mobile Menu */}
                  <a 
                    href="https://github.com/trycua/lume" 
                    className={`flex items-center gap-2 py-2 ${
                      isDarkMode 
                        ? 'text-gray-300 hover:text-white' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Github size={16} />
                    <Star size={16} className="fill-current" />
                  </a>
                </div>
              </div>
            </div>
          </>
        )}
      </nav>

      {/* Main Content */}
      <div className="overflow-auto">
        <main className="max-w-4xl mx-auto mt-20 md:mt-32 text-center px-4 pb-40 md:pb-16">
          <div className="flex justify-center mb-4 md:mb-8">
            <img 
              src={isDarkMode ? "/logo-white.svg" : "/logo-black.svg"} 
              alt="TryCua Logo" 
              className="w-24 h-24" 
            />
          </div>
          <h1 className={`text-4xl font-bold mb-4 md:mb-8 ${isDarkMode ? 'text-white' : 'text-black'}`}>
            Get started with local sandbox.
          </h1>
          <p className={`mb-6 md:mb-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Run secure, isolated environments with near-native performance on Apple Silicon.
          </p>
          
          {/* Product List */}
          <div className="flex flex-col md:grid md:grid-cols-3 md:gap-8 mb-20 md:mb-8 mt-6 md:mt-8">
            <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl overflow-hidden shadow-[0_0_0_1px_rgba(0,0,0,0.05)] dark:shadow-none md:contents">
              {/* Lume Section */}
              <a href="https://github.com/trycua/lume" className="block group relative">
                <div className={`p-6 md:p-8 h-full transition-all duration-200 ease-in-out hover:bg-black/[0.02] dark:hover:bg-white/[0.02] active:scale-[0.98] ${
                  isDarkMode 
                    ? 'md:bg-[#171717] md:border-neutral-800 md:hover:border-white md:hover:shadow-[0_8px_30px_rgb(255,255,255,0.12)]' 
                    : 'md:bg-white md:border-gray-200 md:hover:border-black md:hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]'
                } md:rounded-xl md:border md:hover:bg-transparent dark:md:hover:bg-transparent md:active:scale-100`}>
                  <div className="flex items-center gap-3 justify-center md:flex-col md:gap-4">
                    <div className="w-6 flex-shrink-0">
                      <Server className={`w-full h-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                    </div>
                    <h3 className={`font-bold text-xl md:text-center transition-colors duration-200 ease-in-out ${isDarkMode ? 'text-white md:group-hover:text-gray-200' : 'text-black md:group-hover:text-gray-700'}`}>Lume</h3>
                  </div>
                  <p className={`text-sm leading-relaxed mt-2 px-2 md:px-0 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Virtualization layer to run macOS & Linux sandboxes (VMs / VMs on Docker), powered by Apple Virtualization.framework</p>
                </div>
              </a>

              {/* Computer Section */}
              <div className="relative border-t border-gray-100 dark:border-neutral-800 md:border-t-0">
                <div className={`p-6 md:p-8 h-full transition-[background-color,border-color,opacity,box-shadow] duration-200 ease-in-out opacity-50 pointer-events-none ${
                  isDarkMode 
                    ? 'md:bg-[#171717] md:border-neutral-800' 
                    : 'md:bg-white md:border-gray-200'
                } md:rounded-xl md:border`}>
                  <div className={`text-xs px-2 py-1 inline-block mb-4 md:mb-1 md:absolute md:top-0 md:right-0 md:rounded-tr-xl md:rounded-bl-xl transition-[background-color,color] duration-200 ease-in-out ${
                    isDarkMode 
                      ? 'text-gray-400 md:bg-neutral-900' 
                      : 'text-gray-500 md:bg-gray-100'
                  }`}>Early Preview</div>
                  <div className="flex items-center gap-3 justify-center md:flex-col md:gap-4">
                    <div className="w-6 flex-shrink-0">
                      <Monitor className={`w-full h-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                    </div>
                    <h3 className={`font-bold text-xl md:text-center ${isDarkMode ? 'text-white' : 'text-black'}`}>Computer</h3>
                  </div>
                  <p className={`text-sm leading-relaxed mt-2 px-2 md:px-0 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>A Computer Use Interface (CUI) framework for interacting with sandboxes, PyAutoGUI-compatible, and pluggable with any AI agent.</p>
                </div>
              </div>

              {/* Agent Section */}
              <div className="relative border-t border-gray-100 dark:border-neutral-800 md:border-t-0">
                <div className={`p-6 md:p-8 h-full transition-[background-color,border-color,opacity,box-shadow] duration-200 ease-in-out opacity-50 pointer-events-none ${
                  isDarkMode 
                    ? 'md:bg-[#171717] md:border-neutral-800' 
                    : 'md:bg-white md:border-gray-200'
                } md:rounded-xl md:border`}>
                  <div className={`text-xs px-2 py-1 inline-block mb-4 md:mb-1 md:absolute md:top-0 md:right-0 md:rounded-tr-xl md:rounded-bl-xl transition-[background-color,color] duration-200 ease-in-out ${
                    isDarkMode 
                      ? 'text-gray-400 md:bg-neutral-900' 
                      : 'text-gray-500 md:bg-gray-100'
                  }`}>Early Preview</div>
                  <div className="flex items-center gap-3 justify-center md:flex-col md:gap-4">
                    <div className="w-6 flex-shrink-0">
                      <Bot className={`w-full h-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                    </div>
                    <h3 className={`font-bold text-xl md:text-center ${isDarkMode ? 'text-white' : 'text-black'}`}>Agent</h3>
                  </div>
                  <p className={`text-sm leading-relaxed mt-2 px-2 md:px-0 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>A state-of-the-art Computer Use AI Agent (CUA) for multi-app workflows on macOS/Linux, supporting local (Ollama) and cloud models.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="h-0 md:h-[72px] md:h-auto">
            <div className={`fixed md:static bottom-24 left-0 right-0 py-6 px-4 md:p-0 ${
              isScrolled && isInitialized ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            } transform-gpu transition-all duration-300 ease-out md:transform-none md:opacity-100 pointer-events-auto text-center flex flex-col items-center gap-3`}>
              <p className={`text-sm md:hidden ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Available for macOS on Apple Silicon (M1+)
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="https://form.typeform.com/to/EXQ01spJ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full transition-colors pointer-events-auto ${
                    isDarkMode 
                      ? 'bg-white text-black hover:bg-gray-200' 
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  <span>Get Waitlisted</span>
                  <ClipboardList size={20} />
                </a>
                <button
                  onClick={() => setShowVideo(true)}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full transition-colors pointer-events-auto border ${
                    isDarkMode 
                      ? 'border-neutral-800 hover:border-neutral-700 text-gray-300 hover:text-white' 
                      : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span>Watch Demo</span>
                  <Play size={20} />
                </button>
              </div>
            </div>
          </div>

          <p className={`text-sm mt-6 mb-24 hidden md:block -mt-1 md:mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Available for macOS on Apple Silicon (M1+)
          </p>

        </main>
      </div>

      {/* Video Modal */}
      {showVideo && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowVideo(false)}
        >
          <div 
            className="relative w-full max-w-4xl aspect-video rounded-xl overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <X size={20} />
            </button>
            <iframe
              src="https://www.youtube.com/embed/6s03XFl0SnQ?si=k9u6CSR2Gm7daKrW&controls=0&autoplay=1"
              title="YouTube video player"
              className="absolute top-0 left-0 w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className={`fixed bottom-0 w-full p-4 border-t transition-colors ${
        isDarkMode 
          ? 'bg-[#171717] border-neutral-800' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm space-y-4 md:space-y-0">
          <div className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>© 2025 TryCua</div>
          <div className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-6">
            <a href="https://github.com/trycua/lume/blob/main/docs/FAQ.md" className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>Docs</a>
            <a href="https://github.com/trycua" className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>GitHub</a>
            <a href="https://discord.com/invite/5ngXY2Wn" className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>Discord</a>
            <a href="https://twitter.com/trycua" className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>X (Twitter)</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Root;