import { useState } from 'react';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';
import TimelineChart from './Charts/TimelineChart';
import { TECHNOLOGIES } from '../utils/constants';

const TimelineSimulator = () => {
  const [technology, setTechnology] = useState('');
  const [year, setYear] = useState(2024);
  const [loading, setLoading] = useState(false);
  const [timelineData, setTimelineData] = useState(null);
  const [history, setHistory] = useState([]);

  const handleAnalyze = async () => {
    if (!technology) {
      toast.error('Vui lòng chọn công nghệ');
      return;
    }

    setLoading(true);

    try {
      const techName = TECHNOLOGIES[technology]?.fullName || technology;
      const response = await apiService.analyzeTimeline(year, techName);

      const newData = {
        year,
        technology: techName,
        answer: response.answer,
      };

      // Cố gắng parse JSON từ answer
      try {
        const jsonMatch = response.answer.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          newData.llsx_level = parsed.llsx_level;
          newData.qhsx_conflict_level = parsed.qhsx_conflict_level;
          newData.issues = parsed.issues;
          newData.forecast = parsed.forecast;
          newData.analysis = parsed.analysis;
        }
      } catch (e) {
        // Không phải JSON
      }

      setHistory((prev) => {
        const updated = [...prev.filter((h) => h.year !== year), newData];
        return updated.sort((a, b) => a.year - b.year);
      });

      setTimelineData(newData);
      toast.success('Phân tích timeline hoàn tất');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Có lỗi xảy ra khi phân tích timeline');
    } finally {
      setLoading(false);
    }
  };

  const chartData = history
    .filter((h) => h.llsx_level !== undefined && h.qhsx_conflict_level !== undefined)
    .map((h) => ({
      year: h.year,
      llsx_level: h.llsx_level,
      qhsx_conflict_level: h.qhsx_conflict_level,
    }));

  return (
    <div className="w-full max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Mô phỏng mâu thuẫn LLSX - QHSX theo thời gian</h2>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Công nghệ
            </label>
            <select
              value={technology}
              onChange={(e) => setTechnology(e.target.value)}
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
              Năm: {year}
            </label>
            <input
              type="range"
              min="2020"
              max="2030"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>2020</span>
              <span>2030</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading || !technology}
          className="w-full md:w-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
        >
          {loading ? 'Đang phân tích...' : 'Phân tích năm này'}
        </button>
      </div>

      {timelineData && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Phân tích năm {timelineData.year} - {timelineData.technology}
          </h3>
          <div className="prose max-w-none text-gray-700 whitespace-pre-wrap mb-4">
            {timelineData.answer}
          </div>

          {timelineData.issues && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Các vấn đề chính:</h4>
              <ul className="list-disc list-inside space-y-1">
                {timelineData.issues.map((issue, idx) => (
                  <li key={idx}>{issue}</li>
                ))}
              </ul>
            </div>
          )}

          {timelineData.forecast && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Dự báo xu hướng:</h4>
              <p>{timelineData.forecast}</p>
            </div>
          )}
        </div>
      )}

      {chartData.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Biểu đồ thay đổi theo thời gian</h3>
          <TimelineChart data={chartData} />
        </div>
      )}
    </div>
  );
};

export default TimelineSimulator;

