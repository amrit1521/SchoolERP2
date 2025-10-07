import React, { useEffect, useMemo, useRef, useState } from "react";
import PredefinedDateRanges from "../../../../core/common/datePicker";
import {
  // classSection,
  classselect,
  classSylabus,
  // count,
  durationOne,
  examOne,
  // examtwo,
  maxMark,
  minMark,
  // mothertongue,
  // startTime,
  // startTimeOne,
} from "../../../../core/common/selectoption/selectoption";
import { Link } from "react-router-dom";
import Table from "../../../../core/common/dataTable/index";
// import { examSchedule } from "../../../../core/data/json/exam_schedule";
import type { TableData } from "../../../../core/data/interface";
import CommonSelect from "../../../../core/common/commonSelect";
import { all_routes } from "../../../router/all_routes";
import TooltipOption from "../../../../core/common/tooltipOption";
import { addExamSchedule, allExamData, allExamSchedule, deleteExamSchedule, editExamSchedule, getAllSection, getAllSubject, speExamSchedule } from "../../../../service/api";
import { toast } from "react-toastify";
import { handleModalPopUp } from "../../../../handlePopUpmodal";
import { allClassRoom } from "../../../../service/classApi";
import dayjs from 'dayjs'
export interface Section {
  id:string;
  section: string;
}

export interface Subject {
  id: number;
  name: string;
}

interface Room {
  id: number;
  room_no: number;
}

