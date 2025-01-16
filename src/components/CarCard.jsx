import carsData from "../data/cars.json";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

function CarCard() {
  const carID = 2;

  const [singleCar, setSingleCar] = useState(() => {
    const saved = localStorage.getItem("cars");
    return saved ? JSON.parse(saved) : carsData;
  });

  const car = singleCar.find(
    (car) => car.carID.toString() === carID.toString()
  );

  if (!car) {
    return (
      <div className="single-car-container">
        <h1>Car Not Found</h1>
        <p>We couldn't find the car you're looking for.</p>
      </div>
    );
  }

  return (
    <div className="single-car-container">
      <h1>
        {car.carMake} {car.carModel}
      </h1>
      <div className="single-car-image">
        <img src={car.image} alt={`${car.carMake} ${car.carModel}`} />
      </div>
      <div className="single-car-details">
        <p>
          <span>Engine:</span> {car.engine}
        </p>
        <p>
          <span>Color:</span> {car.color}
        </p>
        <p>
          <span>Year:</span> {car.carYear}
        </p>
        <p>
          <span>Price per 1 hour:</span> ${car.pricePer1h}
        </p>
        <p>
          <span>Wheel Drive:</span> {car.wheelDrive}
        </p>
        <p>
          <span>Fuel Type:</span> {car.fuelType}
        </p>
        <p>
          <span>Horse Power:</span> {car.horsePower} HP
        </p>
        <p>
          <span>Transmission:</span> {car.transmission}
        </p>
        <p>
          <span>Price per 2 hours:</span> ${car.pricePer2h}
        </p>
        <p>
          <span>Price per 5 hours:</span> ${car.pricePer5h}
        </p>
        <p>
          <span>Price per 24 hours:</span> ${car.pricePer24h}
        </p>
        <p>
          <span>Base Price per 1 hour:</span> ${car.basePricePer1h}
        </p>
      </div>
    </div>
  );
}

export default CarCard;
