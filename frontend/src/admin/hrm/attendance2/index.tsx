import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Table from "../../../core/common/dataTable/index";
import CommonSelect from "../../../core/common/commonSelect";
import { toast } from "react-toastify";
import { getAllSectionForAClass, Imageurl, markAttendance2, studentsFilter2 } from "../../../service/api";
import { allRealClasses } from "../../../service/classApi";
import { Spinner } from "../../../spinner";
import { all_routes } from "../../../router/all_routes";

interface FromClass {
    class: number | null;
    section: number | null;
}

const routes = all_routes;

const StudentAttendance2 = () => {
    const [students, setStudents] = useState<any[]>([]);
    const [classOptions, setClassOptions] = useState<any[]>([]);
    const [sectionOptions, setSectionOptions] = useState<any[]>([]);
    const [loadingStudents, setLoadingStudents] = useState<boolean>(false);
    const [submitting, setSubmitting] = useState<boolean>(false);

    const [fromClassData, setFromClassData] = useState<FromClass>({
        class: null,
        section: null,
    });

    const dropdownMenuRef = useRef<HTMLDivElement | null>(null);

    const [attendance, setAttendance] = useState<{
        [key: string]: "Present" | "Absent" | null;
    }>({});

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

    // Fetch Students
    const fetchStudents = async () => {
        if (!fromClassData.class || !fromClassData.section) {
            toast.error("Please select class and section");
            return;
        }

        try {
            setLoadingStudents(true);
            const { data } = await studentsFilter2(fromClassData);
          

            if (data.success) {
                setStudents(data.students || []);
                setAttendance({});
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

    // Handle attendance click
    const handleAttendance = (rollNo: string, status: "Present" | "Absent") => {
        setAttendance((prev) => ({
            ...prev,
            [rollNo]: status,
        }));
    };

    // Submit attendance
    const handleSubmitAttendance = async () => {
        if (students.length === 0) {
            toast.error("No students found");
            return;
        }

        const unmarked = students.filter((s) => !attendance[s.rollnum]);
        if (unmarked.length > 0) {
            toast.error("Please mark attendance for all students");
            return;
        }

        const payload = students.map((s) => ({
            rollNo: s.rollnum,
            attendance: attendance[s.rollnum]
        }));

        try {-
            setSubmitting(true);
            
            const { data } = await markAttendance2(payload);
            if (data.success) {
                toast.success(data.message);
                setSectionOptions([])
                setStudents([])

            } else {
                toast.error(data.message);
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message);
        } finally {
            setSubmitting(false);
        }
    };

    // Table data
    const tableData = students.map((s: any) => ({
        key: s.rollnum,
        roll: s.rollnum,
        img: s.stu_img,
        admission: s.admissionnum,
        name: `${s.firstname} ${s.lastname}`,
        class: s.class,
        section: s.section,
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
        { title: "Class", dataIndex: "class" },
        { title: "Section", dataIndex: "section" },
        {
            title: "Mark Attendance",
            render: (_: any, record: any) => {
                const status = attendance[record.roll];
                return (
                    <div className="d-flex gap-3">
                        {/* Present */}
                        <div
                            onClick={() => handleAttendance(record.roll, "Present")}
                            style={{
                                width: 35,
                                height: 35,
                                border: "2px solid green",
                                borderRadius: 6,
                                cursor: "pointer",
                                backgroundColor: status === "Present" ? "green" : "transparent",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                fontWeight: "bold",
                            }}
                        >
                            {status === "Present" ? "✓" : ""}
                        </div>

                        {/* Absent */}
                        <div
                            onClick={() => handleAttendance(record.roll, "Absent")}
                            style={{
                                width: 35,
                                height: 35,
                                border: "2px solid red",
                                borderRadius: 6,
                                cursor: "pointer",
                                backgroundColor: status === "Absent" ? "red" : "transparent",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                fontWeight: "bold",
                            }}
                        >
                            {status === "Absent" ? "✕" : ""}
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
                {/* Students List */}

                <div className="card">
                    <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                        <h4 className="mb-3">Students List</h4>
                        <div className="d-flex align-items-center flex-wrap">
                            <div className="input-icon-start mb-3 me-2 position-relative">

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


                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-center my-3">
                                        <button className="btn btn-primary w-50" onClick={fetchStudents}>
                                            Submit
                                        </button>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="card-body p-0 py-3">
                        {/* Student List */}

                        {loadingStudents ? <Spinner /> : <Table dataSource={tableData} columns={columns} />}

                        {students.length > 0 && (
                            <div className="text-center mt-4">
                                <button
                                    className="btn btn-success"
                                    onClick={handleSubmitAttendance}
                                    disabled={submitting}
                                >
                                    {submitting ? "Submitting..." : "Submit Attendance"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* /Students List */}
            </div>
        </div>
    );
};

export default StudentAttendance2;
