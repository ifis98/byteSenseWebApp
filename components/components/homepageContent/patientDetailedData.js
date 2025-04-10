'use client';

import React, { Component, createRef } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { getPatient, getPatientId } from '../../../store/reducers';
import { doctor, user } from '../../../exports/apiCalls';
import { fillZeroRaw } from './zeroFill';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import exportingInit from 'highcharts/modules/exporting';
import stockInit from 'highcharts/modules/stock';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Card,
  Grid,
  Divider,
} from '@mui/material';

if (typeof Highcharts === 'object') {
  stockInit(Highcharts);
  exportingInit(Highcharts);
  Highcharts.setOptions({ time: { useUTC: false } });
}

class PatientDetailedData extends Component {
  constructor() {
    super();
    this.$chart = createRef();
    this.state = {
      show: false,
      loading: true,
      loading2: true,
      doctorName: '',
      patientName: '',
      startDate: new Date(),
      chartOptions: {
        chart: { zoomType: 'x' },
        title: { text: null },
        xAxis: { type: 'datetime' },
        yAxis: { title: { text: 'Grind Data' } },
        tooltip: {
          formatter: function () {
            return `Time: ${Highcharts.dateFormat('%A, %b %e, %I:%M:%S %p', this.x)}`;
          },
        },
        series: [],
        rangeSelector: { selected: 1 },
      },
      episodes: [],
      totalEpisodes: '0',
      totalDuration: '0',
    };
  }

  componentDidMount() {
    this.fetchInfo();
  }

  fetchInfo = () => {
    this.getDoctorInfo();
    this.getPatientInfo();
    this.getChartData(this.state.startDate);
    this.getReportData(this.state.startDate);
  };

  getDoctorInfo = () => {
    user.userRequests().getProfile().then((res) => {
      this.setState({ doctorName: res.data.profile.lName || '' });
    });
  };

  getPatientInfo = () => {
    if (!this.props.getPatientId.patientDataUser) {
      window.location.href = '/patientlist';
    }
    this.setState({ patientName: this.props.getPatient.name });
  };

  getReportData = (date) => {
    const formatted = this.formatDate(date, 'YYYY/MM/DD');
    const id = this.props.getPatientId.patientDataUser.toString();

    doctor.doctorRequests().getDailyReport(id, formatted).then((res) => {
      const data = res.data?.[0] || {};
      const episodes = (data.duration_list || []).map((ep) => ({
        time: new Date(ep.start).getTime(),
        time2: new Date(ep.end).getTime(),
        timeFormated: new Date(ep.start).toLocaleTimeString(),
        timeFormated2: new Date(ep.end).toLocaleTimeString(),
      }));
      this.setState({
        totalEpisodes: data.total_episodes || '0',
        totalDuration: data.total_duration || '0',
        episodes,
        loading2: false,
      });
    }).catch(() => this.setState({ loading2: false }));
  };

  getChartData = (date) => {
    const formatted = this.formatDate(date, 'MM/DD/YYYY');
    const id = this.props.getPatientId.patientDataUser.toString();

    doctor.doctorRequests().getGrindRatio(id, formatted, 5).then((res) => {
      const data = res.data || [];
      const seriesMap = {};

      data.forEach((item) => {
        (item.gr || []).forEach((val, i) => {
          const key = `gr${i + 1}`;
          if (!seriesMap[key]) seriesMap[key] = [];
          seriesMap[key].push([new Date(item.ts).getTime(), val]);
        });
      });

      const series = Object.entries(seriesMap).map(([name, values]) => ({
        name,
        data: values.sort((a, b) => a[0] - b[0]),
      }));

      this.setState({
        chartOptions: { ...this.state.chartOptions, series },
        loading: false,
      });
    }).catch(() => this.setState({ loading: false }));
  };

