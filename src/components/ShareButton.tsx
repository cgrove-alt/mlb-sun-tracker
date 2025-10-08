import React, { useState } from 'react';
import { Stadium } from '../data/stadiums';
import { MLBGame } from '../services/mlbApi';
import { MiLBGame } from '../services/milbApi';
import { NFLGame } from '../services/nflApi';
import { Tooltip } from './Tooltip';
import { formatDateTimeWithTimezone } from '../utils/timeUtils';

interface ShareButtonProps {
  selectedStadium: Stadium | null;
  selectedGame: MLBGame | MiLBGame | NFLGame | null;
  gameDateTime: Date | null;
  className?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  selectedStadium,
  selectedGame,
  gameDateTime,
  className = ''
}) => {
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const generateShareUrl = () => {
    const params = new URLSearchParams();
    
    if (selectedStadium) {
      params.set('stadium', selectedStadium.id);
    }
    
    if (gameDateTime) {
      params.set('datetime', gameDateTime.toISOString());
    }
    
    if (selectedGame) {
      // Handle different game structures
      if ('gamePk' in selectedGame) {
        // MLB/MiLB game structure
        params.set('game', selectedGame.gamePk.toString());
      } else {
        // NFL game structure
        const nflGame = selectedGame as NFLGame;
        params.set('game', nflGame.gameId);
      }
    }
    
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  };

  const generateShareText = () => {
    if (!selectedStadium || !gameDateTime) {
      return 'Check out The Shadium - Find the best shaded seats at MLB, MiLB & NFL stadiums!';
    }
    
    // Format date and time with stadium's local timezone
    const timezone = selectedStadium.timezone || 'America/New_York';
    const dateTimeStr = formatDateTimeWithTimezone(gameDateTime, timezone);
    
    if (selectedGame) {
      // Handle different game structures
      let homeTeamName: string;
      let awayTeamName: string;
      
      if ('teams' in selectedGame) {
        // MLB/MiLB game structure
        homeTeamName = selectedGame.teams.home.team.name;
        awayTeamName = selectedGame.teams.away.team.name;
      } else {
        // NFL game structure
        const nflGame = selectedGame as NFLGame;
        homeTeamName = nflGame.homeTeam.name;
        awayTeamName = nflGame.awayTeam.name;
      }
      
      return `Check out The Shadium for ${awayTeamName} @ ${homeTeamName} at ${selectedStadium.name} on ${dateTimeStr} - Find the best shaded seats!`;
    } else {
      return `Check out The Shadium for ${selectedStadium.name} on ${dateTimeStr} - Find the best shaded seats!`;
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateShareUrl());
      setShowCopyFeedback(true);
      setTimeout(() => setShowCopyFeedback(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = generateShareUrl();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShowCopyFeedback(true);
      setTimeout(() => setShowCopyFeedback(false), 2000);
    }
  };

  const shareNative = async () => {
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: 'The Shadium - Find the best shaded seats',
          text: generateShareText(),
          url: generateShareUrl()
        });
      } catch (err) {
        console.error('Failed to share:', err);
      }
    }
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent('The Shadium - Find the best shaded seats');
    const body = encodeURIComponent(`${generateShareText()}\n\n${generateShareUrl()}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const shareViaTwitter = () => {
    const text = encodeURIComponent(generateShareText());
    const url = encodeURIComponent(generateShareUrl());
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`);
  };

  const shareViaFacebook = () => {
    const url = encodeURIComponent(generateShareUrl());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const hasContent = selectedStadium && gameDateTime;

  return (
    <div className={`relative inline-block ${className}`}>
      <Tooltip content={hasContent ? "Share this stadium sun analysis" : "Select a stadium and time to share"}>
        <button
          className={`
            bg-gradient-to-br from-success to-[#20c997] text-white border-0 rounded-lg py-3 px-4 text-sm font-semibold cursor-pointer
            transition-all flex items-center gap-2 min-w-[100px] justify-center shadow-md min-h-[44px] touch-manipulation
            ${hasContent ? 'hover:-translate-y-0.5 hover:shadow-lg hover:from-[#218838] hover:to-[#1abc9c] active:scale-[0.98] focus:outline focus:outline-2 focus:outline-success focus:outline-offset-2' : 'bg-gray-600 cursor-not-allowed opacity-60 shadow-none'}
            contrast-more:border-2 contrast-more:border-white
            motion-reduce:transition-none motion-reduce:hover:translate-y-0
            md:py-2 md:px-3 md:text-xs md:min-w-[80px]
          `.trim().replace(/\s+/g, ' ')}
          onClick={toggleMenu}
          onKeyDown={(e) => handleKeyDown(e, toggleMenu)}
          disabled={!hasContent}
          aria-label="Share stadium sun analysis"
          aria-expanded={isMenuOpen}
          aria-haspopup="menu"
        >
          🔗 Share
        </button>
      </Tooltip>

      {isMenuOpen && hasContent && (
        <div
          className="absolute top-full right-0 bg-white border border-gray-300 rounded-lg shadow-xl z-[1000] min-w-[160px] mt-2 py-2 animate-share-menu-slide motion-reduce:opacity-100 motion-reduce:animate-none contrast-more:border-2 contrast-more:border-black md:right-0 md:left-0 md:min-w-0 md:mt-1"
          role="menu"
          aria-label="Share options"
        >
          {typeof navigator.share === 'function' && (
            <button
              className="w-full bg-transparent border-0 py-3 px-4 text-left cursor-pointer transition-colors flex items-center gap-2 text-sm text-gray-800 min-h-[44px] touch-manipulation font-medium hover:bg-gray-100 hover:translate-x-0.5 focus:outline focus:outline-2 focus:outline-primary focus:outline-offset-[-2px] focus:bg-primary-100 contrast-more:hover:bg-black contrast-more:hover:text-white md:py-3 md:px-4 md:text-sm"
              onClick={shareNative}
              onKeyDown={(e) => handleKeyDown(e, shareNative)}
              role="menuitem"
            >
              📱 Share
            </button>
          )}

          <button
            className="w-full bg-transparent border-0 py-3 px-4 text-left cursor-pointer transition-colors flex items-center gap-2 text-sm text-gray-800 min-h-[44px] touch-manipulation font-medium hover:bg-gray-100 hover:translate-x-0.5 focus:outline focus:outline-2 focus:outline-primary focus:outline-offset-[-2px] focus:bg-primary-100 contrast-more:hover:bg-black contrast-more:hover:text-white md:py-3 md:px-4 md:text-sm"
            onClick={copyToClipboard}
            onKeyDown={(e) => handleKeyDown(e, copyToClipboard)}
            role="menuitem"
          >
            📋 {showCopyFeedback ? 'Copied!' : 'Copy Link'}
          </button>

          <button
            className="w-full bg-transparent border-0 py-3 px-4 text-left cursor-pointer transition-colors flex items-center gap-2 text-sm text-gray-800 min-h-[44px] touch-manipulation font-medium hover:bg-gray-100 hover:translate-x-0.5 focus:outline focus:outline-2 focus:outline-primary focus:outline-offset-[-2px] focus:bg-primary-100 contrast-more:hover:bg-black contrast-more:hover:text-white md:py-3 md:px-4 md:text-sm"
            onClick={shareViaEmail}
            onKeyDown={(e) => handleKeyDown(e, shareViaEmail)}
            role="menuitem"
          >
            📧 Email
          </button>

          <button
            className="w-full bg-transparent border-0 py-3 px-4 text-left cursor-pointer transition-colors flex items-center gap-2 text-sm text-gray-800 min-h-[44px] touch-manipulation font-medium hover:bg-gray-100 hover:translate-x-0.5 focus:outline focus:outline-2 focus:outline-primary focus:outline-offset-[-2px] focus:bg-primary-100 contrast-more:hover:bg-black contrast-more:hover:text-white md:py-3 md:px-4 md:text-sm"
            onClick={shareViaTwitter}
            onKeyDown={(e) => handleKeyDown(e, shareViaTwitter)}
            role="menuitem"
          >
            🐦 Twitter
          </button>

          <button
            className="w-full bg-transparent border-0 py-3 px-4 text-left cursor-pointer transition-colors flex items-center gap-2 text-sm text-gray-800 min-h-[44px] touch-manipulation font-medium hover:bg-gray-100 hover:translate-x-0.5 focus:outline focus:outline-2 focus:outline-primary focus:outline-offset-[-2px] focus:bg-primary-100 contrast-more:hover:bg-black contrast-more:hover:text-white md:py-3 md:px-4 md:text-sm"
            onClick={shareViaFacebook}
            onKeyDown={(e) => handleKeyDown(e, shareViaFacebook)}
            role="menuitem"
          >
            📘 Facebook
          </button>
        </div>
      )}

      {/* Backdrop to close menu when clicking outside */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-transparent z-[999]"
          onClick={() => setIsMenuOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setIsMenuOpen(false);
            }
          }}
          tabIndex={0}
          aria-hidden="true"
        />
      )}
    </div>
  );
};