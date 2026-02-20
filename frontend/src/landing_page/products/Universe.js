import React from "react";

function Universe() {
  return (
    <div className="container mt-5">
      <div className="row text-center">
        <div>
          <h3>The Zerodha Universe</h3>
          <p>
            Extend your trading and investment experience even further with our
            partner platforms
          </p>
        </div>

        <div className="col-4 p-3 mt-5">
          <img
            src="/media/images/smallcaseLogo.png"
            alt="Smallcase Logo"
            style={{ height: "40px", width: "auto" }}
          />
          <p className="text-small text-muted">
            Thematic investment platform
          </p>
        </div>

        <div className="col-4 p-3 mt-5">
          <img
            src="/media/images/streakLogo.png"
            alt="Streak Logo"
            style={{ height: "40px", width: "auto" }}
          />
          <p className="text-muted">
            Algo & strategy platform
          </p>
        </div>

        <div className="col-4 p-3 mt-5">
          <img
            src="/media/images/sensibullLogo.svg"
            alt="Sensibull Logo"
            style={{ height: "40px", width: "auto" }}
          />
          <p className="text-small text-muted">
            Options trading platform
          </p>
        </div>
      </div>

      <div className="row text-center">
        <div className="col-4 p-3 mt-5">
          <img
            src="/media/images/zerodhaFundhouse.png"
            alt="Zerodha Fundhouse Logo"
            style={{ height: "40px", width: "auto" }}
          />
          <p className="text-small text-muted">
            Asset management
          </p>
        </div>

        <div className="col-4 p-3 mt-5">
          <img
            src="/media/images/goldenpiLogo.png"
            alt="GoldenPi Logo"
            style={{ height: "40px", width: "auto" }}
          />
          <p className="text-small text-muted">
            Bonds trading platform
          </p>
        </div>

        <div className="col-4 p-3 mt-5">
          <img
            src="/media/images/dittoLogo.png"
            alt="Ditto Logo"
            style={{ height: "40px", width: "auto" }}
          />
          <p className="text-small text-muted">
            Insurance
          </p>
        </div>
      </div>

      <div className="text-center mt-5">
        <button
          className="p-2 btn btn-primary fs-5"
          style={{ width: "20%", margin: "0 auto" }}
        >
          Sign up for free
        </button>
      </div>
    </div>
  );
}

export default Universe;