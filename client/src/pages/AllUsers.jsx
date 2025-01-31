import React, { useState, useEffect } from "react";
import "./AllUsers.css";
import axios from "axios";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

function AllUsers() {
    const [users, setUsers] = useState([]);
    const [columnVisibilityModel, setColumnVisibilityModel] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const apiBaseURL = import.meta.env.VITE_REACT_APP_API_BASE_URL;
    const [filterModel, setFilterModel] = useState({
        items: [],
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${apiBaseURL}/users`);
                setUsers(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching users:", error);
                setError("Failed to fetch users.");
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const formatDateTime = (date) => {
        const newDate = new Date(date);
        return `${newDate.toLocaleDateString()} ${newDate.toLocaleTimeString()}`;
    };

    const deleteReservation = async (userID) => {
        try {
            await axios.delete(`${apiBaseURL}/users/${userID}`);
            const updatedUsers = users.filter((user) => user.userID !== userID);
            setUsers(updatedUsers);
            setLoading(false);
        } catch (err) {
            console.error("Failed to delete reservation", err);
            setError("Failed to delete reservation.");
            setLoading(false);
        }
    };

    const handleFilterModelChange = (model) => {
        setFilterModel(model);
    };

    const handleColumnVisibilityChange = (newModel) => {
        setColumnVisibilityModel(newModel);
    };

    if (loading) {
        return (
            <div className="loading">
                <Spin
                    indicator={
                        <LoadingOutlined spin style={{ fontSize: "50px" }} />
                    }
                    size="large"
                />
            </div>
        );
    }

    return (
        <div className="all-users-page">
            <h1>All Users</h1>
            {error && <div className="error">{error}</div>}
            <Box sx={{ minHeight: "400px", width: "100%" }}>
                <DataGrid
                    sx={{ height: "100%", width: "100%" }}
                    columns={[
                        { field: "id", headerName: "ID", width: 70 },
                        { field: "Name", headerName: "Name", width: 150 },
                        {
                            field: "Last Name",
                            headerName: "Last Name",
                            width: 150,
                        },
                        { field: "Phone", headerName: "Phone", width: 150 },
                        { field: "Address", headerName: "Address", width: 150 },
                        { field: "City", headerName: "City", width: 150 },
                        { field: "Country", headerName: "Country", width: 200 },
                        {
                            field: "Postal Code",
                            headerName: "Postal Code",
                            width: 200,
                        },
                        {
                            field: "Birthday",
                            headerName: "Birthday",
                            width: 150,
                        },
                        { field: "Email", headerName: "Email", width: 150 },
                        { field: "Admin", headerName: "Admin", width: 150 },
                        {
                            field: "Actions",
                            headerName: "Actions",
                            renderCell: (params) => (
                                <button
                                    onClick={() =>
                                        deleteReservation(params.row.id)
                                    }
                                    className="delete-button">
                                    Delete
                                </button>
                            ),
                            width: 120,
                        },
                    ]}
                    rows={users.map((user) => ({
                        id: user.userID,
                        Name: user.name,
                        "Last Name": user.lastName,
                        Phone: user.phone,
                        Address: user.address,
                        City: user.city,
                        Country: user.country,
                        "Postal Code": user.postalCode,
                        Birthday: formatDateTime(user.birthday),
                        Email: user.email,
                        Admin: user.isAdmin ? "Yes" : "No",
                    }))}
                    components={{
                        Toolbar: GridToolbar,
                    }}
                    filterModel={filterModel}
                    onFilterModelChange={handleFilterModelChange}
                    columnVisibilityModel={columnVisibilityModel}
                    onColumnVisibilityModelChange={handleColumnVisibilityChange}
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{ toolbar: { showQuickFilter: true } }}
                />
            </Box>
        </div>
    );
}

export default AllUsers;
