import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import ImageWithBasePath from "../../../../core/common/imageWithBasePath";
// import { all_routes } from "../../../router/all_routes";
import Table from "../../../../core/common/dataTable/index";
import type { TableData } from "../../../../core/data/interface";
// import { Studentlist } from '../../../../core/data/json/studentList';
import CommonSelect from "../../../../core/common/commonSelect";
import { academicYear } from "../../../../core/common/selectoption/selectoption";
// import PredefinedDateRanges from '../../../../core/common/datePicker';
import TooltipOption from "../../../../core/common/tooltipOption";
import {
  getAllRolePermissions,
  getAllSectionForAClass,
  Imageurl,
  parmoteStudents,
  studentsForParmotion,
} from "../../../../service/api";
import { toast } from "react-toastify";
import { allRealClasses } from "../../../../service/classApi";
import { Spinner } from "../../../../spinner";
// import { all_routes } from "../../../../admin/router/all_routes";
import { teacher_routes } from "../../../../router/teacher_routes";

interface FromClass {
  class: number | null;
  section: number | null;
}

interface ToClass {
  class: number | null;
  section: number | null;
  acedmicyear: string;
}

const TStudentPromotion = () => {
  const [isPromotion, setIsPromotion] = useState<boolean>(false);
  // const routes = all_routes;
  const [students, setStudents] = useState<any[]>([]);
  const [classOptions, setClassOptions] = useState<
    { value: number; label: string }[]
  >([]);
  const [sectionOptions, setSectionOptions] = useState<
    { value: number; label: string }[]
  >([]);
  const [sectionOptions2, setSectionOptions2] = useState<
    { value: number; label: string }[]
  >([]);
  const [fromClassData, setFromClassData] = useState<FromClass>({
    class: null,
    section: null,
  });
  const [toClassData, setToClassData] = useState<ToClass>({
    class: null,
    section: null,
    acedmicyear: "",
  });
  const tokens = localStorage.getItem("token");
  const roleId = tokens ? JSON.parse(tokens)?.role : null;
  const [permission, setPermission] = useState<any>(null);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [loadingStudents, setLoadingStudents] = useState<boolean>(false);

  const fetchPermission = async (roleId: number) => {
    if (roleId) {
      const { data } = await getAllRolePermissions(roleId);
      if (data.success) {
        const currentPermission = data.result
          .filter((perm: any) => perm?.module_name === "Students")
          .map((perm: any) => ({
            can_create: perm?.can_create,
            can_delete: perm?.can_delete,
            can_edit: perm?.can_edit,
            can_view: perm?.can_view,
          }));
        setPermission(currentPermission[0]);
      }
    }
  };

  const fetchClass = async () => {
    try {
      const { data } = await allRealClasses();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setClassOptions(
          data.data.map((e: any) => ({ value: e.id, label: e.class_name }))
        );
      } else {
        setClassOptions([]);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error to fetch classes !");
    }
  };
  const fetchSection = async () => {
    try {
      if (fromClassData.class || toClassData.class) {
        const { data } = await getAllSectionForAClass(
          Number(fromClassData.class)
        );
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setSectionOptions(
            data.data.map((e: any) => ({ value: e.id, label: e.section_name }))
          );
        } else {
          setSectionOptions([]);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Error to fetch section !");
    }
  };

  const fetchSection2 = async () => {
    try {
      if (toClassData.class) {
        const { data } = await getAllSectionForAClass(
          Number(toClassData.class)
        );
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setSectionOptions2(
            data.data.map((e: any) => ({ value: e.id, label: e.section_name }))
          );
        } else {
          setSectionOptions2([]);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Error to fetch section !");
    }
  };

  useEffect(() => {
    fetchPermission(roleId);
    fetchClass();
  }, []);

  useEffect(() => {
    if (toClassData.class) {
      fetchSection2();
    }
  }, [toClassData.class]);

  useEffect(() => {
    if (fromClassData.class) {
      fetchSection();
    }
  }, [fromClassData.class]);

  const handleSelectChnage = (
    name: keyof FromClass,
    value: string | number
  ) => {
    setFromClassData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChnage2 = (name: keyof ToClass, value: string | number) => {
    setToClassData((prev) => ({ ...prev, [name]: value }));
  };

  const apiGetStudentsForParmotion = async (payload: object) => {
    try {
      const { data } = await studentsForParmotion(payload);
      if (data.success) {
        return data;
      }
    } catch (err) {
      console.error("apiGetStudentsForClass error:", err);
      throw err;
    }
  };

  const apiPromoteStudents = async (payload: {
    studentIds: number[];
    toClassId: number;
    toSectionId: number;
    toAcademicYear: string;
  }) => {
    console.log(payload);
    try {
      const { data } = await parmoteStudents(payload);
      if (data.success) {
        return data;
      }
    } catch (err) {
      console.error("apiPromoteStudents error:", err);
      throw err;
    }
  };

  const handleManagePromotion = async () => {
    if (!fromClassData.class || !fromClassData.section) {
      toast.error(
        "Please select From Class and Section before managing promotion!"
      );
      return;
    }
    // if(fromClassData.class!=teacher.class&&fromClassData.section!=teacher.section){
    //   toast.error('You can parmote only your class students!')
    //   return
    // }
    try {
      setLoadingStudents(true);
      await new Promise((res) => setTimeout(res, 500));
      const json = await apiGetStudentsForParmotion(fromClassData);

      if (json && json.success) {
        setStudents(Array.isArray(json.students) ? json.students : []);
        setIsPromotion(true);
        setSelectedStudents([]);
      } else {
        setStudents([]);
        toast.error(json?.message || "No students found");
      }
    } catch (err) {
      setStudents([]);
      toast.error("Failed to fetch students");
    } finally {
      setLoadingStudents(false);
    }
  };

  const onTableSelectionChange = (selectedRows: any[]) => {
    if (!Array.isArray(selectedRows)) {
      setSelectedStudents([]);
      return;
    }

    const passIds = selectedRows
      .filter((r) => r.result === "Pass")
      .map((r) => r.id);
    setSelectedStudents(passIds);

    const attemptedFailSelection = selectedRows.filter(
      (r) => r.result !== "Pass"
    );
    if (attemptedFailSelection.length > 0) {
      toast.info(
        `${attemptedFailSelection.length} student(s) are not eligible for promotion (Fail). Only "Pass" students will be promoted.`
      );
    }
  };

  const handlePromoteStudents = async () => {
    try {
      if (fromClassData.class == toClassData.class) {
        toast.error(
          "Studnet cannot parmote in same class ! Choose different Class"
        );
        return;
      }
      if (
        !toClassData.class ||
        !toClassData.section ||
        !toClassData.acedmicyear
      ) {
        toast.error("Please select target Class, Section and Academic Year!");
        return;
      }
      if (selectedStudents.length === 0) {
        toast.error("No eligible (Pass) students selected for promotion!");
        return;
      }

      const payload = {
        studentIds: selectedStudents,
        toClassId: Number(toClassData.class),
        toSectionId: Number(toClassData.section),
        toAcademicYear: toClassData.acedmicyear,
      };

      const json = await apiPromoteStudents(payload);
      if (json && json.success) {
        toast.success(json.message);
        setSelectedStudents([]);
        setIsPromotion(false);
        setSectionOptions([]);
        setSectionOptions2([]);
        setFromClassData({
          class: null,
          section: null,
        });
        setToClassData({
          class: null,
          section: null,
          acedmicyear: "",
        });
      } else {
        toast.error(json?.message || "Promotion failed!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error while promoting students!");
    }
  };

  const tableData = students.map((s: any) => ({
    key: s.student_id,
    id: s.student_id,
    AdmissionNo: s.admissionnum,
    RollNo: s.rollnum,
    name: `${s.firstname} ${s.lastname}`,
    img: s.stu_img,
    class: s.class,
    section: s.section,
    percent: s.percent,
    result: s.result,
  }));

  const columns = [
    {
      title: "Admission No",
      dataIndex: "AdmissionNo",
      render: (text: string) => (
        <Link to={teacher_routes.studentDetail} className="link-primary">
          {text}
        </Link>
      ),
      sorter: (a: TableData, b: TableData) =>
        a.AdmissionNo.length - b.AdmissionNo.length,
    },
    {
      title: "Roll No",
      dataIndex: "RollNo",
      sorter: (a: TableData, b: TableData) => a.RollNo.length - b.RollNo.length,
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (text: string, record: any) => (
        <div className="d-flex align-items-center">
          <Link to="#" className="avatar avatar-md">
            <img
              src={`${Imageurl}/${record.img}`}
              className="img-fluid rounded-circle"
              alt="img"
            />
          </Link>
          <div className="ms-2">
            <p className="text-dark mb-0">
              <Link to="#">{text}</Link>
            </p>
          </div>
        </div>
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
      title: "Percent",
      dataIndex: "percent",
      render: (text: string) => (
        <span
          className={`${Number(text) < 33 ? "text-danger" : "text-success"}`}
        >
          {text}%
        </span>
      ),
      sorter: (a: TableData, b: TableData) => a.percent - b.percent,
    },
    {
      title: "Exam Result",
      dataIndex: "result",
      render: (text: string) => (
        <>
          {text === "Pass" ? (
            <span className="badge badge-soft-success d-inline-flex align-items-center">
              <i className="ti ti-circle-filled fs-5 me-1"></i>
              {text}
            </span>
          ) : (
            <span className="badge badge-soft-danger d-inline-flex align-items-center">
              <i className="ti ti-circle-filled fs-5 me-1"></i>
              {text}
            </span>
          )}
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.result.length - b.result.length,
    },
    // {
    //   title: "Action",
    //   dataIndex: "promotion",
    //   render: (res: any, record: any) => (
    //     <>
    //       <div className="table-select mb-0">
    //         <CommonSelect
    //           className="select"
    //           options={promotion}
    //           // defaultValue based on result — promote option only for Pass
    //           value={record.result === "Pass" ? promotion.find((p: any) => p.value === "1") : promotion.find((p: any) => p.value === "0")}
    //           isDisabled={record.result !== "Pass"}
    //         />
    //         {res ? "" : ""}
    //       </div>
    //     </>
    //   ),

    // },
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
                <div className="my-auto mb-2">
                  <h3 className="page-title mb-1">Student Promotion</h3>
                  <nav>
                    <ol className="breadcrumb mb-0">
                      <li className="breadcrumb-item">
                        <Link to={teacher_routes.teacherDashboard}>
                          Teacher Dashboard
                        </Link>
                      </li>
                      <li className="breadcrumb-item">
                        <Link to="#">Students</Link>
                      </li>
                      <li
                        className="breadcrumb-item active"
                        aria-current="page"
                      >
                        Student Promotion
                      </li>
                    </ol>
                  </nav>
                </div>
                <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
                  <TooltipOption />
                </div>
              </div>
              <div className="alert alert-outline-primary bg-primary-transparent p-2 d-flex align-items-center flex-wrap row-gap-2 mb-4">
                <i className="ti ti-info-circle me-1" />
                <strong>Note :</strong> Prompting Student from the Present class
                to the Next Class will Create an enrollment of the student to
                the next Session
              </div>
              <div className="card">
                <div className="card-header border-0 pb-0">
                  <div className="bg-light-gray p-3 rounded">
                    <h4>Promotion</h4>
                    <p>Select a Class to Promote next session and new class</p>
                  </div>
                </div>
                <div className="card-body">
                  <form>
                    <div className="d-md-flex align-items-center justify-content-between">
                      <div className="card flex-fill w-100">
                        <div className="card-body">
                          <div className="mb-3">
                            <label className="form-label">
                              Current Session{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <div className="form-control-plaintext p-0">
                              2024 - 2025
                            </div>
                          </div>
                          <div>
                            <label className="form-label mb-2">
                              Promotion from Class
                              <span className="text-danger"> *</span>
                            </label>
                            <div className="d-block d-md-flex">
                              <div className=" flex-fill me-md-3 me-0 mb-0">
                                <label className="form-label">Class</label>
                                <CommonSelect
                                  className="select"
                                  options={classOptions}
                                  value={fromClassData.class}
                                  onChange={(opt: any) =>
                                    handleSelectChnage(
                                      "class",
                                      opt ? opt.value : null
                                    )
                                  }
                                />
                              </div>
                              <div className=" flex-fill mb-0">
                                <label className="form-label">Section</label>
                                <CommonSelect
                                  className="select"
                                  options={sectionOptions}
                                  value={fromClassData.section}
                                  onChange={(opt: any) =>
                                    handleSelectChnage(
                                      "section",
                                      opt ? opt.value : null
                                    )
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Link
                        to="#"
                        className="badge bg-primary badge-xl exchange-link text-white d-flex align-items-center justify-content-center mx-md-4 mx-auto my-md-0 my-4 flex-shrink-0"
                      >
                        <span>
                          <i className="ti ti-arrows-exchange fs-16" />
                        </span>
                      </Link>
                      <div className="card flex-fill w-100">
                        <div className="card-body">
                          <div className="mb-3">
                            <label className="form-label">
                              Promote to Session{" "}
                              <span className="text-danger"> *</span>
                            </label>
                            <CommonSelect
                              className="select"
                              options={academicYear}
                              value={toClassData.acedmicyear}
                              onChange={(opt: any) =>
                                handleSelectChnage2(
                                  "acedmicyear",
                                  opt ? opt.value : ""
                                )
                              }
                            />
                          </div>
                          <div>
                            <label className="form-label mb-2">
                              Promotion from Class
                              <span className="text-danger"> *</span>
                            </label>
                            <div className="d-block d-md-flex">
                              <div className="flex-fill me-md-3 me-0 mb-0">
                                <label className="form-label">Class</label>
                                <CommonSelect
                                  className="select"
                                  options={classOptions}
                                  value={toClassData.class}
                                  onChange={(opt: any) =>
                                    handleSelectChnage2(
                                      "class",
                                      opt ? opt.value : null
                                    )
                                  }
                                />
                              </div>
                              <div className=" flex-fill ">
                                <label className="form-label">Section</label>
                                <CommonSelect
                                  className="select"
                                  options={sectionOptions2}
                                  value={toClassData.section}
                                  onChange={(opt: any) =>
                                    handleSelectChnage2(
                                      "section",
                                      opt ? opt.value : null
                                    )
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12">
                      {!permission?.can_edit ? (
                        <div className="manage-promote-btn d-flex justify-content-center flex-wrap row-gap-2">
                          <button
                            type="reset"
                            className="btn btn-light reset-promote me-3"
                            onClick={() => {
                              setIsPromotion(false);
                              setStudents([]);
                              setSelectedStudents([]);
                              setFromClassData({
                                class: null,
                                section: null,
                              });
                              setToClassData({
                                class: null,
                                section: null,
                                acedmicyear: "",
                              });
                            }}
                          >
                            Reset Promotion
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary promote-students-btn"
                            onClick={() => handleManagePromotion()}
                          >
                            {loadingStudents
                              ? "Managing..."
                              : "Manage Promotion"}
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </form>
                </div>
              </div>

              <div
                className={`promote-card-main ${
                  isPromotion && "promote-card-main-show"
                }`}
              >
                <div className="card">
                  <div className="card-header border-0 pb-0">
                    <div className="bg-light-gray p-3 rounded">
                      <h4>Map Class Sections</h4>
                      <p>Select section mapping of old class to new class</p>
                    </div>
                  </div>
                  <div className="card-body pb-2">
                    <form>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="card w-100">
                          <div className="card-body">
                            <div className="mb-3">
                              <label className="form-label">
                                From Class<span className="text-danger">*</span>
                              </label>
                              <div className="form-control-plaintext p-0">
                                {
                                  classOptions.filter(
                                    (item: any) =>
                                      fromClassData.class == item.value
                                  )[0]?.label
                                }
                              </div>
                            </div>
                            <div className="mb-0">
                              <label className="form-label d-block mb-3">
                                Promotion from Section
                                <span className="text-danger"> *</span>
                              </label>

                              <div className="form-control-plaintext p-0">
                                {
                                  sectionOptions.filter(
                                    (item: any) =>
                                      fromClassData.section == item.value
                                  )[0]?.label
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                        <Link
                          to="#"
                          className="badge bg-primary badge-xl exchange-link text-white d-flex align-items-center justify-content-center mx-md-4 mx-auto my-md-0 my-4 flex-shrink-0"
                        >
                          <span>
                            <i className="ti ti-arrows-exchange fs-16" />
                          </span>
                        </Link>
                        <div className="card w-100">
                          <div className="card-body">
                            <div className="mb-3">
                              <label className="form-label">
                                To Class <span className="text-danger"> *</span>
                              </label>
                              <div className="form-control-plaintext p-0">
                                {
                                  classOptions.filter(
                                    (item: any) =>
                                      toClassData.class == item.value
                                  )[0]?.label
                                }
                              </div>
                            </div>
                            <div>
                              <label className="form-label mb-2">
                                Assign to Section
                                <span className="text-danger"> *</span>
                              </label>
                              <div className="form-control-plaintext p-0">
                                {
                                  sectionOptions2.filter(
                                    (item: any) =>
                                      toClassData.section == item.value
                                  )[0]?.label
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                {/* Students List */}
                <div className="card">
                  <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                    <h4 className="mb-3">Students List</h4>
                    {/* <div className="d-flex align-items-center flex-wrap">
                      <div className="input-icon-start mb-3 me-2 position-relative">

                        <PredefinedDateRanges />
                      </div>
                      <div className="dropdown mb-3">
                        <Link
                          to="#"
                          className="btn btn-outline-light bg-white dropdown-toggle"
                          data-bs-toggle="dropdown"
                        >
                          <i className="ti ti-sort-ascending-2 me-2" />
                          Sort by A-Z{" "}
                        </Link>
                        <ul className="dropdown-menu p-3">
                          <li>
                            <Link
                              to="#"
                              className="dropdown-item rounded-1"
                            >
                              Ascending
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="#"
                              className="dropdown-item rounded-1"
                            >
                              Descending
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="#"
                              className="dropdown-item rounded-1"
                            >
                              Recently Viewed
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="#"
                              className="dropdown-item rounded-1"
                            >
                              Recently Added
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div> */}
                  </div>
                  <div className="card-body p-0 py-3">
                    {/* Student List */}
                    {loadingStudents ? (
                      <Spinner />
                    ) : (
                      <Table
                        dataSource={tableData}
                        columns={columns}
                        Selection={true}
                        onSelectionChange={(selectedRows: any[]) =>
                          onTableSelectionChange(selectedRows)
                        }
                      />
                    )}
                    {/* /Student List */}
                  </div>
                </div>
                {/* /Students List */}
                <div className="promoted-year text-center">
                  <p>
                    Selected Students will be prormoted to 2025 - 2026 Academic
                    Session
                  </p>
                  <Link
                    to="#"
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#student_promote"
                  >
                    Promote Students
                  </Link>
                </div>
                <div className="toast-container success-msg-toast position-fixed">
                  <div
                    id="topright-Toast"
                    className="toast"
                    role="alert"
                    aria-live="assertive"
                    aria-atomic="true"
                  >
                    <div className="toast-header">
                      <p className="me-auto">
                        <span>
                          <i className="ti ti-square-check-filled text-success" />
                        </span>
                        Successfully Promoted
                      </p>
                      <Link
                        to="#"
                        className="toast-close"
                        data-bs-dismiss="toast"
                        aria-label="Close"
                      >
                        <span>
                          <i className="ti ti-x" />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="student_promote">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center">
              <h4>Confirm Promotion</h4>
              <p>
                Are you Sure, want to promote all {selectedStudents.length}{" "}
                selected students to the next Academic Session
              </p>
              <div className="d-flex justify-content-center">
                <Link
                  to="#"
                  className="btn btn-light me-3"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </Link>
                <Link
                  to="#"
                  className="btn btn-danger"
                  id="toprightToastBtn"
                  data-bs-dismiss="modal"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePromoteStudents();
                  }}
                >
                  Promote
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TStudentPromotion;
