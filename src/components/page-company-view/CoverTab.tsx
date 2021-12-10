import * as React from 'react';
import useGetData from '../../hooks/useGetData';
import { Asset } from '../../types/api';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

type CoverTabProps = {
  companyId: string;
};

export default function CoverTab(props: CoverTabProps) {
  const { companyId } = props;
  const { data } = useGetData<Asset[]>(`companies/${companyId}/assets`);

  const healthScore = data?.map((asset) => asset.healthscore);
  const healthScoreSum = healthScore?.reduce((cur, acc) => acc + cur) || 0;
  const healthScoreLenght = healthScore?.length || 0;
  const averageHealthScore = healthScoreSum / healthScoreLenght;
  const averageHealthScoreLine = healthScore?.map(() => averageHealthScore);

  const maxTemp = data?.map((asset) => asset.specifications.maxTemp);
  const maxTempSum =
    maxTemp?.reduce((cur, acc) => (acc || 0) + (cur || 0)) || 0;
  const maxTempLenght = maxTemp?.length || 0;
  const averageMaxTemp = maxTempSum / maxTempLenght;
  const averageMaxTempLine = maxTemp?.map(() => averageMaxTemp);

  const uptimeData = data?.map((asset) => {
    const { totalCollectsUptime, totalUptime } = asset.metrics;
    const average = totalCollectsUptime / totalUptime;
    return { totalCollectsUptime, totalUptime, average };
  });

  const names = data?.map((asset) => asset.name);

  const chartComponentRef = React.useRef<HighchartsReact.RefObject>(null);

  return (
    <div className="company-cover-grid">
      <HighchartsReact
        highcharts={Highcharts}
        ref={chartComponentRef}
        options={{
          title: {
            text: 'Desempenho em Coletas Uptime',
          },
          yAxis: [
            {
              title: {
                text: 'Total',
              },
            },
            {
              title: {
                text: 'Coletas / Hora',
              },
              opposite: true,
            },
          ],
          xAxis: { categories: names },
          series: [
            {
              type: 'column',
              data: uptimeData?.map((asset) => asset.totalUptime),
              name: 'Horas de Coleta',
            },
            {
              type: 'column',
              data: uptimeData?.map((asset) => asset.totalCollectsUptime),
              name: 'Total de Coletas',
            },
            {
              type: 'line',
              data: uptimeData?.map((asset) => asset.average),
              name: 'Coletas/hora',
              yAxis: 1,
            },
          ],
        }}
      />
      <HighchartsReact
        highcharts={Highcharts}
        ref={chartComponentRef}
        options={{
          title: {
            text: 'Nível de Saúde dos Ativos (%)',
          },
          yAxis: { title: { text: '' }, min: 0, max: 100 },
          xAxis: { categories: names },
          series: [
            { type: 'column', data: healthScore, name: 'Níveis de Saúde' },
            { type: 'line', data: averageHealthScoreLine, name: 'Média' },
          ],
        }}
      />
      <HighchartsReact
        highcharts={Highcharts}
        ref={chartComponentRef}
        options={{
          title: {
            text: 'Temperatura Máxima dos Ativos (°C)',
          },
          yAxis: { title: { text: '' } },
          xAxis: { categories: names },
          series: [
            {
              type: 'column',
              data: healthScore,
              name: 'Temperatura Máxima',
              color: '#106BA3',
            },
            { type: 'line', data: averageMaxTempLine, name: 'Média' },
          ],
          color: 'red',
        }}
      />
    </div>
  );
}
