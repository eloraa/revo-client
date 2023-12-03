import { Helmet } from 'react-helmet-async';
import { useStatistics } from '../../hooks/useStatistics';
import { Error } from '../../shared/Error';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts';
import PropTypes from 'prop-types';
const CustomLegend = props => {
  const { payload, className } = props;

  return (
    <div className={className}>
      {payload.map((entry, index) => (
        <div key={`legend-${index}`} className="legend-item">
          <div className="h-20 flex items-end">
            <div
              className="legend-color w-full rounded"
              style={{
                backgroundColor: entry.color,
                height: `${entry.payload.percent * 100}%`, // Dynamically set bar height
              }}
            />
          </div>
          <span className="legend-text mt-2 inline-block" style={{ color: entry.color }}>
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};
export const Statistic = () => {
  const COLORS = ['#0016ec', '#ff4c41', '#e67b00'];
  const { statistics, isLoading, isError } = useStatistics();

  if (isLoading) <></>;
  if (isError) <Error alt={true}></Error>;
  const data = [
    { name: 'Products', value: statistics.totalProducts },
    { name: 'Reviews', value: statistics.totalReviews },
    { name: 'Users', value: statistics.totalUsers },
  ];
  return (
    <div className="md:px-10 px-5">
      <Helmet>
        <title>Statistics | REVO</title>
      </Helmet>
      <h1 className="font-mono text-2xl text-center mt-6">Statistics</h1>

      <div className="py-20">
        <ResponsiveContainer width="100%" height={600}>
          <PieChart>
            <Pie dataKey="value" isAnimationActive={false} data={data} cx="50%" cy="50%" outerRadius={120} fill="#8884d8" label>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend content={<CustomLegend className="font-mono flex items-center gap-8 justify-center" />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

CustomLegend.propTypes = {
  payload: PropTypes.arrayOf(
    PropTypes.shape({
      color: PropTypes.string,
      value: PropTypes.string,
      payload: PropTypes.object,
    })
  ),
  className: PropTypes.string,
};
