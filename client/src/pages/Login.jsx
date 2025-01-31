import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/userContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import "./Login.css";

export default function Login() {
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (showPassword) {
            document.getElementById("password").type = "text";
        } else {
            document.getElementById("password").type = "password";
        }
    }, [showPassword]);

    const [data, setData] = useState({
        email: "",
        password: "",
    });

    const loginUser = async (e) => {
        e.preventDefault();
        try {
            const { data: response } = await axios.post("/login", data, {
                withCredentials: true,
            });
            if (response.error) {
                toast.error(response.error);
            } else {
                setData({});
                const profileResponse = await axios.get("/profile");
                setUser(profileResponse.data);

                const redirectedFromRent =
                    localStorage.getItem("redirectedFromRent");

                if (redirectedFromRent) {
                    localStorage.removeItem("redirectedFromRent");
                    navigate(-1);
                } else {
                    navigate("/");
                }

                toast.success("Logged in successfully!");
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="login-page">
            <form onSubmit={loginUser}>
                <h1 style={{ fontWeight: "600", color: "#333" }}>Login</h1>
                <label>
                    <span>*</span>Email:
                </label>
                <input
                    required
                    type="email"
                    placeholder="Email..."
                    value={data.email}
                    onChange={(e) =>
                        setData({ ...data, email: e.target.value })
                    }
                />
                <label>
                    <span>*</span>Password:
                </label>
                <input
                    required
                    type="password"
                    placeholder="Password..."
                    id="password"
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
                <Link to={"/register"}>Create an account</Link>
                <div className="login-page-submit-btn-wrapper">
                    <button type="submit">Login</button>
                </div>
            </form>
        </div>
    );
}
