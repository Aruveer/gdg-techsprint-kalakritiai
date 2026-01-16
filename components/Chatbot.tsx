import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, Loader } from 'lucide-react';
import { getChatResponse } from '../services/geminiService';
import type { Message } from '../types';

const FloralIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" />
        <path d="M12 2V5" strokeLinecap="round"/>
        <path d="M12 19V22" strokeLinecap="round"/>
        <path d="M5 12H2" strokeLinecap="round"/>
        <path d="M22 12H19" strokeLinecap="round"/>
        <path d="M18.364 5.63604L16.2427 7.75736" strokeLinecap="round"/>
        <path d="M7.75732 16.2426L5.636 18.364" strokeLinecap="round"/>
        <path d="M18.364 18.364L16.2427 16.2426" strokeLinecap="round"/>
        <path d="M7.75732 7.75736L5.636 5.63604" strokeLinecap="round"/>
    </svg>
);

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'bot', text: "Hello! I'm Kriti AI. How can I help you today? Whether you're a customer looking to create or an artisan seeking advice, I'm here for you." }
    ]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const botResponseText = await getChatResponse(input);
            const botMessage: Message = { sender: 'bot', text: botResponseText };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error(error);
            const errorMessage: Message = { sender: 'bot', text: "I'm having a little trouble connecting right now. Please try again in a moment." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-5 right-5 z-[99]">
            {/* Chat Window */}
            <div className={`
                absolute bottom-[calc(100%+1rem)] right-0 w-80 sm:w-96
                bg-white rounded-2xl shadow-2xl border border-gray-200/80
                flex flex-col overflow-hidden
                transition-all duration-300 ease-in-out
                ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
            `}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-brand-bg border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-maroon text-white rounded-full flex items-center justify-center">
                            <Bot size={22} />
                        </div>
                        <div>
                            <h3 className="font-bold text-brand-text">Kriti AI Assistant</h3>
                            <p className="text-xs text-green-600 font-semibold flex items-center gap-1.5">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                Online
                            </p>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-brand-maroon">
                        <X size={20} />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 space-y-4 overflow-y-auto h-96">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'bot' && <div className="w-7 h-7 bg-brand-maroon text-white rounded-full flex items-center justify-center flex-shrink-0"><Bot size={16} /></div>}
                            <div className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm ${msg.sender === 'user' ? 'bg-brand-maroon text-white rounded-br-none' : 'bg-gray-100 text-brand-text rounded-bl-none'}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                     {isLoading && (
                        <div className="flex items-end gap-2 justify-start">
                             <div className="w-7 h-7 bg-brand-maroon text-white rounded-full flex items-center justify-center flex-shrink-0"><Bot size={16} /></div>
                             <div className="max-w-[80%] rounded-xl px-4 py-3 bg-gray-100 text-brand-text rounded-bl-none">
                                <Loader size={16} className="animate-spin" />
                             </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                
                {/* Input */}
                <form onSubmit={handleSendMessage} className="p-4 bg-brand-bg border-t border-gray-200">
                    <div className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me anything..."
                            className="w-full pl-4 pr-12 py-2.5 bg-white text-brand-text placeholder:text-gray-500 border border-gray-300 rounded-full focus:ring-2 focus:ring-brand-gold-light focus:border-brand-gold-light transition-colors"
                            aria-label="Chat input"
                        />
                        <button type="submit" disabled={isLoading} className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 bg-brand-maroon text-white rounded-full hover:bg-brand-maroon-light transition-colors disabled:bg-gray-400">
                            <Send size={18} />
                        </button>
                    </div>
                </form>
            </div>

            {/* FAB */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center gap-3 px-5 py-3 bg-brand-maroon text-white font-bold rounded-full shadow-lg hover:bg-brand-maroon-light transition-all duration-200 transform hover:scale-105"
                aria-label="Open AI Chat Assistant"
            >
                <FloralIcon />
                <span>Kriti AI</span>
            </button>
        </div>
    );
};

export default Chatbot;