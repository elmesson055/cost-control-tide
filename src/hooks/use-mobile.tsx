
import { useEffect, useState } from 'react';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Define the check function
    const checkIfMobile = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < 768);
      }
    };

    // Run once immediately
    checkIfMobile();
    
    // Add event listener
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkIfMobile);
      
      // Clean up
      return () => {
        window.removeEventListener('resize', checkIfMobile);
      };
    }
  }, []);

  return isMobile;
}
