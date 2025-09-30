// import { useEffect, useRef, useState } from "react";
// // import { classhomework } from "../../../core/data/json/class_home_work";
// import Table from "../../../core/common/dataTable/index";
// import {
//   allClass,
//   classSection,
//   classSylabus,
//   language,
//   weak,
// } from "../../../core/common/selectoption/selectoption";
// import type { Homework, HomeworkFormData, TableData, Teachers } from "../../../core/data/interface";
// import CommonSelect from "../../../core/common/commonSelect";
// import PredefinedDateRanges from "../../../core/common/datePicker";
// import { Link } from "react-router-dom";

// import { all_routes } from "../../router/all_routes";
// import TooltipOption from "../../../core/common/tooltipOption";
// import { DatePicker } from "antd";
// import dayjs from 'dayjs'
// import { addHomeWork, allHomeWork, allTeacherForOption, Imageurl } from "../../../service/api";
// import { toast } from "react-toastify";
// import { handleModalPopUp } from "../../../handlePopUpmodal";

// const ClassHomeWork = () => {
//   const routes = all_routes;

//   // const data = classhomework;
//   const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
//   const handleApplyClick = () => {
//     if (dropdownMenuRef.current) {
//       dropdownMenuRef.current.classList.remove("show");
//     }
//   };

//   const [teachers, setTeachers] = useState<Teachers[]>([])
//   const [homeWorks, setHomeWorks] = useState<Homework[]>([])
//   const [loading, setLoading] = useState<boolean>(false)

//   const fethcHomeWorks = async () => {
//     setLoading(true)
//     await new Promise((res) => setTimeout(res, 500))
//     try {
//       const { data } = await allHomeWork()

//       if (data.success) {
//         setHomeWorks(data.data)
//       }

//     } catch (error) {
//       console.log(error)

//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     const fetchTeachers = async () => {
//       setLoading(true)
//       try {
//         const { data } = await allTeacherForOption()
//         if (data.success) {
//           setTeachers(data.data)
//         }
//         await fethcHomeWorks()

//       } catch (error) {
//         console.log(error)

//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchTeachers()
//   }, [])

//   const teacherOption = (teachers || []).map((teacher) => ({
//     value: teacher.teacher_id,
//     label: `${teacher.firstname} ${teacher.lastname}`,
//   }));


//   const tableData = homeWorks.map((hw) => ({
//     key: hw.id,
//     id: hw.id,
//     section: hw.section,
//     class: hw.className,
//     subject: hw.subject,
//     homeworkDate: dayjs(hw.homeworkDate).format('DD MMM YYYY'),
//     submissionDate:  dayjs(hw.submissionDate).format('DD MMM YYYY'),
//     createdBy: `${hw.firstname} ${hw.lastname}`,
//     img: hw.img_src
//   }))

//   // add homework
//   const [formData, setFormData] = useState<HomeworkFormData>({
//     className: "",
//     section: "",
//     subject: "",
//     homeworkDate: "",
//     submissionDate: "",
//     teacherId: "",
//     status: "1",
//     attachments: "",
//     description: "",
//   });

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value, type } = e.target;

//     if (type === "checkbox" && e.target instanceof HTMLInputElement) {
//       const checked = e.target.checked;
//       setFormData((prev) => ({
//         ...prev,
//         [name]: checked ? "1" : "0",
//       }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };


