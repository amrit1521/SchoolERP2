import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { feeGroup, feesTypes, paymentType } from '../../../core/common/selectoption/selectoption'
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { all_routes } from "../../../router/all_routes";
import {
  // AdmissionNo,
  Hostel,
  PickupPoint,
  VehicleNumber,
  academicYear,
  allClass,
  allSection,
  bloodGroup,
  cast,
  gender,
  house,
  mothertongue,
  // names,
  religion,
  // rollno,
  roomNO,
  route,
  status,
} from "../../../../core/common/selectoption/selectoption";

import CommonSelect from "../../../../core/common/commonSelect";
import { useLocation } from "react-router-dom";
import TagInput from "../../../../core/common/Taginput";
import { addStundent, deleteFile, uploadStudentFile } from '../../../../service/api'
import { toast } from 'react-toastify'


export interface StudentData {
  academicyear: string;
  admissionnum: string;
  admissiondate: string;
  rollnum: string;
  status: string;
  firstname: string;
  lastname: string;
  class: string;
  section: string;
  gender: string;
  dob: string;
  bloodgp: string;
  house: string;
  religion: string;
  category: string;
  primarycont: string;
  email: string;
  caste: string;
  motherton: string;
  lanknown: string[];
  fat_name: string;
  fat_email: string;
  fat_phone: string;
  fat_occu: string;
  mot_name: string;
  mot_email: string;
  mot_phone: string;
  guardianIs: string;
  mot_occu: string;
  gua_name: string;
  gua_relation: string;
  gua_phone: string;
  gua_email: string;
  gua_occu: string;
  gua_address: string;
  curr_address: string;
  perm_address: string;
  prev_school: string;
  prev_school_address: string;
  hostel: string;
  room_num: string;
  route: string;
  vehicle_num: string;
  picup_point: string;
  bank_name: string;
  branch: string;
  ifsc_num: string;
  other_det: string;
  condition: string;
  allergies: string[];
  medications: string[];
}

const fieldLabels: Record<keyof StudentData, string> = {
  academicyear: "Academic Year",
  admissionnum: "Admission Number",
  admissiondate: "Admission Date",
  rollnum: "Roll Number",
  status: "Status",
  firstname: "First Name",
  lastname: "Last Name",
  class: "Class",
  section: "Section",
  gender: "Gender",
  dob: "Date of Birth",
  bloodgp: "Blood Group",
  house: "House",
  religion: "Religion",
  category: "Category",
  primarycont: "Primary Contact",
  email: "Student Email",
  caste: "Caste",
  motherton: "Mother Tongue",
  lanknown: "Languages Known",
  fat_name: "Father Name",
  fat_email: "Father Email",
  fat_phone: "Father Phone",
  fat_occu: "Father Occupation",
  mot_name: "Mother Name",
  mot_email: "Mother Email",
  mot_phone: "Mother Phone",
  mot_occu: "Mother Occupation",
  guardianIs: "Guardian Type",
  gua_name: "Guardian Name",
  gua_relation: "Guardian Relation",
  gua_phone: "Guardian Phone",
  gua_email: "Guardian Email",
  gua_occu: "Guardian Occupation",
  gua_address: "Guardian Address",
  curr_address: "Current Address",
  perm_address: "Permanent Address",
  prev_school: "Previous School",
  prev_school_address: "Previous School Address",
  hostel: "Hostel",
  room_num: "Room Number",
  route: "Route",
  vehicle_num: "Vehicle Number",
  picup_point: "Pickup Point",
  bank_name: "Bank Name",
  branch: "Branch",
  ifsc_num: "IFSC Number",
  other_det: "Other Details",
  condition: "Medical Condition",
  allergies: "Allergies",
  medications: "Medications",
};

