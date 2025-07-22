import React, { useEffect, useState } from 'react';

export function useP5Loader() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if p5 is already loaded
    if (typeof window !== 'undefined' && window.p5) {
      setIsLoaded(true);
      return;
    }

    // Load p5.js from CDN
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js';
    script.async = true;
    script.onload = () => setIsLoaded(true);
    script.onerror = () => console.error('Failed to load p5.js');
    
    document.head.appendChild(script);

    return () => {
      // Cleanup if needed
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return isLoaded;
}

export default function P5Loader({ children }: { children: React.ReactNode }) {
  const isLoaded = useP5Loader();
  
  if (!isLoaded) {
    return <div className="flex justify-center items-center h-[420px]">
      <div className="text-gray-500">Loading visualization...</div>
    </div>;
  }
  
  return <>{children}</>;
}