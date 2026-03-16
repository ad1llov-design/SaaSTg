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
            className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-emerald-500/10 overflow-hidden"
          >
            {/* Декор */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />
            
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center relative">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner ring-1 ring-emerald-500/20">
                <Gift className="w-10 h-10 text-emerald-500" />
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-3">Начните бесплатно!</h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Зарегистрируйтесь сейчас и получите <b>7 дней премиум-доступа</b> для тестирования всех функций вашего бота.
              </p>

              <div className="space-y-4">
                <Link 
                  href="/register"
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
                >
                  <Sparkles className="w-5 h-5" />
                  Создать аккаунт (Неделя бесплатно)
                  <ArrowRight className="w-5 h-5" />
                </Link>
                
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                  Без привязки карты • Настройка за 2 минуты
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
