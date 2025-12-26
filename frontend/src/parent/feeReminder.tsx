import { useEffect, useRef, useState } from "react";
// import { all_routes } from "../router/all_routes";
import { Link } from "react-router-dom";
import PredefinedDateRanges from "../core/common/datePicker";
import CommonSelect from "../core/common/commonSelect";
// import { allClass, sections } from "../core/common/selectoption/selectoption";
import type { TableData } from "../core/data/interface";
import Table from "../core/common/dataTable/index";
import TooltipOption from "../core/common/tooltipOption";
import { toast } from "react-toastify";
import AssignModal from "../admin/management/feescollection/assignModal";
// import { getFeeReminderDetailsOfSpecStudent } from "../service/studentapi";
import { getAllChildFeeReminder } from "../service/parentDashboardApi";
import { parent_routes } from "../router/parent_routes";

const PFeesReminder = () => {
  // const routes = all_routes;
  const [editModal, setEditModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [feesReminderAllChild, setFeesReminderAllChild] = useState<any[]>([]);
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const token = localStorage.getItem("token");
  const userId = token ? JSON.parse(token)?.id : null;
  const [studentOption, setStudentOptions] = useState<any[]>([]);
  const [filter, setFilter] = useState<{
    studentId: number | null;
    studentName: string | null;
  }>({
    studentId: null,
    studentName: null,
  });
  // const data = assignFeesData;

  interface ReminderDetails {
    feesGroup: string;
    feesType: string;
    class: string;
    section: string;
    gender: string;
    category: string;
    amount: string;
  }

  const [feesAssignDetails, setFeesAssignDetails] = useState<ReminderDetails[]>(
    [
      {
        feesGroup: "",
        feesType: "",
        class: "",
        section: "",
        gender: "",
        category: "",
        amount: "",
      },
    ]
  );
  const [loading, setLoading] = useState<boolean>(false);

  const fetchAllFeeAssignDet = async (userId: number) => {
    setLoading(true);
    try {
      const { data } = await getAllChildFeeReminder(userId);
      if (data.success) {
        setFeesReminderAllChild(data.data);
        setStudentOptions(
          data.data.map((item: any) => ({
            value: item?.student_id,
            label: item?.student_name,
          }))
        );
        setFeesAssignDetails(
          data.data[0].fees?.map((fd: any) => ({
            feesGroup: fd.feesGroup,
            feesType: fd.fee_type,
            amount: fd.AmountPay,
            class: fd.class_name,
            section: fd.section_name,
            gender: fd.gender,
          }))
        );
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAllFeeAssignDet(userId);
    }
  }, [userId]);

  const handleApplyClick = () => {
    feesReminderAllChild;
    if (filter?.studentId) {
      setFeesAssignDetails(
        feesReminderAllChild
          .filter((fees: any) => fees.student_id == filter?.studentId)[0]
          ?.fees.map((fd: any) => ({
            feesGroup: fd.feesGroup,
            feesType: fd.fee_type,
            amount: fd.AmountPay,
            class: fd.class_name,
            section: fd.section_name,
            gender: fd.gender,
          }))
      );
    }
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };

  const tableData = feesAssignDetails.map((item, index) => ({
    key: index + 1,
    sNo: index + 1,
    feesGroup: item.feesGroup,
    feesType: item.feesType,
    class: item.class,
    section: item.section,
    amount: item.amount,
    gender: item.gender,
    category: item.category,
  }));

  const columns = [
    {
      title: "SNo",
      dataIndex: "sNo",
      sorter: (a: TableData, b: TableData) => a.sNo.length - b.sNo.length,
    },
    {
      title: "Fees Group",
      dataIndex: "feesGroup",
      sorter: (a: TableData, b: TableData) =>
        a.feesGroup.length - b.feesGroup.length,
    },

    {
      title: "Fees Type",
      dataIndex: "feesType",
      sorter: (a: TableData, b: TableData) =>
        a.feesType.length - b.feesType.length,
    },
    {
      title: "Class",
      dataIndex: "class",
      sorter: (a: TableData, b: TableData) => a.class.length - b.class.length,
    },
    {
      title: "Section",
      dataIndex: "section",
      sorter: (a: TableData, b: TableData) => a.amount.length - b.amount.length,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      sorter: (a: TableData, b: TableData) => a.amount.length - b.amount.length,
    },
    {
      title: "Gender",
      dataIndex: "gender",
      sorter: (a: TableData, b: TableData) => a.gender.length - b.gender.length,
    },
    // {
    //   title: "Category",
    //   dataIndex: "category",
    //   sorter: (a: TableData, b: TableData) =>
    //     a.category.length - b.category.length,
    // },
  ];
  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Fees Reminder</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={parent_routes.parentDashboard}>
                      Parent Dashboard
                    </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Fees Reminder</Link>
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <TooltipOption />
            </div>
          </div>
          {/* /Page Header */}
          {/* Students List */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Fees Reminder</h4>
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
                    <form>
                      <div className="d-flex align-items-center border-bottom p-3">
                        <h4>Filter</h4>
                      </div>
                      <div className="p-3 border-bottom">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Child Name</label>
                              <CommonSelect
                                className="select"
                                options={studentOption}
                                value={filter?.studentId}
                                onChange={(opt: any) =>
                                  setFilter(() => ({
                                    studentId: opt.value,
                                    studentName: opt.label,
                                  }))
                                }
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
                    Sort by A-Z{" "}
                  </Link>
                  <ul className="dropdown-menu p-3">
                    <li>
                      <Link to="#" className="dropdown-item rounded-1">
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
              {/* Student List */}
              {loading ? (
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ height: "200px" }}
                >
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <>
                  {" "}
                  <Table
                    dataSource={tableData}
                    columns={columns}
                    Selection={true}
                  />
                </>
              )}
              {/* /Student List */}
            </div>
          </div>
          {/* /Students List */}
        </div>
      </div>
      {/* /Page Wrapper */}
      <AssignModal
        setEditModal={setEditModal}
        editModal={editModal}
        setAddModal={setAddModal}
        addModal={addModal}
      />
    </>
  );
};

export default PFeesReminder;
