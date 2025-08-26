import { Metadata } from 'next';
import Link from 'next/link';
import { MLB_STADIUMS } from '../../src/data/stadiums';

export const metadata: Metadata = {
  title: 'All MLB Stadiums - The Shadium',
  description: 'Find shaded seats at all 30 MLB stadiums',
};

const DIVISIONS = [
  { name: 'AL East', teams: ['orioles', 'redsox', 'yankees', 'rays', 'bluejays'] },
  { name: 'AL Central', teams: ['whitesox', 'guardians', 'tigers', 'royals', 'twins'] },
  { name: 'AL West', teams: ['astros', 'angels', 'athletics', 'mariners', 'rangers'] },
  { name: 'NL East', teams: ['braves', 'marlins', 'mets', 'phillies', 'nationals'] },
  { name: 'NL Central', teams: ['cubs', 'reds', 'brewers', 'pirates', 'cardinals'] },
  { name: 'NL West', teams: ['diamondbacks', 'rockies', 'dodgers', 'padres', 'giants'] },
];

export default function StadiumsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="h1 mb-4">All MLB Stadiums</h1>
      <p className="text-lg text-gray-600 mb-12 max-w-prose">
        Select a stadium to view real-time shade information and find the best seats to avoid sun exposure
      </p>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {DIVISIONS.map((division) => (
          <div key={division.name} className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
              {division.name}
            </h2>
            <div className="space-y-3">
              {division.teams.map((teamId) => {
                const stadium = MLB_STADIUMS.find(s => s.id === teamId);
                if (!stadium) return null;
                
                return (
                  <Link
                    key={stadium.id}
                    href={`/stadium/${stadium.id}`}
                    className="block group"
                  >
                    <div className="p-3 rounded-lg transition-all duration-200 hover:bg-orange-50 hover:shadow-md">
                      <h3 className="font-semibold text-gray-900 group-hover:text-orange-600">
                        {stadium.team}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {stadium.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {stadium.city}, {stadium.state}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                          {stadium.orientation}°
                        </span>
                        <span className="flex items-center gap-1">
                          {stadium.roof === 'retractable' ? '🏟️' : stadium.roof === 'fixed' ? '🏠' : '☀️'}
                          {stadium.roof === 'retractable' ? 'Retractable' : stadium.roof === 'fixed' ? 'Dome' : 'Open'}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <h2 className="h2 mb-4">Looking for Minor League Stadiums?</h2>
        <p className="text-gray-600 mb-6 max-w-prose mx-auto">
          We also cover MiLB stadiums! Use the search feature in the navigation bar to find your favorite minor league ballpark.
        </p>
      </div>
    </div>
  );
}