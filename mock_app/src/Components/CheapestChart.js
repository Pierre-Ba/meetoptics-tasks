import React, { useState } from "react";
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

const styles = {
  span: {
    marginLeft: "10px",
    marginRight: "10px",
  },
  title: {
    marginLeft: "20px",
  },
};

const CheapestChart = ({ data }) => {
  const LowestPrices = data
    .map((item) => {
      return {
        ...item,
        price: item.price.replace("€", "").replace(",", ".").trim(),
        diameter: item.diameter.replace("mm", "").replace('"', "").trim(),
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
    .sort((a, b) => a.price - b.price);

  console.log("Lowest Prices: ", LowestPrices);

  const Lowest7Prices = LowestPrices.slice(0, 7);
  //console.log('Lowest 7 prices: ', Lowest7Prices);

  const Lowest7PricesByDiameter6mm = LowestPrices.filter(
    (item) => item.diameter === 6 || item.diameter === 6.0
  ).slice(0, 7);

  const Lowest7PricesByDiameter30mm = LowestPrices.filter(
    (item) => item.diameter === 30 || item.diameter === 30.0
  ).slice(0, 7);

  const [Lowest7, setLowest7] = useState(Lowest7Prices);

  const diameter6handler = () => {
    setLowest7(Lowest7PricesByDiameter6mm);
  };

  const diameter30handler = () => {
    setLowest7(Lowest7PricesByDiameter30mm);
  };

  const reset = () => {
    setLowest7(Lowest7Prices);
  };

  return (
    <div>
      <h2 style={styles.title}> Thor vs Opto: cheapest products</h2>

      <ResponsiveContainer width="100%" aspect={5}>
        <BarChart
          width="100%"
          height="33%"
          data={Lowest7}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <Legend />
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
          <Tooltip />
          <Bar yAxisId="left" dataKey="price" fill="#82ca9d" />
          <Bar yAxisId="right" dataKey="diameter" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
      <span class="buttonSeparator" />
      <Button size="lg" variant="primary" onClick={diameter6handler}>
        Diameter 6mm
      </Button>
      <span class="buttonSeparator" />
      <Button size="lg" variant="primary" onClick={diameter30handler}>
        Diameter 30mm
      </Button>
      <span class="buttonSeparator" />
      <Button size="lg" variant="secondary" onClick={reset}>
        Reset
      </Button>
    </div>
  );
};

export default CheapestChart;
