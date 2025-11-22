import { useState } from 'react';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error('Chỉ chấp nhận file PDF, PNG, JPEG');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Vui lòng chọn file');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await apiService.uploadAndAnalyze(file);
      setResult(response);
      toast.success('Đã phân tích file thành công');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Có lỗi xảy ra khi upload file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Upload và phân tích file</h2>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn file (PDF, PNG, JPEG)
            </label>
            <input
              type="file"
              accept=".pdf,.png,.jpeg,.jpg"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {file && (
              <p className="mt-2 text-sm text-gray-600">
                Đã chọn: {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>

          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className="w-full md:w-auto px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            {loading ? 'Đang phân tích...' : 'Upload và phân tích'}
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Kết quả phân tích</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Tên file: {result.filename}</p>
              <p className="text-sm text-gray-600">Loại: {result.content_type}</p>
              <p className="text-sm text-gray-600">Kích thước: {(result.size / 1024).toFixed(2)} KB</p>
            </div>
            <div className="prose max-w-none text-gray-700 whitespace-pre-wrap border-t pt-4">
              {result.answer}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;

