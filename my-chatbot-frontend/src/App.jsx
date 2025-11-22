import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import KnowledgeCard from './component/KnowledgeCard';
import ChatInterface from './component/ChatInterface';
import ComparisonView from './component/ComparisonView';
import TimelineSimulator from './component/TimelineSimulator';
import PolicySuggestions from './component/PolicySuggestions';
import FileUpload from './component/FileUpload';
import { TECHNOLOGIES } from './utils/constants';
import './App.css';

function App() {
  const [selectedTech, setSelectedTech] = useState(null);
  const [activeTab, setActiveTab] = useState('cards');

  const handleTechSelect = (tech) => {
    setSelectedTech(tech);
    setActiveTab('chat');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-gray-800 text-center">
            🤖 Công cụ Lao động Số - Phân tích LLSX & QHSX
          </h1>
          <p className="text-center text-gray-600 mt-2">
            Phân tích mâu thuẫn giữa Lực lượng Sản xuất và Quan hệ Sản xuất
          </p>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-2 py-3">
            <button
              onClick={() => setActiveTab('cards')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === 'cards'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Knowledge Cards
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === 'chat'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Hỏi Đáp
            </button>
            <button
              onClick={() => setActiveTab('compare')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === 'compare'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              So sánh
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === 'timeline'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => setActiveTab('policy')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === 'policy'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Chính sách
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === 'upload'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Upload File
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'cards' && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
              Chọn công nghệ để phân tích
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(TECHNOLOGIES).map(([key, tech]) => (
                <KnowledgeCard
                  key={key}
                  technology={key}
                  onSelect={handleTechSelect}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div>
            {selectedTech && (
              <div className="mb-6 bg-blue-100 border border-blue-300 rounded-lg p-4">
                <p className="text-blue-800">
                  Đang phân tích: <strong>{selectedTech.fullName}</strong>
                </p>
                <button
                  onClick={() => setSelectedTech(null)}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Xóa lựa chọn
                </button>
              </div>
            )}
            <ChatInterface selectedTech={selectedTech} />
          </div>
        )}

        {activeTab === 'compare' && <ComparisonView />}

        {activeTab === 'timeline' && <TimelineSimulator />}

        {activeTab === 'policy' && <PolicySuggestions />}

        {activeTab === 'upload' && <FileUpload />}
      </main>

    </div>
  );
}

export default App;
