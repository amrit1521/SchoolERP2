import React, { useEffect, useState } from "react";
import CommonSelect from "../../../../core/common/commonSelect";
import {
  bloodGroup,
  Contract,
  gender,
  Hostel,
  Marital,
  PickupPoint,
  roomNO,
  route,
  Shift,
  status,
  VehicleNumber,
} from "../../../../core/common/selectoption/selectoption";
import { DatePicker } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import TagInput from "../../../../core/common/Taginput";
import { toast } from "react-toastify";
import {
  deleteStaffFile,
  editStaff,
  staffForEdit,
  uploadStaffFile,
} from "../../../../service/staff";
import { departmentOption } from "../../../../service/department";
import { designationOption } from "../../../../service/designation";
import dayjs from "dayjs";
import {
  getAllTransportRoutes,
  getAssignedVehicleForARoute,
  getTransportPickUpPointsForRouteId,
  Imageurl,
} from "../../../../service/api";
import { allHostel, getAllRoomForAHostel } from "../../../../service/hostel";

export interface StaffData {
  firstname: string;
  lastname: string;
  primarycont: string;
  email: string;
  password: string;
  conpassword: string;
  status: string;

  // staff table fields

  role: number | null;
  department: number | null;
  desgination: number | null;
  gender: string;
  blood_gp: string;
  marital_status: string;
  fat_name: string;
  mot_name: string;
  dob: string;
  date_of_join: string;
  lan_known: string[];
  qualification: string;
  work_exp: string;
  note: string;
  address: string;
  perm_address: string;
  driveLic:string;

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
  route: number | null;
  vehicle_num: number | null;
  pickup_point: number | null;

  // hostel info
  hostel: number | null;
  room_num: number | null;

  //  social media link
  fac_link: string;
  inst_link: string;
  lin_link: string;
  twi_link: string;
}

