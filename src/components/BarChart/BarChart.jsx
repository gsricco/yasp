import React from "react";
import "./BarChart.css";

const BarChart = ({ data }) => {
  const chartWidth = 600;
  const chartHeight = 400;

  const instances = ["dev", "test", "prod"];
  const components = ["front", "back", "db"];

  // данные для графика
  const formattedData = instances.map((instance) => {
    const total = components.reduce((sum, comp) => sum + data[instance][comp], 0);
    return { instance, total };
  });

  // максимальное значение (включая норматив)
  const maxTotal = Math.max(...formattedData.map((d) => d.total), data.norm);

  // Цвета для каждого компонента
  const colors = {
    front: "#4caf50", // Зеленый
    back: "#2196f3",  // Синий
    db: "#f44336",    // Красный
  };

  // Разница между столбцами (test - dev и prod - test)
  const differences = [
    formattedData[1].total - formattedData[0].total, // test - dev
    formattedData[2].total - formattedData[1].total, // prod - test
  ];

  return (
    <div className="chart-container">
      <svg width={chartWidth} height={chartHeight + 100}>
        {/* Основа графика */}
        <g transform="translate(50, 20)">
          {/* Сетка и шкала Y */}
          {Array.from({ length: 5 }, (_, i) => {
            const y = (chartHeight / 5) * i || 0;
            const value = Math.round((maxTotal / 5) * (5 - i));
            return (
              <g key={i}>
                <line
                  x1={0}
                  y1={y}
                  x2={chartWidth - 50}
                  y2={y}
                  stroke="#e0e0e0"
                />
                <text x={-10} y={y + 5} fontSize={10} textAnchor="end">
                  {value}
                </text>
              </g>
            );
          })}

          {/* Столбцы */}
          {formattedData.map((d, i) => {
            const barWidth = 100;
            const barX = i * (barWidth + 50);
            let yOffset = 0; // Начальное смещение для каждого столбца

            return (
              <g key={d.instance} transform={`translate(${barX}, 0)`}>
                {components.map((component) => {
                  const componentHeight = (data[d.instance][component] / maxTotal) * chartHeight;
                  const yPosition = chartHeight - componentHeight - yOffset; // Позиция Y для компонента
                  yOffset += componentHeight; // Смещаем следующий компонент вниз

                  return (
                    <>
                      <rect
                        key={component}
                        x={20}
                        y={yPosition} // Расположение каждого компонента
                        width={barWidth}
                        height={componentHeight}
                        fill={colors[component]} // Применяем цвет компонента
                      />
                      <text
                        x={70}
                        y={yPosition + 10} // Расположение текста внутри столбца
                        textAnchor="middle"
                        fontSize={12}
                      >
                        {data[d.instance][component]}
                      </text>
                    </>
                  );
                })}
                <text
                  x={70}
                  y={chartHeight + 10}
                  textAnchor="middle"
                  fontSize={12}
                >
                  {d.instance}
                </text>
              </g>
            );
          })}

          {/* Норматив */}
          <g transform={`translate(${formattedData.length * 150}, 0)`}>
            <rect
              x={20}
              y={chartHeight - (data.norm / maxTotal) * chartHeight}
              width={100}
              height={(data.norm / maxTotal) * chartHeight}
              fill="rgba(30, 136, 229, 0.3)"
              stroke="#1e88e5"
              strokeDasharray="4"
            />
            <text
              x={70}
              y={chartHeight - (data.norm / maxTotal) * chartHeight - 10}
              textAnchor="middle"
              fontSize={12}
              fill="#333"
            >
              {data.norm}
            </text>
            <text
              x={70}
              y={chartHeight + 20}
              textAnchor="middle"
              fontSize={12}
            >
              Норматив
            </text>
          </g>

          {/* Стрелки со значениями */}
          {differences.map((diff, i) => {
            const x1 = i * 150 + 100; // Начальная точка стрелки
            const x2 = x1 + 100; // Конечная точка стрелки
            const yStart = chartHeight - (formattedData[i].total / maxTotal) * chartHeight - 10; // Начало стрелки
            const yEnd = chartHeight - (formattedData[i + 1].total / maxTotal) * chartHeight - 10; // Конец стрелки

            const arrowColor = diff > 0 ? "#4caf50" : "#f44336"; // Цвет стрелки

            return (
              <g key={i}>
                {/* Линия стрелки */}
                <line
                  x1={x1}
                  y1={yStart}
                  x2={x2}
                  y2={yEnd}
                  stroke="#999"
                  strokeWidth={1}
                  markerEnd="url(#arrowHead)" // Указатель стрелки
                />
                {/* Текст с разницей */}
                <text
                  x={(x1 + x2) / 2}
                  y={(yStart + yEnd) / 2} 
                  textAnchor="middle"
                  fontSize={12}
                  fill={arrowColor}
                  style={{ fontWeight: "bold" }}
                >
                  {diff > 0 ? `↑ +${diff}` : `↓ ${diff}`}
                </text>
              </g>
            );
          })}
        </g>
        <defs>
          {/* Определение стрелки */}
          <marker
            id="arrowHead"
            markerWidth="10"
            markerHeight="7"
            refX="5"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#999" />
          </marker>
        </defs>
      </svg>
    </div>
  );
};

export default BarChart;
