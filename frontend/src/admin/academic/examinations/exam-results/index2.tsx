import React, { useEffect, useMemo, useRef, useState } from "react";
// import ImageWithBasePath from '../../../../core/common/imageWithBasePath'
// import { examresult } from '../../../../core/data/json/exam-result';
// import type { TableData } from '../../../../core/data/interface';

import { Link } from "react-router-dom";
import PredefinedDateRanges from "../../../../core/common/datePicker";
import CommonSelect from "../../../../core/common/commonSelect";
import {
  allClass,
  classSection,
} from "../../../../core/common/selectoption/selectoption";
import { all_routes } from "../../../../router/all_routes";
import TooltipOption from "../../../../core/common/tooltipOption";
import { allExamData, getSpeExamResult } from "../../../../service/api";

export default function ExamMarkUpload() {
  const routes = all_routes;
  const initialStudents = [
    { id: 1, name: "Andrew Nahi", idCard: "ZIS/20-21/096" },
    { id: 2, name: "Athaang Sawant", idCard: "ZIS/20-21/095" },
    { id: 3, name: "MR. Joshi Sir", idCard: "ZIS/20-21/240" },
    { id: 4, name: "Mt Himat Singh", idCard: "ZIS/20-21/236" },
    { id: 5, name: "Ravi Kumar Sharma", idCard: "ZIS/20-21/257" },
    { id: 6, name: "Reshma S C", idCard: "ZIS/20-21/251" },
    { id: 7, name: "Sushmita Mam", idCard: "ZIS/20-21/091" },
  ];

  const subjectsMeta = [
    { id: "english", title: "ENGLISH", total: 50, passing: 15 },
    { id: "graphics", title: "GRAPHICS", total: 50, passing: 15 },
    { id: "math1", title: "MATHEMATICS-I", total: 50, passing: 15 },
    { id: "math2", title: "MATHEMATICS-II", total: 50, passing: 15 },
  ];

  // marksState structure: { [studentId]: { [subjectId]: { checked: boolean, mark: number|null } } }
  const buildInitialMarks = () => {
    const obj: {
      [key: string]: { [key: string]: { checked: boolean; mark: string } };
    } = {};
    initialStudents.forEach((s) => {
      obj[s.id.toString()] = {};
      subjectsMeta.forEach((sub) => {
        obj[s.id.toString()][sub.id] = { checked: false, mark: "" };
      });
    });
    return obj;
  };

  const [students] = useState(initialStudents);
  const [subjects] = useState(subjectsMeta);
  const [section, setSection] = useState("");
  const [perPage, setPerPage] = useState("All");
  const [search, setSearch] = useState("");
  const [marksState, setMarksState] = useState(buildInitialMarks);
  const [page, setPage] = useState(1);

  const filteredStudents = useMemo(() => {
    const s = students.filter((st) =>
      `${st.name} ${st.idCard}`.toLowerCase().includes(search.toLowerCase())
    );
    return s;
  }, [students, search]);

  const displayedStudents = useMemo(() => {
    if (perPage === "All") return filteredStudents;
    const n = Number(perPage) || filteredStudents.length;
    const start = (page - 1) * n;
    return filteredStudents.slice(start, start + n);
  }, [filteredStudents, perPage, page]);

  interface ToggleCheckFn {
    (studentId: number, subjectId: string): void;
  }

  const toggleCheck: ToggleCheckFn = (studentId, subjectId) => {
    setMarksState((prev: MarksState) => ({
      ...prev,
      [studentId.toString()]: {
        ...prev[studentId.toString()],
        [subjectId]: {
          ...prev[studentId.toString()][subjectId],
          checked: !prev[studentId.toString()][subjectId].checked,
        },
      },
    }));
  };

  interface MarkState {
    checked: boolean;
    mark: string;
  }

  interface MarksState {
    [studentId: string]: {
      [subjectId: string]: MarkState;
    };
  }

  function setMark(studentId: number, subjectId: string, value: string): void {
    // allow empty string or numeric values only
    if (value !== "" && isNaN(Number(value))) return;
    setMarksState((prev: MarksState) => ({
      ...prev,
      [studentId.toString()]: {
        ...prev[studentId.toString()],
        [subjectId]: {
          ...prev[studentId.toString()][subjectId],
          mark: value,
        },
      },
    }));
  }

  function handleSave() {
    // transform marksState into an upload-friendly structure
    const payload = Object.keys(marksState).map((stuId) => ({
      studentId: Number(stuId),
      marks: subjects.map((sub) => ({
        subjectId: sub.id,
        checked: marksState[stuId][sub.id].checked,
        mark:
          marksState[stuId][sub.id].mark === ""
            ? null
            : Number(marksState[stuId][sub.id].mark),
      })),
    }));

    // placeholder: replace with API call
    console.log("Saving payload:", payload);
    alert("Save function called. Check console for payload.");
  }

  function handleExport() {
    // placeholder
    alert("Export to Excel - placeholder");
  }

  function handleImport() {
    // placeholder
    alert("Import Excel - placeholder");
  }

  function handlePublish() {
    alert("Publish result - placeholder");
  }

  const totalPages = useMemo(() => {
    if (perPage === "All") return 1;
    const n = Number(perPage) || filteredStudents.length;
    return Math.max(1, Math.ceil(filteredStudents.length / n));
  }, [filteredStudents.length, perPage]);

  //  filter students
  const [allExam, setAllExam] = useState<any[]>([]);

  const fetchDataa = async <T,>(
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

  const fetchExams = () => fetchDataa(allExamData, setAllExam);

  useEffect(() => {
    fetchExams();
  }, []);

  const examNameOptions = useMemo(
    () =>
      allExam.map((e) => ({
        value: e.id,
        label: e.examName,
      })),
    [allExam]
  );

  interface FilterData {
    class: string;
    section: string;
    exam_type: number | null;
  }

  const [filterData, setFilterData] = useState<FilterData>({
    class: "",
    section: "",
    exam_type: null,
  });
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);

  const handleFilterSelectChange = (
    name: keyof FilterData,
    value: string | number
  ) => {
    setFilterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyClick = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(filterData);
    try {
      const { data } = await getSpeExamResult(filterData);
      if (data.success) {
        // setResultData(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleResetFilter = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setFilterData({ class: "", section: "", exam_type: null });
    // setResultData(originalResultData);

    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };

  return (
    <div>
      <>
        {/* Page Wrapper */}
        <div className="page-wrapper">
          <div className="content">
            {/* Page Header */}
            <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
              <div className="my-auto mb-2">
                <h3 className="page-title mb-1">Exam Result</h3>
                <nav>
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <Link to={routes.adminDashboard}>Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to="#">Academic </Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Exam Result
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
                    data-bs-target="#add_result"
                  >
                    <i className="ti ti-square-rounded-plus-filled me-2" />
                    Add Result
                  </Link>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            {/* Guardians List */}
            <div className="card">
              <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                <h4 className="mb-3">Exam Results</h4>
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
                            <div className="col-md-6">
                              <label className="form-label">Class</label>
                              <CommonSelect
                                className="select"
                                options={allClass}
                                onChange={(option) =>
                                  handleFilterSelectChange(
                                    "class",
                                    option ? option.value : ""
                                  )
                                }
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">Section</label>
                              <CommonSelect
                                className="select"
                                options={classSection}
                                onChange={(option) =>
                                  handleFilterSelectChange(
                                    "section",
                                    option ? option.value : ""
                                  )
                                }
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">Exam Type</label>
                              <CommonSelect
                                className="select"
                                options={examNameOptions}
                                onChange={(option) =>
                                  handleFilterSelectChange(
                                    "exam_type",
                                    option ? option.value : ""
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <div className="p-3 d-flex align-items-center justify-content-end">
                          <button
                            className="btn btn-light me-3"
                            onClick={handleResetFilter}
                          >
                            Reset
                          </button>
                          <button type="submit" className="btn btn-primary">
                            Apply
                          </button>
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

              <div className="p-4 bg-gray-50 min-h-screen">
                {/* Header */}
                <div className="bg-white shadow-sm rounded-md">
                  <div className="flex items-center justify-between px-4 py-3 border-b">
                    <div className="flex items-center gap-3">
                      <h2 className="font-semibold text-lg">
                        Exam Mark Upload
                      </h2>
                      <div className="text-xs text-gray-500 px-2 py-0.5 bg-orange-50 rounded">
                        1
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleExport}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-xs"
                      >
                        Export to Excel
                      </button>
                      <button
                        onClick={handleImport}
                        className="px-3 py-1 bg-orange-500 text-white rounded text-xs"
                      >
                        Import Excel File
                      </button>
                      <button
                        onClick={handlePublish}
                        className="px-3 py-1 bg-yellow-400 text-black rounded text-xs"
                      >
                        Publish Result
                      </button>
                      <button className="px-3 py-1 bg-green-600 text-white rounded text-xs">
                        WhatsApp
                      </button>
                      <button className="px-3 py-1 bg-gray-300 text-black rounded text-xs">
                        SMS
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-3 py-1 bg-gray-700 text-white rounded text-xs"
                      >
                        Save
                      </button>
                      <button className="px-3 py-1 bg-gray-200 text-black rounded text-xs">
                        Cancel
                      </button>
                    </div>
                  </div>

                  {/* Filters */}
                  <div className="px-4 py-3">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-700">Section</label>
                        <select
                          className="border px-2 py-1 rounded text-sm"
                          value={section}
                          onChange={(e) => setSection(e.target.value)}
                        >
                          <option value="">Select Section...</option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          className="border px-2 py-1 rounded text-sm"
                          value={perPage}
                          onChange={(e) => {
                            setPerPage(e.target.value);
                            setPage(1);
                          }}
                        >
                          <option>All</option>
                          <option>5</option>
                          <option>10</option>
                          <option>25</option>
                        </select>
                        <div className="text-sm text-gray-600">
                          records per page
                        </div>
                      </div>

                      <div className="ml-auto">
                        <input
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          placeholder="Search"
                          className="border rounded px-3 py-1 text-sm w-64"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto px-4 pb-4">
                    <table className="min-w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100 text-xs text-gray-700">
                          <th className="border px-3 py-2 text-left">
                            STUDENT NAME
                          </th>
                          <th className="border px-3 py-2 text-left">
                            ID CARD NO
                          </th>
                          {subjects.map((sub) => (
                            <th
                              key={sub.id}
                              className="border px-3 py-2 text-left"
                            >
                              <div className="whitespace-nowrap font-semibold">
                                {sub.title}
                              </div>
                              <div className="text-[11px] text-gray-500">
                                TOTAL:{sub.total}, PASSING:{sub.passing}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody>
                        {displayedStudents.map((stu) => (
                          <tr
                            key={stu.id}
                            className="odd:bg-white even:bg-gray-50 text-sm align-top"
                          >
                            <td className="border px-3 py-3 w-56">
                              <div className="font-medium">{stu.name}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                Class / Roll (example)
                              </div>
                            </td>

                            <td className="border px-3 py-3 w-40 text-sm">
                              {stu.idCard}
                            </td>

                            {subjects.map((sub) => (
                              <td
                                key={sub.id}
                                className="border px-3 py-3 align-top w-44"
                              >
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={
                                      marksState[stu.id.toString()][sub.id]
                                        .checked
                                    }
                                    onChange={() => toggleCheck(stu.id, sub.id)}
                                  />
                                  <input
                                    className="flex-1 border rounded px-2 py-1 text-sm"
                                    value={
                                      marksState[stu.id.toString()][sub.id].mark
                                    }
                                    onChange={(e) =>
                                      setMark(stu.id, sub.id, e.target.value)
                                    }
                                    placeholder=""
                                  />
                                </div>
                              </td>
                            ))}
                          </tr>
                        ))}

                        {displayedStudents.length === 0 && (
                          <tr>
                            <td
                              colSpan={2 + subjects.length}
                              className="text-center py-8 text-gray-500"
                            >
                              No records found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Footer / Pagination */}
                  <div className="flex items-center justify-between px-4 py-3 border-t">
                    <div className="text-sm text-gray-600">
                      Showing 1 to {displayedStudents.length} of{" "}
                      {filteredStudents.length} entries
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className="px-2 py-1 border rounded"
                      >
                        ◀
                      </button>
                      <div className="px-3 py-1 border rounded">
                        {page} / {totalPages}
                      </div>
                      <button
                        onClick={() =>
                          setPage((p) => Math.min(totalPages, p + 1))
                        }
                        className="px-2 py-1 border rounded"
                      >
                        ▶
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
}
