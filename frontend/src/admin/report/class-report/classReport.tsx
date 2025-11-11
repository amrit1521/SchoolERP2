import { useEffect, useRef, useState } from "react";
import Table from "../../../core/common/dataTable/index";

import { Link } from "react-router-dom";
import type { TableData } from "../../../core/data/interface";
import PredefinedDateRanges from "../../../core/common/datePicker";
import TooltipOption from "../../../core/common/tooltipOption";
import CommonSelect from "../../../core/common/commonSelect";
// import {
//   classSection,
//   classSylabus,
//   studentsnumber,
// } from "../../../core/common/selectoption/selectoption";
import { all_routes } from "../../router/all_routes";
// import { classstudentreport } from "../../../core/data/json/class_studentreport";
// import ImageWithBasePath from "../../../core/common/imageWithBasePath";
// import { classreport } from "../../../core/data/json/class_report";
import { toast } from "react-toastify";
import { allStudents, getAllSection } from "../../../service/api";
import { Spinner } from "../../../spinner";
import dayjs from 'dayjs'

interface rowsProps {
  id: number;
  section_id: number;
  class_id: number;
  class: string;
  section: string;
  noOfSeats: number;
  noOfStudents?: number;
}

interface Student {
  admissionNo: string;
  rollNo: number;
  name: string;
  class: string;
  section: string;
  gender: string;
  parent: string;
  dob: string;
  status: boolean;
}

interface filterProps {
  classId: number | null;
  sectionId: number | null;
}

