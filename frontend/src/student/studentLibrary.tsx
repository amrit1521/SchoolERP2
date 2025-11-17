
import { Link} from "react-router-dom";
// import { all_routes } from "../router/all_routes";
// import StudentModals from "../studentModals";
// import StudentSidebar from "./studentSidebar";
// import StudentBreadcrumb from "./studentBreadcrumb";
// import ImageWithBasePath from "../../../../core/common/imageWithBasePath";
import { useEffect, useState } from "react";
import { getStudentLibraryData,Imageurl } from "../service/api";
import { Skeleton } from "antd";
import dayjs from 'dayjs'

export interface IssuedBook {
    id: number;
    takenOn: string;
    last_date: string;
    bookId: string;
    bookImg: string;
    bookName: string;
    status: string;
}


const SStudentLibrary = () => {
     const [issuedBookInfo, setIssuedBookInfo] = useState<IssuedBook[]>([])
     const [loading, setLoading] = useState<boolean>(false)
    //  const [userId ,setUserId] = useState<number|null>(null)
     


    const fetchIsuueBook = async (userId: number) => {
         setLoading(true)
        try {
            const res = await getStudentLibraryData(userId);
            //  console.log(res.data)
            if (res?.data?.success) {
                setIssuedBookInfo(res.data.data);

            } else {
                console.warn("Failed to fetch Issue book  data");
                setIssuedBookInfo([]);
            }
        } catch (error) {
            console.error("❌ Error fetching issue book data:", error);
            setIssuedBookInfo([]);
        }finally{
            setLoading(false)
        }
    };

    useEffect(()=>{
        const token = localStorage.getItem("token");
        if(token){
            fetchIsuueBook(JSON.parse(token).id)
        }
      
    },[])



    return (
        <>
            {/* Page Wrapper */}
            <div className="page-wrapper">
                <div className="content">
                    <div className="row">
                        {/* Page Header */}
                        {/* {token&&( <StudentBreadcrumb token={token} rollnum={Number(rollnum)} />)} */}
                        {/* /Page Header */}
                    </div>
                    <div className="row">
                        {/* Student Information */}
                        {/* <StudentSidebar student={student} loading={loading} /> */}
                        {/* /Student Information */}
                        <div className="col">
                            <div className="row">
                                <div className="col-md-12">

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
            {/* {student.rollnum && (<StudentModals onAdd={() => { }} rollnum={Number(student.rollnum)} />)} */}
        </>
    );
};

export default SStudentLibrary;
