import React, { useState, useEffect } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const [pickupDate, setPickupDate] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");
  const [isSearchBtnAvailable, setIsSearchBtnAvailable] = useState(false);
  const navigate = useNavigate();

  const handleFormSubmit = (e) => {
    e.preventDefault();

    navigate(`/car-list`, {
      state: { pickupDate, dropoffDate },
    });
  };

  useEffect(() => {
    setIsSearchBtnAvailable(pickupDate && dropoffDate);
  }, [pickupDate, dropoffDate]);

  return (
    <section className="home-page">
      <div className="home-page-hero-section">
        <h1>Go Cruise – Search, Compare & Save</h1>

        <div className="home-page-h3-wrapper">
          <h3>
            <i className="fa-solid fa-check"></i> Free cancellations on most
            bookings
          </h3>
          <h3>
            <i className="fa-solid fa-check"></i> 60,000+ locations
          </h3>
          <h3>
            <i className="fa-solid fa-check"></i> Customer support in 30+
            languages
          </h3>
        </div>
      </div>

      <form onSubmit={handleFormSubmit}>
        <div className="home-page-dropdown">
          <div className="home-page-dropdown-date-input">
            <label>Pick-up date:</label>
            <input
              type="datetime-local"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              required
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          <div className="home-page-dropdown-date-input">
            <label>Drop-off date:</label>
            <input
              type="datetime-local"
              value={dropoffDate}
              onChange={(e) => setDropoffDate(e.target.value)}
              required
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          <button
            type="submit"
            className="home-page-dropdown-btn"
            disabled={!isSearchBtnAvailable}
          >
            Search
          </button>
        </div>
      </form>

      <div className="home-page-car-brands">
        <h2 style={{ zIndex: "1", color: "white" }}>Variaty </h2>
      </div>
    </section>
  );
}

export default Home;
