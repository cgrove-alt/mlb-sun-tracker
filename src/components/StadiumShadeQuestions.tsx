import React from 'react';
import { Stadium } from '../data/stadiums';

interface StadiumShadeQuestionsProps {
  stadium: Stadium;
}

/**
 * FAQ-style component optimized for "are my seats shaded" voice searches and featured snippets
 */
export const StadiumShadeQuestions: React.FC<StadiumShadeQuestionsProps> = ({ stadium }) => {
  const popularSections = {
    yankees: ['Field MVP', 'Legends Suite', 'Main Level 210-220', 'Bleachers 201-203'],
    dodgers: ['Field Box', 'Loge Box', 'Reserve Level', 'Top Deck'],
    redsox: ['Green Monster', 'Field Box', 'Grandstand', 'Pavilion Box'],
    cubs: ['Club Box', 'Field Box', 'Upper Deck Reserved', 'Bleachers'],
    giants: ['Club Level', 'View Box', 'Arcade', 'Bleachers'],
  };

  const sections = popularSections[stadium.id as keyof typeof popularSections] || 
    ['Field Level', 'Club Level', 'Upper Deck', 'Bleachers'];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Are My Seats Shaded at {stadium.name}? Quick Answers
      </h2>
      
      <div className="space-y-6">
        {sections.map((section, index) => (
          <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Q: Are seats in {section} shaded at {stadium.name}?
            </h3>
            <p className="text-gray-700">
              A: {section} at {stadium.name} {
                index === 0 ? 'typically gets shade during late afternoon games. Day games may have full sun exposure until the 5th or 6th inning.' :
                index === 1 ? 'often has partial shade from the overhang. Rows closer to the concourse tend to be more shaded.' :
                index === 2 ? 'usually offers the best shade coverage, especially in the back rows under the roof overhang.' :
                'can be very sunny during day games. Consider these sections for evening games when the sun is lower.'
              } Use our real-time shade calculator above for your specific game time.
            </p>
          </div>
        ))}
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">
            💡 Pro Tip: Best Shaded Seats at {stadium.name}
          </h3>
          <p className="text-blue-800">
            {stadium.roof === 'retractable' ? 
              `Since ${stadium.name} has a retractable roof, all seats are shaded when it's closed. Check the weather forecast!` :
            stadium.roof === 'fixed' ?
              `${stadium.name} has a fixed roof, so all seats are always shaded and protected from weather.` :
              `For guaranteed shade at ${stadium.name}, look for upper deck seats on the third base side, 
              especially rows 15 and higher. These typically have overhead coverage.`
            }
          </p>
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">
            Best for Day Games:
          </h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Third base side upper deck</li>
            <li>• Sections under overhangs</li>
            <li>• Behind home plate (rows 20+)</li>
          </ul>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">
            Best for Evening Games:
          </h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• First base side (shade by 3rd inning)</li>
            <li>• Any upper deck section</li>
            <li>• Club level seats</li>
          </ul>
        </div>
      </div>
    </div>
  );
};