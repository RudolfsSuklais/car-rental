import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./SingleCar.css";
import toast from "react-hot-toast";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

function SingleCar() {
    const { carID } = useParams();

    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [inputDisabled, setInputDisabled] = useState(true);
    const [wheelDrive, setWheelDrive] = useState("");
    const [color, setColor] = useState("");
    const [seats, setSeats] = useState("");
    const [transmission, setTransmission] = useState("");
    const [fuelType, setFuelType] = useState("");

    const apiBaseURL = import.meta.env.VITE_REACT_APP_API_BASE_URL;

    const transmissionOptions = ["Automatic", "Manual"];
    const fuelTypeOptions = ["Petrol", "Diesel", "Electric", "Hybrid"];
    const wheelDriveOptions = [
        "Front Wheel Drive",
        "Rear Wheel Drive",
        "All Wheel Drive",
    ];
    const colorOptions = [
        "Red",
        "Blue",
        "Green",
        "Black",
        "White",
        "Brown",
        "Gray",
        "Beige",
        "Silver",
    ];
    const seatsOptions = [2, 3, 4, 5, 6, 7, 8];

    const fetchCar = async () => {
        try {
            const response = await axios.get(`${apiBaseURL}/car/${carID}`);
            setCar(response.data);
            setWheelDrive(response.data.wheelDrive);
            setColor(response.data.color);
            setSeats(response.data.seats);
            setTransmission(response.data.transmission);
            setFuelType(response.data.fuelType);
            setLoading(false);
        } catch (err) {
            setError("Error fetching car details");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCar();
    }, []);

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
            <div className="single-car-container">
                <h1>Error</h1>
                <p>{error}</p>
            </div>
        );
    }

    if (!car) {
        return (
            <div className="single-car-container">
                <h1>Car Not Found</h1>
                <p>We couldn't find the car you're looking for.</p>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedCar = {
            carMake: e.target.carMake.value,
            carModel: e.target.carModel.value,
            engine: e.target.carEngine.value,
            wheelDrive: e.target.wheelDrive.value,
            fuelType: e.target.fuelType.value,
            horsePower: e.target.horsePower.value,
            carYear: e.target.carYear.value,
            color: e.target.color.value,
            transmission: e.target.transmission.value,
            seats: e.target.seats.value,
            image: e.target.image.value,
            pricePer1h: e.target.pricePer1h.value,
            pricePer2h: e.target.pricePer2h.value,
            pricePer5h: e.target.pricePer5h.value,
            pricePer24h: e.target.pricePer24h.value,
        };
        try {
            await axios.put(`${apiBaseURL}/car/${carID}`, updatedCar);
            toast.success("Car updated successfully!");
            setLoading(false);
        } catch (err) {
            setError("Error updating car details");
            setLoading(false);
        }
    };

    function cancelEdit() {
        setInputDisabled(true);
    }

    return (
        <div className="single-car-container">
            <div className="single-car-image-heading">
                <h1>
                    {car.carMake} {car.carModel}
                </h1>
                <div className="single-car-image">
                    <img
                        src={car.image}
                        alt={`${car.carMake} ${car.carModel}`}
                    />
                </div>
            </div>
            <div className="single-car-details">
                <div
                    className="edit-button"
                    style={{ display: inputDisabled ? "" : "none" }}>
                    <button onClick={() => setInputDisabled(!inputDisabled)}>
                        <i className="fa-regular fa-pen-to-square"></i>
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="single-car-inputs">
                        <div className={inputDisabled ? "not-editing" : ""}>
                            <label>Make:</label>
                            <input
                                autoFocus
                                type="text"
                                defaultValue={car.carMake}
                                disabled={inputDisabled}
                                name="carMake"
                            />
                        </div>
                        <div className={inputDisabled ? "not-editing" : ""}>
                            <label>Model:</label>
                            <input
                                type="text"
                                defaultValue={car.carModel}
                                disabled={inputDisabled}
                                name="carModel"
                            />
                        </div>
                        <div className={inputDisabled ? "not-editing" : ""}>
                            <label>Engine:</label>
                            <input
                                type="text"
                                defaultValue={car.engine}
                                disabled={inputDisabled}
                                name="carEngine"
                            />
                        </div>
                        <div className={inputDisabled ? "not-editing" : ""}>
                            <label>Wheel Drive:</label>
                            <select
                                required
                                value={wheelDrive}
                                onChange={(e) => setWheelDrive(e.target.value)}
                                disabled={inputDisabled}
                                name="wheelDrive">
                                <option disabled hidden value="">
                                    Select wheel drive
                                </option>
                                {wheelDriveOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={inputDisabled ? "not-editing" : ""}>
                            <label>Fuel Type:</label>
                            <select
                                required
                                value={fuelType}
                                onChange={(e) => setFuelType(e.target.value)}
                                disabled={inputDisabled}
                                name="fuelType">
                                <option disabled hidden value="">
                                    Select fuel type
                                </option>
                                {fuelTypeOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={inputDisabled ? "not-editing" : ""}>
                            <label>Horse Power:</label>
                            <input
                                type="text"
                                defaultValue={car.horsePower}
                                disabled={inputDisabled}
                                name="horsePower"
                            />
                        </div>
                        <div className={inputDisabled ? "not-editing" : ""}>
                            <label>Year:</label>
                            <input
                                type="text"
                                defaultValue={car.carYear}
                                disabled={inputDisabled}
                                name="carYear"
                            />
                        </div>
                        <div className={inputDisabled ? "not-editing" : ""}>
                            <label>Color:</label>
                            <select
                                required
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                disabled={inputDisabled}
                                name="color">
                                <option disabled hidden value="">
                                    Select color
                                </option>
                                {colorOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={inputDisabled ? "not-editing" : ""}>
                            <label>Transmission:</label>
                            <select
                                required
                                value={transmission}
                                onChange={(e) =>
                                    setTransmission(e.target.value)
                                }
                                disabled={inputDisabled}
                                name="transmission">
                                <option disabled hidden value="">
                                    Select transmission
                                </option>
                                {transmissionOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={inputDisabled ? "not-editing" : ""}>
                            <label>Seats:</label>
                            <select
                                required
                                value={seats}
                                onChange={(e) => setSeats(e.target.value)}
                                disabled={inputDisabled}
                                name="seats">
                                <option disabled hidden value="">
                                    Select seats
                                </option>
                                {seatsOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={inputDisabled ? "not-editing" : ""}>
                            <label>Image:</label>
                            <input
                                type="url"
                                defaultValue={car.image}
                                disabled={inputDisabled}
                                name="image"
                            />
                        </div>
                        <div className={inputDisabled ? "not-editing" : ""}>
                            <label>Price per 1h:</label>
                            <input
                                type="text"
                                defaultValue={car.pricePer1h}
                                disabled={inputDisabled}
                                name="pricePer1h"
                            />
                        </div>
                        <div className={inputDisabled ? "not-editing" : ""}>
                            <label>Price per 2h:</label>
                            <input
                                type="text"
                                defaultValue={car.pricePer2h}
                                disabled={inputDisabled}
                                name="pricePer2h"
                            />
                        </div>
                        <div className={inputDisabled ? "not-editing" : ""}>
                            <label>Price per 5h:</label>
                            <input
                                type="text"
                                defaultValue={car.pricePer5h}
                                disabled={inputDisabled}
                                name="pricePer5h"
                            />
                        </div>
                        <div className={inputDisabled ? "not-editing" : ""}>
                            <label>Price per 24h:</label>
                            <input
                                type="text"
                                defaultValue={car.pricePer24h}
                                disabled={inputDisabled}
                                name="pricePer24h"
                            />
                        </div>
                    </div>
                    <div className="form-buttons">
                        <button
                            className={
                                inputDisabled
                                    ? "disabled"
                                    : "edit-cancel-button"
                            }
                            disabled={inputDisabled}
                            onClick={cancelEdit}
                            type="button">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={
                                inputDisabled ? "disabled" : "edit-save-button"
                            }
                            onClick={() => setInputDisabled(true)}>
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SingleCar;
