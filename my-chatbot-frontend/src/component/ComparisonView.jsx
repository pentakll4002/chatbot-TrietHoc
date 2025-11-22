import { useState } from 'react';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';
import CustomRadarChart from './Charts/RadarChart';
import { TECHNOLOGIES } from '../utils/constants';

const ComparisonView = () => {
  const [tech1, setTech1] = useState('');
  const [tech2, setTech2] = useState('');
  const [loading, setLoading] = useState(false);
  const [comparisonData, setComparisonData] = useState(null);

  const handleCompare = async () => {
    if (!tech1 || !tech2) {
      toast.error('Vui lòng chọn 2 công nghệ để so sánh');
      return;
    }

    if (tech1 === tech2) {
      toast.error('Vui lòng chọn 2 công nghệ khác nhau');
      return;
    }

    setLoading(true);
    setComparisonData(null);

    try {
      const tech1Name = TECHNOLOGIES[tech1]?.fullName || tech1;
      const tech2Name = TECHNOLOGIES[tech2]?.fullName || tech2;

      const response = await apiService.compareTechnologies(tech1Name, tech2Name);
      setComparisonData({
        answer: response.answer,
        tech1: response.tech1,
        tech2: response.tech2,
      });

      // Cố gắng parse JSON từ answer
      try {
        const jsonMatch = response.answer.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.scores) {
            setComparisonData((prev) => ({
              ...prev,
              scores: parsed.scores,
              analysis: parsed.analysis,
            }));
          }
        }
      } catch (e) {
        // Không phải JSON
      }

      toast.success('So sánh hoàn tất');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Có lỗi xảy ra khi so sánh');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">So sánh 2 công nghệ</h2>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Công nghệ 1
            </label>
            <select
              value={tech1}
              onChange={(e) => setTech1(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Chọn công nghệ...</option>
              {Object.entries(TECHNOLOGIES).map(([key, tech]) => (
                <option key={key} value={key}>
                  {tech.fullName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Công nghệ 2
            </label>
            <select
              value={tech2}
              onChange={(e) => setTech2(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Chọn công nghệ...</option>
              {Object.entries(TECHNOLOGIES).map(([key, tech]) => (
                <option key={key} value={key}>
                  {tech.fullName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleCompare}
          disabled={loading || !tech1 || !tech2}
          className="w-full md:w-auto px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
        >
          {loading ? 'Đang so sánh...' : 'So sánh'}
        </button>
      </div>

      {comparisonData && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Kết quả so sánh:</h3>
            <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
              {comparisonData.answer}
            </div>
          </div>

          {comparisonData.scores && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Biểu đồ so sánh:</h3>
              <CustomRadarChart
                tech1Data={comparisonData.scores.tech1}
                tech2Data={comparisonData.scores.tech2}
                tech1Name={comparisonData.tech1}
                tech2Name={comparisonData.tech2}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ComparisonView;

