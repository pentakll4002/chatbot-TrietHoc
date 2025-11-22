import { useState } from 'react';
import { TECHNOLOGIES } from '../utils/constants';

const KnowledgeCard = ({ technology, onSelect }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const tech = TECHNOLOGIES[technology];

  if (!tech) return null;

  return (
    <div
      className="relative w-full h-64 cursor-pointer perspective-1000"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Mặt trước */}
        <div className="absolute w-full h-full backface-hidden rounded-lg shadow-lg overflow-hidden bg-white">
          <div
            className="h-full bg-cover bg-center relative"
            style={{
              backgroundImage: `url(${tech.image})`,
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white p-4">
              <div className="text-6xl mb-4">{tech.icon}</div>
              <h3 className="text-2xl font-bold mb-2">{tech.name}</h3>
              <p className="text-sm text-center">{tech.fullName}</p>
              <p className="text-xs mt-2 text-gray-200">{tech.description}</p>
              <p className="text-xs mt-4 text-yellow-300">Nhấn để xem phân tích</p>
            </div>
          </div>
        </div>

        {/* Mặt sau */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-lg shadow-lg bg-gradient-to-br from-blue-50 to-purple-50 p-6 flex flex-col items-center justify-center">
          <div className="text-4xl mb-4">{tech.icon}</div>
          <h3 className="text-xl font-bold mb-4 text-gray-800">{tech.fullName}</h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(tech);
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md"
          >
            Phân tích LLSX - QHSX
          </button>
          <p className="text-xs mt-4 text-gray-600 text-center">
            Phân tích mâu thuẫn giữa lực lượng sản xuất và quan hệ sản xuất
          </p>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeCard;

