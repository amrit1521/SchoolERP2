import React, { useEffect, useRef, useState } from "react";
import { all_routes } from "../../../../router/all_routes";
// import { approveRequest } from "../../../../core/data/json/approve_request";
import { Link } from "react-router-dom";
import type { TableData } from "../../../../core/data/interface";
import Table from "../../../../core/common/dataTable/index";
import PredefinedDateRanges from "../../../../core/common/datePicker";
import CommonSelect from "../../../../core/common/commonSelect";
import { activeList, leaveType, MonthDate, Role } from "../../../../core/common/selectoption/selectoption";
import TooltipOption from "../../../../core/common/tooltipOption";
import { deleteLeave, getAllLeaveData, getSpeLeaveData, Imageurl, updateLeaveStatus } from "../../../../service/api";
import dayjs from 'dayjs'
import { Spinner } from "../../../../spinner";
import { handleModalPopUp } from "../../../../handlePopUpmodal";
import { toast } from "react-toastify";

const ApproveRequest = () => {
  const routes = all_routes;
  // const data = approveRequest;
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };


  const [leaveData, setLeaveData] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const [speLeaveData, setSpeLeaveData] = useState<any>({})
  const [updateId, setUpdateId] = useState<number | null>(null)
  const [status, setStatus] = useState<number>(0)
  const [note, setNote] = useState<string>("")

  const fetchLeaveData = async () => {
    setLoading(true)
    try {

      const { data } = await getAllLeaveData()
      if (data.success) {
        setLeaveData(data.data)
      }

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeaveData()
  }, [])

  const fetchSpeLeave = async (id: number) => {
    if (!id) return
    try {

      const { data } = await getSpeLeaveData(id)
      if (data.success) {
        setSpeLeaveData(data.data)
        setStatus(Number(data.data.status));
        setNote(data.data.note || "");
        setUpdateId(Number(id))
      }

    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }

  const handleSubmitStatus = async () => {
    if (!speLeaveData) return;
    if (![0, 1, 2].includes(status) || !updateId) {
      toast.warn('Leave staus and Id  required !')
      return
    }
    if (note && note.length < 10) {
      toast.warn('Note is required and should be 10 Chracters')
      return
    }
    try {
      const { data } = await updateLeaveStatus({ note, status }, updateId)

      if (data.success) {
        toast.success(data.message)
        setStatus(0)
        setNote("")
        setSpeLeaveData({})
        setUpdateId(null)
        handleModalPopUp('leave_request')
        fetchLeaveData();
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Error updating leave");
    }
  }

  const handleCancelSatusUpdate = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setStatus(0)
    setNote("")
    setSpeLeaveData({})
    setUpdateId(null)
  }





  const tableData = leaveData.map((l: any) => ({
    key: l.id,
    id: l.id,
    submittedBy: l.user_name,
    leaveType: l.leave_type,
    role: l.role_name || 'Staff',
    leaveDate: `${dayjs(l.from_date).format('DD MMM YYYY')} - ${dayjs(l.to_date).format('DD MMM YYYY')}`,
    noofDays: l.no_of_days,
    appliedOn: dayjs(l.applied_on).format('DD MMM YYYY'),
    status: l.status,
    img: l.img,
  }))

  const columns = [
    {
      title: "Submitted By",
      dataIndex: "submittedBy",
      render: (text: string, record: any) => (
        <div className="d-flex align-items-center">
          <Link to={'#'} className="avatar avatar-md">
            <img
              src={`${Imageurl}/${record.img}`}
              className="img-fluid rounded-circle"
              alt="img"
            />
          </Link>
          <div className="ms-2">
            <p className="text-dark mb-0 text-capitalize">
              <Link to={`#`}>{text}</Link>
            </p>
          </div>
        </div>
      ),
      sorter: (a: TableData, b: TableData) =>
        a.submittedBy.length - b.submittedBy.length,
    },
    {
      title: "Leave Type",
      dataIndex: "leaveType",
      sorter: (a: TableData, b: TableData) =>
        a.leaveType.length - b.leaveType.length,
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (text: string) => (
        <span className="text-capitalize">{text}</span>
      ),
      sorter: (a: TableData, b: TableData) => a.role.length - b.role.length,
    },
    {
      title: "Leave Date",
      dataIndex: "leaveDate",
      sorter: (a: TableData, b: TableData) =>
        a.leaveDate.length - b.leaveDate.length,
    },
    {
      title: "No of Days",
      dataIndex: "noofDays",
      sorter: (a: TableData, b: TableData) =>
        a.noofDays.length - b.noofDays.length,
    },
    {
      title: "Applied On",
      dataIndex: "appliedOn",
      sorter: (a: TableData, b: TableData) =>
        a.appliedOn.length - b.appliedOn.length,
    },
    // {
    //   title: "Authority",
    //   dataIndex: "authority",
    //   sorter: (a: TableData, b: TableData) =>
    //     a.authority.length - b.authority.length,
    // },

    {
      title: "Status",
      dataIndex: "status",
      render: (text: string) => (
        <>
          {text == "1" ? (
            <span className="badge badge-soft-success d-inline-flex align-items-center">
              <i className="ti ti-circle-filled fs-5 me-1"></i>
              Approved
            </span>
          ) : text == "0" ? (
            <span className="badge badge-soft-pending d-inline-flex align-items-center">
              <i className="ti ti-circle-filled fs-5 me-1"></i>
              Pending
            </span>
          ) : (
            <span className="badge badge-soft-danger d-inline-flex align-items-center">
              <i className="ti ti-circle-filled fs-5 me-1"></i>
              Disapproved
            </span>
          )}
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.status.length - b.status.length,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_: any, record: any) => (
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
                <button
                  className="dropdown-item rounded-1"
                  onClick={() => fetchSpeLeave(record.id)}
                  data-bs-toggle="modal"
                  data-bs-target="#leave_request"
                >
                  <i className="ti ti-menu me-2" />
                  Leave Request
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item rounded-1"
                  onClick={() => setDeleteId(record.id)}
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



  const [deleteId, setDeleteId] = useState<number | null>(null)
  const handleDelete = async (id: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    try {
      const { data } = await deleteLeave(id)
      if (data.success) {
        setDeleteId(null)
        toast.success(data.message)
        fetchLeaveData()
        handleModalPopUp('delete-modal')

      }

    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }

  const cancelDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setDeleteId(null)
  }
  return (
    <div>
      <>
        {/* Page Wrapper */}
        <div className="page-wrapper">
          <div className="content">
            {/* Page Header */}
            <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
              <div className="my-auto mb-2">
                <h3 className="page-title mb-1">Approved Leave Request</h3>
                <nav>
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <Link to={routes.adminDashboard}>Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to="#">HRM</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Approved Leave Request
                    </li>
                  </ol>
                </nav>
              </div>
              <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
                <TooltipOption />
              </div>
            </div>
            {/* Page Header*/}
            {/* Filter Section */}
            <div className="card">
              <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                <h4 className="mb-3">Approved Leave Request List</h4>
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
                      <form >
                        <div className="d-flex align-items-center border-bottom p-3">
                          <h4>Filter</h4>
                        </div>
                        <div className="p-3 border-bottom">
                          <div className="row">
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="form-label">Leave Type</label>

                                <CommonSelect
                                  className="select"
                                  options={leaveType}
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="form-label">Role</label>
                                <CommonSelect
                                  className="select"
                                  options={Role}
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="mb-0">
                                <label className="form-label">
                                  From - To Date
                                </label>
                                <CommonSelect
                                  className="select"
                                  options={MonthDate}
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="mb-0">
                                <label className="form-label">Status</label>
                                <CommonSelect
                                  className="select"
                                  options={activeList}
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
                        <Link
                          to="#"
                          className="dropdown-item rounded-1 active"
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
                </div>
              </div>
              <div className="card-body p-0 py-3">
                {/* Approve List */}
                {
                  loading ? (<Spinner />) : (<Table dataSource={tableData} columns={columns} Selection={false} />)
                }
                {/* /Approve List */}
              </div>
            </div>
          </div>
        </div>
        {/* /Page Wrapper */}
        {/* Leave Request */}
        <div className="modal fade" id="leave_request">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Leave Request</h4>
                <button type="button" className="btn-close custom-btn-close" data-bs-dismiss="modal" aria-label="Close">
                  <i className="ti ti-x" />
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSubmitStatus(); }}>
                <div className="modal-body">
                  <div className="student-leave-info">
                    <ul>
                      <li>
                        <span>Submitted By</span>
                        <h6>{speLeaveData ? speLeaveData.user_name : "—"}</h6>
                      </li>
                      <li>
                        <span>ID / Roll No</span>
                        <h6>{speLeaveData ? speLeaveData.user_id : "—"}</h6>
                      </li>
                      <li>
                        <span>Role</span>
                        <h6 className="text-capitalize">{speLeaveData ? speLeaveData.role_name : "—"}</h6>
                      </li>
                      <li>
                        <span>Leave Type</span>
                        <h6>{speLeaveData ? speLeaveData.leave_type : "—"}</h6>
                      </li>
                      <li>
                        <span>No of Days</span>
                        <h6>{speLeaveData ? speLeaveData.no_of_days : "—"}</h6>
                      </li>
                      <li>
                        <span>Applied On</span>
                        <h6>{speLeaveData ? dayjs(speLeaveData.applied_on).format("DD MMM YYYY") : "—"}</h6>
                      </li>
                      <li>
                        <span>Leave</span>
                        <h6>
                          {speLeaveData ? `${dayjs(speLeaveData.from_date).format('DD MMM YYYY')} - ${dayjs(speLeaveData.to_date).format('DD MMM YYYY')}` : "—"}
                        </h6>
                      </li>
                    </ul>
                  </div>

                  <div className="mb-3 leave-reason">
                    <h6 className="mb-1">Reason</h6>
                    <span className="text-capitalize">{speLeaveData ? speLeaveData.reason || "-" : "-"}</span>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Approval Status</label>
                    <div className="d-flex align-items-center check-radio-group">
                      <label className="custom-radio">
                        <input type="radio" name="radio" checked={status == 0} onChange={() => setStatus(0)} />
                        <span className="checkmark" />
                        Pending
                      </label>
                      <label className="custom-radio">
                        <input type="radio" name="radio" checked={status == 1} onChange={() => setStatus(1)} />
                        <span className="checkmark" />
                        Approved
                      </label>
                      <label className="custom-radio">
                        <input type="radio" name="radio" checked={status == 2} onChange={() => setStatus(2)} />
                        <span className="checkmark" />
                        Disapproved
                      </label>
                    </div>
                  </div>

                  <div className="mb-0">
                    <label className="form-label">Note</label>
                    <textarea
                      className="form-control"
                      placeholder="Add Comment"
                      rows={4}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button onClick={(e) => handleCancelSatusUpdate(e)} className="btn btn-light me-2" data-bs-dismiss="modal">Cancel</button>
                  <button type="submit" className="btn btn-primary">Submit</button>
                </div>
              </form>

            </div>
          </div>
        </div>
        {/* /Leave Request */}
        {/* Delete Modal */}
        <div className="modal fade" id="delete-modal">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form>
                <div className="modal-body text-center">
                  <span className="delete-icon">
                    <i className="ti ti-trash-x" />
                  </span>
                  <h4>Confirm Deletion</h4>
                  <p>
                    You want to delete this items, this cant be undone once
                    you delete.
                  </p>
                  {
                    deleteId && (
                      <div className="d-flex justify-content-center">
                        <button
                          onClick={(e) => cancelDelete(e)}
                          className="btn btn-light me-3"
                          data-bs-dismiss="modal"
                        >
                          Cancel
                        </button>
                        <button className="btn btn-danger" onClick={(e) => handleDelete(deleteId, e)}>
                          Yes, Delete
                        </button>

                      </div>
                    )}
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

export default ApproveRequest;
