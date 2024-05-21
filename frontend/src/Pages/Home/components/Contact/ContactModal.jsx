import { useState } from "react";
import { FloatingLabel, Form } from "react-bootstrap";
import "./contact-modal.css";
import { pushError, pushSuccess } from "../../../../components/Toast";
import { baseUrl } from "../../../../config";

const ContactModal = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const errors = [];

    if (!fullName) {
      errors.push("Full Name is required");
    }

    if (!email) {
      errors.push("Email is required");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.push("Email is invalid");
    }

    if (!phoneNumber) {
      errors.push("Phone Number is required");
    }

    if (!message) {
      errors.push("Message is required");
    }

    if (errors.length > 0) {
      setLoading(true);
      errors.forEach((error) => pushError(error));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${baseUrl}/api/v1/form/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullName, email, phoneNumber, message }),
      });

      await res.json();
      if (res.ok) {
        pushSuccess("Form submitted successfully!");
        setFullName("");
        setEmail("");
        setPhoneNumber("");
        setMessage("");
      } else {
        pushError("Failed to submit form. Please try again later");
      }
    } catch (err) {
      console.error(err);
      pushError("Failed to submit form. Please try again later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact__modal">
      <form className="contact__form" onSubmit={handleSubmit}>
        <h3>GET IN TOUCH</h3>
        <FloatingLabel label="Full Name">
          <Form.Control
            type="text"
            name="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full Name"
          />
        </FloatingLabel>
        <FloatingLabel label="Email">
          <Form.Control
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
        </FloatingLabel>
        <FloatingLabel label="Phone Number">
          <Form.Control
            type="text"
            name="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Phone Number"
          />
        </FloatingLabel>
        <Form.Control
          as="textarea"
          name="message"
          rows="4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="How can we help you?"
        />
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default ContactModal;
