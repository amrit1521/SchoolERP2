import React, { useEffect, useRef, useState } from "react";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import {
  // classduration,
  classSection,
  // classSylabus,
  language,
  // period,
  // routinename,
  // subjectGroup,
  teacher,
  Time,
  Timeto,
  allClass,
} from "../../../core/common/selectoption/selectoption";
import CommonSelect from "../../../core/common/commonSelect";
import { Link } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import TooltipOption from "../../../core/common/tooltipOption";
import { addTimeTable, getTimeTable } from "../../../service/api";
// allTeacherForOption
import { toast } from "react-toastify";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { handleModalPopUp } from "../../../handlePopUpmodal";

const ClassTimetable = () => {
  const routes = all_routes;

  // const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  // const handleApplyClick = () => {
  //   if (dropdownMenuRef.current) {
  //     dropdownMenuRef.current.classList.remove("show");
  //   }
  // };
  const [newContents, setNewContents] = useState<number[]>([0]);
  // const [tuesdayContents, settuesdayContents] = useState<number[]>([0]);
  // const [wednessdayContents, setwednessdayContents] = useState<number[]>([0]);
  // const [thursdayContents, setthursdayContents] = useState<number[]>([0]);
  // const [fridayContents, setfridayContents] = useState<number[]>([0]);
  const addNewContent = () => {
    setNewContents([...newContents, newContents.length]);
  };
  // const addTuesdayContent = () => {
  //   settuesdayContents([...tuesdayContents, tuesdayContents.length]);
  // };
  // const addwednessdayContent = () => {
  //   setwednessdayContents([...wednessdayContents, wednessdayContents.length]);
  // };
  // const addthursdayContents = () => {
  //   setthursdayContents([...thursdayContents, thursdayContents.length]);
  // };
  // const addfridayContents = () => {
  //   setfridayContents([...fridayContents, fridayContents.length]);
  // };
  // const removeContent = (index: any) => {
  //   setNewContents(newContents.filter((_, i) => i !== index));
  // };
  // const removetuesdayContent = (index: any) => {
  //   settuesdayContents(tuesdayContents.filter((_, i) => i !== index));
  // };
  // const removewednessdayContent = (index: any) => {
  //   setwednessdayContents(wednessdayContents.filter((_, i) => i !== index));
  // };
  // const removethursdayContents = (index: any) => {
  //   setthursdayContents(thursdayContents.filter((_, i) => i !== index));
  // };
  // const removefridayContents = (index: any) => {
  //   setfridayContents(fridayContents.filter((_, i) => i !== index));
  // };

  // future me eski jarurat padegi tn use karenge 

  //  interface Teachers {
  //   id:number;
  //   firstname:string;
  //   lastname:string;
  //  }

  //   const [teachers, setTeachers] = useState<Teachers[]>([])

  //   useEffect(() => {
  //     const fetchTeachers = async () => {
  //       try {
  //         const { data } = await allTeacherForOption()
  //         if(data.success){
  //           setTeachers(data.data)
  //         }
  //       } catch (error) {
  //         console.log(error)

  //       }
  //     }

  //     fetchTeachers()
  //   } ,[])

  //   const teacherOption = (teachers || []).map((teacher) => ({
  //     value: teacher.id,
  //     label: `${teacher.firstname} ${teacher.lastname}`,
  //   }));
  // future me eski jarurat padegi tn use karenge 

  interface TimeTable {
    day: string;
    subject: string;
    class: string;
    section: string;
    teacher: string;
    timefrom: string;
    timeto: string;
  }

  const [tableData, setTableData] = useState<TimeTable>({
    day: "Monday",
    subject: "",
    class: "",
    section: "",
    teacher: "",
    timefrom: "",
    timeto: "",
  });

  // 🔹 for other inputs (subject, class, etc.)
  const handleSelectChange = (name: keyof TimeTable, value: string | number) => {
    setTableData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 now use this instead of separate selectedDay
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    console.log(name, value)
    setTableData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitTable = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const res = await addTimeTable(tableData);
      console.log(res)
      if (res.data.success) {
        toast.success(res.data.message)
        fetchTimeTable()
        handleModalPopUp(`add_time_table`)
      }
    } catch (error) {
      console.log(error);

    }
  };


  // fetching time table 
  interface TimeTableData {
    id: number;
    class: string;
    section: string;
    subject: string;
    teacher: string;
    day: string;
    timefrom: string;
    timeto: string;
  }

  const [timeTable, setTimeTable] = useState<TimeTableData[]>([])
  const [timeTablefilter, setTimeTablefilter] = useState<TimeTableData[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const fetchTimeTable = async () => {
    setLoading(true)
    await new Promise((res) => setTimeout(res, 600))
    try {
      const { data } = await getTimeTable()
      console.log(data)
      if (data.success) {
        setTimeTable(data.timetable)
        setTimeTablefilter(data.timetable)
      }
    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    } finally {
      setLoading(false)
    }
  }
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const groupByDay = (data: TimeTableData[]): Record<string, TimeTableData[]> => {
    return data.reduce((acc: Record<string, TimeTableData[]>, item) => {
      if (!acc[item.day]) acc[item.day] = [];
      acc[item.day].push(item);
      return acc;
    }, {});

  };
  const groupedData = groupByDay(timeTablefilter);



  useEffect(() => {
    fetchTimeTable()
  }, [])

  // ------------------------------------------------filter

  // Filter
  interface FilterData {
    class: string;
    section: string;
  }

  const [filterData, setFilterData] = useState<FilterData>({
    class: "",
    section: "",
  });

  const handleFilterSelectChange = (name: keyof FilterData, value: string | number) => {
    setFilterData((prev) => ({ ...prev, [name]: value }));
  };
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const handleApplyClick = (e: React.FormEvent) => {
    e.preventDefault();
    // console.log(filterData);
    setTimeTablefilter(
      timeTable.filter(
        (item) =>
          item.class === filterData.class &&
          item.section === filterData.section
      )
    );
  };

  const handleResetFilter = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setFilterData({ class: "", section: "" });
    setTimeTablefilter(timeTable);
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };





  return (
    <div>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content content-two">
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Time Table</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">Academic</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Time Table
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
                  data-bs-target="#add_time_table"
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Time Table
                </Link>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Time Table</h4>
              <div className="d-flex align-items-center flex-wrap">
                <div className="dropdown mb-3 me-2">
                  <Link
                    to="#"
                    className="btn btn-outline-light bg-white dropdown-toggle"
                    data-bs-toggle="dropdown"
                    data-bs-auto-close="outside"
                    aria-expanded="false"
                  >
                    <i className="ti ti-filter me-2" />
                    Filter
                  </Link>
                  <div
                    className="dropdown-menu drop-width"
                    ref={dropdownMenuRef}
                  >

                    <form onSubmit={handleApplyClick}>
                      <div className="d-flex align-items-center border-bottom p-3">
                        <h4>Filter</h4>
                      </div>
                      <div className="p-3 border-bottom">
                        <div className="row">
                          <div className="col-md-12">
                          </div>
                          <div className="col-md-6">
                            <div className="mb-0">
                              <label className="form-label">Class</label>
                              <CommonSelect
                                className="select"
                                options={allClass}
                                onChange={(option) => handleFilterSelectChange('class', option ? option.value : "")}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-0">
                              <label className="form-label">Section</label>
                              <CommonSelect
                                className="select"
                                options={classSection}
                                onChange={(option) => handleFilterSelectChange('section', option ? option.value : "")}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 d-flex align-items-center justify-content-end">
                        <button className="btn btn-light me-3" onClick={handleResetFilter}>
                          Reset
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary"
                        // onClick={handleApplyClick}
                        >
                          Apply
                        </button>
                      </div>
                    </form>


                    {/* <form>
                      <div className="d-flex align-items-center border-bottom p-3">
                        <h4>Filter</h4>
                      </div>
                      <div className="p-3 pb-0 border-bottom">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Class</label>

                              <CommonSelect
                                className="select"
                                options={classSylabus}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Section</label>
                              <CommonSelect
                                className="select"
                                options={classSection}
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
                    </form> */}


                  </div>
                </div>
              </div>
            </div>
            <div className="card-body pb-0">

              <div className="d-flex flex-nowrap overflow-auto">


                {days.map((day) => (
                  <div key={day} className="d-flex flex-column me-4 flex-fill">
                    <div className="mb-3">
                      <h6>{day}</h6>
                    </div>

                    {loading ? (
                      [...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="rounded p-3 mb-4 d-flex flex-column bg-transparent-success"
                        >
                          <p className="d-flex align-items-center text-nowrap mb-1">
                            <Skeleton width={100} height={10} />
                          </p>
                          <p className="text-dark mt-2">
                            <Skeleton count={2} width={130} height={10} />
                          </p>
                          <div className="bg-white rounded p-1 mt-1 d-flex align-items-center">
                            <Skeleton circle width={23} height={23} />
                            <span className="ms-2">
                              <Skeleton width={100} height={10} />
                            </span>
                          </div>
                        </div>
                      ))
                    ) : groupedData[day]?.length ? (
                      groupedData[day].map((item) => (
                        <div
                          key={item.id}
                          className="rounded p-3 mb-4 d-flex flex-column bg-transparent-success"
                        >
                          <p className="d-flex align-items-center text-nowrap mb-1">
                            <i className="ti ti-clock me-1" />
                            {item.timefrom} - {item.timeto}
                          </p>
                          <p className="text-dark">Subject : {item.subject}</p>
                          <p className="text-dark">Class : {`${item.class}-${item.section}`}</p>
                          <div className="bg-white rounded p-1 mt-1">
                            <Link
                              to={routes.teacherDetails}
                              className="text-muted d-flex align-items-center"
                            >
                              <span className="avatar avatar-sm me-2">
                                <ImageWithBasePath
                                  src="assets/img/teachers/teacher-07.jpg"
                                  alt="Img"
                                />
                              </span>
                              {item.teacher}
                            </Link>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted">No classes</p>
                    )}
                  </div>
                ))}



              </div>

            </div>

            <div className="card-footer border-0 pb-0">
              <div className="row">
                <div className="col-lg-4 col-xxl-4 col-xl-4 d-flex">
                  <div className="card flex-fill">
                    <div className="card-body">
                      <span className="bg-primary badge badge-sm mb-2">
                        Morning Break
                      </span>
                      <p className="text-dark">
                        <i className="ti ti-clock me-1" />
                        10:30 to 10 :45 AM
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-xxl-3 d-flex">
                  <div className="card flex-fill">
                    <div className="card-body">
                      <span className="bg-warning badge badge-sm mb-2">
                        Lunch
                      </span>
                      <p className="text-dark">
                        <i className="ti ti-clock me-1" />
                        10:30 to 10 :45 AM
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-xxl-3 d-flex">
                  <div className="card flex-fill">
                    <div className="card-body">
                      <span className="bg-info badge badge-sm mb-2">
                        Evening Break
                      </span>
                      <p className="text-dark">
                        <i className="ti ti-clock me-1" />
                        03:30 PM to 03:45 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      <>
        {/* Add Class Time Table */}
        <div className="modal fade" id="add_time_table">
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Time Table</h4>
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
                    <div className="col-lg-4">
                      <div className="mb-3">
                        <label className="form-label">Class</label>
                        <CommonSelect
                          className="select"
                          options={allClass}
                          onChange={(option) => handleSelectChange("class", option ? option.value : "")}
                        />
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="mb-3">
                        <label className="form-label">Section</label>
                        <CommonSelect
                          className="select"
                          options={classSection}
                          onChange={(option) => handleSelectChange("section", option ? option.value : "")}
                        />
                      </div>
                    </div>

                  </div>

                  <div className="add-more-timetable">

                    <ul className="tab-links nav nav-pills" id="pills-tab2" role="tablist">
                      {days.map((day) => (
                        <li className="nav-item" key={day}>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="day"
                              id={day}
                              value={day}
                              checked={tableData.day === day}
                              onChange={handleChange}
                            />
                            <label className="form-check-label" htmlFor={day}>
                              {day.charAt(0).toUpperCase() + day.slice(1)}
                            </label>
                          </div>
                        </li>
                      ))}
                    </ul>


                    <div className="tab-content pt-0 dashboard-tab">
                      <div
                        className="tab-pane fade show active"
                        id="pills-monday"
                        role="tabpanel"
                        aria-labelledby="pills-monday-tab"
                      >
                        {newContents.map((_, index) => (
                          <div key={index} className="add-timetable-row">
                            <div className="row timetable-count">
                              <div className="col-lg-3">
                                <div className="mb-3">
                                  <label className="form-label">Subject</label>
                                  <CommonSelect
                                    className="select"
                                    options={language}
                                    onChange={(option) => handleSelectChange("subject", option ? option.value : "")}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-3">
                                <div className="mb-3">
                                  <label className="form-label">Teacher</label>
                                  <CommonSelect
                                    className="select"
                                    options={teacher}
                                    onChange={(option) => handleSelectChange("teacher", option ? option.value : "")}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-3">
                                <div className="mb-3">
                                  <label className="form-label">Time From</label>
                                  <CommonSelect
                                    className="select"
                                    options={Time}
                                    onChange={(option) => handleSelectChange("timefrom", option ? option.value : "")}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-3">
                                <div className="d-flex align-items-end">
                                  <div className="mb-3 flex-fill">
                                    <label className="form-label">Time To</label>
                                    <CommonSelect
                                      className="select"
                                      options={Timeto}
                                      onChange={(option) => handleSelectChange("timeto", option ? option.value : "")}
                                    />
                                  </div>
                                  {newContents.length > 1 && (
                                    <div className="mb-3 ms-2">
                                      <Link to="#" className="delete-time-table">
                                        <i className="ti ti-trash" />
                                      </Link>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        <div>
                          <Link
                            to="#"
                            className="btn btn-primary add-new-timetable"
                            onClick={addNewContent}
                          >
                            <i className="ti ti-square-rounded-plus-filled me-2" />
                            Add New
                          </Link>
                        </div>
                      </div>

                      {/* <div
                        className="tab-pane fade"
                        id="pills-tuesday"
                        role="tabpanel"
                        aria-labelledby="pills-tuesday-tab"
                      >
                        {tuesdayContents.map((_, index) => (
                          <div className="add-timetable-row">
                            <div className="row timetable-count">
                              <div className="col-lg-3">
                                <div className="mb-3">
                                  <label className="form-label">Subject</label>
                                  <CommonSelect
                                    className="select"
                                    options={language}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-3">
                                <div className="mb-3">
                                  <label className="form-label">Teacher</label>
                                  <CommonSelect
                                    className="select"
                                    options={teacher}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-3">
                                <div className="mb-3">
                                  <label className="form-label">Time From</label>
                                  <CommonSelect
                                    className="select"
                                    options={Time}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-3">
                                <div className="d-flex align-items-end">
                                  <div className="mb-3 flex-fill">
                                    <label className="form-label">Time To</label>
                                    <CommonSelect
                                      className="select"
                                      options={Timeto}
                                    />
                                  </div>
                                  {tuesdayContents.length > 1 && (
                                    <div className="mb-3 ms-2">
                                      <Link to="#" className="delete-time-table" onClick={() => removetuesdayContent(index)}>
                                        <i className="ti ti-trash" />
                                      </Link>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        <div>
                          <Link
                            to="#" onClick={addTuesdayContent}
                            className="btn btn-primary add-new-timetable"
                          >
                            <i className="ti ti-square-rounded-plus-filled me-2" />
                            Add New
                          </Link>
                        </div>
                      </div>

                      <div
                        className="tab-pane fade"
                        id="pills-wednesday"
                        role="tabpanel"
                        aria-labelledby="pills-wednesday-tab"
                      >
                        {wednessdayContents.map((_, index) => (
                          <div className="add-timetable-row">
                            <div className="row timetable-count">
                              <div className="col-lg-3">
                                <div className="mb-3">
                                  <label className="form-label">Subject</label>
                                  <CommonSelect
                                    className="select"
                                    options={language}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-3">
                                <div className="mb-3">
                                  <label className="form-label">Teacher</label>
                                  <CommonSelect
                                    className="select"
                                    options={teacher}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-3">
                                <div className="mb-3">
                                  <label className="form-label">Time From</label>

                                  <CommonSelect
                                    className="select"
                                    options={Time}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-3">
                                <div className="d-flex align-items-end">
                                  <div className="mb-3 flex-fill">
                                    <label className="form-label">Time To</label>
                                    <CommonSelect
                                      className="select"
                                      options={Time}
                                    />
                                  </div>
                                  {wednessdayContents.length > 1 && (
                                    <div className="mb-3 ms-2">
                                      <Link to="#" className="delete-time-table" onClick={() => removewednessdayContent(index)}>
                                        <i className="ti ti-trash" />
                                      </Link>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        <div>

                          <Link
                            to="#"
                            className="btn btn-primary add-new-timetable" onClick={addwednessdayContent}
                          >
                            <i className="ti ti-square-rounded-plus-filled me-2" />
                            Add New
                          </Link>
                        </div>
                      </div>

                      <div
                        className="tab-pane fade"
                        id="pills-thursday"
                        role="tabpanel"
                        aria-labelledby="pills-thursday-tab"
                      >
                        {thursdayContents.map((_, index) => (
                          <div className="add-timetable-row">
                            <div className="row timetable-count">
                              <div className="col-lg-3">
                                <div className="mb-3">
                                  <label className="form-label">Subject</label>
                                  <CommonSelect
                                    className="select"
                                    options={language}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-3">
                                <div className="mb-3">
                                  <label className="form-label">Teacher</label>
                                  <CommonSelect
                                    className="select"
                                    options={routinename}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-3">
                                <div className="mb-3">
                                  <label className="form-label">Time From</label>
                                  <CommonSelect
                                    className="select"
                                    options={Time}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-3">
                                <div className="d-flex align-items-end">
                                  <div className="mb-3 flex-fill">
                                    <label className="form-label">Time To</label>
                                    <CommonSelect
                                      className="select"
                                      options={Time}
                                    />
                                  </div>
                                  {thursdayContents.length > 1 && (
                                    <div className="mb-3 ms-2">
                                      <Link to="#" className="delete-time-table" onClick={() => removethursdayContents(index)}>
                                        <i className="ti ti-trash" />
                                      </Link>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        <div>
                          <Link
                            to="#"
                            className="btn btn-primary add-new-timetable" onClick={addthursdayContents}
                          >
                            <i className="ti ti-square-rounded-plus-filled me-2" />
                            Add New
                          </Link>
                        </div>
                      </div>

                      <div
                        className="tab-pane fade"
                        id="pills-friday"
                        role="tabpanel"
                        aria-labelledby="pills-friday-tab"
                      >
                        {fridayContents.map((_, index) => (
                          <div className="add-timetable-row">
                            <div className="row timetable-count">
                              <div className="col-lg-3">
                                <div className="mb-3">
                                  <label className="form-label">Subject</label>
                                  <CommonSelect
                                    className="select"
                                    options={language}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-3">
                                <div className="mb-3">
                                  <label className="form-label">Teacher</label>
                                  <CommonSelect
                                    className="select"
                                    options={teacher}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-3">
                                <div className="mb-3">
                                  <label className="form-label">Time From</label>
                                  <CommonSelect
                                    className="select"
                                    options={Time}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-3">
                                <div className="d-flex align-items-end">
                                  <div className="mb-3 flex-fill">
                                    <label className="form-label">Time To</label>
                                    <CommonSelect
                                      className="select"
                                      options={Timeto}
                                    />
                                  </div>
                                  {fridayContents.length > 1 && (
                                    <div className="mb-3 ms-2">
                                      <Link to="#" className="delete-time-table" onClick={() => removefridayContents(index)}>
                                        <i className="ti ti-trash" />
                                      </Link>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        <div>
                          <Link
                            to="#"
                            className="btn btn-primary add-new-timetable" onClick={addfridayContents}
                          >
                            <i className="ti ti-square-rounded-plus-filled me-2" />
                            Add New
                          </Link>
                        </div>
                      </div> */}

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
                  <button
                    onClick={handleSubmitTable}
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                  >
                    Add Time Table
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
        {/* /Add Class Time Table */}
      </>
    </div>
  );
};

export default ClassTimetable;
