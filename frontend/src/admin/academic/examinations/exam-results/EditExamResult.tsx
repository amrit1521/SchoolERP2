import React, { useEffect, useMemo, useRef, useState } from "react";
// import ImageWithBasePath from '../../../../core/common/imageWithBasePath'
// import { examresult } from '../../../../core/data/json/exam-result';
// import type { TableData } from '../../../../core/data/interface';

// import PredefinedDateRanges from "../../../../core/common/datePicker";
// import CommonSelect from "../../../../core/common/commonSelect";
// import {
//   allClass,
//   classSection,
// } from "../../../../core/common/selectoption/selectoption";
import { all_routes } from "../../../router/all_routes";
// import TooltipOption from "../../../../core/common/tooltipOption";
// import { allExamData, getSpeExamResult } from "../../../../service/api";
// import { Button } from "antd";
import {
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Table,
  Pagination,
  message,
} from "antd";
import { Link } from "react-router-dom";
import {
  SaveOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  WhatsAppOutlined,
  MessageOutlined,
  FilterOutlined,
} from "@ant-design/icons";

const { Option } = Select;

// ---------- Types ----------
interface Subject {
  id: string;
  name: string;
  total: number;
  passing: number;
}

interface Student {
  id: string;
  name: string;
  idCard: string;
}

interface MarksEntry {
  mark: string;
  checked: boolean;
}

type MarksData = Record<string, Record<string, MarksEntry>>;

// ---------- Mock Data ----------
const mockClasses = ["1st", "2nd", "3rd", "4th", "5th"];
const mockSections = ["A", "B", "C"];
const mockExams = ["Mid Term", "Final Exam", "Unit Test"];

const mockSubjects: Subject[] = [
  { id: "sub1", name: "English", total: 100, passing: 33 },
  { id: "sub2", name: "Math", total: 100, passing: 33 },
  { id: "sub3", name: "Science", total: 100, passing: 33 },
];

const mockStudents: Student[] = [
  { id: "stu1", name: "Amit Sharma", idCard: "ST1234" },
  { id: "stu2", name: "Riya Verma", idCard: "ST1235" },
  { id: "stu3", name: "Karan Mehta", idCard: "ST1236" },
  { id: "stu4", name: "Sita Das", idCard: "ST1237" },
  { id: "stu5", name: "Rohan Gupta", idCard: "ST1238" },
];

