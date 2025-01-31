import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Booking.css";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import { v4 as uuidv4 } from "uuid";
import { Image, Spin } from "antd";
import toast from "react-hot-toast";
import { LoadingOutlined } from "@ant-design/icons";

function Booking() {
    const { state } = useLocation();
    const { carID } = useParams();
    const [car, setCar] = useState(null);
    const [reservations, setReservations] = useState([]);
    const { pickupDate, dropoffDate } = state || {};
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [totalPrice, setTotalPrice] = useState(null);
    const apiBaseURL = import.meta.env.VITE_REACT_APP_API_BASE_URL;
    const [loading, setLoading] = useState(true);
    const [isAvailableBtn, setIsAvailableBtn] = useState(true);

    const { user } = useContext(UserContext);

    const navigate = useNavigate();

    useEffect(() => {
        setStartDate(pickupDate);
        setEndDate(dropoffDate);

        axios
            .get(`/car/${carID}`)
            .then((response) => {
                setCar(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching car data:", error);
                toast.error("Failed to load car details. Please try again.");
                setLoading(false);
            });

        axios
            .get(`/reservations?carID=${carID}`)
            .then((response) => {
                setReservations(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching reservations:", error);
                toast.error("Failed to load reservations. Please try again.");
                setLoading(false);
            });
    }, [carID, pickupDate, dropoffDate]);

    const calculateTotalPrice = (car, startDate, endDate) => {
        if (!car || !startDate || !endDate) return 0;

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start) || isNaN(end) || end <= start) return 0;

        const durationHours = (end - start) / (1000 * 60 * 60);
        if (durationHours <= 0) return 0;

        const days = Math.floor(durationHours / 24);
        let remainingHours = durationHours % 24;

        let totalPrice = days * car.pricePer24h;

        if (remainingHours >= 5) {
            const count5hours = Math.floor(remainingHours / 5);
            totalPrice += count5hours * car.pricePer5h;
            remainingHours %= 5;
        }

        if (remainingHours >= 2) {
            const count2hours = Math.floor(remainingHours / 2);
            totalPrice += count2hours * car.pricePer2h;
            remainingHours %= 2;
        }

        if (remainingHours >= 1) {
            totalPrice += car.pricePer1h;
        }

        return totalPrice;
    };

    const isCarAvailable = (carID, startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);

        for (const reservation of reservations) {
            if (reservation.carID === carID) {
                const reservationStart = new Date(reservation.startDate);
                const reservationEnd = new Date(reservation.endDate);

                if (start < reservationEnd && end > reservationStart) {
                    return false;
                }
            }
        }
        return true;
    };

    useEffect(() => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const durationHours = (end - start) / (1000 * 60 * 60);

        if (!startDate || !endDate) {
            setIsAvailableBtn(true);
            setTotalPrice(null);
        } else if (car && !isCarAvailable(car.carID, startDate, endDate)) {
            toast.error("Car is not available");
            setIsAvailableBtn(true);
            setTotalPrice(null);
        } else if (durationHours < 1 && durationHours >= 0) {
            toast.error("Duration must be at least 1 hour.");
            setIsAvailableBtn(true);
            setTotalPrice(null);
        } else if (start > end && durationHours <= 0) {
            toast.error(
                "The start date/time must be earlier than the end date/time!"
            );
            setIsAvailableBtn(true);
            setTotalPrice(null);
        } else {
            setIsAvailableBtn(false);
            setTotalPrice(calculateTotalPrice(car, startDate, endDate));
        }
    }, [startDate, endDate, car]);

    const handleReservation = () => {
        if (!user) {
            localStorage.setItem("redirectedFromRent", true);
            navigate("/login");
        } else {
            const newReservation = {
                userID: user.userID,
                reservationID: uuidv4(),
                carID: car.carID,
                carMake: car.carMake,
                carModel: car.carModel,
                carYear: car.carYear,
                carImage: car.image,
                startDate: new Date(startDate).toISOString(),
                endDate: new Date(endDate).toISOString(),
                totalPrice,
                name: user.name,
                lastName: user.lastName,
                email: user.email,
                address: user.address,
                phone: user.phone,
                city: user.city,
                country: user.country,
                postalCode: user.postalCode,
                birthday: user.birthday,
            };

            axios
                .post(`${apiBaseURL}/add-reservation`, newReservation)
                .then((response) => {
                    setReservations([...reservations, response.data]);

                    navigate(`/reservations/${response.data.reservationID}`);
                    toast.success("Reservation made successfully!");
                })
                .catch((error) => {
                    console.error("Error making reservation:", error);
                    toast.error(
                        "Failed to make reservation. Please try again."
                    );
                });
        }
    };

    if (!car && !loading) {
        return (
            <div className="booking-container">
                <h1>Car Not Found</h1>
                <p>We couldn't find the car you're looking for.</p>
            </div>
        );
    }
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
        <div className="booking-container">
            <h1>
                {car.carMake} {car.carModel}
            </h1>
            <div className="car-details">
                <Image width={400} src={car.image} />
                <div className="car-details-wrapper">
                    <p>
                        <b>Engine: </b>
                        {car.engine}
                    </p>
                    <p>
                        <b>Wheel-drive: </b>
                        {car.wheelDrive}
                    </p>
                    <p>
                        <b>Fuel type: </b>
                        {car.fuelType}
                    </p>
                    <p>
                        <b>Horsepower: </b>
                        {car.horsePower}hp
                    </p>
                    <p>
                        <b>Year: </b>
                        {car.carYear}
                    </p>
                    <p>
                        <b>Color: </b>
                        {car.color}
                    </p>
                    <p>
                        <b>Transmission: </b>
                        {car.transmission}
                    </p>

                    <hr />
                    <p>
                        <b>Price per 1 hour: </b>
                        {car.pricePer1h}€
                    </p>
                    <p>
                        <b>Price per 2 hour: </b>
                        {car.pricePer2h}€
                    </p>
                    <p>
                        <b>Price per 5 hour: </b>
                        {car.pricePer5h}€
                    </p>
                    <p>
                        <b>Price per day: </b>
                        {car.pricePer24h}€
                    </p>
                    <hr />
                    <div className="price-list">
                        <div className="booking-total-price-wrapper">
                            {totalPrice !== null && (
                                <p>
                                    <b>Total Price: </b>
                                    {totalPrice} EUR
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <form
                className="reservation-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleReservation();
                }}>
                <div className="price-group">
                    <div className="input-group">
                        <label>
                            Pick-up:
                            <input
                                type="datetime-local"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                min={new Date().toISOString().slice(0, 16)}
                                required
                            />
                        </label>
                        <label>
                            Drop-off:
                            <input
                                type="datetime-local"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                min={
                                    startDate ||
                                    new Date().toISOString().slice(0, 16)
                                }
                                required
                            />
                        </label>
                    </div>
                </div>
                <div className="rent-btn">
                    <button type="submit" disabled={isAvailableBtn}>
                        Rent
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Booking;
