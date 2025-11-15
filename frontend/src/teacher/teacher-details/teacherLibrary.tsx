
import { Link, useParams } from "react-router-dom";
import { all_routes } from "../../router/all_routes";

// import ImageWithBasePath from "../../../../core/common/imageWithBasePath";
import TeacherModal from "../teacherModal";
import TeacherSidebar from "./teacherSidebar";
import TeacherBreadcrumb from "./teacherBreadcrumb";
import { useEffect, useState } from "react";
import { getspeteacherissuebookdata, Imageurl} from "../../service/api";
import { Skeleton } from "antd";
import dayjs from 'dayjs'
import { getSpecTeacherProfileDetails } from "../../service/teacherDashboardApi";

export interface IssuedBook {
  id: number;
  takenOn: string;
  last_date: string;
  bookId: string;
  bookImg: string;
  bookName: string;
  status: string;
}

const TeacherLibrary = () => {
  const routes = all_routes;
  const { teacher_id } = useParams();
  const [teacher, setTeacher] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const token = localStorage.getItem("token");
  const userId = token ? JSON.parse(token).id : null;
  const [issuedBookInfo, setIssuedBookInfo] = useState<IssuedBook[]>([])


  const fetchTeacher = async (userId: number) => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 500));
    try {
      const { data } = await getSpecTeacherProfileDetails(userId);
      if (data.success) {
        setTeacher(data.data);
        fetchIsuueBook(data.data.teacher_id)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchTeacher(userId);
    }
  }, [userId]);




  const fetchIsuueBook = async (teacherId: number) => {
    
    try {
      const { data } = await getspeteacherissuebookdata(teacherId);
      console.log(data)
      if (data.success) {
        setIssuedBookInfo(data.data);

      } else {
        console.warn("Failed to fetch Issue book  data");
        setIssuedBookInfo([]);
      }
    } catch (error) {
      console.error("❌ Error fetching issue book data:", error);
      setIssuedBookInfo([]);
    }
  };



  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            {/* Page Header */}
            {teacher_id && (<TeacherBreadcrumb teacher_id={teacher_id} />)}
            {/* /Page Header */}
          </div>
          <div className="row">
            {/* Student Information */}
            <TeacherSidebar teacher={teacher} loading={loading} />
            {/* /Student Information */}
            <div className="col-xxl-9 col-xl-8">
              <div className="row">
                <div className="col-md-12">
                  {/* List */}
                  <ul className="nav nav-tabs nav-tabs-bottom mb-4">
                    <li>
                      <Link to={`${routes.teacherDetails}/${teacher.teacher_id}`} className="nav-link ">
                        <i className="ti ti-school me-2" />
                        Teacher Details
                      </Link>
                    </li>
                    <li>
                      <Link to={`${routes.teachersRoutine}/${teacher.teacher_id}`} className="nav-link">
                        <i className="ti ti-table-options me-2" />
                        Routine
                      </Link>
                    </li>
                    <li>
                      <Link to={`${routes.teacherLeaves}/${teacher.teacher_id}`} className="nav-link">
                        <i className="ti ti-calendar-due me-2" />
                        Leave &amp; Attendance
                      </Link>
                    </li>
                    <li>
                      <Link to={`${routes.teacherSalary}/${teacher.teacher_id}`} className="nav-link">
                        <i className="ti ti-report-money me-2" />
                        Salary
                      </Link>
                    </li>
                    <li>
                      <Link to={`${routes.teacherLibrary}/${teacher.teacher_id}`} className="nav-link active">
                        <i className="ti ti-bookmark-edit me-2" />
                        Library
                      </Link>
                    </li>
                  </ul>
                  {/* /List */}
                  <div className="card">
                    <div className="card-header d-flex align-items-center justify-content-between">
                      <h5>Library</h5>
                      <div className="dropdown">
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
                            <Link to="#" className="dropdown-item rounded-1">
                              This Year
                            </Link>
                          </li>
                          <li>
                            <Link to="#" className="dropdown-item rounded-1">
                              This Month
                            </Link>
                          </li>
                          <li>
                            <Link to="#" className="dropdown-item rounded-1">
                              This Week
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="card-body pb-1">
                      <div className="row">

                        {
                          loading ? (
                            [...Array(3)].map((_, index) => (
                              <div className="col-xxl-4 col-md-6 d-flex" key={index}>
                                <div className="card mb-3 flex-fill">
                                  <div className="card-body pb-1">
                                    {/* Image placeholder (same size as real image) */}
                                    <span className="avatar avatar-xl mb-3 d-flex align-items-center justify-content-center">
                                      <Skeleton.Avatar active size={80} shape="square" />
                                    </span>

                                    {/* Book title placeholder */}
                                    <div className="mb-3">
                                      <Skeleton.Input active style={{ width: "70%", height: 20 }} />
                                    </div>

                                    {/* Row placeholders */}
                                    <div className="row">
                                      <div className="col-sm-6">
                                        <div className="mb-3">
                                          <Skeleton.Input active style={{ width: "80%", height: 16 }} />
                                          <Skeleton.Input active style={{ width: "60%", height: 16, marginTop: 6 }} />
                                        </div>
                                      </div>
                                      <div className="col-sm-6">
                                        <div className="mb-3">
                                          <Skeleton.Input active style={{ width: "80%", height: 16 }} />
                                          <Skeleton.Input active style={{ width: "60%", height: 16, marginTop: 6 }} />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : issuedBookInfo.length > 0 ? (
                            issuedBookInfo.map((book) => (
                              <div className="col-xxl-4 col-md-6 d-flex" key={book.id}>
                                <div className="card mb-3 flex-fill">

                                  <div className="card-body pb-1">

                                    <span className="avatar avatar-xl mb-3">
                                      <img
                                        src={`${Imageurl}/${book.bookImg}`}
                                        className="img-fluid rounded"
                                        alt={book.bookName}
                                      />
                                    </span>
                                    <div className="d-flex align-item-center justify-content-between">
                                      <h6 className="mb-3">{book.bookName}</h6>
                                      <p className={`badge ${book.status === "Taken" ? "text-danger" : "text-success"}`}>
                                        {book.status}
                                      </p>


                                    </div>
                                    <div className="row">
                                      <div className="col-sm-6">
                                        <div className="mb-3">
                                          <span className="fs-12 mb-1">Book taken on</span>
                                          <p className="text-dark" >{dayjs(book.takenOn).format('DD MMM YYYY')}</p>
                                        </div>
                                      </div>
                                      <div className="col-sm-6">
                                        <div className="mb-3">
                                          <span className="fs-12 mb-1">Last Date</span>
                                          <p className="text-dark">{dayjs(book.last_date).format('DD MMM YYYY')}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <>No issued book</>
                          )
                        }
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
      {teacher_id && (<TeacherModal onAdd={() => { }} teacherId={teacher_id} />)}
    </>
  );
};

export default TeacherLibrary;
