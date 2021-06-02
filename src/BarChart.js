import React from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function DataBarChart(props) {
//   static demoUrl = 'https://codesandbox.io/s/simple-bar-chart-tpz8r';

return (
    <BarChart
      width={333}
      height={200}
      data={props.data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      {/* <Legend /> */}
      <Bar dataKey="votes" fill="#82ca9d" />
    </BarChart>
  );
}
