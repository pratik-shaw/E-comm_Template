// components/MarqueeText.tsx
import React from 'react';

interface MarqueeTextProps {
  text: string;
}

const MarqueeText: React.FC<MarqueeTextProps> = ({ text }) => {
  return (
    <div className="bg-amber-800 text-white py-4 overflow-hidden whitespace-nowrap">
      <div className="animate-marquee inline-block">
        {[...Array(10)].map((_, index) => (
          <span key={index} className="mx-6 text-lg font-light tracking-wider">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default MarqueeText;