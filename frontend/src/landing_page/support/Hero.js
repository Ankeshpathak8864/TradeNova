import React from "react";

function Hero() {
  return (
    <section className="container-fluid" id="supportHero">
      <div className="p-5" id="supportWrapper">
        <h4>Support Portal</h4>
        <button className="btn btn-link p-0">Track Tickets</button>
      </div>

      <div className="row p-5">
        <div className="col-6 p-5">
          <h1 className="fs-3">
            Search for an answer or browse help topics to create a ticket
          </h1>

          <input placeholder="Eg. how do I activate F&O" />
          <br />

          <button className="btn btn-link me-3 p-0">
            Track account opening
          </button>

          <button className="btn btn-link me-3 p-0">
            Track segment activation
          </button>

          <button className="btn btn-link me-3 p-0">
            Intraday margins
          </button>

          <button className="btn btn-link p-0">
            Kite user manual
          </button>
        </div>

        <div className="col-6 p-5">
          <h1 className="fs-3">Featured</h1>

          <ol>
            <li className="mb-3 mt-3">
              <button className="btn btn-link p-0">
                Current Takeovers and Delisting – January 2024
              </button>
            </li>

            <li className="mb-3 mt-3">
              <button className="btn btn-link p-0">
                Latest Intraday leverages – MIS & CO
              </button>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}

export default Hero;