  formatDate = (date, format) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (`0${d.getMonth() + 1}`).slice(-2);
    const day = (`0${d.getDate()}`).slice(-2);
    if (format === 'YYYY/MM/DD') return `${year}/${month}/${day}`;
    if (format === 'MM/DD/YYYY') return `${month}/${day}/${year}`;
    return `${year}-${month}-${day}`;
  };

  handleDateChange = (date) => {
    this.setState({ startDate: date, loading: true, loading2: true });
    this.getChartData(date);
    this.getReportData(date);
  };

  render() {
    const {
      show,
      patientName,
      doctorName,
      totalEpisodes,
      totalDuration,
      episodes,
      chartOptions,
      loading,
      loading2,
      startDate,
    } = this.state;

    return (
      <Box mt={4}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => this.setState({ show: true })}
        >
          byteSense Nightly Report
        </Button>

        <Dialog
          open={show}
          onClose={() => this.setState({ show: false })}
          fullWidth
          maxWidth="xl"
        >
          <DialogTitle align="center" sx={{ color: '#023CF7', fontSize: 28 }}>
            byteSense Nightly Report
          </DialogTitle>

          <DialogContent dividers>
            {(loading || loading2) ? (
              <Box display="flex" flexDirection="column" alignItems="center" py={5}>
                <CircularProgress />
                <Typography mt={2}>Loading...</Typography>
              </Box>
            ) : (
              <Box>
                {/* Flex container for Chart & DatePicker */}
                <Box
                  sx={{
                    display: 'flex',
                    gap: 3,
                    flexDirection: { xs: 'column', md: 'row' },
                  }}
                >
                  {/* Left Side: Chart & Metrics */}
                  <Box
                    sx={{
                      flex: 3,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Card sx={{ p: 3, height: { xs: 'auto', md: '70vh' }, display: 'flex', flexDirection: 'column' }}>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          Patient: {patientName}
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                          Bruxism Total Episodes: {totalEpisodes}
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                          Bruxism Total Duration: {totalDuration} sec
                        </Typography>
                      </Box>
                      <Box mt={3} sx={{ flex: 1, minHeight: '300px' }}>
                        <HighchartsReact
                          highcharts={Highcharts}
                          constructorType="stockChart"
                          options={chartOptions}
                          containerProps={{ style: { height: '100%', width: '100%' } }}
                        />
                      </Box>
                    </Card>
                  </Box>

                  {/* Right Side: DatePicker */}
                  <Box sx={{ flex: 1 }}>
                    <Card sx={{ p: 3, height: { xs: 'auto', md: '70vh' } }}>
                      <DatePicker
                        selected={startDate}
                        onChange={this.handleDateChange}
                        inline
                        filterDate={(date) => moment().isAfter(date)}
                        dayClassName={(date) => {
                          const day = date.getDate();
                          if (day % 4 === 0) {
                            return 'red-date';
                          } else if (day % 4 === 1) {
                            return 'white-date';
                          } else if (day % 4 === 2) {
                            return 'green-date';
                          } else {
                            return 'yellow-date';
                          }
                        }}
                      />
                    </Card>
                  </Box>
                </Box>

                {episodes.length > 0 && (
                  <Box mt={4}>
                    <Typography variant="h6" mb={2}>
                      Episode Zoom
                    </Typography>
                    <Carousel
                      responsive={{
                        desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4 },
                        tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
                        mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
                      }}
                    >
                      {episodes.map((value, index) => (
                        <Card
                          key={index}
                          sx={{
                            m: 1,
                            p: 2,
                            textAlign: 'center',
                            minHeight: 100,
                            border: 2,
                            borderColor: this.state.cardSelected === index ? '#5D82FA' : 'transparent',
                          }}
                          onClick={() => {
                            this.setState({ cardSelected: index });
                            this.$chart.current?.chart?.xAxis[0]?.setExtremes(
                              parseInt(value.time) - 5000,
                              parseInt(value.time2) + 5000
                            );
                          }}
                        >
                          <Typography>Episode {index + 1}</Typography>
                          <Typography variant="body2">
                            {value.timeFormated} - {value.timeFormated2}
                          </Typography>
                        </Card>
                      ))}
                    </Carousel>
                  </Box>
                )}
              </Box>
            )}
          </DialogContent>

          <DialogActions>
            <Button
              onClick={() => this.setState({ show: false })}
              variant="contained"
              color="primary"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }
}

const mapStateToProps = (state) => ({
  getPatientId: getPatientId(state),
  getPatient: getPatient(state),
});

export default connect(mapStateToProps)(PatientDetailedData);
