'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import styles from './StickyShadeBar.module.css';

interface StickyShadeBarProps {
  stadiumName: string;
  stadiumId: string;
}

export default function StickyShadeBar({ stadiumName, stadiumId }: StickyShadeBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Initialize from URL params or defaults
  const [date, setDate] = useState(() => {
    const paramDate = searchParams.get('date');
    if (paramDate) return paramDate;
    
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  
  const [time, setTime] = useState(() => {
    const paramTime = searchParams.get('time');
    if (paramTime) return paramTime;
    
    // Default to 1:00 PM
    return '13:00';
  });
  
  const [section, setSection] = useState(() => {
    return searchParams.get('section') || '';
  });

  // Generate time options in 15-minute increments
  const timeOptions = useCallback(() => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = formatTimeDisplay(timeString);
        options.push({ value: timeString, label: displayTime });
      }
    }
    return options;
  }, []);

  // Format time for display (12-hour format)
  const formatTimeDisplay = (timeString: string) => {
    const [hour, minute] = timeString.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  };

  // Handle form submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    // Build query string
    const params = new URLSearchParams();
    params.set('date', date);
    params.set('time', time);
    if (section) {
      params.set('section', section);
    }
    
    // Update URL with new params
    router.push(`${pathname}?${params.toString()}`);
    
    // Trigger shade calculation event
    window.dispatchEvent(new CustomEvent('calculateShade', {
      detail: { date, time, section, stadiumId }
    }));
  }, [date, time, section, pathname, router, stadiumId]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape key to clear focus from inputs
      if (e.key === 'Escape') {
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement && activeElement.blur) {
          activeElement.blur();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={styles.stickyBar}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.stadiumName}>{stadiumName}</div>
        
        <div className={styles.inputs}>
          <div className={styles.inputGroup}>
            <label htmlFor="shade-date" className={styles.srOnly}>Date</label>
            <input
              type="date"
              id="shade-date"
              className={styles.input}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              aria-label="Select date for shade calculation"
              required
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="shade-time" className={styles.srOnly}>Time</label>
            <select
              id="shade-time"
              className={styles.input}
              value={time}
              onChange={(e) => setTime(e.target.value)}
              aria-label="Select time for shade calculation"
              required
            >
              {timeOptions().map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="shade-section" className={styles.srOnly}>Section (optional)</label>
            <input
              type="text"
              id="shade-section"
              className={styles.input}
              value={section}
              onChange={(e) => setSection(e.target.value)}
              placeholder="Section (optional)"
              aria-label="Enter section number (optional)"
            />
          </div>
        </div>
        
        <button 
          type="submit" 
          className={styles.submitButton}
          aria-label="Calculate shade for selected date and time"
        >
          Check Shade
        </button>
      </form>
    </div>
  );
}