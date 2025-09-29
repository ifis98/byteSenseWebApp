"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Spinner,
  Container,
  Card,
  Button,
  InputGroup,
  Form,
} from "react-bootstrap";
import { MaterialReactTable } from "material-react-table";
import { doctor } from "../../../exports/apiCalls";
import { createTheme, ThemeProvider } from "@mui/material";

const PatientRequest = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);

  const handleAccept = (userId) => {
    doctor
      .doctorRequests()
      .addPatient(userId)
      .then(refreshList)
      .catch(console.error);
  };

  const handleDecline = (userId) => {
    doctor
      .doctorRequests()
      .declinePatient(userId)
      .then(refreshList)
      .catch(console.error);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "fName",
        header: "First Name",
        enableHiding: false,
        enableSorting: false,
      },
      {
        accessorKey: "lName",
        header: "Last Name",
        enableHiding: false,
        enableSorting: false,
      },
      {
        accessorKey: "accept",
        header: "",
        enableColumnFilter: false,
        enableSorting: false,
        enableHiding: false,
        Cell: ({ row }) => (
          <Button
            size="sm"
            onClick={() => handleAccept(row.original.user)}
            variant="outline-success"
          >
            Accept
          </Button>
        ),
      },
      {
        accessorKey: "decline",
        header: "",
        enableColumnFilter: false,
        enableSorting: false,
        enableHiding: false,
        Cell: ({ row }) => (
          <Button
            size="sm"
            onClick={() => handleDecline(row.original.user)}
            variant="outline-danger"
          >
            Decline
          </Button>
        ),
      },
    ],
    [],
  );

  useEffect(() => {
    doctor
      .doctorRequests()
      .getpatientRequest()
      .then((res) => {
        const data = res.data.length ? res.data : [];
        setRequests(data);
        setFilteredRequests(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const refreshList = () => {
    setLoading(true);
    doctor
      .doctorRequests()
      .getpatientRequest()
      .then((res) => {
        setRequests(res.data);
        setFilteredRequests(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchText(query);
    setFilteredRequests(
      requests.filter(
        (r) =>
          r.fName.toLowerCase().includes(query) ||
          r.lName.toLowerCase().includes(query),
      ),
    );
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
      <Container fluid className="px-0">
        <h2 className="mb-1" style={{ color: "#ef5350", fontWeight: 600 }}>
          Consumer Request
        </h2>

        <p className="mt-3 mb-3">
          Please provide your patient(s) with your{" "}
          <mark className="markText">Observer ID</mark>, which can be found on
          your <mark className="markText">Profile</mark> page so they can enter
          it in their <mark className="markText">Observers</mark> Page.
        </p>

        {loading ? (
          <div className="loadingContainer">
            <Spinner size="lg" animation="border" />
            <div>Loading...</div>
          </div>
        ) : (
          <Card className="grid-child-one">
            <ThemeProvider theme={theme}>
              <MaterialReactTable
                columns={columns}
                data={filteredRequests}
                muiTableHeadCellProps={{
                  style: {
                    backgroundColor: "#1d1d1d",
                    color: "#fff",
                    fontWeight: "bold",
                  },
                }}
                enablePagination
                initialState={{
                  pagination: { pageIndex: 0, pageSize: 10 },
                }}
              />
            </ThemeProvider>
          </Card>
        )}
      </Container>
    </div>
  );
};

export default PatientRequest;
