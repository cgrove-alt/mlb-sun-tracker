'use client';

import React, { useState } from 'react';
import { deleteAllUserData, logPrivacyRequest } from '../utils/dataManagement';
import styles from '../styles/PrivacyComponents.module.css';

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
      <div className={styles.deletionContainer}>
        <button
          onClick={handleInitiateDelete}
          className={styles.deleteButton}
        >
          🗑️ Delete All My Data
        </button>
        
        <div className={styles.deletionInfo}>
          <p>
            <strong>Warning:</strong> This will permanently delete all your locally stored data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.deletionContainer}>
      <div className={styles.confirmationBox}>
        <h3>⚠️ Confirm Data Deletion</h3>
        
        <p className={styles.warningText}>
          This action will permanently delete all your data and cannot be undone. 
          Please type <strong>DELETE-MY-DATA</strong> to confirm.
        </p>
        
        <input
          type="text"
          value={confirmationCode}
          onChange={(e) => setConfirmationCode(e.target.value)}
          placeholder="Type DELETE-MY-DATA"
          className={styles.confirmationInput}
          disabled={deleting}
        />
        
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={keepEssentialCookies}
            onChange={(e) => setKeepEssentialCookies(e.target.checked)}
            disabled={deleting}
          />
          Keep essential cookies for basic functionality
        </label>
        
        <div className={styles.confirmationActions}>
          <button
            onClick={handleCancelDelete}
            disabled={deleting}
            className={styles.cancelButton}
          >
            Cancel
          </button>
          
          <button
            onClick={handleConfirmDelete}
            disabled={deleting || confirmationCode !== 'DELETE-MY-DATA'}
            className={`${styles.confirmDeleteButton} ${deleting ? styles.loading : ''}`}
          >
            {deleting ? (
              <>
                <span className={styles.spinner}></span>
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