const ClassReport = () => {
  const routes = all_routes;
  const [allClasses, setAllClasses] = useState<rowsProps[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<rowsProps[]>([]);
  const [selectedClass, setSelectedClass] = useState<rowsProps | null>(null);
  const [allStudentData, setAllStudentData] = useState<any[]>([]);
  const [selectedClassStudent, setSelectedClassStudent] = useState<Student[]>(
    []
  );
  const [classOption, setClassOption] = useState<any[]>([]);
  const [sectionOption, setSectionOption] = useState<any[]>([]);
  const [filter, setFilter] = useState<filterProps>({
    classId: null,
    sectionId: null,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const fetchClass = async () => {
    try {
      const { data } = await getAllSection();
      if (data.success) {
        setAllClasses(
          data.data.map((cl: any) => ({
            id: cl.id,
            section_id: cl.id,
            class_id: cl.class_id,
            class: cl.class_name,
            section: cl.section.toUpperCase(),
            noOfSeats: cl.noOfStudents,
          }))
        );
        setFilteredClasses(
          data.data.map((cl: any) => ({
            id: cl.id,
            section_id: cl.id,
            class_id: cl.class_id,
            class: cl.class_name,
            section: cl.section.toUpperCase(),
            noOfSeats: cl.noOfStudents,
          }))
        );
        setClassOption(
          [...new Set(data.data.map((cl: any) => cl.class_id))].map(
            (class_id) => {
              const classData = data.data.find(
                (cl: any) => cl.class_id === class_id
              );
              return {
                value: class_id,
                label: classData?.class_name || "",
              };
            }
          )
        );
      } else {
        toast.error(data.message || "fetching classes failed.");
      }
    } catch (error: any) {
      console.log(error.response);
      toast.error(error.response?.data?.message || "Failed to load classes");
    }
  };

  const fetchStudentDetails = async () => {
    try {
      setLoading(true);
      const { data } = await allStudents();
      if (data.success) {
        setAllStudentData(data.students);
      } else {
        toast.error(data.message || "fetching student details failed.");
      }
      setLoading(false);
    } catch (error: any) {
      console.log(error.response);
      toast.error(
        error.response?.data?.message || "Failed to fetch student Details"
      );
    }
  };

  useEffect(() => {
    if (selectedClass) {
      setSelectedClassStudent(
        allStudentData
          .filter(
            (student: any) =>
              selectedClass.id == student.section_id &&
              selectedClass.class_id == student.class_id
          )
          .map((stud: any) => ({
            admissionNo: stud.admissionnum,
            rollNo: stud.rollnum,
            name: stud.firstname + stud.lastname,
            class: stud.class,
            section: stud.section,
            gender: stud.gender,
            parent: stud.name,
            dob: new Date(stud.dob).toLocaleDateString(),
            status: stud.status,
          }))
      );
    }
  }, [selectedClass]);

  useEffect(() => {
    fetchClass();
    fetchStudentDetails();
  }, []);

  useEffect(() => {
    if (!allStudentData?.length || !allClasses?.length) return;

    const updatedClasses = allClasses.map((cl: any) => {
      const noOfStudents = allStudentData.reduce(
        (prev: number, std: any) =>
          cl.class_id === std.class_id && cl.section_id === std.section_id
            ? prev + 1
            : prev,
        0
      );
      return { ...cl, noOfStudents };
    });
    const isSame =
      JSON.stringify(updatedClasses) === JSON.stringify(allClasses);
    if (!isSame) {
      setAllClasses(updatedClasses);
      setFilteredClasses(updatedClasses);
    }
  }, [allStudentData]);

  useEffect(() => {
    if (filter.classId) {
      setSectionOption(
        allClasses
          .filter((cl: any) => cl.class_id == filter.classId)
          .map((e: any) => ({ value: e.id, label: e.section }))
      );
    }
  }, [filter.classId]);

  useEffect(() => {
    const modal = document.getElementById("view_class_report");
    const handleModalClose = () => {
      setSelectedClassStudent([]);
      setSelectedClass(null);
    };

    modal?.addEventListener("hidden.bs.modal", handleModalClose);

    return () => {
      modal?.removeEventListener("hidden.bs.modal", handleModalClose);
    };
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (text: number) => (
        <>
          <Link to="#" className="link-primary">
            CL0{text}
          </Link>
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.id.length - b.id.length,
    },

    {
      title: "Class",
      dataIndex: "class",
      sorter: (a: TableData, b: TableData) => a.class.length - b.class.length,
    },
    {
      title: "Section",
      dataIndex: "section",
      sorter: (a: TableData, b: TableData) =>
        a.section.length - b.section.length,
    },
    {
      title: "No Of Seats",
      dataIndex: "noOfSeats",
    },
    {
      title: "Available Students",
      dataIndex: "noOfStudents",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_: any, record: any) => (
        <>
          <Link
            to="#"
            className="btn btn-light view details"
            data-bs-toggle="modal"
            data-bs-target="#view_class_report"
            onClick={() => {
              setSelectedClass(record);
            }}
          >
            View Details
          </Link>
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.action.length - b.action.length,
    },
  ];
  const columns2 = [
    {
      title: "Admission No",
      dataIndex: "admissionNo",
      render: (_: any, record: any) => (
        <>
          <Link to="#" className="link-primary">
            {record.admissionNo}
          </Link>
        </>
      ),
      sorter: (a: TableData, b: TableData) =>
        a.admissionNo.length - b.admissionNo.length,
    },

    {
      title: "Roll No",
      dataIndex: "rollNo",
      sorter: (a: TableData, b: TableData) => a.rollNo.length - b.rollNo.length,
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (_: any, record: any) => (
        <>
          <div className="d-flex align-items-center">
            {/* <Link to="#" className="avatar avatar-md">
              <ImageWithBasePath
                src={record.img}
                className="img-fluid rounded-circle"
                alt="img"
              />
            </Link> */}
            <div className="ms-2">
              <p className="text-dark mb-0">
                <Link to="#">{record.name}</Link>
              </p>
            </div>
          </div>
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.name.length - b.name.length,
    },
    {
      title: "Class",
      dataIndex: "class",
      sorter: (a: TableData, b: TableData) => a.class.length - b.class.length,
    },
    {
      title: "Section",
      dataIndex: "section",
      sorter: (a: TableData, b: TableData) =>
        a.section.length - b.section.length,
    },
    {
      title: "Gender",
      dataIndex: "gender",
      sorter: (a: TableData, b: TableData) => a.gender.length - b.gender.length,
    },
    {
      title: "Parent",
      dataIndex: "parent",
      render: (_: any, record: any) => (
        <>
          <div className="d-flex align-items-center">
            {/* <Link to="#" className="avatar avatar-md">
              <ImageWithBasePath
                src={record.parentimg}
                className="img-fluid rounded-circle"
                alt="img"
              />
            </Link> */}
            <div className="ms-2">
              <p className="text-dark mb-0">
                <Link to="#">{record.parent}</Link>
              </p>
            </div>
          </div>
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.parent.length - b.parent.length,
    },
    {
      title: "DOB",
      dataIndex: "dob",
      render:(text:string)=>(

        <span>{dayjs(text).format('DD MMM YYYY')}</span>
      ),
      sorter: (a: TableData, b: TableData) => a.dob.length - b.dob.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text: string) => (
        <>
          {text === "1" ? (
            <span className="badge badge-soft-success d-inline-flex align-items-center">
              <i className="ti ti-circle-filled fs-5 me-1"></i>
              Active
            </span>
          ) : (
            <span className="badge badge-soft-danger d-inline-flex align-items-center">
              <i className="ti ti-circle-filled fs-5 me-1"></i>
              Inactive
            </span>
          )}
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.status.length - b.status.length,
    },
  ];
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const handleApplyClick = () => {
    if (!filter.classId || !filter.sectionId) {
      toast.error("please select filter.");
    }
    setFilteredClasses(
      allClasses.filter(
        (cl: any) => filter.classId == cl.class_id && cl.id == filter.sectionId
      )
    );
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };

  const handleResetFilter = () => {
    setFilter({ classId: null, sectionId: null });
    setFilteredClasses(allClasses);
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };

  return (
    <div>
      <>
        {/* Page Wrapper */}
        <div className="page-wrapper">
          <div className="content">
            {/* Page Header */}
            <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
              <div className="my-auto mb-2">
                <h3 className="page-title mb-1">Class Report</h3>
                <nav>
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <Link to={routes.adminDashboard}>Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to="#">Report</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Class Report
                    </li>
                  </ol>
                </nav>
              </div>
              <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
                <TooltipOption />
              </div>
            </div>
            {/* /Page Header */}
            {/* Student List */}
            <div className="card">
              <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                <h4 className="mb-3">Class Report List</h4>
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
                    <div
                      className="dropdown-menu drop-width"
                      ref={dropdownMenuRef}
                    >
                      <form>
                        <div className="d-flex align-items-center border-bottom p-3">
                          <h4>Filter</h4>
                        </div>
                        <div className="p-3 border-bottom">
                          <div className="row">
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="form-label">Class</label>
                                <CommonSelect
                                  className="select"
                                  options={classOption}
                                  value={filter.classId}
                                  onChange={(opt: any) =>
                                    setFilter((prev: any) => ({
                                      ...prev,
                                      classId: opt?.value,
                                    }))
                                  }
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="form-label">Section</label>
                                <CommonSelect
                                  className="select"
                                  options={sectionOption}
                                  value={filter.sectionId}
                                  onChange={(opt: any) =>
                                    setFilter((prev: any) => ({
                                      ...prev,
                                      sectionId: opt?.value,
                                    }))
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 d-flex align-items-center justify-content-end">
                          <Link
                            to="#"
                            className="btn btn-light me-3"
                            onClick={handleResetFilter}
                          >
                            Reset
                          </Link>
                          <Link
                            to="#"
                            className="btn btn-primary"
                            onClick={handleApplyClick}
                          >
                            Apply
                          </Link>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="dropdown mb-3">
                    <Link
                      to="#"
                      className="btn btn-outline-light bg-white dropdown-toggle"
                      data-bs-toggle="dropdown"
                    >
                      <i className="ti ti-sort-ascending-2 me-2" />
                      Sort by A-Z
                    </Link>
                    <ul className="dropdown-menu p-3">
                      <li>
                        <Link to="#" className="dropdown-item rounded-1 active">
                          Ascending
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="dropdown-item rounded-1">
                          Descending
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="dropdown-item rounded-1">
                          Recently Viewed
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="dropdown-item rounded-1">
                          Recently Added
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="card-body p-0 py-3">
                {/* Student List */}
                <Table
                  columns={columns}
                  dataSource={filteredClasses}
                  Selection={true}
                />
                {/* /Student List */}
              </div>
            </div>
            {/* /Student List */}
          </div>
        </div>
        {/* /Page Wrapper */}
        {/* Add Expenses Category */}
        <div className="modal fade" id="view_class_report">
          <div className="modal-dialog modal-dialog-centered  modal-xl">
            <div className="modal-content">
              <div className="modal-wrapper">
                <div className="modal-body">
                  {/* Student List */}
                  {loading ? (
                    <Spinner />
                  ) : (
                    <Table
                      columns={columns2}
                      dataSource={selectedClassStudent}
                      Selection={true}
                    />
                  )}
                  {/* /Student List */}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Add Expenses Category */}
      </>
    </div>
  );
};

export default ClassReport;
