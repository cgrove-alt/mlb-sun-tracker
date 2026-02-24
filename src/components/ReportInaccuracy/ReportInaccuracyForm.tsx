/**
 * Report Inaccuracy Form Component
 * Allows users to report data inaccuracies for stadium information
 */

'use client';

import React, { useState } from 'react';

export interface ReportInaccuracyFormData {
  stadium: string;
  section?: string;
  issueType: 'shade-data' | 'section-info' | 'obstruction' | 'pricing' | 'other';
  description: string;
  email?: string;
}

interface ReportInaccuracyFormProps {
  stadiumId: string;
  stadiumName: string;
  prefilledSection?: string;
  onSubmit: (data: ReportInaccuracyFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const ReportInaccuracyForm: React.FC<ReportInaccuracyFormProps> = ({
  stadiumId,
  stadiumName,
  prefilledSection,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState<ReportInaccuracyFormData>({
    stadium: stadiumId,
    section: prefilledSection || '',
    issueType: 'shade-data',
    description: '',
    email: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ReportInaccuracyFormData, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ReportInaccuracyFormData, boolean>>>({});

  const handleChange = (field: keyof ReportInaccuracyFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: keyof ReportInaccuracyFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = (field: keyof ReportInaccuracyFormData): boolean => {
    let error = '';

    switch (field) {
      case 'description':
        if (!formData.description.trim()) {
          error = 'Please describe the issue';
        } else if (formData.description.trim().length < 10) {
          error = 'Description must be at least 10 characters';
        } else if (formData.description.trim().length > 1000) {
          error = 'Description must be less than 1000 characters';
        }
        break;

      case 'email':
        if (formData.email && formData.email.trim()) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(formData.email.trim())) {
            error = 'Please enter a valid email address';
          }
        }
        break;

      case 'section':
        if (formData.section && formData.section.length > 50) {
          error = 'Section name must be less than 50 characters';
        }
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
    return !error;
  };

  const validateForm = (): boolean => {
    const descriptionValid = validateField('description');
    const emailValid = validateField('email');
    const sectionValid = validateField('section');

    return descriptionValid && emailValid && sectionValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      description: true,
      email: true,
      section: true,
      issueType: true,
      stadium: true,
    });

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      // Error handling done by parent component
      console.error('Form submission error:', error);
    }
  };

  const getIssueTypeLabel = (type: ReportInaccuracyFormData['issueType']): string => {
    const labels = {
      'shade-data': '☀️ Shade Data Inaccuracy',
      'section-info': '🎫 Section Information',
      'obstruction': '🏗️ Obstruction/View Issue',
      'pricing': '💰 Pricing Information',
      'other': '🔧 Other Issue',
    };
    return labels[type];
  };

  return (
    <form onSubmit={handleSubmit} className="report-inaccuracy-form">
      {/* Stadium Info (Read-only) */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Stadium
        </label>
        <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700">
          {stadiumName}
        </div>
      </div>

      {/* Section (Optional) */}
      <div className="mb-4">
        <label htmlFor="section" className="block text-sm font-medium text-gray-700 mb-1">
          Section (Optional)
        </label>
        <input
          id="section"
          type="text"
          placeholder="e.g., Section 205, Row A"
          value={formData.section}
          onChange={(e) => handleChange('section', e.target.value)}
          onBlur={() => handleBlur('section')}
          disabled={isSubmitting}
          className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            touched.section && errors.section
              ? 'border-red-500'
              : 'border-gray-300'
          }`}
        />
        {touched.section && errors.section && (
          <p className="mt-1 text-xs text-red-600">{errors.section}</p>
        )}
      </div>

      {/* Issue Type */}
      <div className="mb-4">
        <label htmlFor="issueType" className="block text-sm font-medium text-gray-700 mb-1">
          Issue Type *
        </label>
        <select
          id="issueType"
          value={formData.issueType}
          onChange={(e) => handleChange('issueType', e.target.value as ReportInaccuracyFormData['issueType'])}
          disabled={isSubmitting}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {(['shade-data', 'section-info', 'obstruction', 'pricing', 'other'] as const).map((type) => (
            <option key={type} value={type}>
              {getIssueTypeLabel(type)}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <textarea
          id="description"
          placeholder="Please describe the inaccuracy you found..."
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          onBlur={() => handleBlur('description')}
          disabled={isSubmitting}
          rows={4}
          className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            touched.description && errors.description
              ? 'border-red-500'
              : 'border-gray-300'
          }`}
        />
        <div className="flex justify-between mt-1">
          <div>
            {touched.description && errors.description && (
              <p className="text-xs text-red-600">{errors.description}</p>
            )}
          </div>
          <p className="text-xs text-gray-500">
            {formData.description.length}/1000
          </p>
        </div>
      </div>

      {/* Email (Optional) */}
      <div className="mb-6">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email (Optional)
        </label>
        <input
          id="email"
          type="email"
          placeholder="your@email.com (to receive updates)"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
          disabled={isSubmitting}
          className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            touched.email && errors.email
              ? 'border-red-500'
              : 'border-gray-300'
          }`}
        />
        {touched.email && errors.email && (
          <p className="mt-1 text-xs text-red-600">{errors.email}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          We'll use this only to follow up on your report
        </p>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </button>
      </div>

      <style jsx>{`
        .report-inaccuracy-form {
          width: 100%;
        }
      `}</style>
    </form>
  );
};

export default ReportInaccuracyForm;
