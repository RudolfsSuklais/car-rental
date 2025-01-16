import React, { useState } from "react";
import carsData from "../data/cars.json";
import "./AddCar.css";
import { useNavigate } from "react-router-dom";

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
  const [basePricePer1h, setBasePricePer1h] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    const savedCars = JSON.parse(localStorage.getItem("cars")) || carsData;

    const newCar = {
      carID: String(savedCars.length + 1),
      carMake: carMake,
      carModel: carModel,
      engine: engine,
      wheelDrive: wheelDrive,
      fuelType: fuelType,
      horsePower: horsePower,
      carYear: carYear,
      color: color,
      transmission: transmission,
      image: image,
      pricePer1h: pricePer1h,
      pricePer2h: pricePer2h,
      pricePer5h: pricePer5h,
      pricePer24h: pricePer24h,
      basePricePer1h: basePricePer1h,
    };

    savedCars.push(newCar);

    localStorage.setItem("cars", JSON.stringify(savedCars));

    setCarMake("");
    setCarModel("");
    setEngine("");
    setColor("");
    setCarYear("");
    setWheelDrive("");
    setFuelType("");
    setHorsePower("");
    setTransmission("");
    setImage("");
    setPricePer2h("");
    setPricePer5h("");
    setPricePer24h("");
    setBasePricePer1h("");
    setPricePer1h("");

    alert("Car added successfully!");

    navigate(`/${newCar.carID}`);
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
            <input
              required
              type="text"
              value={wheelDrive}
              onChange={(e) => setWheelDrive(e.target.value)}
              placeholder="Enter car wheel drive"
            />
            <input
              required
              type="text"
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value)}
              placeholder="Enter car fuel type"
            />
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
            <input
              required
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="Enter car color"
            />
            <input
              required
              type="text"
              value={transmission}
              onChange={(e) => setTransmission(e.target.value)}
              placeholder="Enter car transmission type"
            />
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
            />
            <input
              required
              type="number"
              value={pricePer2h}
              onChange={(e) => setPricePer2h(e.target.value)}
              placeholder="Enter car price per 2 hour"
            />
            <input
              required
              type="number"
              value={pricePer5h}
              onChange={(e) => setPricePer5h(e.target.value)}
              placeholder="Enter car price per 5 hour"
            />
            <input
              required
              type="number"
              value={pricePer24h}
              onChange={(e) => setPricePer24h(e.target.value)}
              placeholder="Enter car price per 24 hour"
            />
            <input
              required
              type="number"
              value={basePricePer1h}
              onChange={(e) => setBasePricePer1h(e.target.value)}
              placeholder="Enter car base price per 1 hour"
            />
          </div>
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default AddCar;
