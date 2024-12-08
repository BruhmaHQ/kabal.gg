import React from 'react';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { 
  GridComponent, 
  TooltipComponent 
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

// Register necessary ECharts components
echarts.use([
  LineChart, 
  GridComponent, 
  TooltipComponent, 
  CanvasRenderer
]);

interface PnLChartProps {
  data: number[];
  width?: number;
  height?: number;
}

export const PNLChart: React.FC<PnLChartProps> = ({ 
  data, 
  width = 120, 
  height = 40 
}) => {
  const chartRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    
    // Calculate color based on overall trend
    const isPositive = data[data.length - 1] >= data[0];
    const color = isPositive ? '#10b981' : '#ef4444'; // Green or red

    const option = {
      grid: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      },
      xAxis: {
        show: false,
        type: 'category'
      },
      yAxis: {
        show: false,
        type: 'value'
      },
      series: [{
        type: 'line',
        data: data,
        smooth: true,
        symbol: 'none',
        lineStyle: {
          color: color,
          width: 2
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: color + '33' }, // 20% opacity
            { offset: 1, color: color + '00' }  // transparent
          ])
        }
      }],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line'
        }
      }
    };

    chart.setOption(option);

    return () => {
      chart.dispose();
    };
  }, [data]);

  return (
    <div  className=''
      ref={chartRef} 
      style={{ 
        width: `${width}px`, 
        height: `${height}px` 
      }} 
    />
  );
};