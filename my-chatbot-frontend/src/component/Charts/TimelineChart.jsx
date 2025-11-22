import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TimelineChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Chưa có dữ liệu timeline
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis domain={[0, 10]} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="llsx_level"
          stroke="#3B82F6"
          strokeWidth={2}
          name="Mức độ LLSX"
        />
        <Line
          type="monotone"
          dataKey="qhsx_conflict_level"
          stroke="#EF4444"
          strokeWidth={2}
          name="Mức độ xung đột QHSX"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TimelineChart;

