
import {Link, useParams } from 'react-router-dom'
import ImageWithBasePath from '../../../../core/common/imageWithBasePath'
import { all_routes } from '../../../router/all_routes'
import StudentModals from '../studentModals'
import StudentSidebar from './studentSidebar'
import StudentBreadcrumb from './studentBreadcrumb'
import { useEffect, useState } from 'react'
import { getStuTimeTable, specificStudentData1 } from '../../../../service/api'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const StudentTimeTable = () => {
    const routes = all_routes

    interface TimeTable {
        id: number;
        class: string;
        section: string;
        subject: string;
        teacher: string;
        day: string;
        timefrom: string;
        timeto: string;
    }

    const { id } = useParams<{ id: string }>();
    const [student, setStudent] = useState<any>({})
    const [timeTable, setTimeTable] = useState<TimeTable[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [token , setToken] = useState<string|null>(null)


    useEffect(() => {
        setToken(localStorage.getItem('token'))
        const fetchStudentAndTimeTable = async () => {
            setLoading(true);
            try {
                const [studentRes, timetableRes] = await Promise.allSettled([
                    specificStudentData1(Number(id)),
                    getStuTimeTable(Number(id))
                ]);
                await new Promise((resolve)=>setTimeout(resolve, 500))
                // ✅ Student Data Handle
                if (studentRes.status === "fulfilled") {
                    setStudent(studentRes.value.data.student);
                } else {
                    console.error("Failed to fetch student:", studentRes.reason);
                    setStudent(null); // fallback
                }
                // ✅ Timetable Data Handle
                if (timetableRes.status === "fulfilled") {
                    setTimeTable(timetableRes.value.data.timetable);
                } else {
                    console.error("Failed to fetch timetable:", timetableRes.reason);
                    setTimeTable([]); // fallback
                }

            } catch (err) {
                console.error("Unexpected error in fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchStudentAndTimeTable();
    }, [id]);



    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


    const groupByDay = (data: TimeTable[]): Record<string, TimeTable[]> => {
        return data.reduce((acc: Record<string, TimeTable[]>, item) => {
            if (!acc[item.day]) acc[item.day] = [];
            acc[item.day].push(item);
            return acc;
        }, {});
    };



    const groupedData = groupByDay(timeTable);

    return (
        <>
            {/* Page Wrapper */}
            <div className="page-wrapper">
                <div className="content">
                    <div className="row">
                        {/* Page Header */}
                          {token&&( <StudentBreadcrumb token={token} />)}
                        {/* /Page Header */}
                    </div>
                    <div className="row">
                        {/* Student Information */}
                        <StudentSidebar student={student} loading={loading} />
                        {/* /Student Information */}
                        <div className="col-xxl-9 col-xl-8">
                            <div className="row">
                                <div className="col-md-12">
                                    {/* List */}
                                    <ul className="nav nav-tabs nav-tabs-bottom mb-4">
                                        <li>
                                            <Link to={`${routes.studentDetail}/${id}`} className="nav-link">
                                                <i className="ti ti-school me-2" />
                                                Student Details
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to={`${routes.studentTimeTable}/${id}`} className="nav-link active">
                                                <i className="ti ti-table-options me-2" />
                                                Time Table
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to={`${routes.studentLeaves}/${id}`} className="nav-link">
                                                <i className="ti ti-calendar-due me-2" />
                                                Leave &amp; Attendance
                                            </Link>

                                        </li>
                                        <li>
                                            <Link to={`${routes.studentFees}/${id}`} className="nav-link">
                                                <i className="ti ti-report-money me-2" />
                                                Fees
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to={`${routes.studentResult}/${id}`} className="nav-link">
                                                <i className="ti ti-bookmark-edit me-2" />
                                                Exam &amp; Results
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to={`${routes.studentLibrary}/${id}`} className="nav-link">
                                                <i className="ti ti-books me-2" />
                                                Library
                                            </Link>
                                        </li>
                                    </ul>
                                    {/* /List */}
                                    <div className="card">
                                        <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                                            <h4 className="mb-3">Time-Table</h4>
                                            <div className="d-flex align-items-center flex-wrap">
                                                <div className="dropdown mb-3">
                                                    <Link
                                                        to="#"
                                                        className="btn btn-outline-light border-white bg-white dropdown-toggle shadow-md"
                                                        data-bs-toggle="dropdown"
                                                    >
                                                        <i className="ti ti-calendar-due me-2" />
                                                        This Year
                                                    </Link>
                                                    <ul className="dropdown-menu p-3">
                                                        <li>
                                                            <Link
                                                                to="#"
                                                                className="dropdown-item rounded-1"
                                                            >
                                                                This Year
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link
                                                                to="#"
                                                                className="dropdown-item rounded-1"
                                                            >
                                                                This Month
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link
                                                                to="#"
                                                                className="dropdown-item rounded-1"
                                                            >
                                                                This Week
                                                            </Link>
                                                        </li>
                                                    </ul>
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

                                                        {loading ? ( // 👈 jab tak loading true hai skeleton dikhega
                                                            [...Array(2)].map((_, i) => (
                                                                <div key={i} className="bg-transparent-success rounded p-3 mb-4">
                                                                    <p className="mb-2">
                                                                        <Skeleton width={120} height={15} />
                                                                    </p>
                                                                    <p className="mb-2">
                                                                        <Skeleton width={180} height={15} />
                                                                    </p>
                                                                    <div className="bg-white rounded p-1 mt-3 d-flex align-items-center">
                                                                        <Skeleton circle width={35} height={35} />
                                                                        <span className="ms-2">
                                                                            <Skeleton width={100} height={15} />
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : groupedData[day]?.length ? (
                                                            groupedData[day].map((item) => (
                                                                <div key={item.id} className="bg-transparent-success rounded p-3 mb-4">
                                                                    <p className="d-flex align-items-center text-nowrap mb-1">
                                                                        <i className="ti ti-clock me-1" />
                                                                        {item.timefrom} - {item.timeto}
                                                                    </p>
                                                                    <p className="text-dark">Subject : {item.subject}</p>
                                                                    <div className="bg-white rounded p-1 mt-3">
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
                                                            <span className="bg-warning badge badge-sm mb-2">Lunch</span>
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

                        </div>
                    </div>
                </div>
            </div>
            {/* /Page Wrapper */}
            { student.rollnum && (<StudentModals onAdd={()=>{}} rollnum={Number(student.rollnum)} />)}
        </>

    )
}

export default StudentTimeTable