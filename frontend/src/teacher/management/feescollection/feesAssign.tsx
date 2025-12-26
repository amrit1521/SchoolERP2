import { useEffect, useRef, useState } from "react";
// import { all_routes } from "../../../router/all_routes";
import { Link } from "react-router-dom";
import PredefinedDateRanges from "../../../core/common/datePicker";
import CommonSelect from "../../../core/common/commonSelect";
import {
  allClass,
  // allSection,
  sections,
} from "../../../core/common/selectoption/selectoption";
import type { TableData } from "../../../core/data/interface";
import Table from "../../../core/common/dataTable/index";
import AssignModal from "./assignModal";
// import { assignFeesData } from "../../../core/data/json/assignFeesData";
import TooltipOption from "../../../core/common/tooltipOption";
import { getAllRolePermissions } from "../../../service/api";
import { toast } from "react-toastify";
import { teacher_routes } from "../../../router/teacher_routes";
import { getAllFeesAssignDetailsForSpecClass } from "../../../service/teacherDashboardApi";
// import FeesGroup from "./feesGroup";
//feesAssignToStudents
const TFeesAssign = () => {
  // const routes = all_routes;
  const [editModal, setEditModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  // const data = assignFeesData;
  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };

  interface AssignDetails {
    feesGroup: string;
    feesType: string;
    class: string;
    section: string;
    gender: string;
    category: string;
    amount: string;
    studentName: string;
  }

  const [feesAssignDetails, setFeesAssignDetails] = useState<AssignDetails[]>([
    {
      feesGroup: "",
      feesType: "",
      class: "",
      section: "",
      gender: "",
      category: "",
      amount: "",
      studentName: "",
    },
  ]);
  const [loading, setLoading] = useState<boolean>(false);

  const tokens = localStorage.getItem("token");
  const roleId = tokens ? JSON.parse(tokens)?.role : null;
  const userId = tokens ? JSON.parse(tokens)?.id : null;
  type Permission = {
    can_create?: boolean;
    can_delete?: boolean;
    can_edit?: boolean;
    can_view?: boolean;
  } | null;
  const [permission, setPermission] = useState<Permission>(null);

  const fetchPermission = async (roleId: number) => {
    if (roleId) {
      const { data } = await getAllRolePermissions(roleId);
      if (data.success) {
        const currentPermission = data.result
          .filter((perm: any) => perm?.module_name === "AssignFees")
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

  const fetchAllFeeAssignDet = async (userId: number) => {
    setLoading(true);
    try {
      const { data } = await getAllFeesAssignDetailsForSpecClass(userId);

      setFeesAssignDetails(data.assignDetails);
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermission(roleId);
    fetchAllFeeAssignDet(userId);
  }, []);

  const tableData = feesAssignDetails.map((item, index) => ({
    key: index + 1,
    sNo: index + 1,
    feesGroup: item.feesGroup,
    feesType: item.feesType,
    class: item.class,
    section: item.section,
    amount: item.amount,
    gender: item.gender,
    category: item.category,
    studentName: item.studentName,
  }));

  const columns: any[] = [
    {
      title: "SNo",
      dataIndex: "sNo",
      sorter: (a: TableData, b: TableData) => a.sNo.length - b.sNo.length,
    },
    {
      title: "Name",
      dataIndex: "studentName",
      sorter: (a: TableData, b: TableData) =>
        a.studentName.length - b.studentName.length,
    },
    {
      title: "Fees Group",
      dataIndex: "feesGroup",
      sorter: (a: TableData, b: TableData) =>
        a.feesGroup.length - b.feesGroup.length,
    },
    {
      title: "Fees Type",
      dataIndex: "feesType",
      sorter: (a: TableData, b: TableData) =>
        a.feesType.length - b.feesType.length,
    },
    {
      title: "Class",
      dataIndex: "class",
      sorter: (a: TableData, b: TableData) => a.class.length - b.class.length,
    },
    {
      title: "Section",
      dataIndex: "section",
      sorter: (a: TableData, b: TableData) => a.amount.length - b.amount.length,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      sorter: (a: TableData, b: TableData) => a.amount.length - b.amount.length,
    },
    {
      title: "Gender",
      dataIndex: "gender",
      sorter: (a: TableData, b: TableData) => a.gender.length - b.gender.length,
    },
    // {
    //   title: "Category",
    //   dataIndex: "category",
    //   sorter: (a: TableData, b: TableData) =>
    //     a.category.length - b.category.length,
    // },
  ];

  if (permission?.can_edit || permission?.can_delete) {
    columns.push({
      title: "Action",
      dataIndex: "action",
      render: () => (
        <>
          <div className="d-flex align-items-center">
            <div className="dropdown">
              <Link
                to="#"
                className="btn btn-white btn-icon btn-sm d-flex align-items-center justify-content-center rounded-circle p-0"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="ti ti-dots-vertical fs-14" />
              </Link>
              <ul className="dropdown-menu dropdown-menu-right p-3">
                {permission?.can_edit ? (
                  <li>
                    <Link
                      className="dropdown-item rounded-1"
                      to="#"
                      onClick={() => setEditModal(true)}
                    >
                      <i className="ti ti-edit-circle me-2" />
                      Edit
                    </Link>
                  </li>
                ) : null}
                {permission?.can_delete ? (
                  <li>
                    <Link
                      className="dropdown-item rounded-1"
                      to="#"
                      data-bs-toggle="modal"
                      data-bs-target="#delete-modal"
                    >
                      <i className="ti ti-trash-x me-2" />
                      Delete
                    </Link>
                  </li>
                ) : null}
              </ul>
            </div>
          </div>
        </>
      ),
    });
  }

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Fees Assign</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={teacher_routes.teacherDashboard}>
                      Teacher Dashboard
                    </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Fees Assigned</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Assign Fees
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <TooltipOption />
              {permission?.can_create ? (
                <div className="mb-2">
                  <Link
                    to="#"
                    className="btn btn-primary"
                    onClick={() => setAddModal(true)}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />
                    Assign New
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
          {/* /Page Header */}
          {/* Students List */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Fees Assign</h4>
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
                                options={allClass}
                                // defaultValue={allSection[0]}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Section</label>
                              <CommonSelect
                                className="select"
                                options={sections}
                                // defaultValue={gender[0]}
                              />
                            </div>
                          </div>

                          {/* <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Student Category</label>
                              <CommonSelect
                                className="select"
                                options={cast}
                                // defaultValue={cast[1]}
                              />
                            </div>
                          </div> */}
                        </div>
                      </div>
                      <div className="p-3 d-flex align-items-center justify-content-end">
                        <Link to="#" className="btn btn-light me-3">
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
                    Sort by A-Z{" "}
                  </Link>
                  <ul className="dropdown-menu p-3">
                    <li>
                      <Link to="#" className="dropdown-item rounded-1">
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
              {loading ? (
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ height: "200px" }}
                >
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <>
                  {" "}
                  <Table
                    dataSource={tableData}
                    columns={columns}
                    Selection={true}
                  />
                </>
              )}
              {/* /Student List */}
            </div>
          </div>
          {/* /Students List */}
        </div>
      </div>
      {/* /Page Wrapper */}
      <AssignModal
        setEditModal={setEditModal}
        editModal={editModal}
        setAddModal={setAddModal}
        addModal={addModal}
      />
    </>
  );
};

export default TFeesAssign;
