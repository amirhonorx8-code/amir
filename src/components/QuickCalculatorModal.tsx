import React, { useState } from 'react';
import { X, Calculator as CalcIcon, Delete, RotateCcw } from 'lucide-react';

interface QuickCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickCalculatorModal: React.FC<QuickCalculatorModalProps> = ({ isOpen, onClose }) => {
  const [display, setDisplay] = useState<string>('0');
  const [equation, setEquation] = useState<string>('');

  if (!isOpen) return null;

  const handleNum = (n: string) => {
    setDisplay(prev => (prev === '0' || prev === 'خطأ' ? n : prev + n));
  };

  const handleOp = (op: string) => {
    setEquation(`${display} ${op} `);
    setDisplay('0');
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
  };

  const handleDelete = () => {
    setDisplay(prev => (prev.length > 1 ? prev.slice(0, -1) : '0'));
  };

  const handleEquals = () => {
    try {
      const fullExp = equation + display;
      // Sanitize input
      const sanitized = fullExp.replace(/×/g, '*').replace(/÷/g, '/');
      // eslint-disable-next-line no-eval
      const result = Function(`"use strict"; return (${sanitized})`)();
      setDisplay(String(Number(result.toFixed(4))));
      setEquation('');
    } catch {
      setDisplay('خطأ');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        onClick={e => e.stopPropagation()}
        className="w-full max-w-xs bg-slate-900 text-white rounded-3xl p-5 shadow-2xl border border-slate-700 font-sans select-none"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
              <CalcIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">آلة حاسبة سريعة</h3>
              <p className="text-[10px] text-slate-400">عمليات حسابية سريعة أثناء العمل</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Display Screen */}
        <div className="bg-slate-950 rounded-2xl p-4 mb-4 border border-slate-800 text-left">
          <div className="text-xs text-slate-500 min-h-[1rem] font-mono">{equation}</div>
          <div className="text-3xl font-black font-mono truncate text-white mt-1">{display}</div>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-2 text-sm font-bold">
          <button onClick={handleClear} className="p-3 rounded-xl bg-red-600/80 hover:bg-red-500 text-white transition-colors">C</button>
          <button onClick={handleDelete} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center justify-center"><Delete className="w-4 h-4" /></button>
          <button onClick={() => handleOp('÷')} className="p-3 rounded-xl bg-indigo-600/80 hover:bg-indigo-500 text-white transition-colors">÷</button>
          <button onClick={() => handleOp('×')} className="p-3 rounded-xl bg-indigo-600/80 hover:bg-indigo-500 text-white transition-colors">×</button>

          <button onClick={() => handleNum('7')} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors">7</button>
          <button onClick={() => handleNum('8')} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors">8</button>
          <button onClick={() => handleNum('9')} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors">9</button>
          <button onClick={() => handleOp('-')} className="p-3 rounded-xl bg-indigo-600/80 hover:bg-indigo-500 text-white transition-colors">-</button>

          <button onClick={() => handleNum('4')} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors">4</button>
          <button onClick={() => handleNum('5')} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors">5</button>
          <button onClick={() => handleNum('6')} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors">6</button>
          <button onClick={() => handleOp('+')} className="p-3 rounded-xl bg-indigo-600/80 hover:bg-indigo-500 text-white transition-colors">+</button>

          <button onClick={() => handleNum('1')} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors">1</button>
          <button onClick={() => handleNum('2')} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors">2</button>
          <button onClick={() => handleNum('3')} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors">3</button>
          <button onClick={handleEquals} className="row-span-2 p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg transition-colors flex items-center justify-center">=</button>

          <button onClick={() => handleNum('0')} className="col-span-2 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors">0</button>
          <button onClick={() => handleNum('.')} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors">.</button>
        </div>
      </div>
    </div>
  );
};
