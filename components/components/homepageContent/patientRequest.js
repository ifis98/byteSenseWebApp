'use client'

import React, { Component } from "react";
import { Row, Container, Col, Card, Button, Form, InputGroup } from "react-bootstrap";
import { 
  useReactTable, 
  getCoreRowModel, 
  getFilteredRowModel, 
  getPaginationRowModel,
  flexRender
} from '@tanstack/react-table';
import { doctor } from "../../../exports/apiCalls";


// Modern Table component specifically designed for PatientRequest
const ModernPatientRequestTable = ({ 
  data, 
  columns, 
  pagination, 
  selectRow,
  onAccept,
  onDecline
}) => {
  const [globalFilter, setGlobalFilter] = React.useState('');
  
  const tableColumns = React.useMemo(() => 
    columns.map(col => ({
      accessorKey: col.dataField,
      header: col.text,
      cell: info => {
        if (col.dataField === 'Action') {
          return (
            <button onClick={() => onAccept(info.row.original.user)}>
              Accept
            </button>
          );
        } else if (col.dataField === 'Action2') {
          return (
            <button className="declineButton" onClick={() => onDecline(info.row.original.user)}>
              Decline
            </button>
          );
        }
        return info.getValue();
      },
      align: col.align,
      headerAlign: col.headerAlign
    })), 
    [columns, onAccept, onDecline]
  );
  
  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });
  
  return (
    <div>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th 
                    key={header.id}
                    style={{ textAlign: header.column.columnDef.headerAlign || 'left' }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr 
                key={row.id}
                style={selectRow && selectRow.style ? selectRow.style : {}}
              >
                {row.getVisibleCells().map(cell => (
                  <td 
                    key={cell.id}
                    style={{ textAlign: cell.column.columnDef.align || 'left' }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
            Page{" "}
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount() || 1}
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

class PatientRequest extends Component {
  state = {
    selectRow: {
      mode: "radio",
      clickToSelect: true,
      hideSelectColumn: true,
      style: { background: "#FCF5EC" },
    },
    columns: [
      { dataField: "fName", text: "First Name", headerAlign: "center", align: "center" },
      { dataField: "lName", text: "Last Name", headerAlign: "center", align: "center" },
      { dataField: "Action", text: "Action", headerAlign: "center", align: "center" },
      { dataField: "Action2", text: "", headerAlign: "center", align: "center" },
    ],
    products: [],
    pagination: {
      options: {
        hideSizePerPage: true,
      },
    },
  };
  
  componentDidMount() {
    this.fetchPatientRequests();
  }

  fetchPatientRequests = () => {
    doctor.doctorRequests().getpatientRequest().then((response) => {
      this.setState({ products: response.data.length ? response.data : [{}] });
    });
  };

  handleAccept = (patient) => {
    doctor.doctorRequests().addPatient(patient).then(this.fetchPatientRequests).catch(console.log);
  };

  handleDecline = (patient) => {
    doctor.doctorRequests().declinePatient(patient).then(this.fetchPatientRequests).catch(console.log);
  };

  render() {
    return (
      <div className="homePageContent" id="PatientList">
        <div id="patientListTable">
          <Container>
            <Row>
              <Col>
                <div id="patientListTitle">Patient Request</div>
              </Col>
            </Row>
          </Container>
          <div className="request">
            <Card className="grid-child-one">
              <div className="patientList_container">
                <p>
                  Please provide your patient(s) with your{" "}
                  <mark className="markText">Observer ID</mark>, which can be found on your{" "}
                  <mark className="markText">Profile</mark> page so they can enter it in their{" "}
                  <mark className="markText">Observers</mark> Page.
                </p>
                <ModernPatientRequestTable
                  data={this.state.products}
                  columns={this.state.columns}
                  pagination={this.state.pagination}
                  selectRow={this.state.selectRow}
                  onAccept={this.handleAccept}
                  onDecline={this.handleDecline}
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}

export default PatientRequest;