//   const handleSelectChange = (name: keyof HomeworkFormData, value: string | number) => {
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleDateChange = (name: keyof HomeworkFormData, date: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       [name]: date,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     console.log("Homework Form Data:", formData);
//     try {

//       const { data } = await addHomeWork(formData)
//       if (data.success) {
//         toast.success(data.message)
//         await fethcHomeWorks()
//         handleModalPopUp('add_home_work')
//         setFormData({
//           className: "",
//           section: "",
//           subject: "",
//           homeworkDate: "",
//           submissionDate: "",
//           teacherId: "",
//           status: "1",
//           attachments: "",
//           description: "",
//         })
//       }

//     } catch (error) {
//       console.log(error)

//     }
//   };

//   const columns = [
//     {
//       title: "ID",
//       dataIndex: "id",
//       render: (text: number) => (
//         <>
//           <Link to="#" className="link-primary">
//             {text}
//           </Link>
//         </>
//       ),
//       sorter: (a: TableData, b: TableData) => a.class.length - b.class.length,
//     },

//     {
//       title: "Class",
//       dataIndex: "class",
//       sorter: (a: TableData, b: TableData) => a.class.length - b.class.length,
//     },
//     {
//       title: "Section",
//       dataIndex: "section",
//       sorter: (a: TableData, b: TableData) =>
//         a.section.length - b.section.length,
//     },
//     {
//       title: "Subject",
//       dataIndex: "subject",
//       sorter: (a: TableData, b: TableData) =>
//         a.subject.length - b.subject.length,
//     },
//     {
//       title: "Homework Date",
//       dataIndex: "homeworkDate",
//       sorter: (a: TableData, b: TableData) =>
//         a.homeworkDate.length - b.homeworkDate.length,
//     },
//     {
//       title: "Submission Date",
//       dataIndex: "submissionDate",
//       sorter: (a: TableData, b: TableData) =>
//         a.submissionDate.length - b.submissionDate.length,
//     },
//     {
//       title: "CreatedBy",
//       dataIndex: "createdBy",
//       render: (text: string, record: any) => (
//         <div className="d-flex align-items-center">
//           <Link to="#" className="avatar avatar-md">
//             <img
//               src={`${Imageurl}/${record.img}`}
//               className="rounded-circle object-fit-cover"
//               alt="img"
//             />
//           </Link>
//           <div className="ms-2">
//             <p className="text-dark mb-0">
//               <Link to="#">{text}</Link>
//             </p>
//           </div>
//         </div>
//       ),
//       sorter: (a: TableData, b: TableData) =>
//         a.createdBy.length - b.createdBy.length,
//     },

//     {
//       title: "Action",
//       dataIndex: "action",
//       render: () => (
//         <>
//           <div className="dropdown">
//             <Link
//               to="#"
//               className="btn btn-white btn-icon btn-sm d-flex align-items-center justify-content-center rounded-circle p-0"
//               data-bs-toggle="dropdown"
//               aria-expanded="false"
//             >
//               <i className="ti ti-dots-vertical fs-14" />
//             </Link>
//             <ul className="dropdown-menu dropdown-menu-right p-3">
//               <li>
//                 <Link
//                   className="dropdown-item rounded-1"
//                   to="#"
//                   data-bs-toggle="modal"
//                   data-bs-target="#edit_home_work"
//                 >
//                   <i className="ti ti-edit-circle me-2" />
//                   Edit
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   className="dropdown-item rounded-1"
//                   to="#"
//                   data-bs-toggle="modal"
//                   data-bs-target="#delete-modal"
//                 >
//                   <i className="ti ti-trash-x me-2" />
//                   Delete
//                 </Link>
//               </li>
//             </ul>
//           </div>
//         </>
//       ),
//     },
//   ];






//   return (
//     <div>
//       <>
//         {/* Page Wrapper */}
//         <div className="page-wrapper">
//           <div className="content">
//             {/* Page Header */}
//             <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
//               <div className="my-auto mb-2">
//                 <h3 className="page-title mb-1">Class Work</h3>
//                 <nav>
//                   <ol className="breadcrumb mb-0">
//                     <li className="breadcrumb-item">
//                       <Link to={routes.adminDashboard}>Dashboard</Link>
//                     </li>
//                     <li className="breadcrumb-item">
//                       <Link to="#">Academic </Link>
//                     </li>
//                     <li className="breadcrumb-item active" aria-current="page">
//                       Class Work
//                     </li>
//                   </ol>
//                 </nav>
//               </div>
//               <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
//                 <TooltipOption />
//                 <div className="mb-2">
//                   <Link
//                     to="#"
//                     className="btn btn-primary"
//                     data-bs-toggle="modal"
//                     data-bs-target="#add_home_work"
//                   >
//                     <i className="ti ti-square-rounded-plus-filled me-2" />
//                     Add Home Work
//                   </Link>
//                 </div>
//               </div>
//             </div>
//             {/* /Page Header */}
//             {/* Guardians List */}
//             <div className="card">
//               <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
//                 <h4 className="mb-3">Class Home Work</h4>
//                 <div className="d-flex align-items-center flex-wrap">
//                   <div className="input-icon-start mb-3 me-2 position-relative">
//                     <PredefinedDateRanges />
//                   </div>
//                   <div className="dropdown mb-3 me-2">
//                     <Link
//                       to="#"
//                       className="btn btn-outline-light bg-white dropdown-toggle"
//                       data-bs-toggle="dropdown"
//                       data-bs-auto-close="outside"
//                     >
//                       <i className="ti ti-filter me-2" />
//                       Filter
//                     </Link>
//                     <div className="dropdown-menu drop-width" ref={dropdownMenuRef}>
//                       <form >
//                         <div className="d-flex align-items-center border-bottom p-3">
//                           <h4>Filter</h4>
//                         </div>
//                         <div className="p-3 border-bottom pb-0">
//                           <div className="row">
//                             <div className="col-md-12">
//                               <div className="mb-3">
//                                 <label className="form-label">Subject</label>
//                                 <CommonSelect
//                                   className="select"
//                                   options={language}
//                                 />
//                               </div>
//                             </div>
//                             <div className="col-md-12">
//                               <div className="mb-3">
//                                 <label className="form-label">Class</label>

//                                 <CommonSelect
//                                   className="select"
//                                   options={classSylabus}
//                                 />
//                               </div>
//                             </div>
//                             <div className="col-md-12">
//                               <div className="mb-3">
//                                 <label className="form-label">Section</label>

//                                 <CommonSelect
//                                   className="select"
//                                   options={classSection}
//                                 />
//                               </div>
//                             </div>
//                             <div className="col-md-12">
//                               <div className="mb-3">
//                                 <label className="form-label">Date</label>
//                                 <CommonSelect
//                                   className="select"
//                                   options={weak}
//                                 />
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="p-3 d-flex align-items-center justify-content-end">
//                           <Link to="#" className="btn btn-light me-3">
//                             Reset
//                           </Link>
//                           <Link
//                             to="#"
//                             className="btn btn-primary"
//                             onClick={handleApplyClick}
//                           >
//                             Apply
//                           </Link>
//                         </div>
//                       </form>
//                     </div>
//                   </div>
//                   <div className="dropdown mb-3">
//                     <Link
//                       to="#"
//                       className="btn btn-outline-light bg-white dropdown-toggle"
//                       data-bs-toggle="dropdown"
//                     >
//                       <i className="ti ti-sort-ascending-2 me-2" />
//                       Sort by A-Z
//                     </Link>
//                     <ul className="dropdown-menu p-3">
//                       <li>
//                         <Link to="#" className="dropdown-item rounded-1 active">
//                           Ascending
//                         </Link>
//                       </li>
//                       <li>
//                         <Link to="#" className="dropdown-item rounded-1">
//                           Descending
//                         </Link>
//                       </li>
//                       <li>
//                         <Link to="#" className="dropdown-item rounded-1">
//                           Recently Viewed
//                         </Link>
//                       </li>
//                       <li>
//                         <Link to="#" className="dropdown-item rounded-1">
//                           Recently Added
//                         </Link>
//                       </li>
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//               <div className="card-body p-0 py-3">
//                 {/* Guardians List */}
//                 {
//                   loading ? (
//                     <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
//                       <div className="spinner-border text-primary" role="status">
//                         <span className="visually-hidden">Loading...</span>
//                       </div>
//                     </div>
//                   ) : (<Table columns={columns} dataSource={tableData} Selection={true} />)
//                 }

//                 {/* /Guardians List */}
//               </div>
//             </div>
//             {/* /Guardians List */}
//           </div>
//         </div>
//         {/* /Page Wrapper */}
//         {/* Add Home Work */}
//         <div className="modal fade" id="add_home_work">
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h4 className="modal-title">Add Home Work</h4>
//                 <button
//                   type="button"
//                   className="btn-close custom-btn-close"
//                   data-bs-dismiss="modal"
//                   aria-label="Close"
//                 >
//                   <i className="ti ti-x" />
//                 </button>
//               </div>
//               <form onSubmit={handleSubmit}>
//                 <div className="modal-body">
//                   <div className="row">
//                     <div className="col-md-12">
//                       {/* Class */}
//                       <div className="mb-3">
//                         <label className="form-label">Class</label>
//                         <CommonSelect
//                           className="select"
//                           options={allClass}
//                           onChange={(opt) =>
//                             handleSelectChange("className", opt?.value || "")
//                           }
//                         />
//                       </div>

//                       {/* Section + Subject */}
//                       <div className="row">
//                         <div className="col-md-6">
//                           <div className="mb-3">
//                             <label className="form-label">Section</label>
//                             <CommonSelect
//                               className="select"
//                               options={classSection}
//                               onChange={(opt) =>
//                                 handleSelectChange("section", opt?.value || "")
//                               }
//                             />
//                           </div>
//                         </div>
//                         <div className="col-md-6">
//                           <div className="mb-3">
//                             <label className="form-label">Subject</label>
//                             <CommonSelect
//                               className="select"
//                               options={language}
//                               onChange={(opt) =>
//                                 handleSelectChange("subject", opt?.value || "")
//                               }
//                             />
//                           </div>
//                         </div>
//                       </div>

//                       {/* Teacher */}
//                       <div className="mb-3">
//                         <label className="form-label">Teacher</label>
//                         <CommonSelect
//                           className="select"
//                           options={teacherOption}
//                           // defaultValue={teacher[0].label}
//                           onChange={(opt) =>
//                             handleSelectChange("teacherId", opt?.value || "")
//                           }
//                         />
//                       </div>

//                       {/* Homework Date + Submission Date */}
//                       <div className="row">
//                         <div className="col-md-6">
//                           <div className="mb-3">
//                             <label className="form-label">Home Work Date</label>
//                             <div className="input-icon position-relative">
//                               <DatePicker
//                                 className="form-control datetimepicker"
//                                 format="DD MMM YYYY"
//                                 value={
//                                   formData.homeworkDate
//                                     ? dayjs(formData.homeworkDate, "DD MMM YYYY")
//                                     : null
//                                 }
//                                 placeholder="Select Date"
//                                 onChange={(dateString) =>
//                                   handleDateChange("homeworkDate", Array.isArray(dateString) ? dateString[0] : dateString)
//                                 }
//                               />
//                               <span className="input-icon-addon">
//                                 <i className="ti ti-calendar" />
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="col-md-6">
//                           <div className="mb-3">
//                             <label className="form-label">Submission Date</label>
//                             <div className="input-icon position-relative">
//                               <DatePicker
//                                 className="form-control datetimepicker"
//                                 format="DD MMM YYYY"
//                                 value={
//                                   formData.submissionDate
//                                     ? dayjs(formData.submissionDate, "DD MMM YYYY")
//                                     : null
//                                 }
//                                 placeholder="Select Date"
//                                 onChange={(dateString) =>
//                                   handleDateChange("submissionDate", Array.isArray(dateString) ? dateString[0] : dateString)
//                                 }
//                               />
//                               <span className="input-icon-addon">
//                                 <i className="ti ti-calendar" />
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Attachments */}
//                       <div className="mb-3">
//                         <label className="form-label">Attachments</label>
//                         <input
//                           type="text"
//                           name="attachments"
//                           value={formData.attachments}
//                           onChange={handleChange}
//                           className="form-control"
//                         />
//                       </div>

