import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const ImpactChart = ({ data }) => {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Chưa có dữ liệu tác động
      </div>
    );
  }

  const chartData = [
    { name: 'Sở hữu dữ liệu', value: data.dataOwnership || 0 },
    { name: 'Lao động', value: data.labor || 0 },
    { name: 'Phân phối giá trị', value: data.valueDistribution || 0 },
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B'];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ImpactChart;

