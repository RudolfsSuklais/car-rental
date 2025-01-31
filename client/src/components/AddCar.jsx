import React, { useState } from "react";
import "./AddCar.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function AddCar() {
    const [carMake, setCarMake] = useState("");
    const [carModel, setCarModel] = useState("");
    const [engine, setEngine] = useState("");
    const [color, setColor] = useState("");
    const [carYear, setCarYear] = useState("");
    const [pricePer1h, setPricePer1h] = useState("");
    const [wheelDrive, setWheelDrive] = useState("");
    const [fuelType, setFuelType] = useState("");
    const [horsePower, setHorsePower] = useState("");
    const [transmission, setTransmission] = useState("");
    const [image, setImage] = useState("");
    const [pricePer2h, setPricePer2h] = useState("");
    const [pricePer5h, setPricePer5h] = useState("");
    const [pricePer24h, setPricePer24h] = useState("");
    const [seats, setSeats] = useState("");

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

    const apiBaseURL = import.meta.env.VITE_REACT_APP_API_BASE_URL;
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (
            !carMake ||
            !carModel ||
            !engine ||
            !wheelDrive ||
            !fuelType ||
            !horsePower ||
            !carYear ||
            !color ||
            !transmission ||
            !image ||
            !pricePer1h ||
            !pricePer2h ||
            !pricePer5h ||
            !pricePer24h ||
            !seats
        ) {
            toast.error("Please fill out all fields.");
            return;
        }

        const newCar = {
            carMake: carMake.trim(),
            carModel: carModel.trim(),
            engine: engine.trim(),
            wheelDrive: wheelDrive.trim(),
            fuelType: fuelType.trim(),
            horsePower: Number(horsePower),
            carYear: Number(carYear),
            color: color.trim(),
            transmission: transmission.trim(),
            image: image.trim(),
            pricePer1h: Number(pricePer1h),
            pricePer2h: Number(pricePer2h),
            pricePer5h: Number(pricePer5h),
            pricePer24h: Number(pricePer24h),
            seats: Number(seats),
        };

        try {
            const response = await axios.post(`${apiBaseURL}/add-car`, newCar, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });
            toast.success("Car added successfully!");

            if (response.data && response.data.car && response.data.car.carID) {
                navigate(`/car/${response.data.car.carID}`);
            }
        } catch (error) {
            console.error(
                "Error adding car:",
                error.response?.data || error.message
            );
            toast.error(
                "Failed to add car. Please check your input and try again."
            );
        }
    };

    return (
        <div className="add-car-container">
            <h2>Add New Car</h2>
            <form onSubmit={handleSubmit}>
                <div className="add-car-form-input-wrapper">
                    <div className="add-car-form-wrapper-1">
                        <input
                            required
                            type="text"
                            value={carMake}
                            onChange={(e) => setCarMake(e.target.value)}
                            placeholder="Enter car make"
                        />
                        <input
                            required
                            type="text"
                            value={carModel}
                            onChange={(e) => setCarModel(e.target.value)}
                            placeholder="Enter car model"
                        />
                        <input
                            required
                            type="text"
                            value={engine}
                            onChange={(e) => setEngine(e.target.value)}
                            placeholder="Enter car engine"
                        />

                        <select
                            required
                            value={wheelDrive}
                            onChange={(e) => setWheelDrive(e.target.value)}
                            placeholder="Enter car wheel drive">
                            <option disabled hidden value="">
                                Select wheel drive
                            </option>
                            {wheelDriveOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>

                        <select
                            required
                            value={fuelType}
                            onChange={(e) => setFuelType(e.target.value)}
                            placeholder="Enter car fuel type">
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
                    <div className="add-car-form-wrapper-2">
                        <input
                            required
                            type="text"
                            value={horsePower}
                            onChange={(e) => setHorsePower(e.target.value)}
                            placeholder="Enter car horse power"
                        />
                        <input
                            required
                            type="text"
                            value={carYear}
                            onChange={(e) => setCarYear(e.target.value)}
                            placeholder="Enter car year"
                        />

                        <select
                            required
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            placeholder="Enter car color">
                            <option disabled hidden value="">
                                Select color
                            </option>
                            {colorOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>

                        <select
                            required
                            value={transmission}
                            onChange={(e) => setTransmission(e.target.value)}
                            placeholder="Enter car transmission type">
                            <option disabled hidden value="">
                                Select transmission
                            </option>
                            {transmissionOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        <input
                            required
                            type="URL"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            placeholder="Enter car image URL"
                        />
                    </div>
                    <div className="add-car-form-wrapper-3">
                        <input
                            required
                            type="number"
                            value={pricePer1h}
                            onChange={(e) => setPricePer1h(e.target.value)}
                            placeholder="Enter car price per 1 hour"
                            min={1}
                        />
                        <input
                            required
                            type="number"
                            value={pricePer2h}
                            onChange={(e) => setPricePer2h(e.target.value)}
                            placeholder="Enter car price per 2 hour"
                            min={1}
                        />
                        <input
                            required
                            type="number"
                            value={pricePer5h}
                            onChange={(e) => setPricePer5h(e.target.value)}
                            placeholder="Enter car price per 5 hour"
                            min={1}
                        />
                        <input
                            required
                            type="number"
                            value={pricePer24h}
                            onChange={(e) => setPricePer24h(e.target.value)}
                            placeholder="Enter car price per 24 hour"
                            min={1}
                        />
                        <select
                            required
                            value={seats}
                            onChange={(e) => setSeats(e.target.value)}
                            placeholder="Enter car seat number">
                            <option disabled hidden value="">
                                Select seat number
                            </option>
                            {seatsOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default AddCar;
