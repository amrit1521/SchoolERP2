import { useState } from "react";
import CommonSelect from "../../../../core/common/commonSelect";
import {
  bloodGroup,
  Contract,
  gender,
  Hostel,
  Marital,
  PickupPoint,
  roomno,
  route,
  Shift,
  staffDepartment,
  staffrole,
  VehicleNumber,
} from "../../../../core/common/selectoption/selectoption";
import { DatePicker } from "antd";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import TagInput from "../../../../core/common/Taginput";
import { toast } from "react-toastify";
import { deleteStaffFile, uploadStaffFile } from "../../../../service/staff";


export interface StaffData {
  firstname: string;
  lastname: string;
  primarycont: string;
  email: string;
  password: string;
  conpassword: string;
  status: string;

  // Teachers table fields
  teacher_id: string;
  fromclass: string;
  toclass: string;
  section: string;
  class: string;
  subject: string;
  gender: string;
  blood_gp: string;
  date_of_join: string;
  fat_name: string;
  mot_name: string;
  dob: string;
  mari_status: string;
  lan_known: string[];
  qualification: string;
  work_exp: string;
  prev_school: string;
  prev_school_addr: string;
  prev_school_num: string;
  address: string;
  perm_address: string;
  pan_or_id: string;
  other_info: string;

  // payroll
  epf_no: string;
  basic_salary: string;
  contract_type: string;
  work_sift: string;
  work_location: string;
  date_of_leave: string;

  // leaves
  medical_leaves: string;
  casual_leaves: string;
  maternity_leaves: string;
  sick_leaves: string;

  // bnak details
  account_name: string;
  account_num: string;
  bank_name: string;
  ifsc_code: string;
  branch_name: string;

  // transport info
  route: string;
  vehicle_num: string;
  pickup_point: string;

  // hostel info
  hostel: string;
  room_num: string;


  //  social media link 
  facebook_link: string;
  instagram_link: string;
  linked_link: string;
  twitter_link: string;



}

