import { Link, useParams } from "react-router-dom";
// import ImageWithBasePath from '../../../../core/common/imageWithBasePath'
import StudentModals from "../studentModals";
import StudentSidebar from "./studentSidebar";
import StudentBreadcrumb from "./studentBreadcrumb";
import {
  Documenturl,
  getAllRolePermissions,
  Imageurl,
  specificStudentData1,
} from "../../../../service/api";
import { useEffect, useState } from "react";
import { Skeleton } from "antd";
// import { all_routes } from "../../../../admin/router/all_routes";
import { teacher_routes } from "../../../../admin/router/teacher_routes";

const TStudentDetails = () => {
  interface Parent {
    id: number;
    name: string;
    email: string;
    phone_num: string;
    relation: string;
    img_src?: string;
    guardian_is?: string;
  }
  const { rollnum } = useParams<{ rollnum: string }>();
  const tokens = localStorage.getItem("token");
  const roleId = tokens ? JSON.parse(tokens)?.role : null;
  const [permission, setPermission] = useState<any>(null);
  const [student, setStudent] = useState<any>({});
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchStudent = async () => {
      setToken(localStorage.getItem("token"));
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      try {
        const res = await specificStudentData1(Number(rollnum));
        // console.log(res)
        setStudent(res.data.student);
        setParents(res.data.parents);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [rollnum]);

  useEffect(() => {
    if (roleId) {
      fetchPermission(roleId);
    }
  }, [roleId]);

  // if (loading) {
  //   return <p className='spinner' role='status'>loading...</p>
  // }
  // console.log(id)
  // const routes = all_routes;
  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            {/* Page Header */}
            {token && (
              <StudentBreadcrumb
                token={token}
                rollnum={Number(rollnum)}
                can_edit={permission?.can_edit}
              />
            )}
            {/* /Page Header */}
          </div>
          <div className="row">
            {/* Student Information */}
            <StudentSidebar
              student={student}
              loading={loading}
              can_create={permission?.can_create}
            />
            {/* /Student Information */}
            <div className="col-xxl-9 col-xl-8">
              <div className="row">
                <div className="col-md-12">
                  {/* List */}
                  <ul className="nav nav-tabs nav-tabs-bottom mb-4">
                    <li>
                      <Link
                        to={`${teacher_routes.studentDetail}/${rollnum}`}
                        className="nav-link active"
                      >
                        <i className="ti ti-school me-2" />
                        Student Details
                      </Link>
                    </li>
                  </ul>
                  {/* /List */}
                  {/* Parents Information */}

                  <div className="card">
                    <div className="card-header">
                      <h5>Parents Information</h5>
                    </div>
                    <div className="card-body">
                      {loading
                        ? // 🔹 Skeleton Loader
                          Array.from({ length: 3 }).map((_, index) => (
                            <div
                              key={index}
                              className="border rounded p-3 pb-0 mb-3"
                            >
                              <div className="row">
                                {/* Avatar + Name + Relation */}
                                <div className="col-sm-6 col-lg-4">
                                  <div className="d-flex align-items-center mb-3">
                                    <span className="avatar avatar-lg flex-shrink-0">
                                      <Skeleton.Avatar
                                        active
                                        size="large"
                                        shape="circle"
                                      />
                                    </span>
                                    <div className="ms-2 overflow-hidden">
                                      <h6 className="text-truncate">
                                        <Skeleton.Input
                                          active
                                          size="small"
                                          style={{ width: 120 }}
                                        />
                                      </h6>
                                      <span className="text-primary">
                                        <Skeleton.Input
                                          active
                                          size="small"
                                          style={{ width: 80 }}
                                        />
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Phone */}
                                <div className="col-sm-6 col-lg-4">
                                  <div className="mb-3">
                                    <p className="text-dark fw-medium mb-1">
                                      Phone
                                    </p>
                                    <Skeleton.Input
                                      active
                                      size="small"
                                      style={{ width: 100 }}
                                    />
                                  </div>
                                </div>

                                {/* Email + Button */}
                                <div className="col-sm-6 col-lg-4">
                                  <div className="d-flex align-items-center justify-content-between">
                                    <div className="mb-3 overflow-hidden me-3">
                                      <p className="text-dark fw-medium mb-1">
                                        Email
                                      </p>
                                      <Skeleton.Input
                                        active
                                        size="small"
                                        style={{ width: 150 }}
                                      />
                                    </div>
                                    <Skeleton.Button
                                      active
                                      size="small"
                                      shape="circle"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        : // 🔹 Actual Data
                          parents &&
                          parents.map((parent) => (
                            <div
                              key={parent.id}
                              className="border rounded p-3 pb-0 mb-3"
                            >
                              <div className="row">
                                <div className="col-sm-6 col-lg-4">
                                  <div className="d-flex align-items-center mb-3">
                                    <span className="avatar avatar-lg flex-shrink-0">
                                      <img
                                        src={`${Imageurl}/${parent.img_src}`}
                                        className="img-fluid rounded"
                                        alt="img"
                                      />
                                    </span>
                                    <div className="ms-2 overflow-hidden">
                                      <h6 className="text-truncate">
                                        {parent.name}
                                      </h6>
                                      <p className="text-primary">
                                        {parent.relation}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-sm-6 col-lg-4">
                                  <div className="mb-3">
                                    <p className="text-dark fw-medium mb-1">
                                      Phone
                                    </p>
                                    <p>{parent.phone_num}</p>
                                  </div>
                                </div>
                                <div className="col-sm-6 col-lg-4">
                                  <div className="d-flex align-items-center justify-content-between">
                                    <div className="mb-3 overflow-hidden me-3">
                                      <p className="text-dark fw-medium mb-1">
                                        Email
                                      </p>
                                      <p className="text-truncate">
                                        {parent.email}
                                      </p>
                                    </div>
                                    <Link
                                      to="#"
                                      data-bs-toggle="tooltip"
                                      data-bs-placement="top"
                                      aria-label="Print"
                                      data-bs-original-title="Reset Password"
                                      className="btn btn-dark btn-icon btn-sm mb-3"
                                    >
                                      <i className="ti ti-lock-x" />
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                    </div>
                  </div>
                  {/* /Parents Information */}
                </div>
                {/* Documents */}
                <div className="col-xxl-6 d-flex">
                  <div className="card flex-fill">
                    <div className="card-header">
                      <h5>Documents</h5>
                    </div>
                    <div className="card-body">
                      {loading ? (
                        // 🔹 Skeleton UI while loading
                        Array.from({ length: 2 }).map((_, index) => (
                          <div
                            key={index}
                            className="bg-light-300 border rounded d-flex align-items-center justify-content-between mb-3 p-2"
                          >
                            <div className="d-flex align-items-center overflow-hidden">
                              <span className="avatar avatar-md bg-white rounded flex-shrink-0 text-default">
                                <Skeleton.Avatar
                                  active
                                  size="large"
                                  shape="square"
                                />
                              </span>
                              <div className="ms-2">
                                <span className="fw-medium text-dark mb-0">
                                  <Skeleton.Input
                                    active
                                    size="small"
                                    style={{ width: 180 }}
                                  />
                                </span>
                              </div>
                            </div>
                            <Skeleton.Button
                              active
                              size="small"
                              shape="circle"
                            />
                          </div>
                        ))
                      ) : (
                        <>
                          <div className="bg-light-300 border rounded d-flex align-items-center justify-content-between mb-3 p-2">
                            <div className="d-flex align-items-center overflow-hidden">
                              <span className="avatar avatar-md bg-white rounded flex-shrink-0 text-default">
                                <i className="ti ti-pdf fs-15" />
                              </span>
                              <div className="ms-2">
                                <p className="text-truncate fw-medium text-dark">
                                  BirthCertificate.pdf
                                </p>
                              </div>
                            </div>
                            <a
                              href={`${Documenturl}/${student.medicalcert}`}
                              download={student.medicalcert}
                              target="_blank"
                              className="btn btn-dark btn-icon btn-sm"
                            >
                              <i className="ti ti-download" />
                            </a>
                          </div>

                          <div className="bg-light-300 border rounded d-flex align-items-center justify-content-between p-2">
                            <div className="d-flex align-items-center overflow-hidden">
                              <span className="avatar avatar-md bg-white rounded flex-shrink-0 text-default">
                                <i className="ti ti-pdf fs-15" />
                              </span>
                              <div className="ms-2">
                                <p className="text-truncate fw-medium text-dark">
                                  Transfer Certificate.pdf
                                </p>
                              </div>
                            </div>
                            <a
                              href={`${Documenturl}/${student.transfercert}`}
                              download={student.transfercert}
                              target="_blank"
                              className="btn btn-dark btn-icon btn-sm"
                            >
                              <i className="ti ti-download" />
                            </a>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {/* /Documents */}
                {/* Address */}
                <div className="col-xxl-6 d-flex">
                  <div className="card flex-fill">
                    <div className="card-header">
                      <h5>Address</h5>
                    </div>
                    <div className="card-body">
                      {loading ? (
                        Array(2)
                          .fill(0)
                          .map((item) => (
                            <div className="d-flex align-items-center mb-3">
                              <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                                {/* <i className="ti ti-map-pin-up" /> */}
                                <Skeleton.Avatar active shape="square" />
                              </span>
                              <div>
                                <span className="text-dark fw-medium mb-1">
                                  {item ? "" : ""}
                                  <Skeleton.Input
                                    active
                                    size="small"
                                    style={{ width: 100 }}
                                  />
                                </span>
                                <span>
                                  {" "}
                                  <Skeleton.Input
                                    active
                                    size="small"
                                    style={{ width: 180 }}
                                  />
                                </span>
                              </div>
                            </div>
                          ))
                      ) : (
                        <>
                          <div className="d-flex align-items-center mb-3">
                            <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                              <i className="ti ti-map-pin-up" />
                            </span>
                            <div>
                              <p className="text-dark fw-medium mb-1">
                                Current Address
                              </p>
                              <p>{student.curr_address}</p>
                            </div>
                          </div>
                          <div className="d-flex align-items-center">
                            <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                              <i className="ti ti-map-pins" />
                            </span>
                            <div>
                              <p className="text-dark fw-medium mb-1">
                                Permanent Address
                              </p>
                              <p>{student.perm_address}</p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {/* /Address */}
                {/* Previous School Details */}
                <div className="col-xxl-12">
                  <div className="card">
                    <div className="card-header">
                      <h5>Previous School Details</h5>
                    </div>
                    <div className="card-body pb-1">
                      <div className="row">
                        {loading ? (
                          Array.from({ length: 2 }).map((item) => (
                            <div className="col-md-6">
                              <div className="mb-3">
                                <span className="text-dark fw-medium mb-1">
                                  {item ? "" : ""}
                                  <Skeleton.Input
                                    active
                                    style={{ width: 60 }}
                                  />
                                </span>
                                <span>
                                  {" "}
                                  <Skeleton.Input
                                    active
                                    style={{ width: 180 }}
                                  />
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <>
                            <div className="col-md-6">
                              <div className="mb-3">
                                <p className="text-dark fw-medium mb-1">
                                  Previous School Name
                                </p>
                                <p>{student.prev_school}</p>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="mb-3">
                                <p className="text-dark fw-medium mb-1">
                                  School Address
                                </p>
                                <p>{student.prev_school_address}</p>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Previous School Details */}
                {/* Bank Details */}
                <div className="col-xxl-6 d-flex">
                  <div className="card flex-fill">
                    <div className="card-header">
                      <h5>Bank Details</h5>
                    </div>
                    <div className="card-body pb-1">
                      <div className="row">
                        {loading ? (
                          Array(3)
                            .fill(0)
                            .map((item) => (
                              <div className="col-md-4">
                                <div className="mb-3">
                                  {item ? "" : ""}
                                  <span className="text-dark fw-medium mb-1">
                                    <Skeleton.Input
                                      active
                                      style={{ width: 60 }}
                                    />
                                  </span>
                                  <span>
                                    {" "}
                                    <Skeleton.Input
                                      active
                                      style={{ width: 100 }}
                                    />
                                  </span>
                                </div>
                              </div>
                            ))
                        ) : (
                          <>
                            <div className="col-md-4">
                              <div className="mb-3">
                                <p className="text-dark fw-medium mb-1">
                                  Bank Name
                                </p>
                                <p>{student.bank_name}</p>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="mb-3">
                                <p className="text-dark fw-medium mb-1">
                                  Branch
                                </p>
                                <p>{student.branch}</p>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="mb-3">
                                <p className="text-dark fw-medium mb-1">IFSC</p>
                                <p>{student.ifsc_num}</p>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Bank Details */}
                {/* Medical History */}
                <div className="col-xxl-6 d-flex">
                  <div className="card flex-fill">
                    <div className="card-header">
                      <h5>Medical History</h5>
                    </div>
                    <div className="card-body pb-1">
                      <div className="row">
                        {loading ? (
                          Array.from({ length: 2 }).map((item) => (
                            <div className="col-md-6">
                              <div className="mb-3">
                                <span className="fw-medium mb-1">
                                  {item ? "" : ""}
                                  <Skeleton.Input
                                    active
                                    style={{ width: 60 }}
                                  />
                                </span>
                                <span className="  ">
                                  <Skeleton.Input
                                    active
                                    style={{ width: 100 }}
                                  />
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <>
                            <div className="col-md-6">
                              <div className="mb-3">
                                <p className="text-dark fw-medium mb-1">
                                  Known Allergies
                                </p>
                                {student.allergies && (
                                  <span className="badge bg-light text-dark">
                                    {JSON.parse(student.allergies).join(",")}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="mb-3">
                                <p className="text-dark fw-medium mb-1">
                                  Medications
                                </p>
                                {student.medications && (
                                  <span className="badge bg-light text-dark">
                                    {JSON.parse(student.medications).join(",")}
                                  </span>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Medical History */}
                {/* Other Info */}
                <div className="col-xxl-12">
                  <div className="card">
                    <div className="card-header">
                      <h5>Other Info</h5>
                    </div>
                    <div className="card-body">
                      {loading ? (
                        <Skeleton.Input active style={{ width: 100 }} />
                      ) : (
                        <p>{student.other_det}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* /Other Info */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      {student.rollnum && (
        <StudentModals onAdd={() => {}} rollnum={Number(student.rollnum)} />
      )}
    </>
  );
};

export default TStudentDetails;
