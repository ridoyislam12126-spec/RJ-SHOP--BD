'use client';
import { useState } from 'react';

export default function DeliveryOptionButtons({ onSelect, defaultValue = 'dhaka' }) {
  const [selectedOption, setSelectedOption] = useState(defaultValue);

  const options = [
    { id: 'dhaka', title: 'ঢাকার ভিতরে', price: '৮০৳' },
    { id: 'outside', title: 'ঢাকার বাইরে', price: '১৫০৳' }
  ];

  const handleSelect = (optionId) => {
    setSelectedOption(optionId);
    if (onSelect) {
      onSelect(optionId); // Pass the selected option to parent component
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl">
      {options.map((option) => (
        <div
          key={option.id}
          className={`relative flex items-center w-full p-6 rounded-2xl cursor-pointer transition-all duration-300 ease-in-out shadow-sm border ${
            selectedOption === option.id
              ? 'bg-blue-50 border-blue-200 shadow-md scale-[1.02]'
              : 'bg-gray-50 border-gray-200 hover:shadow-md'
          }`}
          onClick={() => handleSelect(option.id)}
        >
          {/* Selection Indicator */}
          <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 mr-4 transition-colors duration-300 ${
            selectedOption === option.id
              ? 'bg-blue-500 border-blue-500'
              : 'border-gray-300'
          }`}>
            {selectedOption === option.id && (
              <div className="w-3 h-3 bg-white rounded-full"></div>
            )}
          </div>

          {/* Title */}
          <div className="flex-1 text-lg font-medium text-gray-800 font-sans">
            {option.title}
          </div>

          {/* Price */}
          <div className="text-lg font-bold text-gray-900 font-sans">
            {option.price}
          </div>
        </div>
      ))}
    </div>
  );
}