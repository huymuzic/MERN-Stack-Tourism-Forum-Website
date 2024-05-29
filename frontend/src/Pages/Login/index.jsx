//modules
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./index.css";
import { pushError, pushSuccess } from "../../components/Toast";
import { useUser } from "../../utils/UserContext";
import { baseUrl } from "../../config";

function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields, isSubmitting },
  } = useForm({ mode: "onChange" });
  const [showPassword, setShowPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${baseUrl}/api/v1/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseBody = await response.json();
      if (!response.ok) {
        pushError(responseBody.message);
      } else {
        if (!successMsg) {
          pushSuccess(responseBody.message);
          setSuccessMsg(true);
        }
        navigate("/");
        window.location.reload();
      }
    } catch (error) {
      pushError("Something went wrong!");
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="col-sm-6 col-lg-4 col-xl-3 mx-auto mt-5 mb-5 d-flex align-items-center flex-column rounded-4 shadow login__form"
      >
        <strong className="mt-4 mb-4">
          <h3>Welcome back!</h3>
        </strong>

        <div className="mb-3 col-8">
          <label htmlFor="identifierInput" className="form-label">
            Username or Email address
          </label>
          <input
            type="text"
            className={`form-control ${errors.identifier ? "is-invalid" : ""}${
              dirtyFields.identifier && !errors.identifier ? "is-valid" : ""
            }`}
            id="identifierInput"
            aria-describedby="identifierInput"
            placeholder="Username or email"
            {...register("identifier", {
              required: "Username or Email cannot be empty.",
            })}
          />
          {errors.identifier && (
            <div className="invalid-feedback">{errors.identifier.message}</div>
          )}
        </div>

        <div className="mb-1 col-8">
          <label htmlFor="pwdInput" className="form-label">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            className={`form-control ${errors.pwd ? "is-invalid" : ""}${
              dirtyFields.pwd && !errors.pwd ? "is-valid" : ""
            }`}
            id="pwdInput"
            placeholder="Your password"
            aria-describedby="pwdInput"
            {...register("pwd", {
              required: "Password cannot be empty.",
            })}
          />
          <div className="position-relative">
            <FontAwesomeIcon
              className="eye-icon"
              icon={showPassword ? faEye : faEyeSlash}
              onClick={togglePasswordVisibility}
            />
          </div>
          {errors.pwd && (
            <div className="invalid-feedback">{errors.pwd.message}</div>
          )}
        </div>

        <a className="mb-3 text-end col-8" href="/resetPass">
          Forgot password?
        </a>

        <div className="mb-3 form-check col-8">
          <input
            type="checkbox"
            className="form-check-input"
            id="remember"
            {...register("rem")}
            defaultChecked={false}
          ></input>
          <label className="form-check-label" htmlFor="remember">
            Remember me
          </label>
        </div>

        <p>
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mb-5 btn btn-primary col-8 normal_pad"
        >
          Submit
        </button>
      </form>
    </>
  );
}

export default Login;