const EditStaff = () => {
  // const [owner, setOwner] = useState<string[]>([]);
  // const handleTagsChange = (newTags: string[]) => {
  //   setOwner(newTags);
  // };
  const routes = all_routes;
  const { staffid } = useParams();
  const navigate = useNavigate();

  const [staffData, setStaffData] = useState<StaffData>({
    firstname: "",
    lastname: "",
    primarycont: "",
    email: "",
    password: "",
    conpassword: "",
    status: "",

    // staff table fields
    role: null,
    department: null,
    desgination: null,
    gender: "",
    blood_gp: "",
    marital_status: "",
    fat_name: "",
    mot_name: "",
    dob: "",
    date_of_join: "",
    lan_known: [],
    qualification: "",
    work_exp: "",
    note: "",
    address: "",
    perm_address: "",
    driveLic:"",

    // Payroll
    epf_no: "",
    basic_salary: "",
    contract_type: "",
    work_sift: "",
    work_location: "",
    date_of_leave: "",

    // Leaves
    medical_leaves: "",
    casual_leaves: "",
    maternity_leaves: "",
    sick_leaves: "",

    // Bank details
    account_name: "",
    account_num: "",
    bank_name: "",
    ifsc_code: "",
    branch_name: "",

    // transport info
    route: null,
    vehicle_num: null,
    pickup_point: null,

    // hostel info
    hostel: null,
    room_num: null,

    // Social media
    fac_link: "",
    inst_link: "",
    lin_link: "",
    twi_link: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof StaffData, string>>
  >({});

  const [staffImg, setStaffImg] = useState<File | null>(null);
  const [staffResume, setStaffResume] = useState<File | null>(null);
  const [staffJoinLetter, setStaffJoinLetter] = useState<File | null>(null);

  const [staffImgpath, setStaffImgpath] = useState<string>("");
  const [staffResumepath, setStaffResumepath] = useState<string>("");
  const [staffJoinLetterpath, setStaffJoinLetterpath] = useState<string>("");

  const [staffImgid, setStaffImgid] = useState<number | null>(null);
  const [staffResumeid, setStaffResumeid] = useState<number | null>(null);
  const [staffJoinLetterid, setStaffJoinLetterid] = useState<number | null>(
    null
  );

  // editing data
  const [originalImgPath, setOriginalImgPath] = useState<string>("");
  const [originalResumePath, setOriginalResumePath] = useState<string>("");
  const [originalJoinLetterPath, setOriginalJoinLetterPath] =
    useState<string>("");

  const [transportRouteOption, setTransportRouteOption] = useState<any[]>([]);
  const [pickupPointOption, setPickupPointOption] = useState<
    { value: number; label: string }[]
  >([]);
  const [vehicalOption, setVehicalOption] = useState<any[]>([]);
  const [allhostels, setAllHostels] = useState<any[]>([]);
  const [allRoomsOptions, setAllRoomsOptions] = useState<any[]>([]);
  const fetchRoutes = async () => {
    try {
      const { data } = await getAllTransportRoutes();
      if (data.success) {
        setTransportRouteOption(
          data.result.map((e: any) => ({ value: e.id, label: e.routeName }))
        );
      } else {
        toast.error(data.message || "Failed to load routes");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load routes");
    }
  };

  const fetchPickupPoints = async (id: number) => {
    try {
      const { data } = await getTransportPickUpPointsForRouteId(id);
      if (data.success) {
        console.log("data: ", data);
        setPickupPointOption(
          data.result.map((point: any) => ({
            value: point.id,
            label: point.pickPointName,
          }))
        );
      } else {
        toast.error(data.message || "Failed to fetch pickup points");
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to fetch pickup points"
      );
    }
  };
  const fetchAssginedVehicle = async (id: number) => {
    try {
      const { data } = await getAssignedVehicleForARoute(id);
      if (data.success) {
        console.log("data: ", data);
        setVehicalOption(
          data.result.map((item: any) => ({
            value: item.vehicle_id,
            label: item.vehicle_no,
          }))
        );
      } else {
        toast.error(data.message || "Failed to fetch assigned vehicles");
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to fetch assigned vehicles"
      );
    }
  };

  const fetchHostels = async () => {
    try {
      const { data } = await allHostel();
      if (data.success) {
        console.log("hostel: ", data);
        setAllHostels(
          data.data.map((item: any) => ({
            value: item.id,
            label: item.hostelName,
          }))
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchHostelsRooms = async (id: number) => {
    try {
      const { data } = await getAllRoomForAHostel(id);
      if (data.success) {
        console.log("hostel: ", data);
        setAllRoomsOptions(
          data.data.map((item: any) => ({
            value: item.id,
            label: item.roomNo,
          }))
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (staffData.hostel) {
      fetchHostelsRooms(staffData.hostel);
    }
  }, [staffData.hostel]);

  useEffect(() => {
    if (staffData.route) {
      fetchPickupPoints(staffData.route);
      fetchAssginedVehicle(staffData.route);
    }
  }, [staffData.route]);

  const fetchStaffByStaffId = async (staffid: number) => {
    try {
      const { data } = await staffForEdit(staffid);

      if (data.success && data.data) {
        const staff = data.data;

        setStaffData({
          firstname: staff.firstname || "",
          lastname: staff.lastname || "",
          primarycont: staff.mobile || "",
          email: staff.email || "",
          password: "",
          conpassword: "",
          status: staff.status || "",

          role: staff.role || null,
          department: staff.department || null,
          desgination: staff.designation || null,
          gender: staff.gender || "",
          blood_gp: staff.blood_gp || "",
          marital_status: staff.marital_status || "",
          fat_name: staff.fat_name || "",
          mot_name: staff.mot_name || "",
          dob: staff.dob ? dayjs(staff.dob).format("DD MMM YYYY") : "",
          date_of_join: staff.date_of_join
            ? dayjs(staff.date_of_join).format("DD MMM YYYY")
            : "",
          lan_known: staff.lan_known ? JSON.parse(staff.lan_known) : [],
          qualification: staff.qualification || "",
          work_exp: staff.work_exp?.toString() || "",
          note: staff.note || "",
          address: staff.address || "",
          perm_address: staff.perm_address || "",
          driveLic:staff.driveLic||"",

          epf_no: staff.epf_no || "",
          basic_salary: staff.basic_salary || "",
          contract_type: staff.contract_type || "",
          work_sift: staff.work_sift || "",
          work_location: staff.work_location || "",
          date_of_leave: staff.date_of_leave || "",

          medical_leaves: staff.medical_leaves || "",
          casual_leaves: staff.casual_leaves || "",
          maternity_leaves: staff.maternity_leaves || "",
          sick_leaves: staff.sick_leaves || "",

          account_name: staff.account_name || "",
          account_num: staff.account_num || "",
          bank_name: staff.bank_name || "",
          ifsc_code: staff.ifsc_code || "",
          branch_name: staff.branch_name || "",

          route: staff.route || "",
          vehicle_num: staff.vehicle_num || "",
          pickup_point: staff.pickup_point || "",

          hostel: staff.hostel || "",
          room_num: staff.room_num || "",

          fac_link: staff.fac_link || "",
          inst_link: staff.inst_link || "",
          lin_link: staff.link_link || "",
          twi_link: staff.twi_link || "",
        });

        setStaffImgpath(staff.img_src || "");
        setStaffResumepath(staff.resume_src || "");
        setStaffJoinLetterpath(staff.letter_src || "");

        setOriginalImgPath(staff.img_src || "");
        setOriginalResumePath(staff.resume_src || "");
        setOriginalJoinLetterPath(staff.letter_src || "");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Failed to fetch staff data"
      );
    }
  };

  useEffect(() => {
    if (staffid) {
      fetchStaffByStaffId(Number(staffid));
    }
  }, [staffid]);

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

      const maxSizeInBytes = 4 * 1024 * 1024; // 4MB
      if (file.size > maxSizeInBytes) {
        toast.error("File size should not exceed 4MB.");
        return;
      }

      setFile(file);

      const formData = new FormData();
      formData.append("stafffile", file);

      try {
        const res = await uploadStaffFile(formData);
        const uploadedPath = res.data.file;
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setStaffData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (
    name: keyof StaffData,
    date: dayjs.Dayjs | null,
    dateString: string
  ) => {
    console.log(date ? "" : "");
    setStaffData((prev) => ({ ...prev, [name]: dateString }));
  };

  const handleSelectChange = (
    name: keyof StaffData,
    value: string | number | null
  ) => {
    setStaffData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (field: keyof typeof staffData, tags: string[]) => {
    setStaffData((prev) => ({
      ...prev,
      [field]: tags,
    }));
  };

  const validateStaffData = (data: StaffData) => {
    const errors: Partial<Record<keyof StaffData, string>> = {};

    const isDriver = roleOptions
      .find((item) => item.value === data.role)
      ?.label.toLowerCase()
      .includes("driver");

    const dlRegex = /^[A-Z]{2}\d{2}\s?\d{4}\s?\d{7}$/;


    // 🔹 Basic personal info
    if (!data.firstname.trim()) errors.firstname = "First name is required";
    if (!data.lastname.trim()) errors.lastname = "Last name is required";
    if (!data.primarycont.trim() || !/^\d{10}$/.test(data.primarycont))
      errors.primarycont = "Valid 10-digit contact number is required";
    if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      errors.email = "Valid email is required";

    if (!data.status.trim()) errors.status = "Status is required";

    // 🔹 Staff info
    if (!data.role) errors.role = "Role is required";
    if (!data.department) errors.department = "Department is required";
    if (!data.desgination) errors.desgination = "Designation is required";
    if (!data.gender.trim()) errors.gender = "Gender is required";
    if (!data.dob.trim()) errors.dob = "Date of birth is required";
    if (!data.date_of_join.trim())
      errors.date_of_join = "Date of joining is required";
    if (!data.fat_name.trim()) errors.fat_name = "Father's Name is required";
    if (!data.mot_name.trim()) errors.mot_name = "Mother's Name is required";
    if (!data.qualification.trim())
      errors.qualification = "Qualification is required";
    if (!data.work_exp.trim()) errors.work_exp = "Work Experience is required";
    if (!data.address.trim()) errors.address = "Address is required";
    if (!data.perm_address.trim())
      errors.perm_address = "Permannent Address is required";
    if (!data.blood_gp) errors.blood_gp = "Blood Group is required !";
    if (data.lan_known.length === 0)
      errors.lan_known = "Language known is required !";

    if (isDriver) {
      if (!data.driveLic.trim()) {
        errors.driveLic = "Driving License is required for drivers.";
      } else if (!dlRegex.test(data.driveLic.trim().toUpperCase())) {
        errors.driveLic = "Invalid Driving License format (e.g., UP32 20150012345)";
      }
    }

    // 🔹 Payroll
    if (!data.epf_no) errors.epf_no = "EPF number is required";
    if (!data.basic_salary.trim())
      errors.basic_salary = "Basic salary is required";
    if (!data.contract_type.trim())
      errors.contract_type = "Contract type is required";

    // 🔹 Bank info
    if (!data.account_name.trim())
      errors.account_name = "Account name is required";
    if (!data.account_num.trim())
      errors.account_num = "Account number is required";
    if (!data.bank_name.trim()) errors.bank_name = "Bank name is required";
    if (!data.ifsc_code.trim()) errors.ifsc_code = "IFSC code is required";
    if (!data.branch_name.trim())
      errors.branch_name = "Branch name is required";

    // leaves
    if (!data.medical_leaves.trim())
      errors.medical_leaves = "Medical leave is required !";
    if (!data.casual_leaves.trim())
      errors.casual_leaves = "Casual leave is required !";

    if (!staffImgpath && !originalImgPath) {
      toast.error("Teacher Image is Required !");
    }
    if (!staffResumepath && !originalResumePath) {
      toast.error("Teacher Resume is Required !");
    }
    if (!staffJoinLetterpath && !originalJoinLetterPath) {
      toast.error("Teacher Join Letter is Required !");
    }

    // 🔹 Set errors state
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateStaffData(staffData)) {
      toast.error("Required fileds must be filled !");
      return;
    }

    console.log(staffResume ? "" : "");
    console.log(staffJoinLetter ? "" : "");

    try {
      const formData = new FormData();

      if (
        (originalImgPath || staffImgpath) &&
        (originalResumePath || staffResumepath) &&
        (originalJoinLetterPath || staffJoinLetterpath)
      ) {
        formData.append("img_src", staffImgpath || originalImgPath);
        formData.append("resume_src", staffResumepath || originalResumePath);
        formData.append(
          "letter_src",
          staffJoinLetterpath || originalJoinLetterPath
        );
      } else {
        toast.error("All files are required !");
        return;
      }

      Object.entries(staffData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value as string);
        }
      });

      // for (const [key, value] of formData.entries()) {
      //   console.log(key, value)
      // }

      const res = await editStaff(formData, Number(staffid));
      if (res.data.success) {
        toast.success(res.data.message);

        setStaffData({
          firstname: "",
          lastname: "",
          primarycont: "",
          email: "",
          password: "",
          conpassword: "",
          status: "",

          role: null,
          department: null,
          desgination: null,
          gender: "",
          blood_gp: "",
          marital_status: "",
          fat_name: "",
          mot_name: "",
          dob: "",
          date_of_join: "",
          lan_known: [],
          qualification: "",
          work_exp: "",
          note: "",
          address: "",
          perm_address: "",
          driveLic:"",

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
          route: null,
          vehicle_num: null,
          pickup_point: null,

          // hostel info
          hostel: null,
          room_num: null,

          fac_link: "",
          inst_link: "",
          lin_link: "",
          twi_link: "",
        });

        // File states reset
        setStaffImg(null);
        setStaffResume(null);
        setStaffJoinLetter(null);

        setStaffImgpath("");
        setStaffResumepath("");
        setStaffJoinLetterpath("");

        setStaffImgid(null);
        setStaffResumeid(null);
        setStaffJoinLetterid(null);
        navigate(-1);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setStaffData({
      firstname: "",
      lastname: "",
      primarycont: "",
      email: "",
      password: "",
      conpassword: "",
      status: "",

      // staff table fields
      role: null,
      department: null,
      desgination: null,
      gender: "",
      blood_gp: "",
      marital_status: "",
      fat_name: "",
      mot_name: "",
      dob: "",
      date_of_join: "",
      lan_known: [],
      qualification: "",
      work_exp: "",
      note: "",
      address: "",
      perm_address: "",
      driveLic:"",
      // Payroll
      epf_no: "",
      basic_salary: "",
      contract_type: "",
      work_sift: "",
      work_location: "",
      date_of_leave: "",

      // Leaves
      medical_leaves: "",
      casual_leaves: "",
      maternity_leaves: "",
      sick_leaves: "",

      // Bank details
      account_name: "",
      account_num: "",
      bank_name: "",
      ifsc_code: "",
      branch_name: "",

      // transport info
      route: null,
      vehicle_num: null,
      pickup_point: null,

      // hostel info
      hostel: null,
      room_num: null,

      // Social media
      fac_link: "",
      inst_link: "",
      lin_link: "",
      twi_link: "",
    });

    // File states reset
    setStaffImg(null);
    setStaffResume(null);
    setStaffJoinLetter(null);

    setStaffImgpath("");
    setStaffResumepath("");
    setStaffJoinLetterpath("");

    setStaffImgid(null);
    setStaffResumeid(null);
    setStaffJoinLetterid(null);
    navigate(-1);
  };

  interface OptionType {
    value: number;
    label: string;
  }

  const [departOptions, setDepartOption] = useState<OptionType[]>([]);
  const [desgiOptions, setDesgiOption] = useState<OptionType[]>([]);
  const [roleOptions, setRoleOptions] = useState<OptionType[]>([])

  const fetchDepartMentAndDesginationOption = async () => {
    try {
      const [departRes, desgiRes] = await Promise.all([
        departmentOption(),
        designationOption(),
      ]);

      if (departRes.data?.success) {
        const depOptions = departRes.data.data.map((d: any) => ({
          value: d.id,
          label: d.name,
        }));
        setDepartOption(depOptions);
      } else {
        setDepartOption([]);
      }
      if (desgiRes.data?.success) {
        const desOptions = desgiRes.data.data.map((d: any) => ({
          value: d.id,
          label: d.name,
        }));
        setDesgiOption(desOptions);
      } else {
        setDesgiOption([]);
      }
    } catch (error: any) {
      console.error("Error fetching department/designation:", error);
      toast.error(error?.response?.data?.message || "Failed to fetch options");
    }
  };


  const fetchRoles = async () => {
    try {
      const { data } = await getAllRoles();
      if (data.success) {

        setRoleOptions(
          data.result.map((item: any) => ({
            value: item.id,
            label: item.role_name,
          }))
        );
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load roles data");
    }
  };

  useEffect(() => {
    fetchRoutes();
    fetchDepartMentAndDesginationOption();
    fetchHostels();
    fetchRoles()
  }, []);

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
                      <div className="add-section">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="d-flex align-items-center flex-wrap row-gap-3 mb-3">
                              {!staffImgid ? (
                                <p className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0  frames">
                                  <img
                                    className=""
                                    src={`${Imageurl}/${originalImgPath}`}
                                    alt=""
                                  />
                                </p>
                              ) : !staffImg ? (
                                <>
                                  <div className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0 text-dark frames">
                                    <i className="ti ti-photo-plus fs-16" />
                                  </div>
                                </>
                              ) : (
                                <p className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0  frames">
                                  <img
                                    className=""
                                    src={URL.createObjectURL(staffImg)}
                                    alt=""
                                  />
                                </p>
                              )}
                              <div className="profile-upload">
                                <div className="profile-uploader d-flex align-items-center">
                                  <div className="drag-upload-btn mb-3">
                                    Upload
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="form-control image-sign"
                                      onChange={(e) =>
                                        handleFileChange(
                                          e,
                                          setStaffImg,
                                          "staffImgpath"
                                        )
                                      }
                                    />
                                  </div>
                                  <span className="text-danger"> *</span>
                                  {staffImgid && (
                                    <div
                                      onClick={() => deleteFile(staffImgid)}
                                      className="btn btn-outline-danger mb-3 "
                                    >
                                      Remove
                                    </div>
                                  )}
                                </div>
                                <p className="fs-12">
                                  Upload image size 4MB, Format JPG, PNG
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="row row-cols-xxl-5 row-cols-md-6">
                          {/* First Name */}
                          <div className="col-xxl col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                First Name{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                name="firstname"
                                className="form-control"
                                value={staffData.firstname}
                                onChange={handleInputChange}
                              />
                              {errors.firstname && (
                                <div
                                  className="text-danger"
                                  style={{ fontSize: "11px" }}
                                >
                                  {errors.firstname}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Last Name */}
                          <div className="col-xxl col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Last Name <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                name="lastname"
                                className="form-control"
                                value={staffData.lastname}
                                onChange={handleInputChange}
                              />
                              {errors.lastname && (
                                <div
                                  className="text-danger"
                                  style={{ fontSize: "11px" }}
                                >
                                  {errors.lastname}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Role */}
                          <div className="col-xxl col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Role<span className="text-danger">*</span>
                              </label>
                              <CommonSelect
                                className="select text-capitalize"
                                options={roleOptions}
                                value={staffData.role}
                                onChange={(option) =>
                                  handleSelectChange(
                                    "role",
                                    option ? option.value : ""
                                  )
                                }
                              />
                              {errors.role && (
                                <div
                                  className="text-danger"
                                  style={{ fontSize: "11px" }}
                                >
                                  {errors.role}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Department */}
                          <div className="col-xxl col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Department<span className="text-danger">*</span>
                              </label>
                              <CommonSelect
                                className="select text-capitalize"
                                options={departOptions}
                                value={staffData.department}
                                onChange={(option) =>
                                  handleSelectChange(
                                    "department",
                                    option ? option.value : ""
                                  )
                                }
                              />
                              {errors.department && (
                                <div
                                  className="text-danger"
                                  style={{ fontSize: "11px" }}
                                >
                                  {errors.department}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Designation */}
                          <div className="col-xxl col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Designation{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <CommonSelect
                                className="select text-capitalize"
                                options={desgiOptions}
                                value={staffData.desgination}
                                onChange={(option) =>
                                  handleSelectChange(
                                    "desgination",
                                    option ? option.value : ""
                                  )
                                }
                              />
                              {errors.desgination && (
                                <div
                                  className="text-danger"
                                  style={{ fontSize: "11px" }}
                                >
                                  {errors.desgination}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="col-xxl col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Driving License <span className="text-danger">*</span></label>
                              <input
                                type="text"
                                name="driveLic"
                                className="form-control"
                                value={staffData.driveLic}
                                onChange={handleInputChange}
                              />
                              {errors.driveLic && <div className="text-danger" style={{ fontSize: '11px' }}>{errors.driveLic}</div>}
                            </div>
                          </div>

                          {/* Gender */}
                          <div className="col-xxl col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Gender <span className="text-danger">*</span>
                              </label>
                              <CommonSelect
                                className="select"
                                options={gender}
                                value={staffData.gender}
                                onChange={(option) =>
                                  handleSelectChange(
                                    "gender",
                                    option ? option.value : ""
                                  )
                                }
                              />
                              {errors.gender && (
                                <div
                                  className="text-danger"
                                  style={{ fontSize: "11px" }}
                                >
                                  {errors.gender}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col-xxl col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Status <span className="text-danger">*</span>
                              </label>
                              <CommonSelect
                                className="select"
                                options={status}
                                value={staffData.status}
                                onChange={(option) =>
                                  handleSelectChange(
                                    "status",
                                    option ? option.value : ""
                                  )
                                }
                              />
                              {errors.status && (
                                <div
                                  className="text-danger"
                                  style={{ fontSize: "11px" }}
                                >
                                  {errors.status}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Primary Contact */}
                          <div className="col-xxl col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Primary Contact Number{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                value={staffData.primarycont}
                                name="primarycont"
                                onChange={handleInputChange}
                              />
                              {errors.primarycont && (
                                <div
                                  className="text-danger"
                                  style={{ fontSize: "11px" }}
                                >
                                  {errors.primarycont}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Email */}
                          <div className="col-xxl col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Email Address{" "}
                                <span className="text-danger">*</span>{" "}
                              </label>
                              <input
                                type="email"
                                className="form-control"
                                value={staffData.email}
                                name="email"
                                onChange={handleInputChange}
                              />
                              {errors.email && (
                                <div
                                  className="text-danger"
                                  style={{ fontSize: "11px" }}
                                >
                                  {errors.email}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Blood Group */}
                          <div className="col-xxl col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Blood Group{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <CommonSelect
                                className="select"
                                options={bloodGroup}
                                value={staffData.blood_gp}
                                onChange={(option) =>
                                  handleSelectChange(
                                    "blood_gp",
                                    option ? option.value : ""
                                  )
                                }
                              />
                              {errors.blood_gp && (
                                <div
                                  className="text-danger"
                                  style={{ fontSize: "11px" }}
                                >
                                  {errors.blood_gp}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Marital Status */}
                          <div className="col-xxl col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Marital Status{" "}
                              </label>
                              <CommonSelect
                                className="select"
                                options={Marital}
                                value={staffData.marital_status}
                                onChange={(option) =>
                                  handleSelectChange(
                                    "marital_status",
                                    option ? option.value : ""
                                  )
                                }
                              />
                              {/* {errors.marital_status && <div className="text-danger" style={{ fontSize: '11px' }}>{errors.marital_status}</div>} */}
                            </div>
                          </div>

                          {/* Father's Name */}
                          <div className="col-xxl col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Father’s Name{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="fat_name"
                                value={staffData.fat_name}
                                onChange={handleInputChange}
                              />
                              {errors.fat_name && (
                                <div
                                  className="text-danger"
                                  style={{ fontSize: "11px" }}
                                >
                                  {errors.fat_name}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Mother's Name */}
                          <div className="col-xxl col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Mother’s Name{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="mot_name"
                                value={staffData.mot_name}
                                onChange={handleInputChange}
                              />
                              {errors.mot_name && (
                                <div
                                  className="text-danger"
                                  style={{ fontSize: "11px" }}
                                >
                                  {errors.mot_name}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Date of Birth */}
                          <div className="col-xxl col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Date of Birth{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <div className="input-icon position-relative">
                                <DatePicker
                                  className="form-control datetimepicker"
                                  format="DD MMM YYYY"
                                  value={
                                    staffData.dob
                                      ? dayjs(staffData.dob, "DD MMM YYYY")
                                      : null
                                  }
                                  placeholder="Select Date"
                                  onChange={(date, dateString) =>
                                    handleDateChange(
                                      "dob",
                                      date,
                                      Array.isArray(dateString)
                                        ? dateString[0]
                                        : dateString
                                    )
                                  }
                                />
                                <span className="input-icon-addon">
                                  <i className="ti ti-calendar" />
                                </span>
                                {errors.dob && (
                                  <div
                                    className="text-danger"
                                    style={{ fontSize: "11px" }}
                                  >
                                    {errors.dob}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Date of Joining */}
                          <div className="col-xxl col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Date of Joining{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <div className="input-icon position-relative">
                                <DatePicker
                                  className="form-control datetimepicker"
                                  format="DD MMM YYYY"
                                  value={
                                    staffData.date_of_join
                                      ? dayjs(
                                          staffData.date_of_join,
                                          "DD MMM YYYY"
                                        )
                                      : null
                                  }
                                  placeholder="Select Date"
                                  onChange={(date, dateString) =>
                                    handleDateChange(
                                      "date_of_join",
                                      date,
                                      Array.isArray(dateString)
                                        ? dateString[0]
                                        : dateString
                                    )
                                  }
                                />
                                <span className="input-icon-addon">
                                  <i className="ti ti-calendar" />
                                </span>
                                {errors.date_of_join && (
                                  <div
                                    className="text-danger"
                                    style={{ fontSize: "11px" }}
                                  >
                                    {errors.date_of_join}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Language Known */}
                          <div className="col-xxl col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Language Known{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <TagInput
                                initialTags={staffData.lan_known}
                                onTagsChange={(tags) =>
                                  handleTagsChange("lan_known", tags)
                                }
                              />
                              {errors.lan_known && (
                                <div
                                  className="text-danger"
                                  style={{ fontSize: "11px" }}
                                >
                                  {errors.lan_known}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Qualification */}
                          <div className="col-xxl col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Qualification{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                name="qualification"
                                className="form-control"
                                value={staffData.qualification}
                                onChange={handleInputChange}
                              />
                              {errors.qualification && (
                                <div
                                  className="text-danger"
                                  style={{ fontSize: "11px" }}
                                >
                                  {errors.qualification}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Work Experience */}
                          <div className="col-xxl col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Work Experience{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                name="work_exp"
                                className="form-control"
                                value={staffData.work_exp}
                                onChange={handleInputChange}
                              />
                              {errors.work_exp && (
                                <div
                                  className="text-danger"
                                  style={{ fontSize: "11px" }}
                                >
                                  {errors.work_exp}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Note */}
                          <div className="col-xxl col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Note</label>
                              <input
                                type="text"
                                name="note"
                                className="form-control"
                                value={staffData.note}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>

                          {/* Address */}
                          <div className="col-xxl col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Address <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                name="address"
                                className="form-control"
                                value={staffData.address}
                                onChange={handleInputChange}
                              />
                              {errors.address && (
                                <div
                                  className="text-danger"
                                  style={{ fontSize: "11px" }}
                                >
                                  {errors.address}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Permanent Address */}
                          <div className="col-xxl col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Permanent Address{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                name="perm_address"
                                className="form-control"
                                value={staffData.perm_address}
                                onChange={handleInputChange}
                              />
                              {errors.perm_address && (
                                <div
                                  className="text-danger"
                                  style={{ fontSize: "11px" }}
                                >
                                  {errors.perm_address}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Personal Information */}

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
                            <label className="form-label">
                              EPF No <span className="text-danger">*</span>{" "}
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="epf_no"
                              value={staffData.epf_no}
                              onChange={handleInputChange}
                            />
                            {errors.epf_no && (
                              <div
                                style={{ fontSize: "11px" }}
                                className="text-danger"
                              >
                                {errors.epf_no}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Basic Salary</label>
                            <span className="text-danger"> *</span>
                            <input
                              type="text"
                              className="form-control"
                              name="basic_salary"
                              value={staffData.basic_salary}
                              onChange={handleInputChange}
                            />
                            {errors.basic_salary && (
                              <div
                                style={{ fontSize: "11px" }}
                                className="text-danger"
                              >
                                {errors.basic_salary}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Contract Type</label>
                            <span className="text-danger"> *</span>
                            <CommonSelect
                              className="select"
                              options={Contract}
                              value={staffData.contract_type}
                              onChange={(option) =>
                                handleSelectChange(
                                  "contract_type",
                                  option ? option.value : ""
                                )
                              }
                            />
                            {errors.contract_type && (
                              <div
                                style={{ fontSize: "11px" }}
                                className="text-danger"
                              >
                                {errors.contract_type}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Work Shift</label>
                            <CommonSelect
                              className="select"
                              options={Shift}
                              value={staffData.work_sift}
                              onChange={(option) =>
                                handleSelectChange(
                                  "work_sift",
                                  option ? option.value : ""
                                )
                              }
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
                              value={staffData.work_location}
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
                                  staffData.date_of_leave
                                    ? dayjs(
                                        staffData.date_of_leave,
                                        "DD MMM YYYY"
                                      )
                                    : null
                                }
                                placeholder="Select Date"
                                onChange={(date, dateString) =>
                                  handleDateChange(
                                    "date_of_leave",
                                    date,
                                    Array.isArray(dateString)
                                      ? dateString[0]
                                      : dateString
                                  )
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
                            <label className="form-label">
                              Medical Leavesspa{" "}
                              <span className="text-danger">*</span>{" "}
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="medical_leaves"
                              value={staffData.medical_leaves}
                              onChange={handleInputChange}
                            />
                            {errors.medical_leaves && (
                              <div
                                style={{ fontSize: "11px" }}
                                className="text-danger"
                              >
                                {errors.medical_leaves}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              Casual Leaves{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="casual_leaves"
                              value={staffData.casual_leaves}
                              onChange={handleInputChange}
                            />
                            {errors.casual_leaves && (
                              <div
                                style={{ fontSize: "11px" }}
                                className="text-danger"
                              >
                                {errors.casual_leaves}
                              </div>
                            )}
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
                              value={staffData.maternity_leaves}
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
                              defaultValue={staffData.sick_leaves}
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
                            <span className="text-danger"> *</span>
                            <input
                              type="text"
                              className="form-control"
                              name="account_name"
                              value={staffData.account_name}
                              onChange={handleInputChange}
                            />
                            {errors.account_name && (
                              <div
                                style={{ fontSize: "11px" }}
                                className="text-danger"
                              >
                                {errors.account_name}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Account Number</label>
                            <span className="text-danger"> *</span>
                            <input
                              type="text"
                              name="account_num"
                              className="form-control"
                              value={staffData.account_num}
                              onChange={handleInputChange}
                            />
                            {errors.account_num && (
                              <div
                                style={{ fontSize: "11px" }}
                                className="text-danger"
                              >
                                {errors.account_num}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Bank Name</label>
                            <span className="text-danger">*</span>
                            <input
                              type="text"
                              name="bank_name"
                              onChange={handleInputChange}
                              className="form-control"
                              value={staffData.bank_name}
                            />
                            {errors.bank_name && (
                              <div
                                style={{ fontSize: "11px" }}
                                className="text-danger"
                              >
                                {errors.bank_name}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">IFSC Code</label>
                            <span className="text-danger"> *</span>
                            <input
                              onChange={handleInputChange}
                              type="text"
                              name="ifsc_code"
                              className="form-control"
                              value={staffData.ifsc_code}
                            />
                            {errors.ifsc_code && (
                              <div
                                style={{ fontSize: "11px" }}
                                className="text-danger"
                              >
                                {errors.ifsc_code}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Branch Name</label>
                            <span className="text-danger">*</span>
                            <input
                              onChange={handleInputChange}
                              type="text"
                              className="form-control"
                              name="branch_name"
                              value={staffData.branch_name}
                            />
                            {errors.branch_name && (
                              <div
                                style={{ fontSize: "11px" }}
                                className="text-danger"
                              >
                                {errors.branch_name}
                              </div>
                            )}
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
                              options={transportRouteOption}
                              value={staffData.route}
                              onChange={(option) =>
                                handleSelectChange(
                                  "route",
                                  option ? option.value : null
                                )
                              }
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Pickup Point</label>
                            <CommonSelect
                              className="select"
                              options={pickupPointOption}
                              value={staffData.pickup_point}
                              onChange={(option) =>
                                handleSelectChange(
                                  "pickup_point",
                                  option ? option.value : null
                                )
                              }
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Vehicle Number</label>
                            <CommonSelect
                              className="select"
                              options={vehicalOption}
                              value={staffData.vehicle_num}
                              onChange={(option) =>
                                handleSelectChange(
                                  "vehicle_num",
                                  option ? option.value : ""
                                )
                              }
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
                              options={allhostels}
                              value={staffData.hostel}
                              onChange={(option) =>
                                handleSelectChange(
                                  "hostel",
                                  option ? option.value : null
                                )
                              }
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Room No</label>
                            <CommonSelect
                              className="select"
                              options={allRoomsOptions}
                              value={staffData.room_num}
                              onChange={(option) =>
                                handleSelectChange(
                                  "room_num",
                                  option ? option.value : null
                                )
                              }
                            />
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
                      <div className="row rows-cols-xxl-5">
                        <div className="col-xxl col-xl-3 col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Facebook</label>
                            <input
                              type="text"
                              className="form-control"
                              name="fac_link"
                              value={staffData.fac_link}
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
                              name="inst_link"
                              value={staffData.inst_link}
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
                              name="lin_link"
                              value={staffData.lin_link}
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
                              name="twi_link"
                              value={staffData.twi_link}
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
                              <span className="text-danger"> *</span>
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
                                  onChange={(e) =>
                                    handleFileChange(
                                      e,
                                      setStaffResume,
                                      "staffResumepath"
                                    )
                                  }
                                />
                              </div>
                              {staffResumeid && (
                                <div
                                  onClick={() => deleteFile(staffResumeid)}
                                  className="btn btn-sm btn-outline-danger mb-2 "
                                >
                                  Remove
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="mb-2">
                            <div className="mb-3">
                              <label className="form-label">
                                Upload Joining Letter
                              </label>
                              <span className="text-danger"> *</span>
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
                                  onChange={(e) =>
                                    handleFileChange(
                                      e,
                                      setStaffJoinLetter,
                                      "teacherJoinLetterpath"
                                    )
                                  }
                                />
                              </div>
                              {staffJoinLetterid && (
                                <div
                                  onClick={() => deleteFile(staffJoinLetterid)}
                                  className="btn btn-sm btn-outline-danger mb-2 "
                                >
                                  Remove
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Documents */}

                  <div className="text-end">
                    <button
                      type="button"
                      onClick={(e) => handleCancel(e)}
                      className="btn btn-light me-3"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Edit Staff
                    </button>
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

export default EditStaff;
