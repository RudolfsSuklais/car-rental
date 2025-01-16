import "./App.css";
import CarCard from "./components/CarCard";
import NavBar from "./components/NavBar";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import AddCar from "./components/AddCar";
import SingleCar from "./pages/SingleCar";
import ReservationConfirmation from "./components/ReservationConfirmation";
import Home from "./pages/Home";
import CarList from "./components/CarList";
import Booking from "./pages/Booking";

function App() {
  return (
    <>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-car" element={<AddCar />} />
          <Route path="/car-card" element={<CarCard />} />
          <Route path="/cars/:carID" element={<SingleCar />} />
          <Route path="/booking/:carID" element={<Booking />} />
          <Route path="/car-list" element={<CarList />} />
          <Route
            path="/reservations/:reservationID"
            element={<ReservationConfirmation />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
