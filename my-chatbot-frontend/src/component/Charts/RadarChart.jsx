import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';

const CustomRadarChart = ({ tech1Data, tech2Data, tech1Name, tech2Name }) => {
  if (!tech1Data || !tech2Data) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Chưa có dữ liệu để so sánh
      </div>
    );
  }

  const chartData = [
    {
      subject: 'LLSX',
      [tech1Name]: tech1Data.llsx || 0,
      [tech2Name]: tech2Data.llsx || 0,
      fullMark: 10,
    },
    {
      subject: 'QHSX Xung đột',
      [tech1Name]: tech1Data.qhsx_conflict || 0,
      [tech2Name]: tech2Data.qhsx_conflict || 0,
      fullMark: 10,
    },
    {
      subject: 'Tác động KT',
      [tech1Name]: tech1Data.economic_impact || 0,
      [tech2Name]: tech2Data.economic_impact || 0,
      fullMark: 10,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart data={chartData}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis angle={90} domain={[0, 10]} />
        <Radar
          name={tech1Name}
          dataKey={tech1Name}
          stroke="#3B82F6"
          fill="#3B82F6"
          fillOpacity={0.6}
        />
        <Radar
          name={tech2Name}
          dataKey={tech2Name}
          stroke="#10B981"
          fill="#10B981"
          fillOpacity={0.6}
        />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default CustomRadarChart;