//                       {/* Description */}
//                       <div className="mb-3">
//                         <label className="form-label">Description</label>
//                         <textarea
//                           className="form-control"
//                           name="description"
//                           rows={4}
//                           value={formData.description}
//                           onChange={handleChange}
//                         />
//                       </div>

//                       {/* Status */}
//                       <div className="d-flex align-items-center justify-content-between">
//                         <div className="status-title">
//                           <h5>Status</h5>
//                           <p>Change the Status by toggle </p>
//                         </div>
//                         <div className="form-check form-switch">
//                           <input
//                             className="form-check-input"
//                             type="checkbox"
//                             name="status"
//                             checked={formData.status === "1"}
//                             onChange={handleChange}
//                             role="switch"
//                             id="switch-sm"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Footer */}
//                 <div className="modal-footer">
//                   <Link
//                     to="#"
//                     className="btn btn-light me-2"
//                     data-bs-dismiss="modal"
//                   >
//                     Cancel
//                   </Link>
//                   <button
//                     type="submit"
//                     className="btn btn-primary"
//                     data-bs-dismiss="modal"
//                   >
//                     Add Homework
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//         {/* /Add Home Work */}
//         {/* Edit Home Work */}
//         <div className="modal fade" id="edit_home_work">
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h4 className="modal-title">Edit Home Work</h4>
//                 <button
//                   type="button"
//                   className="btn-close custom-btn-close"
//                   data-bs-dismiss="modal"
//                   aria-label="Close"
//                 >
//                   <i className="ti ti-x" />
//                 </button>
//               </div>
//               <form>
//                 <div className="modal-body">
//                   <div className="row">
//                     <div className="col-md-12">
//                       <div className="mb-3">
//                         <label className="form-label">Class</label>
//                         <input
//                           type="text"
//                           className="form-control"
//                           placeholder="Enter Class"
//                           defaultValue="I"
//                         />
//                       </div>
//                       <div className="row">
//                         <div className="col-md-6">
//                           <div className="mb-3">
//                             <label className="form-label">Section</label>
//                             <CommonSelect
//                               className="select"
//                               options={classSection}
//                             />
//                           </div>
//                         </div>
//                         <div className="col-md-6">
//                           <div className="mb-3">
//                             <label className="form-label">Subject</label>

