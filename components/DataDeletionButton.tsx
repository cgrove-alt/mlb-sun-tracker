'use client';

import React, { useState } from 'react';
import { deleteAllUserData, logPrivacyRequest } from '../utils/dataManagement';

interface DataDeletionButtonProps {
  onDeleteComplete?: () => void;
}

const DataDeletionButton: React.FC<DataDeletionButtonProps> = ({ onDeleteComplete }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [keepEssentialCookies, setKeepEssentialCookies] = useState(false);

  const handleInitiateDelete = () => {
    setShowConfirmation(true);
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
    setConfirmationCode('');
  };

  const handleConfirmDelete = async () => {
    if (confirmationCode !== 'DELETE-MY-DATA') {
      alert('Please type DELETE-MY-DATA exactly as shown to confirm deletion.');
      return;
    }

    setDeleting(true);

    try {
      const requestId = `DELETE-${Date.now()}`;
      const result = await deleteAllUserData({
        keepEssentialCookies,
        confirmationCode
      });

      if (result.success) {
        // Log the privacy request
        logPrivacyRequest('delete', requestId);
        
        // Notify completion
        if (onDeleteComplete) {
          onDeleteComplete();
        }
        
        // Reset form
        setShowConfirmation(false);
        setConfirmationCode('');
        
        alert(`Successfully deleted ${result.deletedItems} data items. The page will now reload.`);
        
        // Reload the page to ensure clean state
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        alert(`Deletion partially failed. Errors: ${result.errors.join(', ')}`);
      }
    } catch (error) {
      console.error('Error deleting data:', error);
      alert('There was an error deleting your data. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  if (!showConfirmation) {
    return (
      <div className="my-5">
        <button
          onClick={handleInitiateDelete}
          className="w-full px-6 py-3.5 bg-[linear-gradient(135deg,#dc3545_0%,#c82333_100%)] text-white border-0 rounded-lg text-lg font-semibold cursor-pointer transition-all flex items-center justify-center gap-2 hover:bg-[linear-gradient(135deg,#c82333_0%,#b21f2d_100%)] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(220,53,69,0.3)]"
        >
          🗑️ Delete All My Data
        </button>

        <div className="mt-5 p-4 bg-amber-50 border-l-4 border-amber-500 rounded">
          <p className="m-0 text-amber-800">
            <strong>Warning:</strong> This will permanently delete all your locally stored data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-5">
      <div className="bg-white border-2 border-red-600 rounded-lg p-6 shadow-sm">
        <h3 className="text-red-600 mt-0 mb-4">⚠️ Confirm Data Deletion</h3>

        <p className="text-red-900 mb-5 leading-relaxed">
          This action will permanently delete all your data and cannot be undone.
          Please type <strong>DELETE-MY-DATA</strong> to confirm.
        </p>

        <input
          type="text"
          value={confirmationCode}
          onChange={(e) => setConfirmationCode(e.target.value)}
          placeholder="Type DELETE-MY-DATA"
          className="w-full p-3 border-2 border-gray-300 rounded-md text-base mb-4 transition-[border-color] focus:outline-none focus:border-red-600 focus:shadow-[0_0_0_3px_rgba(220,53,69,0.1)]"
          disabled={deleting}
        />

        <label className="flex items-center mb-5 cursor-pointer">
          <input
            type="checkbox"
            checked={keepEssentialCookies}
            onChange={(e) => setKeepEssentialCookies(e.target.checked)}
            disabled={deleting}
            className="mr-2"
          />
          Keep essential cookies for basic functionality
        </label>

        <div className="flex gap-3 justify-end">
          <button
            onClick={handleCancelDelete}
            disabled={deleting}
            className="px-6 py-2.5 bg-gray-500 text-white border-0 rounded-md text-base font-medium cursor-pointer transition-colors hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirmDelete}
            disabled={deleting || confirmationCode !== 'DELETE-MY-DATA'}
            className="px-6 py-2.5 bg-red-600 text-white border-0 rounded-md text-base font-semibold cursor-pointer transition-all hover:bg-red-700 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
          >
            {deleting ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                Deleting...
              </>
            ) : (
              'Permanently Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataDeletionButton;