import React, { useEffect, useRef } from 'react';

interface AdCodeRendererProps {
  code: string;
  className?: string;
  adDimensions?: string;
}

export const AdCodeRenderer: React.FC<AdCodeRendererProps> = ({ 
  code, 
  className = '',
  adDimensions = 'responsive' 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !code) return;

    const container = containerRef.current;
    container.innerHTML = '';

    // Create wrapper div
    const wrapper = document.createElement('div');
    wrapper.className = 'ad-code-inner-wrapper w-full flex justify-center items-center overflow-hidden';
    wrapper.innerHTML = code;

    // Execute any script tags included in the code snippet
    const scripts = wrapper.querySelectorAll('script');
    scripts.forEach((oldScript) => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      newScript.appendChild(document.createTextNode(oldScript.innerHTML));
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });

    container.appendChild(wrapper);
  }, [code]);

  if (!code || !code.trim()) {
    return (
      <div className="w-full p-4 border border-dashed border-slate-700 rounded-xl bg-slate-900/60 text-slate-400 text-xs text-center">
        No custom ad code configured yet.
      </div>
    );
  }

  // Dimension styling mapping
  const getDimensionClasses = () => {
    switch (adDimensions) {
      case '728x90':
        return 'max-w-[728px] min-h-[90px] mx-auto';
      case '970x250':
        return 'max-w-[970px] min-h-[250px] mx-auto';
      case '300x250':
        return 'max-w-[300px] min-h-[250px] mx-auto';
      case '320x100':
        return 'max-w-[320px] min-h-[100px] mx-auto';
      case 'responsive':
      default:
        return 'w-full';
    }
  };

  return (
    <div className={`ad-code-container relative overflow-hidden rounded-2xl ${getDimensionClasses()} ${className}`}>
      <div ref={containerRef} className="w-full flex justify-center" />
    </div>
  );
};
