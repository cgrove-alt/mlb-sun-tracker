'use client';

interface ShadeTipCardsProps {
  roofType: 'open' | 'retractable' | 'fixed';
  city: string;
  country: 'USA' | 'Mexico' | 'Canada';
}

interface Tip {
  title: string;
  body: string;
}

function getTips(roofType: string, country: string): Tip[] {
  if (roofType === 'fixed') {
    return [
      { title: 'Full shade guaranteed', body: 'This stadium has a permanent roof. No sun protection needed.' },
      { title: 'Stay hydrated', body: 'Even with shade, summer heat can be intense. Bring water.' },
    ];
  }

  if (roofType === 'retractable') {
    return [
      { title: 'Roof expected closed', body: 'FIFA typically closes retractable roofs for World Cup matches to ensure optimal conditions.' },
      { title: 'Air conditioning likely', body: 'Retractable-roof venues often have climate control. Dress in layers.' },
    ];
  }

  // Open-air tips vary by region
  const tips: Tip[] = [
    { title: 'Afternoon matches = most sun', body: 'For 12 PM and 3 PM kickoffs, the west side of the stadium typically offers the best shade as the sun moves from east to southwest.' },
    { title: 'Upper deck advantage', body: 'Upper deck seats are closer to any overhang or canopy and often get shade earlier than lower bowl seats.' },
  ];

  if (country === 'Mexico') {
    tips.push({ title: 'High altitude sun', body: 'Mexico City sits at 7,350 ft elevation. UV rays are stronger at altitude — SPF 50+ sunscreen is essential.' });
  } else if (country === 'USA') {
    tips.push({ title: 'Bring sun protection', body: 'Sunscreen (SPF 30+), a hat, and sunglasses are essentials for daytime open-air matches in summer.' });
  } else {
    tips.push({ title: 'Long summer daylight', body: 'Canadian venues have extended daylight in June/July. Even 7 PM matches may have sun exposure.' });
  }

  return tips;
}

export default function ShadeTipCards({ roofType, city, country }: ShadeTipCardsProps) {
  const tips = getTips(roofType, country);

  return (
    <section className="mt-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-3">Shade Tips for {city}</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {tips.map((tip, i) => (
          <div key={i} className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <h5 className="font-medium text-blue-900 text-sm mb-1">{tip.title}</h5>
            <p className="text-blue-800 text-sm">{tip.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
