import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface MobileMenuPortalProps {
  children: React.ReactNode;
  isOpen: boolean;
}

export const MobileMenuPortal: React.FC<MobileMenuPortalProps> = ({ children, isOpen }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || !isOpen) {
    return null;
  }

  return createPortal(
    <div className="mobile-menu-container">
      {children}
    </div>,
    document.body
  );
};