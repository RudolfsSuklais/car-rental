import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [data, setData] = useState({
        name: "",
        lastName: "",
        phone: "",
        address: "",
        city: "",
        country: "",
        postalCode: "",
        birthday: "",
        email: "",
        password: "",
    });

    useEffect(() => {
        if (showPassword) {
            document.getElementById("password").type = "text";
        } else {
            document.getElementById("password").type = "password";
        }
    }, [showPassword]);

    const registerUser = async (e) => {
        e.preventDefault();

        const today = new Date();
        const birthDate = new Date(data.birthday);
        let age = today.getFullYear() - birthDate.getFullYear();
        const month = today.getMonth() - birthDate.getMonth();
        if (
            month < 0 ||
            (month === 0 && today.getDate() < birthDate.getDate())
        ) {
            age--;
        }

        if (age < 18) {
            toast.error("You must be at least 18 years old to register.");
            return;
        }

        const {
            name,
            lastName,
            phone,
            address,
            city,
            country,
            postalCode,
            birthday,
            email,
            password,
        } = data;

        try {
            const { data } = await axios.post("/register", {
                name,
                lastName,
                phone,
                address,
                city,
                country,
                postalCode,
                birthday,
                email,
                password,
            });
            if (data.error) {
                toast.error(data.error);
            } else {
                setData({});
                toast.success("Registration Successful. Welcome!");
                navigate("/login");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="register-page">
            <form onSubmit={registerUser}>
                <h1 style={{ fontWeight: "600", color: "#333" }}>Register</h1>

                <div className="form-column-wrapper">
                    <div className="form-column-1">
                        <label className="form-label">
                            <span>*</span>Name:
                        </label>
                        <input
                            required
                            className="form-input"
                            type="text"
                            placeholder="First Name..."
                            value={data.name}
                            onChange={(e) =>
                                setData({ ...data, name: e.target.value })
                            }
                        />

                        <label className="form-label">
                            <span>*</span>Last Name:
                        </label>
                        <input
                            required
                            className="form-input"
                            type="text"
                            placeholder="Last Name..."
                            value={data.lastName}
                            onChange={(e) =>
                                setData({ ...data, lastName: e.target.value })
                            }
                        />

                        <label className="form-label">
                            <span>*</span>Phone:
                        </label>
                        <input
                            required
                            className="form-input"
                            type="text"
                            placeholder="Phone..."
                            value={data.phone}
                            onChange={(e) =>
                                setData({ ...data, phone: e.target.value })
                            }
                        />

                        <label className="form-label">
                            <span>*</span>Address:
                        </label>
                        <input
                            required
                            className="form-input"
                            type="text"
                            placeholder="Address..."
                            value={data.address}
                            onChange={(e) =>
                                setData({ ...data, address: e.target.value })
                            }
                        />

                        <label className="form-label">
                            <span>*</span>City:
                        </label>
                        <input
                            required
                            className="form-input"
                            type="text"
                            placeholder="City..."
                            value={data.city}
                            onChange={(e) =>
                                setData({ ...data, city: e.target.value })
                            }
                        />
                    </div>
                    <div className="form-column-2">
                        <label className="form-label">
                            <span>*</span>Country:
                        </label>
                        <input
                            required
                            className="form-input"
                            type="text"
                            placeholder="Country..."
                            value={data.country}
                            onChange={(e) =>
                                setData({ ...data, country: e.target.value })
                            }
                        />
                        <label className="form-label">
                            <span>*</span>Postal Code:
                        </label>
                        <input
                            required
                            className="form-input"
                            type="text"
                            placeholder="Postal Code..."
                            value={data.postalCode}
                            onChange={(e) =>
                                setData({ ...data, postalCode: e.target.value })
                            }
                        />
                        <label className="form-label">
                            <span>*</span>Birthday:
                        </label>
                        <input
                            required
                            className="form-input"
                            type="date"
                            placeholder="Birthday..."
                            value={data.birthday}
                            onChange={(e) =>
                                setData({ ...data, birthday: e.target.value })
                            }
                        />
                        <label className="form-label">
                            <span>*</span>Email:
                        </label>
                        <input
                            required
                            className="form-input"
                            type="email"
                            placeholder="Email..."
                            value={data.email}
                            onChange={(e) =>
                                setData({ ...data, email: e.target.value })
                            }
                        />
                        <label className="form-label">
                            <span>*</span>Password:
                        </label>
                        <input
                            required
                            className="form-input"
                            id="password"
                            type="password"
                            placeholder="Password..."
                            value={data.password}
                            onChange={(e) =>
                                setData({ ...data, password: e.target.value })
                            }
                        />
                        <div className="show-password">
                            <input
                                type="checkbox"
                                onClick={() => setShowPassword(!showPassword)}
                            />
                            Show Password
                        </div>
                    </div>
                </div>
                <div className="register-page-submit-btn-wrapper">
                    <Link to={"/login"}>I already have an account</Link>
                    <button className="form-button" type="submit">
                        Register
                    </button>
                </div>
            </form>
        </div>
    );
}
