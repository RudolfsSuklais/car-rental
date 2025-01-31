import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const { data } = await axios.get("/profile");
                setUser(data);
            } catch (error) {
                console.log("Error fetching user profile: ", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const logout = () => {
        setUser(null);
        toast.success("Logged out successfully!");
        localStorage.removeItem("authToken");

        axios.post("/logout").catch((err) => {
            console.log("Logout error: ", err);
        });
    };

    return (
        <UserContext.Provider value={{ user, setUser, logout, loading }}>
            {children}
        </UserContext.Provider>
    );
}
