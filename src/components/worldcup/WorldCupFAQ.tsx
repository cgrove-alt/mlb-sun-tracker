'use client';

import { useState } from 'react';
import { WORLD_CUP_FAQ_DATA, type FAQItem } from '../../data/worldcup2026/faqData';

function FAQItemComponent({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full py-4 flex items-center justify-between text-left hover:text-purple-600 transition-colors"
      >
        <h3 className="text-lg font-medium text-gray-900 pr-4">{item.question}</h3>
        <span className={`text-2xl text-purple-500 transition-transform flex-shrink-0 ${isOpen ? 'rotate-45' : ''}`}>
          +
        </span>
      </button>
      {isOpen && (
        <div className="pb-4 text-gray-700 leading-relaxed">
          {item.answer}
        </div>
      )}
    </div>
  );
}

export default function WorldCupFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Frequently Asked Questions
      </h2>
      <div>
        {WORLD_CUP_FAQ_DATA.map((item, i) => (
          <FAQItemComponent
            key={i}
            item={item}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>
    </section>
  );
}
