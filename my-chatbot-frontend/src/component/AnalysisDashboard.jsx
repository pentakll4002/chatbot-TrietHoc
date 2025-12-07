import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import ProcessCards from './ProcessCards';

const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B'];

function AnalysisDashboard({ analysisData, sector }) {
  // Prepare data for charts
  const contradictionData = analysisData.mauThuan?.map((mt, index) => ({
    name: mt.ten,
    mucDo: mt.mucDo === 'cao' ? 3 : mt.mucDo === 'trung bình' ? 2 : 1,
    index: index + 1
  })) || [];

  const llsxDistribution = [
    { name: 'Công nghệ', value: analysisData.llsx?.congNghe?.length || 0 },
    { name: 'Lao động số', value: analysisData.llsx?.laoDongSo?.length || 0 },
    { name: 'Dữ liệu', value: analysisData.llsx?.duLieu?.length || 0 }
  ];

  const radarData = [
    {
      subject: 'Công nghệ',
      value: analysisData.llsx?.congNghe?.length || 0,
      fullMark: 10
    },
    {
      subject: 'Lao động',
      value: analysisData.llsx?.laoDongSo?.length || 0,
      fullMark: 10
    },
    {
      subject: 'Dữ liệu',
      value: analysisData.llsx?.duLieu?.length || 0,
      fullMark: 10
    },
    {
      subject: 'Sở hữu',
      value: analysisData.qhsx?.soHuuDuLieu ? 5 : 0,
      fullMark: 10
    },
    {
      subject: 'Phân phối',
      value: analysisData.qhsx?.phanPhoiLoiIch ? 5 : 0,
      fullMark: 10
    }
  ];

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all">
          <h4 className="text-lg font-bold mb-2">⚙️ Lực lượng Sản xuất</h4>
          <p className="text-4xl font-bold mb-2">
            {(analysisData.llsx?.congNghe?.length || 0) + 
             (analysisData.llsx?.laoDongSo?.length || 0) + 
             (analysisData.llsx?.duLieu?.length || 0)}
          </p>
          <p className="text-blue-100 text-sm font-medium">Yếu tố được phân tích</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all">
          <h4 className="text-lg font-bold mb-2">🤝 Quan hệ Sản xuất</h4>
          <p className="text-4xl font-bold mb-2">3</p>
          <p className="text-purple-100 text-sm font-medium">Khía cạnh chính</p>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all">
          <h4 className="text-lg font-bold mb-2">⚠️ Mâu thuẫn</h4>
          <p className="text-4xl font-bold mb-2">
            {analysisData.mauThuan?.length || 0}
          </p>
          <p className="text-pink-100 text-sm font-medium">Điểm kìm hãm phát triển</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contradictions Chart */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            📊 Mức độ mâu thuẫn
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={contradictionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="mucDo" fill="#EC4899" name="Mức độ" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* LLSX Distribution */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            📈 Phân bố LLSX
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={llsxDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {llsxDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Analysis Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LLSX Details */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-2xl font-bold text-blue-600 mb-4">
            ⚙️ Lực lượng Sản xuất (LLSX)
          </h3>
          <p className="text-gray-700 mb-4">{analysisData.llsx?.moTa}</p>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">🔧 Công nghệ:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {analysisData.llsx?.congNghe?.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">👥 Lao động số:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {analysisData.llsx?.laoDongSo?.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">📊 Dữ liệu:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {analysisData.llsx?.duLieu?.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* QHSX Details */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-2xl font-bold text-purple-600 mb-4">
            🤝 Quan hệ Sản xuất (QHSX)
          </h3>
          <p className="text-gray-700 mb-4">{analysisData.qhsx?.moTa}</p>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">🏛️ Sở hữu dữ liệu:</h4>
              <p className="text-gray-600">{analysisData.qhsx?.soHuuDuLieu}</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">💼 Hình thức lao động:</h4>
              <p className="text-gray-600">{analysisData.qhsx?.hinhThucLaoDong}</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">💰 Phân phối lợi ích:</h4>
              <p className="text-gray-600">{analysisData.qhsx?.phanPhoiLoiIch}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contradictions Details */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-2xl font-bold text-pink-600 mb-4">
          ⚠️ Mâu thuẫn kìm hãm phát triển
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysisData.mauThuan?.map((mt, idx) => (
            <div
              key={idx}
              className={`border-2 rounded-lg p-4 ${
                mt.mucDo === 'cao'
                  ? 'border-red-500 bg-red-50'
                  : mt.mucDo === 'trung bình'
                  ? 'border-yellow-500 bg-yellow-50'
                  : 'border-green-500 bg-green-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-gray-800">{mt.ten}</h4>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    mt.mucDo === 'cao'
                      ? 'bg-red-500 text-white'
                      : mt.mucDo === 'trung bình'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-green-500 text-white'
                  }`}
                >
                  {mt.mucDo.toUpperCase()}
                </span>
              </div>
              <p className="text-gray-700 text-sm mb-2">{mt.moTa}</p>
              <p className="text-gray-600 text-xs">
                <strong>Ảnh hưởng:</strong> {mt.anhHuong}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Radar Chart */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          🎯 Tổng quan đánh giá
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={90} domain={[0, 10]} />
            <Radar
              name="Giá trị"
              dataKey="value"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.6}
            />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Process Cards - Tiến trình ảnh hưởng */}
      {analysisData.tienTrinhAnhHuong && analysisData.tienTrinhAnhHuong.length > 0 && (
        <ProcessCards tienTrinhAnhHuong={analysisData.tienTrinhAnhHuong} />
      )}
    </div>
  );
}

export default AnalysisDashboard;

