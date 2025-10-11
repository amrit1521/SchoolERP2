import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

import Table from "../../../../core/common/dataTable/index";
import PredefinedDateRanges from "../../../../core/common/datePicker";
import CommonSelect from "../../../../core/common/commonSelect";
import TooltipOption from "../../../../core/common/tooltipOption";
import { Spinner } from "../../../../spinner";
import { Imageurl } from "../../../../service/api";
import { all_routes } from "../../../router/all_routes";
import { deleteStaff, speDetailsForAllStaff } from "../../../../service/staff";

import {
  departmentName,
  designationName,
  // morefilterStaff,
  staffName,
} from "../../../../core/common/selectoption/selectoption";

import { useQuery } from "@tanstack/react-query";
import { handleModalPopUp } from "../../../../handlePopUpmodal";
import { toast } from "react-toastify";



export interface Staff {
  staff_id: number;
  img_src: string;
  department_name: string;
  designation_name: string;
  date_of_join: string;
  user_id: number;
  firstname: string;
  lastname: string;
  mobile: string;
  email: string;
}

const Staff = () => {
  const routes = all_routes;
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);

  const handleApplyClick = () => {
    dropdownMenuRef.current?.classList.remove("show");
  };

  // TanStack Query for fetching staff
  const { data: staffData, isLoading, isError, error, refetch } = useQuery<Staff[], Error>({
    queryKey: ["all-staff"],
    queryFn: async () => {
      const res = await speDetailsForAllStaff();
      if (!res.data.success) throw new Error("Failed to fetch staff");
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const tableData = staffData?.map((staff) => ({
    id: staff.staff_id,
    user_id: staff.user_id,
    name: `${staff.firstname} ${staff.lastname}`,
    img: staff.img_src,
    department: staff.department_name,
    designation: staff.designation_name,
    phone: staff.mobile,
    email: staff.email,
    dateOfJoin: dayjs(staff.date_of_join).format("DD MMM YYYY"),
  })) || [];

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id: number) => <Link to={`${routes.staffDetails}/${id}`}>{id}</Link>,
      sorter: (a: any, b: any) => a.id - b.id,
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (_: string, record: any) => (
        <div className="d-flex align-items-center">
          <Link to={`${routes.staffDetails}/${record.id}`} className="avatar avatar-md">
            <img
              src={`${Imageurl}/${record.img}`}
              className="img-fluid rounded-circle"
              alt="img"
            />
          </Link>
          <div className="ms-2">
            <p className="text-dark mb-0">
              <Link to={`${routes.staffDetails}/${record.id}`}>{record.name}</Link>
            </p>
          </div>
        </div>
      ),
      sorter: (a: any, b: any) => a.name.length - b.name.length,
    },
    {
      title: "Department",
      dataIndex: "department",
      render: (text: string) => <span className="text-capitalize">{text}</span>,
      sorter: (a: any, b: any) => a.department.length - b.department.length,
    },
    {
      title: "Designation",
      dataIndex: "designation",
      render: (text: string) => <span className="text-capitalize">{text}</span>,
      sorter: (a: any, b: any) => a.designation.length - b.designation.length,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      sorter: (a: any, b: any) => a.phone.length - b.phone.length,
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a: any, b: any) => a.email.length - b.email.length,
    },
    {
      title: "Date of Join",
      dataIndex: "dateOfJoin",
      sorter: (a: any, b: any) => a.dateOfJoin.length - b.dateOfJoin.length,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_:string , record:any) => (
        <div className="d-flex align-items-center">
          <div className="dropdown">
            <Link
              to="#"
              className="btn btn-white btn-icon btn-sm d-flex align-items-center justify-content-center rounded-circle p-0"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="ti ti-dots-vertical fs-14" />
            </Link>
            <ul className="dropdown-menu dropdown-menu-right p-3">
              <li>
                <Link className="dropdown-item rounded-1" to={`${routes.staffDetails}/${record.id}`}>
                  <i className="ti ti-menu me-2" />
                  View Staff
                </Link>
              </li>
              <li>
                <Link className="dropdown-item rounded-1" to={`${routes.editStaff}/${record.id}`}>
                  <i className="ti ti-edit-circle me-2" />
                  Edit
                </Link>
              </li>
              <li>
                <button  onClick={()=>setDeleteId(record.id)} className="dropdown-item rounded-1"  data-bs-toggle="modal" data-bs-target="#delete-modal">
                  <i className="ti ti-trash-x me-2" />
                  Delete
                </button>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  if (isError) {
    alert(error)
  }

  //  DELETE STAFF
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const handleDelete = async (id: number, e: React.MouseEvent<HTMLButtonElement>) => {
     
    e.preventDefault()
    console.log(id)
    try {

      const { data } = await deleteStaff(id)
      if (data.success) {
        toast.success(data.message)
        refetch()
        handleModalPopUp('delete-modal')
        setDeleteId(null)
      }


    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }

  const cancelDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setDeleteId(null)
  }




  return (
    <div className="page-wrapper">
      <div className="content">
        {/* Page Header */}
        <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
          <div className="my-auto mb-2">
            <h3 className="page-title mb-1">Staffs</h3>
            <nav>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link to={routes.adminDashboard}>Dashboard</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="#">HRM</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Staffs
                </li>
              </ol>
            </nav>
          </div>
          <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
            <TooltipOption />
            <div className="mb-2">
              <Link
                to={routes.addStaff}
                className="btn btn-primary d-flex align-items-center"
              >
                <i className="ti ti-square-rounded-plus me-2" />
                Add Staff
              </Link>
            </div>
            {/* <button className="btn btn-outline-secondary ms-2 mb-2" onClick={() => refetch()} disabled={isFetching}>
              {isFetching ? "Refreshing..." : "Refresh"}
            </button> */}
          </div>
        </div>

        {/* Staff Card */}
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
            <h4 className="mb-3">Staff List</h4>
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
                <div className="dropdown-menu drop-width" ref={dropdownMenuRef}>
                  <form>
                    <div className="d-flex align-items-center border-bottom p-3">
                      <h4>Filter</h4>
                    </div>
                    <div className="p-3 border-bottom">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Name</label>
                            <CommonSelect className="select" options={staffName} />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Department</label>
                            <CommonSelect className="select" options={departmentName} />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-0">
                            <label className="form-label">Designation</label>
                            <CommonSelect className="select" options={designationName} />
                          </div>
                        </div>
                        {/* <div className="col-md-6">
                          <div className="mb-0">
                            <label className="form-label">More Filter</label>
                            <CommonSelect className="select" options={morefilterStaff} />
                          </div>
                        </div> */}
                      </div>
                    </div>
                    <div className="p-3 d-flex align-items-center justify-content-end">
                      <Link to="#" className="btn btn-light me-3">Reset</Link>
                      <Link to="#" className="btn btn-primary" onClick={handleApplyClick}>Apply</Link>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div className="card-body p-0 py-3">
            {isLoading ? <Spinner /> : <Table columns={columns} dataSource={tableData} Selection={true} />}
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <div className="modal fade" id="delete-modal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form >
              <div className="modal-body text-center">
                <span className="delete-icon">
                  <i className="ti ti-trash-x" />
                </span>
                <h4>Confirm Deletion</h4>
                <p>
                  You want to delete , this can't be undone
                  once you delete.
                </p>
                {
                  deleteId && (<div className="d-flex justify-content-center">
                    <button
                      onClick={(e) => cancelDelete(e)}
                      className="btn btn-light me-3"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </button>
                    <button onClick={(e) => handleDelete(deleteId, e)} className="btn btn-danger"
                    >
                      Yes, Delete
                    </button>
                  </div>)
                }
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Delete Modal */}
    </div>
  );
};

export default Staff;
