/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ReportInaccuracyForm } from '../ReportInaccuracyForm';

describe('ReportInaccuracyForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  const defaultProps = {
    stadiumId: 'yankee-stadium',
    stadiumName: 'Yankee Stadium',
    onSubmit: mockOnSubmit,
    onCancel: mockOnCancel,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the form with all fields', () => {
      render(<ReportInaccuracyForm {...defaultProps} />);

      expect(screen.getByText('Yankee Stadium')).toBeInTheDocument();
      expect(screen.getByLabelText(/Section \(Optional\)/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Issue Type/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email \(Optional\)/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Submit Report/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    });

    it('should prefill section when provided', () => {
      render(
        <ReportInaccuracyForm
          {...defaultProps}
          prefilledSection="Section 205"
        />
      );

      const sectionInput = screen.getByLabelText(/Section \(Optional\)/i) as HTMLInputElement;
      expect(sectionInput.value).toBe('Section 205');
    });

    it('should display character count for description', () => {
      render(<ReportInaccuracyForm {...defaultProps} />);

      expect(screen.getByText('0/1000')).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should show error when description is empty on submit', async () => {
      render(<ReportInaccuracyForm {...defaultProps} />);

      const submitButton = screen.getByRole('button', { name: /Submit Report/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Please describe the issue/i)).toBeInTheDocument();
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should show error when description is too short', async () => {
      render(<ReportInaccuracyForm {...defaultProps} />);

      const descriptionInput = screen.getByLabelText(/Description/i);
      fireEvent.change(descriptionInput, { target: { value: 'Too short' } });

      const submitButton = screen.getByRole('button', { name: /Submit Report/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Description must be at least 10 characters/i)).toBeInTheDocument();
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should show error for invalid email format', async () => {
      render(<ReportInaccuracyForm {...defaultProps} />);

      const emailInput = screen.getByLabelText(/Email \(Optional\)/i);
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.blur(emailInput);

      await waitFor(() => {
        expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
      });
    });

    it('should clear error when user starts typing again', async () => {
      render(<ReportInaccuracyForm {...defaultProps} />);

      const descriptionInput = screen.getByLabelText(/Description/i);

      // Trigger error
      const submitButton = screen.getByRole('button', { name: /Submit Report/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Please describe the issue/i)).toBeInTheDocument();
      });

      // Start typing
      fireEvent.change(descriptionInput, { target: { value: 'This is a valid description now' } });

      await waitFor(() => {
        expect(screen.queryByText(/Please describe the issue/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('should submit form with valid data', async () => {
      mockOnSubmit.mockResolvedValue(undefined);

      render(<ReportInaccuracyForm {...defaultProps} />);

      // Fill out form
      fireEvent.change(screen.getByLabelText(/Issue Type/i), { target: { value: 'shade-data' } });
      fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'The shade percentage seems incorrect for section 205' } });

      const submitButton = screen.getByRole('button', { name: /Submit Report/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          stadium: 'yankee-stadium',
          section: '',
          issueType: 'shade-data',
          description: 'The shade percentage seems incorrect for section 205',
          email: '',
        });
      });
    });

    it('should submit form with all optional fields filled', async () => {
      mockOnSubmit.mockResolvedValue(undefined);

      render(<ReportInaccuracyForm {...defaultProps} />);

      // Fill out all fields
      fireEvent.change(screen.getByLabelText(/Section \(Optional\)/i), { target: { value: 'Section 205, Row A' } });
      fireEvent.change(screen.getByLabelText(/Issue Type/i), { target: { value: 'obstruction' } });
      fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'There is a pole blocking the view' } });
      fireEvent.change(screen.getByLabelText(/Email \(Optional\)/i), { target: { value: 'user@example.com' } });

      const submitButton = screen.getByRole('button', { name: /Submit Report/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          stadium: 'yankee-stadium',
          section: 'Section 205, Row A',
          issueType: 'obstruction',
          description: 'There is a pole blocking the view',
          email: 'user@example.com',
        });
      });
    });
  });

  describe('Character Counter', () => {
    it('should update character count as user types', async () => {
      render(<ReportInaccuracyForm {...defaultProps} />);

      const descriptionInput = screen.getByLabelText(/Description/i);
      fireEvent.change(descriptionInput, { target: { value: 'This is a test' } });

      expect(screen.getByText('14/1000')).toBeInTheDocument();
    });
  });

  describe('Cancel Button', () => {
    it('should call onCancel when cancel button is clicked', async () => {
      render(<ReportInaccuracyForm {...defaultProps} />);

      const cancelButton = screen.getByRole('button', { name: /Cancel/i });
      fireEvent.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it('should disable cancel button when submitting', () => {
      render(<ReportInaccuracyForm {...defaultProps} isSubmitting={true} />);

      const cancelButton = screen.getByRole('button', { name: /Cancel/i });
      expect(cancelButton).toBeDisabled();
    });
  });

  describe('Submit Button States', () => {
    it('should show "Submitting..." when isSubmitting is true', () => {
      render(<ReportInaccuracyForm {...defaultProps} isSubmitting={true} />);

      expect(screen.getByRole('button', { name: /Submitting.../i })).toBeInTheDocument();
    });

    it('should disable submit button when submitting', () => {
      render(<ReportInaccuracyForm {...defaultProps} isSubmitting={true} />);

      const submitButton = screen.getByRole('button', { name: /Submitting.../i });
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('should have minimum 44px touch targets for buttons', () => {
      render(<ReportInaccuracyForm {...defaultProps} />);

      const submitButton = screen.getByRole('button', { name: /Submit Report/i });
      const cancelButton = screen.getByRole('button', { name: /Cancel/i });

      expect(submitButton.className).toContain('min-h-[44px]');
      expect(cancelButton.className).toContain('min-h-[44px]');
    });

    it('should have proper labels for all form inputs', () => {
      render(<ReportInaccuracyForm {...defaultProps} />);

      expect(screen.getByLabelText(/Section \(Optional\)/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Issue Type/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email \(Optional\)/i)).toBeInTheDocument();
    });
  });
});
