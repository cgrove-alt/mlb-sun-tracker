import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import StickyShadeBar from '../StickyShadeBar';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
  usePathname: jest.fn(),
}));

describe('StickyShadeBar', () => {
  const mockPush = jest.fn();
  const mockSearchParams = new URLSearchParams();
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
    (usePathname as jest.Mock).mockReturnValue('/stadium/angels');
  });

  describe('Query String Building', () => {
    it('should build correct query string with date and time', () => {
      render(
        <StickyShadeBar 
          stadiumName="Angel Stadium"
          stadiumId="angels"
        />
      );

      // Set date
      const dateInput = screen.getByLabelText(/select date/i);
      fireEvent.change(dateInput, { target: { value: '2024-09-07' } });

      // Set time
      const timeSelect = screen.getByLabelText(/select time/i);
      fireEvent.change(timeSelect, { target: { value: '13:00' } });

      // Submit form
      const submitButton = screen.getByRole('button', { name: /check shade/i });
      fireEvent.click(submitButton);

      // Check that router.push was called with correct query string
      expect(mockPush).toHaveBeenCalledWith('/stadium/angels?date=2024-09-07&time=13:00');
    });

    it('should include section parameter when provided', () => {
      render(
        <StickyShadeBar 
          stadiumName="Angel Stadium"
          stadiumId="angels"
        />
      );

      // Set date
      const dateInput = screen.getByLabelText(/select date/i);
      fireEvent.change(dateInput, { target: { value: '2024-09-07' } });

      // Set time
      const timeSelect = screen.getByLabelText(/select time/i);
      fireEvent.change(timeSelect, { target: { value: '13:00' } });

      // Set section
      const sectionInput = screen.getByLabelText(/enter section/i);
      fireEvent.change(sectionInput, { target: { value: '116' } });

      // Submit form
      const submitButton = screen.getByRole('button', { name: /check shade/i });
      fireEvent.click(submitButton);

      // Check that router.push was called with section included
      expect(mockPush).toHaveBeenCalledWith('/stadium/angels?date=2024-09-07&time=13:00&section=116');
    });

    it('should not include section parameter when empty', () => {
      render(
        <StickyShadeBar 
          stadiumName="Angel Stadium"
          stadiumId="angels"
        />
      );

      // Set date
      const dateInput = screen.getByLabelText(/select date/i);
      fireEvent.change(dateInput, { target: { value: '2024-09-07' } });

      // Set time
      const timeSelect = screen.getByLabelText(/select time/i);
      fireEvent.change(timeSelect, { target: { value: '13:00' } });

      // Leave section empty
      const sectionInput = screen.getByLabelText(/enter section/i);
      fireEvent.change(sectionInput, { target: { value: '' } });

      // Submit form
      const submitButton = screen.getByRole('button', { name: /check shade/i });
      fireEvent.click(submitButton);

      // Check that router.push was called without section parameter
      expect(mockPush).toHaveBeenCalledWith('/stadium/angels?date=2024-09-07&time=13:00');
    });

    it('should initialize from URL search params', () => {
      // Set up search params
      mockSearchParams.set('date', '2024-10-01');
      mockSearchParams.set('time', '14:30');
      mockSearchParams.set('section', '200');

      render(
        <StickyShadeBar 
          stadiumName="Angel Stadium"
          stadiumId="angels"
        />
      );

      // Check that inputs are initialized with URL params
      const dateInput = screen.getByLabelText(/select date/i) as HTMLInputElement;
      expect(dateInput.value).toBe('2024-10-01');

      const timeSelect = screen.getByLabelText(/select time/i) as HTMLSelectElement;
      expect(timeSelect.value).toBe('14:30');

      const sectionInput = screen.getByLabelText(/enter section/i) as HTMLInputElement;
      expect(sectionInput.value).toBe('200');
    });

    it('should encode special characters in query string', () => {
      render(
        <StickyShadeBar 
          stadiumName="Angel Stadium"
          stadiumId="angels"
        />
      );

      // Set inputs
      const dateInput = screen.getByLabelText(/select date/i);
      fireEvent.change(dateInput, { target: { value: '2024-09-07' } });

      const timeSelect = screen.getByLabelText(/select time/i);
      fireEvent.change(timeSelect, { target: { value: '13:00' } });

      // Set section with special characters
      const sectionInput = screen.getByLabelText(/enter section/i);
      fireEvent.change(sectionInput, { target: { value: 'Field Box #1' } });

      // Submit form
      const submitButton = screen.getByRole('button', { name: /check shade/i });
      fireEvent.click(submitButton);

      // Check that special characters are properly encoded
      expect(mockPush).toHaveBeenCalledWith('/stadium/angels?date=2024-09-07&time=13:00&section=Field+Box+%231');
    });
  });

  describe('Custom Event Dispatching', () => {
    it('should dispatch calculateShade event with correct detail', () => {
      const eventListener = jest.fn();
      window.addEventListener('calculateShade', eventListener);

      render(
        <StickyShadeBar 
          stadiumName="Angel Stadium"
          stadiumId="angels"
        />
      );

      // Set inputs
      const dateInput = screen.getByLabelText(/select date/i);
      fireEvent.change(dateInput, { target: { value: '2024-09-07' } });

      const timeSelect = screen.getByLabelText(/select time/i);
      fireEvent.change(timeSelect, { target: { value: '13:00' } });

      const sectionInput = screen.getByLabelText(/enter section/i);
      fireEvent.change(sectionInput, { target: { value: '116' } });

      // Submit form
      const submitButton = screen.getByRole('button', { name: /check shade/i });
      fireEvent.click(submitButton);

      // Check that custom event was dispatched
      expect(eventListener).toHaveBeenCalled();
      const event = eventListener.mock.calls[0][0] as CustomEvent;
      expect(event.detail).toEqual({
        date: '2024-09-07',
        time: '13:00',
        section: '116',
        stadiumId: 'angels'
      });

      window.removeEventListener('calculateShade', eventListener);
    });
  });

  describe('Time Options', () => {
    it('should generate time options in 15-minute increments', () => {
      render(
        <StickyShadeBar 
          stadiumName="Angel Stadium"
          stadiumId="angels"
        />
      );

      const timeSelect = screen.getByLabelText(/select time/i) as HTMLSelectElement;
      const options = Array.from(timeSelect.options);

      // Should have 96 options (24 hours * 4 quarters)
      expect(options).toHaveLength(96);

      // Check some specific options
      expect(options[0].value).toBe('00:00');
      expect(options[0].textContent).toBe('12:00 AM');

      expect(options[4].value).toBe('01:00');
      expect(options[4].textContent).toBe('1:00 AM');

      expect(options[52].value).toBe('13:00');
      expect(options[52].textContent).toBe('1:00 PM');

      expect(options[95].value).toBe('23:45');
      expect(options[95].textContent).toBe('11:45 PM');
    });
  });
});