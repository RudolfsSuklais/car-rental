const Car = require("../models/cars");
const { v4: uuidv4 } = require("uuid");

const addCar = async (req, res) => {
    try {
        const {
            carMake,
            carModel,
            engine,
            wheelDrive,
            fuelType,
            horsePower,
            carYear,
            color,
            transmission,
            image,
            pricePer1h,
            pricePer2h,
            pricePer5h,
            pricePer24h,
            seats,
        } = req.body;

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
            return res.status(400).json({ error: "All fields are required." });
        }

        const newCar = new Car({
            carID: uuidv4(),
            carMake,
            carModel,
            engine,
            wheelDrive,
            fuelType,
            horsePower,
            carYear,
            color,
            transmission,
            image,
            pricePer1h,
            pricePer2h,
            pricePer5h,
            pricePer24h,
            seats,
        });

        await newCar.save();
        return res
            .status(201)
            .json({ message: "Car added successfully!", car: newCar });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to add car" });
    }
};

const getCars = async (req, res) => {
    try {
        const cars = await Car.find();
        return res.json(cars);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to get cars" });
    }
};

const getCarById = async (req, res) => {
    try {
        const car = await Car.findOne({ carID: req.params.carID });
        if (!car) {
            return res.status(404).json({ error: "Car not found" });
        }
        return res.json(car);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to get car" });
    }
};

const deleteCar = async (req, res) => {
    try {
        const { carID } = req.params;

        const deletedCar = await Car.findOneAndDelete({ carID });
        if (!deletedCar) {
            return res.status(404).json({ error: "Car not found" });
        }

        res.json({ message: "Car deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete car" });
    }
};

const updateCar = async (req, res) => {
    try {
        const { carID } = req.params;
        const updatedCar = req.body;
        const result = await Car.findOneAndUpdate({ carID }, updatedCar, {
            new: true,
        });
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update car" });
    }
};

module.exports = { addCar, getCars, getCarById, deleteCar, updateCar };
