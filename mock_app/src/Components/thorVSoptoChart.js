import React, { useState } from "react";
import '../style.css';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";



const ThorVSoptoChart = ({ data }) => {
  //console.log("Data: ", data);

  const HighestPrices = data
    .map((item) => {
      return {
        ...item,
        price: item.price.replace("€", "").replace(",", ".").trim(),
        diameter: item.diameter.replace("mm", "").replace('"', "").trim()
      };
    })
    .map((item) => {
      item.diameter = item.diameter.includes("/")
        ? item.diameter.split("/").reduce((p, c) => p / c)
        : item.diameter;
      return {
        ...item,
        diameter: item.diameter,
      };
    })
    .map((item) => {
      return {
        ...item,
        price: Number(item.price),
        diameter: Number(item.diameter),
      };
    })
    .sort((a, b) => b.price - a.price);

  //console.log("Highest Prices: ", HighestPrices);

  const Highest7Prices = HighestPrices.slice(0, 7);

  const Highest7PricesByDiameter6mm = HighestPrices.filter(
    (item) => item.diameter === 6 || item.diameter === 6.0
  ).slice(0, 7);

  const Highest7PricesByDiameter30mm = HighestPrices.filter(
    (item) => item.diameter === 30 || item.diameter === 30.0
  ).slice(0, 7);

  //console.log("Highest 6mm", Highest7PricesByDiameter6mm);

  

  const [Highest7, setHighest7] = useState(Highest7Prices);
  
  //console.log('HIGHEST 7: ', Highest7);

  const diameter6handler = () => {
    setHighest7(Highest7PricesByDiameter6mm);
    
  };

  const diameter30handler = () => {
    setHighest7(Highest7PricesByDiameter30mm);
    console.log("we got in the func!");
    
  };

  const reset = () => {
    setHighest7(Highest7Prices);
  };



  return (
    <div>
      <h2> Most expensive products</h2>

      <ResponsiveContainer width="100%" aspect={5}>
      <BarChart 
        width="100%"
        height="33%"
        data={Highest7}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
        >
         <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" unit="$"/>
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d"/>
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="price" fill="#82ca9d" />
            <Bar yAxisId="right" dataKey="diameter" fill="#8884d8" />
            
        </BarChart>
      </ResponsiveContainer>
      <span class="buttonSeparator"/>
      <Button size="lg" variant="primary" onClick={diameter6handler}>
        Diameter 6mm
      </Button>
      <span class="buttonSeparator"/>
      <Button size="lg" variant="primary" onClick={diameter30handler}>
        Diameter 30mm
      </Button>
      <span class="buttonSeparator"/>
      <Button size="lg" variant="secondary" onClick={reset}>
        Reset
      </Button>
    </div>
  );
};

export default ThorVSoptoChart;