export default function ExamMarkUpload() {
  const routes = all_routes;
  //   const initialStudents = [
  //     { id: 1, name: "Andrew Nahi", idCard: "ZIS/20-21/096" },
  //     { id: 2, name: "Athaang Sawant", idCard: "ZIS/20-21/095" },
  //     { id: 3, name: "MR. Joshi Sir", idCard: "ZIS/20-21/240" },
  //     { id: 4, name: "Mt Himat Singh", idCard: "ZIS/20-21/236" },
  //     { id: 5, name: "Ravi Kumar Sharma", idCard: "ZIS/20-21/257" },
  //     { id: 6, name: "Reshma S C", idCard: "ZIS/20-21/251" },
  //     { id: 7, name: "Sushmita Mam", idCard: "ZIS/20-21/091" },
  //   ];

  //   const subjectsMeta = [
  //     { id: "english", title: "ENGLISH", total: 50, passing: 15 },
  //     { id: "graphics", title: "GRAPHICS", total: 50, passing: 15 },
  //     { id: "math1", title: "MATHEMATICS-I", total: 50, passing: 15 },
  //     { id: "math2", title: "MATHEMATICS-II", total: 50, passing: 15 },
  //   ];

  //   // marksState structure: { [studentId]: { [subjectId]: { checked: boolean, mark: number|null } } }
  //   const buildInitialMarks = () => {
  //     const obj: {
  //       [key: string]: { [key: string]: { checked: boolean; mark: string } };
  //     } = {};
  //     initialStudents.forEach((s) => {
  //       obj[s.id.toString()] = {};
  //       subjectsMeta.forEach((sub) => {
  //         obj[s.id.toString()][sub.id] = { checked: false, mark: "" };
  //       });
  //     });
  //     return obj;
  //   };

  //   const [students] = useState(initialStudents);
  //   const [subjects] = useState(subjectsMeta);
  //   const [section, setSection] = useState("");
  //   const [perPage, setPerPage] = useState("All");
  //   const [search, setSearch] = useState("");
  //   const [marksState, setMarksState] = useState(buildInitialMarks);
  //   const [page, setPage] = useState(1);

  //   const filteredStudents = useMemo(() => {
  //     const s = students.filter((st) =>
  //       `${st.name} ${st.idCard}`.toLowerCase().includes(search.toLowerCase())
  //     );
  //     return s;
  //   }, [students, search]);

  //   const displayedStudents = useMemo(() => {
  //     if (perPage === "All") return filteredStudents;
  //     const n = Number(perPage) || filteredStudents.length;
  //     const start = (page - 1) * n;
  //     return filteredStudents.slice(start, start + n);
  //   }, [filteredStudents, perPage, page]);

  //   interface ToggleCheckFn {
  //     (studentId: number, subjectId: string): void;
  //   }

  //   const toggleCheck: ToggleCheckFn = (studentId, subjectId) => {
  //     setMarksState((prev: MarksState) => ({
  //       ...prev,
  //       [studentId.toString()]: {
  //         ...prev[studentId.toString()],
  //         [subjectId]: {
  //           ...prev[studentId.toString()][subjectId],
  //           checked: !prev[studentId.toString()][subjectId].checked,
  //         },
  //       },
  //     }));
  //   };

  //   interface MarkState {
  //     checked: boolean;
  //     mark: string;
  //   }

  //   interface MarksState {
  //     [studentId: string]: {
  //       [subjectId: string]: MarkState;
  //     };
  //   }

  //   function setMark(studentId: number, subjectId: string, value: string): void {
  //     // allow empty string or numeric values only
  //     if (value !== "" && isNaN(Number(value))) return;
  //     setMarksState((prev: MarksState) => ({
  //       ...prev,
  //       [studentId.toString()]: {
  //         ...prev[studentId.toString()],
  //         [subjectId]: {
  //           ...prev[studentId.toString()][subjectId],
  //           mark: value,
  //         },
  //       },
  //     }));
  //   }

  //   function handleSave() {
  //     // transform marksState into an upload-friendly structure
  //     const payload = Object.keys(marksState).map((stuId) => ({
  //       studentId: Number(stuId),
  //       marks: subjects.map((sub) => ({
  //         subjectId: sub.id,
  //         checked: marksState[stuId][sub.id].checked,
  //         mark:
  //           marksState[stuId][sub.id].mark === ""
  //             ? null
  //             : Number(marksState[stuId][sub.id].mark),
  //       })),
  //     }));

  //     // placeholder: replace with API call
  //     console.log("Saving payload:", payload);
  //     alert("Save function called. Check console for payload.");
  //   }

  //   function handleExport() {
  //     // placeholder
  //     alert("Export to Excel - placeholder");
  //   }

  //   function handleImport() {
  //     // placeholder
  //     alert("Import Excel - placeholder");
  //   }

  //   function handlePublish() {
  //     alert("Publish result - placeholder");
  //   }

  //   const totalPages = useMemo(() => {
  //     if (perPage === "All") return 1;
  //     const n = Number(perPage) || filteredStudents.length;
  //     return Math.max(1, Math.ceil(filteredStudents.length / n));
  //   }, [filteredStudents.length, perPage]);

  //   //  filter students
  //   const [allExam, setAllExam] = useState<any[]>([]);

  //   const fetchDataa = async <T,>(
  //     apiFn: () => Promise<{ data: { success: boolean; data: T } }>,
  //     setter: React.Dispatch<React.SetStateAction<T>>
  //   ) => {
  //     try {
  //       const { data } = await apiFn();
  //       if (data.success) setter(data.data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   const fetchExams = () => fetchDataa(allExamData, setAllExam);

  //   useEffect(() => {
  //     fetchExams();
  //   }, []);

  //   const examNameOptions = useMemo(
  //     () =>
  //       allExam.map((e) => ({
  //         value: e.id,
  //         label: e.examName,
  //       })),
  //     [allExam]
  //   );

  //   interface FilterData {
  //     class: string;
  //     section: string;
  //     exam_type: number | null;
  //   }

  //   const [filterData, setFilterData] = useState<FilterData>({
  //     class: "",
  //     section: "",
  //     exam_type: null,
  //   });
  //   const dropdownMenuRef = useRef<HTMLDivElement | null>(null);

  //   const handleFilterSelectChange = (
  //     name: keyof FilterData,
  //     value: string | number
  //   ) => {
  //     setFilterData((prev) => ({ ...prev, [name]: value }));
  //   };

  //   const handleApplyClick = async (e: React.FormEvent) => {
  //     e.preventDefault();
  //     console.log(filterData);
  //     try {
  //       const { data } = await getSpeExamResult(filterData);
  //       if (data.success) {
  //         // setResultData(data.data);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   const handleResetFilter = (e?: React.MouseEvent) => {
  //     e?.preventDefault();
  //     setFilterData({ class: "", section: "", exam_type: null });
  //     // setResultData(originalResultData);

  //     if (dropdownMenuRef.current) {
  //       dropdownMenuRef.current.classList.remove("show");
  //     }
  //   };
  const [form] = Form.useForm();

  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [selectedExam, setSelectedExam] = useState<string>("");

  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [marksData, setMarksData] = useState<MarksData>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(3);

  // ---------- Load Mock Data ----------
  useEffect(() => {
    setStudents(mockStudents);
    setSubjects(mockSubjects);

    const initialData: MarksData = {};
    mockStudents.forEach((stu) => {
      initialData[stu.id] = {};
      mockSubjects.forEach((sub) => {
        initialData[stu.id][sub.id] = { mark: "", checked: false };
      });
    });
    setMarksData(initialData);
  }, []);

  // ---------- Handlers ----------
  const handleCheck = (stuId: string, subId: string) => {
    setMarksData((prev) => ({
      ...prev,
      [stuId]: {
        ...prev[stuId],
        [subId]: {
          ...prev[stuId][subId],
          checked: !prev[stuId][subId].checked,
        },
      },
    }));
  };

  const handleMarkChange = (stuId: string, subId: string, value: string) => {
    setMarksData((prev) => ({
      ...prev,
      [stuId]: {
        ...prev[stuId],
        [subId]: {
          ...prev[stuId][subId],
          mark: value,
        },
      },
    }));
  };

  const handleSave = () => {
    console.log("Saving Marks:", marksData);
    message.success("Exam results saved successfully!");
  };

  const handleImport = () => message.info("Import Excel coming soon!");
  const handlePublish = () => message.success("Results published!");
  const handleWhatsApp = () => message.info("WhatsApp sent!");
  const handleSMS = () => message.info("SMS sent!");

  const handleFilter = (values: any) => {
    setSelectedClass(values.class);
    setSelectedSection(values.section);
    setSelectedExam(values.exam);
    message.success("Filter applied!");
  };

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedStudents = students.slice(startIndex, startIndex + pageSize);

  // ---------- Columns ----------
  const columns = [
    {
      title: "Student Name",
      dataIndex: "name",
      key: "name",
      render: (_: string, record: Student) => (
        <div>
          <div className="font-semibold">{record.name}</div>
          <div className="text-xs text-gray-500">{record.idCard}</div>
        </div>
      ),
      fixed: "left" as const,
      width: 200,
    },
    ...subjects.map((sub) => ({
      title: (
        <div>
          <div>{sub.name}</div>
          <div style={{ fontSize: 11, color: "#888" }}>
            Total: {sub.total}, Pass: {sub.passing}
          </div>
        </div>
      ),
      dataIndex: sub.id,
      key: sub.id,
      width: 150,
      render: (_: any, record: Student) => {
        const current = marksData[record.id]?.[sub.id] || {
          mark: "",
          checked: false,
        };
        return (
          <Space>
            <Checkbox
              checked={current.checked}
              onChange={() => handleCheck(record.id, sub.id)}
            />
            <Input
              style={{ width: 70 }}
              value={current.mark}
              onChange={(e) =>
                handleMarkChange(record.id, sub.id, e.target.value)
              }
            />
          </Space>
        );
      },
    })),
  ];
  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Edit Exam Result</h2>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="#">Dashboard</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Academic</Breadcrumb.Item>
            <Breadcrumb.Item>Edit Exam Result</Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <Space wrap>
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
            Save
          </Button>
          <Button icon={<UploadOutlined />} onClick={handleImport}>
            Import Excel
          </Button>
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={handlePublish}
          >
            Publish
          </Button>
          <Button icon={<WhatsAppOutlined />} onClick={handleWhatsApp}>
            WhatsApp
          </Button>
          <Button icon={<MessageOutlined />} onClick={handleSMS}>
            SMS
          </Button>
        </Space>
      </div>

      {/* Filters */}
      <Card
        className="mb-4"
        title={
          <Space>
            <FilterOutlined /> Filter
          </Space>
        }
      >
        <Form layout="vertical" form={form} onFinish={handleFilter}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <Form.Item label="Class" name="class">
                <Select placeholder="Select Class">
                  {mockClasses.map((cls) => (
                    <Option key={cls} value={cls}>
                      {cls}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item label="Section" name="section">
                <Select placeholder="Select Section">
                  {mockSections.map((sec) => (
                    <Option key={sec} value={sec}>
                      {sec}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item label="Exam Type" name="exam">
                <Select placeholder="Select Exam">
                  {mockExams.map((exam) => (
                    <Option key={exam} value={exam}>
                      {exam}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24} className="text-right">
              <Button htmlType="submit" type="primary">
                Apply
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* Table */}
      <Card title="Exam Results">
        <Table
          columns={columns}
          dataSource={paginatedStudents}
          pagination={false}
          rowKey="id"
          scroll={{ x: "max-content" }}
        />
        <div className="flex justify-end mt-4">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={students.length}
            onChange={(p) => setCurrentPage(p)}
            showSizeChanger={false}
          />
        </div>
      </Card>
    </div>
  );
}
