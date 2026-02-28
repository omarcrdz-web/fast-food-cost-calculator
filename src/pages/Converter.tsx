import React, { useState } from 'react';
import { ArrowRightLeft } from 'lucide-react';
import { Unit, UNIT_LABELS } from '../types';
import { convert } from '../utils';

export const Converter: React.FC = () => {
  const [value, setValue] = useState<number>(1);
  const [fromUnit, setFromUnit] = useState<Unit>('kg');
  const [toUnit, setToUnit] = useState<Unit>('g');
  const [result, setResult] = useState<number | null>(1000);

  const handleConvert = () => {
    const converted = convert(value, fromUnit, toUnit);
    setResult(converted);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Convertidor de Medidas</h2>
        <p className="text-slate-500 mt-1">Convierte fácilmente entre diferentes unidades de masa y volumen.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-end">
          
          {/* From */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cantidad</label>
              <input
                type="number"
                min="0"
                step="any"
                value={value}
                onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-lg font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">De</label>
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value as Unit)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700"
              >
                {Object.entries(UNIT_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Icon */}
          <div className="flex justify-center pb-3 hidden md:flex">
            <div className="p-3 bg-slate-50 rounded-full text-slate-400">
              <ArrowRightLeft size={24} />
            </div>
          </div>

          {/* To */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">A</label>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value as Unit)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700"
              >
                {Object.entries(UNIT_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleConvert}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors shadow-sm"
            >
              Convertir
            </button>
          </div>
        </div>

        {/* Result */}
        <div className="mt-8 pt-8 border-t border-slate-100 text-center">
          <p className="text-sm font-medium text-slate-500 mb-2">Resultado</p>
          {result === null ? (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl font-medium">
              No se puede convertir entre estas unidades (ej. masa a volumen).
            </div>
          ) : (
            <div className="text-4xl font-bold text-slate-900 tracking-tight">
              {value} {fromUnit} = <span className="text-emerald-500">{result.toFixed(4).replace(/\.?0+$/, '')} {toUnit}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
