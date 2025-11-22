import { useState } from 'react';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';
import { TECHNOLOGIES } from '../utils/constants';

const PolicySuggestions = () => {
  const [technology, setTechnology] = useState('');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [policyData, setPolicyData] = useState(null);

  const handleGetSuggestions = async () => {
    if (!technology) {
      toast.error('Vui lòng chọn công nghệ');
      return;
    }

    setLoading(true);
    setPolicyData(null);

    try {
      const techName = TECHNOLOGIES[technology]?.fullName || technology;
      const response = await apiService.getPolicySuggestions(techName, context);

      setPolicyData({
        answer: response.answer,
        technology: response.technology,
      });

      // Cố gắng parse JSON từ answer
      try {
        const jsonMatch = response.answer.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          setPolicyData((prev) => ({
            ...prev,
            ...parsed,
          }));
        }
      } catch (e) {
        // Không phải JSON
      }

      toast.success('Đã tạo gợi ý chính sách');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Có lỗi xảy ra khi tạo gợi ý chính sách');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Gợi ý chính sách</h2>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="space-y-4">
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
              Bối cảnh (tùy chọn)
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Nhập bối cảnh cụ thể nếu có..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          onClick={handleGetSuggestions}
          disabled={loading || !technology}
          className="mt-4 w-full md:w-auto px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
        >
          {loading ? 'Đang tạo gợi ý...' : 'Tạo gợi ý chính sách'}
        </button>
      </div>

      {policyData && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Gợi ý chính sách cho {policyData.technology}
            </h3>
            <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
              {policyData.answer}
            </div>
          </div>

          {policyData.state_policies && (
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg p-6">
              <h4 className="text-lg font-semibold mb-4 text-blue-900">
                Giải pháp chính sách Nhà nước
              </h4>
              <ul className="space-y-2">
                {policyData.state_policies.map((policy, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span className="text-gray-700">{policy}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {policyData.enterprise_solutions && (
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-lg p-6">
              <h4 className="text-lg font-semibold mb-4 text-green-900">
                Giải pháp doanh nghiệp
              </h4>
              <ul className="space-y-2">
                {policyData.enterprise_solutions.map((solution, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span className="text-gray-700">{solution}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {policyData.worker_solutions && (
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-lg p-6">
              <h4 className="text-lg font-semibold mb-4 text-purple-900">
                Giải pháp người lao động
              </h4>
              <ul className="space-y-2">
                {policyData.worker_solutions.map((solution, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    <span className="text-gray-700">{solution}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {policyData.recommendations && (
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow-lg p-6">
              <h4 className="text-lg font-semibold mb-4 text-yellow-900">
                Tổng hợp khuyến nghị
              </h4>
              <p className="text-gray-700">{policyData.recommendations}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PolicySuggestions;

