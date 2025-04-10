import React, { Component } from "react";
import "./homepageContent.scss";

class ComingSoon extends Component {
  render() {
    return (
      <div className="homePageContent" id="comingSoon">
        <div
          style={{
            backgroundColor: "white",
            marginLeft: "80px",
            marginRight: "80px",
            marginTop: "100px",
            padding: "40px",
          }}
        >
          <div id="comingSoonLogo">
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
              color: "#5D82FA", //bf5700
            }}
          >
            Coming Soon
          </div>
        </div>
      </div>
    );
  }
}

export default ComingSoon;
