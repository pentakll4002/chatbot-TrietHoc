import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LLSXQHSXChart = ({ data }) => {
  if (!data || !data.llsx || !data.qhsx) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Chưa có dữ liệu để hiển thị
      </div>
    );
  }

  const chartData = [
    {
      name: 'Điểm số',
      'Lực lượng sản xuất (LLSX)': data.llsx,
      'Quan hệ sản xuất (QHSX)': data.qhsx,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis domain={[0, 10]} />
        <Tooltip />
        <Legend />
        <Bar dataKey="Lực lượng sản xuất (LLSX)" fill="#3B82F6" />
        <Bar dataKey="Quan hệ sản xuất (QHSX)" fill="#EF4444" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default LLSXQHSXChart;

