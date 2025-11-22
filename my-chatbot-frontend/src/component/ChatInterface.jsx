import { useState } from 'react';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';
import LLSXQHSXChart from './Charts/LLSXQHSXChart';
import ImpactChart from './Charts/ImpactChart';

const ChatInterface = ({ selectedTech = null }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) {
      toast.error('Vui lòng nhập câu hỏi');
      return;
    }

    setLoading(true);
    setAnswer('');
    setChartData(null);

    try {
      const response = await selectedTech
        ? await apiService.askQuestion(`${selectedTech.name}: ${question}`)
        : await apiService.askFreeQuestion(question);

      setAnswer(response.answer);

      // Cố gắng parse JSON từ answer nếu có
      try {
        const jsonMatch = response.answer.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.llsx || parsed.qhsx) {
            setChartData(parsed);
          }
        }
      } catch (e) {
        // Không phải JSON, bỏ qua
      }

      toast.success('Đã nhận được câu trả lời');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Có lỗi xảy ra khi gửi câu hỏi');
      setAnswer('Xin lỗi, có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={
              selectedTech
                ? `Đặt câu hỏi về ${selectedTech.fullName}...`
                : 'Đặt câu hỏi tùy ý về LLSX - QHSX...'
            }
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            {loading ? 'Đang xử lý...' : 'Gửi'}
          </button>
        </div>
      </form>

      {answer && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Câu trả lời:</h3>
          <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">{answer}</div>
        </div>
      )}

      {chartData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {(chartData.llsx || chartData.qhsx) && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h4 className="text-lg font-semibold mb-4">LLSX vs QHSX Compatibility</h4>
              <LLSXQHSXChart data={chartData} />
            </div>
          )}
          {(chartData.dataOwnership || chartData.labor || chartData.valueDistribution) && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h4 className="text-lg font-semibold mb-4">Tác động đa chiều</h4>
              <ImpactChart data={chartData} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatInterface;

