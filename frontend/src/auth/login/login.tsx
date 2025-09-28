import React, { useEffect, useState } from "react";
import ImageWithBasePath from "../../core/common/imageWithBasePath";
import { Link, useNavigate } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
// import Password from "antd/es/input/Password";
import { login } from "../../service/api";
import { toast } from "react-toastify";
import { jwtDecode} from "jwt-decode";
import type { JwtPayload } from "jwt-decode";


interface CustomJwtPayload extends JwtPayload {
  role: number; // ya string, backend ke hisaab se
}
const Login = () => {
  const routes = all_routes;
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };
  useEffect(() => {
    localStorage.setItem("menuOpened", "Dashboard");
  }, []);
  const date = () => {
    return new Date().getFullYear();
  };



  interface LoginForm {
    email: string;
    password: string;
  }

  interface Errors {
    email?: string;
    password?: string;
  }

  const navigate = useNavigate()
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: '',
    password: ''
  })
  const [error, setError] = useState<Errors>({})


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }))
  }



  const validateLoginForm = (form: LoginForm) => {
    const errors: Errors = {};

    // ✅ Email validation
    if (!form.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = "Please enter a valid email address";
    }

    // ✅ Password validation
    if (!form.password) {
      errors.password = "Password is required";
    } else if (form.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    }
    //  else if (
    //   !/(?=.*[a-z])/.test(form.password) ||
    //   !/(?=.*[A-Z])/.test(form.password) ||
    //   !/(?=.*\d)/.test(form.password) ||
    //   !/(?=.*[@$!%*?&])/.test(form.password)
    // ) {
    //   errors.password =
    //     "Password must include uppercase, lowercase, number, and special character";
    // }
    setError(errors)
    return Object.keys(errors).length === 0
  };


  // ✅ Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // console.log("Form Submitted:", loginForm);

    if (!validateLoginForm(loginForm)) {
      return
    }
    try {
      const { data } = await login(loginForm)
      if (data.success) {
        toast.success(data.message)

        const decoded = jwtDecode<CustomJwtPayload>(data.token)
        localStorage.setItem('token' , JSON.stringify(decoded))
        if (decoded.role === 1) {
          navigate(`${routes.adminDashboard}`);
        } else if (decoded.role === 2) {
          navigate(`${routes.teacherDashboard}`);
        } else if (decoded.role === 3) {
          navigate(`${routes.studentDashboard}`);
        } else {
          navigate(`${routes.adminDashboard}`);
        }
      }

    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    }

    //  navigate(`${routes.adminDashboard}`)



  };

  return (
    <div className="container-fuild">
      <div className="w-100 overflow-hidden position-relative flex-wrap d-block vh-100">
        <div className="row">

          <div className="col-lg-6">
            <div className="login-background d-lg-flex align-items-center justify-content-center d-lg-block d-none flex-wrap vh-100 overflowy-auto">
              {/* <div>
                <ImageWithBasePath
                  src="assets/img/authentication/authentication-02.jpg"
                  alt=""
                />
              </div> */}
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
                      <div className="card-body pb-3">
                        <div className=" mb-4">
                          <h2 className="mb-2">Welcome</h2>
                          <p className="mb-0">
                            Please enter your details to sign in
                          </p>
                        </div>
                        <div className="mt-4">
                          <div className="d-flex align-items-center justify-content-center flex-wrap">
                            <div className="text-center me-2 flex-fill">
                              <Link
                                to="#"
                                className="bg-primary br-10 p-2 btn btn-primary  d-flex align-items-center justify-content-center"
                              >
                                <ImageWithBasePath
                                  className="img-fluid m-1"
                                  src="assets/img/icons/facebook-logo.svg"
                                  alt="Facebook"
                                />
                              </Link>
                            </div>
                            <div className="text-center me-2 flex-fill">
                              <Link
                                to="#"
                                className=" br-10 p-2 btn btn-outline-light  d-flex align-items-center justify-content-center"
                              >
                                <ImageWithBasePath
                                  className="img-fluid  m-1"
                                  src="assets/img/icons/google-logo.svg"
                                  alt="Facebook"
                                />
                              </Link>
                            </div>
                            <div className="text-center flex-fill">
                              <Link
                                to="#"
                                className="bg-dark br-10 p-2 btn btn-dark d-flex align-items-center justify-content-center"
                              >
                                <ImageWithBasePath
                                  className="img-fluid  m-1"
                                  src="assets/img/icons/apple-logo.svg"
                                  alt="Apple"
                                />
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className="login-or">
                          <span className="span-or">Or</span>
                        </div>
                        <div className="mb-3 ">
                          <label className="form-label">Email Address</label>
                          <div className="input-icon mb-3 position-relative">
                            <span className="input-icon-addon">
                              <i className="ti ti-mail" />
                            </span>
                            <input
                              name="email"
                              value={loginForm.email}
                              onChange={handleChange}
                              type="text"
                              className="form-control"
                              placeholder="Enter Email"
                              autoComplete="off"
                            />
                          </div>
                          {error.email && (<p className="text-danger">{error.email}</p>)}
                          <label className="form-label">Password</label>
                          <div className="pass-group">
                            <input
                              name="password"
                              placeholder="Enter Password"
                              value={loginForm.password}
                              onChange={handleChange}
                              autoComplete="off"
                              type={isPasswordVisible ? "text" : "password"}
                              className="pass-input form-control"
                            />
                            <span
                              className={`ti toggle-password ${isPasswordVisible ? "ti-eye" : "ti-eye-off"
                                }`}
                              onClick={togglePasswordVisibility}
                            />
                          </div>
                          {error.password && (<p className="text-danger">{error.password}</p>)}
                        </div>

                        <div className="form-wrap form-wrap-checkbox">
                          <div className="d-flex align-items-center">
                            <div className="form-check form-check-md mb-0">
                              <input
                                className="form-check-input mt-0"
                                type="checkbox"
                              />
                            </div>
                            <p className="ms-1 mb-0 ">Remember Me</p>
                          </div>
                          <div className="text-end ">
                            <Link to={routes.forgotPassword} className="link-danger">
                              Forgot Password?
                            </Link>
                          </div>
                        </div>
                        
                      </div>
                      <div className="p-4 pt-0">
                        <div className="mb-3">
                          <button
                            type="submit"
                            // to={routes.adminDashboard}
                            className="btn btn-primary w-100"
                          >
                            Sign In
                          </button>
                        </div>
                        {/* <div className="text-center">
                          <h6 className="fw-normal text-dark mb-0">
                            Don’t have an account?{" "}
                            <Link to={routes.register} className="hover-a ">
                              {" "}
                              Create Account
                            </Link>
                          </h6>
                        </div> */}
                      </div>
                    </div>
                    <div className="mt-5 text-center">
                      <p className="mb-0 ">Copyright © {date()} - Preskool</p>
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

export default Login;
