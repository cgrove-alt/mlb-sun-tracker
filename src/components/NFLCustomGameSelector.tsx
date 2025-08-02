import React, { useState } from 'react';
import { format } from 'date-fns';
import './NFLCustomGameSelector.css';

interface NFLCustomGameSelectorProps {
  selectedVenue: any;
  onGameSelect: (game: any, customDateTime: Date | null) => void;
  initialDate?: string;
  initialTime?: string;
}

const NFLCustomGameSelector: React.FC<NFLCustomGameSelectorProps> = ({
  selectedVenue,
  onGameSelect,
  initialDate = format(new Date(), 'yyyy-MM-dd'),
  initialTime = format(new Date(), 'HH:mm')
}) => {
  const [gameDate, setGameDate] = useState(initialDate);
  const [gameTime, setGameTime] = useState(initialTime);

  const handleApply = () => {
    if (gameDate && gameTime && selectedVenue) {
      const dateTime = new Date(`${gameDate}T${gameTime}:00`);
      onGameSelect(null, dateTime);
    }
  };

  return (
    <div className="nfl-custom-game-selector">
      <div className="custom-game-header">
        <h3>🏈 Select Game Date & Time</h3>
        <p>NFL schedule data is currently unavailable. Please select a date and time for shade calculations.</p>
      </div>

      <div className="custom-game-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="game-date">Game Date:</label>
            <input
              id="game-date"
              type="date"
              value={gameDate}
              onChange={(e) => setGameDate(e.target.value)}
              className="date-input"
              min={format(new Date(), 'yyyy-MM-dd')}
            />
          </div>

          <div className="form-group">
            <label htmlFor="game-time">Game Time (local):</label>
            <input
              id="game-time"
              type="time"
              value={gameTime}
              onChange={(e) => setGameTime(e.target.value)}
              className="time-input"
            />
          </div>
        </div>

        <div className="venue-info">
          <p>
            <strong>Venue:</strong> {selectedVenue?.name}
          </p>
          <p>
            <strong>Selected:</strong> {format(new Date(`${gameDate}T${gameTime}`), 'EEEE, MMMM d, yyyy')} at {gameTime}
          </p>
        </div>

        <button
          onClick={handleApply}
          className="apply-button"
          disabled={!gameDate || !gameTime || !selectedVenue}
        >
          Calculate Shade
        </button>
      </div>
    </div>
  );
};

export default NFLCustomGameSelector;