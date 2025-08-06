import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQs - The Shadium',
  description: 'Frequently asked questions about finding shaded seats at MLB stadiums',
};

export default function FAQsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Frequently Asked Questions</h1>
      
      <div className="space-y-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-3">How does The Shadium calculate shade?</h2>
          <p className="text-gray-600">
            We use advanced 3D modeling that takes into account the sun's position, stadium orientation, 
            roof structures, and time of day to accurately predict which sections will be in the shade 
            during any given game time.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-3">Are the shade predictions accurate?</h2>
          <p className="text-gray-600">
            Our predictions are highly accurate, using real stadium geometry and astronomical calculations. 
            However, weather conditions like clouds can affect actual shade coverage.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-3">Can I check shade for future games?</h2>
          <p className="text-gray-600">
            Yes! You can select any date and time to see predicted shade coverage for that specific game. 
            We support checking games throughout the entire season.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-3">Do you cover all MLB stadiums?</h2>
          <p className="text-gray-600">
            Yes, we provide shade information for all 30 MLB stadiums, plus many MiLB and spring training venues.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-3">How do retractable roofs affect shade?</h2>
          <p className="text-gray-600">
            For stadiums with retractable roofs, we show shade patterns for both open and closed roof configurations. 
            The actual configuration depends on weather conditions and stadium policy.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-3">What about cloudy days?</h2>
          <p className="text-gray-600">
            While our calculations show direct sun exposure, cloudy conditions will naturally provide shade 
            throughout the stadium. We integrate weather forecasts to help you plan accordingly.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-3">Can I save my favorite stadiums?</h2>
          <p className="text-gray-600">
            Yes! Create a free account to save your favorite stadiums and get quick access to shade 
            information for your most-visited ballparks.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-3">Is The Shadium free to use?</h2>
          <p className="text-gray-600">
            Yes, The Shadium is completely free to use. We're passionate about helping fans have a 
            comfortable experience at the ballpark.
          </p>
        </div>
      </div>
    </div>
  );
}