const AddStudent = () => {
  const routes = all_routes;
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate()

  useEffect(() => {
    if (location.pathname === routes.editStudent) {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      const formattedDate = `${month}-${day}-${year}`;
      // const defaultValue = dayjs(formattedDate);
      setIsEdit(true);
      // setOwner(["English"]);
      // setOwner1(["Medecine Name"]);
      // setOwner2(["Allergy", "Skin Allergy"]);
      // setDefaultDate(defaultValue);
      console.log(formattedDate, 11);
    } else {
      setIsEdit(false);
      // setDefaultDate(null);
    }
  }, [location.pathname]);




  const [studentData, setStudentData] = useState<StudentData>({
    academicyear: '',
    admissionnum: '',
    admissiondate: '',
    rollnum: '',
    status: '',
    firstname: '',
    lastname: '',
    class: '',
    section: '',
    gender: '',
    dob: '',
    bloodgp: '',
    house: '',
    religion: '',
    category: '',
    primarycont: '',
    email: '',
    caste: '',
    motherton: '',
    lanknown: [],
    fat_name: '',
    fat_email: '',
    fat_phone: '',
    fat_occu: '',
    mot_name: '',
    mot_email: '',
    mot_phone: '',
    mot_occu: '',
    guardianIs: 'parents',
    gua_name: '',
    gua_relation: '',
    gua_phone: '',
    gua_email: '',
    gua_occu: '',
    gua_address: '',
    curr_address: '',
    perm_address: '',
    prev_school: '',
    prev_school_address: '',
    hostel: '',
    room_num: '',
    route: '',
    vehicle_num: '',
    picup_point: '',
    bank_name: '',
    branch: '',
    ifsc_num: '',
    other_det: '',
    condition: 'good',
    allergies: [],
    medications: []
  })


  const [stuImg, setStuImg] = useState<File | null>(null);
  const [fatImg, setFatImg] = useState<File | null>(null);
  const [motImg, setMotImg] = useState<File | null>(null);
  const [guaImg, setGuaImg] = useState<File | null>(null);
  const [medicalCerti, setMedicalCerti] = useState<File | null>(null);
  const [transferCerti, setTransferCerti] = useState<File | null>(null);


  const [stuimgpath, setStuimgpath] = useState<string>("");
  const [fatimgpath, setFatimgpath] = useState<string>("");
  const [motimgpath, setMotimgpath] = useState<string>("");
  const [guaimgpath, setGuaimgpath] = useState<string>("");
  const [medcertpath, setMedcertpath] = useState<string>("");
  const [transcertpath, setTranscertpath] = useState<string>("");


  const [stuimgid, setStuimgid] = useState<Number | null>(null)
  const [fatimgid, setFatimgid] = useState<Number | null>(null)
  const [motimgid, setMotimgid] = useState<Number | null>(null)
  const [guaimgid, setGuaimgid] = useState<Number | null>(null)
  const [medcertid, setMedcertid] = useState<Number | null>(null)
  const [transcertid, setTranscertid] = useState<Number | null>(null)





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
      formData.append("stufile", file);

      try {

        const res = await uploadStudentFile(formData)
        const uploadedPath = res.data.file; // filename from backend
        const id = res.data.insertId;

        if (fieldName === "stuimgpath") {
          setStuimgpath(uploadedPath);
          setStuimgid(id)

        } else if (fieldName === "fatimgpath") {
          setFatimgpath(uploadedPath);
          setFatimgid(id)

        } else if (fieldName === "motimgpath") {
          setMotimgpath(uploadedPath);
          setMotimgid(id)
        } else if (fieldName === "guaimgpath") {
          setGuaimgpath(uploadedPath);
          setGuaimgid(id)
        } else if (fieldName === "medcertpath") {
          setMedcertpath(uploadedPath);
          setMedcertid(id)
        } else if (fieldName === "transcertpath") {
          setTranscertpath(uploadedPath);
          setTranscertid(id)
        }

      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
  };



  const deleteImage = async (id: Number) => {
    if (!id) return;

    try {
      const deletefile = await deleteFile(id)

      if (deletefile.data.success) {
        // Student image
        if (id === stuimgid) {
          setStuimgid(null);
          setStuImg(null);
          setStuimgpath("");
        }

        // Father image
        else if (id === fatimgid) {
          setFatimgid(null);
          setFatImg(null);
          setFatimgpath("");
        }

        // Mother image
        else if (id === motimgid) {
          setMotimgid(null);
          setMotImg(null);
          setMotimgpath("");
        }

        // Guardian image
        else if (id === guaimgid) {
          setGuaimgid(null);
          setGuaImg(null);
          setGuaimgpath("");
        }

        // Medical certificate
        else if (id === medcertid) {
          setMedcertid(null);
          setMedicalCerti(null);
          setMedcertpath("");
        }

        // Transfer certificate
        else if (id === transcertid) {
          setTranscertid(null);
          setTransferCerti(null);
          setTranscertpath("");
        }

      }
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setStudentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleDateChange = (
    name: keyof StudentData,
    // date: dayjs.Dayjs | null,
    dateString: string
  ) => {
    setStudentData((prev) => ({ ...prev, [name]: dayjs(dateString).format('DD MMM YYYY') }));
  };


  const handleSelectChange = (name: keyof StudentData, value: string | number) => {
    setStudentData((prev) => ({ ...prev, [name]: value }));
  };


  const handleTagsChange = (field: keyof typeof studentData, tags: string[]) => {
    setStudentData((prev) => ({
      ...prev,
      [field]: tags
    }));
  };
  const [errors, setErrors] = useState<Partial<Record<keyof StudentData, string>>>({});


  const validateStudentForm = (data: StudentData) => {
    const newErrors: Partial<Record<keyof StudentData, string>> = {};


    const requiredFields: (keyof StudentData)[] = [
      "academicyear", "admissionnum", "admissiondate", "rollnum", "status",
      "firstname", "lastname", "class", "section",
      "gender", "dob", "religion", "category", "primarycont", "email", "caste", "motherton", "fat_name", "fat_email", "fat_phone", "mot_name", "mot_email", "mot_phone", "curr_address", "perm_address"
    ];

    requiredFields.forEach((field) => {
      if (!data[field] || data[field].toString().trim() === "") {
        newErrors[field] = `${fieldLabels[field]} is required`;
      }
    });


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.email && !emailRegex.test(data.email)) {
      newErrors.email = "Invalid student email";
    }
    if (data.fat_email && !emailRegex.test(data.fat_email)) {
      newErrors.fat_email = "Invalid father email";
    }
    if (data.mot_email && !emailRegex.test(data.mot_email)) {
      newErrors.mot_email = "Invalid mother email";
    }


    const phoneRegex = /^\d{10}$/;


    if (!data.primarycont) {
      newErrors.primarycont = 'Contact number is required !'
    } else if (!phoneRegex.test(data.primarycont)) {
      newErrors.primarycont = "Invalid student contact number !"
    }
    // if (data.primarycont && !phoneRegex.test(data.primarycont)) {
    //   newErrors.primarycont = "Invalid student contact number";
    // }
    if (data.fat_phone && !phoneRegex.test(data.fat_phone)) {
      newErrors.fat_phone = "Invalid father phone number";
    }
    if (data.mot_phone && !phoneRegex.test(data.mot_phone)) {
      newErrors.mot_phone = "Invalid mother phone number";
    }


    if (!stuimgpath) {
      toast.error("Student image is required");
    }
    if (!fatimgpath) {
      toast.error("Father image is required");
    }
    if (!motimgpath) {
      toast.error("Mother image is required");
    }

    setErrors(newErrors);

    Object.entries(newErrors).forEach(([_, errorMsg]) => {
      toast.error(`${errorMsg}`);

    });


    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateStudentForm(studentData)) {
      return
    }
    try {
      const formData = new FormData();
      Object.entries(studentData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value as string);
        }
      });

      if (stuImg && fatImg && motImg) {
        formData.append("stuimg", stuimgpath);
        formData.append("fatimg", fatimgpath);
        formData.append("motimg", motimgpath);

      } else {
        toast.error("Required all Images !");
        return;
      }

      if (guaImg) {
        formData.append("guaimg", guaimgpath);
      }
      if (medicalCerti) {
        formData.append('medicalcert', medcertpath)
      }

      if (transferCerti) {
        formData.append('transfercert', transcertpath)
      }
      // for (const [key, value] of formData.entries()) {
      //   console.log(key, value);
      // }

      // Send request
      const res = await addStundent(formData);

      if (res.data.success) {
        toast.success(res.data.message);

        // Reset form
        setStudentData({
          academicyear: '',
          admissionnum: '',
          admissiondate: '',
          rollnum: '',
          status: '',
          firstname: '',
          lastname: '',
          class: '',
          section: '',
          gender: '',
          dob: '',
          bloodgp: '',
          house: '',
          religion: '',
          category: '',
          primarycont: '',
          email: '',
          caste: '',
          motherton: '',
          lanknown: [],
          fat_name: '',
          fat_email: '',
          fat_phone: '',
          fat_occu: '',
          mot_name: '',
          mot_email: '',
          mot_phone: '',
          mot_occu: '',
          guardianIs: 'parents',
          gua_name: '',
          gua_relation: '',
          gua_phone: '',
          gua_email: '',
          gua_occu: '',
          gua_address: '',
          curr_address: '',
          perm_address: '',
          prev_school: '',
          prev_school_address: '',
          hostel: '',
          room_num: '',
          route: '',
          vehicle_num: '',
          picup_point: '',
          bank_name: '',
          branch: '',
          ifsc_num: '',
          other_det: '',
          condition: 'good',
          allergies: [],
          medications: []
        });
        setStuImg(null)
        setFatImg(null)
        setMotImg(null)
        setGuaImg(null)
        setMedicalCerti(null)
        setTransferCerti(null)
        setStuimgpath("")
        setFatimgpath("")
        setMotimgpath("")
        setGuaimgpath("")
        setMedcertpath("")
        setTranscertpath("")
        setStuimgid(null)
        setFatimgid(null)
        setMotimgid(null)
        setGuaimgid(null)
        setMedcertid(null)
        setTranscertid(null)
        navigate(-1)
      }

    } catch (error: any) {
      console.log(error.response);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const cancelAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setStudentData({
      academicyear: '',
      admissionnum: '',
      admissiondate: '',
      rollnum: '',
      status: '',
      firstname: '',
      lastname: '',
      class: '',
      section: '',
      gender: '',
      dob: '',
      bloodgp: '',
      house: '',
      religion: '',
      category: '',
      primarycont: '',
      email: '',
      caste: '',
      motherton: '',
      lanknown: [],
      fat_name: '',
      fat_email: '',
      fat_phone: '',
      fat_occu: '',
      mot_name: '',
      mot_email: '',
      mot_phone: '',
      mot_occu: '',
      guardianIs: 'parents',
      gua_name: '',
      gua_relation: '',
      gua_phone: '',
      gua_email: '',
      gua_occu: '',
      gua_address: '',
      curr_address: '',
      perm_address: '',
      prev_school: '',
      prev_school_address: '',
      hostel: '',
      room_num: '',
      route: '',
      vehicle_num: '',
      picup_point: '',
      bank_name: '',
      branch: '',
      ifsc_num: '',
      other_det: '',
      condition: 'good',
      allergies: [],
      medications: []
    });
    setStuImg(null)
    setFatImg(null)
    setMotImg(null)
    setGuaImg(null)
    setMedicalCerti(null)
    setTransferCerti(null)
    setStuimgpath("")
    setFatimgpath("")
    setMotimgpath("")
    setGuaimgpath("")
    setMedcertpath("")
    setTranscertpath("")
    setStuimgid(null)
    setFatimgid(null)
    setMotimgid(null)
    setGuaimgid(null)
    setMedcertid(null)
    setTranscertid(null)
    navigate(-1)
  }





  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content content-two">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="mb-1">{isEdit ? "Edit" : "Add"} Student</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to={routes.studentList}>Students</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    {isEdit ? "Edit" : "Add"} Student
                  </li>
                </ol>
              </nav>
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            <div className="col-md-12">
              <form onSubmit={handleSubmit}>
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
                            !stuImg ? <><div className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0 text-dark frames">
                              <i className="ti ti-photo-plus fs-16" />
                            </div></> : <p className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0  frames"><img className="" src={URL.createObjectURL(stuImg)} alt="" /></p>
                          }
                          <div className="profile-upload">
                            <div className="profile-uploader d-flex align-items-center">
                              <div className="drag-upload-btn mb-3">
                                Upload
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleFileChange(e, setStuImg, 'stuimgpath')}
                                  className="form-control image-sign"
                                />
                              </div><span className="text-danger"> *</span>
                              {stuimgid && (<div onClick={() => deleteImage(stuimgid)} className="btn btn-outline-danger mb-3 ">
                                Remove
                              </div>)}
                            </div>
                            <p className="fs-12">
                              Upload image size 4MB, Format JPG, PNG,
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row row-cols-xxl-5 row-cols-md-6">
                      {/* Academic Year */}
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Academic Year</label><span className="text-danger"> *</span>
                          <CommonSelect
                            className={`select`}
                            options={academicYear}
                            value={studentData.academicyear}
                            onChange={(option) => handleSelectChange("academicyear", option ? option.value : "")}
                          />
                          {errors.academicyear && (
                            <div style={{ fontSize: '11px' }} className="text-danger">{errors.academicyear}</div>
                          )}

                        </div>
                      </div>

                      {/* Admission Number */}
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Admission Number</label><span className="text-danger"> *</span>
                          <input
                            type="text"
                            name="admissionnum"
                            className={`form-control`}

                            value={isEdit ? "AD9892434" : studentData.admissionnum}

                            onChange={handleInputChange}
                          />
                          {errors.admissionnum && (
                            <div style={{ fontSize: '11px' }} className="text-danger">{errors.admissionnum}</div>
                          )}
                        </div>
                      </div>

                      {/* Admission Date */}
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Admission Date</label><span className="text-danger"> *</span>
                          <div className="input-icon position-relative">
                            <DatePicker

                              className={`form-control datetimepicker `}
                              format="DD MMM YYYY"
                              value={
                                studentData.admissiondate
                                  ? dayjs(studentData.admissiondate, 'DD MMM YYYY')
                                  : null
                              }
                              placeholder="Select Date"

                              onChange={(dateString) =>
                                handleDateChange("admissiondate", Array.isArray(dateString) ? dateString[0] : dateString)
                              }

                            />
                            {errors.admissiondate && (
                              <div style={{ fontSize: '11px' }} className="text-danger">{errors.admissiondate}</div>
                            )}
                            {!errors.admissiondate && (<span className="input-icon-addon">
                              <i className="ti ti-calendar" />
                            </span>)}
                          </div>
                        </div>
                      </div>

                      {/* Roll Number */}
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Roll Number</label><span className="text-danger"> *</span>
                          <input
                            type="text"
                            name="rollnum"
                            className={`form-control `}
                            value={studentData.rollnum}
                            onChange={handleInputChange}
                          />
                          {errors.rollnum && (
                            <div style={{ fontSize: '11px' }} className="text-danger">{errors.rollnum}</div>
                          )}
                        </div>
                      </div>

                      {/* Status */}
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Status</label><span className="text-danger"> *</span>
                          <CommonSelect
                            className={`select `}
                            options={status}
                            value={studentData.status}
                            onChange={(option) => handleSelectChange("status", option ? option.value : '')}
                          />
                          {errors.status && (
                            <div style={{ fontSize: '11px' }} className="text-danger">{errors.status}</div>
                          )}
                        </div>
                      </div>

                      {/* First Name */}
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">First Name</label><span className="text-danger"> *</span>
                          <input

                            type="text"
                            name="firstname"
                            className={`form-control `}
                            value={studentData.firstname}
                            onChange={handleInputChange}
                          />
                          {errors.firstname && (
                            <div style={{ fontSize: '11px' }} className="text-danger">{errors.firstname}</div>
                          )}
                        </div>
                      </div>

                      {/* Last Name */}
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Last Name</label><span className="text-danger"> *</span>
                          <input

                            type="text"
                            name="lastname"
                            className={`form-control `}
                            value={studentData.lastname}
                            onChange={handleInputChange}
                          />
                          {errors.lastname && (
                            <div style={{ fontSize: '11px' }} className="text-danger">{errors.lastname}</div>
                          )}
                        </div>
                      </div>

                      {/* Class */}
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Class</label><span className="text-danger"> *</span>
                          <CommonSelect
                            className={`select `}
                            options={allClass}
                            value={studentData.class}
                            onChange={(option) => handleSelectChange("class", option ? option.value : "")}
                          />
                          {errors.class && (
                            <div style={{ fontSize: '11px' }} className="text-danger">{errors.class}</div>
                          )}
                        </div>
                      </div>

                      {/* Section */}
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Section</label><span className="text-danger"> *</span>
                          <CommonSelect
                            className={`select ${errors.section ? "is-invalid" : ""}`}
                            options={allSection}
                            value={studentData.section}
                            onChange={(option) => handleSelectChange("section", option ? option.value : "")}
                          />
                          {errors.section && (
                            <div style={{ fontSize: '11px' }} className="text-danger">{errors.section}</div>
                          )}
                        </div>
                      </div>

                      {/* Gender */}
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Gender</label><span className="text-danger"> *</span>
                          <CommonSelect
                            className={`select ${errors.section ? "is-invalid" : ""}`}
                            options={gender}
                            value={studentData.gender}
                            onChange={(option) => handleSelectChange("gender", option ? option.value : "")}
                          />
                          {errors.gender && (
                            <div style={{ fontSize: '11px' }} className="text-danger">{errors.gender}</div>
                          )}
                        </div>
                      </div>

                      {/* Date of Birth */}
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Date of Birth</label><span className="text-danger"> *</span>
                          <div className="input-icon position-relative">
                            <DatePicker

                              className={`form-control datetimepicker `}
                              format="DD MMM YYYY"
                              value={
                                studentData.dob
                                  ? dayjs(studentData.dob, 'DD MMM YYYY')
                                  : null
                              }
                              placeholder="Select Date"
                              onChange={(dateString) =>
                                handleDateChange("dob", Array.isArray(dateString) ? dateString[0] : dateString)
                              }

                            />
                            {errors.dob && (
                              <div style={{ fontSize: '11px' }} className="text-danger">{errors.dob}</div>
                            )}
                            {!errors.dob && (<span className="input-icon-addon">
                              <i className="ti ti-calendar" />
                            </span>)}
                          </div>
                        </div>
                      </div>

                      {/* Blood Group */}
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Blood Group</label>
                          <CommonSelect
                            className="select"
                            options={bloodGroup}
                            value={studentData.bloodgp}
                            onChange={(option) => handleSelectChange("bloodgp", option ? option.value : "")}
                          />
                        </div>
                      </div>

                      {/* House */}
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">House</label>
                          <CommonSelect
                            className="select"
                            options={house}
                            value={studentData.house}
                            onChange={(option) => handleSelectChange("house", option ? option.value : "")}
                          />
                        </div>
                      </div>

                      {/* Religion */}
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Religion</label><span className="text-danger"> *</span>
                          <CommonSelect
                            className={`select ${errors.religion ? "is-invalid" : ""}`}
                            options={religion}
                            value={studentData.religion}
                            onChange={(option) => handleSelectChange("religion", option ? option.value : "")}
                          />
                          {errors.religion && (
                            <div style={{ fontSize: '11px' }} className="text-danger">{errors.religion}</div>
                          )}
                        </div>
                      </div>

                      {/* Category */}
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Category</label><span className="text-danger"> *</span>
                          <CommonSelect
                            className={`select ${errors.category ? "is-invalid" : ""}`}
                            options={cast}
                            value={studentData.category}
                            onChange={(option) => handleSelectChange("category", option ? option.value : "")}
                          />
                          {errors.category && (
                            <div style={{ fontSize: '11px' }} className="text-danger">{errors.category}</div>
                          )}
                        </div>
                      </div>

                      {/* Primary Contact Number */}
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Primary Contact Number</label><span className="text-danger"> *</span>
                          <input
                            type="text"
                            name="primarycont"
                            className={`form-control `}
                            value={studentData.primarycont}
                            onChange={handleInputChange}
                          />
                          {errors.primarycont && (
                            <div style={{ fontSize: '11px' }} className="text-danger">{errors.primarycont}</div>
                          )}
                        </div>
                      </div>

                      {/* Email Address */}
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Email Address</label><span className="text-danger"> *</span>
                          <input
                            type="email"
                            name="email"
                            className={`form-control `}
                            value={studentData.email}
                            onChange={handleInputChange}
                          />
                          {errors.email && (
                            <div style={{ fontSize: '11px' }} className="text-danger">{errors.email}</div>
                          )}
                        </div>
                      </div>

                      {/* Caste */}
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Caste</label><span className="text-danger"> *</span>
                          <input
                            type="text"
                            name="caste"
                            className={`form-control `}
                            value={studentData.caste}
                            onChange={handleInputChange}
                          />
                          {errors.caste && (
                            <div style={{ fontSize: '11px' }} className="text-danger">{errors.caste}</div>
                          )}
                        </div>
                      </div>

                      {/* Mother Tongue */}
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Mother Tongue</label><span className="text-danger"> *</span>
                          <CommonSelect
                            className={`select ${errors.motherton ? "is-invalid" : ""}`}
                            options={mothertongue}
                            value={studentData.motherton}
                            onChange={(option) => handleSelectChange("motherton", option ? option.value : "")}
                          />
                          {errors.motherton && (
                            <div style={{ fontSize: '11px' }} className="text-danger">{errors.motherton}</div>
                          )}
                        </div>
                      </div>

                      {/* Language Known */}
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Language Known</label>
                          <TagInput
                            initialTags={studentData.lanknown}
                            onTagsChange={(tags) => handleTagsChange('lanknown', tags)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Personal Information */}
                {/* Parents & Guardian Information */}
                <div className="card">
                  <div className="card-header bg-light">
                    <div className="d-flex align-items-center">
                      <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                        <i className="ti ti-user-shield fs-16" />
                      </span>
                      <h4 className="text-dark">
                        Parents &amp; Guardian Information
                      </h4>
                    </div>
                  </div>
                  <div className="card-body pb-0">
                    <div className="border-bottom mb-3">
                      <h5 className="mb-3">Father’s Info</h5>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="d-flex align-items-center flex-wrap row-gap-3 mb-3">
                            {
                              !fatImg ? <><div className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0 text-dark frames">
                                <i className="ti ti-photo-plus fs-16" />
                              </div></> : <p className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0  frames"><img className="" src={URL.createObjectURL(fatImg)} alt="" /></p>
                            }
                            <div className="profile-upload">
                              <div className="profile-uploader d-flex align-items-center">
                                <div className="drag-upload-btn mb-3">
                                  Upload
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, setFatImg, 'fatimgpath')}
                                    className="form-control image-sign"
                                  />
                                </div><span className="text-danger"> *</span>
                                {fatimgid && (<div onClick={() => deleteImage(fatimgid)} className="btn btn-outline-danger mb-3">
                                  Remove
                                </div>)}
                              </div>
                              <p className="fs-12">
                                Upload image size 4MB, Format JPG, PNG,
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Father Name</label><span className="text-danger"> *</span>
                            <input
                              name="fat_name"
                              type="text"
                              className={`form-control `}
                              value={
                                isEdit ? "Jerald Vicinius" : studentData.fat_name
                              }
                              onChange={handleInputChange}
                            />
                            {errors.fat_name && (
                              <div style={{ fontSize: '11px' }} className="text-danger">{errors.fat_name}</div>
                            )}
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Email</label><span className="text-danger"> *</span>
                            <input
                              name="fat_email"
                              onChange={handleInputChange}
                              type="text"
                              className={`form-control `}
                              value={
                                isEdit ? "jera@example.com" : studentData.fat_email
                              }
                            />
                            {errors.fat_email && (
                              <div style={{ fontSize: '11px' }} className="text-danger">{errors.fat_email}</div>
                            )}
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Phone Number</label><span className="text-danger"> *</span>
                            <input
                              name="fat_phone"
                              onChange={handleInputChange}
                              type="text"
                              className={`form-control `}
                              value={
                                isEdit ? "+1 45545 46464" : studentData.fat_phone
                              }
                            />
                            {errors.fat_phone && (
                              <div style={{ fontSize: '11px' }} className="text-danger">{errors.fat_phone}</div>
                            )}
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              Father Occupation
                            </label>
                            <input
                              name="fat_occu"
                              onChange={handleInputChange}
                              type="text"
                              className="form-control"
                              value={isEdit ? "Mechanic" : studentData.fat_occu}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="border-bottom mb-3">
                      <h5 className="mb-3">Mother’s Info</h5>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="d-flex align-items-center flex-wrap row-gap-3 mb-3">
                            {
                              !motImg ? <><div className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0 text-dark frames">
                                <i className="ti ti-photo-plus fs-16" />
                              </div></> : <p className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0  frames"><img className="" src={URL.createObjectURL(motImg)} alt="" /></p>
                            }
                            <div className="profile-upload">
                              <div className="profile-uploader d-flex align-items-center">
                                <div className="drag-upload-btn mb-3">
                                  Upload
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, setMotImg, 'motimgpath')}
                                    className="form-control image-sign"
                                  />
                                </div><span className="text-danger"> *</span>
                                {motimgid && (<div onClick={() => deleteImage(motimgid)} className="btn btn-outline-danger mb-3">
                                  Remove
                                </div>)}
                              </div>
                              <p className="fs-12">
                                Upload image size 4MB, Format JPG, PNG,
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Mother Name</label><span className="text-danger"> *</span>
                            <input
                              name="mot_name"
                              onChange={handleInputChange}
                              type="text"
                              className={`form-control `}
                              value={
                                isEdit ? "Roberta Webber" : studentData.mot_name
                              }
                            />
                            {errors.mot_name && (
                              <div style={{ fontSize: '11px' }} className="text-danger">{errors.mot_name}</div>
                            )}
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Email</label><span className="text-danger"> *</span>
                            <input
                              name="mot_email"
                              onChange={handleInputChange}
                              type="text"
                              className="form-control"
                              value={
                                isEdit ? "robe@example.com" : studentData.mot_email
                              }
                            />
                            {errors.mot_email && (
                              <div style={{ fontSize: '11px' }} className="text-danger">{errors.mot_email}</div>
                            )}
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Phone Number</label><span className="text-danger"> *</span>
                            <input
                              name="mot_phone"
                              onChange={handleInputChange}
                              type="text"
                              className="form-control"
                              value={
                                isEdit ? "+1 46499 24357" : studentData.mot_phone
                              }
                            />
                            {errors.mot_phone && (
                              <div style={{ fontSize: '11px' }} className="text-danger">{errors.mot_phone}</div>
                            )}
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              Mother Occupation
                            </label>
                            <input
                              name="mot_occu"
                              onChange={handleInputChange}
                              type="text"
                              className="form-control"
                              value={isEdit ? "Homemaker" : studentData.mot_occu}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h5 className="mb-3">Guardian Details</h5>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="mb-2">
                            <div className="d-flex align-items-center flex-wrap">
                              <label className="form-label text-dark fw-normal me-2">
                                If Guardian Is
                              </label>

                              <div className="form-check me-3 mb-2">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="guardianIs"
                                  id="parents"
                                  value="parents"
                                  checked={studentData.guardianIs === "parents"}
                                  onChange={handleInputChange}
                                />
                                <label className="form-check-label" htmlFor="parents">
                                  Parents
                                </label>
                              </div>

                              <div className="form-check me-3 mb-2">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="guardianIs"
                                  id="guardian"
                                  value="guardian"
                                  checked={studentData.guardianIs === "guardian"}
                                  onChange={handleInputChange}
                                />
                                <label className="form-check-label" htmlFor="guardian">
                                  Guardian
                                </label>
                              </div>

                              <div className="form-check mb-2">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="guardianIs"
                                  id="other"
                                  value="other"
                                  checked={studentData.guardianIs === "other"}
                                  onChange={handleInputChange}
                                />
                                <label className="form-check-label" htmlFor="other">
                                  Others
                                </label>
                              </div>
                            </div>

                          </div>

                          <div className="d-flex align-items-center flex-wrap row-gap-3 mb-3">
                            {
                              !guaImg ? <><div className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0 text-dark frames">
                                <i className="ti ti-photo-plus fs-16" />
                              </div></> : <p className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0  frames"><img className="" src={URL.createObjectURL(guaImg)} alt="" /></p>
                            }
                            <div className="profile-upload">
                              <div className="profile-uploader d-flex align-items-center">
                                <div className="drag-upload-btn mb-3">
                                  Upload
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, setGuaImg, 'guaimgpath')}
                                    className="form-control image-sign"
                                  />
                                </div>
                                {guaimgid && (<div onClick={() => deleteImage(guaimgid)} className="btn btn-outline-danger mb-3">
                                  Remove
                                </div>)}
                              </div>
                              <p className="fs-12">
                                Upload image size 4MB, Format JPG, PNG,
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Guardian Name</label>
                            <input
                              name="gua_name"
                              onChange={handleInputChange}
                              type="text"
                              className="form-control"
                              value={
                                isEdit ? "Jerald Vicinius" : studentData.gua_name
                              }
                            />
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              Guardian Relation
                            </label>
                            <input
                              name="gua_relation"
                              onChange={handleInputChange}
                              type="text"
                              className="form-control"
                              value={isEdit ? "Uncle" : studentData.gua_relation}
                            />
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Phone Number</label>
                            <input
                              name="gua_phone"
                              onChange={handleInputChange}
                              type="text"
                              className="form-control"
                              value={
                                isEdit ? "+1 45545 46464" : studentData.gua_phone
                              }
                            />
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                              name="gua_email"
                              onChange={handleInputChange}
                              type="email"
                              className="form-control"
                              value={
                                isEdit ? "jera@example.com" : studentData.gua_email
                              }
                            />
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Occupation</label>
                            <input
                              name="gua_occu"
                              onChange={handleInputChange}
                              type="text"
                              className="form-control"
                              value={isEdit ? "Mechanic" : studentData.gua_occu}
                            />
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Address</label>
                            <input
                              name="gua_address"
                              onChange={handleInputChange}
                              type="text"
                              className="form-control"
                              value={
                                isEdit
                                  ? "3495 Red Hawk Road, Buffalo Lake, MN 55314"
                                  : studentData.gua_address
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Parents & Guardian Information */}
                {/* Sibilings */}
                {/* <div className="card">
                  <div className="card-header bg-light">
                    <div className="d-flex align-items-center">
                      <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                        <i className="ti ti-users fs-16" />
                      </span>
                      <h4 className="text-dark">Sibilings</h4>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="addsibling-info">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="mb-2">
                            <label className="form-label">Sibling Info</label>
                            <div className="d-flex align-items-center flex-wrap">
                              <label className="form-label text-dark fw-normal me-2">
                                Is Sibling studying in the same school
                              </label>
                              <div className="form-check me-3 mb-2">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="sibling"
                                  id="yes"
                                  defaultChecked
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="yes"
                                >
                                  Yes
                                </label>
                              </div>
                              <div className="form-check mb-2">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="sibling"
                                  id="no"
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="no"
                                >
                                  No
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                        {newContents.map((_, index) => (
                          <div key={index} className="col-lg-12">
                            <div className="row">
                              <div className="col-lg-3 col-md-6">
                                <div className="mb-3">
                                  <label className="form-label">Name</label>
                                  <CommonSelect
                                    className="select"
                                    options={names}
                                    defaultValue={isEdit ? names[0] : undefined}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-3 col-md-6">
                                <div className="mb-3">
                                  <label className="form-label">Roll No</label>
                                  <CommonSelect
                                    className="select"
                                    options={rollno}
                                    defaultValue={
                                      isEdit ? rollno[0] : undefined
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-lg-3 col-md-6">
                                <div className="mb-3">
                                  <label className="form-label">
                                    Admission No
                                  </label>
                                  <CommonSelect
                                    className="select"
                                    options={AdmissionNo}
                                    defaultValue={
                                      isEdit ? AdmissionNo[0] : undefined
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-lg-3 col-md-6">
                                <div className="mb-3">
                                  <div className="d-flex align-items-center">
                                    <div className="w-100">
                                      <label className="form-label">
                                        Class
                                      </label>
                                      <CommonSelect
                                        className="select"
                                        options={allClass}
                                        defaultValue={
                                          isEdit ? allClass[0] : undefined
                                        }
                                      />
                                    </div>
                                    {newContents.length > 1 && (
                                      <div>
                                        <label className="form-label">
                                          &nbsp;
                                        </label>
                                        <Link
                                          to="#"
                                          className="trash-icon ms-3"
                                          onClick={() => removeContent(index)}
                                        >
                                          <i className="ti ti-trash-x" />
                                        </Link>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="border-top pt-3">
                      <Link
                        to="#"
                        onClick={addNewContent}
                        className="add-sibling btn btn-primary d-inline-flex align-items-center"
                      >
                        <i className="ti ti-circle-plus me-2" />
                        Add New
                      </Link>
                    </div>
                  </div>
                </div> */}
                {/* /Sibilings */}
                {/* Address */}
                <div className="card">
                  <div className="card-header bg-light">
                    <div className="d-flex align-items-center">
                      <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                        <i className="ti ti-map fs-16" />
                      </span>
                      <h4 className="text-dark">Address</h4>
                    </div>
                  </div>
                  <div className="card-body pb-1">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Current Address</label><span className="text-danger"> *</span>
                          <input
                            name="curr_address"
                            onChange={handleInputChange}
                            type="text"
                            className={`form-control `}
                            value={
                              isEdit
                                ? "3495 Red Hawk Road, Buffalo Lake, MN 55314"
                                : studentData.curr_address
                            }
                          />
                          {errors.curr_address && (
                            <div style={{ fontSize: '11px' }} className="text-danger">{errors.curr_address}</div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">
                            Permanent Address
                          </label><span className="text-danger"> *</span>
                          <input
                            name="perm_address"
                            onChange={handleInputChange}
                            type="text"
                            className={`form-control `}
                            value={
                              isEdit
                                ? "3495 Red Hawk Road, Buffalo Lake, MN 55314"
                                : studentData.perm_address
                            }
                          />
                          {errors.perm_address && (
                            <div style={{ fontSize: '11px' }} className="text-danger">{errors.perm_address}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Address */}
                {/* Transport Information */}
                <div className="card">
                  <div className="card-header bg-light d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                        <i className="ti ti-bus-stop fs-16" />
                      </span>
                      <h4 className="text-dark">Transport Information</h4>
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
                      <div className="col-lg-4 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Route</label>
                          <CommonSelect
                            className="select"
                            options={route}
                            value={studentData.route}
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
                            value={studentData.vehicle_num}
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
                            value={isEdit ? PickupPoint[0].label : undefined}
                            onChange={(option) => handleSelectChange("picup_point", option ? option.value : "")}
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
                            value={studentData.hostel}
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
                            value={studentData.room_num}
                            onChange={(option) => handleSelectChange("room_num", option ? option.value : "")}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Hostel Information */}
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
                            <label className="form-label mb-1">
                              Medical Condition
                            </label>
                            <p>Upload image size of 4MB, Accepted Format PDF</p>
                          </div>
                          <div className="d-flex align-items-center flex-wrap">
                            <div className="btn btn-primary drag-upload-btn mb-2 me-2">
                              <i className="ti ti-file-upload me-1" />
                              Upload
                              <input
                                type="file"
                                className="form-control image_sign"
                                accept="application/pdf, image/*"
                                onChange={(e) => handleFileChange(e, setMedicalCerti, 'medcertpath')}
                              />
                            </div>
                            {medcertid && (<div onClick={() => deleteImage(medcertid)} className="btn btn-danger mb-2 btn-sm">
                              Remove
                            </div>)}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="mb-2">
                          <div className="mb-3">
                            <label className="form-label mb-1">
                              Upload Transfer Certificate
                            </label>
                            <p>Upload image size of 4MB, Accepted Format PDF</p>
                          </div>
                          <div className="d-flex align-items-center flex-wrap">
                            <div className="btn btn-primary drag-upload-btn mb-2">
                              <i className="ti ti-file-upload me-1" />
                              Upload Document
                              <input
                                type="file"
                                className="form-control image_sign"
                                accept="application/pdf, image/*"
                                onChange={(e) => handleFileChange(e, setTransferCerti, 'transcertpath')}
                              />

                            </div>
                            {transcertid && (<div onClick={() => deleteImage(transcertid)} className="btn btn-danger btn-sm mb-2">
                              Remove
                            </div>)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Documents */}
                {/* Medical History */}
                <div className="card">
                  <div className="card-header bg-light">
                    <div className="d-flex align-items-center">
                      <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                        <i className="ti ti-medical-cross fs-16" />
                      </span>
                      <h4 className="text-dark">Medical History</h4>
                    </div>
                  </div>
                  <div className="card-body pb-1">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="mb-2">
                          <label className="form-label">
                            Medical Condition
                          </label>
                          <div className="d-flex align-items-center flex-wrap">
                            <label className="form-label text-dark fw-normal me-2">
                              Medical Condition of a Student
                            </label>

                            <div className="form-check me-3 mb-2">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="condition"
                                id="good"
                                value="good"
                                checked={studentData.condition === "good"}
                                onChange={handleInputChange}
                              />
                              <label className="form-check-label" htmlFor="good">
                                Good
                              </label>
                            </div>

                            <div className="form-check me-3 mb-2">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="condition"
                                id="bad"
                                value="bad"
                                checked={studentData.condition === "bad"}
                                onChange={handleInputChange}
                              />
                              <label className="form-check-label" htmlFor="bad">
                                Bad
                              </label>
                            </div>

                            <div className="form-check mb-2">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="condition"
                                id="others"
                                value="others"
                                checked={studentData.condition === "others"}
                                onChange={handleInputChange}
                              />
                              <label className="form-check-label" htmlFor="others">
                                Others
                              </label>
                            </div>
                          </div>

                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Allergies</label>

                        <TagInput
                          initialTags={studentData.allergies}
                          onTagsChange={(tags) => handleTagsChange('allergies', tags)}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Medications</label>
                        <TagInput
                          initialTags={studentData.medications}
                          onTagsChange={(tags) => handleTagsChange('medications', tags)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Medical History */}
                {/* Previous School details */}
                <div className="card">
                  <div className="card-header bg-light">
                    <div className="d-flex align-items-center">
                      <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                        <i className="ti ti-building fs-16" />
                      </span>
                      <h4 className="text-dark">Previous School Details</h4>
                    </div>
                  </div>
                  <div className="card-body pb-1">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">School Name</label>
                          <input
                            onChange={handleInputChange}
                            name="prev_school"
                            type="text"
                            className="form-control"
                            value={
                              isEdit ? "Oxford Matriculation, USA" : studentData.prev_school
                            }
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Address</label>
                          <input
                            onChange={handleInputChange}
                            name="prev_school_address"
                            type="text"
                            className="form-control"
                            value={
                              isEdit
                                ? "1852 Barnes Avenue, Cincinnati, OH 45202"
                                : studentData.prev_school_address
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Previous School details */}
                {/* Other Details */}
                <div className="card">
                  <div className="card-header bg-light">
                    <div className="d-flex align-items-center">
                      <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                        <i className="ti ti-building-bank fs-16" />
                      </span>
                      <h4 className="text-dark">Other Details</h4>
                    </div>
                  </div>
                  <div className="card-body pb-1">
                    <div className="row">
                      <div className="col-md-5">
                        <div className="mb-3">
                          <label className="form-label">Bank Name</label>
                          <input
                            onChange={handleInputChange}
                            name="bank_name"
                            type="text"
                            className="form-control"
                            value={
                              isEdit ? "Bank of America" : studentData.bank_name
                            }
                          />
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="mb-3">
                          <label className="form-label">Branch</label>
                          <input
                            onChange={handleInputChange}
                            name="branch"
                            type="text"
                            className="form-control"
                            value={isEdit ? "Cincinnati" : studentData.branch}
                          />
                        </div>
                      </div>
                      <div className="col-md-5">
                        <div className="mb-3">
                          <label className="form-label">IFSC Number</label>
                          <input
                            onChange={handleInputChange}
                            name="ifsc_num"
                            type="text"
                            className="form-control"
                            value={isEdit ? "BOA83209832" : studentData.ifsc_num}
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="form-label">
                            Other Information
                          </label>
                          <textarea
                            onChange={handleInputChange}
                            name="other_det"
                            className="form-control"
                            rows={3}
                            value={studentData.other_det || ""}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Other Details */}
                <div className="text-end">
                  <button type="button" onClick={(e) => cancelAdd(e)} className="btn btn-light me-3">
                    Cancel
                  </button>
                  <button className="btn btn-primary">Add Student</button>
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

export default AddStudent;
