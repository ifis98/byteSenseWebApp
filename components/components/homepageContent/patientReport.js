'use client';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getPatient, getPatientId } from '../../../store/reducers';
import { doctor } from '../../../exports/apiCalls';
import moment from 'moment';
import { Line } from 'react-chartjs-2';
import {
  Box,
  Typography,
  Card,
  CircularProgress,
  Button,
  CardContent,
} from '@mui/material';
import PatientDetailedData from './patientDetailedData';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';

// Import and register the required Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

class PatientReport extends Component {
  state = {
    loading: true,
    loading2: true,
    lineDataPresent: false,
    ComplianceN: '0',
    ComplianceD: '0',
    patientName: '',
    dataBar: {
      labels: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ],
      datasets: [
        {
          label: 'Total Episodes',
          borderColor: '#5D82FB',
          data: [],
          fill: false,
          pointBackgroundColor: '#5D82FA',
        },
      ],
    },
    dataLine: {
      labels: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ],
      datasets: [
        {
          label: 'Total Duration',
          data: [],
          fill: false,
          borderColor: '#5D82FB',
          pointBackgroundColor: '#5D82FA',
        },
      ],
    },
  };

  patientId = this.props.getPatientId.patientDataUser;

  componentDidMount() {
    this.getData();
    this.getReportOfCurrentWeek();
  }

  getData = () => {
    try {
      this.setState({
        loading: false,
        patientName: this.props.patient.name,
        ComplianceD: this.props.patient.compliance.totalDays,
        ComplianceN: this.props.patient.compliance.CompDays,
      });
    } catch (err) {
      window.location.href = '/list';
    }
  };

  getReportOfCurrentWeek = async () => {
    const patientId = this.props.getPatientId.patientDataUser;
    const daysOfWeek = this.getDaysOfCurrentWeek();
    const promiseArray = daysOfWeek.map((day) =>
      doctor.doctorRequests().getDailyReport(
        patientId,
        this.formatDate(day, 'YYYY/MM/DD')
      )
    );

    const tempEp = [];
    const tempDur = [];
    await Promise.all(promiseArray).then((values) => {
      values.forEach((report) => {
        if (!report.data || !report.data.length) {
          tempEp.push(null);
          tempDur.push(null);
        } else {
          const data = report.data[0];
          tempEp.push(data.total_episodes ? Number(data.total_episodes) : null);
          tempDur.push(data.total_duration ? Number(data.total_duration) : null);
        }
      });
    });

    this.setState((prev) => ({
      dataBar: {
        ...prev.dataBar,
        datasets: [{ ...prev.dataBar.datasets[0], data: tempEp }],
      },
      dataLine: {
        ...prev.dataLine,
        datasets: [{ ...prev.dataLine.datasets[0], data: tempDur }],
      },
      lineDataPresent: true,
      loading2: false,
    }));
  };

  getDaysOfCurrentWeek = () => {
    const currentDate = this.dateCheck();
    const weekStart = currentDate.clone().startOf('week');
    return Array.from({ length: 7 }, (_, i) =>
      moment(weekStart).add(i, 'days').format('MM/DD/YYYY')
    );
  };

  formatDate = (date, format) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (`0${d.getMonth() + 1}`).slice(-2);
    const day = (`0${d.getDate()}`).slice(-2);
    switch (format) {
      case 'YYYY/MM/DD':
        return `${year}/${month}/${day}`;
      case 'MM/DD/YYYY':
        return `${month}/${day}/${year}`;
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      default:
        return '';
    }
  };

  dateCheck = () => {
    const hour = new Date().getHours();
    return hour >= 19 ? moment() : moment().subtract(1, 'days');
  };

  deletePatient = async () => {
    try {
      await doctor.doctorRequests().deletePatient(this.patientId);
      window.location.href = '/list';
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const {
      loading,
      loading2,
      lineDataPresent,
      ComplianceN,
      patientName,
      dataBar,
      dataLine,
    } = this.state;

    return (
      <Box className="homePageContent" sx={{ px: 4, py: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" sx={{ color: '#5D82FA', fontWeight: 600 }}>
            Patient Report
          </Typography>
          <Button variant="contained" color="error" onClick={this.deletePatient}>
            Remove Patient
          </Button>
        </Box>

        {(loading || loading2) ? (
          <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
            <CircularProgress />
            <Typography mt={2}>Loading...</Typography>
          </Box>
        ) : (
          <>
            {/* Layout using CSS grid */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gridTemplateRows: { xs: 'repeat(4, auto)', md: '150px 400px' },
                gap: 3,
                height: '100%',
              }}
            >
              {/* Top Left Card: Patient Name */}
              <Card sx={{ height: '100%' }}>
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: '100%',
                  }}
                >
                  <PermContactCalendarIcon sx={{ fontSize: 100, color: '#333f48', mr: 2 }} />
                  <Box>
                    <Typography variant="subtitle1">Patient Name</Typography>
                    <Typography variant="h6" fontWeight={700}>
                      {patientName}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* Top Right Card: Compliance */}
              <Card sx={{ height: '100%' }}>
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: '100%',
                  }}
                >
                  <NightsStayIcon sx={{ fontSize: 100, color: '#333f48', mr: 2 }} />
                  <Box>
                    <Typography variant="subtitle1">Compliance</Typography>
                    <Typography variant="h6" fontWeight={700} sx={{ fontSize: 30, color: '#5D82FA' }}>
                      {ComplianceN}
                    </Typography>
                    <Typography variant="body2">Nights</Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* Bottom Left Card (Graph) */}
              <Card sx={{ height: '100%', p: 2 }}>
                {lineDataPresent && (
                  <Line
                    data={dataBar}
                    options={{
                      plugins: {
                        legend: { display: true, position: 'bottom' },
                        title: {
                          display: true,
                          text: 'Bruxism Total Episodes',
                          color: '#333',
                          font: { size: 18 },
                        },
                      },
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        x: { title: { display: true, text: 'Night' } },
                        y: { title: { display: true, text: 'Episodes' } },
                      },
                    }}
                  />
                )}
              </Card>

              {/* Bottom Right Card (Graph) */}
              <Card sx={{ height: '100%', p: 2 }}>
                {lineDataPresent && (
                  <Line
                    data={dataLine}
                    options={{
                      plugins: {
                        legend: { display: true, position: 'bottom' },
                        title: {
                          display: true,
                          text: 'Bruxism Total Duration',
                          color: '#333',
                          font: { size: 18 },
                        },
                      },
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        x: { title: { display: true, text: 'Night' } },
                        y: { title: { display: true, text: 'Duration (seconds)' } },
                      },
                    }}
                  />
                )}
              </Card>
            </Box>

            <Box mt={4}>
              <PatientDetailedData />
            </Box>
          </>
        )}
      </Box>
    );
  }
}

const mapStateToProps = (state) => ({
  patient: getPatient(state),
  getPatientId: getPatientId(state),
});

export default connect(mapStateToProps)(PatientReport);
