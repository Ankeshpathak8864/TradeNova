import React, { useState, useContext } from "react";
import GeneralContext from "./GeneralContext";

import { Tooltip, Grow } from "@mui/material";
import { watchlist } from "../data/data";

import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { BarChartOutlined, MoreHoriz } from "@mui/icons-material";
import {DoughnutChart} from "./DoughnoutChart"; 

const WatchList = () => {
//   const data = {
//   labels: watchlist.map(stock => stock.name),
//   datasets: [
//     {
//       label: "Stock Prices",
//       data: watchlist.map(stock => Number(stock.price)),
//       backgroundColor: watchlist.map(stock =>
//         stock.isDown
//           ? "rgba(255, 99, 132, 0.6)"
//           : "rgba(75, 192, 192, 0.6)"
//       ),
//       borderWidth: 1,
//     },
//   ],
// };


const data = {
  labels: watchlist.map(stock => stock.name),
  datasets: [
    {
      data: watchlist.map(stock => Number(stock.price)),
      backgroundColor: [
        "#ff6384", // INFY
        "#36a2eb", // ONGC
        "#ffce56", // TCS
        "#4bc0c0", // KPITTECH
        "#9966ff", // QUICKHEAL
        "#ff9f40", // WIPRO
        "#c9cbcf", // M&M
        "#2ecc71", // RELIANCE
        "#e74c3c", // HUL
      ],
      borderWidth: 1,
    },
  ],
};

  return (
    <div className="watchlist-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search eg: infy, bse, nifty fut weekly, gold mcx"
          className="search"
        />
        <span className="counts">{watchlist.length} / 50</span>
      </div>

      <ul className="list">
        {watchlist.map((stock, index) => (
          <WatchListItem stock={stock} key={index} />
        ))}
      </ul>

      <DoughnutChart data={data}/>
    </div>
  );
};

export default WatchList;

const WatchListItem = ({ stock }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <li
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="item">
        <p className={stock.isDown ? "down" : "up"}>{stock.name}</p>

        <div className="itemInfo">
          <span className="percent">{stock.percent}</span>
          {stock.isDown ? (
            <KeyboardArrowDown className="down" />
          ) : (
            <KeyboardArrowUp className="up" />
          )}
          <span className="price">{stock.price}</span>
        </div>
      </div>

      {showActions && <WatchListActions uid={stock.name} />}
    </li>
  );
};

const WatchListActions = ({ uid }) => {
  const ctx = useContext(GeneralContext);

  return (
    <span className="actions">
      <Tooltip title="Buy (B)" placement="top" arrow TransitionComponent={Grow}>
        <button
          className="buy"
          onClick={() => ctx.openBuyWindow(uid, "BUY")}
        >
          Buy
        </button>
      </Tooltip>

      <Tooltip title="Sell (S)" placement="top" arrow TransitionComponent={Grow}>
        <button
          className="sell"
          onClick={() => ctx.openBuyWindow(uid, "SELL")}
        >
          Sell
        </button>
      </Tooltip>

      <Tooltip title="Analytics (A)" placement="top" arrow TransitionComponent={Grow}>
        <button className="action">
          <BarChartOutlined className="icon" />
        </button>
      </Tooltip>

      <Tooltip title="More (A)" placement="top" arrow TransitionComponent={Grow}>
        <button className="action">
          <MoreHoriz className="icon" />
        </button>
      </Tooltip>
    </span>
  );
};
