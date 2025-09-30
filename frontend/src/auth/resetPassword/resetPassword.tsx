import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import ImageWithBasePath from "../../core/common/imageWithBasePath";
import { resetPassword } from "../../service/api";
import { toast } from "react-toastify";
// import { Toast } from "react-bootstrap";

type PasswordField = "otp" | "newPassword" | "confirmPassword";
export interface FormData {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ErrorState {
  email?: string;
  otp?: string;
  newPassword?: string;
  confirmPassword?: string;
};


const ResetPassword = () => {
  const routes = all_routes;
  const [passwordVisibility, setPasswordVisibility] = useState({
    otp: false,
    newPassword: false,
    confirmPassword: false,
  });

  const togglePasswordVisibility = (field: PasswordField) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const navigate = useNavigate();
  const location = useLocation()

  // ✅ Form state
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<ErrorState>({});
  const [resError, setResError] = useState<string>("")

  useEffect(() => {
    if (location.state?.email) {
      setFormData((prev) => ({ ...prev, email: location.state.email }));
    }
  }, [location.state]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors: ErrorState = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    // OTP validation (exactly 6 characters, only digits)
    if (!formData.otp.trim()) {
      newErrors.otp = "OTP is required";
    } else if (!/^\d{6}$/.test(formData.otp)) {
      newErrors.otp = "OTP must be exactly 6 digits";
    }

    // New password validation
    if (!formData.newPassword.trim()) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }

    // Confirm password validation
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // ✅ Update error state
    setErrors(newErrors);

    // return true if valid
    return Object.keys(newErrors).length === 0;
  };




  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const { data } = await resetPassword(formData)
      if (data.success) {
        toast.success(data.message)
        navigate(routes.resetPasswordSuccess);
        setErrors({})
        setResError("")
        setFormData({
          email: "",
          otp: "",
          newPassword: "",
          confirmPassword: "",
        })

      }
    } catch (error: any) {
      console.error("Reset password error:", error);
      setResError(error.response.data.message)
      // toast.error(error.response.data.message)
    }
  };

  return (
    <div className="container-fuild">
      <div className="login-wrapper w-100 overflow-hidden position-relative flex-wrap d-block vh-100">
        <div className="row">
          {/* ✅ Left side panel (unchanged) */}
          <div className="col-lg-6">
            <div className="login-background position-relative d-lg-flex align-items-center justify-content-center d-lg-block d-none flex-wrap vh-100 overflowy-auto">
              <div>
                <ImageWithBasePath
                  src="assets/img/authentication/authentication-04.jpg"
                  alt="Img"
                />
              </div>
              <div className="authen-overlay-item  w-100 p-4">
                <h4 className="text-white mb-3">What's New on Preskool !!!</h4>
                <div className="d-flex align-items-center flex-row mb-3 justify-content-between p-3 br-5 gap-3 card">
                  <div>
                    <h6>Summer Vacation Holiday Homework</h6>
                    <p className="mb-0 text-truncate">
                      The school will remain closed from April 20th to June...
                    </p>
                  </div>
                  <Link to="#">
                    <i className="ti ti-chevrons-right" />
                  </Link>
                </div>
                <div className="d-flex align-items-center flex-row mb-3 justify-content-between p-3 br-5 gap-3 card">
                  <div>
                    <h6>New Academic Session Admission Start(2024-25)</h6>
                    <p className="mb-0 text-truncate">
                      An academic term is a portion of an academic year, the
                      time ....
                    </p>
                  </div>
                  <Link to="#">
                    <i className="ti ti-chevrons-right" />
                  </Link>
                </div>
                <div className="d-flex align-items-center flex-row mb-3 justify-content-between p-3 br-5 gap-3 card">
                  <div>
                    <h6>Date sheet Final Exam Nursery to Sr.Kg</h6>
                    <p className="mb-0 text-truncate">
                      Dear Parents, As the final examination for the session
                      2024-25 is ...
                    </p>
                  </div>
                  <Link to="#">
                    <i className="ti ti-chevrons-right" />
                  </Link>
                </div>
                <div className="d-flex align-items-center flex-row mb-3 justify-content-between p-3 br-5 gap-3 card">
                  <div>
                    <h6>Annual Day Function</h6>
                    <p className="mb-0 text-truncate">
                      Annual functions provide a platform for students to
                      showcase their...
                    </p>
                  </div>
                  <Link to="#">
                    <i className="ti ti-chevrons-right" />
                  </Link>
                </div>
                <div className="d-flex align-items-center flex-row mb-0 justify-content-between p-3 br-5 gap-3 card">
                  <div>
                    <h6>Summer Vacation Holiday Homework</h6>
                    <p className="mb-0 text-truncate">
                      The school will remain closed from April 20th to June 15th
                      for summer...
                    </p>
                  </div>
                  <Link to="#">
                    <i className="ti ti-chevrons-right" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ✅ Right side form */}
          <div className="col-lg-6 col-md-12 col-sm-12">
            <div className="row justify-content-center align-items-center vh-100 overflow-auto flex-wrap ">
              <div className="col-md-8 mx-auto p-4">
                <form onSubmit={handleSubmit}>
                  <div>
                    <div className=" mx-auto mb-5 text-center">
                      <ImageWithBasePath
                        src="assets/img/authentication/authentication-logo.svg"
                        className="img-fluid"
                        alt="Logo"
                      />
                    </div>
                    <div className="card">
                      <div className="card-body p-4">
                        <div className=" mb-4">
                          <h2 className="mb-2">Reset Password?</h2>
                          <p className="mb-0">
                            Enter OTP, New Password & Confirm Password
                          </p>
                        </div>

                        {resError && (<p className="text-danger my-2 text-center fw-semibold" style={{ fontSize: "0.85rem" }}>{resError}</p>)}

                        <div className="mb-3">
                          <label className="form-label">Enter Otp</label>
                          <div className="pass-group">
                            <input
                              type="text"
                              name="otp"
                              value={formData.otp}
                              onChange={handleChange}
                              className="pass-input form-control"

                            />
                            {errors.otp && <p className="text-danger ">{errors.otp}</p>}
                          </div>
                        </div>

                        {/* ✅ New Password */}
                        <div className="mb-3">
                          <label className="form-label">New Password</label>
                          <div className="pass-group">
                            <input
                              type={
                                passwordVisibility.newPassword
                                  ? "text"
                                  : "password"
                              }
                              name="newPassword"
                              value={formData.newPassword}
                              onChange={handleChange}
                              className="pass-input form-control"

                            />
                            <span
                              className={`ti toggle-passwords ${passwordVisibility.newPassword
                                ? "ti-eye"
                                : "ti-eye-off"
                                }`}
                              onClick={() =>
                                togglePasswordVisibility("newPassword")
                              }
                            ></span>

                          </div>
                          {errors.newPassword && <p className="text-danger text-sm">{errors.newPassword}</p>}
                        </div>

                        {/* ✅ Confirm Password */}
                        <div className="mb-3">
                          <label className="form-label ">
                            New Confirm Password
                          </label>
                          <div className="pass-group">
                            <input
                              type={
                                passwordVisibility.confirmPassword
                                  ? "text"
                                  : "password"
                              }
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              className="pass-input form-control"

                            />
                            <span
                              className={`ti toggle-passwords ${passwordVisibility.confirmPassword
                                ? "ti-eye"
                                : "ti-eye-off"
                                }`}
                              onClick={() =>
                                togglePasswordVisibility("confirmPassword")
                              }
                            ></span>

                          </div>
                          {errors.confirmPassword && <p className="text-danger text-sm">{errors.confirmPassword}</p>}
                        </div>

                        <div className="mb-3">
                          <button
                            type="submit"
                            className="btn btn-primary w-100"
                          >
                            Change Password
                          </button>
                        </div>
                        <div className="text-center">
                          <h6 className="fw-normal text-dark mb-0">
                            Return to
                            <Link to={routes.login} className="hover-a ">
                              {" "}
                              Login
                            </Link>
                          </h6>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 text-center">
                      <p className="mb-0 ">Copyright © 2024 - Preskool</p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
