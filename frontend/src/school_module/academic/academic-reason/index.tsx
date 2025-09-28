import { useEffect, useRef, useState } from "react";
// import { AcademiReason } from "../../../core/data/json/academic_reason";
import Table from "../../../core/common/dataTable/index";
import { Link } from "react-router-dom";

import {
  acadamicReason,
  Reason,
} from "../../../core/common/selectoption/selectoption";
import type { TableData } from "../../../core/data/interface";
import CommonSelect from "../../../core/common/commonSelect";
import PredefinedDateRanges from "../../../core/common/datePicker";
import { all_routes } from "../../router/all_routes";
import TooltipOption from "../../../core/common/tooltipOption";
import { addAcademicReason, allAcademicReason, deleteReason } from "../../../service/api";
import { toast } from "react-toastify";
import { handleModalPopUp } from "../../../handlePopUpmodal";

const AcademicReason = () => {
  const routes = all_routes;

  // const data = AcademiReason;
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };

  const [allReason, setAllReason] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)

  const fetchAllReason = async () => {
    setLoading(true)
    try {
      await new Promise((res) => setTimeout(res, 500))
      const { data } = await allAcademicReason()
      if (data.success) {
        setAllReason(data.data)
      }

    } catch (error: any) {

      console.log(error)
      toast.error(error.response.data.message)

    }finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllReason()
  }, [])

  const formatDate = (dateStr:string)=>{
     const date  = new Date(dateStr)
     return date.toLocaleDateString("en-gb" , {
      day:'2-digit',
      month:'short',
      year:'numeric'
     })
  }

  const tableData = allReason.map((item: any) => (
    {
      key: item.id,
      id: item.id,
      role: item.role,
      reason: item.reasonName,
      createdDate: formatDate(item.created_at)
    }
  ))

  // reason form


  interface ReasonForm {
    reasonName: string;
    role: string;
    status: string; 
  }

  // 2. State
  const [reasonForm, setReasonForm] = useState<ReasonForm>({
    reasonName: "",
    role: "",
    status: "0",
  });

  // 3. Handler functions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setReasonForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    }));
  };

  const handleSelectChange = (option: any) => {
    setReasonForm((prev) => ({
      ...prev,
      role: option.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await addAcademicReason(reasonForm)
      if (data.success) {
        toast.success(data.message)
        fetchAllReason()
        handleModalPopUp(`add_reason`)
        setReasonForm({
          reasonName: "",
          role: "",
          status: "0",
        })
      }
    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  };

// delete 
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const handleDelete = async (e:React.FormEvent) => {
    e.preventDefault()
    try {
    
      if (deleteId) {
        const { data } = await deleteReason(deleteId)
        console.log(data)
        if (data.success) {
          toast.success(data.message)
          setDeleteId(null)
          handleModalPopUp('delete-modal')
          fetchAllReason()
        }
      }

    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }


  const handleDeleteCancel = ()=>{
    setDeleteId(null)
  }

  const columns = [
    {
      title: "Role",
      dataIndex: "role",
      sorter: (a: TableData, b: TableData) => a.role.length - b.role.length,
    },
    {
      title: "Reason",
      dataIndex: "reason",
      sorter: (a: TableData, b: TableData) => a.reason.length - b.reason.length,
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      sorter: (a: TableData, b: TableData) =>
        a.createdDate.length - b.createdDate.length,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text: any, record: any) => (
        <>
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
              <li>
                <Link
                  className="dropdown-item rounded-1"
                  to="#"
                  data-bs-toggle="modal"
                  data-bs-target="#edit_reason"
                >
                  <i className="ti ti-edit-circle me-2" />
                  Edit {text ? "" : ""}
                </Link>
              </li>
              <li>
                <button
                onClick={()=>setDeleteId(record.id)}
                  className="dropdown-item rounded-1"
                  data-bs-toggle="modal"
                  data-bs-target="#delete-modal"
                >
                  <i className="ti ti-trash-x me-2" />
                  Delete
                </button>
              </li>
            </ul>
          </div>
        </>
      ),
    },
  ];


  return (
    <div>
      <>
        {/* Page Wrapper */}
        <div className="page-wrapper">
          <div className="content">
            {/* Page Header */}
            <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
              <div className="my-auto mb-2">
                <h3 className="page-title mb-1">Reason</h3>
                <nav>
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <Link to={routes.adminDashboard}>Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to="#">Academic </Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Reason
                    </li>
                  </ol>
                </nav>
              </div>
              <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
                <TooltipOption />
                <div className="mb-2">
                  <Link
                    to="#"
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#add_reason"
                  >
                    <i className="ti ti-square-rounded-plus-filled me-2" />
                    Add Reasons
                  </Link>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            {/* Guardians List */}
            <div className="card">
              <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                <h4 className="mb-3">Academic Reasons</h4>
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
                        <div className="p-3 border-bottom pb-0">
                          <div className="row">
                            <div className="col-md-12">
                              <div className="mb-3">
                                <label className="form-label">Role</label>
                                <CommonSelect
                                  className="select"
                                  options={Reason}
                                  defaultValue={Reason[0]}
                                />
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="mb-3">
                                <label className="form-label">Reason</label>
                                <CommonSelect
                                  className="select"
                                  options={acadamicReason}
                                  defaultValue={acadamicReason[0]}
                                />
                              </div>
                            </div>
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
                {/* Guardians List */}
                {
                  loading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (<Table columns={columns} dataSource={tableData} Selection={true} />)
                }
                {/* /Guardians List */}
              </div>
            </div>
          </div>
        </div>
        {/* /Page Wrapper */}
      </>
      <>
        {/* Add Reason */}

        <div className="modal fade" id="add_reason">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Reason</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>


              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      {/* Name */}
                      <div className="mb-3">
                        <label className="form-label">Reason Name</label>
                        <input
                          type="text"
                          name="reasonName"
                          className="form-control"
                          value={reasonForm.reasonName}
                          onChange={handleInputChange}
                        />
                      </div>

                      {/* Role */}
                      <div className="mb-3">
                        <label className="form-label">Role</label>
                        <CommonSelect
                          className="select"
                          options={Reason}
                          // value={Reason.find((r: any) => r.value === reasonForm.role) || null}
                          onChange={handleSelectChange}
                        />
                      </div>

                      {/* Status */}
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="status-title">
                          <h5>Status</h5>
                          <p>Change the Status by toggle</p>
                        </div>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="switch-sm"
                            name="status"
                            checked={reasonForm.status === "1"}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <Link
                    to="#"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <button type="submit" className="btn btn-primary">
                    Add Reason
                  </button>
                </div>
              </form>



            </div>
          </div>
        </div>
        {/* Add Reason */}
        {/* Edit Reason */}
        <div className="modal fade" id="edit_reason">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Reason</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>


              <form >
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Name"
                          defaultValue="Text"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Role</label>
                        <CommonSelect
                          className="select"
                          options={Reason}
                          defaultValue={Reason[1]}
                        />
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="status-title">
                          <h5>Status</h5>
                          <p>Change the Status by toggle </p>
                        </div>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="switch-sm2"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <Link
                    to="#"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <Link
                    to="#"
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                  >
                    Save Changes
                  </Link>
                </div>
              </form>



            </div>
          </div>
        </div>
        {/* Edit Reason */}
        {/* Delete Modal */}
        <div className="modal fade" id="delete-modal">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form >
                <div className="modal-body text-center">
                  <span className="delete-icon">
                    <i className="ti ti-trash-x" />
                  </span>
                  <h4>Confirm Deletion</h4>
                  <p>
                    You want to delete all the marked items, this cant be undone
                    once you delete.
                  </p>
                  <div className="d-flex justify-content-center">
                    <button
                       onClick={handleDeleteCancel}
                      className="btn btn-light me-3"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      className="btn btn-danger"
                    >
                      Yes, Delete
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /Delete Modal */}
      </>
    </div>
  );
};

export default AcademicReason;
