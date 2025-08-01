import React, { useState } from 'react';
import { Stadium } from '../data/stadiums';
import { MLBGame } from '../services/mlbApi';
import { MiLBGame } from '../services/milbApi';
import { NFLGame } from '../services/nflApi';
import { Tooltip } from './Tooltip';
import { formatDateTimeWithTimezone } from '../utils/timeUtils';
import './ShareButton.css';

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
      return 'Check out The Shadium - Find the best shaded seats at MLB stadiums!';
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
    <div className={`share-button-container ${className}`}>
      <Tooltip content={hasContent ? "Share this stadium sun analysis" : "Select a stadium and time to share"}>
        <button
          className={`share-button ${!hasContent ? 'disabled' : ''}`}
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
        <div className="share-menu" role="menu" aria-label="Share options">
          {typeof navigator.share === 'function' && (
            <button
              className="share-menu-item"
              onClick={shareNative}
              onKeyDown={(e) => handleKeyDown(e, shareNative)}
              role="menuitem"
            >
              📱 Share
            </button>
          )}
          
          <button
            className="share-menu-item"
            onClick={copyToClipboard}
            onKeyDown={(e) => handleKeyDown(e, copyToClipboard)}
            role="menuitem"
          >
            📋 {showCopyFeedback ? 'Copied!' : 'Copy Link'}
          </button>
          
          <button
            className="share-menu-item"
            onClick={shareViaEmail}
            onKeyDown={(e) => handleKeyDown(e, shareViaEmail)}
            role="menuitem"
          >
            📧 Email
          </button>
          
          <button
            className="share-menu-item"
            onClick={shareViaTwitter}
            onKeyDown={(e) => handleKeyDown(e, shareViaTwitter)}
            role="menuitem"
          >
            🐦 Twitter
          </button>
          
          <button
            className="share-menu-item"
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
          className="share-menu-backdrop"
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