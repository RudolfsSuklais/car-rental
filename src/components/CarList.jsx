import React, { useState, useEffect } from "react";
import carsData from "../data/cars.json";
import { useLocation } from "react-router-dom";
import "./CarList.css";
import { useNavigate } from "react-router-dom";

function CarList() {
  const { state } = useLocation();
  const { pickupDate, dropoffDate } = state || {};
  const [availableCars, setAvailableCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [cars, setCars] = useState(() => {
    const storedCars = localStorage.getItem("cars");
    return storedCars ? JSON.parse(storedCars) : carsData;
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedTransmission, setSelectedTransmission] = useState("");

  const navigate = useNavigate();

  const handleBtnClick = (carID) => {
    navigate(`/booking/${carID}`, {
      state: { pickupDate, dropoffDate },
    });
  };

  useEffect(() => {
    if (pickupDate && dropoffDate) {
      const start = new Date(pickupDate);
      const end = new Date(dropoffDate);

      const reservations =
        JSON.parse(localStorage.getItem("reservations")) || [];

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
  }, [pickupDate, dropoffDate, cars]);

  useEffect(() => {
    let filteredList = availableCars.filter((car) => {
      const matchesSearch =
        car.carMake.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.carModel.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesMake = selectedMake === "" || car.carMake === selectedMake;

      const matchesTransmission =
        selectedTransmission === "" ||
        car.transmission === selectedTransmission;

      return matchesSearch && matchesMake && matchesTransmission;
    });

    setFilteredCars(filteredList);
  }, [searchQuery, selectedMake, selectedTransmission, availableCars]);

  if (!pickupDate || !dropoffDate) {
    return <p>Please select pick-up and drop-off dates.</p>;
  }

  return (
    <div className="car-list">
      <div className="filters">
        <input
          type="text"
          placeholder="Search cars..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          value={selectedMake}
          onChange={(e) => setSelectedMake(e.target.value)}
        >
          <option value="">All Makes</option>
          {cars
            .map((car) => car.carMake)
            .filter((value, index, self) => self.indexOf(value) === index)
            .map((make) => (
              <option key={make} value={make}>
                {make}
              </option>
            ))}
        </select>
        <select
          value={selectedTransmission}
          onChange={(e) => setSelectedTransmission(e.target.value)}
        >
          <option value="">All Transmissions</option>
          <option value="Manual">Manual</option>
          <option value="Automatic">Automatic</option>
        </select>
      </div>

      {filteredCars.length > 1 ? (
        <h1>{filteredCars.length} cars available</h1>
      ) : (
        <h1>{filteredCars.length} car available</h1>
      )}

      {filteredCars.length > 0 ? (
        filteredCars.map((car) => (
          <div key={car.carID} className="car-list-card">
            <div className="car-list-card-image">
              <img src={car.image} alt={car.carMake} />
            </div>
            <div className="car-list-card-details">
              <h2>
                {car.carMake} {car.carModel}
              </h2>
              <p>
                <i className="fa-solid fa-car"></i> &nbsp; {car.engine}
              </p>
              <p>
                <i className="fa-solid fa-gear"></i> &nbsp; {car.transmission}
              </p>
              <p>
                <i className="fa-regular fa-calendar"></i> &nbsp; {car.carYear}
              </p>
              <p>
                <i className="fa-solid fa-gas-pump"></i> &nbsp; {car.fuelType}
              </p>
            </div>
            <div className="car-list-card-button">
              <div className="car-list-card-price-for-1-day">
                <p>Price for 1 day:</p>
                <h3>{car.pricePer24h} €</h3>
              </div>
              <button onClick={() => handleBtnClick(car.carID)}>
                View Deal
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No cars are available for the selected dates.</p>
      )}
    </div>
  );
}

export default CarList;
