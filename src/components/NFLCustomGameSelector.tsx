import React, { useState } from 'react';
import { format } from 'date-fns';

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
    <div className="p-5 bg-gray-50 rounded-lg mt-4">
      <div className="mb-6 text-center">
        <h3 className="m-0 mb-2 text-gray-900 text-[1.4rem] sm:text-xl">🏈 Select Game Date & Time</h3>
        <p className="m-0 text-gray-600 text-[0.95rem]">NFL schedule data is currently unavailable. Please select a date and time for shade calculations.</p>
      </div>

      <div className="max-w-[500px] mx-auto">
        <div className="grid grid-cols-2 gap-5 mb-6 sm:grid-cols-1 sm:gap-4">
          <div className="flex flex-col">
            <label htmlFor="game-date" className="mb-2 font-semibold text-gray-900 text-[0.95rem]">Game Date:</label>
            <input
              id="game-date"
              type="date"
              value={gameDate}
              onChange={(e) => setGameDate(e.target.value)}
              className="py-2.5 px-3 border border-gray-300 rounded text-base bg-white transition-colors focus:outline-none focus:border-primary-700 focus:shadow-[0_0_0_2px_rgba(29,78,216,0.1)]"
              min={format(new Date(), 'yyyy-MM-dd')}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="game-time" className="mb-2 font-semibold text-gray-900 text-[0.95rem]">Game Time (local):</label>
            <input
              id="game-time"
              type="time"
              value={gameTime}
              onChange={(e) => setGameTime(e.target.value)}
              className="py-2.5 px-3 border border-gray-300 rounded text-base bg-white transition-colors focus:outline-none focus:border-primary-700 focus:shadow-[0_0_0_2px_rgba(29,78,216,0.1)]"
            />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-md p-4 mb-6 text-center">
          <p className="my-1.5 text-gray-700 text-[0.95rem]">
            <strong className="text-gray-900 font-semibold">Venue:</strong> {selectedVenue?.name}
          </p>
          <p className="my-1.5 text-gray-700 text-[0.95rem]">
            <strong className="text-gray-900 font-semibold">Selected:</strong> {format(new Date(`${gameDate}T${gameTime}`), 'EEEE, MMMM d, yyyy')} at {gameTime}
          </p>
        </div>

        <button
          onClick={handleApply}
          className="w-full py-3.5 px-6 bg-primary-700 text-white border-0 rounded-md text-[1.05rem] font-semibold cursor-pointer transition-colors hover:bg-primary-800 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={!gameDate || !gameTime || !selectedVenue}
        >
          Calculate Shade
        </button>
      </div>
    </div>
  );
};

export default NFLCustomGameSelector;