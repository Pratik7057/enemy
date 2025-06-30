import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import Logo from '../components/common/Logo';
import { ArrowRightIcon, CheckCircleIcon, StarIcon, SparklesIcon, BoltIcon, ChevronRightIcon, ArrowUpIcon, XMarkIcon, Bars3Icon } from '@heroicons/react/24/solid';
import { ShieldCheckIcon, KeyIcon, ClockIcon, ServerIcon, ChartBarIcon, UserGroupIcon, GlobeAltIcon, CodeBracketIcon, CheckBadgeIcon, ArrowPathIcon, PresentationChartLineIcon, CloudArrowUpIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';

const Home = () => {  const [isAnimated, setIsAnimated] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState('monthly');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const videoRef = useRef(null);
  const heroRef = useRef(null);
  const statsCountersRef = useRef(null);
  const countersStarted = useRef(false);
  
  // Theme color customization
  const setThemeColor = (primaryColor, secondaryColor) => {
    document.documentElement.style.setProperty('--color-primary-500', primaryColor);
    document.documentElement.style.setProperty('--color-secondary-500', secondaryColor);
  };
  
  // Features for the homepage
  const features = [
    {
      title: 'YouTube API Keys',
      description: 'Generate reliable YouTube API keys with high quotas that work flawlessly for your Telegram Bot.',
      icon: <KeyIcon className="w-12 h-12 text-primary-500" />,
      animation: 'fade-right',
    },
    {
      title: 'Fast & Reliable',
      description: 'Our API keys are delivered instantly and have high quota limits for all your project needs.',
      icon: <BoltIcon className="w-12 h-12 text-yellow-500" />,
      animation: 'fade-up',
    },
    {
      title: 'Secure System',
      description: 'Enterprise-grade security with JWT authentication to keep your data safe and protected.',
      icon: <ShieldCheckIcon className="w-12 h-12 text-green-500" />,
      animation: 'fade-up',
    },
    {
      title: '24/7 Availability',
      description: 'Our servers are always online, ensuring you can access your API keys anytime, anywhere.',
      icon: <ServerIcon className="w-12 h-12 text-blue-500" />,
      animation: 'fade-left',
    },
  ];
    // Advanced features section
  const advancedFeatures = [
    {
      title: 'Powerful Analytics',
      description: 'Track your API usage, quota consumption, and performance metrics in real-time.',
      icon: <ChartBarIcon className="w-8 h-8 text-indigo-500" />,
      color: 'indigo'
    },
    {
      title: 'Multiple Platforms',
      description: 'Seamlessly integrate with Telegram bots, websites, mobile apps, and other platforms.',
      icon: <GlobeAltIcon className="w-8 h-8 text-green-500" />,
      color: 'green'
    },
    {
      title: 'Smart Rotation',
      description: 'Automatic key rotation system prevents hitting YouTube API quota limits.',
      icon: <ArrowPathIcon className="w-8 h-8 text-blue-500" />,
      color: 'blue'
    },
    {
      title: 'Team Management',
      description: 'Add team members with different permission levels to manage your API keys.',
      icon: <UserGroupIcon className="w-8 h-8 text-purple-500" />,
      color: 'purple'
    },
    {
      title: 'Mobile Friendly',
      description: 'Manage your API keys on the go with our responsive mobile interface.',
      icon: <DevicePhoneMobileIcon className="w-8 h-8 text-pink-500" />,
      color: 'pink'
    },
    {
      title: 'Developer Tools',
      description: 'Access comprehensive documentation, code samples and integration tutorials.',
      icon: <CodeBracketIcon className="w-8 h-8 text-amber-500" />,
      color: 'amber'
    },
    {
      title: 'Cloud Storage',
      description: 'Securely store and manage your API keys in our encrypted cloud storage.',
      icon: <CloudArrowUpIcon className="w-8 h-8 text-cyan-500" />,
      color: 'cyan'
    },
    {
      title: 'Performance Insights',
      description: 'Get detailed insights into how your YouTube integrations are performing.',
      icon: <PresentationChartLineIcon className="w-8 h-8 text-emerald-500" />,
      color: 'emerald'
    },  ];
  // Statistics  
  const stats = [
    { 
      value: 5000, 
      label: 'Happy Clients', 
      suffix: '+', 
      startValue: 0,
      icon: <UserGroupIcon className="w-6 h-6 text-blue-500" />
    },
    { 
      value: 50000, 
      label: 'API Keys Generated', 
      suffix: '+', 
      startValue: 0,
      icon: <KeyIcon className="w-6 h-6 text-green-500" />
    },
    { 
      value: 99.9, 
      label: 'Uptime Percentage', 
      suffix: '%', 
      startValue: 90,
      icon: <ServerIcon className="w-6 h-6 text-purple-500" />
    },
    { 
      value: 24, 
      label: 'Hour Support', 
      suffix: '/7', 
      startValue: 0,
      icon: <ClockIcon className="w-6 h-6 text-rose-500" />    },  ];
  // FAQ section
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  
  const faqs = [
    {
      question: 'What is RADHA API?',
      answer: 'RADHA API is a service that provides high-quota YouTube API keys for developers, content creators, and businesses. Our API keys can be used for building Telegram bots, websites, mobile apps, and other applications that interact with YouTube data.',
    },
    {
      question: 'How quickly are API keys delivered?',
      answer: 'API keys are generated and delivered instantly after payment is confirmed. You can start using them right away in your applications.',
      isOpen: false
    },
    {
      question: 'What happens if my API key stops working?',
      answer: 'We offer replacement guarantees on all our plans. Depending on your plan, we\'ll replace any non-functioning API key within the guarantee period at no additional cost.',
      isOpen: false
    },
    {
      question: 'Can I upgrade my plan later?',
      answer: 'Yes, you can upgrade your plan at any time. The price difference will be prorated based on the remaining time in your current billing cycle.',
      isOpen: false
    },
    {
      question: 'What can I do with YouTube API keys?',
      answer: 'YouTube API keys enable you to access YouTube\'s data and features programmatically. You can retrieve video information, search for content, manage playlists, analyze channel statistics, and integrate YouTube functionality into your applications, websites, or bots.',
      isOpen: false
    },
    {
      question: 'Are there any usage restrictions?',
      answer: 'Each API key has a daily quota limit determined by your subscription plan. We recommend implementing efficient caching mechanisms and following YouTube\'s terms of service to maximize the value of your API keys.',
      isOpen: false
    },
    {
      question: 'How do I integrate the API keys with my application?',
      answer: 'We provide comprehensive documentation, code samples, and integration tutorials for various platforms, including Node.js, Python, PHP, and mobile apps. Our developer resources section has everything you need to get started quickly.',
      isOpen: false
    },
    {
      question: 'Is technical support included?',
      answer: 'Yes, all plans include technical support. Basic plans include email support, while Pro and Enterprise plans include priority support with faster response times. Enterprise customers also receive dedicated support with a personal account manager.',
      isOpen: false
    },
  ];
  // Pricing plans
  const pricingPlans = {
    monthly: [
      {
        name: 'Basic',
        price: '₹499',
        duration: 'month',
        features: [
          '3 YouTube API Keys',
          'Standard quota limits',
          'Email support',
          '7-day replacement guarantee',
          'Basic analytics'
        ],
        popular: false,
        buttonText: 'Get Started',
        variant: 'outline',
        badge: null
      },
      {
        name: 'Pro',
        price: '₹999',
        duration: 'month',
        features: [
          '10 YouTube API Keys',
          'Higher quota limits',
          'Priority support',
          '30-day replacement guarantee',
          'API usage dashboard',
          'Key rotation system',
          'Telegram bot integration'
        ],
        popular: true,
        buttonText: 'Choose Pro',
        variant: 'primary',
        badge: 'Most Popular'
      },
      {
        name: 'Enterprise',
        price: '₹2499',
        duration: 'month',
        features: [
          'Unlimited API Keys',
          'Maximum quota limits',
          '24/7 dedicated support',
          'Lifetime replacement guarantee',
          'Custom integration support',
          'Dedicated account manager',
          'Advanced analytics',
          'White-label solutions'
        ],
        popular: false,
        buttonText: 'Contact Sales',
        variant: 'secondary',
        badge: null
      }
    ],
    annual: [
      {
        name: 'Basic',
        price: '₹4999',
        duration: 'year',
        features: [
          '3 YouTube API Keys',
          'Standard quota limits',
          'Email support',
          '7-day replacement guarantee',
          'Basic analytics',
          '2 months free'
        ],
        popular: false,
        buttonText: 'Get Started',
        variant: 'outline',
        badge: 'Save 17%'
      },
      {
        name: 'Pro',
        price: '₹9999',
        duration: 'year',
        features: [
          '10 YouTube API Keys',
          'Higher quota limits',
          'Priority support',
          '30-day replacement guarantee',
          'API usage dashboard',
          'Key rotation system',
          'Telegram bot integration',
          '2 months free'
        ],
        popular: true,
        buttonText: 'Choose Pro',
        variant: 'primary',
        badge: 'Most Value'
      },
      {
        name: 'Enterprise',
        price: '₹24999',
        duration: 'year',
        features: [
          'Unlimited API Keys',
          'Maximum quota limits',
          '24/7 dedicated support',
          'Lifetime replacement guarantee',
          'Custom integration support',
          'Dedicated account manager',
          'Advanced analytics',
          'White-label solutions',
          '2 months free'
        ],
        popular: false,
        buttonText: 'Contact Sales',
        variant: 'secondary',
        badge: 'Save 17%'
      }
    ]
  };
  // Animate number counting for stats
  const animateCounters = () => {
    if (!countersStarted.current && statsCountersRef.current) {
      countersStarted.current = true;
      
      stats.forEach((stat, index) => {
        const counterEl = statsCountersRef.current.children[index].querySelector('.counter-value');
        const finalValue = stat.value;
        const startValue = stat.startValue || 0;
        const duration = 2500; // ms
        const stepTime = 20;
        const totalSteps = duration / stepTime;
        const stepValue = (finalValue - startValue) / totalSteps;
        
        let currentValue = startValue;
        let currentStep = 0;
        
        // Add a slight delay between each counter starting
        setTimeout(() => {
          const counter = setInterval(() => {
            currentStep++;
            currentValue += stepValue;
            
            // Use easing function for smoother animation
            const progress = currentStep / totalSteps;
            const easedProgress = easeOutQuart(progress);
            const displayValue = startValue + (finalValue - startValue) * easedProgress;
            
            if (currentStep >= totalSteps) {
              clearInterval(counter);
              counterEl.textContent = Number.isInteger(finalValue) ? finalValue : finalValue.toFixed(1);
            } else {
              counterEl.textContent = Number.isInteger(finalValue) 
                ? Math.round(displayValue) 
                : displayValue.toFixed(1);
            }
          }, stepTime);
        }, index * 200); // Staggered start for visual interest
      });
    }
  };
  
  // Easing function for smoother animations
  const easeOutQuart = (x) => {
    return 1 - Math.pow(1 - x, 4);
  };    useEffect(() => {
    // Trigger animation after component mounts
    setIsAnimated(true);
    
    // Add scroll event listener for effects
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (scrollPosition / windowHeight) * 100;
      
      // Update scroll progress indicator
      setScrollProgress(scrolled);
      
      // Update navbar style based on scroll
      if (scrollPosition > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      
      // Parallax effect for hero section
      if (heroRef.current) {
        const yOffset = scrollPosition * 0.4;
        heroRef.current.style.backgroundPositionY = `${yOffset}px`;
      }
      
      // Animate counters when stats section is in view
      if (statsCountersRef.current) {
        const rect = statsCountersRef.current.getBoundingClientRect();
        if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
          animateCounters();
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            
            // Play video when in view
            if (entry.target.tagName === 'VIDEO' && videoRef.current) {
              videoRef.current.play().catch(e => console.log('Auto-play prevented:', e));
            }
            
            // Animate counters when in view
            if (entry.target === statsCountersRef.current) {
              animateCounters();
            }
          }
        });
      },
      { threshold: 0.2 }
    );
    
    document.querySelectorAll('.scroll-animate').forEach((el) => {
      observer.observe(el);
    });
    
    if (statsCountersRef.current) {
      observer.observe(statsCountersRef.current);
    }
      return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">      {/* Header */}
      <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md' : 'bg-transparent'}`}>
        {/* Scroll Progress Indicator */}
        <div 
          className="absolute top-0 left-0 h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
          aria-hidden="true"
        />

        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Logo className="text-2xl" />
          <div className="flex items-center space-x-4">
            <ThemeToggle />            <div className="hidden md:flex space-x-6">
              <NavLink href="#features">Features</NavLink>
              <NavLink href="#how-it-works">How It Works</NavLink>
              <NavLink href="#pricing">Pricing</NavLink>
              <NavLink href="#faq">FAQ</NavLink>
            </div>
            <div className="hidden sm:flex space-x-3">
              <Link to="/login">
                <Button variant="outline" size="sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">Register</Button>
              </Link>
            </div>
            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden absolute w-full transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
          <div className={`bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-t dark:border-gray-800 py-4`}>
            <div className="container mx-auto px-4">
              <nav className="flex flex-col space-y-4">                <NavLink href="#features" onClick={() => setIsMobileMenuOpen(false)}>Features</NavLink>
                <NavLink href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)}>How It Works</NavLink>
                <NavLink href="#pricing" onClick={() => setIsMobileMenuOpen(false)}>Pricing</NavLink>
                <NavLink href="#faq" onClick={() => setIsMobileMenuOpen(false)}>FAQ</NavLink>
                <div className="flex space-x-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm">Login</Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="primary" size="sm">Register</Button>
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </header>{/* Hero Section */}
      <section ref={heroRef} className="hero-section relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32 bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          {/* Gradient blobs */}
          <div className="absolute right-0 bottom-0 w-1/2 h-1/2 bg-gradient-to-l from-primary-300/30 to-transparent dark:from-primary-700/30 rounded-full filter blur-3xl transform translate-x-1/3 translate-y-1/3 animate-pulse-slow"></div>
          <div className="absolute left-0 top-0 w-1/2 h-1/2 bg-gradient-to-r from-secondary-300/30 to-transparent dark:from-secondary-700/30 rounded-full filter blur-3xl transform -translate-x-1/3 -translate-y-1/3 animate-pulse-slow animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 bg-gradient-to-br from-purple-300/20 to-pink-300/20 dark:from-purple-700/20 dark:to-pink-700/20 rounded-full filter blur-3xl animate-pulse-slow animation-delay-3000"></div>
          
          {/* Floating elements */}
          <div className="absolute top-1/4 right-1/4 w-20 h-20 rounded-full border border-primary-300/50 dark:border-primary-700/50 animate-float animation-delay-1000"></div>
          <div className="absolute bottom-1/3 left-1/5 w-12 h-12 rounded-full border border-secondary-300/50 dark:border-secondary-700/50 animate-float animation-delay-3000"></div>
          <div className="absolute top-2/3 right-1/3 w-16 h-16 rounded-full border border-purple-300/50 dark:border-purple-700/50 animate-float animation-delay-2000"></div>
          
          {/* Particle network - simulated with dots */}
          <div className="absolute inset-0 opacity-20 dark:opacity-30">
            {[...Array(20)].map((_, i) => (
              <div key={i} 
                className="absolute bg-primary-500 dark:bg-primary-400 rounded-full animate-pulse-random"
                style={{ 
                  width: `${3 + Math.random() * 5}px`, 
                  height: `${3 + Math.random() * 5}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDuration: `${7 + Math.random() * 10}s`,
                  animationDelay: `${Math.random() * 5}s`
                }}
              ></div>
            ))}
            {[...Array(15)].map((_, i) => (
              <div key={i+100} 
                className="absolute bg-secondary-500 dark:bg-secondary-400 rounded-full animate-pulse-random"
                style={{ 
                  width: `${2 + Math.random() * 4}px`, 
                  height: `${2 + Math.random() * 4}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDuration: `${7 + Math.random() * 10}s`,
                  animationDelay: `${Math.random() * 5}s`
                }}
              ></div>
            ))}
          </div>

          {/* Tech circuit pattern overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOHYyNm0tNi0xM0g1NE01MCAxOHYyNk0xOCAzMGgyNm0tMTMtNnYyNk0zMCA2djEzTTYgMzBoMTMiIHN0cm9rZT0iI2UyZThmMCIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] opacity-[0.15] dark:opacity-[0.07]"></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className={`transition-all duration-700 transform ${isAnimated ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6">
                Reliable <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500 dark:from-primary-400 dark:to-secondary-400">YouTube API</span> Keys for Developers
              </h1>
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8">
                Get high-quota, reliable YouTube API keys instantly. Perfect for developers, Telegram bots, data scientists, and content creators.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/register">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    animated 
                    icon={<ArrowRightIcon className="w-5 h-5" />} 
                    iconPosition="right"
                    className="shadow-lg shadow-primary-500/30 dark:shadow-primary-700/30"
                  >
                    Get Started Now
                  </Button>
                </Link>
                <Link to="#how-it-works">
                  <Button variant="ghost" size="lg" animated>
                    See How It Works
                  </Button>
                </Link>
              </div>
              
              {/* Trust badges */}
              <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Trusted by developers worldwide</p>
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center">
                    <ShieldCheckIcon className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">100% Secure Payments</span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Instant Delivery</span>
                  </div>
                  <div className="flex items-center">
                    <KeyIcon className="w-5 h-5 text-purple-500 mr-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">High-Quota Keys</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`transition-all duration-700 delay-300 transform ${isAnimated ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
              <div className="relative">
                {/* Glow effect behind card */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl transform rotate-6 scale-105 opacity-20 blur-lg"></div>
                
                {/* API Key Generator card */}
                <div className="relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg mr-3">
                        <KeyIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">API Key Generator</div>
                    </div>
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse mr-2"></div>
                      <span className="text-xs text-green-500">Live</span>
                    </div>
                  </div>
                  
                  {/* API Key preview */}
                  <div className="space-y-5">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg relative overflow-hidden group">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Your YouTube API Key</div>
                      <div className="font-mono text-sm text-gray-800 dark:text-gray-200 select-all">AIzaSyD9X••••••••••••••••••••</div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out"></div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Daily Quota</div>
                        <div className="font-semibold text-primary-600 dark:text-primary-400">1,000,000 units</div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Status</div>
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                          <div className="font-semibold text-green-600 dark:text-green-400">Active</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Usage Today</div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mb-1">
                        <div className="bg-primary-600 dark:bg-primary-500 h-2.5 rounded-full" style={{ width: '15%' }}></div>
                      </div>
                      <div className="text-xs text-right text-gray-500 dark:text-gray-400">150,000 / 1,000,000 units</div>
                    </div>
                    
                    <Button 
                      variant="primary" 
                      fullWidth
                      className="shadow-lg shadow-primary-500/20"
                    >
                      Generate New Key
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* User avatars and ratings */}          <div className="mt-16 md:mt-24 flex flex-col sm:flex-row items-center justify-center">
            <div className="flex -space-x-2 overflow-hidden mb-4 sm:mb-0">
              {[...Array(5)].map((_, i) => (
                <img
                  key={i}
                  className="inline-block h-12 w-12 rounded-full ring-4 ring-white dark:ring-gray-900 transition-all hover:scale-110"
                  src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${20 + i}.jpg`}
                  alt={`User ${i + 1}`}
                  loading="lazy"
                  width="48"
                  height="48"
                />
              ))}
            </div>
            <div className="ml-0 sm:ml-6">
              <div className="flex items-center justify-center sm:justify-start">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5" />
                  ))}
                </div>
                <span className="ml-2 text-gray-700 dark:text-gray-200 font-medium">5.0</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">from 5,000+ reviews</p>
            </div>
          </div>
        </div>
        
        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg className="w-full h-auto" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
                  className="fill-white dark:fill-gray-900"></path>
          </svg>
        </div>
      </section>      {/* Statistics Section */}
      <section className="py-16 bg-white dark:bg-gray-900 relative overflow-hidden">
        {/* Stats background pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJjdXJyZW50Q29sb3IiPjxwYXRoIGQ9Ik0yIDE4VjJIMThWMThIMnptMiAwVjRIMTZWMTZINHpNMiA1OFY0Mkg1OFY1OEgyem0yLTJINTZWNDRINHYxMnptMC0yMnYtMmg4di04aDJ2OGg4djJoLThWMzZoLTJ2LThoLTh6TTU4IDI0VjJIMzh2MjJoMjB6TTQyIDR2MTJoMTJWNEg0MnoiPjwvcGF0aD48L2c+PC9zdmc+')]"></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-12">
            <span className="inline-block py-1 px-3 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-3">Our Impact</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Trusted by Developers Worldwide</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              We're proud of the numbers that define our success
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto" ref={statsCountersRef}>
            {stats.map((stat, index) => (
              <div key={index} className="scroll-animate opacity-0" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-full border border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-700">
                  <div className="relative flex flex-col items-center mb-4">
                    {/* Background glow */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 dark:from-primary-400/30 dark:to-secondary-400/30 rounded-full blur-xl opacity-70"></div>
                    
                    {/* Icon */}
                    <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/50 dark:to-secondary-900/50 rounded-full mb-3 shadow-inner">
                      {stat.icon}
                    </div>
                    
                    {/* Counter */}
                    <div className="flex items-center mt-1">
                      <span className="counter-value text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400">
                        {stat.startValue}
                      </span>
                      <span className="text-xl sm:text-2xl font-bold text-secondary-600 dark:text-secondary-400 ml-1">{stat.suffix}</span>
                    </div>
                  </div>
                  
                  <p className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 scroll-animate opacity-0">
            <span className="inline-block py-1 px-3 text-xs font-semibold text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-3">Core Features</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Powerful YouTube API Solution</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Everything you need to streamline your YouTube API integration
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="scroll-animate opacity-0 group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 border border-gray-100 dark:border-gray-700 transform hover:-translate-y-2"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="mb-4 text-primary-500 group-hover:text-secondary-500 dark:text-primary-400 dark:group-hover:text-secondary-400 transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-primary-100/50 dark:bg-primary-900/20 rounded-full filter blur-3xl"></div>
          <div className="absolute -left-10 top-10 w-72 h-72 bg-secondary-100/50 dark:bg-secondary-900/20 rounded-full filter blur-3xl"></div>
          
          {/* Pattern overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzAgMEM0Ni41NyAwIDYwIDEzLjQzIDYwIDMwIDYwIDQ2LjU3IDQ2LjU3IDYwIDMwIDYwIDEzLjQzIDYwIDAgNDYuNTcgMCAzMCAwIDEzLjQzIDEzLjQzIDAgMzAgMHptMCA1QzE2LjE5IDUgNSAxNi4xOSA1IDMwYzAgMTMuODEgMTEuMTkgMjUgMjUgMjUgMTMuODEgMCAyNS0xMS4xOSAyNS0yNSAwLTEzLjgxLTExLjE5LTI1LTI1LTI1eiIgZmlsbD0iY3VycmVudENvbG9yIiBmaWxsLW9wYWNpdHk9Ii4wNSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PC9zdmc+')] opacity-50"></div>
        </div>
      
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16 scroll-animate opacity-0">
            <span className="inline-block py-1 px-3 text-xs font-semibold text-secondary-600 dark:text-secondary-400 bg-secondary-100 dark:bg-secondary-900/30 rounded-full mb-3">Simple Process</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">How It Works</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Get started with RADHA API in three easy steps
            </p>
          </div>
          
          <div className="relative max-w-5xl mx-auto">
            {/* Timeline connector - desktop */}
            <div className="hidden md:block absolute left-0 right-0 top-36 h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-green-500 dark:from-primary-400 dark:via-secondary-400 dark:to-green-400"></div>
            
            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              {/* Step 1 */}
              <div className="scroll-animate opacity-0 relative">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 z-10 relative h-full hover:shadow-xl transition-shadow duration-300 hover:border-primary-200 dark:hover:border-primary-700">
                  {/* Circle indicator on timeline */}
                  <div className="hidden md:block absolute left-1/2 -top-10 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-400 dark:to-primary-500 rounded-full border-4 border-white dark:border-gray-800 shadow-lg z-10"></div>
                  
                  <div className="text-center md:pt-6">
                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-bold text-2xl mx-auto mb-4">1</div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Create an Account</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Sign up for a RADHA API account and choose a subscription plan that fits your needs.</p>
                    
                    <div className="py-4 px-5 bg-gray-50 dark:bg-gray-700/50 rounded-lg mb-6">
                      <ul className="text-left space-y-2 text-sm">
                        <li className="flex items-center text-gray-600 dark:text-gray-300">
                          <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span>Quick and simple sign-up process</span>
                        </li>
                        <li className="flex items-center text-gray-600 dark:text-gray-300">
                          <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span>Multiple subscription options</span>
                        </li>
                        <li className="flex items-center text-gray-600 dark:text-gray-300">
                          <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span>No credit card required to start</span>
                        </li>
                      </ul>
                    </div>
                    
                    <Link to="/register">
                      <Button 
                        variant="primary" 
                        size="sm"
                        icon={<ArrowRightIcon className="h-4 w-4" />}
                        iconPosition="right"
                        className="mt-auto"
                      >
                        Register Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="scroll-animate opacity-0" style={{ animationDelay: '150ms' }}>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 z-10 relative h-full hover:shadow-xl transition-shadow duration-300 hover:border-secondary-200 dark:hover:border-secondary-700">
                  {/* Circle indicator on timeline */}
                  <div className="hidden md:block absolute left-1/2 -top-10 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-br from-secondary-500 to-secondary-600 dark:from-secondary-400 dark:to-secondary-500 rounded-full border-4 border-white dark:border-gray-800 shadow-lg z-10"></div>
                  
                  <div className="text-center md:pt-6">
                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400 font-bold text-2xl mx-auto mb-4">2</div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Add Funds</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Load your account with credits using our secure payment methods, including UPI and cryptocurrencies.</p>
                    
                    <div className="py-4 px-5 bg-gray-50 dark:bg-gray-700/50 rounded-lg mb-6">
                      <ul className="text-left space-y-2 text-sm">
                        <li className="flex items-center text-gray-600 dark:text-gray-300">
                          <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span>Multiple payment options</span>
                        </li>
                        <li className="flex items-center text-gray-600 dark:text-gray-300">
                          <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span>Secure encrypted transactions</span>
                        </li>
                        <li className="flex items-center text-gray-600 dark:text-gray-300">
                          <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span>Instant account crediting</span>
                        </li>
                      </ul>
                    </div>
                    
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      icon={<ArrowRightIcon className="h-4 w-4" />}
                      iconPosition="right"
                      className="mt-auto"
                    >
                      View Payment Options
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="scroll-animate opacity-0" style={{ animationDelay: '300ms' }}>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 z-10 relative h-full hover:shadow-xl transition-shadow duration-300 hover:border-green-200 dark:hover:border-green-700">
                  {/* Circle indicator on timeline */}
                  <div className="hidden md:block absolute left-1/2 -top-10 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 dark:from-green-400 dark:to-green-500 rounded-full border-4 border-white dark:border-gray-800 shadow-lg z-10"></div>
                  
                  <div className="text-center md:pt-6">
                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-bold text-2xl mx-auto mb-4">3</div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Generate API Keys</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Instantly generate YouTube API keys and start using them in your applications right away.</p>
                    
                    <div className="py-4 px-5 bg-gray-50 dark:bg-gray-700/50 rounded-lg mb-6">
                      <ul className="text-left space-y-2 text-sm">
                        <li className="flex items-center text-gray-600 dark:text-gray-300">
                          <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span>Instant key generation</span>
                        </li>
                        <li className="flex items-center text-gray-600 dark:text-gray-300">
                          <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span>High quota limits</span>
                        </li>
                        <li className="flex items-center text-gray-600 dark:text-gray-300">
                          <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span>Ready-to-use documentation</span>
                        </li>
                      </ul>
                    </div>
                    
                    <Button 
                      variant="success" 
                      size="sm"
                      icon={<ArrowRightIcon className="h-4 w-4" />}
                      iconPosition="right"
                      className="mt-auto bg-gradient-to-r from-green-500 to-emerald-600"
                    >
                      See Demo
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Get started now button */}
            <div className="text-center mt-16">
              <Link to="/register">
                <Button 
                  variant="primary" 
                  size="lg" 
                  icon={<ArrowRightIcon className="h-5 w-5" />}
                  iconPosition="right"
                  className="shadow-lg shadow-primary-500/30 dark:shadow-primary-700/30"
                >
                  Get Started Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
        {/* Advanced Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-30 dark:opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16 scroll-animate opacity-0">
            <span className="inline-block py-1 px-3 text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-3">Advanced Features</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Designed for Developers</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Our platform includes advanced features to make your YouTube API integration seamless
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advancedFeatures.map((feature, index) => (
              <div 
                key={index} 
                className="scroll-animate opacity-0 group bg-white dark:bg-gray-800/80 backdrop-blur-sm p-5 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 transform hover:scale-105 transition-all duration-300 hover:shadow-xl overflow-hidden relative"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Feature card background glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-br from-${feature.color}-50/50 to-${feature.color}-100/20 dark:from-${feature.color}-900/20 dark:to-${feature.color}-800/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                {/* Feature icon with glow */}
                <div className={`relative z-10 bg-${feature.color}-50 dark:bg-${feature.color}-900/30 rounded-lg p-3 inline-block mb-4 group-hover:shadow-lg group-hover:shadow-${feature.color}-200/40 dark:group-hover:shadow-${feature.color}-800/20 transition-all duration-300`}>
                  {feature.icon}
                </div>
                
                {/* Feature content */}
                <h3 className={`relative z-10 text-lg font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-${feature.color}-600 dark:group-hover:text-${feature.color}-400 transition-colors duration-300`}>
                  {feature.title}
                </h3>
                <p className="relative z-10 text-sm text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
                
                {/* Hover reveal arrow */}
                <div className="absolute bottom-4 right-4 h-6 w-6 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <ChevronRightIcon className={`h-4 w-4 text-${feature.color}-500`} />
                </div>
              </div>
            ))}
          </div>
          
          {/* Video Demo Section */}
          <div className="mt-20 scroll-animate opacity-0" style={{ animationDelay: '400ms' }}>
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-xl overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden">
                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  {/* Replace with actual video player */}
                  <div className="text-center p-8">
                    <SparklesIcon className="w-12 h-12 text-primary-500 dark:text-primary-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">See RADHA API in Action</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Watch how easy it is to integrate YouTube data into your applications</p>
                    <Button 
                      variant="primary"
                      className="shadow-lg shadow-primary-500/20"
                    >
                      Watch Demo
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>      </section>{/* FAQ Section */}
      <section id="faq" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 scroll-animate opacity-0">
            <span className="inline-block py-1 px-3 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-3">FAQ</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Find answers to common questions about our YouTube API service
            </p>
          </div>
            <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              
              return (
                <div 
                  key={index} 
                  className={`scroll-animate opacity-0 bg-white dark:bg-gray-900 rounded-xl shadow-md mb-4 overflow-hidden transition-all duration-300 ${isOpen ? 'ring-1 ring-primary-300 dark:ring-primary-700' : ''}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >                  <div 
                    className="cursor-pointer p-6"
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                    role="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setOpenFaqIndex(isOpen ? -1 : index);
                        e.preventDefault();
                      }
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className={`text-lg font-semibold ${isOpen ? 'text-primary-700 dark:text-primary-400' : 'text-gray-900 dark:text-white'}`}>
                        {faq.question}
                      </h3>
                      <div className={`${isOpen ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'} transition-colors p-1.5 rounded-full`}>
                        {isOpen ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                      <div 
                      className={`overflow-hidden transition-all duration-300 mt-2 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                      aria-hidden={!isOpen}
                      role="region"
                      id={`faq-answer-${index}`}
                    >
                      <div className="pt-2 text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            <div className="text-center mt-10">
              <div className="inline-flex flex-col items-center bg-white dark:bg-gray-900 rounded-xl shadow-md p-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Still have questions?</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-5">Our support team is ready to help you with any queries</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    variant="primary"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>}
                    className="shadow-md"
                  >
                    Contact Support
                  </Button>
                  <Button 
                    variant="outline"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>}
                    className="border-primary-500 dark:border-primary-400 text-primary-600 dark:text-primary-400"
                  >
                    View Documentation
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 scroll-animate opacity-0">
            <span className="inline-block py-1 px-3 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-3">Pricing</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Choose the plan that works best for your needs
            </p>
          </div>
            {/* Pricing Toggle */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center bg-gray-100 dark:bg-gray-800 p-1.5 rounded-full shadow-inner">
              <button 
                onClick={() => setSelectedFrequency('monthly')}
                className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                  selectedFrequency === 'monthly' 
                    ? 'bg-white dark:bg-gray-700 shadow-md text-primary-600 dark:text-primary-400' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/80'
                }`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setSelectedFrequency('annual')}
                className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                  selectedFrequency === 'annual' 
                    ? 'bg-white dark:bg-gray-700 shadow-md text-primary-600 dark:text-primary-400' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/80'
                }`}
              >
                <span className="flex items-center">
                  Annual <span className="ml-1.5 py-0.5 px-1.5 text-xs bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100 rounded-full">Save 17%</span>
                </span>
              </button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans[selectedFrequency].map((plan, index) => (
              <div 
                key={index} 
                className={`scroll-animate opacity-0 relative ${plan.popular ? 'transform md:-translate-y-4' : ''}`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {plan.badge && (
                  <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                    ${plan.badge === 'Most Popular' || plan.badge === 'Most Value' 
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500' 
                      : plan.badge.includes('Save') 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                        : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                    } 
                    text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg`}>
                    {plan.badge}
                  </div>
                )}
                <div className={`h-full bg-white dark:bg-gray-800 rounded-xl ${plan.popular ? 'shadow-xl ring-2 ring-primary-500 dark:ring-primary-400' : 'shadow-md hover:shadow-lg'} transition-all duration-500 border ${plan.popular ? 'border-primary-500 dark:border-primary-400' : 'border-gray-100 dark:border-gray-700'} flex flex-col`}>
                  <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                    <div className="flex items-baseline">
                      <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400">{plan.price}</span>
                      <span className="ml-2 text-gray-500 dark:text-gray-400">/{plan.duration}</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      {selectedFrequency === 'monthly' ? 'Billed monthly' : 'Billed annually (save 17%)'}
                    </p>
                  </div>
                  <div className="p-6 flex-grow">
                    <ul className="space-y-4">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <CheckBadgeIcon className={`h-5 w-5 mr-3 mt-0.5 flex-shrink-0 ${plan.popular ? 'text-primary-500 dark:text-primary-400' : 'text-green-500 dark:text-green-400'}`} />
                          <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-6 mt-auto">
                    <Link to="/register">
                      <Button 
                        variant={plan.variant} 
                        fullWidth
                        className={`py-3 ${plan.popular ? 'shadow-lg shadow-primary-500/20 dark:shadow-primary-700/20' : ''}`}
                      >
                        {plan.buttonText}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Money-back guarantee badge */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-green-50 dark:bg-green-900/30 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">7-day money-back guarantee for all plans</span>
            </div>
          </div>
        </div>
      </section>      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-800 dark:to-secondary-800 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <svg className="absolute right-0 top-0 h-full opacity-20 transform translate-x-1/3 -translate-y-1/4" width="404" height="784" fill="none" viewBox="0 0 404 784">
            <defs>
              <pattern id="f210dbf6-a58d-4871-961e-36d5016a0f49" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="4" height="4" className="text-white" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="404" height="784" fill="url(#f210dbf6-a58d-4871-961e-36d5016a0f49)" />
          </svg>
          <svg className="absolute left-0 bottom-0 h-full opacity-20 transform -translate-x-1/3 translate-y-1/4" width="404" height="784" fill="none" viewBox="0 0 404 784">
            <defs>
              <pattern id="e80155a9-dfde-425a-b5ea-1f6fadd20131" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="4" height="4" className="text-white" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="404" height="784" fill="url(#e80155a9-dfde-425a-b5ea-1f6fadd20131)" />
          </svg>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Supercharge Your YouTube Integration?</h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of developers who trust RADHA API for their YouTube data needs. Get started in minutes and enjoy high-quota API keys.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button 
                  variant="glass" 
                  size="lg" 
                  className="w-full sm:w-auto shadow-lg shadow-primary-800/30"
                >
                  Create Free Account
                </Button>
              </Link>
              <Link to="/login">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="w-full sm:w-auto text-white border-white hover:bg-white/10"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
        {/* Footer */}
      <footer className="bg-gray-900 text-white relative overflow-hidden">
        {/* Footer decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary-900/20 rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-secondary-900/20 rounded-full filter blur-3xl"></div>
          
          {/* Tech circuit pattern */}
          <div className="absolute inset-0 opacity-5">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="circuit-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                  <path d="M0 50h100M50 0v100M25 25h50v50h-50z" stroke="currentColor" strokeWidth="0.5" fill="none" />
                  <circle cx="25" cy="25" r="3" fill="currentColor" />
                  <circle cx="75" cy="25" r="3" fill="currentColor" />
                  <circle cx="75" cy="75" r="3" fill="currentColor" />
                  <circle cx="25" cy="75" r="3" fill="currentColor" />
                  <circle cx="50" cy="50" r="5" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
            </svg>
          </div>
        </div>
        
        {/* Newsletter Section */}
        <div className="relative border-b border-gray-800">
          <div className="container mx-auto px-4 py-12">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl shadow-lg p-8 md:p-10 max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="md:max-w-md">
                  <h3 className="text-2xl font-bold mb-2">Subscribe to Our Newsletter</h3>
                  <p className="text-gray-300">Get the latest updates, news and special offers sent directly to your inbox.</p>
                </div>
                <div className="flex-grow max-w-md w-full">
                  <div className="flex">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 rounded-l-md bg-gray-700 border border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <button className="px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-medium rounded-r-md hover:from-primary-700 hover:to-secondary-700 transition-all duration-200">
                      Subscribe
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-gray-400">We respect your privacy. Unsubscribe at any time.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      
        {/* Footer Top */}
        <div className="container mx-auto px-4 py-12 md:py-16 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <Logo className="h-8 mb-4" />
              <p className="text-gray-400 mb-5 max-w-md">
                RADHA API provides high-quota YouTube API keys and social media marketing services to help developers and businesses streamline their integration and boost their online presence.
              </p>
              
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email Us</p>
                    <p className="text-white">support@radhaapi.com</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Call Us</p>
                    <p className="text-white">+91 9876543210</p>
                  </div>
                </div>
              </div>
              
              <h4 className="font-semibold mb-3 text-gray-300">Follow Us</h4>              <div className="flex space-x-4">
                <a href="https://twitter.com/radhaapi" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-800 transition-colors duration-300" aria-label="Twitter">
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="https://github.com/radhaapi" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-800 transition-colors duration-300" aria-label="GitHub">
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="https://t.me/radhaapi" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-800 transition-colors duration-300" aria-label="Telegram">
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.21-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.05-.2s-.17-.03-.25-.02c-.11.02-1.85 1.17-5.21 3.46-.49.33-.94.5-1.35.48-.44-.02-1.29-.25-1.92-.46-.78-.24-1.4-.38-1.34-.81.03-.2.38-.41 1.03-.63 4.04-1.76 6.73-2.92 8.07-3.48 3.85-1.61 4.65-1.9 5.17-1.9.11 0 .37.03.54.17.14.12.18.28.2.38.02.13.01.28 0 .44z" />
                  </svg>
                </a>
                <a href="https://instagram.com/radhaapi" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-800 transition-colors duration-300" aria-label="Instagram">
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-semibold mb-6 text-white">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors duration-200 flex items-center">
                    <ArrowRightIcon className="h-4 w-4 mr-2" />
                    Home
                  </a>
                </li>
                <li>
                  <a href="#features" className="text-gray-400 hover:text-primary-400 transition-colors duration-200 flex items-center">
                    <ArrowRightIcon className="h-4 w-4 mr-2" />
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-gray-400 hover:text-primary-400 transition-colors duration-200 flex items-center">
                    <ArrowRightIcon className="h-4 w-4 mr-2" />
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-gray-400 hover:text-primary-400 transition-colors duration-200 flex items-center">
                    <ArrowRightIcon className="h-4 w-4 mr-2" />
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-gray-400 hover:text-primary-400 transition-colors duration-200 flex items-center">
                    <ArrowRightIcon className="h-4 w-4 mr-2" />
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Services */}
            <div>
              <h3 className="text-xl font-semibold mb-6 text-white">Our Services</h3>
              <ul className="space-y-3">                <li>
                  <a href="/api-keys" className="text-gray-400 hover:text-primary-400 transition-colors duration-200 flex items-center">
                    <ArrowRightIcon className="h-4 w-4 mr-2" />
                    YouTube API Keys
                  </a>
                </li>
                <li>
                  <a href="/telegram-integration" className="text-gray-400 hover:text-primary-400 transition-colors duration-200 flex items-center">
                    <ArrowRightIcon className="h-4 w-4 mr-2" />
                    Telegram Bot Integration
                  </a>
                </li>
                <li>
                  <a href="/smm-services" className="text-gray-400 hover:text-primary-400 transition-colors duration-200 flex items-center">
                    <ArrowRightIcon className="h-4 w-4 mr-2" />
                    SMM Services
                  </a>
                </li>
                <li>
                  <a href="/documentation" className="text-gray-400 hover:text-primary-400 transition-colors duration-200 flex items-center">
                    <ArrowRightIcon className="h-4 w-4 mr-2" />
                    API Documentation
                  </a>
                </li>
                <li>
                  <a href="/resources" className="text-gray-400 hover:text-primary-400 transition-colors duration-200 flex items-center">
                    <ArrowRightIcon className="h-4 w-4 mr-2" />
                    Developer Resources
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Resources & Support */}
            <div>
              <h3 className="text-xl font-semibold mb-6 text-white">Resources</h3>
              <ul className="space-y-3">                <li>
                  <a href="/documentation" className="text-gray-400 hover:text-primary-400 transition-colors duration-200 flex items-center">
                    <ArrowRightIcon className="h-4 w-4 mr-2" />
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="/tutorials" className="text-gray-400 hover:text-primary-400 transition-colors duration-200 flex items-center">
                    <ArrowRightIcon className="h-4 w-4 mr-2" />
                    Tutorials
                  </a>
                </li>
                <li>
                  <a href="/status" className="text-gray-400 hover:text-primary-400 transition-colors duration-200 flex items-center">
                    <ArrowRightIcon className="h-4 w-4 mr-2" />
                    API Status
                  </a>
                </li>
                <li>
                  <a href="/support" className="text-gray-400 hover:text-primary-400 transition-colors duration-200 flex items-center">
                    <ArrowRightIcon className="h-4 w-4 mr-2" />
                    Support Center
                  </a>
                </li>
                <li>                  <a href="/contact" className="text-gray-400 hover:text-primary-400 transition-colors duration-200 flex items-center">
                    <ArrowRightIcon className="h-4 w-4 mr-2" />
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Footer Bottom */}
        <div className="border-t border-gray-800">
          <div className="container mx-auto px-4 py-6">
            <div className="md:flex md:items-center md:justify-between">
              <div className="text-sm text-gray-400">
                &copy; {new Date().getFullYear()} RADHA API. All rights reserved.
              </div>
              <div className="mt-4 md:mt-0 flex flex-wrap gap-4 md:gap-6">
                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Privacy Policy</a>
                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Terms of Service</a>
                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Cookie Policy</a>
                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Security</a>
              </div>
            </div>
          </div>
        </div>        {/* Theme Customization & Back to top buttons */}
        <div className="fixed bottom-6 right-6 z-40 flex flex-col space-y-3">
          {/* Theme color picker toggle */}
          <button 
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            aria-label="Customize theme colors"
            title="Customize theme colors"
          >
            <SparklesIcon className="h-6 w-6" />
          </button>
          
          {/* Back to top button */}
          <button 
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
            className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            aria-label="Back to top"
            title="Scroll back to top"
          >
            <ArrowUpIcon className="h-6 w-6" />
          </button>
          
          {/* Color picker panel */}
          <div className={`fixed bottom-20 right-6 transform transition-all duration-300 ${showColorPicker ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 border border-gray-100 dark:border-gray-700">
              <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">Customize Theme</h4>
              
              <div className="space-y-3">
                <div className="flex flex-col">
                  <label className="text-xs text-gray-500 dark:text-gray-400 mb-1">Primary Color</label>
                  <div className="grid grid-cols-5 gap-2">
                    {['#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f97316'].map(color => (
                      <button
                        key={color}
                        onClick={() => setThemeColor(color, document.documentElement.style.getPropertyValue('--color-secondary-500'))}
                        className="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-600"
                        style={{ backgroundColor: color }}
                        aria-label={`Set primary color to ${color}`}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <label className="text-xs text-gray-500 dark:text-gray-400 mb-1">Secondary Color</label>
                  <div className="grid grid-cols-5 gap-2">
                    {['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#6366f1'].map(color => (
                      <button
                        key={color}
                        onClick={() => setThemeColor(document.documentElement.style.getPropertyValue('--color-primary-500'), color)}
                        className="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-600"
                        style={{ backgroundColor: color }}
                        aria-label={`Set secondary color to ${color}`}
                      />
                    ))}
                  </div>
                </div>
                
                <button 
                  onClick={() => {
                    document.documentElement.style.removeProperty('--color-primary-500');
                    document.documentElement.style.removeProperty('--color-secondary-500');
                    setShowColorPicker(false);
                  }}
                  className="w-full text-xs py-1 px-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Reset to Default
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Navigation link component for the header
const NavLink = ({ href, children }) => (
  <a 
    href={href} 
    className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 font-medium transition-colors duration-200"
  >
    {children}
  </a>
);

// Add the ThemeToggle component here to avoid import issues
const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(darkModeMediaQuery.matches);
    
    darkModeMediaQuery.addEventListener('change', (e) => {
      setIsDark(e.matches);
    });
    
    return () => {
      darkModeMediaQuery.removeEventListener('change', () => {});
    };
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
    localStorage.theme = isDark ? 'light' : 'dark';
  };

  return (
    <button
      onClick={toggleTheme}
      className="rounded-full p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {isDark ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  );
};

export default Home;
