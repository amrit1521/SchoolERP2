import React, { useEffect, useRef, useState } from 'react'
import Table from "../../../core/common/dataTable/index";
// import { holiday } from '../../../core/data/json/holiday';
import type { TableData } from '../../../core/data/interface';
import PredefinedDateRanges from '../../../core/common/datePicker';
import CommonSelect from '../../../core/common/commonSelect';
import { activeList, holidays } from '../../../core/common/selectoption/selectoption';
import { Link } from 'react-router-dom';
import { all_routes } from '../../router/all_routes';
import TooltipOption from '../../../core/common/tooltipOption';
import { DatePicker } from 'antd';
import dayjs from 'dayjs'
import { handleModalPopUp } from '../../../handlePopUpmodal';
import { addHoliday, allHoliday, deleteHoliday, editHoliday, specficHoliday } from '../../../service/holidayApi';
import { toast } from 'react-toastify';


const Holiday = () => {
  const routes = all_routes;
  interface AllHoliday {
    id: number;
    title: string;
    date: string;
    description: string;
    status: string;

  }

  const [allholiday, setAllholiday] = useState<AllHoliday[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [selectEditId, setSelectedEditId] = useState<number | null>(null)

  const fetchAllHoliday = async () => {

    setLoading(true)
    await new Promise((res) => setTimeout(res, 500))
    try {

      const { data } = await allHoliday()

      if (data.success) {
        setAllholiday(data.holidays)
      }

    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllHoliday()
  }, [])


  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);

  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };


  // add holiday form data----------------------------------------------------------------------------
  interface Holiday {
    title: string;
    date: string;
    description: string;
    status: string; // "0" = inactive, "1" = active
  }


  const [formdata, setFormdata] = useState<Holiday>({
    title: "",
    date: "",
    description: "",
    status: "0",
  });

  const [errors, setErrors] = useState<Partial<Holiday>>({});

  // ✅ Handle text/textarea changes
  const handleChange = (field: keyof Holiday, value: string) => {
    setFormdata((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ✅ Handle date change
  const handleDateChange = (_: any, dateString: string) => {
    setFormdata((prev) => ({
      ...prev,
      date: dateString
    }));
  };

  // ✅ Toggle status
  const handleToggleStatus = () => {
    setFormdata((prev) => ({
      ...prev,
      status: prev.status === "1" ? "0" : "1",
    }));
  };

  // ✅ Validation
  const validate = () => {
    const newErrors: Partial<Holiday> = {};
    if (!formdata.title.trim()) newErrors.title = "Title is required";

    if (!formdata.date) newErrors.date = "Date is required";
    if (!formdata.description.trim())
      newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };




  const fetchSpecificHoliday = async (id: number) => {
    console.log(id)
    try {
      const { data } = await specficHoliday(id)
      // console.log(data)
      setFormdata({
        title: data.holiday.title,
        description: data.holiday.description,
        date: dayjs(data.holiday.date).format('DD MMM YYYY'),
        status: data.holiday.status
      }
      )
      setSelectedEditId(id)
    } catch (error) {
      console.log(error)
    }

  }

  const cancelEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setFormdata({
      title: "",
      date: "",
      description: "",
      status: "0",
    });
    setErrors({});
    setSelectedEditId(null)
  }

  // ✅ Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // console.log("Holiday Added:", formdata);
    try {
      if (selectEditId) {
        const { data } = await editHoliday(formdata, selectEditId)
        // console.log(data)
        if (data.success) {
          toast.success(data.message)
          handleModalPopUp('edit_holiday')
           setSelectedEditId(null)
        }
      } else {
        const { data } = await addHoliday(formdata)
        if (data.success) {
          toast.success(data.message)
          handleModalPopUp('add_holiday')
        }
      }

      fetchAllHoliday()
      setFormdata({
        title: "",
        date: "",
        description: "",
        status: "0",
      });
      setErrors({});
     
    } catch (error) {
      console.log(error)
    }
  };

  // delete holiday------------------------------------------------
  const [deleteId, setDeleteId] = useState<number | null>(null)


  const handleDelete = async (id: number, e: React.MouseEvent<HTMLButtonElement>) => {
    console.log(id)
    e.preventDefault()
    try {

      const { data } = await deleteHoliday(id)
      if (data.success) {
        setDeleteId(null)
        toast.success(data.message)
        fetchAllHoliday()
        setAllholiday((prev) => prev.filter((item) => item.id != id))
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


  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (text: number) => (
        <Link to="#" className="link-primary">
          {text}
        </Link>
      ),
      sorter: (a: TableData, b: TableData) => a.id - b.id,
    },

    {
      title: "Holiday Title",
      dataIndex: "title",
      render: (text: string) => (
        <span className="text-capitalize">{text}</span>
      ),
      sorter: (a: TableData, b: TableData) =>
        a.title.length - b.title.length,
    },

    {
      title: "Date",
      dataIndex: "date",
      render: (date: string) => (
        <span>{dayjs(date).format("DD MMM YYYY")}</span>
      ),
      sorter: (a: TableData, b: TableData) =>
        dayjs(a.date).unix() - dayjs(b.date).unix(),
    },

    {
      title: "Description",
      dataIndex: "description",
      render: (text: string) => (
        <span className="text-capitalize">{text}</span>
      ),
      sorter: (a: TableData, b: TableData) =>
        a.description.length - b.description.length,
    },

    {
      title: "Status",
      dataIndex: "status",
      render: (text: string) =>
        text === "1" ? (
          <span className="badge badge-soft-success d-inline-flex align-items-center">
            <i className="ti ti-circle-filled fs-5 me-1" />
            Active
          </span>
        ) : (
          <span className="badge badge-soft-danger d-inline-flex align-items-center">
            <i className="ti ti-circle-filled fs-5 me-1" />
            Inactive
          </span>
        ),
      sorter: (a: any, b: any) => a.status.length - b.status.length,
    },

    {
      title: "Action",
      dataIndex: "id",
      render: (id: number) => (
        <div className="dropdown">
          <div

            className="btn btn-white btn-icon btn-sm d-flex align-items-center justify-content-center rounded-circle p-0"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="ti ti-dots-vertical fs-14" />
          </div>
          <ul className="dropdown-menu dropdown-menu-right p-3">
            <li>
              <div
                style={{ cursor: 'pointer' }}
                className="dropdown-item rounded-1"
                onClick={() => fetchSpecificHoliday(id)}
                data-bs-toggle="modal"
                data-bs-target="#edit_holiday"
              >
                <i className="ti ti-edit-circle me-2" />
                Edit
              </div>
            </li>
            <li>
              <div
                style={{ cursor: 'pointer' }}
                className="dropdown-item rounded-1"
                onClick={() => setDeleteId(id)}
                data-bs-toggle="modal"
                data-bs-target="#delete-modal"
              >
                <i className="ti ti-trash-x me-2" />
                Delete
              </div>
            </li>
          </ul>
        </div>
      ),
    },
  ];


  return (
    <div>
      <>
        {/* Page Wrapper */}
        <div className="page-wrapper">
          <div className="content">
            {/*Page Header */}
            <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
              <div className="my-auto mb-2">
                <h3 className="page-title mb-1">Holidays</h3>
                <nav>
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <Link to={routes.adminDashboard}>Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to="#">HRM</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Holidays
                    </li>
                  </ol>
                </nav>
              </div>
              <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
                <TooltipOption />
                <div className="mb-2">
                  <Link
                    to="#"
                    className="btn btn-primary d-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#add_holiday"
                  >
                    <i className="ti ti-square-rounded-plus me-2" />
                    Add Holiday
                  </Link>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            {/* Filter Section */}
            <div className="card">
              <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                <h4 className="mb-3">Holidays List</h4>
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
                            <div className="col-md-12">
                              <div className="mb-3">
                                <label className="form-label">Holiday Title</label>
                                <CommonSelect
                                  className="select"
                                  options={activeList}
                                />
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="mb-0">
                                <label className="form-label">Status</label>
                                <CommonSelect
                                  className="select"
                                  options={holidays}
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
                {/* Holidays List */}


                {loading ? (
                  <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (<Table columns={columns} dataSource={allholiday} Selection={true} />)
                }

                {/* /Holidays List */}
              </div>
            </div>
          </div>
        </div>
        {/* /Page Wrapper */}
        {/* Add Holiday */}
        <div className="modal fade" id="add_holiday">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Holiday</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>

              {/* ✅ Form */}
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      {/* Title */}
                      <div className="mb-3">
                        <label className="form-label">Holiday Title</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formdata.title}
                          onChange={(e) => handleChange("title", e.target.value)}
                        />
                        {errors.title && (
                          <small className="text-danger">{errors.title}</small>
                        )}
                      </div>

                      {/* Date */}
                      <div className="mb-3">
                        <label className="form-label">Date</label>
                        <div className="input-icon position-relative">
                          <DatePicker
                            className="form-control datetimepicker"
                            format="DD MMM YYYY"
                            value={
                              formdata.date
                                ? dayjs(formdata.date, "DD MMM YYYY")
                                : null
                            }
                            placeholder="Select Date"
                            onChange={(dateString) =>
                              handleDateChange(
                                "date",
                                Array.isArray(dateString) ? dateString[0] : dateString
                              )
                            }
                          />
                          <span className="input-icon-addon">
                            <i className="ti ti-calendar" />
                          </span>
                        </div>
                        {errors.date && (
                          <small className="text-danger">{errors.date}</small>
                        )}
                      </div>

                      {/* Description */}
                      <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                          rows={4}
                          className="form-control"
                          value={formdata.description}
                          onChange={(e) =>
                            handleChange("description", e.target.value)
                          }
                        />
                        {errors.description && (
                          <small className="text-danger">
                            {errors.description}
                          </small>
                        )}
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
                            checked={formdata.status === "1"}
                            onChange={handleToggleStatus}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="modal-footer">
                  <Link
                    to="#"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <button type="submit" className="btn btn-primary">
                    Add Holiday
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Add Holiday */}
        {/* Edit Holiday */}
        <div className="modal fade" id="edit_holiday">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Holiday</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>

              {/* ✅ Same Form (reuse handleSubmit) */}
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      {/* Title */}
                      <div className="mb-3">
                        <label className="form-label">Holiday Title</label>
                        <input
                          type="text"
                          className="form-control text-capitalize"
                          value={formdata.title}
                          onChange={(e) => handleChange("title", e.target.value)}
                        />
                      </div>

                      {/* Date */}
                      <div className="mb-3">
                        <label className="form-label">Date</label>
                        <div className="input-icon position-relative">
                          <DatePicker
                            className="form-control datetimepicker"
                            format="DD MMM YYYY"
                            value={
                              formdata.date
                                ? dayjs(formdata.date, "DD MMM YYYY")
                                : null
                            }
                            placeholder="Select Date"
                            onChange={(dateString) =>
                              handleDateChange(
                                "date",
                                Array.isArray(dateString) ? dateString[0] : dateString
                              )
                            }
                          />
                          <span className="input-icon-addon">
                            <i className="ti ti-calendar" />
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                          rows={4}
                          className="form-control"
                          value={formdata.description}
                          onChange={(e) =>
                            handleChange("description", e.target.value)
                          }
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
                            id="switch-sm2"
                            checked={formdata.status === "1"}
                            onChange={handleToggleStatus}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="modal-footer">
                  <button
                    onClick={(e) => cancelEdit(e)}
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>


        {/* Edit Holiday */}
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
                    You want to delete all the marked items, this cant be undone once
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
  )
}

export default Holiday