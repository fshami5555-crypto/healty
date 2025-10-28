import React, { useState, useRef, useEffect } from 'react';
// Fix: Corrected import path for types
import type { ChatMessage, View } from '../types';
import Spinner from './Spinner';
import { PaperAirplaneIcon, UserIcon, SparklesIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';

interface ChatProps {
  conversation: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  hasDietPlan: boolean;
  onNavigate: (view: View) => void;
}

const Chat: React.FC<ChatProps> = ({ conversation, onSendMessage, isLoading, hasDietPlan, onNavigate }) => {
  const [input, setInput] = useState('');
  const { t } = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [conversation]);

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
  }

  const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isUser = message.sender === 'user';
    return (
      <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'} animate-subtleFadeIn`}>
        {!isUser && (
            <div className="w-8 h-8 rounded-full bg-accent dark:bg-dark-accent flex-shrink-0 flex items-center justify-center">
                <SparklesIcon className="w-5 h-5 text-primary dark:text-dark-surface" />
            </div>
        )}
        <div className={`max-w-md lg:max-w-2xl px-4 py-3 rounded-2xl ${isUser ? 'bg-primary dark:bg-dark-primary text-background dark:text-dark-background rounded-br-none' : 'bg-white dark:bg-dark-surface text-text-dark dark:text-dark-text rounded-bl-none'}`}>
          <p className="whitespace-pre-wrap">{message.text}</p>
        </div>
        {isUser && (
            <div className="w-8 h-8 rounded-full bg-secondary dark:bg-dark-border flex-shrink-0 flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-white" />
            </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-150px)] max-w-4xl mx-auto bg-neutral-light/50 dark:bg-dark-surface/50 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-neutral-light dark:border-dark-border">
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {conversation.map((msg, index) => <ChatBubble key={index} message={msg} />)}
        {isLoading && (
            <div className="flex justify-start">
                 <div className="w-8 h-8 rounded-full bg-accent dark:bg-dark-accent flex-shrink-0 flex items-center justify-center">
                    <SparklesIcon className="w-5 h-5 text-primary dark:text-dark-surface" />
                </div>
                <div className="ml-3 px-4 py-3 rounded-2xl bg-white dark:bg-dark-surface">
                    <Spinner />
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white/80 dark:bg-dark-surface/80 border-t border-neutral-light dark:border-dark-border">
        {!hasDietPlan && (
            <div className="text-center mb-2">
                <button
                onClick={() => onNavigate('questionnaire')}
                className="text-sm text-primary dark:text-dark-primary hover:underline"
                >
                {t.fillFormInstead}
                </button>
            </div>
        )}
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t.chatPlaceholder}
            className="w-full p-3 ltr:pr-12 rtl:pl-12 border border-gray-300 dark:border-dark-border dark:bg-dark-surface dark:text-dark-text rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary resize-none"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute top-1/2 -translate-y-1/2 ltr:right-3 rtl:left-3 p-2 rounded-full bg-primary dark:bg-dark-primary text-white dark:text-dark-background hover:bg-opacity-90 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            aria-label="Send message"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
