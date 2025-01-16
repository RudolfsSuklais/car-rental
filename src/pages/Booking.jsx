import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import carsData from "../data/cars.json";
import "./Booking.css";
import { useLocation } from "react-router-dom";

function Booking() {
  const { state } = useLocation();
  const { carID } = useParams();
  const [car, setCar] = useState(null);
  const [reservations, setReservations] = useState([]);
  const { pickupDate, dropoffDate } = state || {};
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalPrice, setTotalPrice] = useState(null);
  const [notification, setNotification] = useState("");
  const [isAvailableBtn, setIsAvailableBtn] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    setStartDate(pickupDate);
    setEndDate(dropoffDate);
    const cars = JSON.parse(localStorage.getItem("cars")) || carsData;
    const selectedCar = cars.find((c) => c.carID.toString() === carID);
    setCar(selectedCar);

    const localReservations =
      JSON.parse(localStorage.getItem("reservations")) || [];
    setReservations(localReservations);
  }, [carID]);

  const calculateTotalPrice = (car, startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationHours = (end - start) / (1000 * 60 * 60);

    if (durationHours <= 1) return car.pricePer1h;
    if (durationHours > 1 && durationHours <= 2) return car.pricePer2h;
    if (durationHours > 2 && durationHours <= 5) return car.pricePer5h;
    if (durationHours > 5 && durationHours <= 24) return car.pricePer24h;
    if (durationHours > 24)
      return car.pricePer24h * Math.ceil(durationHours / 24);
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
      setNotification("Choose dates");
      setIsAvailableBtn(true);
      setTotalPrice(null);
    } else if (car && !isCarAvailable(car.carID, startDate, endDate)) {
      setNotification("Car is not available");
      setIsAvailableBtn(true);
      setTotalPrice(null);
    } else if (durationHours < 1) {
      setNotification("Duration must be at least 1 hour");
      setIsAvailableBtn(true);
      setTotalPrice(null);
    } else {
      setNotification("");
      setIsAvailableBtn(false);
      setTotalPrice(calculateTotalPrice(car, startDate, endDate));
    }
  }, [startDate, endDate, car, reservations]);

  const handleReservation = () => {
    const newReservation = {
      reservationID: reservations.length + 1,
      carID: car.carID,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      totalPrice,
    };
    const updatedReservations = [...reservations, newReservation];

    setReservations(updatedReservations);
    localStorage.setItem("reservations", JSON.stringify(updatedReservations));

    alert(`Reservation confirmed! Total price: ${totalPrice} EUR`);
    navigate(`/reservations/${newReservation.reservationID}`);
  };

  if (!car) {
    return (
      <div className="booking-container">
        <h1>Car Not Found</h1>
        <p>We couldn't find the car you're looking for.</p>
      </div>
    );
  }

  return (
    <div className="booking-container">
      <h1>
        {car.carMake} {car.carModel}
      </h1>
      <div className="car-details">
        <img src={car.image} alt={`${car.carMake} ${car.carModel}`} />
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
            {car.horsePower}
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
          <div className="price-list">
            <p>
              <b>Price for 1 hour: </b>
              {car.pricePer1h} EUR
            </p>
            <p>
              <b>Price for 2 hours: </b>
              {car.pricePer2h} EUR
            </p>
            <p>
              <b>Price for 5 hours: </b>
              {car.pricePer5h} EUR
            </p>
            <p>
              <b>Price for 1 day: </b>
              {car.pricePer24h} EUR
            </p>
          </div>
        </div>
      </div>
      <form
        className="reservation-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleReservation();
        }}
      >
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
                min={startDate || new Date().toISOString().slice(0, 16)}
                required
              />
            </label>
          </div>
        </div>

        <button type="submit" disabled={isAvailableBtn}>
          Rent
        </button>
      </form>
      <p className="notification">{notification}</p>
      {totalPrice !== null && <p>Total Price: {totalPrice} EUR</p>}
    </div>
  );
}

export default Booking;
