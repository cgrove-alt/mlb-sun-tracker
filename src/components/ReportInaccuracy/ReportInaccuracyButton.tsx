/**
 * Report Inaccuracy Button Component
 * Button that opens a modal with the report form
 */

'use client';

import React, { useState } from 'react';
import { ReportInaccuracyForm, ReportInaccuracyFormData } from './ReportInaccuracyForm';

interface ReportInaccuracyButtonProps {
  stadiumId: string;
  stadiumName: string;
  prefilledSection?: string;
  variant?: 'primary' | 'secondary' | 'text';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ReportInaccuracyButton: React.FC<ReportInaccuracyButtonProps> = ({
  stadiumId,
  stadiumName,
  prefilledSection,
  variant = 'secondary',
  size = 'md',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (data: ReportInaccuracyFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/report-inaccuracy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          stadiumName,
          timestamp: new Date().toISOString(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit report');
      }

      setSubmitSuccess(true);

      // Close modal after 2 seconds
      setTimeout(() => {
        setIsOpen(false);
        setSubmitSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to submit report:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (!isSubmitting) {
      setIsOpen(false);
      setSubmitSuccess(false);
      setSubmitError(null);
    }
  };

  const getButtonClasses = () => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500';

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-xs min-h-[36px]',
      md: 'px-4 py-2 text-sm min-h-[44px]',
      lg: 'px-6 py-3 text-base min-h-[48px]',
    };

    const variantClasses = {
      primary: 'bg-blue-600 text-white border border-transparent hover:bg-blue-700',
      secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
      text: 'bg-transparent text-blue-600 border-none hover:text-blue-700 hover:underline',
    };

    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;
  };

  return (
    <>
      {/* Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={getButtonClasses()}
        aria-label="Report data inaccuracy"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        Report Issue
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={handleCancel}
          />

          {/* Modal Panel */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="relative bg-white rounded-lg shadow-xl max-w-lg w-full p-6 transform transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={handleCancel}
                disabled={isSubmitting}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close modal"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Modal Header */}
              <h2
                id="modal-title"
                className="text-2xl font-bold text-gray-900 mb-2 pr-10"
              >
                Report Data Inaccuracy
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Help us improve our data by reporting any inaccuracies you find.
                We review all submissions carefully.
              </p>

              {/* Success Message */}
              {submitSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-600 mt-0.5 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <h3 className="text-sm font-medium text-green-800">
                        Report Submitted Successfully!
                      </h3>
                      <p className="text-sm text-green-700 mt-1">
                        Thank you for helping us improve our data.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {submitError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 text-red-600 mt-0.5 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <h3 className="text-sm font-medium text-red-800">
                        Submission Failed
                      </h3>
                      <p className="text-sm text-red-700 mt-1">
                        {submitError}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Form */}
              {!submitSuccess && (
                <ReportInaccuracyForm
                  stadiumId={stadiumId}
                  stadiumName={stadiumName}
                  prefilledSection={prefilledSection}
                  onSubmit={handleSubmit}
                  onCancel={handleCancel}
                  isSubmitting={isSubmitting}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReportInaccuracyButton;
