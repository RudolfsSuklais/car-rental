import React, {
    useState,
    useEffect,
    useContext,
    useCallback,
    useMemo,
} from "react";
import axios from "axios";
import { UserContext } from "../../context/userContext";
import "./MyReservations.css";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import toast from "react-hot-toast";
import { Spin, Modal, Input } from "antd";

function MyReservations() {
    const { user, loading: userLoading } = useContext(UserContext);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const apiBaseURL = import.meta.env.VITE_REACT_APP_API_BASE_URL;
    const [reservationToDelete, setReservationToDelete] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [quickSearch, setQuickSearch] = useState("");

    useEffect(() => {
        if (userLoading) return;

        if (!user) {
            setError("User not logged in.");
            setLoading(false);
            return;
        }

        const fetchReservations = async () => {
            try {
                const response = await axios.get(`${apiBaseURL}/reservations`);
                const userReservations = response.data.filter(
                    (reservation) =>
                        user.userID === String(reservation.userID).trim()
                );
                setReservations(userReservations);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch reservations.");
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, [user, userLoading, apiBaseURL]);

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };

    const cancelReservation = useCallback(async () => {
        if (!reservationToDelete) return;

        try {
            await axios.delete(
                `${apiBaseURL}/reservations/${reservationToDelete}`
            );
            setReservations((prevReservations) =>
                prevReservations.filter(
                    (reservation) =>
                        reservation.reservationID !== reservationToDelete
                )
            );
            toast.success("Reservation cancelled successfully!");
        } catch (err) {
            console.error(err);
            setError("Failed to cancel reservation.");
            toast.error("Failed to cancel reservation.");
        } finally {
            setIsModalOpen(false);
        }
    }, [reservationToDelete, apiBaseURL]);

    const rows = useMemo(
        () =>
            reservations.map((reservation) => ({
                id: reservation.reservationID,
                PickupDate: reservation.startDate,
                ReturnDate: reservation.endDate,
                CarMake: reservation.carMake,
                CarModel: reservation.carModel,
                CarYear: reservation.carYear,
                TotalPrice: reservation.totalPrice,
                rawStartDate: reservation.startDate,
            })),
        [reservations]
    );

    const columns = useMemo(
        () => [
            {
                field: "PickupDate",
                headerName: "Pickup Date",
                width: 200,
                valueFormatter: (params) => formatDateTime(params),
            },
            {
                field: "ReturnDate",
                headerName: "Return Date",
                width: 200,
                valueFormatter: (params) => formatDateTime(params),
            },
            { field: "CarMake", headerName: "Car Make", width: 150 },
            { field: "CarModel", headerName: "Car Model", width: 150 },
            { field: "CarYear", headerName: "Car Year", width: 120 },
            { field: "TotalPrice", headerName: "Total Price", width: 150 },
            {
                field: "actions",
                headerName: "Actions",
                width: 150,
                renderCell: (params) => {
                    const reservationStartDate = new Date(
                        params.row.rawStartDate
                    );
                    const currentDate = new Date();
                    const daysDifference =
                        (reservationStartDate - currentDate) /
                        (1000 * 60 * 60 * 24);

                    return daysDifference > 3 ? (
                        <button
                            className="cancel-button"
                            onClick={() => {
                                setIsModalOpen(true);
                                setReservationToDelete(params.row.id);
                            }}>
                            Cancel
                        </button>
                    ) : (
                        <span style={{ color: "gray" }}>Cannot Cancel</span>
                    );
                },
            },
        ],
        []
    );

    const filteredRows = useMemo(() => {
        if (!quickSearch) return rows;
        return rows.filter((row) => {
            const searchQuery = quickSearch.toLowerCase();
            return (
                row.PickupDate.toLowerCase().includes(searchQuery) ||
                row.ReturnDate.toLowerCase().includes(searchQuery) ||
                row.CarMake.toLowerCase().includes(searchQuery) ||
                row.CarModel.toLowerCase().includes(searchQuery) ||
                row.CarYear.toString().includes(searchQuery) ||
                row.TotalPrice.toString().includes(searchQuery)
            );
        });
    }, [quickSearch, rows]);

    if (loading)
        return (
            <div className="loading">
                <Spin size="large" />
            </div>
        );
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="all-reservations-page">
            <h1>My Reservations</h1>
            <p style={{ fontStyle: "italic", marginBottom: "10px" }}>
                ! Please note that cancellations are only possible up to 3 days
                before the scheduled pickup date. After this period,
                cancellations will not be accepted.
            </p>

            <Box sx={{ marginBottom: 2 }}>
                <Input
                    placeholder="Quick Search..."
                    value={quickSearch}
                    onChange={(e) => setQuickSearch(e.target.value)}
                />
            </Box>

            <Box sx={{ height: 600, width: "100%" }}>
                <DataGrid
                    rows={filteredRows}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[5, 10, 20]}
                    pagination
                    components={{ Toolbar: GridToolbar }}
                    autoHeight
                />
            </Box>

            <Modal
                title="Are you sure you want to cancel this reservation?"
                open={isModalOpen}
                onOk={cancelReservation}
                onCancel={() => setIsModalOpen(false)}
                okText="Yes"
                cancelText="No">
                <p>Once cancelled, this action cannot be undone.</p>
            </Modal>
        </div>
    );
}

export default MyReservations;
