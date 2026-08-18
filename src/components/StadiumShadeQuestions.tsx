import React from 'react';
import { Stadium } from '../data/stadiums';

interface StadiumShadeQuestionsProps {
  stadium: Stadium;
}

/**
 * FAQ-style component optimized for "are my seats shaded" voice searches and featured snippets
 */
export const StadiumShadeQuestions: React.FC<StadiumShadeQuestionsProps> = ({ stadium }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Are My Seats Shaded at {stadium.name}? Quick Answers
      </h2>
      
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Can the site verify my exact section or row?</h3>
          <p className="text-gray-700">Not yet. The section inventory is source-backed, but remotely reconstructed row elevations, depths, overhangs, and obstructions have not passed independent observation validation. Exact results are withheld.</p>
        </div>

        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">What can I use today?</h3>
          <p className="text-gray-700">Use astronomical sun position, broad orientation context, roof type, weather, and the published section inventory. Confirm covered rows with the venue before buying.</p>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">
            Measurement status at {stadium.name}
          </h3>
          <p className="text-blue-800">
            {stadium.roof === 'retractable' ? 
              `${stadium.name} has a retractable roof, so direct-sun exposure depends on the confirmed roof state for the event.` :
            stadium.roof === 'fixed' ?
              `${stadium.name} has a permanent roof, which blocks direct sun in the seating bowl.` :
              `No open-air section or row at ${stadium.name} is certified by the current model. Bring sun protection when venue-confirmed coverage is unavailable.`
            }
          </p>
        </div>
      </div>
      
      <p className="mt-8 text-sm text-gray-700">If avoiding sun is medically or practically important, verify the exact row with the venue and plan as though an unconfirmed seat is exposed.</p>
    </div>
  );
};
