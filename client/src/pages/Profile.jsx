import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import "./Profile.css";

function Profile() {
    const [user, setUser] = useState(null);
    const [editDisabled, setEditDisabled] = useState(true);

    const calculateAge = (birthday) => {
        const today = new Date();
        const birthDate = new Date(birthday);
        let age = today.getFullYear() - birthDate.getFullYear();
        const month = today.getMonth();
        const day = today.getDate();

        if (
            month < birthDate.getMonth() ||
            (month === birthDate.getMonth() && day < birthDate.getDate())
        ) {
            age--;
        }
        return age;
    };

    const fetchProfile = async () => {
        try {
            const { data } = await axios.get("/profile");
            setUser({
                ...data,
                birthday: data.birthday
                    ? new Date(data.birthday).toISOString().split("T")[0]
                    : "",
            });
        } catch (error) {
            console.error("Error fetching profile:", error);
            toast.error("Failed to load profile");
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        const age = calculateAge(user.birthday);
        if (age < 18) {
            toast.error("You must be 18 years old.");
            return;
        }

        try {
            await axios.put(`/users/${user.userID}`, user);
            fetchProfile();
            setEditDisabled(true);
            window.location.reload();
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile");
        }
    };

    if (!user) {
        return <div>Loading profile...</div>;
    }

    function cancelEdit() {
        setEditDisabled(!editDisabled);
        fetchProfile();
    }

    return (
        <div className="profile-page">
            <h1>Profile</h1>

            <div className="profile-card">
                <div className="edit-button-container">
                    <button
                        className={!editDisabled ? "disabled" : "edit-button"}
                        onClick={() => setEditDisabled(!editDisabled)}>
                        <i className="fa-regular fa-pen-to-square"></i>
                        <span style={{ marginLeft: "8px", color: "#333" }}>
                            Edit
                        </span>
                    </button>
                    <p className={editDisabled ? "disabled" : ""}>
                        Press <b>"Save"</b> to save changes
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="profile-card-name">
                        <label>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={user.name || ""}
                            onChange={handleInputChange}
                            disabled={editDisabled}
                            required
                        />
                    </div>
                    <div className="profile-card-last-name">
                        <label>Last Name:</label>
                        <input
                            type="text"
                            name="lastName"
                            value={user.lastName || ""}
                            onChange={handleInputChange}
                            disabled={editDisabled}
                            required
                        />
                    </div>
                    <div className="profile-card-phone">
                        <label>Phone:</label>
                        <input
                            type="text"
                            name="phone"
                            value={user.phone || ""}
                            onChange={handleInputChange}
                            disabled={editDisabled}
                            required
                        />
                    </div>
                    <div className="profile-card-address">
                        <label>Address:</label>
                        <input
                            type="text"
                            name="address"
                            value={user.address || ""}
                            onChange={handleInputChange}
                            disabled={editDisabled}
                            required
                        />
                    </div>
                    <div className="profile-card-city">
                        <label>City:</label>
                        <input
                            type="text"
                            name="city"
                            value={user.city || ""}
                            onChange={handleInputChange}
                            disabled={editDisabled}
                            required
                        />
                    </div>
                    <div className="profile-card-country">
                        <label>Country:</label>
                        <input
                            type="text"
                            name="country"
                            value={user.country || ""}
                            onChange={handleInputChange}
                            disabled={editDisabled}
                            required
                        />
                    </div>
                    <div className="profile-card-postal-code">
                        <label>Postal Code:</label>
                        <input
                            type="text"
                            name="postalCode"
                            value={user.postalCode || ""}
                            onChange={handleInputChange}
                            disabled={editDisabled}
                            required
                        />
                    </div>
                    <div className="profile-card-birthday">
                        <label>Birthday:</label>
                        <input
                            required
                            type="date"
                            name="birthday"
                            value={user.birthday || ""}
                            onChange={handleInputChange}
                            disabled={editDisabled}
                        />
                    </div>
                    <div className="profile-card-email">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={user.email || ""}
                            onChange={handleInputChange}
                            disabled={editDisabled}
                            required
                        />
                    </div>

                    <div className="form-buttons">
                        <button
                            className={
                                editDisabled ? "disabled" : "edit-cancel-button"
                            }
                            disabled={editDisabled}
                            onClick={cancelEdit}
                            type="button">
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className={editDisabled ? "disabled" : ""}
                            disabled={editDisabled}>
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Profile;
