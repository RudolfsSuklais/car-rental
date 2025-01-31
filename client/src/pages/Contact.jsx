import { useFormData } from "herotofu-react";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import "./Contact.css";
import toast from "react-hot-toast";

const ContactForm = () => {
    const { formState, getFormSubmitHandler } = useFormData(
        "https://public.herotofu.com/v1/b65d68e0-dc89-11ef-be95-ad6085502b45"
    );

    const [formSubmitted, setFormSubmitted] = useState(false);
    const [captchaValue, setCaptchaValue] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!captchaValue) {
            toast.error("Please complete the reCAPTCHA.");
            return;
        }

        getFormSubmitHandler()(e);
        setFormSubmitted(true);
        e.target.reset();
        setCaptchaValue(null);
        toast.success(
            "Message sent, we will get back to you as soon as possible!"
        );
    };

    return (
        <div className="contact-form-container">
            <h1>Contact GoCruise</h1>
            <form onSubmit={handleSubmit}>
                <div className="contact-form-input-name">
                    <input
                        type="text"
                        placeholder="Your name"
                        name="name"
                        className="contact-input"
                        required
                    />
                </div>
                <div className="contact-form-input-email">
                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        className="contact-input"
                        required
                    />
                </div>
                <div className="contact-form-input-message">
                    <textarea
                        placeholder="Your message"
                        name="message"
                        className="contact-input"
                        required
                    />
                </div>

                <div className="contact-form-input-captcha">
                    <ReCAPTCHA
                        sitekey="6LdDpMgqAAAAAL31OKv1BgukIdfGqJc3Zoh3wjEp"
                        onChange={(value) => setCaptchaValue(value)}
                    />
                </div>

                <div className="contact-form-input-button-container">
                    <button className="contact-submit-btn" type="submit">
                        Send a message
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ContactForm;