const ExamSchedule = () => {
  const routes = all_routes;
  // const data = examSchedule;
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };




  const [scheduleData, setScheduleData] = useState<any[]>([]);
  const [allExam, setAllExam] = useState<any[]>([]);
  const [sections, setSections] = useState<Section[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState<boolean>(false);


  const fetchData = async <T,>(
    apiFn: () => Promise<{ data: { success: boolean; data: T } }>,
    setter: React.Dispatch<React.SetStateAction<T>>
  ) => {
    try {
      const { data } = await apiFn();
      if (data.success) setter(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSchedule = async () => {
    setLoading(true)
    await new Promise((res) => setTimeout(res, 500))

    try {
      const { data } = await allExamSchedule()
      if (data.success) {
        setScheduleData(data.data);
      }

    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  const fetchSections = () => fetchData(getAllSection, setSections);
  const fetchSubjects = () => fetchData(getAllSubject, setSubjects)
  const fetchRooms = () => fetchData(allClassRoom, setRooms)
  const fetchExams = () => fetchData(allExamData, setAllExam)

  useEffect(() => {
    fetchSchedule();
    fetchSections()
    fetchSubjects()
    fetchRooms()
    fetchExams()
  }, []);



  const examNameOptions = useMemo(
    () =>
      allExam.map((e) => ({
        value: e.id,
        label: e.examName,
      })),
    [allExam]
  );

  const examStartTimeOptions = useMemo(
    () =>
      allExam.map((e) => ({
        value: e.id,
        label: e.startTime,
      })),
    [allExam]
  );

  const examEndTimeOptions = useMemo(
    () =>
      allExam.map((e) => ({
        value: e.id,
        label: e.endTime,
      })),
    [allExam]
  );

  const examDateOptions = useMemo(
    () =>
      allExam.map((e) => ({
        value: e.id,
        label: dayjs(e.examDate).format('DD MMM YYYY')
      })),
    [allExam]
  );

  // Section, Subject, Room Options
  const sectionOptions = useMemo(
    () => sections.map((s) => ({ value: s.section, label: s.section })),
    [sections]
  );

  const subjectOptions = useMemo(
    () => subjects.map((s) => ({ value: s.id, label: s.name })),
    [subjects]
  );

  const roomOptions = useMemo(
    () => rooms.map((r) => ({ value: r.id, label: String(r.room_no) })),
    [rooms]
  );

  // add exam schedule

  interface ExamScheduleForm {
    className: string;
    section: number | null;
    examName: number | null;
    startTime: number | null;
    endTime: number | null;
    duration: string;
    examDate: number | null;
    subject: number | null;
    roomNo: number | null;
    maxMarks: string;
    minMarks: string;
  }

  const [examScheduleForm, setExamScheduleForm] = useState<ExamScheduleForm>({
    className: "",
    section: null,
    examName: null,
    startTime: null,
    endTime: null,
    duration: "",
    examDate: null,
    subject: null,
    roomNo: null,
    maxMarks: "",
    minMarks: "",
  });
  const [editId, setEditId] = useState<number | null>(null)

  const handleChange = (field: keyof ExamScheduleForm, value: string | number) => {
    setExamScheduleForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // edit

  const fetchById = async (id: number) => {

    try {
      const { data } = await speExamSchedule(id)
      console.log(data)
      if (data.success) {
        setExamScheduleForm({
          className: data.data.className,
          section: data.data.section,
          examName: data.data.examName,
          startTime: data.data.startTime,
          endTime: data.data.endTime,
          duration: data.data.duration,
          examDate: data.data.examDate,
          subject: data.data.subject,
          roomNo: data.data.roomNo,
          maxMarks: data.data.maxMarks,
          minMarks: data.data.minMarks,
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
    setExamScheduleForm({
      className: "",
      section: null,
      examName: null,
      startTime: null,
      endTime: null,
      duration: "",
      examDate: null,
      subject: null,
      roomNo: null,
      maxMarks: "",
      minMarks: "",
    })
  }

  const handleSubmit = async () => {

    try {

      if (editId) {

        const { data } = await editExamSchedule(examScheduleForm, editId)
        if (data.success) {
          toast.success(data.message)
          handleModalPopUp(`edit_exam_schedule`)
          setEditId(null)
        }

      } else {
        const { data } = await addExamSchedule(examScheduleForm)
        console.log(data)
        if (data.success) {

          toast.success(data.message)
          handleModalPopUp(`add_exam_schedule`)

        }
      }
      fetchSchedule()
      setExamScheduleForm({
        className: "",
        section: null,
        examName: null,
        startTime: null,
        endTime: null,
        duration: "",
        examDate: null,
        subject: null,
        roomNo: null,
        maxMarks: "",
        minMarks: "",
      })

    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  };

  // delete-----------------------------------
  // delete section----------------------------------------------------
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const handleDelete = async (id: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    try {

      const { data } = await deleteExamSchedule(id)
      if (data.success) {
        toast.success(data.message)
        fetchSchedule();
        setDeleteId(null)
        handleModalPopUp('delete-modal')
      }

    } catch (error) {
      console.log(error)
    }
  }

  const cancelDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setDeleteId(null)
  }






  const columns = [
    {
      title: "Subject",
      dataIndex: "subject",
      render: (text: string) => (
        <>
          <Link to="#" className="link-primary">
            {text}
          </Link>
        </>
      ),
      sorter: (a: TableData, b: TableData) =>
        a.subject.length - b.subject.length,
    },
    {
      title: "Exam Date",
      dataIndex: "examDate",
      render: (text: string) => (
        <span>{dayjs(text).format('DD MMM YYYY')}</span>
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
      title: "Duration",
      dataIndex: "duration",
      sorter: (a: TableData, b: TableData) =>
        a.duration.length - b.duration.length,
    },
    {
      title: "Room No",
      dataIndex: "roomNo",
      sorter: (a: TableData, b: TableData) => a.roomNo.length - b.roomNo.length,
    },
    {
      title: "Max Mark",
      dataIndex: "maxMarks",
      sorter: (a: TableData, b: TableData) =>
        a.maxMarks.length - b.maxMarks.length,
    },
    {
      title: "Min Mark",
      dataIndex: "minMarks",
      sorter: (a: TableData, b: TableData) =>
        a.minMarks.length - b.minMarks.length,
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
                    data-bs-target="#edit_exam_schedule"
                  >
                    <i className="ti ti-edit-circle me-2" />
                    Edit
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item rounded-1"
                    onClick={() => setDeleteId(id)}
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
              <h3 className="page-title mb-1">Exam Schedule</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Academic </Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Exam Schedule
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
                  data-bs-target="#add_exam_schedule"
                >
                  <i className="ti ti-square-rounded-plus-filled me-2" />
                  Add Exam Schedule
                </Link>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          {/* Guardians List */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Exam Schedule</h4>
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
                      <div className="p-3 border-bottom pb-0">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Class 1-A</label>
                              <CommonSelect
                                className="select"
                                options={classSylabus}
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
              {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (<Table columns={columns} dataSource={scheduleData} Selection={true} />)}

              {/* /Guardians List */}
            </div>
          </div>
          {/* /Guardians List */}
        </div>
      </div>
      <>
        {/* Add Exam Schedule */}
        <div className="modal fade" id="add_exam_schedule">
          <div className="modal-dialog modal-dialog-centered  modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Exam Schedule</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>


              <form onSubmit={(e) => e.preventDefault()}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="row">
                        <div className="col-md-4">
                          <div className="mb-3">
                            <label className="form-label">Class</label>
                            <CommonSelect
                              className="select"
                              options={classselect}
                              value={examScheduleForm.className}
                              onChange={(option: any) =>
                                handleChange("className", option.value)
                              }
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="mb-3">
                            <label className="form-label">Section</label>
                            <CommonSelect
                              className="select text-capitalize"
                              options={sectionOptions}
                              value={examScheduleForm.section}
                              onChange={(option: any) =>
                                handleChange("section", option.value)
                              }
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="mb-3">
                            <label className="form-label">Exam Name</label>
                            <CommonSelect
                              className="select"
                              options={examNameOptions}
                              value={examScheduleForm.examName}
                              onChange={(option: any) =>
                                handleChange("examName", option.value)
                              }
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="mb-3">
                            <label className="form-label">Start Time</label>
                            <CommonSelect
                              className="select"
                              options={examStartTimeOptions}
                              value={examScheduleForm.startTime}
                              onChange={(option: any) =>
                                handleChange("startTime", option.value)
                              }
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="mb-3">
                            <label className="form-label">End Time</label>
                            <CommonSelect
                              className="select"
                              options={examEndTimeOptions}
                              value={examScheduleForm.endTime}
                              onChange={(option: any) =>
                                handleChange("endTime", option.value)
                              }
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="mb-3">
                            <label className="form-label">Duration(min)</label>
                            <CommonSelect
                              className="select"
                              options={durationOne}
                              value={examScheduleForm.duration}
                              onChange={(option: any) =>
                                handleChange("duration", option.value)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="exam-schedule-add">
                    <div className="exam-schedule-row d-flex align-items-center flex-wrap column-gap-3">
                      <div className="shedule-info flex-fill">
                        <div className="mb-3">
                          <label className="form-label">Exam Date</label>
                          <CommonSelect
                            className="select"
                            options={examDateOptions}
                            value={examScheduleForm.examDate}
                            onChange={(option: any) =>
                              handleChange("examDate", option.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="shedule-info flex-fill">
                        <div className="mb-3">
                          <label className="form-label">Subject</label>
                          <CommonSelect
                            className="select"
                            options={subjectOptions}
                            value={examScheduleForm.subject}
                            onChange={(option: any) =>
                              handleChange("subject", option.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="shedule-info flex-fill">
                        <div className="mb-3">
                          <label className="form-label">Room No</label>
                          <CommonSelect
                            className="select"
                            options={roomOptions}
                            value={examScheduleForm.roomNo}
                            onChange={(option: any) =>
                              handleChange("roomNo", option.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="shedule-info flex-fill">
                        <div className="mb-3">
                          <label className="form-label">Max Marks</label>
                          <CommonSelect
                            className="select"
                            options={maxMark}
                            value={examScheduleForm.maxMarks}
                            onChange={(option: any) =>
                              handleChange("maxMarks", option.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="shedule-info flex-fill">
                        <div className="d-flex align-items-end">
                          <div className="mb-3 flex-fill">
                            <label className="form-label">Min Marks</label>
                            <CommonSelect
                              className="select"
                              options={minMark}
                              value={examScheduleForm.minMarks}
                              onChange={(option: any) =>
                                handleChange("minMarks", option.value)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSubmit}

                  >
                    Add Exam Schedule
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
        {/* Add Exam Schedule */}

        {/* Edit Exam Schedule */}
        <div className="modal fade" id="edit_exam_schedule">
          <div className="modal-dialog modal-dialog-centered  modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Exam Schedule</h4>
                <button
                  onClick={(e) => cancelEdit(e)}
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="row">
                        <div className="col-md-4">
                          <div className="mb-3">
                            <label className="form-label">Class</label>
                            <CommonSelect
                              className="select"
                              options={classselect}
                              value={examScheduleForm.className}
                              onChange={(option: any) =>
                                handleChange("className", option.value)
                              }
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="mb-3">
                            <label className="form-label">Section</label>
                            <CommonSelect
                              className="select text-capitalize"
                              options={sectionOptions}
                              value={examScheduleForm.section}
                              onChange={(option: any) =>
                                handleChange("section", option.value)
                              }
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="mb-3">
                            <label className="form-label">Exam Name</label>
                            <CommonSelect
                              className="select"
                              options={examNameOptions}
                              value={examScheduleForm.examName}
                              onChange={(option: any) =>
                                handleChange("examName", option.value)
                              }
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="mb-3">
                            <label className="form-label">Start Time</label>
                            <CommonSelect
                              className="select"
                              options={examStartTimeOptions}
                              value={examScheduleForm.startTime}
                              onChange={(option: any) =>
                                handleChange("startTime", option.value)
                              }
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="mb-3">
                            <label className="form-label">End Time</label>
                            <CommonSelect
                              className="select"
                              options={examEndTimeOptions}
                              value={examScheduleForm.endTime}
                              onChange={(option: any) =>
                                handleChange("endTime", option.value)
                              }
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="mb-3">
                            <label className="form-label">Duration(min)</label>
                            <CommonSelect
                              className="select"
                              options={durationOne}
                              value={examScheduleForm.duration}
                              onChange={(option: any) =>
                                handleChange("duration", option.value)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="exam-schedule-add">
                    <div className="exam-schedule-row d-flex align-items-center flex-wrap column-gap-3">
                      <div className="shedule-info flex-fill">
                        <div className="mb-3">
                          <label className="form-label">Exam Date</label>
                          <CommonSelect
                            className="select"
                            options={examDateOptions}
                            value={examScheduleForm.examDate}
                            onChange={(option: any) =>
                              handleChange("examDate", option.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="shedule-info flex-fill">
                        <div className="mb-3">
                          <label className="form-label">Subject</label>
                          <CommonSelect
                            className="select"
                            options={subjectOptions}
                            value={examScheduleForm.subject}
                            onChange={(option: any) =>
                              handleChange("subject", option.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="shedule-info flex-fill">
                        <div className="mb-3">
                          <label className="form-label">Room No</label>
                          <CommonSelect
                            className="select"
                            options={roomOptions}
                            value={examScheduleForm.roomNo}
                            onChange={(option: any) =>
                              handleChange("roomNo", option.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="shedule-info flex-fill">
                        <div className="mb-3">
                          <label className="form-label">Max Marks</label>
                          <CommonSelect
                            className="select"
                            options={maxMark}
                            value={examScheduleForm.maxMarks}
                            onChange={(option: any) =>
                              handleChange("maxMarks", option.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="shedule-info flex-fill">
                        <div className="d-flex align-items-end">
                          <div className="mb-3 flex-fill">
                            <label className="form-label">Min Marks</label>
                            <CommonSelect
                              className="select"
                              options={minMark}
                              value={examScheduleForm.minMarks}
                              onChange={(option: any) =>
                                handleChange("minMarks", option.value)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    onClick={(e) => cancelEdit(e)}
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"

                    className="btn btn-primary"
                    onClick={handleSubmit}

                  >
                    Edit Exam Schedule
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Edit Exam Schedule */}
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
                  {
                    deleteId && (<div className="d-flex justify-content-center">
                      <button
                        onClick={(e) => cancelDelete(e)}
                        className="btn btn-light me-3"
                        data-bs-dismiss="modal"
                      >
                        Cancel
                      </button>
                      <button onClick={(e) => handleDelete(deleteId, e)} className="btn btn-danger"
                      >
                        Yes, Delete
                      </button>
                    </div>)
                  }
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

export default ExamSchedule;
