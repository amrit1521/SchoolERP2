import React, { useEffect, useRef, useState } from "react";
import PredefinedDateRanges from "../../../core/common/datePicker";
import CommonSelect from "../../../core/common/commonSelect";
import Table from "../../../core/common/dataTable/index";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import TooltipOption from "../../../core/common/tooltipOption";
import { Imageurl } from "../../../service/api";
import { toast } from "react-toastify";
import { filterStaff, markStaffAttendance, speDetailsForAllStaff } from "../../../service/staff";
import { departmentOption } from "../../../service/department";
import { designationOption } from "../../../service/designation";

const StaffAttendance = () => {
  const routes = all_routes;

  interface AttendanceData {
    id: number;
    staffId: number;
    name: string;
    department: string;
    designation: string;
    attendance: string;
    notes: string;
  }

  const [staffList, setStaffList] = useState<any[]>([]);
  const [allStaffList, setAllStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);

  const generateAttendanceData = (list: any[]): AttendanceData[] =>
    list.map((staff) => ({
      id: staff.staff_id,
      staffId: staff.staff_id,
      name: `${staff.firstname} ${staff.lastname}`,
      department: staff.department_name,
      designation: staff.designation_name,
      attendance: "Absent",
      notes: "",
    }));

  // Fetch staff on mount
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true);
        const { data } = await speDetailsForAllStaff();
        if (data.success) {
          setStaffList(data.data);
          setAllStaffList(data.data);
        }
      } catch (error: any) {
        console.log(error.response);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  useEffect(() => {
    setAttendanceData(generateAttendanceData(staffList));
  }, [staffList]);

  const handleAttendanceChange = (id: number, value: string) => {
    setAttendanceData((prev) =>
      prev.map((staff) =>
        staff.id === id ? { ...staff, attendance: value } : staff
      )
    );
  };

  const handleNotesChange = (id: number, value: string) => {
    setAttendanceData((prev) =>
      prev.map((staff) =>
        staff.id === id ? { ...staff, notes: value } : staff
      )
    );
  };

  const handleSubmit = async () => {
    try {
      console.log(attendanceData)
      const { data } = await markStaffAttendance(attendanceData);
      if (data.success) {
        setAttendanceData(generateAttendanceData(staffList));
        toast.success(data.message);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.message || "Error submitting attendance");
    }
  };

  // Table data for rendering
  const tabledata = staffList.map((item) => ({
    key: item.staff_id,
    id: item.staff_id,
    staffId: item.staff_id,
    name: `${item.firstname} ${item.lastname}`,
    img: item.img_src,
    department: item.department_name,
    designation: item.designation_name,
    attendance: "Absent",
    notes: "",
  }));

  const columns = [
    {
      title: "Staff ID",
      dataIndex: "staffId",
      render: (id: number) => <Link to={`${routes.staffsAttendance}/${id}`} className="link-primary">{id}</Link>,
      sorter: (a: any, b: any) => a.staffId - b.staffId,
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (text: string, record: any) => (
        <div className="d-flex align-items-center">
          <Link to={`${routes.staffsAttendance}/${record.id}`} className="avatar avatar-md">
            <img src={`${Imageurl}/${record.img}`} className="img-fluid rounded-circle" alt="img" />
          </Link>
          <div className="ms-2">
            <Link to={`${routes.staffsAttendance}/${record.id}`} className="text-dark mb-0">{text}</Link>
          </div>
        </div>
      ),
      sorter: (a: any, b: any) => a.name.length - b.name.length,
    },
    {
      title: "Department",
      dataIndex: "department",
      render: (text: string) => (
        <span className="text-capitalize">{text}</span>
      ),
      sorter: (a: any, b: any) => a.department.length - b.department.length,
    },
    {
      title: "Designation",
      dataIndex: "designation",
      render: (text: string) => (
        <span className="text-capitalize">{text}</span>
      ),
      sorter: (a: any, b: any) => a.designation.length - b.designation.length,
    },
    {
      title: "Attendance",
      dataIndex: "attendance",
      render: (_: any, record: any) => {
        const staff = attendanceData.find((s) => s.id === record.key);
        return (
          <div className="d-flex align-items-center check-radio-group flex-nowrap">
            {["Present", "Late", "Absent", "Holiday", "Halfday"].map((status) => (
              <label className="custom-radio" key={status}>
                <input
                  type="radio"
                  name={`staff${record.key}`}
                  checked={staff?.attendance === status}
                  onChange={() => handleAttendanceChange(record.key, status)}
                />
                <span className="checkmark" />
                {status}
              </label>
            ))}
          </div>
        );
      },
    },
    {
      title: "Notes",
      dataIndex: "notes",
      render: (_: any, record: any) => {
        const staff = attendanceData.find((s) => s.id === record.key);
        return (
          <input
            type="text"
            className="form-control"
            placeholder="Enter notes"
            value={staff?.notes || ""}
            onChange={(e) => handleNotesChange(record.key, e.target.value)}
          />
        );
      },
    },
  ];

  // Filters ===================================================

  interface OptionType {
    value: number;
    label: string;
  }

  const [departOptions, setDepartOption] = useState<OptionType[]>([]);
  const [desgiOptions, setDesgiOption] = useState<OptionType[]>([]);

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

  useEffect(() => {
    fetchDepartMentAndDesginationOption();
  }, []);

  const [filterData, setFilterData] = useState({ department: null, designation: null });
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);

  const handleFilterSelectChange = (name: keyof typeof filterData, value: string | number) => {
    setFilterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyClick = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(filterData)
    try {
      const { data } = await filterStaff(filterData);
      if (data.success) {
        setStaffList(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleResetFilter = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setFilterData({ department: null, designation: null });
    setStaffList(allStaffList);
    if (dropdownMenuRef.current) dropdownMenuRef.current.classList.remove("show");
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        {/* Page Header */}
        <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
          <div className="my-auto mb-2">
            <h3 className="page-title mb-1">Staff Attendance</h3>
            <nav>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link to={routes.adminDashboard}>Dashboard</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="#">Report</Link>
                </li>
                <li className="breadcrumb-item active">Staff Attendance</li>
              </ol>
            </nav>
          </div>
          <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
            <TooltipOption />
          </div>
        </div>

        {/* Staff List */}
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
            <h4 className="mb-3">Staff Attendance List</h4>
            <div className="d-flex align-items-center flex-wrap">
              <div className="input-icon-start mb-3 me-2 position-relative">
                <PredefinedDateRanges />
              </div>
              <div className="dropdown mb-3 me-2">
                <Link
                  to="#"
                  className="btn btn-outline-light bg-white dropdown-toggle"
                  data-bs-toggle="dropdown"
                  data-bs-auto-close="outside"
                >
                  <i className="ti ti-filter me-2" />
                  Filter
                </Link>
                <div className="dropdown-menu drop-width" ref={dropdownMenuRef}>
                  <form onSubmit={handleApplyClick}>
                    <div className="p-3 border-bottom">
                      <div className="row">
                        <div className="col-md-6">
                          <label className="form-label">Department</label>
                          <CommonSelect
                            className="select text-capitalize"
                            options={departOptions}
                            value={filterData.department}
                            onChange={(opt) => handleFilterSelectChange("department", opt ? opt.value : "")}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Designation</label>
                          <CommonSelect
                            className="select text-capitalize"
                            options={desgiOptions}
                            value={filterData.designation}
                            onChange={(opt) => handleFilterSelectChange("designation", opt ? opt.value : "")}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="p-3 d-flex justify-content-end">
                      <button className="btn btn-light me-3" onClick={handleResetFilter}>
                        Reset
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Apply
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              <button onClick={() => handleSubmit()} className="btn btn-success mb-3 ms-2">
                Submit Attendance
              </button>
            </div>
          </div>

          <div className="card-body p-0 py-3">
            {loading ? (
              <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <Table dataSource={tabledata} columns={columns} Selection={true} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffAttendance;
