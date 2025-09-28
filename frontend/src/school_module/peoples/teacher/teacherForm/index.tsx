import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import { feeGroup, feesTypes, paymentType } from '../../../core/common/selectoption/selectoption'
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { all_routes } from "../../../router/all_routes";
import {

  Contract,
  Hostel,
  Marital,
  PickupPoint,
  Shift,
  VehicleNumber,
  allClass,
  allSubject,
  bloodGroup,
  gender,
  roomNO,
  route,
  status,

} from "../../../../core/common/selectoption/selectoption";

import CommonSelect from "../../../../core/common/commonSelect";
import { useLocation } from "react-router-dom";
import TagInput from "../../../../core/common/Taginput";
import { toast } from "react-toastify";
import { addTeacher, deleteTeacherFile, uploadTeacherFile } from "../../../../service/api";

const TeacherForm = () => {
  const routes = all_routes;

  const [isEdit, setIsEdit] = useState<boolean>(false);

  const [defaultDate, setDefaultDate] = useState<dayjs.Dayjs | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === routes.editTeacher) {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0"); // Month is zero-based, so we add 1
      const day = String(today.getDate()).padStart(2, "0");
      const formattedDate = `${month}-${day}-${year}`;
      const defaultValue = dayjs(formattedDate);
      setIsEdit(true);
      // setOwner(["English"]);
      setDefaultDate(defaultValue);
      console.log(formattedDate, 11);
    } else {
      setIsEdit(false);
      setDefaultDate(null);
    }
  }, [location.pathname]);

  console.log(defaultDate?"":"")
  interface TeacherData {

    first_name: string;
    last_name: string;
    primarycont: string;
    email: string;
    newpassword: string;
    password: string;
    status: string;

    // Teachers table fields
    teacher_id: string;
    fromclass: string;
    toclass: string;
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

  const [teacherData, setTeacherData] = useState<TeacherData>({
    first_name: "",
    last_name: "",
    primarycont: "",
    email: "",
    newpassword: "",
    password: "",
    status: "",
    teacher_id: "",
    fromclass: "",
    toclass: "",
    class: "",
    subject: "",
    gender: "",
    blood_gp: "",
    date_of_join: "",
    fat_name: "",
    mot_name: "",
    dob: "",
    mari_status: "",
    lan_known: [],
    qualification: "",
    work_exp: "",
    prev_school: "",
    prev_school_addr: "",
    prev_school_num: "",
    address: "",
    perm_address: "",
    pan_or_id: "",
    other_info: "",
    epf_no: "",
    basic_salary: "",
    contract_type: "",
    work_sift: "",
    work_location: "",
    date_of_leave: "",
    medical_leaves: "",
    casual_leaves: "",
    maternity_leaves: "",
    sick_leaves: "",
    account_name: "",
    account_num: "",
    bank_name: "",
    ifsc_code: "",
    branch_name: "",
    // transport info
    route: "",
    vehicle_num: "",
    pickup_point: "",

    // hostel info
    hostel: "",
    room_num: "",

    facebook_link: "",
    instagram_link: "",
    linked_link: "",
    twitter_link: "",

  });


  const [teacherImg, setTeacherImg] = useState<File | null>(null);
  const [teacherResume, setTeacherResume] = useState<File | null>(null);
  const [teacherJoinLetter, setTeacherJoinLetter] = useState<File | null>(null);

  const [teacherImgpath, setTeacherImgpath] = useState<string>("");
  const [teacherResumepath, setTeacherResumepath] = useState<string>("");
  const [teacherJoinLetterpath, setTeacherJoinLetterpath] = useState<string>("");

  const [teacherImgid, setTeacherImgid] = useState<number | null>(null);
  const [teacherResumeid, setTeacherResumeid] = useState<number | null>(null);
  const [teacherJoinLetterid, setTeacherJoinLetterid] = useState<number | null>(null);

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
      formData.append("teacherfile", file);

      try {
        const res = await uploadTeacherFile(formData);
        const uploadedPath = res.data.file; // filename from backend
        const id = res.data.insertId;

        if (fieldName === "teacherImgpath") {
          setTeacherImgpath(uploadedPath);
          setTeacherImgid(id);
        } else if (fieldName === "teacherResumepath") {
          setTeacherResumepath(uploadedPath);
          setTeacherResumeid(id);
        } else if (fieldName === "teacherJoinLetterpath") {
          setTeacherJoinLetterpath(uploadedPath);
          setTeacherJoinLetterid(id);
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
      const res = await deleteTeacherFile(id);

      if (res.data.success) {
        if (id === teacherImgid) {
          setTeacherImgid(null);
          setTeacherImg(null);
          setTeacherImgpath("");
        } else if (id === teacherResumeid) {
          setTeacherResumeid(null);
          setTeacherResume(null);
          setTeacherResumepath("");
        } else if (id === teacherJoinLetterid) {
          setTeacherJoinLetterid(null);
          setTeacherJoinLetter(null);
          setTeacherJoinLetterpath("");
        }
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("File deletion failed. Please try again.");
    }
  };



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTeacherData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleDateChange = (
    name: keyof TeacherData,
    date: dayjs.Dayjs | null,
    dateString: string
  ) => {
    console.log(date ? "" : "")
    setTeacherData((prev) => ({ ...prev, [name]: dateString }));
  };

  // Handle for CommonSelect
  const handleSelectChange = (name: keyof TeacherData, value: string | number) => {
    setTeacherData((prev) => ({ ...prev, [name]: value }));
  };


  // Generic tag handler
  const handleTagsChange = (field: keyof typeof teacherData, tags: string[]) => {
    setTeacherData((prev) => ({
      ...prev,
      [field]: tags
    }));
  };

  // ✅ Validation function
  const validateTeacherData = (data: TeacherData): string[] => {
    const errors: string[] = [];

    // Basic info
    if (!data.first_name.trim()) errors.push("First name is required");
    if (!data.last_name.trim()) errors.push("Last name is required");
    if (!data.primarycont.trim() || !/^\d{10}$/.test(data.primarycont))
      errors.push("Valid 10-digit contact number is required");
    if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      errors.push("Valid email is required");

    // Password
    if (!data.password.trim()) {
      errors.push("Password is required");
    } else if (data.password !== data.newpassword) {
      errors.push("Password and confirm password do not match");
    }

    // Teacher details
    if (!data.teacher_id.trim()) errors.push("Teacher ID is required");
    if (!data.class.trim()) errors.push("Class is required");
    // if (!data.section?.trim()) errors.push("Section is required"); 
    if (!data.subject.trim()) errors.push("Subject is required");
    if (!data.gender.trim()) errors.push("Gender is required");
    if (!data.date_of_join.trim()) errors.push("Date of joining is required");
    if (!data.dob.trim()) errors.push("Date of birth is required");

    // Payroll
    if (!data.basic_salary.trim()) errors.push("Basic salary is required");
    if (!data.contract_type.trim()) errors.push("Contract type is required");

    // Bank details
    if (!data.account_num.trim()) errors.push("Bank account number is required");
    if (!data.ifsc_code.trim()) errors.push("IFSC code is required");
    if (!data.bank_name.trim()) errors.push("Bank name is required");

    return errors;
  };




  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const errors = validateTeacherData(teacherData);

    if (errors.length > 0) {
      errors.forEach((err) => toast.error(err));
      return; // ❌ Stop if validation fails
    }

    try {
      if (!teacherData.password.trim() || teacherData.newpassword !== teacherData.password) {
        toast.error('Invalid or Empty password !')
        return
      }
      // console.log(teacherImg, teacherResume, teacherJoinLetter)

      const formData = new FormData()
      if (teacherImg && teacherResume && teacherJoinLetter) {
        formData.append('img_src', teacherImgpath)
        formData.append('resume_src', teacherResumepath)
        formData.append('letter_src', teacherJoinLetterpath)
      } else {
        toast.error('All files are required !')
        return
      }

      Object.entries(teacherData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value))
        } else {
          formData.append(key, value as string)
        }
      })

      Object.entries(formData).forEach(([key, value]) => {
        console.log(key, value)
      })

      const res = await addTeacher(formData)

      console.log(res)
      if (res.data.success) {
        toast.success(res.data.message)
        if (res.data.success) {
          toast.success(res.data.message);

          // Teacher data reset
          setTeacherData({
            first_name: "",
            last_name: "",
            primarycont: "",
            email: "",
            newpassword: "",
            password: "",
            status: "",
            teacher_id: "",
            fromclass: "",
            toclass: "",
            class: "",
            subject: "",
            gender: "",
            blood_gp: "",
            date_of_join: "",
            fat_name: "",
            mot_name: "",
            dob: "",
            mari_status: "",
            lan_known: [],
            qualification: "",
            work_exp: "",
            prev_school: "",
            prev_school_addr: "",
            prev_school_num: "",
            address: "",
            perm_address: "",
            pan_or_id: "",
            other_info: "",
            epf_no: "",
            basic_salary: "",
            contract_type: "",
            work_sift: "",
            work_location: "",
            date_of_leave: "",
            medical_leaves: "",
            casual_leaves: "",
            maternity_leaves: "",
            sick_leaves: "",
            account_name: "",
            account_num: "",
            bank_name: "",
            ifsc_code: "",
            branch_name: "",
            route: "",
            vehicle_num: "",
            pickup_point: "",
            hostel: "",
            room_num: "",
            facebook_link: "",
            instagram_link: "",
            linked_link: "",
            twitter_link: "",
          });

          // File states reset
          setTeacherImg(null);
          setTeacherResume(null);
          setTeacherJoinLetter(null);

          setTeacherImgpath("");
          setTeacherResumepath("");
          setTeacherJoinLetterpath("");

          setTeacherImgid(null);
          setTeacherResumeid(null);
          setTeacherJoinLetterid(null);
        }


      }

    } catch (error: any) {
      console.log(error)
      toast.error(error.respnse.data.message)
    }
  }


  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content content-two">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="mb-1">{isEdit ? "Edit" : "Add"} Teacher</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to={routes.teacherList}>Teacher</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    {isEdit ? "Edit" : "Add"} Teacher
                  </li>
                </ol>
              </nav>
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            <div className="col-md-12">
              <form onSubmit={handleSubmit}>
                <>
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
                      <div className="row">
                        <div className="col-md-12">
                          <div className="d-flex align-items-center flex-wrap row-gap-3 mb-3">
                            {
                              !teacherImg ? <><div className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0 text-dark frames">
                                <i className="ti ti-photo-plus fs-16" />
                              </div></> : <p className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0  frames"><img className="" src={URL.createObjectURL(teacherImg)} alt="" /></p>
                            }
                            <div className="profile-upload">
                              <div className="profile-uploader d-flex align-items-center">
                                <div className="drag-upload-btn mb-3">
                                  Upload
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="form-control image-sign"
                                    onChange={(e) => handleFileChange(e, setTeacherImg, 'teacherImgpath')}

                                  />
                                </div>
                                {teacherImgid && (<div onClick={() => deleteFile(teacherImgid)} className="btn btn-outline-danger mb-3 ">
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
                            <label className="form-label">Teacher ID</label>
                            <input
                              type="text"
                              name="teacher_id"
                              className="form-control"
                              value={teacherData.teacher_id}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>

                        <div className="col-xxl col-xl-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">First Name</label>
                            <input
                              type="text"
                              name="first_name"
                              className="form-control"
                              value={teacherData.first_name}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>

                        <div className="col-xxl col-xl-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Last Name</label>
                            <input
                              type="text"
                              name="last_name"
                              className="form-control"
                              value={teacherData.last_name}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="col-xxl col-xl-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">From Class</label>
                            <CommonSelect
                              className="select"
                              options={allClass}
                              defaultValue={isEdit ? allClass[0].value : undefined}
                              onChange={(option) => handleSelectChange("fromclass", option ? option.value : "")}
                            />
                          </div>
                        </div>
                        <div className="col-xxl col-xl-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">To Class</label>
                            <CommonSelect
                              className="select"
                              options={allClass}
                              defaultValue={isEdit ? allClass[0].value : undefined}
                              onChange={(option) => handleSelectChange("toclass", option ? option.value : "")}
                            />
                          </div>
                        </div>

                        <div className="col-xxl col-xl-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Class</label>
                            <CommonSelect
                              className="select"
                              options={allClass}
                              defaultValue={isEdit ? allClass[0].value : undefined}
                              onChange={(option) => handleSelectChange("class", option ? option.value : "")}
                            />
                          </div>
                        </div>

                        <div className="col-xxl col-xl-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Subject</label>
                            <CommonSelect
                              className="select"
                              options={allSubject}
                              defaultValue={isEdit ? allSubject[0].value : undefined}
                              onChange={(option) => handleSelectChange("subject", option ? option.value : "")}
                            />
                          </div>
                        </div>

                        <div className="col-xxl col-xl-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Gender</label>
                            <CommonSelect
                              className="select"
                              options={gender}
                              defaultValue={isEdit ? gender[0].value : undefined}
                              onChange={(option) => handleSelectChange("gender", option ? option.value : "")}
                            />
                          </div>
                        </div>

                        <div className="col-xxl col-xl-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Primary Contact Number</label>
                            <input
                              type="text"
                              name="primarycont"
                              className="form-control"
                              value={teacherData.primarycont}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>

                        <div className="col-xxl col-xl-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Email Address</label>
                            <input
                              type="email"
                              name="email"
                              className="form-control"
                              value={teacherData.email}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>

                        <div className="col-xxl col-xl-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Blood Group</label>
                            <CommonSelect
                              className="select"
                              options={bloodGroup}
                              defaultValue={isEdit ? bloodGroup[0].value : undefined}
                              onChange={(option) => handleSelectChange("blood_gp", option ? option.value : "")}
                            />
                          </div>
                        </div>

                        <div className="col-xxl col-xl-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Date of Joining</label>
                            <div className="input-icon position-relative">
                              <DatePicker
                                className="form-control datetimepicker"
                                format="DD MMM YYYY"
                                value={
                                  teacherData.date_of_join
                                    ? dayjs(teacherData.date_of_join, 'DD MMM YYYY')
                                    : null
                                }
                                placeholder="Select Date"

                                onChange={(date, dateString) =>
                                  handleDateChange("date_of_join", date, Array.isArray(dateString) ? dateString[0] : dateString)
                                }

                              />
                              <span className="input-icon-addon">
                                <i className="ti ti-calendar" />
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="col-xxl col-xl-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Father’s Name</label>
                            <input
                              type="text"
                              name="fat_name"
                              className="form-control"
                              value={teacherData.fat_name}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>

                        <div className="col-xxl col-xl-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Mother’s Name</label>
                            <input
                              type="text"
                              name="mot_name"
                              className="form-control"
                              value={teacherData.mot_name}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>

                        <div className="col-xxl col-xl-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Date of Birth</label>
                            <div className="input-icon position-relative">
                              <DatePicker
                                className="form-control datetimepicker"
                                format="DD MMM YYYY"
                                value={
                                  teacherData.dob
                                    ? dayjs(teacherData.dob, 'DD MMM YYYY')
                                    : null
                                }
                                placeholder="Select Date"

                                onChange={(date, dateString) =>
                                  handleDateChange("dob", date, Array.isArray(dateString) ? dateString[0] : dateString)
                                }

                              />
                              <span className="input-icon-addon">
                                <i className="ti ti-calendar" />
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="col-xxl col-xl-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Marital Status</label>
                            <CommonSelect
                              className="select"
                              options={Marital}
                              defaultValue={isEdit ? Marital[0].value : undefined}
                              onChange={(option) => handleSelectChange("mari_status", option ? option.value : "")}
                            />
                          </div>
                        </div>

                        <div className="col-xxl col-xl-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Language Known</label>
                            <TagInput
                              initialTags={teacherData.lan_known}
                              onTagsChange={(tags) => handleTagsChange('lan_known', tags)} />
                          </div>
                        </div>

                        <div className="col-xxl col-xl-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Qualification</label>
                            <input
                              type="text"
                              name="qualification"
                              className="form-control"
                              value={teacherData.qualification}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>

                        <div className="col-xxl col-xl-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Work Experience</label>
                            <input
                              type="text"
                              name="work_exp"
                              className="form-control"
                              value={teacherData.work_exp}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>

                        <div className="col-xxl col-xl-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Previous School if Any</label>
                            <input
                              type="text"
                              name="prev_school"
                              className="form-control"
                              value={teacherData.prev_school}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>

                        <div className="col-xxl col-xl-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Previous School Address</label>
                            <input
                              type="text"
                              name="prev_school_addr"
                              className="form-control"
                              value={teacherData.prev_school_addr}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>

                        <div className="col-xxl col-xl-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Previous School Phone No</label>
                            <input
                              type="text"
                              name="prev_school_num"
                              className="form-control"
                              value={teacherData.prev_school_num}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>

                        <div className="col-xxl-3 col-xl-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Address</label>
                            <input
                              type="text"
                              name="address"
                              className="form-control"
                              value={teacherData.address}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>

                        <div className="col-xxl-3 col-xl-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Permanent Address</label>
                            <input
                              type="text"
                              name="perm_address"
                              className="form-control"
                              value={teacherData.perm_address}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>

                        <div className="col-xxl-3 col-xl-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">PAN Number / ID Number</label>
                            <input
                              type="text"
                              name="pan_or_id"
                              className="form-control"
                              value={teacherData.pan_or_id}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>

                        <div className="col-xxl-3 col-xl-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Status</label>
                            <CommonSelect
                              className="select"
                              options={status}
                              defaultValue={isEdit ? status[0].value : undefined}
                              onChange={(option) => handleSelectChange("status", option ? option.value : "")}
                            />
                          </div>
                        </div>

                        <div className="col-xxl-12 col-xl-12">
                          <div className="mb-3">
                            <label className="form-label">Notes</label>
                            <textarea
                              name="other_info"
                              className="form-control"
                              placeholder="Other Information"
                              rows={4}
                              value={teacherData.other_info}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                  {/* /Personal Information */}
                </>

                <>
                  {/* Payroll */}
                  <div className="card">
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
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">EPF No</label>
                            <input
                              type="text"
                              className="form-control"
                              name="epf_no"
                              value={isEdit ? "34234345" : teacherData.epf_no}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Basic Salary</label>
                            <input
                              type="text"
                              className="form-control"
                              name="basic_salary"
                              value={isEdit ? "150000" : teacherData.basic_salary}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Contract Type</label>
                            <CommonSelect
                              className="select"
                              options={Contract}
                              defaultValue={isEdit ? Contract[0].value : undefined}
                              onChange={(option) => handleSelectChange("contract_type", option ? option.value : "")}
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Work Shift</label>
                            <CommonSelect
                              className="select"
                              options={Shift}
                              defaultValue={isEdit ? Shift[0].value : undefined}
                              onChange={(option) => handleSelectChange("work_sift", option ? option.value : "")}
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Work Location</label>
                            <input
                              type="text"
                              className="form-control"
                              name="work_location"
                              value={isEdit ? "2nd Floor" : teacherData.work_location}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              Date of Leaving
                            </label>
                            <div className="input-icon position-relative">
                              <DatePicker
                                className="form-control datetimepicker"
                                format="DD MMM YYYY"
                                value={
                                  teacherData.date_of_leave
                                    ? dayjs(teacherData.date_of_leave, 'DD MMM YYYY')
                                    : null
                                }
                                placeholder="Select Date"

                                onChange={(date, dateString) =>
                                  handleDateChange("date_of_leave", date, Array.isArray(dateString) ? dateString[0] : dateString)
                                }

                              />
                              <span className="input-icon-addon">
                                <i className="ti ti-calendar" />
                              </span>
                            </div>
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
                            <input
                              type="text"
                              className="form-control"
                              name="medical_leaves"
                              value={isEdit ? "01" : teacherData.medical_leaves}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Casual Leaves</label>
                            <input
                              type="text"
                              className="form-control"
                              name="casual_leaves"
                              value={isEdit ? "02" : teacherData.casual_leaves}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              Maternity Leaves
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="maternity_leaves"
                              value={isEdit ? "20" : teacherData.maternity_leaves}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Sick Leaves</label>
                            <input
                              type="text"
                              className="form-control"
                              name="sick_leaves"
                              defaultValue={isEdit ? "02" : teacherData.sick_leaves}
                              onChange={handleInputChange}
                            />
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
                          <i className="ti ti-map fs-16" />
                        </span>
                        <h4 className="text-dark">Bank Account Detail</h4>
                      </div>
                    </div>
                    <div className="card-body pb-1">
                      <div className="row">
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Account Name</label>
                            <input
                              type="text"
                              className="form-control"
                              name="account_name"
                              value={isEdit ? "Teresa" : teacherData.account_name}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Account Number</label>
                            <input
                              type="text"
                              name="account_num"
                              className="form-control"
                              value={isEdit ? "0126784900" : teacherData.account_num}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Bank Name</label>
                            <input
                              type="text"
                              name="bank_name"
                              onChange={handleInputChange}
                              className="form-control"
                              value={
                                isEdit ? "Bank of America" : teacherData.bank_name
                              }
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">IFSC Code</label>
                            <input
                              onChange={handleInputChange}
                              type="text"
                              name="ifsc_code"
                              className="form-control"
                              value={isEdit ? "BOA83209832" : teacherData.ifsc_code}
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Branch Name</label>
                            <input
                              onChange={handleInputChange}
                              type="text"
                              className="form-control"
                              name="branch_name"
                              value={isEdit ? "Cincinnati" : teacherData.branch_name}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Bank Details */}
                </>

                {/* Transport Information */}
                <div className="card">
                  <div className="card-header bg-light d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                        <i className="ti ti-bus-stop fs-16" />
                      </span>
                      <h4 className="text-dark">Transport Information</h4>
                    </div>

                  </div>
                  {/* <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                    />
                  </div> */}
                  <div className="card-body pb-1">
                    <div className="row">
                      <div className="col-lg-4 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Route</label>
                          <CommonSelect
                            className="select"
                            options={route}
                            defaultValue={isEdit ? route[0].value : undefined}
                            onChange={(option) => handleSelectChange("route", option ? option.value : "")}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Vehicle Number</label>
                          <CommonSelect
                            className="select"
                            options={VehicleNumber}
                            defaultValue={isEdit ? VehicleNumber[0].value : undefined}
                            onChange={(option) => handleSelectChange("vehicle_num", option ? option.value : "")}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Pickup Point</label>
                          <CommonSelect
                            className="select"
                            options={PickupPoint}
                            defaultValue={isEdit ? PickupPoint[0].value : undefined}
                            onChange={(option) => handleSelectChange("pickup_point", option ? option.value : "")}
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
                    {/* <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                      />
                    </div> */}
                  </div>
                  <div className="card-body pb-1">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Hostel</label>
                          <CommonSelect
                            className="select"
                            options={Hostel}
                            defaultValue={isEdit ? Hostel[0].value : undefined}
                            onChange={(option) => handleSelectChange("hostel", option ? option.value : "")}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Room No</label>
                          <CommonSelect
                            className="select"
                            options={roomNO}
                            defaultValue={isEdit ? roomNO[0].value : undefined}
                            onChange={(option) => handleSelectChange("room_num", option ? option.value : "")}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Hostel Information */}
                <>
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
                      <div className="row rows-cols-xxl-5">
                        <div className="col-xxl col-xl-3 col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Facebook</label>
                            <input
                              type="text"
                              className="form-control"
                              name="facebook_link"
                              value={
                                isEdit ? "www.facebook.com" : teacherData.facebook_link
                              }
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="col-xxl col-xl-3 col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Instagram</label>
                            <input
                              type="text"
                              className="form-control"
                              name="instagram_link"
                              value={
                                isEdit ? "www.instagram.com" : teacherData.instagram_link
                              }
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="col-xxl col-xl-3 col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Linked In</label>
                            <input
                              type="text"
                              className="form-control"
                              name="linked_link"
                              value={
                                isEdit ? "www.Linkedin.com" : teacherData.linked_link
                              }
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="col-xxl col-xl-3 col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Twitter URL</label>
                            <input
                              type="text"
                              className="form-control"
                              name="twitter_link"
                              value={
                                isEdit ? "www.twitter.com" : teacherData.twitter_link
                              }
                              onChange={handleInputChange}
                            />
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
                              </label>
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
                                  onChange={(e) => handleFileChange(e, setTeacherResume, 'teacherResumepath')}
                                />
                              </div>
                              {teacherResumeid && (<div onClick={() => deleteFile(teacherResumeid)} className="btn btn-sm btn-outline-danger mb-2 ">
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
                              </label>
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
                                  onChange={(e) => handleFileChange(e, setTeacherJoinLetter, 'teacherJoinLetterpath')}
                                />
                              </div>
                              {teacherJoinLetterid && (<div onClick={() => deleteFile(teacherJoinLetterid)} className="btn btn-sm btn-outline-danger mb-2 ">
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
                            <input type="password" className="form-control" name="newpassword" onChange={handleInputChange} />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              Confirm Password
                            </label>
                            <input type="password" className="form-control" name="password" onChange={handleInputChange} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Password */}
                </>

                <div className="text-end">
                  <button type="button" className="btn btn-light me-3">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add Teacher
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
    </>
  );
};

export default TeacherForm;
