//modules
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./index.css";
import { pushError, pushSuccess } from "../../components/Toast";

import ReCAPTCHA from "react-google-recaptcha";
import TermsPrivacyBanner from "./TermsPrivacyBanner";
import { baseUrl } from "../../config";

function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, dirtyFields, isSubmitting },
    setError,
  } = useForm({ mode: "onChange", criteriaMode: "all" });
  const password = watch("pwd");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfPassword, setShowConfPassword] = useState(false);
  const recaptchaRef = useRef(null);
  const [successMsg, setSuccessMsg] = useState(false);
  const Sitekey = import.meta.env.VITE_SITE_KEY;
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfPassword = () => {
    setShowConfPassword(!showConfPassword);
  };

  useEffect(() => {
    if (!window.grecaptcha) {
      const script = document.createElement("script");
      script.src = "https://www.google.com/recaptcha/api.js?";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const onSubmit = async (data) => {
    const recaptchaToken = recaptchaRef.current.getValue();

    if (!recaptchaToken) {
      pushError("Please complete the reCAPTCHA challenge");
      return;
    }

    const { confPwd, ...dataToSend } = data;
    const dataWithToken = { ...dataToSend, token: recaptchaToken };

    try {
      const response = await fetch(`${baseUrl}/api/v1/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataWithToken),
      });

      const responseBody = await response.json();
      const responseMsg = responseBody.message;
      if (!response.ok) {
        pushError(responseMsg);
      } else {
        navigate("/login");
        if (!successMsg) {
          pushSuccess("Please login to continue");
          pushSuccess(responseMsg);
          setSuccessMsg(true);
        }
      }
    } catch (error) {
      pushError("Something went wrong!");
    }
  };

  useEffect(() => {
    if (password) {
      trigger("confPwd");
    }
  }, [password, trigger]);

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="col-sm-6 col-lg-4 col-xl-3 mx-auto my-5 d-flex align-items-center flex-column rounded-4 shadow needs-validation register__form"
        noValidate
      >
        <strong className="mt-4 mb-4">
          <h3>Register your account</h3>
        </strong>

        <div className="mb-3 col-8">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            className={`form-control ${errors.username ? "is-invalid" : ""}${
              dirtyFields.username && !errors.username ? "is-valid" : ""
            }`}
            id="username"
            aria-describedby="username"
            placeholder="Enter your username"
            {...register("username", {
              required: "Username cannot be empty.",
              pattern: {
                value: /^\S*$/,
                message: "Username cannot contain spaces.",
              },
            })}
          />
          {errors.username && (
            <div className="invalid-feedback">{errors.username.message}</div>
          )}
        </div>

        <div className="mb-3 col-8">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}${
              dirtyFields.email && !errors.email ? "is-valid" : ""
            }`}
            id="email"
            aria-describedby="email"
            placeholder="Enter your email"
            {...register("email", {
              required: "Email cannot be empty.",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Email address must be valid.",
              },
            })}
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email.message}</div>
          )}
        </div>

        <div className="mb-3 col-8 form-group">
          <label htmlFor="pwd" className="form-label">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            className={`form-control ${errors.pwd ? "is-invalid" : ""}${
              dirtyFields.pwd && !errors.pwd ? "is-valid" : ""
            }`}
            id="pwd"
            placeholder="Enter your password"
            {...register("pwd", {
              required: "Password cannot be empty.",
              validate: {
                case: (value) =>
                  !/(?=.*[a-z])(?=.*[A-Z])/.test(value)
                    ? "At least one uppercase and lowercase letter"
                    : undefined,
                numeric: (value) =>
                  !/(?=.*\d)/.test(value) ? "At least one number" : undefined,
                special: (value) =>
                  !/(?=.*[@$!%*?&])/.test(value)
                    ? "At least one special character"
                    : undefined,
                length: (value) =>
                  !/^.{6,20}$/.test(value)
                    ? "At least 6 characters and at most 20 characters"
                    : undefined,
              },
            })}
          />
          <div className="position-relative">
            <FontAwesomeIcon
              className="eye-icon"
              icon={showPassword ? faEye : faEyeSlash}
              onClick={togglePassword}
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="pwd"
            render={({ messages }) => {
              return (
                messages && (
                  <ul className="invalid-feedback list-unstyled col-12">
                    {Object.entries(messages).map(([type, message]) => (
                      <li className="text-danger" key={type}>
                        {message}
                      </li>
                    ))}
                  </ul>
                )
              );
            }}
          />
        </div>

        <div className="mb-3 col-8 position-relative">
          <label htmlFor="confPwd" className="form-label">
            Confirm Password
          </label>
          <input
            type={showConfPassword ? "text" : "password"}
            className={`form-control ${errors.confPwd ? "is-invalid" : ""}${
              dirtyFields.confPwd && !errors.confPwd ? "is-valid" : ""
            }`}
            id="confPwd"
            placeholder="Re-enter your password"
            {...register("confPwd", {
              required: "Password cannot be empty.",
              validate: (value) => {
                return value === password || "Passwords do not match.";
              },
            })}
          />
          <div className="position-relative">
            <FontAwesomeIcon
              className="eye-icon"
              icon={showConfPassword ? faEye : faEyeSlash}
              onClick={toggleConfPassword}
            />
          </div>
          {errors.confPwd && (
            <div className="invalid-feedback">{errors.confPwd.message}</div>
          )}
        </div>

        <div className="mb-3">
          <ReCAPTCHA ref={recaptchaRef} sitekey={Sitekey} />
        </div>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mb-5 btn btn-primary col-8 normal__pad"
        >
          Submit
        </button>
      </form>
      <TermsPrivacyBanner />
    </>
  );
}

export default Register;
