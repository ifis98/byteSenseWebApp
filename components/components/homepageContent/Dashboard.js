"use client";

import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spinner, Card, Modal } from "react-bootstrap";
import { Button, Link, Typography } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { doctor } from "../../../exports/apiCalls";
import { updatePatientID } from "../../../actions/PageActions";
import { updatePatientDetail } from "../../../actions/APIAction";
import { createTheme, ThemeProvider } from "@mui/material";
import * as React from "react";
import moment from "moment";

const Dashboard = ({ setIsLoading }) => {
  const pageSize = 10;
  const dispatch = useDispatch();
  const state = useSelector((state) => state.page);

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentPatientInfo, setCurrentPatientInfo] = useState(null);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);

  const columns = useMemo(
    () => [
      { accessorKey: "caseName", header: "Case Name" },
      { accessorKey: "orderNumber", header: "Order Number" },
      {
        accessorKey: "createdAt",
        header: "Order Date",
        Cell: ({ row }) => (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ color: "white" }}
          >
            {moment(row?.original?.createdAt).format("MM/DD/YYYY h:mm a")}
          </Typography>
        ),
      },
      { accessorKey: "status", header: "Status" },
      {
        accessorKey: "design",
        header: "Design",
        Cell: ({ row }) => (
          <Link
            underline="hover"
            sx={{ color: "error.main" }} // 🔴 red link
            href={"https://app.bytesense.ai/"}
            target={"_blank"}
          >
            Design
          </Link>
        ),
      },
      {
        accessorKey: "-",
        header: "Action",
        Cell: ({ row }) => (
          <Button
            variant="contained"
            color="error"
            size="small"
            sx={{
              textTransform: "uppercase",
            }}
            disabled={true}
            onClick={(e) => {
              e.stopPropagation(); // Prevent row click
              // Example: show modal or perform action
            }}
          >
            Approve
          </Button>
        ),
      },
    ],
    [orders],
  );

  useEffect(() => {
    doctor
      .doctorRequests()
      .getOrderList(state?.dentistDetail?.profile?.user)
      .then((res) => {
        const patientsData = res.data.map((value) => {
          return {
            ...value,
          };
        });
        setOrders(patientsData);
        setFilteredOrders(patientsData);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const handleRowClick = (row) => {
    // Set loading state through props
    if (setIsLoading) setIsLoading(true);

    // Store patient ID
    dispatch(updatePatientID({ patientDataUser: row.original.id }));

    // Load patient data then navigate
    dispatch(updatePatientDetail(row.original.id))
      .then((results) => {
        if (results) {
          // Use window.location to ensure full page reload with hash
          window.location.href = "/list#report";
        }
      })
      .catch((error) => {
        console.error("Error loading patient details:", error);
        if (setIsLoading) setIsLoading(false);
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

  const theme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#ef5350",
      },
    },
  });

  return (
    <div
      className="homePageContent"
      id="PatientList"
      style={{ padding: "16px", borderRadius: "10px" }}
    >
      <Modal centered show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove{" "}
          {currentPatientInfo?.Patient || "this patient"}? This process cannot
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

      <Card className="mt-4 p-3 border-0">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
          <div>
            <h2 className="mb-1" style={{ color: "#ef5350", fontWeight: 600 }}>
              Order List
            </h2>
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="loadingContainer">
          <Spinner size="lg" animation="border" />
          <div>Loading...</div>
        </div>
      ) : (
        <Card className="grid-child-one mt-4">
          <ThemeProvider theme={theme}>
            <MaterialReactTable
              columns={columns}
              data={filteredOrders}
              muiTableBodyRowProps={({ row }) => ({
                onClick: () => handleRowClick(row),
                onMouseEnter: () => handleRowHover(row),
              })}
              muiTableHeadCellProps={{
                style: {
                  backgroundColor: "#1d1d1d",
                  color: "#fff",
                  fontWeight: "bold",
                },
              }}
              enablePagination
              initialState={{
                pagination: { pageIndex: 0, pageSize },
              }}
            />
          </ThemeProvider>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
