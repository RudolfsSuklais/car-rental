import React, { useState, useEffect } from "react";
import carsData from "../data/cars.json";
import "./CarsDropdown.css";

function CarsDropdown() {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalPrice, setTotalPrice] = useState(null);
  const [reserveButton, setReserveButton] = useState(true);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    const localStorageCars = localStorage.getItem("cars");

    if (localStorageCars) {
      setCars(JSON.parse(localStorageCars));
    } else {
      setCars(carsData);
      localStorage.setItem("cars", JSON.stringify(carsData));
    }

    const localStorageReservations = localStorage.getItem("reservations");
    if (localStorageReservations) {
      setReservations(JSON.parse(localStorageReservations));
    }
  }, []);

  const handleSelectionChange = (e) => {
    const selectedCarID = e.target.value;
    const car = cars.find((car) => car.carID === selectedCarID);
    setSelectedCar(car);
    setTotalPrice(null);
  };

  const handleReservation = (carID, startDate, endDate) => {
    const newReservation = {
      carID,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      totalPrice,
    };
    const updatedReservations = [...reservations, newReservation];

    setReservations(updatedReservations);
    localStorage.setItem("reservations", JSON.stringify(updatedReservations));
  };

  const calculateTotalPrice = (car, startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationHours = (end - start) / 1000 / 60 / 60;

    if (durationHours <= 1) return car.pricePer1h;
    if (durationHours > 1 && durationHours <= 2) return car.pricePer2h;
    if (durationHours > 2 && durationHours <= 3)
      return car.basePricePer1h * Math.ceil(durationHours);
    if (durationHours > 3 && durationHours < 5)
      return car.basePricePer1h * Math.ceil(durationHours);
    if (durationHours >= 5 && durationHours < 6) return car.pricePer5h;
    if (durationHours >= 6 && durationHours < 24)
      return car.basePricePer1h * Math.ceil(durationHours);
    if (durationHours >= 24 && durationHours < 25) return car.pricePer24h;
    else return car.basePricePer1h * Math.ceil(durationHours);
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
    const now = new Date();
    const durationHours = (end - start) / 1000 / 60 / 60;

    if (!startDate || !endDate) {
      setNotification("Choose dates");
      setReserveButton(true);
      setTotalPrice(null);
    } else if (new Date(endDate) <= new Date(startDate)) {
      setNotification("End date must be after start date");
      setReserveButton(true);
      setTotalPrice(null);
    } else if (!isCarAvailable(selectedCar?.carID, startDate, endDate)) {
      setNotification("Car is not available");
      setReserveButton(true);
      setTotalPrice(null);
    } else if (durationHours < 1) {
      setNotification("Duration must be at least 1 hour");
      setReserveButton(true);
      setTotalPrice(null);
    } else if (new Date(now) > new Date(startDate)) {
      setNotification("Start date must be in the future");
      setReserveButton(true);
      setTotalPrice(null);
    } else {
      setNotification("");
      setReserveButton(false);
    }
  }, [startDate, endDate, selectedCar]);

  const carsByMake = cars.reduce((acc, car) => {
    if (!acc[car.carMake]) {
      acc[car.carMake] = [];
    }
    acc[car.carMake].push(car);
    return acc;
  }, {});

  const clearReservations = () => {
    setReservations([]);
    localStorage.removeItem("reservations");
    alert("All reservations have been cleared!");
  };

  const filteredReservations = reservations.filter(
    (reservation) => reservation.carID === selectedCar?.carID
  );

  return (
    <div className="cars-dropdown-container">
      <h2 className="title">Cars Dropdown</h2>
      <div className="dropdown-wrapper">
        <p>Select Your Car Type:</p>
        <select className="select-dropdown" onChange={handleSelectionChange}>
          <option value="" selected disabled hidden>
            Select a car
          </option>
          {Object.keys(carsByMake).map((make) => (
            <optgroup label={make} key={make}>
              {carsByMake[make].map((car) => (
                <option value={car.carID} key={car.carID}>
                  {car.carModel}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {selectedCar && (
        <div className="container">
          <div className="specification-container">
            <h2 className="subheading" style={{ fontSize: "2rem" }}>
              {selectedCar.carMake}
            </h2>

            <p className="paragraph">
              <strong>Model:</strong> {selectedCar.carModel}
            </p>
            <p className="paragraph">
              <strong>Year:</strong> {selectedCar.carYear}
            </p>
            <p className="paragraph">
              <strong>Engine:</strong> {selectedCar.engine}
            </p>
            <p className="paragraph">
              <strong>Wheel drive:</strong> {selectedCar.wheelDrive}
            </p>
            <p className="paragraph">
              <strong>Fuel Type:</strong> {selectedCar.fuelType}
            </p>
            <p className="paragraph">
              <strong>Color:</strong> {selectedCar.color}
            </p>
            <p className="paragraph">
              <strong>Transmission:</strong> {selectedCar.transmission}
            </p>
            <p className="paragraph">
              <strong>Horsepower:</strong> {selectedCar.horsePower}
            </p>
          </div>
          <div className="car-image-container">
            <p>
              <img
                src={selectedCar.image}
                alt={selectedCar.carModel}
                style={{ maxWidth: "300px" }}
              />
            </p>
          </div>

          <div style={{ marginTop: "10px" }} className="form-container">
            <h4>Rent this car:</h4>
            <form
              className="form"
              onSubmit={(e) => {
                e.preventDefault();
                handleReservation(
                  selectedCar.carID,
                  startDate,
                  endDate,
                  totalPrice
                );
                alert(`Reservation confirmed! Total price: ${totalPrice} EUR`);
                setSelectedCar(null);
                setStartDate("");
                setEndDate("");
                setTotalPrice(null);
              }}
            >
              <label className="label">
                Pick-up:
                <input
                  className="input-datetime"
                  type="datetime-local"
                  name="startDate"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    if (e.target.value && endDate) {
                      setTotalPrice(
                        calculateTotalPrice(
                          selectedCar,
                          e.target.value,
                          endDate
                        )
                      );
                    }
                  }}
                  required
                />
              </label>
              <label className="label">
                Drop-off:
                <input
                  className="input-datetime"
                  type="datetime-local"
                  name="endDate"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    if (startDate && e.target.value) {
                      setTotalPrice(
                        calculateTotalPrice(
                          selectedCar,
                          startDate,
                          e.target.value
                        )
                      );
                    }
                  }}
                  required
                />
              </label>
              <button className="button" type="submit" disabled={reserveButton}>
                Rent
              </button>
              <p className="notification">{notification}</p>
              {filteredReservations.length > 0 && (
                <div className="reservation-list">
                  <strong>Reservations:</strong>
                  <ul>
                    {filteredReservations.map((reservation, index) => (
                      <li key={index}>
                        {new Date(reservation.startDate).toLocaleString()} -{" "}
                        {new Date(reservation.endDate).toLocaleString()}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </form>

            {totalPrice !== null && (
              <p className="total-price">
                <strong>Total Price:</strong> {totalPrice} EUR
              </p>
            )}
          </div>
        </div>
      )}

      <button className="button" onClick={clearReservations}>
        Clear reservations
      </button>
    </div>
  );
}

export default CarsDropdown;
