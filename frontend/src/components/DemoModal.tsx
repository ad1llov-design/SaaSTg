"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Gift, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DemoModal({ isOpen, onClose }: DemoModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-slate-900 border border-white/5 rounded-[2.5rem] p-10 md:p-14 shadow-2xl shadow-indigo-500/10 overflow-hidden"
          >
            {/* Декор */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px]" />
            
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 p-2 text-slate-500 hover:text-white transition-colors group"
            >
              <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
            </button>

            <div className="text-center relative">
              <div className="w-24 h-24 bg-indigo-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner ring-1 ring-white/10 group-hover:rotate-12 transition-all">
                <Gift className="w-12 h-12 text-indigo-500" />
              </div>
              
              <h2 className="text-4xl font-bold text-white mb-4 uppercase tracking-tighter">System <span className="text-indigo-500 italic font-premium lowercase tracking-tight">Initiation</span></h2>
              <p className="text-slate-400 mb-10 leading-relaxed font-bold text-sm uppercase tracking-widest opacity-70">
                Зарегистрируйтесь сейчас и получите <span className="text-white">7 дней доступа</span> для тестирования полного функционала.
              </p>

              <div className="space-y-6">
                <Link 
                  href="/register"
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold py-5 rounded-2xl transition-all shadow-2xl shadow-indigo-500/20 uppercase tracking-[0.2em] text-xs"
                >
                  <Sparkles className="w-4 h-4" />
                  Initialize 7-Day Access
                  <ArrowRight className="w-4 h-4" />
                </Link>
                
                <p className="text-[10px] text-slate-500 uppercase tracking-[0.4em] font-bold opacity-60">
                  No credit card required • Precision deployment
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
