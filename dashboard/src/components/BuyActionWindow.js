import React, { useState, useContext } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid, mode }) => {
  const ctx = useContext(GeneralContext);

  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(0);

  const handleOrder = () => {
    axios.post("http://localhost:3002/newOrder", {
      name: uid,
      qty: Number(qty),
      price: Number(price),
      mode: mode,
    });

    ctx.closeBuyWindow();
  };

  return (
    <div className="container">
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />
          </fieldset>

          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              step="0.05"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Margin required ₹140.65</span>
        <div>
          <button
            className={`btn ${mode === "BUY" ? "btn-blue" : "btn-red"}`}
            onClick={handleOrder}
          >
            {mode}
          </button>

          <button
            className="btn btn-grey"
            onClick={ctx.closeBuyWindow}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;
