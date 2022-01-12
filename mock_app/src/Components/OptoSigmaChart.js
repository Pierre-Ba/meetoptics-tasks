import React, { useState } from "react";
import { AreaChart,  XAxis, YAxis, CartesianGrid, Tooltip, Area, ResponsiveContainer, Legend } from "recharts";
import Button from "react-bootstrap/Button";
import '../style.css'

const styles = {
  span: {
    marginLeft: "10px",
    marginRight: "10px",
  },
  title: {
    marginLeft: "20px",
  },
};

const OptoSigmaChart = ({ data }) => {
  const optoData = data.filter((item) => item.provider === "optoSigma");

  //console.log('OPTO DATA: ', optoData);
  const HighestOptoPrices = optoData
    .map((item) => {
      return {
        ...item,
        price: item.price.replace("€", "").trim(),
        focalLength: item.focalLength.replace("mm", "").trim(),
        diameter: item.diameter.replace("mm", "").trim(),
      };
    })
    .map((item) => {
      return {
        ...item,
        price: Number(item.price),
        diameter: Number(item.diameter),
        focalLength: Number(item.focalLength),
      };
    })
    .sort((a, b) => b.price - a.price);

  //console.log('HIGHEST OPTO PRICES: ', HighestOptoPrices);
  const Highest7optoPrices = HighestOptoPrices.slice(0, 7);
  //console.log('HIGHEST 7 OPTO PRICES: ', Highest7optoPrices);

  const Highest7PricesByFL70mm = HighestOptoPrices.filter(
    (item) => item.focalLength === 70
  ).slice(0, 7);
  //console.log('HIGHEST 70: ', Highest7PricesByFL70mm);
  const Highest7PricesByFL100mm = HighestOptoPrices.filter(
    (item) => item.focalLength === 100
  ).slice(0, 7);

  const [Highest7opto, setHighest7opto] = useState(Highest7optoPrices);

  const FL70handler = () => {
    setHighest7opto(Highest7PricesByFL70mm);
  };

  const FL100handler = () => {
    setHighest7opto(Highest7PricesByFL100mm);
  };

  const reset = () => {
    setHighest7opto(Highest7optoPrices);
  };

  return (
    <div>
      <h2>OptoSigma Highest Prices and Focal Length</h2>
      <ResponsiveContainer width="100%" aspect={5}>
        <AreaChart
          width="100%"
          height="33%"
          data={Highest7opto}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorUv)"
          />
          <Area
            type="monotone"
            dataKey="focalLength"
            stroke="#82ca9d"
            fillOpacity={1}
            fill="url(#colorPv)"
          />
        </AreaChart>
      </ResponsiveContainer>
      <span class="buttonSeparator" />
      <Button size="lg" variant="primary" onClick={FL70handler}>
        FL 70mm
      </Button>
      <span class="buttonSeparator" />
      <Button size="lg" variant="primary" onClick={FL100handler}>
        FL 100mm
      </Button>
      <span class="buttonSeparator" />
      <Button size="lg" variant="secondary" onClick={reset}>
        Reset
      </Button>
    </div>
  );
};

export default OptoSigmaChart;
