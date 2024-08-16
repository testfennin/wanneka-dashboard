import { Pie } from 'react-chartjs-2';

const PieChart = ({ data }) => {
  console.log(data)
  const PieOption = {
    data: {
      datasets: [
        {
          data: data?.map((selling) => selling.total_sold),
          backgroundColor: ['#10B981', '#3B82F6', '#F97316', '#0EA5E9'],
          label: 'Dataset 1',
        },
      ],
      labels: data?.map((selling) => selling.name),
    },
    options: {
      responsive: true,
      cutoutPercentage: 80,
    },
    legend: {
      display: false,
    },
  };

  return (
    <div>
      <Pie {...PieOption} className="chart" />
    </div>
  );
};

export default PieChart;
