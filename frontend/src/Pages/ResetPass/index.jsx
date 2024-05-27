import { useState } from "react";
import NotificationCard from "./NotificationCard";
import { getAvatarUrl } from "../../utils/getAvar.js";
import CircularProgress from "../../components/CircularProgress";
import { Container, Button, Form, Image, Alert, Card } from "react-bootstrap";
import { pushSuccess, pushError } from "../../components/Toast";
import { baseUrl } from "../../config/index.js";
const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [message, setMessage] = useState("");
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async () => {
    // API call to backend to send OTP
    setLoading(true);
    const response = await fetch(`${baseUrl}/api/v1/users/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: email }),
    });
    const check = await response.json();
    setLoading(false);
    const data = check.data;
    if (check.success) {
      setUserData(data);
      setCurrentStep(2);
      pushSuccess(
        "Your email is found successfully. We will send reset code to your registered email."
      );
    } else {
      setMessage(check.message);
      pushError(check.message);
    }
  };

  const handleVerifyOTP = async () => {
    // API call to backend to verify OTP
    const response = await fetch(`${baseUrl}/api/v1/users/otpChecking`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    const data = await response.json();
    if (data.success) {
      setCurrentStep(4);
      setMessage("Reset code verified successfully.");
      pushSuccess("Reset code verified successfully.");
    } else {
      setMessage(data.message);
      pushError(data.message);
    }
  };

  const handlePasswordReset = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      pushError("Passwords do not match.");
      return;
    }
    // API call to reset the password
    const response = await fetch(`${baseUrl}/api/v1/users/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword }),
    });
    const data = await response.json();
    if (data.success) {
      setCurrentStep(5);
      setMessage("Password reset successfully.");
      pushSuccess("Password reset successfully.");
    } else {
      setMessage(data.message);
      pushError(data.message, "danger");
    }
  };

  const closeNotification = () => {
    setNotification({ show: false, message: "", type: "" });
  };
  const avatarUrl = getAvatarUrl(userData?.avatar, baseUrl);
  return (
    <div
      aria-live="polite"
      style={{ position: "relative", width: "100vw", height: "100vh" }}
    >
      <Container className="d-flex flex-column align-items-center justify-content-center min-vh-100">
        <div style={{ maxWidth: "400px", width: "100%" }}>
          {loading && (
            <div className="text-center">
              <CircularProgress />
              <p>Waiting for checking and providing reset code...</p>
            </div>
          )}

          {!loading && (
            <>
              <div style={{ maxWidth: "400px", width: "100%" }}>
                {message && (
                  <Alert
                    variant="info"
                    role="alert"
                    style={{ fontSize: "18px", marginBottom: "10px" }}
                  >
                    {message}
                  </Alert>
                )}

                <NotificationCard
                  show={notification.show}
                  message={notification.message}
                  type={notification.type}
                  onClose={closeNotification}
                />

                {currentStep === 1 && (
                  <Card className="p-4 mb-3">
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label
                          htmlFor="emailInput"
                          style={{ fontSize: "24px", marginBottom: "10px" }}
                        >
                          Email
                        </Form.Label>
                        <Form.Control
                          id="emailInput"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          style={{ height: "50px", fontSize: "16px" }}
                        />
                      </Form.Group>
                      <Button
                        style={{
                          fontSize: "18px",
                          padding: "12px 0",
                          width: "100%",
                        }}
                        onClick={handleEmailSubmit}
                      >
                        Send OTP
                      </Button>
                    </Form>
                  </Card>
                )}

                {currentStep === 2 && (
                  <Card className="p-4 mb-3">
                    <p style={{ fontSize: "24px", marginBottom: "10px" }}>
                      Your code has sent to default email of this account
                    </p>
                    {userData && (
                      <div className="text-center mb-3">
                        <Image
                          src={avatarUrl}
                          alt="User's Avatar"
                          roundedCircle
                          style={{ width: "80px", margin: "10px 0" }}
                        />
                        <p style={{ fontSize: "16px" }}>
                          Name: {userData.username}
                        </p>
                      </div>
                    )}
                    <Button
                      style={{
                        fontSize: "18px",
                        padding: "12px 0",
                        width: "100%",
                      }}
                      onClick={() => setCurrentStep(3)}
                    >
                      Confirm
                    </Button>
                  </Card>
                )}

                {currentStep === 3 && (
                  <Card className="p-4 mb-3">
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label
                          htmlFor="otpInput"
                          style={{ fontSize: "24px", marginBottom: "10px" }}
                        >
                          Confirm Reset Code
                        </Form.Label>
                        <Form.Control
                          id="otpInput"
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="Enter OTP"
                          style={{ height: "50px", fontSize: "16px" }}
                        />
                      </Form.Group>
                      <Button
                        style={{
                          fontSize: "18px",
                          padding: "12px 0",
                          width: "100%",
                        }}
                        onClick={handleVerifyOTP}
                      >
                        Verify Code
                      </Button>
                    </Form>
                  </Card>
                )}

                {currentStep === 4 && (
                  <Card className="p-4 mb-3">
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label htmlFor="newPasswordInput">
                          New Password
                        </Form.Label>
                        <Form.Control
                          id="newPasswordInput"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="New Password"
                          style={{ height: "50px", fontSize: "16px" }}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label htmlFor="confirmPasswordInput">
                          Confirm New Password
                        </Form.Label>
                        <Form.Control
                          id="confirmPasswordInput"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm New Password"
                          style={{ height: "50px", fontSize: "16px" }}
                        />
                      </Form.Group>
                      <Button
                        style={{
                          fontSize: "18px",
                          padding: "12px 0",
                          width: "100%",
                        }}
                        onClick={handlePasswordReset}
                      >
                        Reset Password
                      </Button>
                    </Form>
                  </Card>
                )}

                {currentStep === 5 && (
                  <Card className="p-4">
                    <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>
                      Password Reset Successfully
                    </h2>
                    <p style={{ fontSize: "18px" }}>
                      Your password has been updated. You can now use your new
                      password to log in.
                    </p>
                  </Card>
                )}
              </div>
            </>
          )}
        </div>
      </Container>
    </div>
  );
};

export default ResetPassword;
