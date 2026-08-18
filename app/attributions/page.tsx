import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Technology & Attributions | The Shadium',
  description: 'Learn about the technology and data sources that power The Shadium shade calculator, including attributions and citations.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function AttributionsPage() {
  return (
    <div className="page-container prose prose-slate max-w-prose mx-auto px-4 py-8 stack">
      <h1 className="h1 break-words md:break-normal">Technology & Attributions</h1>
      <p className="text-lg text-gray-600">
        The Shadium combines solar calculations with weather, schedule, and venue-source data.
        Each source supports a different claim; none is presented as proof of unmeasured seat geometry.
      </p>

      <section className="stack">
        <h2 className="h2">🌞 Solar Position Calculations</h2>
        
        <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg">
          <h3 className="h3 text-amber-900">NOAA Solar Calculator</h3>
          <p>
            Sun position is computed with the NOAA Global Monitoring Laboratory Solar Calculator
            (Jean Meeus, <em>Astronomical Algorithms</em>), including atmospheric refraction so
            evening shade uses the sun as it appears in the sky. Typical agreement with the
            NREL Solar Position Algorithm is within 0.01°.
          </p>
          
          <div className="mt-4 p-4 bg-white rounded-md">
            <p className="font-semibold">Academic Citation:</p>
            <p className="text-sm italic">
              Meeus, J. (1998). Astronomical Algorithms (2nd ed.). Willmann-Bell.
              Implemented following NOAA GML Solar Calculator,
              https://gml.noaa.gov/grad/solcalc/.
            </p>
            <p className="text-sm mt-2">
              <a 
                href="https://gml.noaa.gov/grad/solcalc/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                NOAA Solar Calculator
              </a>
              {' | '}
              <a 
                href="https://gml.noaa.gov/grad/solcalc/calcdetails.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Calculation details
              </a>
            </p>
          </div>
        </div>
      </section>

      <section className="stack">
        <h2 className="h2">⚾ MLB Game Data</h2>
        
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
          <h3 className="h3 text-blue-900">MLB Stats API</h3>
          <p>
            Game schedules, team information, and venue data are provided by MLB Advanced Media, L.P. 
            through the official MLB Stats API.
          </p>
          
          <div className="mt-4 p-4 bg-white rounded-md">
            <p className="font-semibold">Copyright Notice:</p>
            <p className="text-sm">
              Use of any MLB content is subject to the notice posted at{' '}
              <a 
                href="http://gdx.mlb.com/components/copyright.txt" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                http://gdx.mlb.com/components/copyright.txt
              </a>
            </p>
            <p className="text-sm mt-2 text-gray-600">
              The Shadium is not affiliated with, endorsed by, or sponsored by Major League Baseball 
              or any MLB team. All team and venue names are trademarks of their respective owners.
            </p>
          </div>
        </div>
      </section>

      <section className="stack">
        <h2 className="h2">🌤️ Weather Data</h2>
        
        <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
          <h3 className="h3 text-green-900">Open-Meteo Weather API</h3>
          <p>
            Real-time weather conditions and forecasts are provided by Open-Meteo, 
            an open-source weather API with global coverage.
          </p>
          
          <div className="mt-4 p-4 bg-white rounded-md">
            <p className="font-semibold">Attribution:</p>
            <p className="text-sm">
              Weather data by{' '}
              <a 
                href="https://open-meteo.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Open-Meteo.com
              </a>
            </p>
            <p className="text-sm mt-2">
              <strong>License:</strong> CC BY 4.0 (Attribution 4.0 International)
            </p>
            <p className="text-sm text-gray-600">
              Open-Meteo provides free weather data for non-commercial use. Commercial usage 
              requires contacting Open-Meteo for appropriate licensing.
            </p>
          </div>
        </div>
      </section>

      <section className="stack">
        <h2 className="h2">🏟️ Stadium Data</h2>
        
        <div className="bg-purple-50 border border-purple-200 p-6 rounded-lg">
          <h3 className="h3 text-purple-900">Stadium Information</h3>
          <p>
            Stadium dimensions, seating configurations, and orientation data are compiled from 
            various public sources and verified through satellite imagery and official venue information.
          </p>
          
          <ul className="list-disc list-inside text-sm space-y-1 mt-4">
            <li>Stadium coordinates and dimensions from official venue specifications</li>
            <li>Seating section data from publicly available seating charts</li>
            <li>Field orientation verified through satellite imagery analysis</li>
            <li>Shade structures and roof coverage from architectural documentation</li>
          </ul>
        </div>
      </section>

      <section className="stack">
        <h2 className="h2">🛠️ Open Source Technologies</h2>
        
        <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
          <h3 className="h3">Core Technologies</h3>
          <p>The Shadium is built with modern web technologies:</p>
          
          <ul className="list-disc list-inside space-y-2 mt-4">
            <li>
              <strong>Next.js</strong> - React framework for production
              <span className="text-sm text-gray-600"> (MIT License)</span>
            </li>
            <li>
              <strong>React</strong> - User interface library
              <span className="text-sm text-gray-600"> (MIT License)</span>
            </li>
            <li>
              <strong>TypeScript</strong> - Type-safe JavaScript
              <span className="text-sm text-gray-600"> (Apache-2.0 License)</span>
            </li>
            <li>
              <strong>Tailwind CSS</strong> - Utility-first CSS framework
              <span className="text-sm text-gray-600"> (MIT License)</span>
            </li>
            <li>
              <strong>date-fns</strong> - Date utility library
              <span className="text-sm text-gray-600"> (MIT License)</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="stack">
        <h2 className="h2">📊 Calculation Methodology</h2>
        
        <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-lg">
          <h3 className="h3 text-indigo-900">How We Calculate Shade</h3>
          
          <ol className="list-decimal list-inside space-y-3 mt-4">
            <li>
              <strong>Solar Position:</strong> Calculate the sun's azimuth and elevation using the
              NOAA Solar Calculator (Meeus) for the specific date, time, and stadium location.
            </li>
            <li>
              <strong>Shadow Projection:</strong> Project shadows from stadium structures (roof, 
              upper decks) onto seating sections using 3D geometry.
            </li>
            <li>
              <strong>Weather Adjustment:</strong> Modify sun exposure based on cloud cover and 
              precipitation probability from weather data.
            </li>
            <li>
              <strong>Time Integration:</strong> Calculate percentage of game time each section 
              will be in direct sunlight vs. shade.
            </li>
            <li>
              <strong>Comfort Scoring:</strong> Generate recommendations based on sun exposure, 
              temperature, and UV index.
            </li>
          </ol>
        </div>
      </section>

      <section className="stack">
        <h2 className="h2">⚠️ Important Disclaimers</h2>
        
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
          <ul className="list-disc list-inside space-y-2">
            <li>
              All shade calculations are <strong>estimates only</strong> and actual conditions may vary
            </li>
            <li>
              Weather conditions can significantly impact actual sun exposure
            </li>
            <li>
              Stadium modifications or renovations may not be reflected in our data
            </li>
            <li>
              Always bring sun protection regardless of our predictions
            </li>
          </ul>
          
          <p className="mt-4 text-sm">
            For complete disclaimers, please see our{' '}
            <Link href="/disclaimer" className="text-blue-600 hover:underline">
              Legal Disclaimers page
            </Link>.
          </p>
        </div>
      </section>

      <section className="stack">
        <h2 className="h2">📧 Contact & Corrections</h2>
        
        <div className="bg-gray-50 p-6 rounded-lg">
          <p>
            If you notice any inaccuracies in our data or have questions about our technology, 
            please contact us:
          </p>
          
          <div className="mt-4">
            <p className="font-semibold">Technical Support</p>
            <p className="text-sm">Email: tech@theshadium.com</p>
            <p className="text-sm mt-2">
              Visit our{' '}
              <Link href="/contact" className="text-blue-600 hover:underline">
                Contact page
              </Link>
              {' '}for more ways to reach us.
            </p>
          </div>
        </div>
      </section>

      <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg mt-8">
        <p className="text-center font-semibold">
          By using The Shadium, you acknowledge and agree to respect the intellectual property 
          rights and terms of service of all third-party data providers listed above.
        </p>
      </div>
    </div>
  );
}
