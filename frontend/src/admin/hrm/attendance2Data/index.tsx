import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Table from "../../../core/common/dataTable/index";
import CommonSelect from "../../../core/common/commonSelect";
import { toast } from "react-toastify";
import { getAllAttendanceData2, getAllSectionForAClass, getAttendanceData2, Imageurl } from "../../../service/api";
import { allRealClasses } from "../../../service/classApi";
import { Spinner } from "../../../spinner";
import { all_routes } from "../../../router/all_routes";
import { DatePicker } from "antd";
import dayjs from 'dayjs';
interface FromClass {
    class: number | null;
    section: number | null;
}
const routes = all_routes;

const AttendanceData2 = () => {
    const [students, setStudents] = useState<any[]>([]);
    const [classOptions, setClassOptions] = useState<any[]>([]);
    const [sectionOptions, setSectionOptions] = useState<any[]>([]);
    const [loadingStudents, setLoadingStudents] = useState<boolean>(false);
    const [fromClassData, setFromClassData] = useState<FromClass>({
        class: null,
        section: null,
    });
    const [date, setDate] = useState<any>('');

    const dropdownMenuRef = useRef<HTMLDivElement | null>(null);

    // Fetch Classes
    const fetchClass = async () => {
        try {
            const { data } = await allRealClasses();
            if (data.success) {
                setClassOptions(
                    data.data.map((e: any) => ({
                        value: e.id,
                        label: e.class_name,
                    }))
                );
            }
        } catch {
            toast.error("Error fetching classes");
        }
    };

    // Fetch Sections
    const fetchSection = async () => {
        if (!fromClassData.class) return;
        try {
            const { data } = await getAllSectionForAClass(Number(fromClassData.class));
            if (data.success) {
                setSectionOptions(
                    data.data.map((e: any) => ({
                        value: e.id,
                        label: e.section_name,
                    }))
                );
            }
        } catch {
            toast.error("Error fetching sections");
        }
    };

    const fetchAllStudents = async()=>{
        try {
            const {data} = await getAllAttendanceData2()
            if(data.success){
                setStudents(data.data)
              
            }    
        } catch (error) {
             console.log(error)
             
        }
    }

    useEffect(()=>{      
              fetchAllStudents() 
    } ,[])

    // Fetch Students
    const fetchStudents = async () => {
        if (!fromClassData.class || !fromClassData.section || !date) {
            toast.error("Please select class, section, and date!");
            return;
        }
        const formattedDate = dayjs(date).format('YYYY-MM-DD');
        const payload = {
            class: fromClassData.class,
            section: fromClassData.section,
            date: formattedDate,
        };


        try {
            setLoadingStudents(true);
            const { data } = await getAttendanceData2(payload);
            if (data.success) {
                setStudents(data.data || []);
                if (dropdownMenuRef.current) {
                    dropdownMenuRef.current.classList.remove("show");
                }
            } else {
                setStudents([]);
            }
        } catch {
            toast.error("Failed to fetch students");
        } finally {
            setLoadingStudents(false);
        }
    };

    useEffect(() => {
        fetchClass();
    }, []);

    useEffect(() => {
        fetchSection();
    }, [fromClassData.class]);

    const handleSelectChange = (name: keyof FromClass, value: number | null) => {
        setFromClassData((prev) => ({ ...prev, [name]: value }));
    };

   
    const handleDropdownClick = (e: React.MouseEvent) => {
        e.stopPropagation(); 
    };

       const handleReset = () => {
         if (dropdownMenuRef.current) {
                    dropdownMenuRef.current.classList.remove("show");
                }
        setFromClassData({ class: null, section: null });
        setDate("");
       fetchAllStudents()

    };


    // Table data
    const tableData = students.map((s: any) => ({
        key: s.student_rollnum,
        roll: s.student_rollnum,
        img: s.stu_img,
        className:s.class,
        section:s.section,
        admission: s.admissionnum,
        name: `${s.firstname} ${s.lastname}`,
        attendance: s.attendance,
    }));

    const columns = [
        { title: "Admission No", dataIndex: "admission" },
        { title: "Roll No", dataIndex: "roll" },
        {
            title: "Name",
            dataIndex: "name",
            render: (text: string, record: any) => (
                <div className="d-flex align-items-center">
                    <Link to={`${routes.studentDetail}/${record.roll}`} className="avatar avatar-md">
                        <img
                            src={`${Imageurl}/${record.img}`}
                            className="img-fluid rounded-circle"
                            alt="img"
                        />
                    </Link>
                    <div className="ms-2">
                        <p className="text-dark mb-0">
                            <Link to={`${routes.studentDetail}/${record.roll}`} >{text}</Link>
                        </p>
                    </div>
                </div>
            ),
            sorter: (a: any, b: any) =>
                a.name.length - b.name.length,
        },
         { title: "Class", dataIndex: "className" },
          { title: "Section", dataIndex: "section" },
        {
            title: "Attendance",
            render: (_: any, record: any) => {
                return (
                    <div className="">
                        {/* Present */}
                        <div
                            style={{
                             
                                border: `2px solid ${record.attendance === "Present" ? "#418a41" : "#cf4d4a"}`,  
                                borderRadius: 12,
                                padding: 5,
                                cursor: "pointer",
                                backgroundColor: record.attendance === "Present" ? "#418a41" : "#cf4d4a", 
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                fontWeight: "bold",
                            }}
                        >
                            {record.attendance === "Present" ? "Present - ✓" : "Absent - ✘"}
                        </div>
                    </div>
                );
            },
        },
    ];

    return (
        <div className="page-wrapper">
            <div className="content">
                {/* Page Header */}
                <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
                    <div className="my-auto mb-2">
                        <h3 className="page-title mb-1">Students List</h3>
                        <nav>
                            <ol className="breadcrumb mb-0">
                                <li className="breadcrumb-item">
                                    <Link to={routes.adminDashboard}>Dashboard</Link>
                                </li>
                                <li className="breadcrumb-item">Students</li>
                                <li className="breadcrumb-item active" aria-current="page">
                                    All Students
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>
                {/* /Page Header */}

                <div className="card">
                    <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                        <h4 className="mb-3">Students List</h4>
                        <div className="d-flex align-items-center flex-wrap">
                            <div className="input-icon-start mb-3 me-2 position-relative"></div>
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
                                    onClick={handleDropdownClick} // Prevent dropdown from closing
                                >
                                    <div className="d-flex align-items-center border-bottom p-3">
                                        <h4>Filter</h4>
                                    </div>
                                    <div className="p-3 pb-0 border-bottom">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label className="form-label">Class</label>
                                                    <CommonSelect
                                                        options={classOptions}
                                                        value={fromClassData.class}
                                                        onChange={(opt: any) =>
                                                            handleSelectChange("class", opt ? opt.value : null)
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label className="form-label">Section</label>
                                                    <CommonSelect
                                                        options={sectionOptions}
                                                        value={fromClassData.section}
                                                        onChange={(opt: any) =>
                                                            handleSelectChange("section", opt ? opt.value : null)
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Attendance Date</label>
                                                <div className="input-icon position-relative">
                                                    <DatePicker
                                                        className={`form-control datetimepicker `}
                                                        format="DD MMM YYYY"
                                                        value={date ? dayjs(date, "DD MMM YYYY") : null}
                                                        placeholder="Select Date"
                                                        onChange={(dateString) => setDate(dateString)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center gap-2 my-3">
                                        <button className="btn btn-secondary" onClick={handleReset}>
                                            Reset
                                        </button>
                                        <button className="btn btn-primary " onClick={fetchStudents}>
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-body p-0 py-3">
                        {loadingStudents ? <Spinner /> : <Table dataSource={tableData} columns={columns} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceData2;
