'use client';

import React, { Component } from "react";
import { getPatient, getPatientId } from "../../../store/reducers";
import { connect } from "react-redux";
import moment from "moment";
import PatientDetailedData from "./patientDetailedData";
import { doctor } from "../../../exports/apiCalls";
import { Line } from "react-chartjs-2";
import { Spinner, Button } from "react-bootstrap";

class PatientReport extends Component {
  state = {
    loading2: true,
    lineDataPresent: false,
    ComplianceN: "0",
    ComplianceD: "0",
    loading: true,
    patientName: "",
    dataBar: {
      labels: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      datasets: [
        {
          label: "Total Episodes",
          borderColor: "#5D82FB",
          data: [],
          fill: false,
          pointBackgroundColor: "#5D82FA",
        },
      ],
    },
    dataDoughnut: {
      labels: ["Low", "Medium", "High"],
      datasets: [
        {
          data: [3, 5, 1],
          backgroundColor: ["#F8971F", "#BF5701", "#A04400"],
          hoverBackgroundColor: ["#F8971F", "#BF5701", "#A04400"],
        },
      ],
      text: "23%",
    },
    dataLine: {
      labels: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      datasets: [
        {
          label: "Total Duration",
          data: [],
          fill: false,
          borderColor: "#5D82FB",
          pointBackgroundColor: "#5D82FA",
        },
        // {
        //   label: "Avg. Freq.",
        //   data: [],
        //   fill: false,
        //   borderColor: "#F8971E",
        // },
        // {
        //   label: "All Time",
        //   data: [],
        //   fill: false,
        //   borderColor: "Black",
        // },
      ],
    },
  };

  patientId = this.props.getPatientId.patientDataUser;

  deletePatient = async () => {
    await doctor
      .doctorRequests()
      .deletePatient(this.patientId)
      .catch((error) => {
        console.log(error);
      });
    window.location.href = "/list";
  };

  componentDidMount() {
    this.getData();
    this.getReportOfCurrentWeek();
  }

  fixdate(number) {
    if (number.toString().length == 1) {
      return "0" + number;
    } else {
      return number;
    }
  }

  dateCheck = () => {
    var hour = new Date().getHours();
    if (hour >= 19) {
      return moment();
    } else {
      return moment().subtract(1, "days");
    }
  };

  formatDate(date, format) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    if (format.toUpperCase() == "YYYY/MM/DD") {
      return [year, month, day].join("/");
    }

    if (format.toUpperCase() == "MM/DD/YYYY") {
      return [month, day, year].join("/");
    }

    if (format.toUpperCase() == "YYYY-MM-DD") {
      return [year, month, day].join("-");
    }
  }

  getReportOfCurrentWeek = async () => {
    let patientId = this.props.getPatientId.patientDataUser;
    let daysOfWeek = this.getDaysOfCurrentWeek();
    let promiseAllArray = [];
    for (let value of daysOfWeek) {
      let dailyDate = this.formatDate(value, "YYYY/MM/DD");

      promiseAllArray.push(
        await doctor.doctorRequests().getDailyReport(patientId, dailyDate)
      );
    }

    let tempEp = [];
    let tempDur = [];
    await Promise.all(promiseAllArray).then(function (values) {
      values.forEach((report) => {
        if (report.data == undefined || report.data.length == 0) {
          tempEp.push(null);
          tempDur.push(null);
        } else {
          report.data[0].total_duration
            ? tempDur.push(Number(report.data[0].total_duration))
            : tempDur.push(null);
          report.data[0].total_episodes
            ? tempEp.push(Number(report.data[0].total_episodes))
            : tempEp.push(null);
        }
      });
    });

    let dataBar = this.state.dataBar;
    let dataLine = this.state.dataLine;
    dataBar.datasets[0].data = tempEp;
    dataLine.datasets[0].data = tempDur;
    this.setState({
      dataBar,
      dataLine,
      lineDataPresent: true,
      loading2: false,
    });
  };

  getDaysOfCurrentWeek = () => {
    var currentDate = this.dateCheck();
    var weekStart = currentDate.clone().startOf("week");
    const days = [];
    for (let i = 0; i <= 6; i++) {
      days.push(moment(weekStart).add(i, "days").format("MM/DD/YYYY"));
    }
    return days;
  };

  getData = async () => {
    try {
      this.setState({
        loading: false,
        patientName: this.props.patient.name,
        ComplianceD: this.props.patient.compliance.totalDays,
        ComplianceN: this.props.patient.compliance.CompDays,
      });
    } catch (err) {
      window.location.href = "/list";
    }
  };

  render() {
    return (
      <div className="homePageContent" id="PatientReport">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div id="patientReportTitle">Patient Report</div>
          <div>
            <Button onClick={this.deletePatient} className="mt-0 mb-4" id="Remove_Patient">
              Remove Patient
            </Button>
          </div>
        </div>
        {(this.state.loading || this.state.loading2) && (
          <div className="loadingContainer">
            <Spinner size="lg" animation="border" />
            <div>Loading...</div>
          </div>
        )}
        {!this.state.loading && !this.state.loading2 && (
          <div className="patientReportContainer-two">
            <div className="patientReportContainer-box-style">
              <div className="patientReportContainer-rowTwo-grid">
                <div className="pr-2rI">
                  <span id="pr-2rImoon" className="material-icons">
                    nights_stay
                  </span>
                </div>
                <div className="ptc-tw-text">Compliance</div>
                <div className="textContainer">
                  <div className="textStyle-r2">{this.state.ComplianceN}</div>
                  <div style={{ fontSize: "24px" }}>Nights</div>
                </div>
              </div>
            </div>
            <div className="patientReportContainer-box-style">
              <div className="patientReportContainer-rowTwo-grid-2">
                <span className="material-icons">perm_contact_calendar</span>
                <div>
                  <div className="patientReport-text-two">Patient Name</div>
                  <div className="patientReport-first-text">{this.state.patientName}</div>
                </div>
              </div>
            </div>

            <div className="patientReportContainer-box-style">
              {this.state.lineDataPresent && (
                <Line
                  id="lineStyle"
                  data={this.state.dataBar}
                  options={{
                    legend: {
                      display: true,
                      position: "bottom",
                    },
                    title: {
                      display: true,
                      text: "Bruxism Total Episodes",
                      fontSize: 20,
                      fontColor: "black",
                    },
                    maintainAspectRatio: false,
                    responsive: false,
                    scales: {
                      yAxes: [{ scaleLabel: { display: true, labelString: "Episodes" } }],
                      xAxes: [{ scaleLabel: { display: true, labelString: "Night" } }],
                    },
                  }}
                  height={280}
                  width={450}
                />
              )}
            </div>
            <div className="patientReportContainer-box-style">
              <div className="App">
                {this.state.lineDataPresent && (
                  <Line
                    id="lineStyle"
                    data={this.state.dataLine}
                    options={{
                      legend: {
                        display: true,
                        position: "bottom",
                      },
                      title: {
                        display: true,
                        text: "Bruxism Total Duration",
                        fontSize: 20,
                        fontColor: "black",
                      },
                      maintainAspectRatio: false,
                      responsive: false,
                      scales: {
                        yAxes: [{ scaleLabel: { display: true, labelString: "Duration(seconds)" } }],
                        xAxes: [{ scaleLabel: { display: true, labelString: "Night" } }],
                      },
                    }}
                    height={280}
                    width={450}
                  />
                )}
              </div>
            </div>
          </div>
        )}
        {!this.state.loading && <PatientDetailedData />}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  patient: getPatient(state),
  getPatientId: getPatientId(state),
});

export default connect(mapStateToProps)(PatientReport);
