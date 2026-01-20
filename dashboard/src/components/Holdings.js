import React, { useEffect, useState } from "react";
import axios from "axios";
import { VerticalGraph } from "./VerticalGraph";


const Holdings = () => {
  const [holdings, setHoldings] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3002/holdings")
      .then(res => setHoldings(res.data));
  }, []);

const labels=holdings.map((subArray)=>subArray["name"]);
const data={
  labels,
  datasets:[
    {
      label:"Stock Price",
      // data:holdings.map((stock)=>stock.price),
      data: holdings.map(stock => Number(stock.invested)),
// data: holdings.map(stock => Number(stock.returns)),
      backgroundColor:"rgba(255,99,132,0.5)",
    }
  ]
}

  return (
    <>
      <h3 className="title">Holdings ({holdings.length})</h3>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Invested</th>
              <th>Returns</th>
              <th>P&L</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((h, i) => (
              <tr key={i}>
                <td>{h.name}</td>
                <td>{h.invested.toFixed(2)}</td>
                <td>{h.returns.toFixed(2)}</td>
                <td className={h.pnl >= 0 ? "profit" : "loss"}>
                  {h.pnl.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
<VerticalGraph data={data}/>
    </>
  );
};

export default Holdings;
