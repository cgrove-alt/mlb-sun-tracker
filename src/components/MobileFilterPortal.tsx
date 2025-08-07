import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface MobileFilterPortalProps {
  children: React.ReactNode;
  isOpen: boolean;
}

export const MobileFilterPortal: React.FC<MobileFilterPortalProps> = ({ children, isOpen }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || !isOpen) {
    return null;
  }

  return createPortal(
    <>{children}</>,
    document.body
  );
};