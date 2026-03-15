"use client";

import { useState, useEffect, useCallback } from "react";
import { X, ChevronRight, ChevronLeft, Check } from "lucide-react";

export default function GuidedTour({ steps, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState(null);

  const step = steps[currentStep];

  const updatePosition = useCallback(() => {
    if (!step?.target) return;
    const el = document.querySelector(step.target);
    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
      // Scroll into view if needed
      el.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    } else {
      setTargetRect(null);
    }
  }, [step]);

  useEffect(() => {
    // Wait a brief moment for rendering to settle
    const tm = setTimeout(updatePosition, 150);
    window.addEventListener("resize", updatePosition);
    return () => {
      clearTimeout(tm);
      window.removeEventListener("resize", updatePosition);
    };
  }, [updatePosition, currentStep]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((p) => p + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((p) => p - 1);
    }
  };

  if (!step) return null;

  // Calculate tooltip style
  let tooltipStyle = {};
  if (targetRect) {
    const spacing = 16;
    switch (step.placement || "bottom") {
      case "top":
        tooltipStyle = {
          bottom: window.innerHeight - targetRect.top + spacing,
          left: targetRect.left + targetRect.width / 2,
          transform: "translateX(-50%)",
        };
        break;
      case "bottom":
        tooltipStyle = {
          top: targetRect.top + targetRect.height + spacing,
          left: targetRect.left + targetRect.width / 2,
          transform: "translateX(-50%)",
        };
        break;
      case "left":
        tooltipStyle = {
          top: targetRect.top + targetRect.height / 2,
          right: window.innerWidth - targetRect.left + spacing,
          transform: "translateY(-50%)",
        };
        break;
      case "right":
        tooltipStyle = {
          top: targetRect.top + targetRect.height / 2,
          left: targetRect.left + targetRect.width + spacing,
          transform: "translateY(-50%)",
        };
        break;
      case "center":
      default:
        tooltipStyle = {
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        };
        break;
    }
  } else {
    // Default fallback to center screen if no target
    tooltipStyle = {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    };
  }

  // Prevent tooltip from overflowing the viewport
  if (targetRect) {
    // If placement is 'top' or 'bottom' and the target is too far to the right,
    // the translate(-50%) could push it off-screen
    if ((step.placement === "top" || step.placement === "bottom") && tooltipStyle.left) {
      const halfWidth = 160; // 320px width / 2
      if (tooltipStyle.left + halfWidth > window.innerWidth) {
        tooltipStyle.left = window.innerWidth - halfWidth - 20; // 20px margin
      }
      if (tooltipStyle.left - halfWidth < 0) {
        tooltipStyle.left = halfWidth + 20;
      }
    }
  }

  return (
    <div className="fixed inset-0 z-[100] pointer-events-auto flex">
      {/* Background Mask */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <mask id="tour-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {targetRect && (
              <rect
                x={targetRect.left - 4}
                y={targetRect.top - 4}
                width={targetRect.width + 8}
                height={targetRect.height + 8}
                fill="black"
                rx="6"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.6)"
          mask="url(#tour-mask)"
        />
      </svg>

      {/* Target Highlight Outline (optional, to make it pop) */}
      {targetRect && (
        <div
          className="absolute border-2 border-primary rounded-lg pointer-events-none transition-all duration-300"
          style={{
            top: targetRect.top - 4,
            left: targetRect.left - 4,
            width: targetRect.width + 8,
            height: targetRect.height + 8,
          }}
        />
      )}

      {/* Tooltip Dialog */}
      <div
        className="absolute card flex flex-col pointer-events-auto transition-all duration-300"
        style={{
          ...tooltipStyle,
          width: "320px",
          maxWidth: "90vw",
          zIndex: 110,
        }}
      >
        <div className="flex justify-between items-start p-4 pb-2">
          <h3 className="font-semibold text-lg text-foreground">{step.title}</h3>
          <button
            onClick={onComplete}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md"
            title="Skip tour"
          >
            <X size={16} />
          </button>
        </div>
        <div className="px-4 py-2 text-sm text-foreground">
          {step.content}
        </div>
        <div className="flex items-center justify-between p-4 border-t border-border mt-2">
          <div className="text-xs text-muted-foreground font-medium">
            {currentStep + 1} of {steps.length}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="px-3 py-1.5 text-sm font-medium rounded-md hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed flex items-center text-foreground"
            >
              <ChevronLeft size={16} />
              Prev
            </button>
            <button 
              onClick={handleNext} 
              className="px-3 py-1.5 text-sm font-medium rounded-md min-w-[80px] flex items-center justify-center transition-colors"
              style={{ backgroundColor: "var(--primary)", color: "white" }}
            >
              {currentStep === steps.length - 1 ? (
                <>
                  <Check size={16} className="mr-1" /> Finish
                </>
              ) : (
                <>
                  Next <ChevronRight size={16} className="ml-1" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
