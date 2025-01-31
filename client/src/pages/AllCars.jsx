import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import "./AllCars.css";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

function AllCars() {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);

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
        fetchCars();
    }, []);

    const handleDelete = async (carID) => {
        try {
            await axios.delete(`/cars/${carID}`);

            setCars(cars.filter((car) => car.carID !== carID));
            setLoading(false);
        } catch (error) {
            console.error("Error deleting car:", error);
            setLoading(false);
        }
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
        <div className="all-cars-page">
            {cars.map((car, index) => (
                <div key={index} className="all-cars-card-container">
                    <div className="all-cars-card-image-container">
                        <img
                            src={car.image}
                            alt={`${car.carMake} ${car.carModel}`}
                        />
                    </div>
                    <div className="all-cars-card-text-container">
                        <h3>
                            {car.carMake} {car.carModel}
                        </h3>
                        <p style={{ fontStyle: "italic" }}>{car.carID}</p>
                        <p>
                            <b>{car.carYear}</b>
                        </p>
                    </div>
                    <div className="all-cars-card-btn-container">
                        <div className="all-car-card-see-more-btn-container">
                            <button
                                onClick={() =>
                                    (window.location.href = `/car/${car.carID}`)
                                }>
                                See More
                            </button>
                        </div>

                        <button onClick={() => handleDelete(car.carID)}>
                            <i className="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default AllCars;
