import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface TourStep {
    targetId?: string;
    title: string;
    content: string;
    position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

interface OnboardingTourProps {
    step: number;
    onNext: () => void;
    onSkip: () => void;
    onFinish: () => void;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({ step, onNext, onSkip, onFinish }) => {
    const { t } = useLanguage();
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({ opacity: 0 });
    const tooltipRef = useRef<HTMLDivElement>(null);

    const steps: TourStep[] = useMemo(() => [
        {
            title: t.tourWelcomeTitle,
            content: t.tourWelcomeContent,
            position: 'center',
        },
        {
            targetId: 'tour-chat-button',
            title: t.tourChatTitle,
            content: t.tourChatContent,
            position: 'bottom',
        },
        {
            targetId: 'tour-dashboard-card',
            title: t.tourDashboardTitle,
            content: t.tourDashboardContent,
            position: 'bottom',
        },
        {
            targetId: 'tour-market-tab',
            title: t.tourMarketTitle,
            content: t.tourMarketContent,
            position: 'top',
        },
    ], [t]);

    const currentStep = steps[step];
    const isLastStep = step === steps.length - 1;

    useEffect(() => {
        const calculatePosition = () => {
            const style: React.CSSProperties = { opacity: 1, transition: 'opacity 0.3s, top 0.3s, left 0.3s' };
            const tooltipEl = tooltipRef.current;
            if (!tooltipEl) return;

            if (currentStep?.targetId) {
                const element = document.getElementById(currentStep.targetId);
                const rect = element?.getBoundingClientRect();

                if (element && rect && rect.width > 0) {
                    setTargetRect(rect);
                    
                    const tooltipWidth = tooltipEl.offsetWidth;
                    const tooltipHeight = tooltipEl.offsetHeight;
                    const margin = 12;
                    
                    // Horizontal positioning: center on target, but clamp to viewport edges
                    let left = rect.left + rect.width / 2 - tooltipWidth / 2;
                    left = Math.max(margin, left);
                    left = Math.min(left, window.innerWidth - tooltipWidth - margin);
                    style.left = `${left}px`;
                    style.transform = 'translateX(0)';

                    // Vertical positioning: check space and flip if necessary
                    const spaceBottom = window.innerHeight - rect.bottom;
                    const spaceTop = rect.top;
                    const preferredPosition = currentStep.position || 'bottom';

                    if (preferredPosition === 'bottom') {
                        if (spaceBottom >= tooltipHeight + margin) {
                            style.top = `${rect.bottom + margin}px`;
                        } else {
                            style.top = `${rect.top - tooltipHeight - margin}px`;
                        }
                    } else if (preferredPosition === 'top') {
                        if (spaceTop >= tooltipHeight + margin) {
                            style.top = `${rect.top - tooltipHeight - margin}px`;
                        } else {
                            style.top = `${rect.bottom + margin}px`;
                        }
                    }
                } else {
                    // Element not found or not rendered, fallback to center
                    setTargetRect(null);
                    style.top = '50%';
                    style.left = '50%';
                    style.transform = 'translate(-50%, -50%)';
                }
            } else {
                setTargetRect(null);
                // Center it for steps without a target (like the welcome step)
                style.top = '50%';
                style.left = '50%';
                style.transform = 'translate(-50%, -50%)';
            }
            setTooltipStyle(style);
        };

        // Delay calculation to allow for view transitions and element rendering
        const timeoutId = setTimeout(calculatePosition, 400);

        window.addEventListener('resize', calculatePosition);
        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', calculatePosition);
        };
    }, [step, currentStep, t]);

    if (!currentStep) return null;
    
    const highlightStyle: React.CSSProperties = targetRect ? {
        position: 'absolute',
        top: `${targetRect.top - 4}px`,
        left: `${targetRect.left - 4}px`,
        width: `${targetRect.width + 8}px`,
        height: `${targetRect.height + 8}px`,
        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)',
        borderRadius: '8px',
        zIndex: 1000,
        pointerEvents: 'none',
        transition: 'all 0.3s ease-in-out',
    } : {};


    return (
        <div className="fixed inset-0 z-[999]">
            {targetRect && <div style={highlightStyle}></div>}
            
            {/* If no target, we still need the backdrop */}
            {!targetRect && <div className="fixed inset-0 bg-black/60 z-[999] animate-fadeIn"></div>}

            <div
                ref={tooltipRef}
                className="absolute w-full max-w-sm p-5 bg-white dark:bg-dark-surface rounded-lg shadow-2xl z-[1001] animate-slideInUp"
                style={tooltipStyle}
            >
                <h3 className="text-xl font-bold text-primary dark:text-dark-primary">{currentStep.title}</h3>
                <p className="mt-2 text-sm text-text-dark dark:text-dark-text">{currentStep.content}</p>
                
                <div className="flex items-center justify-between mt-6">
                    <div>
                        {step > 0 && (
                            <button onClick={onSkip} className="text-xs text-gray-500 hover:underline">
                                {t.skipTour}
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                         <span className="text-xs font-medium text-gray-600 dark:text-dark-text-secondary">{step + 1} / {steps.length}</span>
                        {isLastStep ? (
                            <button onClick={onFinish} className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-md">
                                {t.finishTour}
                            </button>
                        ) : (
                             <button onClick={step === 0 ? onNext : onNext} className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-md">
                                {step === 0 ? t.startTour : t.nextButton}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnboardingTour;
