'use client';

import React, { useState } from 'react';
import { Share2Icon, TwitterIcon, FacebookIcon, LinkIcon, CheckIcon } from '../Icons';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  hashtags?: string[];
  className?: string;
}

/**
 * ShareButtons component for social media sharing
 * Provides share buttons for Twitter, Facebook, and copy link functionality
 */
export function ShareButtons({
  url,
  title,
  description = '',
  hashtags = ['WorldCup2026', 'TheShadium'],
  className = ''
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  const hashtagString = hashtags.join(',');

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${hashtagString}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
      } catch (err) {
        // User cancelled or error occurred
        console.log('Share cancelled or failed:', err);
      }
    } else {
      setShowMenu(!showMenu);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Primary share button */}
      <button
        onClick={handleNativeShare}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium text-sm"
        aria-label="Share this page"
      >
        <Share2Icon size={16} className="w-4 h-4" />
        <span>Share</span>
      </button>

      {/* Desktop share menu (shown when native share not available) */}
      {showMenu && !navigator.share && (
        <div className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-2 z-50 min-w-[200px]">
          <div className="flex flex-col gap-1">
            {/* Twitter */}
            <a
              href={shareUrls.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200 text-sm"
              onClick={() => setShowMenu(false)}
            >
              <TwitterIcon size={16} className="w-4 h-4 text-[#1DA1F2]" />
              <span className="text-gray-900 dark:text-gray-100">Share on Twitter</span>
            </a>

            {/* Facebook */}
            <a
              href={shareUrls.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200 text-sm"
              onClick={() => setShowMenu(false)}
            >
              <FacebookIcon size={16} className="w-4 h-4 text-[#1877F2]" />
              <span className="text-gray-900 dark:text-gray-100">Share on Facebook</span>
            </a>

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200 text-sm text-left"
            >
              {copied ? (
                <>
                  <CheckIcon size={16} className="w-4 h-4 text-green-600" />
                  <span className="text-green-600 dark:text-green-400">Link copied!</span>
                </>
              ) : (
                <>
                  <LinkIcon size={16} className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-gray-900 dark:text-gray-100">Copy link</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Overlay to close menu when clicking outside */}
      {showMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMenu(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

/**
 * Compact share buttons for inline use (e.g., in cards)
 */
export function CompactShareButtons({
  url,
  title,
  description = '',
  hashtags = ['WorldCup2026', 'TheShadium'],
  className = ''
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const hashtagString = hashtags.join(',');

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${hashtagString}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
  };

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <a
        href={shareUrls.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors duration-200"
        aria-label="Share on Twitter"
        onClick={(e) => e.stopPropagation()}
      >
        <TwitterIcon size={16} className="w-4 h-4 text-[#1DA1F2]" />
      </a>

      <a
        href={shareUrls.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors duration-200"
        aria-label="Share on Facebook"
        onClick={(e) => e.stopPropagation()}
      >
        <FacebookIcon size={16} className="w-4 h-4 text-[#1877F2]" />
      </a>

      <button
        onClick={handleCopyLink}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors duration-200"
        aria-label={copied ? 'Link copied' : 'Copy link'}
      >
        {copied ? (
          <CheckIcon size={16} className="w-4 h-4 text-green-600" />
        ) : (
          <LinkIcon size={16} className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        )}
      </button>
    </div>
  );
}
