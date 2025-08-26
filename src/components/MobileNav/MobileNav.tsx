'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './MobileNav.module.css';

export interface NavItem {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface MobileNavProps {
  items: NavItem[];
  title?: string;
  menuLabel?: string;
  className?: string;
  onOpen?: () => void;
  onClose?: () => void;
  renderMenuItem?: (item: NavItem) => React.ReactNode;
  renderHeader?: () => React.ReactNode;
  renderFooter?: () => React.ReactNode;
}

export default function MobileNav({
  items,
  title = 'Menu',
  menuLabel = 'Menu',
  className = '',
  onOpen,
  onClose,
  renderMenuItem,
  renderHeader,
  renderFooter
}: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  const handleOpen = () => {
    setIsOpen(true);
    onOpen?.();
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
        menuBtnRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Focus management
  useEffect(() => {
    if (isOpen && drawerRef.current) {
      const firstFocusable = drawerRef.current.querySelector<HTMLElement>(
        'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    }
  }, [isOpen]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const defaultRenderMenuItem = (item: NavItem) => {
    const content = (
      <>
        {item.icon && <span aria-hidden="true">{item.icon}</span>}
        <span>{item.label}</span>
      </>
    );

    if (item.href) {
      return (
        <a
          key={item.id}
          href={item.href}
          onClick={() => {
            item.onClick?.();
            handleClose();
          }}
          className="nav-link"
          aria-disabled={item.disabled}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        key={item.id}
        onClick={() => {
          item.onClick?.();
          handleClose();
        }}
        disabled={item.disabled}
        type="button"
        className="nav-button"
      >
        {content}
      </button>
    );
  };

  return (
    <>
      <button
        ref={menuBtnRef}
        className={`${styles.menuBtn} ${className}`}
        onClick={handleOpen}
        type="button"
        aria-label={menuLabel}
        aria-expanded={isOpen}
        aria-controls="mobile-nav-drawer"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3 5H17M3 10H17M3 15H17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <div
        className={`${styles.scrim} ${isOpen ? styles.scrimOpen : ''}`}
        onClick={handleClose}
        aria-hidden="true"
      />

      <nav
        id="mobile-nav-drawer"
        ref={drawerRef}
        className={`${styles.drawer} ${isOpen ? styles.open : ''}`}
        aria-label="Mobile navigation"
        aria-hidden={!isOpen}
      >
        {renderHeader ? renderHeader() : (
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            <button
              onClick={handleClose}
              type="button"
              aria-label="Close menu"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M6 6L18 18M6 18L18 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        )}

        <div className={styles.list}>
          {items.map(item => 
            renderMenuItem ? renderMenuItem(item) : defaultRenderMenuItem(item)
          )}
        </div>

        {renderFooter && renderFooter()}
      </nav>
    </>
  );
}

// Menu trigger button component (can be used separately)
export function MenuTrigger({
  onClick,
  className = '',
  label = 'Menu'
}: {
  onClick: () => void;
  className?: string;
  label?: string;
}) {
  return (
    <button
      className={`${styles.menuBtn} ${className}`}
      onClick={onClick}
      type="button"
      aria-label={label}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M3 5H17M3 10H17M3 15H17"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}