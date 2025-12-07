import { useState } from 'react';
import { analyzeDigitalSector, generatePolicySuggestions } from '../utils/groqApi';
import AnalysisDashboard from './AnalysisDashboard';
import PolicySuggestionsPanel from './PolicySuggestionsPanel';
import toast from 'react-hot-toast';

const SUGGESTED_SECTORS = [
  'Fintech',
  'Thương mại điện tử (E-commerce)',
  'AI Outsourcing',
  'Blockchain & Cryptocurrency',
  'EdTech (Giáo dục số)',
  'HealthTech (Y tế số)',
  'Gig Economy (Kinh tế nền tảng)',
  'Cloud Computing',
  'Big Data Analytics',
  'IoT (Internet of Things)'
];

function DigitalLaborInsight() {
  const [sector, setSector] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [policySuggestions, setPolicySuggestions] = useState(null);
  const [activeView, setActiveView] = useState('form'); // 'form', 'analysis', 'policy'

  const handleAnalyze = async () => {
    if (!sector.trim()) {
      toast.error('Vui lòng nhập lĩnh vực kinh tế số');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisData(null);
    setPolicySuggestions(null);
    setActiveView('analysis');

    try {
      toast.loading('Đang phân tích với Groq AI...', { id: 'analyzing' });
      
      const result = await analyzeDigitalSector(sector);
      
      if (result.success && result.data) {
        setAnalysisData(result.data);
        toast.success('Phân tích hoàn tất!', { id: 'analyzing' });
        
        // Auto-generate policy suggestions
        toast.loading('Đang tạo gợi ý chính sách...', { id: 'policy' });
        const policyResult = await generatePolicySuggestions(result.data);
        
        if (policyResult.success && policyResult.data) {
          setPolicySuggestions(policyResult.data);
          toast.success('Gợi ý chính sách đã sẵn sàng!', { id: 'policy' });
        } else {
          toast.error('Không thể tạo gợi ý chính sách', { id: 'policy' });
        }
      } else {
        toast.error(result.error || 'Lỗi khi phân tích', { id: 'analyzing' });
        setActiveView('form');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Đã xảy ra lỗi: ' + error.message, { id: 'analyzing' });
      setActiveView('form');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSector('');
    setAnalysisData(null);
    setPolicySuggestions(null);
    setActiveView('form');
  };

  return (
    <div className="space-y-6">
      {/* Input Form */}
      {activeView === 'form' && (
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="text-center mb-10">
            <div className="inline-block mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl shadow-lg">
                <h2 className="text-4xl font-bold text-white mb-2">
                  🔍 Digital Labor Insight
                </h2>
              </div>
            </div>
            <p className="text-gray-600 text-lg mt-4">
              Phân tích mâu thuẫn giữa Lực lượng Sản xuất (LLSX) và Quan hệ Sản xuất (QHSX) trong nền kinh tế số
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <label htmlFor="sector" className="block text-base font-bold text-gray-800 mb-3">
                Nhập lĩnh vực kinh tế số:
              </label>
              <input
                id="sector"
                type="text"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
                placeholder="Ví dụ: Fintech, E-commerce, AI Outsourcing..."
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 focus:outline-none text-lg transition-all shadow-sm hover:shadow-md"
                disabled={isAnalyzing}
              />
            </div>

            <div className="mb-8">
              <p className="text-base font-bold text-gray-800 mb-4">
                💡 Gợi ý lĩnh vực:
              </p>
              <div className="flex flex-wrap gap-3">
                {SUGGESTED_SECTORS.map((suggested) => (
                  <button
                    key={suggested}
                    onClick={() => setSector(suggested)}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700 rounded-xl hover:from-blue-100 hover:to-purple-100 transition-all text-sm font-semibold shadow-sm hover:shadow-md border border-gray-200 hover:border-blue-300"
                    disabled={isAnalyzing}
                  >
                    {suggested}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !sector.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-5 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isAnalyzing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang phân tích...
                </span>
              ) : (
                '🚀 Bắt đầu phân tích'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {activeView === 'analysis' && analysisData && (
        <div className="space-y-6">
          {/* Header with navigation */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="flex-1">
                <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg mb-3">
                  <h3 className="text-2xl font-bold">
                    📊 Kết quả phân tích: {sector}
                  </h3>
                </div>
                <p className="text-gray-600 text-base leading-relaxed">{analysisData.tomTat}</p>
              </div>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 rounded-xl hover:from-gray-300 hover:to-gray-400 transition-all font-semibold shadow-md hover:shadow-lg whitespace-nowrap"
              >
                🔄 Phân tích mới
              </button>
            </div>

            {/* View Tabs */}
            <div className="flex gap-3 border-b-2 border-gray-200">
              <button
                onClick={() => setActiveView('analysis')}
                className={`px-6 py-3 font-bold transition-all rounded-t-lg ${
                  activeView === 'analysis'
                    ? 'text-blue-600 border-b-4 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                📈 Dashboard Phân tích
              </button>
              <button
                onClick={() => setActiveView('policy')}
                className={`px-6 py-3 font-bold transition-all rounded-t-lg ${
                  activeView === 'policy'
                    ? 'text-blue-600 border-b-4 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                💡 Gợi ý Chính sách
              </button>
            </div>
          </div>

          {/* Analysis Dashboard */}
          {activeView === 'analysis' && (
            <AnalysisDashboard analysisData={analysisData} sector={sector} />
          )}

          {/* Policy Suggestions */}
          {activeView === 'policy' && policySuggestions && (
            <PolicySuggestionsPanel 
              suggestions={policySuggestions}
              analysisData={analysisData}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default DigitalLaborInsight;

