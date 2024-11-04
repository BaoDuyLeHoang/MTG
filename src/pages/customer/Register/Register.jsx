import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header/header";
import AlertMessage from "../../../components/AlertMessage/AlertMessage";
import "./Register.css";
import lk from "../../../assets/logo/logo-giao-duc-an-nhien.png";

import { useAuth } from "../../../context/AuthContext";
import { ROLES } from "../../../utils/auth";
import { registerGuestAccount } from "../../../APIcontroller/API";
import { addToCart } from "../../../APIcontroller/API";
export default function Register() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const navigate = useNavigate();
  const { loginWithCredentials } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const registrationData = {
        phoneNumber,
        password,
        confirmPassword
      };

      console.log("Registration data being sent:", registrationData);

      const result = await registerGuestAccount(registrationData);
      console.log("Full register API response:", result);

      if (result.success) {
        console.log("Registration successful");

        // Show success alert
        setAlertMessage(result.message || "Đăng ký thành công!");
        setAlertSeverity("success");
        setAlertOpen(true);

        // Attempt to login with the registered credentials
        try {
          const loginResult = await loginWithCredentials(phoneNumber, password);
          if (loginResult.success) {
            console.log("Login successful after registration");
            const accountId = loginResult.user.accountId;
            const selectedMartyrId = sessionStorage.getItem("selectedMartyrId");
            const pendingServiceId = sessionStorage.getItem("pendingServiceId");
            if (selectedMartyrId && pendingServiceId && accountId) {
              try {
                console.log("Adding pending item to cart");
                await addToCart({
                  serviceId: pendingServiceId,
                  accountId: loginResult.user.accountId,
                  martyrId: selectedMartyrId
                }, loginResult.user.token);
                console.log("Successfully added pending item to cart");
                
                // Clear the pending items from session storage
                sessionStorage.removeItem("selectedMartyrId");
                sessionStorage.removeItem("pendingServiceId");
                
                // Redirect to cart page
                navigate("/cart");
                return; // Exit the function early
              } catch (error) {
                console.error("Error adding pending item to cart:", error);
                // You might want to show an error message to the user here
              }
            } else {
              // If there's no pending item, navigate to home page after a delay
              setTimeout(() => {
                navigate("/");
              }, 2000);
            }
          } else {
            console.error("Login failed after registration:", loginResult.error);
            setError("Registration successful, but login failed. Please try logging in manually.");
          }
        } catch (loginError) {
          console.error("Error during login after registration:", loginError);
          setError("Registration successful, but an error occurred during login. Please try logging in manually.");
        }
      } else {
        console.error("Registration failed:", result);
        throw new Error(result.error || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      
      const errorMessage = error.message || "An unexpected error occurred. Please try again.";

      setError(errorMessage);
      setAlertMessage(errorMessage);
      setAlertSeverity("error");
      setAlertOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
  };

  return (
    <div className="register-container">
      <Header />
      <div className="register-box">
        <div className="register-image">
          <img src={lk} className="register-logo" alt="Logo" />
        </div>
        <form className="register-form">
          <div className="input-group">
            <label>Số điện thoại</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Xác nhận mật khẩu</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" onClick={handleRegister} className="register-btn">
            Đăng ký
          </button>
        </form>
      </div>
      <AlertMessage
        open={alertOpen}
        handleClose={handleAlertClose}
        severity={alertSeverity}
        message={alertMessage}
      />
    </div>
  );
}
