'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import {
  Spinner,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
  InputGroup,
} from 'react-bootstrap';
import { MaterialReactTable } from 'material-react-table';
import { doctor } from '../../../exports/apiCalls';
import { backendLink } from '../../../exports/variable';
import { updatePatientID } from '../../../actions/PageActions';
import { updatePatientDetail } from '../../../actions/APIAction';

const PatientList = () => {
  const pageSize = 10;
  const router = useRouter();
  const dispatch = useDispatch();

  const NA = 'N/A';

  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [currentPatientInfo, setCurrentPatientInfo] = useState(null);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);

  const columns = useMemo(
    () => [
      { accessorKey: 'Patient', header: 'Patient' },
      { accessorKey: 'DOB', header: 'DOB' },
      { accessorKey: 'Place_of_Residence', header: 'Place of Residence' },
      { accessorKey: 'Last_Visited', header: 'Last Visited' },
      { accessorKey: 'Next_Appointment', header: 'Next Appointment' },
      { accessorKey: 'Bruxism_Level', header: 'Bruxism Level' },
    ],
    []
  );

  useEffect(() => {
    doctor
      .doctorRequests()
      .getPatientList()
      .then((res) => {
        const patientsData = res.data.patientList.map((value) => {
          const doc = value.new_patient._doc;
          return {
            id: doc.user || NA,
            Patient: `${doc.fName || ''} ${doc.lName || ''}`.trim() || NA,
            DOB: doc.dob || NA,
            Place_of_Residence: doc.address?.state || NA,
            Country: doc.address?.country || NA,
            PhoneNumber: doc.phone || NA,
            Gender: doc.gender || NA,
            Last_Visited: doc.lastVisited || NA,
            Next_Appointment: doc.nextAppointment || NA,
            Bruxism_Level: doc.bruxismLevel || NA,
            img: doc.picture ? (
              <img
                className="circular--square"
                src={`${backendLink}Uploads/profilePictures/${doc.picture}`}
                alt="Profile Pic"
              />
            ) : (
              <span id="gct_account_circle" className="material-icons">
                account_circle
              </span>
            ),
            buttonDisabled: true,
          };
        });
        setPatients(patientsData);
        setFilteredPatients(patientsData);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchText(query);
    setFilteredPatients(
      patients.filter((p) => {
        return (
          p.Patient.toLowerCase().includes(query) ||
          p.Place_of_Residence.toLowerCase().includes(query)
        );
      })
    );
  };

  const handleRowClick = (row) => {
    setLoading(true);
    dispatch(updatePatientID({ patientDataUser: row.original.id }));
    dispatch(updatePatientDetail(row.original.id)).then((results) => {
      if (results) router.push('/list#report');
    });
  };

  const handleRowHover = (row) => {
    setCurrentPatientInfo(row.original);
  };

  const handleDeletePatient = () => {
    doctor
      .doctorRequests()
      .deletePatient(currentPatientInfo.id)
      .then(() => window.location.reload())
      .catch(console.error);
  };

  return (
    <div className="homePageContent" id="PatientList">
      <Modal centered show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove{' '}
          {currentPatientInfo?.Patient || 'this patient'}? This process cannot
          be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDeletePatient}>
            Remove
          </Button>
        </Modal.Footer>
      </Modal>

      <Row>
        <Col>
          <div id="patientListTitle">Patient List</div>
        </Col>
        <Col>
          <InputGroup>
            <Form.Control
              value={searchText}
              onChange={handleSearchChange}
              placeholder="Search..."
            />
            <Button variant="outline-secondary" onClick={() => setSearchText('')}>
              Clear
            </Button>
          </InputGroup>
        </Col>
      </Row>

      {loading ? (
        <div className="loadingContainer">
          <Spinner size="lg" animation="border" />
          <div>Loading...</div>
        </div>
      ) : (
        <Card className="grid-child-one mt-4">
          <MaterialReactTable
            columns={columns}
            data={filteredPatients}
            muiTableBodyRowProps={({ row }) => ({
              onClick: () => handleRowClick(row),
              onMouseEnter: () => handleRowHover(row),
              style: {
                cursor: 'pointer',
                backgroundColor:
                  currentPatientInfo?.id === row.original.id
                    ? '#0032F3'
                    : 'white',
                color:
                  currentPatientInfo?.id === row.original.id
                    ? 'white'
                    : 'inherit',
              },
            })}
            muiTablePaperProps={{
              elevation: 0,
              style: { border: 'none' },
            }}
            muiTableHeadCellProps={{
              style: {
                backgroundColor: '#f5f6fa',
                color: '#5D82FA',
                fontWeight: 'bold',
              },
            }}
            enablePagination
            initialState={{
              pagination: { pageIndex: 0, pageSize },
            }}
          />
        </Card>
      )}
    </div>
  );
};

export default PatientList;
