import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ReservationConfirmation.css";
import { Link } from "react-router-dom";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

function ReservationConfirmation() {
    const { reservationID } = useParams();
    const [reservation, setReservation] = useState(null);
    const [chosenCar, setChosenCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const apiBaseURL = import.meta.env.VITE_REACT_APP_API_BASE_URL;

    useEffect(() => {
        const fetchReservation = async () => {
            try {
                const response = await axios.get(`${apiBaseURL}/reservations`);
                const reservations = response.data;

                const foundReservation = reservations.find(
                    (res) =>
                        res.reservationID.toString() ===
                        reservationID.toString()
                );
                setLoading(false);

                if (!foundReservation) {
                    throw new Error("Reservation not found");
                }

                setReservation(foundReservation);
                setLoading(false);
                const carResponse = await axios.get(
                    `${apiBaseURL}/car/${foundReservation.carID}`
                );
                setLoading(false);
                setChosenCar(carResponse.data);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch reservation or car data.");
                setLoading(false);
            } finally {
                setLoading(false);
            }
        };

        fetchReservation();
    }, [reservationID]);

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

    if (error) {
        return <div>{error}</div>;
    }

    if (!reservation) {
        return (
            <div className="reservation-confirmation-container">
                <h1>Reservation Not Found</h1>
                <p>We couldn't find the reservation you're looking for.</p>
            </div>
        );
    }

    if (!chosenCar) {
        return (
            <div className="reservation-confirmation-container">
                <h1>Car Not Found</h1>
                <p>
                    We couldn't find the car associated with this reservation.
                </p>
            </div>
        );
    }

    return (
        <div className="reservation-confirmation-container">
            <h1>Reservation Confirmed!</h1>
            <div className="reservation-confirmation-card">
                <p>
                    <b>Reservation ID:</b> {reservationID}
                </p>

                <p>
                    <b>Pick-up date/time:</b>{" "}
                    {new Date(reservation.startDate).toLocaleString()}
                </p>
                <p>
                    <b>Drop-off date/time:</b>{" "}
                    {new Date(reservation.endDate).toLocaleString()}
                </p>
                <p>
                    <b>Total price to pay: </b>
                    {reservation.totalPrice} EUR
                </p>
                <h2>
                    {chosenCar.carMake} {chosenCar.carModel}
                </h2>
                <img
                    src={chosenCar.image}
                    style={{ width: "400px" }}
                    alt="Car"
                />
            </div>
            <h1>Thank You For Choosing Us!</h1>
            <Link to={"/"}>
                <button className="back-to-home">
                    <i className="fa-solid fa-arrow-left"></i> Back to Home
                </button>
            </Link>
        </div>
    );
}

export default ReservationConfirmation;
