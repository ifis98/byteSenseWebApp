import React, { Component, createRef } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "./homepageContent.scss";
import moment from "moment";
import DatePicker from "react-datepicker";
import { Modal, Button, Card, Spinner } from "react-bootstrap";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { getPatient, getPatientId } from "../../reducers";
import { connect } from "react-redux";
import { doctor, user } from "../../exports/apiCalls";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import SnoozeIcon from "@mui/icons-material/Snooze";
import AlarmIcon from "@mui/icons-material/AddAlarm";
import { IconButton, InputAdornment } from "@mui/material";


import _ from "lodash"
import {fillZeroRaw} from "./zeroFill"


Highcharts.setOptions({
  time: {
    useUTC: false,
  },
});

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

        rangeSelector: {
          buttons: [
            {
              type: "day",
              count: 1,
              text: "day",
            },
          ],
          selected: 1,
        },

        yAxis: {
          title: {
            text: "Grind Data",
          },
        },
       tooltip: {
    formatter: function() {
        return ''+
                "" +
                'Time: '+ Highcharts.dateFormat('%A, %b, %e, %I:%M:%S %p', this.x);
    }
},
      
        xAxis: {
          // tooltipFormat: 'YYYY-MM-DD hh:mm',
          type: "datetime",
          startOnTick: false,
          endOnTick: false,
          dateTimeLabelFormats: {
            day: "%e of %b",
            hour: "%I:%M %p",
            minute: "%I:%M %p",
            second: "%I:%M:%S %p ",
            millisecond: "%I:%M:%S:%L %p",
          },
        },
        subtitle: {
          text: "",
          x: -390,
          y: 44,
          style: { color: "#335cad", fill: "#335cad" },
        },
        plotOptions: {
          series: {
              showInNavigator: true
          }
      },

        series: [
          // {
          //   name: "gr1",
          //   data: [],
          // },
          // {
          //   name: "gr2",
          //   data: [],
          // },
        ],
      },
      loading: true,
      loading2: true,
      loading3: false,
      startDate: new Date(),
      currentDate: new Date(),
      show: false,
      totalSleepTime: "0",
      BruxismTotalEpisodes: "0",
      BruxismTotalDuration: "0",
      reportReturn: false,
      episodesReturn: false,
      dataReturn: false,
      cardSelected: null,
      
    };
    this.redrawDisable = false
  }

  setDataRange = (e) => {
    if(this.redrawDisable){
      this.redrawDisable = false
      return
    }

    if (typeof e.target.series[0].currentDataGrouping !== "undefined") {
      let currentDataRange =
        e.target.series[0].currentDataGrouping.count +
        " " +
        e.target.series[0].currentDataGrouping.unitName;
      if (this.state.dataRange !== currentDataRange) {
        let options = _.cloneDeep(this.state.options)
        options.subtitle.text = "Data Averaged by " + currentDataRange;
        this.state.dataRange = currentDataRange
        this.state.options = options
      //console.log(this.$chart.current.series[0].xAxis.min)
      // console.log(this.$chart.current.series[0].xAxis.max)
       let tempMin = this.$chart.current.series[0].xAxis.min
       let tempMax = this.$chart.current.series[0].xAxis.max
       this.setState({ options});
       this.redrawDisable = true
       console.log(tempMin + " " + tempMax)
       this.$chart.current.series[0].xAxis.setExtremes(tempMin, tempMax)
      // console.log(this.$chart.current.series[0].xAxis.min)
      // console.log(this.$chart.current.series[0].xAxis.max)
       
      }
    } else {
      if (this.state.options.subtitle.text !== "") {
        let options = this.state.options;
        options.subtitle.text = "";
        this.state.options = options
        console.log(this.$chart.current.series[0].xAxis.min)
       console.log(this.$chart.current.series[0].xAxis.max)
       let tempMin = this.$chart.current.series[0].xAxis.min
       let tempMax = this.$chart.current.series[0].xAxis.max
        this.setState({ options });
        this.redrawDisable = true
        this.$chart.current.series[0].xAxis.setExtremes(tempMin, tempMax)
        console.log(this.$chart.current.series[0].xAxis.min)
        console.log(this.$chart.current.series[0].xAxis.max)
      }
    }
  };

  componentWillUnmount() {
    this.$chart = null;
  }

  componentDidMount() {
    this.getDailyData(this.state.startDate);
    this.getDailyReport(this.state.startDate);
    this.getPatientInfo();
    this.getDoctorInfo();
  }

  getDoctorInfo = async () => {
    {
      user
        .userRequests()
        .getProfile()
        .then((response) => {
          this.setState({
            doctorName: !!response.data.profile.lName
              ? response.data.profile.lName
              : "",
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  setDefualtValueForReport() {
    this.setState({
      totalSleepTime: "0",
      BruxismTotalEpisodes: "0",
      BruxismTotalDuration: "0",
      reportReturn: true,
      loading2: false,
      elements: [],
    });
  }

  getDailyReport = async (date) => {
    let dailyDate = this.formatDate(date, "YYYY/MM/DD");
    let patientId = this.props.getPatientId.patientDataUser.toString();

    doctor
      .doctorRequests()
      .getDailyReport(patientId, dailyDate)
      .then((response) => {
        if (response.data.length !== 0) {
          console.log(response.data)
          let listEpisodeData = [];
          if (response.data[0].duration_list !== "undefined") {
            console.log(response.data[0])
            for (let value of response.data[0].duration_list) {
              var time = new Date(value.start);
              var time2 = new Date(value.end);

              var firstTime = time.toLocaleString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              });
              var secondTime = time2.toLocaleString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              });

              var episodeObj = {
                time: new Date(value.start).getTime(),
                time2: new Date(value.end).getTime(),
                timeFormated: firstTime,
                timeFormated2: secondTime,
              };

              listEpisodeData.push(episodeObj);
            }
          }
          this.setState({
            totalSleepTime: response.data["0"].total_sleep_time,
            BruxismTotalEpisodes: response.data["0"].total_episodes,
            BruxismTotalDuration: response.data["0"].total_duration,
            reportReturn: true,
            elements: listEpisodeData,
            loading2: false,
          });
        } else {
          this.setDefualtValueForReport();
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({ reportReturn: true, loading2: false });
      });
  };

  getPatientInfo = async () => {
    if (!this.props.getPatientId.patientDataUser) {
      window.location.href = "/patientlist";
    }
    this.setState({ patientName: this.props.getPatient.name });
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

  secondsToHHMMSS(time) {
    //console.log(time);
    if (time != "0") {
      time = Number(time);
      var h = Math.floor(time / 3600);
      var m = Math.floor((time % 3600) / 60);
      var s = Math.floor((time % 3600) % 60);

      var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours ") : "";
      var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes ") : "";
      var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";

      return hDisplay + mDisplay + sDisplay;
    }
    return time;
  }
  getDailyEpisodes = async (date) => {
    let dailyDate = this.formatDate(date, "YYYY/MM/DD");
    console.log(dailyDate);
    let patientId = this.props.getPatientId.patientDataUser.toString();

    doctor
      .doctorRequests()
      .getEpisodes(patientId, dailyDate)
      .then((response) => {
        console.log("Episode");
        console.log(response);
        let listEpisodeData = [];
        if (response.data.duration_list !== undefined) {
          for (let value of response.data.duration_list) {
            var time = new Date(value[0]);
            var time2 = new Date(value[1]);

            var firstTime = time.toLocaleString("en-US", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            });
            var secondTime = time2.toLocaleString("en-US", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            });

            var episodeObj = {
              time: new Date(value[0]).getTime(),
              time2: new Date(value[1]).getTime(),
              timeFormated: firstTime,
              timeFormated2: secondTime,
            };
            listEpisodeData.push(episodeObj);
          }
        }
        this.setState({
          totalSleepTime: response.data.total_sleep,
          BruxismTotalEpisodes: response.data.total_episodes,
          BruxismTotalDuration: response.data.total_duration,
          reportReturn: true,
          elements: listEpisodeData,
          loading3: false,
        });
      })
      .catch((error) => {
        console.log("episodes error");

        console.log(error);
        this.setState({ loading3: false });
      });
  };

  returnEmptyNightlyReport(date) {
    var currentDate1 = new Date(date);
    currentDate1.setHours(19, 0, 0, 0);
    var nextDate = new Date(date);
    nextDate.setHours(19, 0, 0, 0);
    nextDate = new Date(nextDate.setDate(nextDate.getDate() + 1));
    let tempEmptyObject1 = [currentDate1.getTime(), 0];

    let tempEmptyObject2 = [nextDate.getTime(), 0];
    let tempData = [];
    let tempData2 = [];

    tempData.push(tempEmptyObject1, tempEmptyObject2);
    tempData2.push(tempEmptyObject1, tempEmptyObject2);
    return [tempData, tempData2];
  }

  handleClick(e) {
    if (e) {
      e.preventDefault();
    }
  }

  getDailyData = async (date,timezone) => {
    let dateFormated = this.formatDate(date, "MM/DD/YYYY").toString();
    let patientId = this.props.getPatientId.patientDataUser.toString();
       
    var options = { ...this.state.options };
    options.series = [];
    let tempData = [];
    let tempData2 = [];
    let emptyData = this.returnEmptyNightlyReport(date);

    doctor
      .doctorRequests()
      .getGrindRatio(patientId, dateFormated, 5)
      .then((response) => {
        console.log("response")
        console.log(response.data)
        let grindRatioData = {}
        if (response.data === undefined || response.data.length == 0) {
          console.log('empty data')
          this.setState({
            data: emptyData[0],
            data2: emptyData[1],
            loading: false,
            min: null, max:null, selectedDate:null, selectedDate2: null,     DateTimePickerDisabled: true
          });
        } else {
          console.log('not empty data')
          if(!response.data[0].gr){
            if(response.data[0].gr1 === undefined){
              let emptyData = this.returnEmptyNightlyReport(date);
              options.series.push({name: "gr1", data: emptyData[0]});
              this.setState({
                options,
                loading: false,
                dataReturn: true,
                min: null, max:null, selectedDate:null, selectedDate2: null,  DateTimePickerDisabled: true
              });
            }else{
          
            for (let value of response.data) {              
            
              let tempSingleData = [
                new Date(value.ts).getTime(),
                 (value.gr1 > 0 ? value.gr1 : value.gr1),
              ];
  
              let tempSingleData2 = [
                new Date(value.ts).getTime(),
                (value.gr2 > 0 ? value.gr2 : value.gr2),
              ];
              tempData.push(tempSingleData);
              tempData2.push(tempSingleData2);
            }
        

          var sortedData = tempData.sort(function (a, b) {
            return a[0] - b[0];
          });
          var sortedData2 = tempData2.sort(function (a, b) {
            return a[0] - b[0];
          });
          options.series.push({ name: "gr1" , data:sortedData})
            options.series.push({ name: "gr2" , data: sortedData2})
            console.log("max")
            console.log(moment(options.series[0].data[options.series[0].data.length - 1][0]).format("DD MMM YYYY hh:mm a") )
            console.log("min")
            console.log(moment(options.series[0].data[0][0]).format("DD MMM YYYY hh:mm a"))

            this.setState({ options, loading: false, dataReturn: true, min: options.series[0].data[0][0], max: options.series[0].data[options.series[0].data.length - 1][0], selectedDate:options.series[0].data[0][0], selectedDate2: options.series[0].data[options.series[0].data.length - 1][0] ,  DateTimePickerDisabled: false});
           // console.log(options)
        }
            //-----------------------------------
          }
          else{
          let zeroFilled = fillZeroRaw(response.data)
          console.log(zeroFilled)
          for (let value of zeroFilled) {   
        
            for (let [index, val] of value.gr.entries()) {
               if(("gr" + (index +1)) in grindRatioData ){
                 grindRatioData["gr" + (index +1)].push([new Date(value.ts).getTime(),val])
               }
               else {
                grindRatioData["gr" + (index +1)] = []
                 grindRatioData["gr" + (index +1)].push([new Date(value.ts).getTime(),val])
               }
              
            }
          }
        

        for (const [key, value] of Object.entries(grindRatioData)) {
          options.series.push({ name: key , data:grindRatioData[key].sort(function (a, b) {
            return a[0] - b[0];
          })});
        }
        console.log("Options")
        console.log(options)

        // console.log(grindRatioData)
        // var sortedData = tempData.sort(function (a, b) {
        //   return a[0] - b[0];
        // });
        // var sortedData2 = tempData2.sort(function (a, b) {
        //   return a[0] - b[0];
        // });
        console.log("min")
        console.log(options.series[0].data[0][0])

       
        this.setState({ options, loading: false, dataReturn: true, min: options.series[0].data[0][0], max: options.series[0].data[options.series[0].data.length - 1][0], selectedDate:options.series[0].data[0][0], selectedDate2: options.series[0].data[options.series[0].data.length - 1][0],  DateTimePickerDisabled: false });
      }}
      })
      .catch((error) => {
        console.log("this is grind ratio data error" + error);
        let emptyData = this.returnEmptyNightlyReport(date);
        options.series.push({name: "gr1", data: emptyData[0]});
        this.setState({
          options,
          loading: false,
          dataReturn: true,
          min: null, max:null, selectedDate:null, selectedDate2: null,  DateTimePickerDisabled: true
        });
      });
  };

  handleDataError(date, options){
    let emptyData = this.returnEmptyNightlyReport(date);
    options.series.push({name: "gr1", data: emptyData[0]});
    this.setState({
      options,
      loading: false,
      dataReturn: true,
      min: null, max:null, selectedDate:null, selectedDate2: null
    });

  }

  changeTimeDateMax(time){
    
    console.log(time)
   let timeMoment = moment(time)
    if(timeMoment.isValid())
    {
    // this.setState({ selectedDate2:time })
   //console.log("Max change" + moment(this.state.selectedDate).format("DD MMM YYYY hh:mm a")
   // +   moment(time).format("DD MMM YYYY hh:mm a"))
    this.$chart.current.series[0].xAxis.setExtremes(
     this.state.selectedDate ,
     time   );    
     this.setState({ selectedDate2:time })
    }

  }

  changeTimeDateMin(time){    
    
  console.log(time)
   let timeMoment = moment(time)
    if(timeMoment.isValid())
{
  //  console.log("Min change" + moment(this.state.selectedDate2).format("DD MMM YYYY hh:mm a")
  //  +   moment(time).format("DD MMM YYYY hh:mm a"))
    this.$chart.current.series[0].xAxis.setExtremes(
      time,
      this.state.selectedDate2 ,
      );
      this.setState({ selectedDate:time })
    }

  }

  render() {
    return (
      <div id="PatientDetailedData">
        <Modal
          onHide={() => {
            this.setState({ show: false });
          }}
          scrollable={true}
          show={this.state.show}
          dialogClassName="modal-90w"
          centered
        >
          <Modal.Header
            closeButton
            style={{ paddingTop: "13px", paddingBottom: "13px" }}
          >
            <Modal.Title
              style={{
                fontSize: "30px",
                color: "#023CF7",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              byteSense Nightly Report
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {(this.state.loading ||
              this.state.loading2 ||
              this.state.loading3) && (
              <div className="loadingContainerNightlyReport">
                <Spinner size="lg" animation="border" />
                <div>Loading...</div>
              </div>
            )}

            <div
              style={{
                display:
                  !this.state.loading &&
                  !this.state.loading2 &&
                  !this.state.loading3
                    ? "block"
                    : "none",
              }}
            >
              <div id="infoWrapper" className="borderModal">
                <div>
                  <div className="userDataBANR">{this.state.patientName}</div>
                  <div className="userDataBANR">
                    {this.formatDate(this.state.startDate, "YYYY/MM/DD")}
                  </div>
                  {/* <div className="userDataBANR">9:00am</div> */}
                  {/* <div className="infoTitleBANR">Night Guard Compliance:</div> */}
                  {/* <div className="infoTitleBANR">
                    {this.formatDate(this.state.startDate, "YYYY/MM/DD").slice(
                      5
                    )}{" "}
                    Night Total:
                  </div> */}
                  {/* <div className="infoTitleBANR">Week of 2/3 Total:</div> */}
                  {
                    /*
                  <div className="infoTitleBANR">
                    Total Sleep Time:{" "}
                    <span className="infoTitleBANRSubText">
                      {this.secondsToHHMMSS(this.state.totalSleepTime)}
                    </span>
                  </div>
                  */
                  }
                  <div className="infoTitleBANR">
                    Bruxism Total Episodes:{" "}
                    <span className="infoTitleBANRSubText">
                      {" "}
                      {this.state.BruxismTotalEpisodes}
                    </span>
                  </div>
                  <div className="infoTitleBANR">
                    Bruxism Total Duration:{" "}
                    <span className="infoTitleBANRSubText">
                      {" "}
                      {this.secondsToHHMMSS(
                        this.state.BruxismTotalDuration
                      )}{" "}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="DesntistDataBANR">
                    Dentist Dr. {this.state.doctorName}
                  </div>
                  {/* <div className="infoTitleBANR">2/4 Night Total:</div>
                  <div className="infoTitleBANR">Total Sleep Time:</div>
                  <div className="infoTitleBANR">Bruxism Total Episodes:</div>
                  <div className="infoTitleBANR">Bruxism Total Duration:</div> */}
                </div>
              </div>
              <div id="wrapper" className="borderModal">
                <div id="c1">
                  <div
                    style={{
                      display: "inline-block",
                      marginLeft: "auto",
                      marginRight: "auto",
                      width: "990px",
                      height: "400px",
                    }}
                  >
                    <div style={{ marginTop: "20px" }}>
                      <HighchartsReact
                        constructorType={"stockChart"}
                        highcharts={Highcharts}
                        callback={(chart) => (this.$chart.current = chart)}
                        options={this.state.options}
                      />
                      {/*
                      <KeyboardDateTimePicker
                        disabled={this.state.DateTimePickerDisabled}
                         variant="inline"
                        style={{marginLeft: "30px", marginTop: "10px"}}
                        label="Start Time"
                        onError={console.log}
                        
                        minTime={this.state.min}
                        maxTime={this.state.max}
                        format="yyyy/MM/DD hh:mm a"
                        value={this.state.selectedDate}
                        onChange={(event)=>{this.changeTimeDateMin(event)}}
                      />

                     

                      <KeyboardDateTimePicker
                        disabled={this.state.DateTimePickerDisabled}
                         variant="inline"
                        style={{marginLeft: "30px",  marginTop: "10px"}}
                        label="End Time"
                        onError={console.log}
                        minDate={this.state.min}
                        maxDate={this.state.max}
                        format="yyyy/MM/DD hh:mm a"
                        value={this.state.selectedDate2}
                        onChange={(event)=>{this.changeTimeDateMax(event)}}
                      />
                      */}
                    </div>
                  </div>
                </div>
                <div id="c2">
                  <div
                    style={{
                      marginRight: "auto",
                      marginLeft: "auto",
                      textAlign: "center",
                      marginTop: "50px",
                    }}
                  >
                    <div style={{ marginBottom: "25px" }}>
                      <Button
                        size="lg"
                        variant="primary"
                        style = {{color: "#FFFFFF", backgroundColor: "#023CF7", marginRight: "5px"}}
                        onClick={() => {
                          // console.log(this.$chart.current.series[0].xAxis.dataMin)
                          this.$chart.current.series[0].xAxis.setExtremes(
                            null,
                            null
                          );
                          // this.$chart.current.setTitle(
                          //   null,
                          //   "Some Negative Title"
                          // );
                          // this.setState({ unused: null });
                        }}
                      >
                        Zoom Out
                      </Button>
                      {/*<Button
                        size="md"
                        variant="primary"
                        onClick={() => {
                          this.setState({ loading3: true });
                          this.getDailyEpisodes(this.state.startDate);
                        }}
                      >
                        Generate Report
                      </Button>*/}
                    </div>

                    <DatePicker
                      inline
                      filterDate={(date) => {
                        return moment() > date;
                      }}
                      dateFormat="dd/MM/yyyy"
                      selected={this.state.startDate}
                      onChange={(date) => {
                        this.setState({
                          startDate: date,
                          loading: true,
                          loading2: true,
                        });

                        this.$chart.current.series[0].xAxis.setExtremes(
                          null,
                          null
                        );
                        this.getDailyData(date);
                        this.getDailyReport(date);
                      }}
                    />
                  </div>
                </div>
              </div>
              {this.state.elements.length !== 0 && (
                <div
                  className="borderModal"
                  style={{
                    marginTop: "25px",
                    paddingTop: "8px",
                    paddingBottom: "40px",
                    backgroundColor: "white",
                  }}
                >
                  <Carousel
                    responsive={this.state.responsive}
                    responsive={{
                      desktop: {
                        slidesToSlide: 4,
                        breakpoint: {
                          max: 3000,
                          min: 1024,
                        },
                        items: 4,
                        partialVisibilityGutter: 40,
                      },
                      mobile: {
                        breakpoint: {
                          max: 464,
                          min: 0,
                        },
                        items: 1,
                        partialVisibilityGutter: 30,
                      },
                      tablet: {
                        breakpoint: {
                          max: 1024,
                          min: 464,
                        },
                        items: 2,
                        partialVisibilityGutter: 30,
                      },
                    }}
                  >
                    {this.state.elements.map((value, index) => {
                      return (
                        <div style={{ height: "72px" }}>
                          <a
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              this.setState({ cardSelected: index });
                              this.$chart.current.series[0].xAxis.setExtremes(
                                parseInt(value.time) - 5000,
                                parseInt(value.time2) + 5000
                              );
                            }}
                          >
                            <Card
                              className="EpisodeZoomData"
                              style={{
                                border:
                                  this.state.cardSelected == index
                                    ? "2px solid #5D82FA"
                                    : "",
                              }}
                            >
                              <div
                                style={{
                                  textAlign: "center",
                                  fontSize: 20,
                                  marginTop: "5px",
                                }}
                              >
                                Episode {index + 1}
                              </div>
                              <div
                                style={{
                                  textAlign: "center",
                                  fontSize: 15,
                                  marginTop: "5px",
                                }}
                              >
                                Range: {value.timeFormated}-
                                {value.timeFormated2}{" "}
                              </div>
                            </Card>
                          </a>
                        </div>
                      );
                    })}
                  </Carousel>
                </div>
              )}
              
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              size="md"
              variant="warning"
              style = {{color: "#FFFFFF", backgroundColor: "#023CF7"}}
              onClick={() => {
                this.setState({ show: false });
              }}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <Button
          onClick={() => {
            this.setState({ show: true });
          }}
          style={{ marginTop: "30px" }}
          variant="primary"
          size="lg"
          block
        >
          byteSense Nightly Report
        </Button>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  getPatientId: getPatientId(state),
  getPatient: getPatient(state)
});

export default connect(mapStateToProps)(PatientDetailedData);


