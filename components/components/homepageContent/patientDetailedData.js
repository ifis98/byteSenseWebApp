"use client";

import React, { Component, createRef } from "react";
import moment from "moment";
import { Modal, Button, Card, Spinner } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import exportingInit from "highcharts/modules/exporting";
import highstockInit from "highcharts/modules/stock";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { connect } from "react-redux";
import { getPatient, getPatientId } from "../../../store/reducers";
import { doctor, user } from "../../../exports/apiCalls";
import { fillZeroRaw } from "./zeroFill";

// Initialize modules safely
if (typeof Highcharts === "object") {
  highstockInit(Highcharts);
  exportingInit(Highcharts);
  Highcharts.setOptions({ time: { useUTC: false } });
}

class PatientDetailedData extends Component {
  constructor() {
    super();
    this.$chart = createRef(null);
    this.state = {
      DateTimePickerDisabled: true,
      selectedDate2: null,
      selectedDate: null,
      min: new Date(),
      max: new Date(),
      doctorName: "",
      patientName: "",
      dataRange: "",
      elements: [],
      options: {
        chart: {
          zoomType: "x",
          events: {
            redraw: this.setDataRange.bind(this),
          },
        },
        rangeSelector: { buttons: [{ type: "day", count: 1, text: "day" }], selected: 1 },
        yAxis: { title: { text: "Grind Data" } },
        tooltip: {
          formatter: function () {
            return 'Time: ' + Highcharts.dateFormat("%A, %b, %e, %I:%M:%S %p", this.x);
          },
        },
        xAxis: {
          type: "datetime",
          dateTimeLabelFormats: {
            day: "%e of %b",
            hour: "%I:%M %p",
            minute: "%I:%M %p",
            second: "%I:%M:%S %p",
            millisecond: "%I:%M:%S:%L %p",
          },
        },
        subtitle: { text: "", x: -390, y: 44, style: { color: "#335cad" } },
        plotOptions: { series: { showInNavigator: true } },
        series: [],
      },
      loading: true,
      loading2: true,
      loading3: false,
      startDate: new Date(),
      show: false,
      totalSleepTime: "0",
      BruxismTotalEpisodes: "0",
      BruxismTotalDuration: "0",
      dataReturn: false,
      cardSelected: null,
    };
    this.redrawDisable = false;
  }

  componentDidMount() {
    this.getDailyData(this.state.startDate);
    this.getDailyReport(this.state.startDate);
    this.getPatientInfo();
    this.getDoctorInfo();
  }

  componentWillUnmount() {
    this.$chart = null;
  }

  getDoctorInfo = () => {
    user.userRequests().getProfile().then((response) => {
      this.setState({ doctorName: response.data.profile.lName || "" });
    });
  };

  getPatientInfo = () => {
    if (!this.props.getPatientId.patientDataUser) {
      window.location.href = "/patientlist";
    }
    this.setState({ patientName: this.props.getPatient.name });
  };

  setDataRange = (e) => {
    if (this.redrawDisable) {
      this.redrawDisable = false;
      return;
    }
    const chart = e.target;
    const grouping = chart.series[0]?.currentDataGrouping;
    if (grouping) {
      const currentRange = `${grouping.count} ${grouping.unitName}`;
      if (this.state.dataRange !== currentRange) {
        const options = { ...this.state.options };
        options.subtitle.text = `Data Averaged by ${currentRange}`;
        this.setState({ dataRange: currentRange, options });
        const min = chart.series[0].xAxis.min;
        const max = chart.series[0].xAxis.max;
        this.redrawDisable = true;
        chart.series[0].xAxis.setExtremes(min, max);
      }
    } else if (this.state.options.subtitle.text !== "") {
      const options = { ...this.state.options, subtitle: { text: "" } };
      this.setState({ options });
    }
  };

