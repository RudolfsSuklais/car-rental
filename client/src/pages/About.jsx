import React from "react";
import "./About.css";

function About() {
    return (
        <div className="about-page">
            <div className="about-page-headline">
                <h1>About GoCruise</h1>
                <p>
                    Welcome to GoCruise, your trusted partner for affordable,
                    reliable, and hassle-free car rentals. Whether you're
                    planning a weekend getaway, a business trip, or a long road
                    adventure, we’ve got the perfect vehicle for your journey.
                    At GoCruise, our mission is to provide exceptional customer
                    service, a wide variety of vehicles, and the convenience you
                    need to enjoy a smooth driving experience from start to
                    finish.
                </p>
            </div>

            <div className="about-page-why-us">
                <h2>Why choose us?</h2>
                <div className="why-us-wrapper">
                    <div className="why-us-1">
                        <i className="fa-solid fa-circle-info"></i>
                        <h4>24/7 support</h4>
                        <p>
                            We offer 24/7 support . Our dedicated team is
                            available around the clock to assist with bookings
                            or resolve any issues you encounter.
                        </p>
                    </div>
                    <div className="why-us-1">
                        <i className="fa-solid fa-location-dot"></i>
                        <h4>Flexible Pickup & Drop-Off</h4>
                        <p>
                            We offer flexible pickup and drop-off options to fit
                            your schedule, making your car rental experience as
                            convenient as possible.
                        </p>
                    </div>
                    <div className="why-us-1">
                        <i className="fa-solid fa-car"></i>
                        <h4>Wide Range of Vehicles</h4>
                        <p>
                            Whether you need an economy car, a family SUV, or a
                            luxury ride, we have a wide variety of vehicles to
                            suit every need and preference.
                        </p>
                    </div>
                </div>
            </div>
            <div>
                <h2>Cars that we offer</h2>
                <div className="about-page-cars">
                    <table>
                        <tr>
                            <td>
                                <img
                                    src="https://cdn.freebiesupply.com/logos/large/2x/audi-14-logo-png-transparent.png"
                                    alt=""
                                />
                            </td>
                            <td>
                                <img
                                    src="https://pngimg.com/d/opel_PNG12.png"
                                    alt=""
                                />
                            </td>
                            <td>
                                <img
                                    src="https://pngimg.com/uploads/bmw_logo/bmw_logo_PNG19707.png"
                                    alt=""
                                />
                            </td>
                            <td>
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png"
                                    alt=""
                                />
                            </td>
                            <td>
                                <img
                                    src="https://www.carlogos.org/logo/Rolls-Royce-RR-logo-1920x1080.png"
                                    alt=""
                                />
                            </td>
                            <td>
                                <img
                                    src="https://pngimg.com/d/lamborghini_PNG10709.png"
                                    alt=""
                                />
                            </td>
                            <td>
                                <img
                                    src="https://www.edigitalagency.com.au/wp-content/uploads/Ferrari-logo-png-large-icon-badge.png"
                                    alt=""
                                />
                            </td>
                            <td>
                                <img
                                    src="https://cdn.freebiesupply.com/logos/large/2x/mercedes-benz-9-logo-png-transparent.png"
                                    alt=""
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <img
                                    src="https://cdn.freebiesupply.com/logos/large/2x/volkswagen-3-logo-png-transparent.png"
                                    alt=""
                                />
                            </td>
                            <td>
                                <img
                                    src="https://pngimg.com/d/cadillac_PNG42.png"
                                    alt=""
                                />
                            </td>
                            <td>
                                <img
                                    src="https://pngimg.com/d/porsche_logo_PNG1.png"
                                    alt=""
                                />
                            </td>
                            <td>
                                <img
                                    src="https://pngimg.com/uploads/land_rover/land_rover_PNG39.png"
                                    alt=""
                                />
                            </td>
                            <td>
                                <img
                                    src="https://pngimg.com/d/dodge_PNG47.png"
                                    alt=""
                                />
                            </td>
                            <td>
                                <img
                                    src="https://loodibee.com/wp-content/uploads/GMC-Logo.png"
                                    alt=""
                                />
                            </td>
                            <td>
                                <img
                                    src="https://cdn.freebiesupply.com/logos/large/2x/nissan-6-logo-png-transparent.png"
                                    alt=""
                                />
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default About;
