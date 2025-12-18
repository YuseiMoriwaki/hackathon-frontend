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
    <div className="w-full py-4">
      <div className="flex items-center justify-between max-w-2xl mx-auto px-4">
        {steps.map((step, index) => {
          const isCompleted = step.order < currentOrder;
          const isCurrent = step.id === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? 'bg-green-500/15 border border-green-500/40'
                      : isCurrent
                        ? 'bg-blue-500/15 border border-blue-500/40'
                        : 'bg-white/3 border border-white/15'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <span
                      className={`text-sm font-semibold ${
                        isCurrent ? 'text-blue-300' : 'text-white/40'
                      }`}
                    >
                      {step.order}
                    </span>
                  )}
                </div>
                <span
                  className={`mt-1.5 text-xs font-medium transition-colors duration-300 ${
                    isCurrent ? 'text-white/90' : 'text-white/40'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connecting Line */}
              {!isLast && (
                <div className="flex-1 h-px mx-3 mb-5">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isCompleted ? 'bg-green-500/40' : 'bg-white/10'
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
