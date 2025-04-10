'use client'

import React, { Component } from "react";
import "./homepageContent.scss";
import {
  Spinner,
  Row,
  Col,
  Card,
  Dropdown,
  Button,
  Modal,
  Form,
  InputGroup
} from "react-bootstrap";
import { connect } from "react-redux";
import { updatePatientID } from "../../actions/PageActions";
import { updatePatientDetail } from "../../actions/APIAction";
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { backendLink } from "../../exports/variable";
import { doctor } from "../../exports/apiCalls";
import { 
  useReactTable, 
  getCoreRowModel, 
  getFilteredRowModel, 
  getPaginationRowModel,
  flexRender
} from '@tanstack/react-table';

// This is already defined in your file, keeping it for reference
function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let navigate = useNavigate();
    let location = useLocation();
    let params = useParams();
    return <Component {...props} router={{ navigate, location, params }} />;
  }
  return ComponentWithRouterProp;
}

// Modern Table component specifically designed for PatientList
const ModernPatientTable = ({ 
  data, 
  columns, 
  pagination, 
  onRowMouseEnter, 
  onRowClick, 
  selectedRowId,
  searchProps 
}) => {
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(0);
  
  const tableColumns = React.useMemo(() => 
    columns.map(col => ({
      accessorKey: col.dataField,
      header: col.text,
      cell: info => info.getValue(),
    })), 
    [columns]
  );
  
  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      globalFilter,
      pagination: {
        pageIndex: currentPage,
        pageSize: pagination.options.sizePerPage || 10,
      },
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: (updater) => {
      const newState = typeof updater === 'function' ? updater(table.getState().pagination) : updater;
      setCurrentPage(newState.pageIndex);
      if (pagination.options.onPageChange) {
        pagination.options.onPageChange(newState.pageIndex + 1, newState.pageSize);
      }
    },
  });
  
  return (
    <div>
      <div>
        <Row>
          <Col>
            <div id="patientListTitle">Patient List</div>
          </Col>
          <Col>
            <InputGroup>
              <Form.Control
                value={globalFilter || ''}
                onChange={e => setGlobalFilter(e.target.value)}
                placeholder="Search..."
              />
              <Button variant="outline-secondary" onClick={() => setGlobalFilter('')}>
                Clear
              </Button>
            </InputGroup>
          </Col>
        </Row>
      </div>
      
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} style={{ textAlign: header.column.columnDef.headerAlign || 'left' }}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr 
                key={row.id} 
                onClick={() => onRowClick(row.original)}
                onMouseEnter={() => onRowMouseEnter(row.original, row.index)}
                style={row.original.id === selectedRowId ? { background: "#0032F3", color: "white" } : {}}
              >
                {row.getVisibleCells().map(cell => (
                  <td 
                    key={cell.id} 
                    style={{ textAlign: cell.column.columnDef.align || 'left' }}
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          <span>
            Page{' '}
            <strong>
              {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </strong>
          </span>
        </div>
        <div>
          <Button
            variant="outline-primary"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="me-2"
          >
            Previous
          </Button>
          <Button
            variant="outline-primary"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

class PatientList extends Component {
  currentPage = 1
  pageSize = 10
  state = {
    buttonDisabled: false,
    show: false,
    loading: true,
    selectedRowId: null,
    currentPatientInfo: {
      id: "N/A",
      Patient: "N/A",
      DOB: "N/A",
      Place_of_Residence: "N/A",
      Country: "N/A",
      PhoneNumber: "N/A",
      Gender: "N/A",
      img: (
        <span id="gct_account_circle" className="material-icons">
          account_circle
        </span>
      ),
    },
    selectRow: {
      mode: "radio",
      clickToSelect: true,
      hideSelectColumn: true,
      style: { background: "#0032F3" },
    },

    columns: [
      {
        dataField: "Patient",
        text: "Patient",
      },
      { dataField: "DOB", text: "DOB", headerAlign: "center", align: "center" },
      {
        dataField: "Place_of_Residence",
        text: "Place of Residence",
        headerAlign: "center",
        align: "center",
      },
      // {
      //   dataField: "Last_Visited",
      //   text: "Last Visited",
      //   headerAlign: "center",
      //   align: "center",
      // },
      // {
      //   dataField: "Next_Appointment",
      //   text: "Next Appointment",
      //   headerAlign: "center",
      //   align: "center",
      // },
      // {
      //   dataField: "Bruxism_Level",
      //   text: "Bruxism Level",
      //   headerAlign: "center",
      //   align: "center",
      // },
    ],

    products: [],
    pagination: {
      options: {
        hideSizePerPage: true,
        onPageChange: (page, sizePerPage) => {
          this.currentPage = page
        },
        sizePerPage: this.pageSize,
      }
    },
  };

  handleRowMouseEnter = (row, rowIndex) => {
    let pageAdder = this.pageSize*(this.currentPage-1)
    this.setState({ currentPatientInfo: this.state.products[rowIndex+pageAdder]});
  };

  handleRowClick = (row) => {
    this.setState({
      loading: true,
      selectedRowId: row.id
    });
    console.log(row.id);
    this.props.updatePatientID({ patientDataUser: row.id });
    this.props.updatePatientDetail(row.id).then(results => {
      if(results){
        window.location.href = "/list#report";
      }
    });
  };

  colorDiv(text) {
    switch (text) {
      case "High":
        return <div style={{ color: "#023CF7" }}>High</div>;
        break;
      case "Med":
        return <div style={{ color: "#5D82FA" }}>Med</div>;
        break;
      case "Low":
        return <div style={{ color: "#99ECFA" }}>Low</div>;
        break;
      default:
        return "";
    }
  }

  componentDidMount() {
    this.fetchList();
  }

  fetchList = () => {
    {
      doctor
        .doctorRequests()
        .getPatientList()
        .then((response) => {
          let tempArray = [];
          let NA = "N/A";
          for (let value of response.data.patientList) {
            let tempObject = {
              id: !!value.new_patient._doc.user
                ? value.new_patient._doc.user
                : NA,
              Patient:
                !!value.new_patient._doc.fName || !!value.new_patient._doc.lName
                  ? value.new_patient._doc.fName +
                    " " +
                    value.new_patient._doc.lName
                  : NA,
              DOB: !!value.new_patient._doc.dob
                ? value.new_patient._doc.dob
                : NA,
              Place_of_Residence: !!value.new_patient._doc.address.state
                ? value.new_patient._doc.address.state
                : NA,

              // Last_Visited: !!value.new_patient.LastVisited
              //   ? value.new_patient.LastVisited
              //   : NA,

              // Next_Appointment: !!value.new_patient.NextAppointment
              //   ? value.new_patient.NextAppointment
              //   : NA,
              // Bruxism_Level: !!value.new_patient.BruxismLevel
              //   ? this.colorDiv(value.new_patient.BruxismLevel)
              //   : NA,
              Country: !!value.new_patient._doc.address.country
                ? value.new_patient._doc.address.country
                : NA,
              PhoneNumber: !!value.new_patient._doc.phone
                ? value.new_patient._doc.phone
                : NA,
              Gender: !!value.new_patient._doc.gender
                ? value.new_patient._doc.gender
                : NA,
              img: !!value.new_patient._doc.picture ? (
                <img
                  className="circular--square"
                  src={
                    backendLink +
                    "Uploads/profilePictures/" +
                    value.new_patient._doc.picture
                  }
                  alt={"Profile Pic"}
                />
              ) : (
                <span id="gct_account_circle" className="material-icons">
                  account_circle
                </span>
              ),
              buttonDisabled: true,
            };
            tempArray.push(tempObject);
          }

          this.setState({
            products: tempArray,
            loading: false,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  deletePatient = async () => {
    doctor
      .doctorRequests()
      .deletePatient(this.state.currentPatientInfo.id)
      .catch((error) => {
        console.log(error);
      });
    window.location.reload();
  };

  handleClose = () => {
    this.setState({ show: false });
  };
  handleShow = () => {
    this.setState({ show: true });
  };

  render() {
    return (
      <div className="homePageContent" id="PatientList">
        <Modal
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.state.show}
          onHide={this.handleClose}
        >
          <Modal.Header closeButton>
            <Modal.Title>Are you sure?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to remove{" "}
            {this.state.currentPatientInfo.Patient}. This process cannot be
            undone.{" "}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button variant="danger" onClick={this.deletePatient}>
              Remove
            </Button>
          </Modal.Footer>
        </Modal>
        
        <div id="patientListTable">
          <div hidden={!this.state.loading} className="loadingContainer">
            <Spinner size="lg" animation="border" />
            <div>Loading...</div>
          </div>
          <div hidden={this.state.loading} className="grid-container">
            <Card className="grid-child-one">
              <div className="patientList_container">
                <ModernPatientTable
                  data={this.state.products}
                  columns={this.state.columns}
                  pagination={this.state.pagination}
                  onRowMouseEnter={this.handleRowMouseEnter}
                  onRowClick={this.handleRowClick}
                  selectedRowId={this.state.selectedRowId}
                />
              </div>
            </Card>
            {
              /*
                <Card className="grid-child-two">
                  <div id="gct_title">Patient Info</div>
                  <div className="grid-container-two">
                    <div>{this.state.currentPatientInfo.img}</div>
                    <div>
                      <div className="gct_name">
                        {this.state.currentPatientInfo.Patient}
                      </div>
                      <div className="gct_description">
                        {this.state.currentPatientInfo.Country}
                      </div>
                      <div className="gct_description">
                        Moblie: {this.state.currentPatientInfo.PhoneNumber}
                      </div>
                    </div>
                  </div>
                  <div className="container">
                    <div className="row">
                      <div className="col font-weight-bold">DOB:</div>
                      <div className="col-text-left">
                        {this.state.currentPatientInfo.DOB}{" "}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col font-weight-bold">Gender:</div>
                      <div className="col-text-left">
                        {this.state.currentPatientInfo.Gender}{" "}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col font-weight-bold">
                        Place of Residence:
                      </div>
                      <div className="col-text-left">
                        {this.state.currentPatientInfo.Place_of_Residence}
                      </div>
                    </div>
                  </div>
                  <Dropdown id="patient_dropdown">
                    {/* <Dropdown.Toggle
                      variant="outline-dark"
                      block
                      id="dropdown-basic"
                    >
                      Notes
                    </Dropdown.Toggle> 
                    <Dropdown.Menu>
                      <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                      <Dropdown.Item href="#/action-2">
                        Another action
                      </Dropdown.Item>
                      <Dropdown.Item href="#/action-3">
                        Something else
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  <Button
                    className="mb-4"
                    style={{ visibility: "hidden" }}
                    id="Contact_Patient"
                  >
                    Contact{" "}
                    <span id="mail_button" className="material-icons">
                      mail_outline
                    </span>
                  </Button>
                  <Button
                    disabled={!this.state.currentPatientInfo.buttonDisabled}
                    onClick={this.handleShow}
                    className="mt-0 mb-4"
                    id="Remove_Patient"
                  >
                    Remove Patient{" "}
                  </Button>
                </Card>
                */
            }
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  updatePatientID: (value) => dispatch(updatePatientID(value)),
  updatePatientDetail: (value) => dispatch(updatePatientDetail(value))
});

export default connect(null, mapDispatchToProps)(withRouter(PatientList));
