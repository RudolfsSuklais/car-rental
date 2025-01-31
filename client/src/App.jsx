import "./App.css";
import NavBar from "./components/NavBar";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import SingleCarPage from "./pages/SingleCarPage";
import Home from "./pages/Home";
import CarList from "./pages/CarList";
import AddCarPage from "./pages/AddCarPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import BookingPage from "./pages/BookingPage";
import AllReservationsPage from "./pages/AllReservationsPage";
import ReservationConfirmation from "./pages/ReservationConfirmation";
import Footer from "./components/Footer";
import ScrollToTop from "./pages/ScrollToTop";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./pages/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import { UserContextProvider } from "../context/userContext";
import axios from "axios";
import MyReservations from "./pages/MyReservations";
import AllCars from "./pages/AllCars";
import AllUsers from "./pages/AllUsers";
import Profile from "./pages/Profile";
import PageNotFound from "./pages/PageNotFound";

const serverPort = import.meta.env.VITE_REACT_APP_SERVER_PORT || 5000;
const apiBaseURL =
    import.meta.env.VITE_REACT_APP_API_BASE_URL ||
    `http://localhost:${serverPort}`;

axios.defaults.baseURL = apiBaseURL;
axios.defaults.withCredentials = true;

function App() {
    return (
        <UserContextProvider>
            <BrowserRouter>
                <ScrollToTop />
                <NavBar />
                <Toaster
                    position="top-center"
                    toastOptions={{ duration: 5000 }}
                />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/profile" element={<Profile />} />

                    <Route
                        path="/add-car"
                        element={
                            <ProtectedRoute>
                                <AddCarPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/all-reservations"
                        element={
                            <ProtectedRoute>
                                <AllReservationsPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/all-cars"
                        element={
                            <ProtectedRoute>
                                <AllCars />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/all-users"
                        element={
                            <ProtectedRoute>
                                <AllUsers />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="/contact" element={<Contact />} />
                    <Route path="/*" element={<PageNotFound />} />
                    <Route
                        path="/my-reservations"
                        element={<MyReservations />}
                    />
                    <Route path="/car/:carID" element={<SingleCarPage />} />
                    <Route path="/booking/:carID" element={<BookingPage />} />
                    <Route path="/car-list" element={<CarList />} />
                    <Route path="/about" element={<About />} />
                    <Route
                        path="/reservations/:reservationID"
                        element={<ReservationConfirmation />}
                    />
                </Routes>
                <Footer />
            </BrowserRouter>
        </UserContextProvider>
    );
}

export default App;
