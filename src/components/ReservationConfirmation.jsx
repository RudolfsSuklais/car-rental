import React from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import "./ReservationConfirmation.css";
import carsData from "../data/cars.json";

function ReservationConfirmation() {
  const { reservationID } = useParams();

  const [cars, setCars] = useState(() => {
    const saved = localStorage.getItem("cars");
    return saved ? JSON.parse(saved) : carsData;
  });

  const [reservations, setReservations] = useState(() => {
    const storedReservations = localStorage.getItem("reservations");
    return storedReservations ? JSON.parse(storedReservations) : [];
  });

  const reservation = reservations.find(
    (reservation) =>
      reservation.reservationID.toString() === reservationID.toString()
  );

  const chosenCar = cars.find(
    (car) => car.carID.toString() === reservation.carID.toString()
  );

  if (!reservationID) {
    return (
      <div className="reservation-confirmation-container">
        <h1>Reservation Not Found</h1>
        <p>We couldn't find the reservation you're looking for.</p>
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
        <img src={chosenCar.image} style={{ width: "400px" }} />
      </div>
      <h1>Thank You For Choosing Us! </h1>
    </div>
  );
}

export default ReservationConfirmation;