  formatDate(date, format) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (`0${d.getMonth() + 1}`).slice(-2);
    const day = (`0${d.getDate()}`).slice(-2);
    if (format === "YYYY/MM/DD") return `${year}/${month}/${day}`;
    if (format === "MM/DD/YYYY") return `${month}/${day}/${year}`;
    return `${year}-${month}-${day}`;
  }

  getDailyReport = (date) => {
    const dailyDate = this.formatDate(date, "YYYY/MM/DD");
    const patientId = this.props.getPatientId.patientDataUser.toString();
    doctor.doctorRequests().getDailyReport(patientId, dailyDate).then((res) => {
      const data = res.data[0] || {};
      const episodes = (data.duration_list || []).map((ep) => {
        return {
          time: new Date(ep.start).getTime(),
          time2: new Date(ep.end).getTime(),
          timeFormated: new Date(ep.start).toLocaleTimeString(),
          timeFormated2: new Date(ep.end).toLocaleTimeString(),
        };
      });
      this.setState({
        totalSleepTime: data.total_sleep_time || "0",
        BruxismTotalEpisodes: data.total_episodes || "0",
        BruxismTotalDuration: data.total_duration || "0",
        elements: episodes,
        loading2: false,
      });
    }).catch(() => this.setState({ loading2: false }));
  };

  getDailyData = (date) => {
    const formattedDate = this.formatDate(date, "MM/DD/YYYY");
    const patientId = this.props.getPatientId.patientDataUser.toString();
    const options = { ...this.state.options, series: [] };
    doctor.doctorRequests().getGrindRatio(patientId, formattedDate, 5).then((res) => {
      const data = res.data || [];
      const grindData = {};
      data.forEach((item) => {
        (item.gr || []).forEach((val, idx) => {
          const key = `gr${idx + 1}`;
          if (!grindData[key]) grindData[key] = [];
          grindData[key].push([new Date(item.ts).getTime(), val]);
        });
      });
      Object.entries(grindData).forEach(([name, series]) => {
        options.series.push({ name, data: series.sort((a, b) => a[0] - b[0]) });
      });
      const first = options.series[0]?.data?.[0]?.[0] || null;
      const last = options.series[0]?.data?.at(-1)?.[0] || null;
      this.setState({ options, loading: false, selectedDate: first, selectedDate2: last, min: first, max: last, DateTimePickerDisabled: false });
    }).catch(() => this.setState({ loading: false, DateTimePickerDisabled: true }));
  };

  secondsToHHMMSS = (sec) => {
    if (!sec) return "0";
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h > 0 ? `${h} hour${h > 1 ? "s" : ""} ` : ""}${m > 0 ? `${m} minute${m > 1 ? "s" : ""} ` : ""}${s > 0 ? `${s} second${s > 1 ? "s" : ""}` : ""}`;
  };

  render() {
    return (
      <div className="homePageContent" id="PatientDetailedData">
        <Button
          onClick={() => this.setState({ show: true })}
          style={{ marginTop: "30px" }}
          variant="primary"
          size="lg"
          block
        >
          byteSense Nightly Report
        </Button>

        <Modal
          onHide={() => this.setState({ show: false })}
          scrollable
          show={this.state.show}
          dialogClassName="modal-90w"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: "30px", color: "#023CF7", margin: "auto" }}>
              byteSense Nightly Report
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {(this.state.loading || this.state.loading2 || this.state.loading3) ? (
              <div className="loadingContainerNightlyReport">
                <Spinner size="lg" animation="border" />
                <div>Loading...</div>
              </div>
            ) : (
              <div>
                <div id="infoWrapper" className="borderModal">
                  <div>
                    <div className="userDataBANR">{this.state.patientName}</div>
                    <div className="userDataBANR">{this.formatDate(this.state.startDate, "YYYY/MM/DD")}</div>
                    <div className="infoTitleBANR">
                      Bruxism Total Episodes: <span className="infoTitleBANRSubText">{this.state.BruxismTotalEpisodes}</span>
                    </div>
                    <div className="infoTitleBANR">
                      Bruxism Total Duration: <span className="infoTitleBANRSubText">{this.secondsToHHMMSS(this.state.BruxismTotalDuration)}</span>
                    </div>
                  </div>
                  <div>
                    <div className="DesntistDataBANR">Dentist Dr. {this.state.doctorName}</div>
                  </div>
                </div>

                <div id="wrapper" className="borderModal">
                  <div id="c1">
                    <HighchartsReact
                      constructorType="stockChart"
                      highcharts={Highcharts}
                      callback={(chart) => (this.$chart.current = chart)}
                      options={this.state.options}
                    />
                  </div>

                  <div id="c2">
                    <div style={{ textAlign: "center", marginTop: "50px" }}>
                      <div style={{ marginBottom: "25px" }}>
                        <Button
                          size="lg"
                          variant="primary"
                          style={{ color: "#FFFFFF", backgroundColor: "#023CF7", marginRight: "5px" }}
                          onClick={() => this.$chart.current.series[0].xAxis.setExtremes(null, null)}
                        >
                          Zoom Out
                        </Button>
                      </div>
                      <DatePicker
                        inline
                        filterDate={(d) => moment() > d}
                        dateFormat="dd/MM/yyyy"
                        selected={this.state.startDate}
                        onChange={(date) => {
                          this.setState({ startDate: date, loading: true, loading2: true });
                          this.getDailyData(date);
                          this.getDailyReport(date);
                        }}
                      />
                    </div>
                  </div>
                </div>

                {this.state.elements.length !== 0 && (
                  <div className="borderModal" style={{ marginTop: "25px", paddingTop: "8px", paddingBottom: "40px", backgroundColor: "white" }}>
                    <Carousel
                      responsive={{
                        desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4 },
                        tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
                        mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
                      }}
                    >
                      {this.state.elements.map((value, index) => (
                        <div key={index} style={{ height: "72px" }}>
                          <a style={{ cursor: "pointer" }} onClick={() => {
                            this.setState({ cardSelected: index });
                            this.$chart.current.series[0].xAxis.setExtremes(parseInt(value.time) - 5000, parseInt(value.time2) + 5000);
                          }}>
                            <Card className="EpisodeZoomData" style={{ border: this.state.cardSelected === index ? "2px solid #5D82FA" : "" }}>
                              <div style={{ textAlign: "center", fontSize: 20, marginTop: "5px" }}>Episode {index + 1}</div>
                              <div style={{ textAlign: "center", fontSize: 15, marginTop: "5px" }}>Range: {value.timeFormated} - {value.timeFormated2}</div>
                            </Card>
                          </a>
                        </div>
                      ))}
                    </Carousel>
                  </div>
                )}
              </div>
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button
              size="md"
              variant="warning"
              style={{ color: "#FFFFFF", backgroundColor: "#023CF7" }}
              onClick={() => this.setState({ show: false })}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  getPatientId: getPatientId(state),
  getPatient: getPatient(state),
});

export default connect(mapStateToProps)(PatientDetailedData);