//                             <CommonSelect
//                               className="select"
//                               options={language}
//                             />
//                           </div>
//                         </div>
//                       </div>
//                       <div className="row">
//                         <div className="col-md-6">
//                           <div className="mb-3">
//                             <label className="form-label">Homework Date</label>
//                             <input
//                               type="text"
//                               className="form-control"
//                               placeholder="10 May 2024"
//                             />
//                           </div>
//                         </div>
//                         <div className="col-md-6">
//                           <div className="mb-3">
//                             <label className="form-label">
//                               Submission Date
//                             </label>
//                             <input
//                               type="text"
//                               className="form-control"
//                               placeholder="12 May 2024"
//                             />
//                           </div>
//                         </div>
//                       </div>
//                       <div className="mb-3">
//                         <label className="form-label">Attachments</label>
//                         <input
//                           type="text"
//                           className="form-control"
//                           placeholder="Placeholders"
//                         />
//                       </div>
//                       <div className="mb-3">
//                         <label className="form-label">Attachments</label>
//                         <textarea
//                           className="form-control"
//                           placeholder="Add Comment"
//                           rows={4}
//                           defaultValue={""}
//                         />
//                       </div>
//                       <div className="d-flex align-items-center justify-content-between">
//                         <div className="status-title">
//                           <h5>Status</h5>
//                           <p>Change the Status by toggle </p>
//                         </div>
//                         <div className="form-check form-switch">
//                           <input
//                             className="form-check-input"
//                             type="checkbox"
//                             role="switch"
//                             id="switch-sm2"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="modal-footer">
//                   <Link
//                     to="#"
//                     className="btn btn-light me-2"
//                     data-bs-dismiss="modal"
//                   >
//                     Cancel
//                   </Link>
//                   <Link
//                     to="#"
//                     className="btn btn-primary"
//                     data-bs-dismiss="modal"
//                   >
//                     Save Changes
//                   </Link>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//         {/* /Edit Home Work */}
//         {/* Delete Modal */}
//         <div className="modal fade" id="delete-modal">
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content">
//               <form >
//                 <div className="modal-body text-center">
//                   <span className="delete-icon">
//                     <i className="ti ti-trash-x" />
//                   </span>
//                   <h4>Confirm Deletion</h4>
//                   <p>
//                     You want to delete all the marked items, this cant be undone
//                     once you delete.
//                   </p>
//                   <div className="d-flex justify-content-center">
//                     <Link
//                       to="#"
//                       className="btn btn-light me-3"
//                       data-bs-dismiss="modal"
//                     >
//                       Cancel
//                     </Link>
//                     <Link
//                       to="#"
//                       className="btn btn-danger"
//                       data-bs-dismiss="modal"
//                     >
//                       Yes, Delete
//                     </Link>
//                   </div>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//         {/* /Delete Modal */}
//       </>
//     </div>
//   );
// };

// export default ClassHomeWork;
