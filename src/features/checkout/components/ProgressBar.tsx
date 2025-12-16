'use client';

import { Check } from 'lucide-react';
import type { CheckoutStep } from '../types';

interface ProgressBarProps {
  currentStep: CheckoutStep;
}

const steps = [
  { id: 'shipping' as CheckoutStep, label: '配送先情報', order: 1 },
  { id: 'payment' as CheckoutStep, label: '支払い方法', order: 2 },
  { id: 'confirm' as CheckoutStep, label: '注文確認', order: 3 },
];

export function ProgressBar({ currentStep }: ProgressBarProps) {
  const currentOrder = steps.find(step => step.id === currentStep)?.order || 1;

  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, index) => {
          const isCompleted = step.order < currentOrder;
          const isCurrent = step.id === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? 'bg-green-500/20 border-2 border-green-500/50'
                      : isCurrent
                      ? 'bg-blue-500/20 border-2 border-blue-500/50 scale-110'
                      : 'bg-white/5 border-2 border-white/20'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6 text-green-400" />
                  ) : (
                    <span
                      className={`font-bold ${
                        isCurrent ? 'text-blue-300' : 'text-white/50'
                      }`}
                    >
                      {step.order}
                    </span>
                  )}
                </div>
                <span
                  className={`mt-2 text-sm font-medium transition-colors duration-300 ${
                    isCurrent ? 'text-white' : 'text-white/50'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connecting Line */}
              {!isLast && (
                <div className="flex-1 h-0.5 mx-4 mb-6">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isCompleted ? 'bg-green-500/50' : 'bg-white/10'
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

