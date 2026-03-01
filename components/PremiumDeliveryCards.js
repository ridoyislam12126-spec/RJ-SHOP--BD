'use client';
import { useState } from 'react';

export default function PremiumDeliveryCards({ onSelect, defaultValue = 'dhaka' }) {
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
          className={`relative flex items-center w-full p-5 sm:p-6 rounded-2xl cursor-pointer transition-all duration-300 ease-in-out ${
            selectedOption === option.id
              ? 'bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300 shadow-lg shadow-blue-100 scale-[1.02]'
              : 'bg-gradient-to-br from-white to-blue-25 border border-gray-200 shadow-md hover:shadow-lg'
          }`}
          onClick={() => handleSelect(option.id)}
        >
          {/* Truck Icon */}
          <div className={`flex items-center justify-center w-10 h-10 rounded-lg mr-4 transition-colors duration-300 ${
            selectedOption === option.id
              ? 'bg-blue-100 text-blue-600'
              : 'bg-gray-100 text-gray-500'
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>

          {/* Title */}
          <div className="flex-1">
            <span className={`font-bold text-lg ${
              selectedOption === option.id
                ? 'text-blue-700'
                : 'text-gray-800'
            }`}>
              {option.title}
            </span>
          </div>

          {/* Price */}
          <div className={`text-lg font-bold ${
            selectedOption === option.id
              ? 'text-blue-700'
              : 'text-gray-700'
          }`}>
            {option.price}
          </div>
        </div>
      ))}
    </div>
  );
}