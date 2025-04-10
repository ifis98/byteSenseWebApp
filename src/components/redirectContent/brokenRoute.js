import React, { Component } from "react";
import "./brokenRoute.scss";

class BrokenRoute extends Component {
  render() {
    return (
      <div id="brokenRoute">
        <div
          style={{
            backgroundColor: "white",
            marginLeft: "80px",
            marginRight: "80px",
            marginTop: "100px",
            padding: "40px",
          }}
        >
          <div id="brokenRouteLogo">
            <img
              style={{ width: "200px" }}
              src={require("../../assets/logo.png")}
            />
          </div>

          <div
            style={{
              textAlign: "center",
              fontSize: "50px",
              fontWeight: "600",
              color: "#bf5700",
            }}
          >
            404 Not Found
          </div>
        </div>
      </div>
    );
  }
}

export default BrokenRoute;
