"use client"
import React, { useState, useEffect, useRef } from 'react';
import 'aos/dist/aos.css';
import AOS from 'aos';

// TypeScript interface for testimonial data
interface Testimonial {
    rating: number;
    quote: string;
    author: {
        initials: string;
        name: string;
        role: string;
        company: string;
    };
}

// TypeScript interface for pricing plan data
interface PricingPlan {
    name: string;
    price: string;
    period?: string;
    description: string;
    features: string[];
    popular?: boolean;
    detailedFeatures: string[];
    ctaText: string;
}

// TypeScript interface for FAQ item data
interface FaqItem {
    question: string;
    answer: string;
}

const AIBuilderLandingPage: React.FC = () => {
    // State for mobile menu
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // State for testimonial carousel
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    // State for FAQ accordion
    const [openFaqItem, setOpenFaqItem] = useState<number | null>(null);

    // State for dark mode
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Ref for back to top button
    const backToTopBtnRef = useRef<HTMLButtonElement>(null);

    // Testimonials data
    const testimonials: Testimonial[] = [
        {
            rating: 5,
            quote: "AI Builder has revolutionized how we handle customer inquiries. We built an AI agent that processes and categorizes customer emails, automatically routing them to the right department. What used to take hours now happens instantly.",
            author: {
                initials: "SL",
                name: "Sarah Lee",
                role: "Customer Success Manager",
                company: "TechCorp"
            }
        },
        {
            rating: 5,
            quote: "I was skeptical about no-code AI solutions, but AI Builder exceeded my expectations. We created a data analysis agent that automatically processes our weekly reports and sends insights to our team. The ROI has been incredible.",
            author: {
                initials: "MJ",
                name: "Marcus Johnson",
                role: "Data Analyst",
                company: "DataFlow"
            }
        },
        {
            rating: 5,
            quote: "AI Builder has saved our marketing team countless hours. We set up an agent to generate social media content ideas based on trending topics in our industry. What used to take days of brainstorming now happens at the click of a button.",
            author: {
                initials: "RN",
                name: "Rachel Nguyen",
                role: "Marketing Director",
                company: "NexGen"
            }
        }
    ];

    // Pricing plans data
    const pricingPlans: PricingPlan[] = [
        {
            name: "Starter",
            price: "$29",
            period: "/month",
            description: "Perfect for individuals and small teams getting started with AI automation.",
            features: [
                "Up to 3 AI agents",
                "1,000 executions/month",
                "Basic templates"
            ],
            detailedFeatures: [
                "Up to 3 AI agents",
                "1,000 executions/month",
                "Basic templates",
                "Email support",
                "Basic analytics"
            ],
            ctaText: "Get Started"
        },
        {
            name: "Pro",
            price: "$99",
            period: "/month",
            description: "Ideal for growing teams with more complex automation needs.",
            features: [
                "Up to 10 AI agents",
                "5,000 executions/month",
                "All templates"
            ],
            popular: true,
            detailedFeatures: [
                "Up to 10 AI agents",
                "5,000 executions/month",
                "All templates",
                "Priority support",
                "Advanced analytics"
            ],
            ctaText: "Get Started"
        },
        {
            name: "Enterprise",
            price: "Custom",
            description: "For organizations with advanced requirements and large-scale needs.",
            features: [
                "Unlimited AI agents",
                "Unlimited executions",
                "Custom integrations"
            ],
            detailedFeatures: [
                "Unlimited AI agents",
                "Unlimited executions",
                "Custom integrations",
                "Dedicated account manager",
                "SLA guarantees"
            ],
            ctaText: "Contact Sales"
        }
    ];

    // FAQ data
    const faqItems: FaqItem[] = [
        {
            question: "Do I need coding experience to use AI Builder?",
            answer: "No, AI Builder is designed for users with no coding experience. Our drag-and-drop interface makes it easy to create powerful AI agents without writing a single line of code. If you do have coding skills, you can use our advanced features to extend functionality."
        },
        {
            question: "What kinds of AI agents can I build?",
            answer: "The possibilities are nearly endless. Our users build AI agents for customer service, data analysis, content generation, social media management, lead qualification, and much more. Our template library provides starting points for common use cases."
        },
        {
            question: "How secure is my data on AI Builder?",
            answer: "Security is our top priority. We use industry-standard encryption for data in transit and at rest. We're SOC 2 compliant and offer enterprise-grade security features like role-based access control, audit logs, and data retention policies. We never use your data to train our models."
        },
        {
            question: "Can I integrate AI Builder with my existing tools?",
            answer: "Yes, we offer over 100 pre-built integrations with popular tools and services like Slack, Google Workspace, Salesforce, Zapier, and more. If you need a custom integration, our Enterprise plan includes custom integration development."
        },
        {
            question: "Do you offer a free trial?",
            answer: "Yes, we offer a 14-day free trial of our Pro plan, no credit card required. This gives you full access to our platform so you can build and test your AI agents before committing. We also offer a demo for enterprise clients with a personalized walkthrough."
        }
    ];

    // Handle scroll to top
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Handle smooth scrolling for anchor links
    const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
        e.preventDefault();
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });

            // Close mobile menu if open
            if (isMobileMenuOpen) {
                setIsMobileMenuOpen(false);
            }
        }
    };

    // Initialize AOS and handle dark mode detection
    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });

        // Dark mode detection
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        }

        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleDarkModeChange = (e: MediaQueryListEvent) => {
            if (e.matches) {
                setIsDarkMode(true);
                document.documentElement.classList.add('dark');
            } else {
                setIsDarkMode(false);
                document.documentElement.classList.remove('dark');
            }
        };

        darkModeMediaQuery.addEventListener('change', handleDarkModeChange);

        // Handle back to top button visibility
        const handleScroll = () => {
            if (window.pageYOffset > 300) {
                backToTopBtnRef.current?.classList.remove('scale-0');
                backToTopBtnRef.current?.classList.add('scale-100');
            } else {
                backToTopBtnRef.current?.classList.remove('scale-100');
                backToTopBtnRef.current?.classList.add('scale-0');
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Cleanup event listeners
        return () => {
            darkModeMediaQuery.removeEventListener('change', handleDarkModeChange);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="bg-white dark:bg-dark-bg text-gray-900 dark:text-gray-100 min-h-screen">
            {/* Navigation */}
            <nav className="fixed w-full z-50 backdrop-blur-md bg-white/80 dark:bg-foreground/80 shadow-md dark:shadow-neon">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <a href="#" className="flex items-center">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mr-2">
                            <span className="text-white font-bold text-xl">OF</span>
                        </div>
                        <span className="text-xl font-bold dark:text-white">OmniFlow</span>
                    </a>
                    <div className="hidden md:flex space-x-8">
                        <a href="#features" className="font-medium hover:text-primary dark:hover:text-neonblue transition-colors duration-300" onClick={(e) => handleAnchorClick(e, '#features')}>Features</a>
                        <a href="#how-it-works" className="font-medium hover:text-primary dark:hover:text-neonblue transition-colors duration-300" onClick={(e) => handleAnchorClick(e, '#how-it-works')}>How It Works</a>
                        <a href="#testimonials" className="font-medium hover:text-primary dark:hover:text-neonblue transition-colors duration-300" onClick={(e) => handleAnchorClick(e, '#testimonials')}>Testimonials</a>
                        <a href="#pricing" className="font-medium hover:text-primary dark:hover:text-neonblue transition-colors duration-300" onClick={(e) => handleAnchorClick(e, '#pricing')}>Pricing</a>
                        <a href="#faq" className="font-medium hover:text-primary dark:hover:text-neonblue transition-colors duration-300" onClick={(e) => handleAnchorClick(e, '#faq')}>FAQ</a>
                    </div>
                    <div className="flex items-center space-x-4">
                        <a href="#waitlist" className="hidden sm:block px-5 py-2 bg-primary hover:bg-primary-dark text-white rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg" onClick={(e) => handleAnchorClick(e, '#waitlist')}>
                            Join Waitlist
                        </a>
                        <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
                {/* Mobile menu */}
                <div className={`md:hidden px-4 py-2 bg-white dark:bg-foreground shadow-lg ${ isMobileMenuOpen ? 'block' : 'hidden' }`}>
                    <a href="#features" className="block py-2 font-medium hover:text-primary dark:hover:text-neonblue" onClick={(e) => handleAnchorClick(e, '#features')}>Features</a>
                    <a href="#how-it-works" className="block py-2 font-medium hover:text-primary dark:hover:text-neonblue" onClick={(e) => handleAnchorClick(e, '#how-it-works')}>How It Works</a>
                    <a href="#testimonials" className="block py-2 font-medium hover:text-primary dark:hover:text-neonblue" onClick={(e) => handleAnchorClick(e, '#testimonials')}>Testimonials</a>
                    <a href="#pricing" className="block py-2 font-medium hover:text-primary dark:hover:text-neonblue" onClick={(e) => handleAnchorClick(e, '#pricing')}>Pricing</a>
                    <a href="#faq" className="block py-2 font-medium hover:text-primary dark:hover:text-neonblue" onClick={(e) => handleAnchorClick(e, '#faq')}>FAQ</a>
                    <a href="#waitlist" className="block py-2 font-medium hover:text-primary dark:hover:text-neonblue" onClick={(e) => handleAnchorClick(e, '#waitlist')}>Join Waitlist</a>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-28 pb-20 md:pt-36 md:pb-32 hero-gradient">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"></div>
                    {/* Animated grid background */}
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#5D5CDE 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                </div>
                <div className="container mx-auto px-4 relative">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="w-full lg:w-1/2" data-aos="fade-right" data-aos-duration="1000">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900">
                                Build AI Agents <br />Without Code
                            </h1>
                            <p className="text-lg md:text-xl mb-8 text-gray-700 dark:text-gray-300 max-w-xl">
                                Create powerful, autonomous AI workflows in minutes, not months.
                                Our intuitive platform makes automation accessible to everyone.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4" data-aos="fade-up" data-aos-delay="300">
                                <a href="/sandbox" className="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-full text-lg font-medium transition-all duration-500 transform hover:scale-105 hover:shadow-lg animate-pulse-slow flex items-center justify-center">
                                    Get Started for Free
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </a>
                                <a href="#how-it-works" className="px-8 py-3 bg-transparent border border-primary text-primary dark:text-white hover:bg-primary/10 rounded-full text-lg font-medium transition-all duration-300 flex items-center justify-center" onClick={(e) => handleAnchorClick(e, '#how-it-works')}>
                                    How It Works
                                </a>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2 flex justify-center" data-aos="fade-left" data-aos-duration="1000">
                            {/* AI Bot Animation */}
                            <div className="relative w-64 h-64 md:w-80 md:h-80 animate-float">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary to-neonblue rounded-full opacity-20 blur-xl animate-pulse-slow"></div>
                                <div className="absolute inset-8 bg-white dark:bg-foreground rounded-full shadow-lg"></div>
                                <div className="absolute inset-10 rounded-full overflow-hidden bg-foreground flex items-center justify-center bg-foreground">
                                    {/* Robot Face */}
                                    <div className="relative w-full h-full">
                                        {/* Eyes */}
                                        <div className="absolute w-6 h-6 bg-neonblue rounded-full left-1/3 top-1/3 transform -translate-x-1/2 -translate-y-1/2 ai-bot-eye"></div>
                                        <div className="absolute w-6 h-6 bg-neonblue rounded-full right-1/3 top-1/3 transform translate-x-1/2 -translate-y-1/2 ai-bot-eye"></div>
                                        {/* Mouth */}
                                        <div className="absolute w-16 h-2 bg-neonblue rounded-full bottom-1/3 left-1/2 transform -translate-x-1/2"></div>
                                        {/* Circuit lines */}
                                        <div className="absolute w-full h-full">
                                            <div className="absolute w-1 h-12 bg-primary/40 top-1/2 left-1/4"></div>
                                            <div className="absolute w-12 h-1 bg-primary/40 top-1/4 right-1/4"></div>
                                            <div className="absolute w-1 h-16 bg-primary/40 bottom-1/4 right-1/3"></div>
                                            <div className="absolute w-16 h-1 bg-primary/40 bottom-1/3 left-1/3"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Clients/Partners Section */}
            <section className="py-12 bg-gray-50 dark:bg-foreground/50">
                <div className="container mx-auto px-4">
                    <p className="text-center text-gray-500 dark:text-gray-400 mb-8">Trusted by innovative teams worldwide</p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
                        <div className="w-24 h-12 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity">
                            <div className="text-xl font-bold text-gray-700 dark:text-gray-300">TechCorp</div>
                        </div>
                        <div className="w-24 h-12 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity">
                            <div className="text-xl font-bold text-gray-700 dark:text-gray-300">AILabs</div>
                        </div>
                        <div className="w-24 h-12 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity">
                            <div className="text-xl font-bold text-gray-700 dark:text-gray-300">FutureX</div>
                        </div>
                        <div className="w-24 h-12 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity">
                            <div className="text-xl font-bold text-gray-700 dark:text-gray-300">NexGen</div>
                        </div>
                        <div className="w-24 h-12 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity">
                            <div className="text-xl font-bold text-gray-700 dark:text-gray-300">DataFlow</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-white dark:bg-dark-bg">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white" data-aos="fade-up">Powerful Features</h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
                            Everything you need to build sophisticated AI agents without writing a single line of code.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Feature tiles */}
                        <div className="bg-gray-50 dark:bg-foreground/50 rounded-xl p-6 shadow-md hover:shadow-xl dark:shadow-neon transition-all duration-300 transform hover:-translate-y-1" data-aos="fade-up" data-aos-delay="200">
                            <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2 dark:text-white">Drag-and-Drop AI Workflow</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Create complex AI workflows with our intuitive drag-and-drop interface. Connect nodes, define logic, and watch your AI agent come to life.
                            </p>
                        </div>

                        <div className="bg-gray-50 dark:bg-foreground/50 rounded-xl p-6 shadow-md hover:shadow-xl dark:shadow-neon transition-all duration-300 transform hover:-translate-y-1" data-aos="fade-up" data-aos-delay="300">
                            <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2 dark:text-white">100+ Ready Integrations</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Connect your AI agents to your favorite tools and platforms. From Slack to Salesforce, we've got you covered with seamless integrations.
                            </p>
                        </div>

                        <div className="bg-gray-50 dark:bg-foreground/50 rounded-xl p-6 shadow-md hover:shadow-xl dark:shadow-neon transition-all duration-300 transform hover:-translate-y-1" data-aos="fade-up" data-aos-delay="400">
                            <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2 dark:text-white">AI Templates Library</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Get started quickly with our library of pre-built templates. Customer service, data analysis, content generation, and more.
                            </p>
                        </div>

                        <div className="bg-gray-50 dark:bg-foreground/50 rounded-xl p-6 shadow-md hover:shadow-xl dark:shadow-neon transition-all duration-300 transform hover:-translate-y-1" data-aos="fade-up" data-aos-delay="500">
                            <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2 dark:text-white">Real-time Testing</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Test your AI agents in real-time without deploying. Identify issues early and iterate quickly to perfect your automation.
                            </p>
                        </div>

                        <div className="bg-gray-50 dark:bg-foreground/50 rounded-xl p-6 shadow-md hover:shadow-xl dark:shadow-neon transition-all duration-300 transform hover:-translate-y-1" data-aos="fade-up" data-aos-delay="600">
                            <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2 dark:text-white">Enterprise-grade Security</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Your data stays secure with end-to-end encryption, role-based access controls, and compliance with industry standards.
                            </p>
                        </div>

                        <div className="bg-gray-50 dark:bg-foreground/50 rounded-xl p-6 shadow-md hover:shadow-xl dark:shadow-neon transition-all duration-300 transform hover:-translate-y-1" data-aos="fade-up" data-aos-delay="700">
                            <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2 dark:text-white">Detailed Analytics</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Monitor your AI agents' performance with comprehensive analytics. Gain insights to optimize and improve over time.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-20 bg-gray-50 dark:bg-foreground/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white" data-aos="fade-up">How It Works</h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
                            Building sophisticated AI agents has never been easier. Follow these simple steps to get started.
                        </p>
                    </div>

                    {/* Step 1 */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-10 mb-20">
                        <div className="w-full md:w-1/2 order-2 md:order-1" data-aos="fade-right">
                            <span className="inline-block text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mb-2">Step 1</span>
                            <h3 className="text-2xl font-bold mb-4 dark:text-white">Choose your template or start from scratch</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Begin your journey by selecting from our library of pre-built AI agent templates, or start with a blank canvas and build your own from scratch.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-1 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-700 dark:text-gray-300">Industry-specific templates</span>
                                </li>
                                <li className="flex items-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-1 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-700 dark:text-gray-300">Customizable starting points</span>
                                </li>
                                <li className="flex items-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-1 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-700 dark:text-gray-300">Blank canvas option for full flexibility</span>
                                </li>
                            </ul>
                        </div>
                        <div className="w-full md:w-1/2 order-1 md:order-2" data-aos="fade-left">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary to-neonblue rounded-lg opacity-20 blur-xl"></div>
                                <div className="relative bg-white dark:bg-foreground p-4 rounded-lg shadow-xl">
                                    <div className="bg-gray-100 dark:bg-dark-bg rounded-lg p-6 h-64 flex flex-col">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="font-semibold dark:text-white">Templates</h4>
                                            <div className="flex space-x-2">
                                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mt-4">
                                            <div className="bg-white dark:bg-foreground rounded-md p-3 shadow-sm hover:shadow-md cursor-pointer transform hover:scale-105 transition-all">
                                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-md flex items-center justify-center mb-2">
                                                    <span className="text-blue-600 dark:text-blue-300 text-sm">CS</span>
                                                </div>
                                                <h5 className="text-sm font-medium dark:text-white">Customer Service</h5>
                                            </div>
                                            <div className="bg-white dark:bg-foreground rounded-md p-3 shadow-sm hover:shadow-md cursor-pointer transform hover:scale-105 transition-all">
                                                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-md flex items-center justify-center mb-2">
                                                    <span className="text-green-600 dark:text-green-300 text-sm">DA</span>
                                                </div>
                                                <h5 className="text-sm font-medium dark:text-white">Data Analysis</h5>
                                            </div>
                                            <div className="bg-white dark:bg-foreground rounded-md p-3 shadow-sm hover:shadow-md cursor-pointer transform hover:scale-105 transition-all">
                                                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-md flex items-center justify-center mb-2">
                                                    <span className="text-purple-600 dark:text-purple-300 text-sm">CG</span>
                                                </div>
                                                <h5 className="text-sm font-medium dark:text-white">Content Generator</h5>
                                            </div>
                                            <div className="bg-white dark:bg-foreground rounded-md p-3 shadow-sm hover:shadow-md cursor-pointer transform hover:scale-105 transition-all">
                                                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center mb-2">
                                                    <span className="text-gray-600 dark:text-gray-300 text-sm">+</span>
                                                </div>
                                                <h5 className="text-sm font-medium dark:text-white">Blank Canvas</h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-10 mb-20">
                        <div className="w-full md:w-1/2 order-2" data-aos="fade-left">
                            <span className="inline-block text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mb-2">Step 2</span>
                            <h3 className="text-2xl font-bold mb-4 dark:text-white">Design your workflow with drag and drop</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Use our intuitive drag-and-drop interface to create your AI workflow. Connect triggers, actions, and conditions to define how your agent behaves.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-1 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-700 dark:text-gray-300">Visual flow builder</span>
                                </li>
                                <li className="flex items-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-1 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-700 dark:text-gray-300">Pre-built components</span>
                                </li>
                                <li className="flex items-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-1 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-700 dark:text-gray-300">Smart connectors and logic</span>
                                </li>
                            </ul>
                        </div>
                        <div className="w-full md:w-1/2 order-1" data-aos="fade-right">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary to-neonblue rounded-lg opacity-20 blur-xl"></div>
                                <div className="relative bg-white dark:bg-foreground p-4 rounded-lg shadow-xl">
                                    <div className="bg-gray-100 dark:bg-dark-bg rounded-lg p-6 h-64">
                                        {/* Workflow Builder UI */}
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="font-semibold dark:text-white">Workflow Builder</h4>
                                            <div className="flex space-x-2">
                                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                            </div>
                                        </div>
                                        <div className="relative h-44">
                                            {/* Node 1 */}
                                            <div className="absolute top-2 left-2 w-20 h-12 bg-blue-500 rounded-md flex items-center justify-center text-white text-xs shadow-md">
                                                Trigger
                                            </div>
                                            {/* Connection Line */}
                                            <svg className="absolute top-8 left-22" width="40" height="2">
                                                <line x1="0" y1="0" x2="40" y2="0" stroke="#5D5CDE" strokeWidth="2" />
                                            </svg>
                                            {/* Node 2 */}
                                            <div className="absolute top-2 left-28 w-20 h-12 bg-green-500 rounded-md flex items-center justify-center text-white text-xs shadow-md">
                                                Process
                                            </div>
                                            {/* Connection Line */}
                                            <svg className="absolute top-8 left-48" width="40" height="40">
                                                <path d="M 0 0 C 20 0 20 40 40 40" stroke="#5D5CDE" strokeWidth="2" fill="none" />
                                            </svg>
                                            {/* Node 3 */}
                                            <div className="absolute top-28 left-54 w-20 h-12 bg-purple-500 rounded-md flex items-center justify-center text-white text-xs shadow-md">
                                                Decision
                                            </div>
                                            {/* Connection Lines */}
                                            <svg className="absolute top-34 left-64" width="2" height="20">
                                                <line x1="0" y1="0" x2="0" y2="20" stroke="#5D5CDE" strokeWidth="2" />
                                            </svg>
                                            {/* Node 4 */}
                                            <div className="absolute top-50 left-54 w-20 h-12 bg-yellow-500 rounded-md flex items-center justify-center text-white text-xs shadow-md">
                                                Action
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                        <div className="w-full md:w-1/2 order-2 md:order-1" data-aos="fade-right">
                            <span className="inline-block text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mb-2">Step 3</span>
                            <h3 className="text-2xl font-bold mb-4 dark:text-white">Test, deploy, and monitor your AI agent</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Test your AI agent in real-time, make adjustments as needed, and deploy it with a single click. Monitor performance and scale as your needs grow.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-1 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-700 dark:text-gray-300">One-click deployment</span>
                                </li>
                                <li className="flex items-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-1 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-700 dark:text-gray-300">Real-time monitoring</span>
                                </li>
                                <li className="flex items-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-1 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-700 dark:text-gray-300">Seamless iteration and improvement</span>
                                </li>
                            </ul>
                        </div>
                        <div className="w-full md:w-1/2 order-1 md:order-2" data-aos="fade-left">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary to-neonblue rounded-lg opacity-20 blur-xl"></div>
                                <div className="relative bg-white dark:bg-foreground p-4 rounded-lg shadow-xl">
                                    <div className="bg-gray-100 dark:bg-dark-bg rounded-lg p-6 h-64">
                                        {/* Dashboard UI */}
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="font-semibold dark:text-white">Dashboard</h4>
                                            <div className="flex space-x-2">
                                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="bg-white dark:bg-foreground p-3 rounded-md shadow-sm">
                                                <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Active Agents</h5>
                                                <p className="text-lg font-bold dark:text-white">5</p>
                                            </div>
                                            <div className="bg-white dark:bg-foreground p-3 rounded-md shadow-sm">
                                                <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Executions Today</h5>
                                                <p className="text-lg font-bold dark:text-white">1,243</p>
                                            </div>
                                        </div>
                                        <div className="bg-white dark:bg-foreground p-3 rounded-md shadow-sm h-24">
                                            <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Performance</h5>
                                            <div className="h-16 flex items-end">
                                                <div className="w-1/7 h-4 bg-primary rounded-sm mx-1"></div>
                                                <div className="w-1/7 h-8 bg-primary rounded-sm mx-1"></div>
                                                <div className="w-1/7 h-12 bg-primary rounded-sm mx-1"></div>
                                                <div className="w-1/7 h-6 bg-primary rounded-sm mx-1"></div>
                                                <div className="w-1/7 h-10 bg-primary rounded-sm mx-1"></div>
                                                <div className="w-1/7 h-14 bg-primary rounded-sm mx-1"></div>
                                                <div className="w-1/7 h-8 bg-primary rounded-sm mx-1"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-20 bg-white dark:bg-dark-bg">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white" data-aos="fade-up">What Our Users Say</h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
                            Don't just take our word for it. See how AI Builder is transforming businesses across industries.
                        </p>
                    </div>

                    {/* Testimonial Carousel */}
                    <div className="relative mx-auto max-w-4xl" data-aos="fade-up" data-aos-delay="200">
                        <div className="testimonial-container overflow-hidden">
                            <div
                                className="testimonial-track flex transition-transform duration-500"
                                style={{ transform: `translateX(-${ currentTestimonial * 100 }%)` }}
                            >
                                {testimonials.map((testimonial, index) => (
                                    <div key={index} className="testimonial-item w-full flex-shrink-0">
                                        <div className="bg-gray-50 dark:bg-foreground/50 rounded-xl p-8 shadow-lg dark:shadow-neon">
                                            <div className="flex items-center mb-4">
                                                <div className="flex text-yellow-400">
                                                    {[...Array(testimonial.rating)].map((_, i) => (
                                                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    ))}
                                                </div>
                                            </div>
                                            <blockquote className="text-gray-600 dark:text-gray-300 mb-6 italic">
                                                "{testimonial.quote}"
                                            </blockquote>
                                            <div className="flex items-center">
                                                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                                                    <span className="text-primary font-bold">{testimonial.author.initials}</span>
                                                </div>
                                                <div>
                                                    <h5 className="font-semibold dark:text-white">{testimonial.author.name}</h5>
                                                    <p className="text-sm text-gray-500">{testimonial.author.role}, {testimonial.author.company}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Navigation arrows */}
                        <button
                            className="absolute top-1/2 -left-4 md:-left-8 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-foreground shadow-md flex items-center justify-center focus:outline-none"
                            onClick={() => setCurrentTestimonial(currentTestimonial > 0 ? currentTestimonial - 1 : testimonials.length - 1)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            className="absolute top-1/2 -right-4 md:-right-8 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-foreground shadow-md flex items-center justify-center focus:outline-none"
                            onClick={() => setCurrentTestimonial(currentTestimonial < testimonials.length - 1 ? currentTestimonial + 1 : 0)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        {/* Dots */}
                        <div className="flex justify-center mt-8 space-x-2">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    className={`w-3 h-3 rounded-full transition-colors duration-300 ${ currentTestimonial === index ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600' }`}
                                    onClick={() => setCurrentTestimonial(index)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-20 bg-gray-50 dark:bg-foreground/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white" data-aos="fade-up">Simple, Transparent Pricing</h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
                            Choose the plan that works best for your needs. All plans include core features with no hidden fees.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {pricingPlans.map((plan, index) => (
                            <div key={index} className="card-flip h-96" data-aos="fade-up" data-aos-delay={200 + index * 100}>
                                <div className="card-inner h-full">
                                    <div className={`card-front ${ plan.popular ? 'bg-primary dark:bg-primary' : 'bg-white dark:bg-foreground' } rounded-xl shadow-lg dark:shadow-neon p-8 flex flex-col justify-between h-full relative overflow-hidden`}>
                                        {plan.popular && (
                                            <div className="absolute top-0 right-0 bg-neonblue text-white text-xs px-4 py-1 transform rotate-45 translate-x-8 translate-y-4">
                                                Popular
                                            </div>
                                        )}
                                        <div>
                                            <h3 className={`text-xl font-bold mb-2 ${ plan.popular ? 'text-white' : 'dark:text-white' }`}>{plan.name}</h3>
                                            <div className="flex items-end mb-4">
                                                <span className={`text-4xl font-bold ${ plan.popular ? 'text-white' : 'dark:text-white' }`}>{plan.price}</span>
                                                {plan.period && <span className={`${ plan.popular ? 'text-white/70' : 'text-gray-500 dark:text-gray-400' } ml-1`}>{plan.period}</span>}
                                            </div>
                                            <p className={`${ plan.popular ? 'text-white/80' : 'text-gray-600 dark:text-gray-400' } mb-6`}>{plan.description}</p>
                                            <ul className="space-y-3 mb-8">
                                                {plan.features.map((feature, i) => (
                                                    <li key={i} className="flex items-start">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${ plan.popular ? 'text-white' : 'text-primary' } mt-1 mr-2`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        <span className={plan.popular ? 'text-white' : 'text-gray-700 dark:text-gray-300'}>{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="text-center">
                                            <p className={`text-sm ${ plan.popular ? 'text-white/70' : 'text-gray-500 dark:text-gray-400' } italic mb-2`}>Hover to see more details</p>
                                        </div>
                                    </div>
                                    <div className="card-back bg-white dark:bg-foreground rounded-xl shadow-lg dark:shadow-neon p-8 flex flex-col justify-between h-full">
                                        <div>
                                            <h3 className="text-xl font-bold mb-6 dark:text-white">{plan.name} Plan Includes:</h3>
                                            <ul className="space-y-3 mb-8">
                                                {plan.detailedFeatures.map((feature, i) => (
                                                    <li key={i} className="flex items-start">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-1 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <a href="#waitlist" className="block text-center px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-full transition-all duration-300 transform hover:scale-105" onClick={(e) => handleAnchorClick(e, '#waitlist')}>{plan.ctaText}</a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-20 bg-white dark:bg-dark-bg">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white" data-aos="fade-up">Frequently Asked Questions</h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
                            Find answers to the most common questions about AI Builder and our no-code platform.
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        {faqItems.map((item, index) => (
                            <div key={index} className="mb-6 bg-gray-50 dark:bg-foreground/50 rounded-xl overflow-hidden shadow-md dark:shadow-neon" data-aos="fade-up" data-aos-delay={200 + index * 100}>
                                <button
                                    className="flex justify-between items-center w-full px-6 py-4 text-left focus:outline-none"
                                    onClick={() => setOpenFaqItem(openFaqItem === index ? null : index)}
                                >
                                    <h3 className="text-lg font-semibold dark:text-white">{item.question}</h3>
                                    <svg className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-300 ${ openFaqItem === index ? 'rotate-180' : '' }`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                <div className={`accordion-content px-6 pb-4 ${ openFaqItem === index ? 'open' : '' }`}>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {item.answer}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Waiting List Section */}
            <section id="waitlist" className="py-20 bg-gray-50 dark:bg-foreground/30">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto bg-white dark:bg-dark-bg rounded-2xl shadow-xl dark:shadow-neon overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-1/2 p-10 md:p-12" data-aos="fade-right">
                                <h2 className="text-3xl font-bold mb-4 dark:text-white">Join Our Waitlist</h2>
                                <p className="text-gray-600 dark:text-gray-400 mb-8">
                                    Be among the first to experience the future of AI agent building. Our beta is launching soon.
                                </p>
                                <form className="space-y-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                                        <input type="text" id="name" className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-primary dark:bg-foreground dark:text-white text-base" placeholder="John Doe" />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                                        <input type="email" id="email" className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-primary dark:bg-foreground dark:text-white text-base" placeholder="john@example.com" />
                                    </div>
                                    <div>
                                        <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company (Optional)</label>
                                        <input type="text" id="company" className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-primary dark:bg-foreground dark:text-white text-base" placeholder="ACME Inc." />
                                    </div>
                                    <div>
                                        <label htmlFor="use-case" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Primary Use Case</label>
                                        <select id="use-case" className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-primary dark:bg-foreground dark:text-white text-base">
                                            <option value="">Select an option</option>
                                            <option value="customer-service">Customer Service</option>
                                            <option value="data-analysis">Data Analysis</option>
                                            <option value="content-generation">Content Generation</option>
                                            <option value="process-automation">Process Automation</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <button type="button" className="w-full px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg text-lg font-medium transition-all duration-300 transform hover:scale-105 animate-glow">
                                        Secure Your Spot
                                    </button>
                                </form>
                            </div>
                            <div className="relative w-full md:w-1/2 bg-primary p-10 md:p-12 flex items-center justify-center overflow-hidden" data-aos="fade-left">
                                {/* Abstract background */}
                                <div className="absolute inset-0 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-neonblue opacity-50"></div>
                                    <div className="absolute top-0 left-0 w-full h-full">
                                        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                                            <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#grid)" />
                                            <defs>
                                                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
                                                </pattern>
                                            </defs>
                                        </svg>
                                    </div>
                                </div>
                                <div className="relative text-center text-white">
                                    <h3 className="text-2xl font-bold mb-6">Early Access Benefits</h3>
                                    <ul className="space-y-4 text-left">
                                        <li className="flex items-start">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>25% discount for life</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Exclusive beta features</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Direct access to our team</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Shape the product roadmap</span>
                                        </li>
                                    </ul>

                                    <div className="mt-8">
                                        <p className="text-white/80 mb-2">Users already on the waitlist</p>
                                        <div className="w-full h-4 bg-white/20 rounded-full overflow-hidden">
                                            <div className="h-full bg-white rounded-full progress-fill" style={{ width: '85%' }}></div>
                                        </div>
                                        <p className="text-white/80 mt-2 text-sm">5,287 of 6,000 spots filled</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <a href="#" className="flex items-center mb-4">
                                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mr-2">
                                    <span className="text-white font-bold text-xl">OF</span>
                                </div>
                                <span className="text-xl font-bold text-white">OmniFlow</span>
                            </a>
                            <p className="text-gray-400 mb-4">
                                Build powerful AI agents without code. Automate your workflows and save hours of manual work.
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox=" 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4">Product</h3>
                            <ul className="space-y-2">
                                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors" onClick={(e) => handleAnchorClick(e, '#features')}>Features</a></li>
                                <li><a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors" onClick={(e) => handleAnchorClick(e, '#how-it-works')}>How It Works</a></li>
                                <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors" onClick={(e) => handleAnchorClick(e, '#pricing')}>Pricing</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Roadmap</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Release Notes</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4">Resources</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Tutorials</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Community</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4">Company</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Press</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-800">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <p className="text-gray-400">&copy; 2025 AI Builder. All rights reserved.</p>
                            <div className="mt-4 md:mt-0">
                                <form className="flex flex-col sm:flex-row glass-effect rounded-lg p-1">
                                    <input type="email" placeholder="Enter your email" className="px-4 py-2 rounded-lg bg-transparent text-white placeholder-gray-400 focus:outline-none border-0 flex-grow mb-2 sm:mb-0 text-base" />
                                    <button type="button" className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg ml-0 sm:ml-2 transition-colors duration-300 text-base">
                                        Subscribe
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Back to top button */}
            <button
                ref={backToTopBtnRef}
                className="fixed bottom-8 right-8 w-12 h-12 bg-primary dark:bg-primary rounded-full flex items-center justify-center text-white shadow-lg transform transition-all duration-300 scale-0 hover:scale-110 z-50"
                onClick={scrollToTop}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
            </button>
        </div>
    );
};

export default AIBuilderLandingPage;