import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CarList.css";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

function CarList() {
    const { state } = useLocation();
    const { pickupDate, dropoffDate } = state || {};
    const [availableCars, setAvailableCars] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedMake, setSelectedMake] = useState("");
    const [selectedTransmission, setSelectedTransmission] = useState("");
    const [isSearchBtnAvailable, setIsSearchBtnAvailable] = useState(false);
    const [notification, setNotification] = useState("");
    const [pickupDateInput, setPickupDateInput] = useState(pickupDate || "");
    const [dropoffDateInput, setDropoffDateInput] = useState(dropoffDate || "");
    const [hoveredCarID, setHoveredCarID] = useState(null);
    const [cars, setCars] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [sortByPrice, setSortByPrice] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const CalculateTotalPrice = (car, startDate, endDate) => {
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

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!pickupDateInput || !dropoffDateInput) {
            setNotification("Please select both pick-up and drop-off dates.");
            return;
        }

        setIsSearchBtnAvailable(true);
        setNotification("");
        setAvailableCars([]);
        setFilteredCars([]);
    };

    const handleBtnClick = (carID) => {
        navigate(`/booking/${carID}`, {
            state: {
                pickupDate: pickupDateInput,
                dropoffDate: dropoffDateInput,
            },
        });
    };

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await axios.get("/cars");
                setCars(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching cars:", error);
                setLoading(false);
            }
        };

        const fetchReservations = async () => {
            try {
                const response = await axios.get("/reservations");
                setReservations(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching reservations:", error);
                setLoading(false);
            }
        };

        fetchCars();
        fetchReservations();
    }, []);

    useEffect(() => {
        if (pickupDateInput && dropoffDateInput) {
            const start = new Date(pickupDateInput);
            const end = new Date(dropoffDateInput);

            const filtered = cars.filter((car) => {
                const carReservations = reservations.filter(
                    (res) => res.carID === car.carID
                );

                return carReservations.every((res) => {
                    const resStart = new Date(res.startDate);
                    const resEnd = new Date(res.endDate);

                    return end <= resStart || start >= resEnd;
                });
            });

            setAvailableCars(filtered);
            setFilteredCars(filtered);
        }
    }, [pickupDateInput, dropoffDateInput, cars, reservations]);

    useEffect(() => {
        let filteredList = availableCars.filter((car) => {
            const matchesSearch =
                car.carMake.toLowerCase().includes(searchQuery.toLowerCase()) ||
                car.carModel.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesMake =
                selectedMake === "" || car.carMake === selectedMake;
            const matchesTransmission =
                selectedTransmission === "" ||
                car.transmission === selectedTransmission;

            return matchesSearch && matchesMake && matchesTransmission;
        });

        setFilteredCars(filteredList);
    }, [searchQuery, selectedMake, selectedTransmission, availableCars]);

    useEffect(() => {
        let filteredList = availableCars.filter((car) => {
            const matchesSearch =
                car.carMake.toLowerCase().includes(searchQuery.toLowerCase()) ||
                car.carModel.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesMake =
                selectedMake === "" || car.carMake === selectedMake;
            const matchesTransmission =
                selectedTransmission === "" ||
                car.transmission === selectedTransmission;

            return matchesSearch && matchesMake && matchesTransmission;
        });

        if (sortByPrice) {
            filteredList = filteredList.sort((a, b) => {
                const priceA = CalculateTotalPrice(
                    a,
                    pickupDateInput,
                    dropoffDateInput
                );
                const priceB = CalculateTotalPrice(
                    b,
                    pickupDateInput,
                    dropoffDateInput
                );
                return sortByPrice === "price-asc"
                    ? priceA - priceB
                    : priceB - priceA;
            });
        }

        setFilteredCars(filteredList);
    }, [
        searchQuery,
        selectedMake,
        selectedTransmission,
        sortByPrice,
        availableCars,
        pickupDateInput,
        dropoffDateInput,
    ]);

    if (!pickupDateInput || !dropoffDateInput) {
        return <p>Please select pick-up and drop-off dates.</p>;
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

    if (error) {
        return (
            <div>
                <h1>Error</h1>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="car-list">
            <form onSubmit={handleFormSubmit}>
                <div className="car-list-dropdown-wrapper">
                    <div className="car-list-dropdown">
                        <div className="car-list-dropdown-date-input">
                            <label>Pick-up date:</label>
                            <input
                                type="datetime-local"
                                value={pickupDateInput}
                                onChange={(e) =>
                                    setPickupDateInput(e.target.value)
                                }
                                required
                                min={new Date().toISOString().slice(0, 16)}
                                max={dropoffDateInput}
                            />
                        </div>

                        <div className="car-list-dropdown-date-input">
                            <label>Drop-off date:</label>
                            <input
                                type="datetime-local"
                                value={dropoffDateInput}
                                onChange={(e) =>
                                    setDropoffDateInput(e.target.value)
                                }
                                required
                                min={
                                    pickupDateInput ||
                                    new Date().toISOString().slice(0, 16)
                                }
                            />
                        </div>
                        <div className="car-list-search-btn-notification-wrapper">
                            {notification && (
                                <p style={{ color: "red" }}>{notification}</p>
                            )}
                        </div>
                    </div>
                </div>
            </form>

            <div className="filters">
                <input
                    type="text"
                    placeholder="Search cars..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select
                    value={selectedMake}
                    onChange={(e) => setSelectedMake(e.target.value)}>
                    <option value="">All Makes</option>
                    {cars
                        .map((car) => car.carMake)
                        .filter(
                            (value, index, self) =>
                                self.indexOf(value) === index
                        )
                        .map((make) => (
                            <option key={make} value={make}>
                                {make}
                            </option>
                        ))}
                </select>
                <div className="filters-sort-by-price">
                    <select
                        value={sortByPrice}
                        onChange={(e) => setSortByPrice(e.target.value)}>
                        <option value="" disabled hidden>
                            Price
                        </option>
                        <option value="price-asc">Low to High</option>
                        <option value="price-desc">High to Low</option>
                    </select>
                </div>
                <select
                    value={selectedTransmission}
                    onChange={(e) => setSelectedTransmission(e.target.value)}>
                    <option value="">All Transmissions</option>
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                </select>
            </div>
            {filteredCars.length !== 0 ? (
                filteredCars.length > 1 ? (
                    <h3 className="cars-available-notification">
                        {filteredCars.length} cars available
                    </h3>
                ) : (
                    <h3 className="cars-available-notification">
                        {filteredCars.length} car available
                    </h3>
                )
            ) : (
                <h3> </h3>
            )}

            {filteredCars.length > 0 ? (
                filteredCars.map((car) => {
                    const totalPrice = CalculateTotalPrice(
                        car,
                        pickupDateInput,
                        dropoffDateInput
                    );

                    return (
                        <div key={car.carID} className="car-list-card">
                            <div
                                className="car-list-card-image"
                                style={{ position: "relative" }}>
                                <i
                                    className="fa-solid fa-tag"
                                    style={{
                                        fontSize: "30px",
                                        width: "30px",
                                        height: "30px",
                                        color: "#0d4695",
                                    }}
                                    onMouseEnter={() =>
                                        setHoveredCarID(car.carID)
                                    }
                                    onMouseLeave={() =>
                                        setHoveredCarID(null)
                                    }></i>
                                <img
                                    src={car.image}
                                    alt={`${car.carMake} ${car.carModel}`}
                                    style={{
                                        width: "200px",
                                        maxHeight: "200px",
                                        objectFit: "scale-down",
                                    }}
                                />
                                {hoveredCarID === car.carID && (
                                    <div
                                        className="car-list-card-image-overlay"
                                        style={{
                                            position: "absolute",
                                            top: "-120px",
                                            left: "0",
                                            right: "0",
                                            bottom: "200px",
                                            backgroundColor:
                                                "rgba(255, 255, 255, 0.8)",
                                            borderRadius: "10px",
                                            width: "200px",
                                            padding: "10px",
                                            boxShadow:
                                                " 0 2px 8px rgba(20, 57, 126, 0.9)",
                                        }}>
                                        <p>
                                            <b>Price for 1 hour:</b>{" "}
                                            {car.pricePer1h} €
                                        </p>
                                        <p>
                                            <b>Price for 2 hours:</b>{" "}
                                            {car.pricePer2h} €
                                        </p>
                                        <p>
                                            <b>Price for 5 hours:</b>{" "}
                                            {car.pricePer5h} €
                                        </p>
                                        <p>
                                            <b>Price for 1 day: </b>
                                            {car.pricePer24h} €
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="car-list-card-details">
                                <h2>
                                    {car.carMake} {car.carModel}
                                </h2>
                                <p>
                                    <i className="fa-solid fa-car"></i> &nbsp;{" "}
                                    {car.engine}
                                </p>
                                <p>
                                    <i className="fa-solid fa-gear"></i> &nbsp;{" "}
                                    {car.transmission}
                                </p>
                                <p>
                                    <i className="fa-solid fa-chair"></i>&nbsp;{" "}
                                    {car.seats} Seats
                                </p>
                                <p>
                                    <i className="fa-regular fa-calendar"></i>{" "}
                                    &nbsp;
                                    {car.carYear}
                                </p>
                                <p>
                                    <i className="fa-solid fa-gas-pump"></i>{" "}
                                    &nbsp; {car.fuelType}
                                </p>
                            </div>
                            <div className="car-list-card-button">
                                <div className="car-list-card-price-for-1-day">
                                    <p>Total price:</p>
                                    <h3>{totalPrice} €</h3>
                                </div>
                                <button
                                    onClick={() => handleBtnClick(car.carID)}
                                    className="view-deal-btn">
                                    View Deal
                                </button>
                            </div>
                        </div>
                    );
                })
            ) : (
                <p className="no-cars-available-notification">
                    No cars are available for the selected dates.
                </p>
            )}
        </div>
    );
}

export default CarList;
