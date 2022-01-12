import React, { useState, useEffect } from "react";
import axios from "axios";
import ThorVSoptoChart from "./Components/thorVSoptoChart";
import CheapestChart from "./Components/CheapestChart";
import OptoSigmaChart from "./Components/OptoSigmaChart";
import "bootstrap/dist/css/bootstrap.min.css";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "90%",
    marginTop: "10px",
    marginBottom: "25px",
  },
};

const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/data")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log("ERROR: ", error);
      });
  }, [data]);

  if (data.length === 0) {
    return <div>Loading...</div>;
  }
  //console.log("DATA: ", data);

  return (
    <div style={styles.container}>
      <h1>Price Comparator</h1>
      <ThorVSoptoChart data={data} />
      <div class="chartSeparator"></div>
      <CheapestChart data={data} />
      <div class="chartSeparator"></div>
      <OptoSigmaChart data={data} />
      <div class="chartSeparator"></div>
    </div>
  );
};

export default App;
