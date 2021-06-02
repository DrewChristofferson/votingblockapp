import React, { PureComponent } from 'react';
import * as bs from 'react-bootstrap'
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import styled from 'styled-components'

const SubtitleRow = styled(bs.Row)`
    @media(min-width: 760px){
      justify-content: center;
      display: flex;
      flex-direction: column;
    }
    @media(max-width: 759px){
      margin-left: 0;
      display: flex;
      flex-direction: column;
    }
`

const ChartTitleContainer = styled.div`
    display: flex;
    flex-direction: column;
`
const ChartTitle = styled.h6`
    font-weight: 600;
`

const data = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
];

const COLORS = ['#28A745', '#DC3545',  '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function DataPieChart(props) {
  if(props.data){
    let upVotePercentage = (props.data[0].value / (props.data[0].value + props.data[1].value)) * 100;
    return (
      <>
      <SubtitleRow >
        <ChartTitle>{(props.data[0].value + props.data[1].value).toString()} Total Ratings </ChartTitle>
        <ChartTitle>{upVotePercentage.toFixed(0)}% Would Recommend</ChartTitle>
      </SubtitleRow>
      <bs.Row style={{justifyContent: 'center'}}>
        <PieChart width={150} height={150}>
            <Pie
              data={props.data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={75}
              fill="#8884d8"
              dataKey="value"
            >
              <Tooltip />
              {props.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
      </bs.Row>
        </>
    );
  } else return null;
}
  

    

    

