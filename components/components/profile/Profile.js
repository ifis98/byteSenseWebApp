import React, { Component } from "react";
import "./Profile.scss";
import { Spinner, Button, Form, Row, Col, Input } from "react-bootstrap";
import axios from "axios";
import { backendLink } from "../../exports/variable";
import moment from "moment";
import { user } from "../../exports/apiCalls";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editState: false,
      firstName: "",
      userInfo: "",
      lastName: "",
      email: "",
      bio: "",
      gender: "",
      DOB: "",
      emailErrorState: false,
      DOBErrorState: false,
      loading: true,
      street: "",
      city: "",
      state: "",
      zipCode: "",
      unitNo: "",
      fileUploadState: "",
      img: "",
      imgPresent: false,
      uploadErrorMessage: "",
      uploadErrorBolean: false,
    };
    this.inputReference = React.createRef();
  }

  fileUploadAction = () => this.inputReference.current.click();

  fileUploadInputChange = (e) => {
    var FileSize = e.target.files[0].size / 1024 / 1024; // in MiB
    var type = e.target.files[0].type
      .toString()
      .substring(e.target.files[0].type.lastIndexOf("/") + 1);
    if (FileSize > 3) {
      this.setState({
        uploadErrorMessage: "File size exceeds 3 MB",
        uploadErrorBolean: true,
      });
      // $(file).val(''); //for clearing with Jquery
      return;
    }

    if (type != "png" && type != "jpeg") {
      this.setState({
        uploadErrorMessage: "Corrupted file or unsupported file type.",
        uploadErrorBolean: true,
      });
      // $(file).val(''); //for clearing with Jquery
      return;
    }
    this.setState({ fileUploadState: e.target.value.replace(/^.*[\\\/]/, "") });

    console.log(type.substring(type.lastIndexOf("/") + 1));
    document.getElementById("profilePic2").src = URL.createObjectURL(
      e.target.files[0]
    );
    this.setState({
      imgPresent: false,
      uploadErrorBolean: false,
      uploadErrorMessage: "",
    });
  };

  fileSaveImage = async () => {
    var formData = new FormData();
    var imagefile = document.querySelector("#inputFile");
    formData.append("picture", imagefile.files[0]);
    user
      .userRequests()
      .uploadImage(formData)
      .then((response) => {
        this.refresh();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  resetErrors = () => {
    this.setState({
      // emailErrorState: false,
      DOBErrorState: false,
    });
  };

  componentWillMount() {
    this.getData();
  }

  getData = async () => {
    {
      user
        .userRequests()
        .getProfile()
        .then((response) => {
          console.log(response.data.profile.picture);
          if (!response.data.profile == "") {
            this.setState({
              img:
                backendLink +
                "Uploads/profilePictures/" +
                response.data.profile.picture,
            });
            if(response.data.profile.picture){
              this.setState({
                imgPresent: true
              })
            }
            else{
              this.setState({
                imgPresent: false
              })
            }
          }

          this.setState({
            firstName: !!response.data.profile.fName
              ? response.data.profile.fName
              : "",
            lastName: !!response.data.profile.lName
              ? response.data.profile.lName
              : "",
            gender: !!response.data.profile.gender
              ? response.data.profile.gender
              : "",
            bio: !!response.data.profile.bio ? response.data.profile.bio : "",
            userInfo: !!response.data.profile.user
              ? response.data.profile.user
              : "",
            DOB: !!response.data.profile.dob ? response.data.profile.dob : "",

            street: !!response.data.profile.address.street
              ? response.data.profile.address.street
              : "",
            city: !!response.data.profile.address.city
              ? response.data.profile.address.city
              : "",
            state: !!response.data.profile.address.state
              ? response.data.profile.address.state
              : "",
            zipCode: !!response.data.profile.address.zip
              ? response.data.profile.address.zip
              : "",
            unitNo: !!response.data.profile.address.unitNo
              ? response.data.profile.address.unitNo
              : "",

            loading: false,
            editState: false,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  saveChange = async () => {
    const validEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // let emailBoolean = validEmail.test(String(this.state.email).toLowerCase());
    // const validDOB = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    // let dobBoolean = validDOB.test(String(this.state.DOB));

    let dobBoolean = moment(
      String(this.state.DOB),
      "MM/DD/YYYY",
      true
    ).isValid();
    let forumError = false;
    // if (!emailBoolean) {
    //   this.setState({ emailErrorState: true });
    //   forumError = true;
    // }

    if (!dobBoolean) {
      if (!this.state.DOB == "") {
        this.setState({ DOBErrorState: true });
        forumError = true;
      }
    }

    if (!forumError) {
      let data = {
        user: { _id: this.state.userInfo },
        fName: this.state.firstName,
        lName: this.state.lastName,
        bio: this.state.bio,
        address: {
          street: this.state.street,
          unitNo: this.state.unitNo,
          city: this.state.city,
          state: this.state.state,
          zip: this.state.zipCode,
        },
        dob: this.state.DOB,
        gender: this.state.gender,
      };

      var accessToken = localStorage.getItem("token");
      user
        .userRequests()
        .updateProfile(data)
        .then((response) => {
          this.getData();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  handleChange(evt) {
    this.resetErrors();
    switch (evt.target.name) {
      case "firstName":
      case "lastName": {
        if (evt.target.value.match("^[a-zA-Z ]*$") != null) {
          this.setState({ [evt.target.name]: evt.target.value });
        }
        break;
      }
      case "DOB":
        if (evt.target.value.match("^[0-9/]*$") != null) {
          this.setState({ [evt.target.name]: evt.target.value });
        }
        break;
      case "unitNo":
      case "zipCode":
        if (evt.target.value.match("^[0-9]*$") != null) {
          this.setState({ [evt.target.name]: evt.target.value });
        }
        break;
      default:
        this.setState({ [evt.target.name]: evt.target.value });
    }
  }
  editStateChange = () => {
    this.setState({ editState: true });
  };
  refresh() {
    window.location.reload();
  }

  render() {
    return (
      <div id="profileContent">
        <div className="profileTitle">Edit Account Info</div>
        <div className="borderLine"></div>
        <div hidden={!this.state.loading} className="loadingContainer">
          <Spinner size="lg" animation="border" />
          <div>Loading...</div>
        </div>

        <div hidden={this.state.loading} className="profileContainer">
          <div className="pc1">
            <div className="profileImgTitle">User Photo</div>
            <img
              hidden={!this.state.imgPresent}
              class="circular--square"
              id="profilePic"
              onError={() => {
                this.setState({ imgPresent: false });
              }}
              src={this.state.img}
              alt={"Profile Pic"}
            />
            <img
              hidden={this.state.imgPresent}
              class="circular--square"
              id="profilePic2"
              src={require("../../assets/tempLogo.png")}
              alt={"Profile Pic"}
            />
            <div className="profileButtonContainer">
              <input
                id="inputFile"
                type="file"
                hidden
                ref={this.inputReference}
                onChange={this.fileUploadInputChange}
              />
              <Button
                hidden={this.state.fileUploadState != ""}
                variant="primary"
                onClick={this.fileUploadAction}
              >
                Upload Image
              </Button>{" "}
              <Button
                hidden={this.state.fileUploadState == ""}
                variant="success"
                onClick={this.fileSaveImage}
              >
                Save
              </Button>{" "}
              <Button
                hidden={this.state.fileUploadState == ""}
                variant="warning"
                onClick={this.refresh}
              >
                Cancel
              </Button>{" "}
              <div className="mt-2"> {this.state.fileUploadState} </div>
              {this.state.uploadErrorBolean && (
                <div className="mt-2" style={{ color: "red" }}>
                  {" "}
                  {this.state.uploadErrorMessage}{" "}
                </div>
              )}
            </div>
          </div>
          <div>
            <div className="profileEditButtonCont">
              <Button
                hidden={this.state.editState}
                className="profileEditButton"
                onClick={this.editStateChange}
                variant="link"
              >
                Edit
              </Button>
            </div>

            <Form.Group
              className="mt-3"
              as={Row}
              controlId="formPlaintextPassword"
            >
              <Form.Label className="profileLabel" column xs="12" md="2">
                Observer ID
              </Form.Label>
              <Col xs="12" md="10">
                <Form.Control
                  type="text"
                  readOnly={true}
                  name="userInfo"
                  value={this.state.userInfo}
                  onChange={this.handleChange.bind(this)}
                />
              </Col>
            </Form.Group>

            <Form.Group className="mt-3" as={Row} controlId="Name">
              <Form.Label className="profileLabel" column xs="12" md="2" lg="2">
                First Name
              </Form.Label>
              <Col xs="12" md="10" lg="4">
                <Form.Control
                  type="text"
                  readOnly={!this.state.editState}
                  name="firstName"
                  value={this.state.firstName}
                  onChange={this.handleChange.bind(this)}
                />
              </Col>
              <Form.Label className="profileLabel" column xs="12" md="2" lg="2">
                Last Name
              </Form.Label>
              <Col xs="12" md="10" lg="4">
                <Form.Control
                  type="text"
                  readOnly={!this.state.editState}
                  name="lastName"
                  value={this.state.lastName}
                  onChange={this.handleChange.bind(this)}
                />
              </Col>
            </Form.Group>
            {/*
            <Form.Group className="mt-3" as={Row} controlId="Name">
              <Form.Label
                className="profileLabel mb-md-3 mb-lg-0"
                column
                xs="12"
                md="2"
                lg="2"
              >
                Gender
              </Form.Label>

              <Col xs="12" md="10" lg="4">
                <Form.Control
                  as="select"
                  value={this.state.gender}
                  onChange={this.handleChange.bind(this)}
                  name="gender"
                  disabled={!this.state.editState}
                  custom
                >
                  <option value="female">female</option>
                  <option value="male">male</option>
                  <option value="other">other</option>
                  <option value=""></option>
                </Form.Control>
              </Col>
              <Form.Label className="profileLabel" column xs="12" md="2" lg="2">
                DOB
              </Form.Label>
              <Col xs="12" md="10" lg="4">
                <Form.Control
                  type="text"
                  readOnly={!this.state.editState}
                  name="DOB"
                  value={this.state.DOB}
                  onChange={this.handleChange.bind(this)}
                  isInvalid={this.state.DOBErrorState}
                />
                <Form.Text
                  hidden={this.state.DOBErrorState}
                  className="text-muted"
                >
                  Must be in (MM/DD/YYYY) format
                </Form.Text>
                <Form.Control.Feedback type="invalid">
                  Must be in (MM/DD/YYYY) format
                </Form.Control.Feedback>
              </Col>
            </Form.Group>

            {/* <Form.Group as={Row} controlId="formPlaintextPassword">
              <Form.Label className="profileLabel" column xs="12" md="2">
                Email
              </Form.Label>
              <Col xs="12" md="10">
                <Form.Control
                  type="text"
                  readOnly={!this.state.editState}
                  name="email"
                  value={this.state.email}
                  onChange={this.handleChange.bind(this)}
                  isInvalid={this.state.emailErrorState}
                />
                <Form.Control.Feedback type="invalid">
                  Not a valid email
                </Form.Control.Feedback>
              </Col>
            </Form.Group> 

            <Form.Group
              as={Row}
              className="mt-3"
              controlId="formPlaintextPassword"
            >
              <Form.Label className="profileLabel" column xs="12" md="2">
                Street
              </Form.Label>
              <Col xs="12" md="10">
                <Form.Control
                  type="text"
                  readOnly={!this.state.editState}
                  name="street"
                  value={this.state.street}
                  onChange={this.handleChange.bind(this)}
                />
              </Col>
            </Form.Group>

            <Form.Group className="mt-3" as={Row} controlId="Name">
              <Form.Label className="profileLabel" column xs="12" md="2" lg="2">
                City
              </Form.Label>
              <Col xs="12" md="10" lg="4">
                <Form.Control
                  type="text"
                  readOnly={!this.state.editState}
                  name="city"
                  value={this.state.city}
                  onChange={this.handleChange.bind(this)}
                />
              </Col>
              <Form.Label className="profileLabel" column xs="12" md="2" lg="2">
                State
              </Form.Label>
              <Col xs="12" md="10" lg="4">
                <Form.Control
                  type="text"
                  readOnly={!this.state.editState}
                  name="state"
                  value={this.state.state}
                  onChange={this.handleChange.bind(this)}
                />
              </Col>
            </Form.Group>

            <Form.Group className="mt-3" as={Row} controlId="Name">
              <Form.Label className="profileLabel" column xs="12" md="2" lg="2">
                Zip
              </Form.Label>
              <Col xs="12" md="10" lg="4">
                <Form.Control
                  type="text"
                  readOnly={!this.state.editState}
                  name="zipCode"
                  value={this.state.zipCode}
                  onChange={this.handleChange.bind(this)}
                />
              </Col>
              <Form.Label className="profileLabel" column xs="12" md="2" lg="2">
                Unit No
              </Form.Label>
              <Col xs="12" md="10" lg="4">
                <Form.Control
                  type="text"
                  readOnly={!this.state.editState}
                  name="unitNo"
                  value={this.state.unitNo}
                  onChange={this.handleChange.bind(this)}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formPlaintextPassword">
              <Form.Label className="profileLabel" column xs="12" md="2">
                Bio
              </Form.Label>
              <Col xs="12" md="10">
                <Form.Control
                  as="textarea"
                  readOnly={!this.state.editState}
                  rows="5"
                  name="bio"
                  value={this.state.bio}
                  onChange={this.handleChange.bind(this)}
                />
              </Col>
            </Form.Group>
            */
              }

            <Form.Group
              as={Row}
              controlId="formPlaintextPassword"
              hidden={!this.state.editState}
            >
              <Form.Label
                className="profileLabel"
                column
                xs="12"
                md="2"
              ></Form.Label>
              <Col xs="12" md="10">
                <Row>
                  <Col className="profileButtonContainer2">
                    {" "}
                    <Button onClick={this.saveChange} variant="success">
                      Save Changes
                    </Button>{" "}
                    <Button
                      onClick={this.refresh}
                      className="ml-3"
                      variant="warning"
                    >
                      Cancel
                    </Button>{" "}
                  </Col>{" "}
                </Row>
              </Col>
            </Form.Group>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
