import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import Table from "../../../../core/common/dataTable/index";
// import { exam } from "../../../../core/data/json/exam";
import {
  examOne,
  examtwo,
  startTime,
  startTimeOne,
} from "../../../../core/common/selectoption/selectoption";
import PredefinedDateRanges from "../../../../core/common/datePicker";
import type { TableData } from "../../../../core/data/interface";
import CommonSelect from "../../../../core/common/commonSelect";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { all_routes } from "../../../../router/all_routes";
import TooltipOption from "../../../../core/common/tooltipOption";
import { toast } from "react-toastify";
import { addExamName, allExamData, deleteExam, editExam, speExam } from "../../../../service/api";
import { handleModalPopUp } from "../../../../handlePopUpmodal";

const Exam = () => {
  const routes = all_routes;


  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Month is zero-based, so we add 1
  const day = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${month}-${day}-${year}`;
  const defaultValue = dayjs(formattedDate);
  console.log(defaultValue?"":"")

  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };
  // const getModalContainer = () => {
  //   const modalElement = document.getElementById("modal-datepicker");
  //   return modalElement ? modalElement : document.body; // Fallback to document.body if modalElement is null
  // };



  interface ExamForm {
    examName: string;
    examDate: string;
    startTime: string;
    endTime: string;
  }




  const [examForm, setExamForm] = useState<ExamForm>({
    examName: "",
    examDate: "",
    startTime: "",
    endTime: "",
  });
  const [editId, setEditId] = useState<number | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setExamForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name: keyof ExamForm, date: string) => {
    setExamForm((prev) => ({ ...prev, [name]: date }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setExamForm((prev) => ({ ...prev, [field]: value }));
  };

  // edit
  const fetchById = async (id: number) => {

    try {
      const { data } = await speExam(id)
      console.log(data)
      if (data.success) {
        setExamForm({
          examName: data.data.examName,
          examDate: dayjs(data.data.examDate).format('DD MMM YYYY'),
          startTime: data.data.startTime,
          endTime: data.data.endTime,
        })
        setEditId(id)
      }

    } catch (error) {
      console.log(error)
    }
  }

  const cancelEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setEditId(null)
    setExamForm({
      examName: "",
      examDate: "",
      startTime: "",
      endTime: "",
    })
  }



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log("Exam Form Data:", examForm);
    try {
      if (editId) {
        const { data } = await editExam(examForm, editId)
        if (data.success) {
          toast.success(data.message)
          handleModalPopUp('edit_exam')
          setEditId(null)
        }

      } else {
        const { data } = await addExamName(examForm)
        if (data?.success) {
          toast.success(data.message)

          handleModalPopUp('add_exam')
        }

      }
      fetchAllExam()
      setExamForm({
        examName: "",
        examDate: "",
        startTime: "",
        endTime: "",
      })
    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)

    }
  };

  const [allExam, setAllExam] = useState([])
  const [loading, setLoading] = useState<boolean>(false)

  const fetchAllExam = async () => {
    setLoading(true)
    try {
      await new Promise((res) => setTimeout(res, 500))
      const { data } = await allExamData()
      if (data.success) {
        setAllExam(data.data)
      }

    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    fetchAllExam()
  }, [])



  // delete exam
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (deleteId) {
        const { data } = await deleteExam(deleteId)
        console.log(data)
        if (data.success) {
          toast.success(data.message)
          setDeleteId(null)
          handleModalPopUp('delete-modal')
          fetchAllExam()
        }
      }

    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }


  const handleDeleteCancel = () => {
    setDeleteId(null)
  }

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (text: number) => (
        <>
          <Link to="#" className="link-primary">
            {text}
          </Link>
        </>
      ),
      sorter: (a: any, b: any) => a.id - b.id,
    },
    {
      title: "Exam Name",
      dataIndex: "examName",
      sorter: (a: TableData, b: TableData) =>
        a.examName.length - b.examName.length,
    },
    {
      title: "Exam Date",
      dataIndex: "examDate",
      render: (text: string) => (
        <span >{dayjs(text).format('DD MMM YYYY')}</span>
      ),
      sorter: (a: TableData, b: TableData) =>
        a.examDate.length - b.examDate.length,
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      sorter: (a: TableData, b: TableData) =>
        a.startTime.length - b.startTime.length,
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      sorter: (a: TableData, b: TableData) =>
        a.endTime.length - b.endTime.length,
    },
    {
      title: "Action",
      dataIndex: "id",
      render: (id: number) => (
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
                <li>
                  <button
                    className="dropdown-item rounded-1"
                    onClick={() => fetchById(id)}
                    data-bs-toggle="modal"
                    data-bs-target="#edit_exam"
                  >
                    <i className="ti ti-edit-circle me-2" />
                    Edit
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setDeleteId(id)}
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
          </div>
        </>
      ),
    },
  ];


  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Exam</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Academic </Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Exam
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
                  data-bs-target="#add_exam"
                >
                  <i className="ti ti-square-rounded-plus-filled me-2" />
                  Add Exam
                </Link>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          {/* Exam List */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Exam List</h4>
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
                              <label className="form-label">Exam Name</label>
                              <CommonSelect
                                className="select"
                                options={examtwo}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Exam Date</label>
                              <CommonSelect
                                className="select"
                                options={examOne}
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
                ) : (<Table columns={columns} dataSource={allExam} Selection={true} />)
              }

              {/* /Guardians List */}
            </div>
          </div>
          {/* /Exam List */}
        </div>
      </div>
      <>
        {/* Add Exam */}


        <div className="modal fade" id="add_exam">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Exam</h4>
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
                      <div className="mb-3">
                        <label className="form-label">Exam Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="examName"
                          value={examForm.examName}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Exam Date</label>
                        <div className="date-pic">
                          <DatePicker
                            className="form-control datetimepicker text-capitalize"
                            format="DD MMM YYYY"
                            value={
                              examForm.examDate
                                ? dayjs(examForm.examDate, 'DD MMM YYYY')
                                : null
                            }
                            placeholder="Select Date"
                            onChange={(dateString) =>
                              handleDateChange('examDate', Array.isArray(dateString) ? dateString[0] : dateString)
                            }

                          />
                          <span className="cal-icon">
                            <i className="ti ti-calendar" />
                          </span>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Start Time</label>
                        <CommonSelect
                          className="select"
                          options={startTime}
                          value={examForm.startTime}
                          onChange={(option: any) =>
                            handleSelectChange("startTime", option?.value)
                          }
                        />
                      </div>
                      <div className="mb-0">
                        <label className="form-label">End Time</label>
                        <CommonSelect
                          className="select"
                          options={startTimeOne}
                          value={examForm.endTime}
                          onChange={(option: any) =>
                            handleSelectChange("endTime", option?.value)
                          }
                        />
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
                  <button type="submit" className="btn btn-primary" >
                    Add Exam
                  </button>
                </div>
              </form>


            </div>
          </div>
        </div>


        {/* Add Exam */}
        {/* Edit Exam */}
        <div className="modal fade" id="edit_exam">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Exam</h4>
                <button
                  type="button"
                  onClick={(e) => cancelEdit(e)}
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
                      <div className="mb-3">
                        <label className="form-label">Exam Name</label>
                        <input
                          type="text"
                          className="form-control text-capitalize"
                          name="examName"
                          value={examForm.examName}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Exam Date</label>
                        <div className="date-pic">
                          <DatePicker
                            className="form-control datetimepicker"
                            format="DD MMM YYYY"
                            value={
                              examForm.examDate
                                ? dayjs(examForm.examDate, 'DD MMM YYYY')
                                : null
                            }
                            placeholder="Select Date"
                            onChange={(dateString) =>
                              handleDateChange('examDate', Array.isArray(dateString) ? dateString[0] : dateString)
                            }

                          />
                          <span className="cal-icon">
                            <i className="ti ti-calendar" />
                          </span>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Start Time</label>
                        <CommonSelect
                          className="select"
                          options={startTime}
                          value={examForm.startTime}
                          onChange={(option: any) =>
                            handleSelectChange("startTime", option?.value)
                          }
                        />
                      </div>
                      <div className="mb-0">
                        <label className="form-label">End Time</label>
                        <CommonSelect
                          className="select"
                          options={startTimeOne}
                          value={examForm.endTime}
                          onChange={(option: any) =>
                            handleSelectChange("endTime", option?.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    onClick={(e) => cancelEdit(e)}
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" >
                    Save Exam
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
        {/* Edit Exam */}
        {/* Delete Modal */}
        <div className="modal fade" id="delete-modal">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={handleDelete}>
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
                    <button type="submit" className="btn btn-danger">
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

export default Exam;