const AddStaff = () => {
  const [owner, setOwner] = useState<string[]>([]);
  const handleTagsChange = (newTags: string[]) => {
    setOwner(newTags);
  };
  const routes = all_routes;


  const [staffImg, setStaffImg] = useState<File | null>(null);
  const [staffResume, setStaffResume] = useState<File | null>(null);
  const [staffJoinLetter, setStaffJoinLetter] = useState<File | null>(null);

  const [staffImgpath, setStaffImgpath] = useState<string>("");
  const [staffResumepath, setStaffResumepath] = useState<string>("");
  const [staffJoinLetterpath, setStaffJoinLetterpath] = useState<string>("");

  const [staffImgid, setStaffImgid] = useState<number | null>(null);
  const [staffResumeid, setStaffResumeid] = useState<number | null>(null);
  const [staffJoinLetterid, setStaffJoinLetterid] = useState<number | null>(null);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    fieldName: string
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Allow only image or PDF
      if (!["image/jpeg", "image/png", "application/pdf"].includes(file.type)) {
        toast.error("Only JPG, PNG, or PDF files are allowed.");
        return;
      }

      setFile(file);

      const formData = new FormData();
      formData.append("stafffile", file);

      try {
        const res = await uploadStaffFile(formData);
        const uploadedPath = res.data.file; // filename from backend
        const id = res.data.insertId;

        if (fieldName === "staffImgpath") {
          setStaffImgpath(uploadedPath);
          setStaffImgid(id);
        } else if (fieldName === "staffResumepath") {
          setStaffResumepath(uploadedPath);
          setStaffResumeid(id);
        } else if (fieldName === "staffJoinLetterpath") {
          setStaffJoinLetterpath(uploadedPath);
          setStaffJoinLetterid(id);
        }
      } catch (error) {
        console.error("Uploading failed!", error);
        toast.error("File upload failed. Please try again.");
      }
    }
  };

  const deleteFile = async (id: number) => {
    if (!id) return;

    try {
      const res = await deleteStaffFile(id);

      if (res.data.success) {
        if (id === staffImgid) {
          setStaffImgid(null);
          setStaffImg(null);
          setStaffImgpath("");
        } else if (id === staffResumeid) {
          setStaffResumeid(null);
          setStaffResume(null);
          setStaffResumepath("");
        } else if (id === staffJoinLetterid) {
          setStaffJoinLetterid(null);
          setStaffJoinLetter(null);
          setStaffJoinLetterpath("");
        }
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("File deletion failed. Please try again.");
    }
  };


  console.log(staffResume,staffJoinLetter,staffResumepath,staffImgpath,staffJoinLetterpath)

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()

  //   if (!validateTeacherData(teacherData)) {
  //     return
  //   }

  //   try {
  //     if (!teacherData.password.trim() || teacherData.password !== teacherData.conpassword) {
  //       toast.error('Password and Confirm Password do not match !')
  //       return
  //     }


  //     const formData = new FormData()
  //     if (staffImg && staffResume && staffJoinLetter) {
  //       formData.append('img_src', staffImgpath)
  //       formData.append('resume_src', staffResumepath)
  //       formData.append('letter_src', staffJoinLetterpath)
  //     } else {
  //       toast.error('All files are required !')
  //       return
  //     }

  //     Object.entries(teacherData).forEach(([key, value]) => {
  //       if (Array.isArray(value)) {
  //         formData.append(key, JSON.stringify(value))
  //       } else {
  //         formData.append(key, value as string)
  //       }
  //     })

  //     // Object.entries(formData).forEach(([key, value]) => {
  //     //   console.log(key, value)
  //     // })

  //     const res = await addTeacher(formData)
  //     if (res.data.success) {
  //       toast.success(res.data.message);

  //       // Teacher data reset
  //       setTeacherData({
  //         first_name: "",
  //         last_name: "",
  //         primarycont: "",
  //         email: "",
  //         password: "",
  //         conpassword: "",
  //         status: "",
  //         teacher_id: "",
  //         fromclass: "",
  //         toclass: "",
  //         section: "",
  //         class: "",
  //         subject: "",
  //         gender: "",
  //         blood_gp: "",
  //         date_of_join: "",
  //         fat_name: "",
  //         mot_name: "",
  //         dob: "",
  //         mari_status: "",
  //         lan_known: [],
  //         qualification: "",
  //         work_exp: "",
  //         prev_school: "",
  //         prev_school_addr: "",
  //         prev_school_num: "",
  //         address: "",
  //         perm_address: "",
  //         pan_or_id: "",
  //         other_info: "",
  //         epf_no: "",
  //         basic_salary: "",
  //         contract_type: "",
  //         work_sift: "",
  //         work_location: "",
  //         date_of_leave: "",
  //         medical_leaves: "",
  //         casual_leaves: "",
  //         maternity_leaves: "",
  //         sick_leaves: "",
  //         account_name: "",
  //         account_num: "",
  //         bank_name: "",
  //         ifsc_code: "",
  //         branch_name: "",
  //         route: "",
  //         vehicle_num: "",
  //         pickup_point: "",
  //         hostel: "",
  //         room_num: "",
  //         facebook_link: "",
  //         instagram_link: "",
  //         linked_link: "",
  //         twitter_link: "",
  //       });

  //       // File states reset
  //       setStaffImg(null);
  //       setStaffResume(null);
  //       setStaffJoinLetter(null);

  //       setStaffImgpath("");
  //       setStaffResumepath("");
  //       setStaffJoinLetterpath("");

  //       setStaffImgid(null);
  //       setStaffResumeid(null);
  //       setStaffJoinLetterid(null);
  //       navigate(-1)

  //     }
  //   } catch (error: any) {
  //     console.log(error)
  //     toast.error(error.response.data.message)
  //   }
  // }



  return (
    <div>
      <>
        {/* Page Wrapper */}
        <div className="page-wrapper">
          <div className="content content-two">
            {/* Page Header */}
            <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
              <div className="my-auto mb-2">
                <h3 className="mb-1">Add Staff</h3>
                <nav>
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <Link to={routes.adminDashboard}>Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item">HRM</li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Add Staff
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
            {/* /Page Header */}
            <div className="row">
              <div className="col-md-12">
                <form >
                  {/* Personal Information */}
                  <div className="card">
                    <div className="card-header bg-light">
                      <div className="d-flex align-items-center">
                        <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                          <i className="ti ti-info-square-rounded fs-16" />
                        </span>
                        <h4 className="text-dark">Personal Information</h4>
                      </div>
                    </div>
                    <div className="card-body pb-1">
                      <div className="add-section">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="d-flex align-items-center flex-wrap row-gap-3 mb-3">
                              {
                                !staffImg ? <><div className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0 text-dark frames">
                                  <i className="ti ti-photo-plus fs-16" />
                                </div></> : <p className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0  frames"><img className="" src={URL.createObjectURL(staffImg)} alt="" /></p>
                              }
                              <div className="profile-upload">
                                <div className="profile-uploader d-flex align-items-center">
                                  <div className="drag-upload-btn mb-3">
                                    Upload
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="form-control image-sign"
                                      onChange={(e) => handleFileChange(e, setStaffImg, 'teacherImgpath')}

                                    />
                                  </div><span className="text-danger"> *</span>
                                  {staffImgid && (<div onClick={() => deleteFile(staffImgid)} className="btn btn-outline-danger mb-3 ">
                                    Remove
                                  </div>)}
                                </div>
                                <p className="fs-12">
                                  Upload image size 4MB, Format JPG, PNG
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row row-cols-xxl-5 row-cols-md-6">
                          <div className="col-xxl col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">First Name</label>
                              <input type="text" className="form-control" />
                            </div>
                          </div>
                          <div className="col-xxl col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Last Name</label>
                              <input type="text" className="form-control" />
                            </div>
                          </div>
                          <div className="col-xxl col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Role</label>
                              <CommonSelect
                                className="select"
                                options={staffrole}
                              />
                            </div>
                          </div>
                          <div className="col-xxl col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Department</label>
                              <CommonSelect
                                className="select"
                                options={staffDepartment}
                              />
                            </div>
                          </div>
                          <div className="col-xxl col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Designation</label>
                              <CommonSelect
                                className="select"
                                options={staffrole}
                              />
                            </div>
                          </div>
                          <div className="col-xxl col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Gender</label>
                              <CommonSelect
                                className="select"
                                options={gender}
                              />
                            </div>
                          </div>
                          <div className="col-xxl col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Primary Contact Number
                              </label>
                              <input type="text" className="form-control" />
                            </div>
                          </div>
                          <div className="col-xxl col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Email Address
                              </label>
                              <input type="email" className="form-control" />
                            </div>
                          </div>
                          <div className="col-xxl col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Blood Group</label>
                              <CommonSelect
                                className="select"
                                options={bloodGroup}
                              />
                            </div>
                          </div>
                          <div className="col-xxl col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Marital Status
                              </label>
                              <CommonSelect
                                className="select"
                                options={Marital}
                              />
                            </div>
                          </div>
                          <div className="col-xxl col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Father’s Name
                              </label>
                              <input type="text" className="form-control" />
                            </div>
                          </div>
                          <div className="col-xxl col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Mother’s Name
                              </label>
                              <input type="text" className="form-control" />
                            </div>
                          </div>
                          <div className="col-xxl col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Date of Birth
                              </label>
                              <div className="input-icon position-relative">
                                <DatePicker
                                  className="form-control datetimepicker"
                                  format={{
                                    format: "DD-MM-YYYY",
                                    type: "mask",
                                  }}
                                  placeholder="Select Date"
                                />
                                <span className="input-icon-addon">
                                  <i className="ti ti-calendar" />
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="col-xxl col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Date of Joining
                              </label>
                              <div className="input-icon position-relative">
                                <span className="input-icon-addon">
                                  <i className="ti ti-calendar" />
                                </span>
                                <DatePicker
                                  className="form-control datetimepicker"
                                  format={{
                                    format: "DD-MM-YYYY",
                                    type: "mask",
                                  }}
                                  placeholder="Select Date"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-xxl col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Language Known
                              </label>
                              <TagInput
                                initialTags={owner}
                                onTagsChange={handleTagsChange}
                              />
                            </div>
                          </div>
                          <div className="col-xxl-4 col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Qualification
                              </label>
                              <input type="text" className="form-control" />
                            </div>
                          </div>
                          <div className="col-xxl-4 col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Work Experience
                              </label>
                              <input type="text" className="form-control" />
                            </div>
                          </div>
                          <div className="col-xxl-4  col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Note</label>
                              <input type="text" className="form-control" />
                            </div>
                          </div>
                          <div className="col-xxl-6 col-xl-3  col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Address</label>
                              <input type="text" className="form-control" />
                            </div>
                          </div>
                          <div className="col-xxl-6 col-xl-3  col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Permanent Address
                              </label>
                              <input type="text" className="form-control" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Personal Information */}
                  {/* Payroll */}
                  <div className="card ">
                    <div className="card-header bg-light">
                      <div className="d-flex align-items-center">
                        <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                          <i className="ti ti-user-shield fs-16" />
                        </span>
                        <h4 className="text-dark">Payroll</h4>
                      </div>
                    </div>
                    <div className="card-body pb-1">
                      <div className="row">
                        <div className="col-lg-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">EPF No</label>
                            <input type="text" className="form-control" />
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Basic Salary</label>
                            <input type="text" className="form-control" />
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Contract Type</label>
                            <CommonSelect
                              className="select"
                              options={Contract}
                            />
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Work Shift</label>
                            <CommonSelect className="select" options={Shift} />
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Work Location</label>
                            <input type="text" className="form-control" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Payroll */}
                  {/* Leaves */}
                  <div className="card">
                    <div className="card-header bg-light">
                      <div className="d-flex align-items-center">
                        <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                          <i className="ti ti-users fs-16" />
                        </span>
                        <h4 className="text-dark">Leaves</h4>
                      </div>
                    </div>
                    <div className="card-body pb-1">
                      <div className="row">
                        <div className="col-lg-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Medical Leaves</label>
                            <input type="text" className="form-control" />
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Casual Leaves</label>
                            <input type="text" className="form-control" />
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              Maternity Leaves
                            </label>
                            <input type="text" className="form-control" />
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Sick Leaves</label>
                            <input type="text" className="form-control" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Leaves */}
                  {/* Bank Details */}
                  <div className="card">
                    <div className="card-header bg-light">
                      <div className="d-flex align-items-center">
                        <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                          <i className="ti ti-users fs-16" />
                        </span>
                        <h4 className="text-map">Bank Account Detail</h4>
                      </div>
                    </div>
                    <div className="card-body pb-1">
                      <div className="row">
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Account Name</label>
                            <input type="text" className="form-control" />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Account Number</label>
                            <input type="text" className="form-control" />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Bank Name</label>
                            <input type="text" className="form-control" />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">IFSC Code</label>
                            <input type="text" className="form-control" />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Branch Name</label>
                            <input type="text" className="form-control" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Bank Details */}
                  {/* Transport Information */}
                  <div className="card">
                    <div className="card-header bg-light d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                          <i className="ti ti-bus-stop fs-16" />
                        </span>
                        <h4 className="text-dark">Transport Information</h4>
                      </div>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                        />
                      </div>
                    </div>
                    <div className="card-body pb-1">
                      <div className="row">
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Route</label>
                            <CommonSelect className="select" options={route} />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Vehicle Number</label>
                            <CommonSelect
                              className="select"
                              options={VehicleNumber}
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Pickup Point</label>
                            <CommonSelect
                              className="select"
                              options={PickupPoint}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Transport Information */}
                  {/* Hostel Information */}
                  <div className="card">
                    <div className="card-header bg-light d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                          <i className="ti ti-building-fortress fs-16" />
                        </span>
                        <h4 className="text-dark">Hostel Information</h4>
                      </div>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                        />
                      </div>
                    </div>
                    <div className="card-body pb-1">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Hostel</label>
                            <CommonSelect className="select" options={Hostel} />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Room No</label>
                            <CommonSelect className="select" options={roomno} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Hostel Information */}
                  {/* Social Media Links */}
                  <div className="card">
                    <div className="card-header bg-light">
                      <div className="d-flex align-items-center">
                        <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                          <i className="ti ti-building fs-16" />
                        </span>
                        <h4 className="text-dark">Social Media Links</h4>
                      </div>
                    </div>
                    <div className="card-body pb-1">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Facebook URL</label>
                            <input type="text" className="form-control" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Twitter URL</label>
                            <input type="text" className="form-control" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Linkediin URL</label>
                            <input type="text" className="form-control" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Instagram URL</label>
                            <input type="text" className="form-control" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Social Media Links */}
                  {/* Documents */}
                  <div className="card">
                    <div className="card-header bg-light">
                      <div className="d-flex align-items-center">
                        <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                          <i className="ti ti-file fs-16" />
                        </span>
                        <h4 className="text-dark">Documents</h4>
                      </div>
                    </div>
                    <div className="card-body pb-1">
                      <div className="row">
                        <div className="col-lg-6">
                          <div className="mb-2">
                            <div className="mb-3">
                              <label className="form-label">
                                Upload Resume
                              </label><span className="text-danger"> *</span>
                              <p>
                                Upload image size of 4MB, Accepted Format PDF
                              </p>
                            </div>
                            <div className="d-flex align-items-center flex-wrap">
                              <div className="btn btn-primary drag-upload-btn mb-2 me-2">
                                <i className="ti ti-file-upload me-1" />
                                Change
                                <input
                                  type="file"
                                  className="form-control image_sign"
                                  accept="application/pdf"
                                  onChange={(e) => handleFileChange(e, setStaffResume, 'teacherResumepath')}
                                />
                              </div>
                              {staffResumeid && (<div onClick={() => deleteFile(staffResumeid)} className="btn btn-sm btn-outline-danger mb-2 ">
                                Remove
                              </div>)}
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="mb-2">
                            <div className="mb-3">
                              <label className="form-label">
                                Upload Joining Letter
                              </label><span className="text-danger"> *</span>
                              <p>
                                Upload image size of 4MB, Accepted Format PDF
                              </p>
                            </div>
                            <div className="d-flex align-items-center flex-wrap">
                              <div className="btn btn-primary drag-upload-btn mb-2 me-2">
                                <i className="ti ti-file-upload me-1" />
                                Upload Document
                                <input
                                  type="file"
                                  className="form-control image_sign"
                                  accept="application/pdf"
                                  onChange={(e) => handleFileChange(e, setStaffJoinLetter, 'teacherJoinLetterpath')}
                                />
                              </div>
                              {staffJoinLetterid && (<div onClick={() => deleteFile(staffJoinLetterid)} className="btn btn-sm btn-outline-danger mb-2 ">
                                Remove
                              </div>)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Documents */}
                  {/* Password */}
                  <div className="card">
                    <div className="card-header bg-light">
                      <div className="d-flex align-items-center">
                        <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                          <i className="ti ti-file fs-16" />
                        </span>
                        <h4 className="text-dark">Password</h4>
                      </div>
                    </div>
                    <div className="card-body pb-1">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">New Password</label>
                            <input type="password" className="form-control" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              Confirm Password
                            </label>
                            <input type="password" className="form-control" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Password */}
                  <div className="text-end">
                    <button type="button" className="btn btn-light me-3">
                      Cancel
                    </button>
                    <Link to={routes.staff} className="btn btn-primary">
                      Add Staff
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* /Page Wrapper */}
      </>
    </div>
  );
};

export default AddStaff;
