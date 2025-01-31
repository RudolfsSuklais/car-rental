const Reservation = require("../models/reservations");

const addReservations = async (req, res) => {
    try {
        const newReservation = new Reservation(req.body);
        await newReservation.save();
        res.status(201).json(newReservation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add reservation" });
    }
};

const getReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find();
        res.json(reservations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to retrieve reservations" });
    }
};

const getReservationById = async (req, res) => {
    try {
        const reservation = await Reservation.findOne({
            reservationID: req.params.reservationID,
        });

        if (!reservation) {
            return res.status(404).json({ error: "Reservation not found" });
        }
        res.json(reservation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to retrieve reservation" });
    }
};

const deleteReservation = async (req, res) => {
    try {
        const { reservationID } = req.params;

        const deletedReservation = await Reservation.findOneAndDelete({
            reservationID,
        });
        if (!deletedReservation) {
            return res.status(404).json({ error: "Reservation not found" });
        }

        res.json({ message: "Reservation deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete reservation" });
    }
};

module.exports = {
    addReservations,
    getReservations,
    getReservationById,
    deleteReservation,
};
