'use client';

import React, { Component } from "react";
import {
  Nav,
  Navbar,
  NavDropdown,
  FormControl,
} from "react-bootstrap";
import styles from "../../../styles/common.module.scss";
import { connect } from "react-redux";
import { getDentistDetail } from "../../../store/reducers";
import { backendLink } from "../../../exports/variable";
import { user } from "../../../exports/apiCalls";
import { updateDoctorDetail } from "../../../actions/APIAction";

class homePageNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      img: "",
      imgPresent: false,
      doctorName: "",
    };
    this.inputReference = React.createRef();
    this.fetchData();
  }

  componentWillMount() {
    this.fetchData();
  }

  fetchData = async () => {
    try {
      user.userRequests().getProfile().then((response) => {
        if (response.data.profile) {
          const pic = response.data.profile.picture;
          const fName = response.data.profile.fName || "";
          const lName = response.data.profile.lName || "";
          this.setState({
            img: backendLink + "Uploads/profilePictures/" + pic,
            imgPresent: !!pic,
            doctorName: `${fName} ${lName}`,
          });
        }
      });
    } catch (err) {
      console.log(err);
      await this.props.updateDoctorDetail();
      this.fetchData();
    }
  };

  logOut = () => {
    window.localStorage.removeItem("token");
    window.location.href = "/login";
  };

  render() {
    return (
      <Navbar className={styles.homePageNav} style={{ height: "60px" }}>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <FormControl
          type="text"
          style={{ visibility: "hidden" }}
          placeholder="Search"
          className="mr-sm-5"
        />

        <Navbar.Collapse>
          <Nav className="mr-auto">
            <Nav.Link href="">
              <span className="material-icons">message</span>
            </Nav.Link>
            <Nav.Link id="lastIcon" href="">
              <span className="material-icons">notifications</span>
            </Nav.Link>

            <NavDropdown
              className={styles.imgNav}
              title={
                <div>
                  <img
                    hidden={!this.state.imgPresent}
                    className={styles["circular--square"]}
                    onError={() => this.setState({ imgPresent: false })}
                    src={this.state.img}
                    alt="Profile Pic"
                  />
                  <img
                    hidden={this.state.imgPresent}
                    className={styles["circular--square"]}
                    src="/tempLogo.png"
                    alt="Profile Pic"
                  />
                </div>
              }
              id="basic-nav-dropdown"
            >
              <div style={{ textAlign: "center" }}>{this.state.doctorName}</div>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
              <NavDropdown.Item onClick={this.logOut}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

const mapStateToProps = (state) => ({
  getDentistDetail: getDentistDetail(state),
});

const mapDispatchToProps = (dispatch) => ({
  updateDoctorDetail: () => dispatch(updateDoctorDetail()),
});

export default connect(mapStateToProps, mapDispatchToProps)(homePageNav);
