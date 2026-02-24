/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ReportInaccuracyButton } from '../ReportInaccuracyButton';

// Mock fetch
global.fetch = jest.fn();

describe('ReportInaccuracyButton', () => {
  const defaultProps = {
    stadiumId: 'yankee-stadium',
    stadiumName: 'Yankee Stadium',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
  });

  describe('Button Rendering', () => {
    it('should render button with default variant and size', () => {
      render(<ReportInaccuracyButton {...defaultProps} />);

      const button = screen.getByRole('button', { name: /Report Issue/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Report Issue');
    });

    it('should render button with primary variant', () => {
      render(<ReportInaccuracyButton {...defaultProps} variant="primary" />);

      const button = screen.getByRole('button', { name: /Report Issue/i });
      expect(button.className).toContain('bg-blue-600');
    });

    it('should render button with small size', () => {
      render(<ReportInaccuracyButton {...defaultProps} size="sm" />);

      const button = screen.getByRole('button', { name: /Report Issue/i });
      expect(button.className).toContain('min-h-[36px]');
    });

    it('should have warning icon', () => {
      render(<ReportInaccuracyButton {...defaultProps} />);

      const button = screen.getByRole('button', { name: /Report Issue/i });
      const svg = button.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Modal Interaction', () => {
    it('should open modal when button is clicked', async () => {
      render(<ReportInaccuracyButton {...defaultProps} />);

      const button = screen.getByRole('button', { name: /Report Issue/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Report Data Inaccuracy')).toBeInTheDocument();
      });
    });

    it('should close modal when close button is clicked', async () => {
      render(<ReportInaccuracyButton {...defaultProps} />);

      // Open modal
      const button = screen.getByRole('button', { name: /Report Issue/i });
      fireEvent.click(button);

      // Close modal
      const closeButton = screen.getByRole('button', { name: /Close modal/i });
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('should submit form successfully', async () => {
      render(<ReportInaccuracyButton {...defaultProps} />);

      // Open modal
      const button = screen.getByRole('button', { name: /Report Issue/i });
      fireEvent.click(button);

      // Fill form
      const descriptionInput = screen.getByLabelText(/Description/i);
      fireEvent.change(descriptionInput, { target: { value: 'Test description for shade data issue' } });

      // Submit
      const submitButton = screen.getByRole('button', { name: /Submit Report/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/report-inaccuracy',
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: expect.stringContaining('Test description for shade data issue'),
          })
        );
      });
    });

    it('should show success message on successful submission', async () => {
      render(<ReportInaccuracyButton {...defaultProps} />);

      // Open modal
      const button = screen.getByRole('button', { name: /Report Issue/i });
      fireEvent.click(button);

      // Fill and submit form
      const descriptionInput = screen.getByLabelText(/Description/i);
      fireEvent.change(descriptionInput, { target: { value: 'Test description for successful submission' } });

      const submitButton = screen.getByRole('button', { name: /Submit Report/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Report Submitted Successfully!/i)).toBeInTheDocument();
        expect(screen.getByText(/Thank you for helping us improve our data/i)).toBeInTheDocument();
      });
    });

    it('should show error message on failed submission', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Server error' }),
      });

      render(<ReportInaccuracyButton {...defaultProps} />);

      // Open modal
      const button = screen.getByRole('button', { name: /Report Issue/i });
      fireEvent.click(button);

      // Fill and submit form
      const descriptionInput = screen.getByLabelText(/Description/i);
      fireEvent.change(descriptionInput, { target: { value: 'Test description' } });

      const submitButton = screen.getByRole('button', { name: /Submit Report/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Submission Failed/i)).toBeInTheDocument();
        expect(screen.getByText(/Server error/i)).toBeInTheDocument();
      });
    });
  });

  describe('Prefilled Section', () => {
    it('should prefill section in form when provided', async () => {
      render(
        <ReportInaccuracyButton
          {...defaultProps}
          prefilledSection="Section 205"
        />
      );

      // Open modal
      const button = screen.getByRole('button', { name: /Report Issue/i });
      fireEvent.click(button);

      const sectionInput = screen.getByLabelText(/Section \(Optional\)/i) as HTMLInputElement;
      expect(sectionInput.value).toBe('Section 205');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', async () => {
      render(<ReportInaccuracyButton {...defaultProps} />);

      const button = screen.getByRole('button', { name: /Report data inaccuracy/i });
      expect(button).toHaveAttribute('aria-label', 'Report data inaccuracy');

      // Open modal
      fireEvent.click(button);

      const modal = screen.getByRole('dialog');
      expect(modal).toHaveAttribute('aria-modal', 'true');
      expect(modal).toHaveAttribute('aria-labelledby', 'modal-title');

      const closeButton = screen.getByRole('button', { name: /Close modal/i });
      expect(closeButton).toHaveAttribute('aria-label', 'Close modal');
    });

    it('should have minimum 44px touch targets', async () => {
      render(<ReportInaccuracyButton {...defaultProps} size="md" />);

      const button = screen.getByRole('button', { name: /Report Issue/i });
      expect(button.className).toContain('min-h-[44px]');

      // Open modal to check close button
      fireEvent.click(button);

      const closeButton = screen.getByRole('button', { name: /Close modal/i });
      expect(closeButton.className).toContain('min-h-[44px]');
    });
  });
});
