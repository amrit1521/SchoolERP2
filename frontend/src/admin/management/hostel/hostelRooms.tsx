import { useCallback, useEffect, useRef, useState } from "react";
import { all_routes } from "../../router/all_routes";
import { Link } from "react-router-dom";
import PredefinedDateRanges from "../../../core/common/datePicker";
import CommonSelect from "../../../core/common/commonSelect";
import {
  bedcount,
  hostelName,
  HostelroomNo,
  hostelType,
  moreFilterRoom,

} from "../../../core/common/selectoption/selectoption";
import type { TableData } from "../../../core/data/interface";
import Table from "../../../core/common/dataTable/index";
import TooltipOption from "../../../core/common/tooltipOption";
// import HostelModal from "./hostelModal";
import { hostelRoomsData } from "../../../core/data/json/hostelRoomsData";
import { hostelForOption, hostelRoomTypeForOption } from "../../../service/hostel";
import { toast } from "react-toastify";

interface HostelRoomFormData {
  roomNo: string;
  hostelId: number | null;
  roomTypeId: number | null;
  bedCount: number | null;
  costPerBed: number | null;
}

// Form errors interface
interface HostelRoomFormErrors {
  roomNo?: string;
  hostelId?: string;
  roomTypeId?: string;
  bedCount?: string;
  costPerBed?: string;
}

interface Option {
  value: number;
  label: string;
}

const HostelRooms = () => {
  const routes = all_routes;
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const data = hostelRoomsData;
  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };





  const [hostelOptions, setHostelOptions] = useState<Option[]>([]);
  const [roomTypeOptions, setRoomTypeOptions] = useState<Option[]>([]);


  const fetchOptions = useCallback(async () => {
    try {

      const [hostelRes, roomTypeRes] = await Promise.all([
        hostelForOption(),
        hostelRoomTypeForOption(),
      ]);


      if (hostelRes.data.success) {
        const mappedHostelOptions: Option[] = hostelRes.data.data.map((item: any) => ({
          value: item.id,
          label: item.name,
        }));
        setHostelOptions(mappedHostelOptions);
      }


      if (roomTypeRes.data.success) {
        const mappedRoomTypeOptions: Option[] = roomTypeRes.data.data.map((item: any) => ({
          value: item.id,
          label: item.roomType,
        }));
        setRoomTypeOptions(mappedRoomTypeOptions);
      }
    } catch (error) {
      console.error("Error fetching hostel/room type options:", error);
    }
  }, []);


  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);



  // add hostel room
  const [formData, setFormData] = useState<HostelRoomFormData>({
    roomNo: "",
    hostelId: null,
    roomTypeId: null,
    bedCount: null,
    costPerBed: null,
  });

  const [errors, setErrors] = useState<HostelRoomFormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "costPerBed" ? Number(value) : value,
    }));
  };

  // Handle select change
  const handleSelectChange = (name: keyof HostelRoomFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: HostelRoomFormErrors = {};

    if (!formData.roomNo.trim()) newErrors.roomNo = "Room number is required!";
    if (!formData.hostelId) newErrors.hostelId = "Select a hostel!";
    if (!formData.roomTypeId) newErrors.roomTypeId = "Select room type!";
    if (!formData.bedCount) newErrors.bedCount = "Select bed count!";
    if (!formData.costPerBed || formData.costPerBed <= 0)
      newErrors.costPerBed = "Enter valid cost per bed!";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    console.log(formData)
    try {
      // const { data } = await addHostelRoom(formData);
      // if (data.success) {
      //   toast.success(data.message);
      //   onSuccess();
      //   handleCancel();
      // }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (text: string) => (
        <Link to="#" className="link-primary">
          {text}
        </Link>
      ),
      sorter: (a: TableData, b: TableData) => a.id.length - b.id.length,
    },
    {
      title: "Room No",
      dataIndex: "roomNo",

      sorter: (a: TableData, b: TableData) =>
        a.roomNo.length - b.roomNo.length,
    },
    {
      title: "Hostel Name",
      dataIndex: "hostelName",

      sorter: (a: TableData, b: TableData) =>
        a.hostelName.length - b.hostelName.length,
    },
    {
      title: "Room Type",
      dataIndex: "roomType",
      sorter: (a: TableData, b: TableData) =>
        a.roomType.length - b.roomType.length,
    },
    {
      title: "No Of Bed",
      dataIndex: "noofBed",
      sorter: (a: TableData, b: TableData) =>
        a.noofBed.length - b.noofBed.length,
    },
    {
      title: "Cost Per Bed",
      dataIndex: "amount",

      sorter: (a: TableData, b: TableData) => a.amount.length - b.amount.length,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: () => (
        <>
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
                  <Link
                    className="dropdown-item rounded-1"
                    to="#"
                    data-bs-toggle="modal"
                    data-bs-target="#edit_hostel_rooms"
                  >
                    <i className="ti ti-edit-circle me-2" />
                    Edit
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item rounded-1"
                    to="#"
                    data-bs-toggle="modal"
                    data-bs-target="#delete-modal"
                  >
                    <i className="ti ti-trash-x me-2" />
                    Delete
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </>
      ),
    },
  ];


  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Hostel Rooms</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Management</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Hostel Rooms
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
                  data-bs-target="#add_hostel_rooms"
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Hostel Rooms
                </Link>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          {/* Students List */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Hostel Rooms</h4>
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
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Room No</label>
                              <CommonSelect
                                className="select"
                                options={HostelroomNo}
                                defaultValue={undefined}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Name</label>
                              <CommonSelect
                                className="select"
                                options={hostelName}
                              // defaultValue={hostelName[0]}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Type</label>
                              <CommonSelect
                                className="select"
                                options={hostelType}
                              // defaultValue={hostelType[0]}
                              />
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="mb-0">
                              <label className="form-label">More Filter</label>
                              <CommonSelect
                                className="select"
                                options={moreFilterRoom}
                              // defaultValue={moreFilterRoom[0]}
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
              <Table dataSource={data} columns={columns} Selection={true} />
              {/* /Student List */}
            </div>
          </div>
          {/* /Students List */}
        </div>
      </div>
      {/* /Page Wrapper */}
      <>
        {/* Add Hostel Rooms */}
        <div className="modal fade" id="add_hostel_rooms">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              {/* Header */}
              <div className="modal-header">
                <h4 className="modal-title">Add Hostel Room</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                // onClick={handleCancel}
                >
                  <i className="ti ti-x" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      {/* Room No */}
                      <div className="mb-3">
                        <label className="form-label">Room No</label>
                        <input
                          type="text"
                          name="roomNo"
                          value={formData.roomNo}
                          onChange={handleChange}
                          className={`form-control ${errors.roomNo ? "is-invalid" : ""}`}
                          placeholder="Enter room number"
                        />
                        {errors.roomNo && <div className="invalid-feedback">{errors.roomNo}</div>}
                      </div>

                      {/* Hostel */}
                      <div className="mb-3">
                        <label className="form-label">Hostel Name</label>
                        <CommonSelect
                          className={`select ${errors.hostelId ? "is-invalid" : ""}`}
                          options={hostelOptions}
                          value={formData.hostelId}
                          onChange={(option) => handleSelectChange("hostelId", option?.value || null)}
                        />
                        {errors.hostelId && <div className="invalid-feedback">{errors.hostelId}</div>}
                      </div>

                      {/* Room Type */}
                      <div className="mb-3">
                        <label className="form-label">Room Type</label>
                        <CommonSelect
                          className={`select ${errors.roomTypeId ? "is-invalid" : ""}`}
                          options={roomTypeOptions}
                          value={formData.roomTypeId}
                          onChange={(option) => handleSelectChange("roomTypeId", option?.value || null)}
                        />
                        {errors.roomTypeId && (
                          <div className="invalid-feedback">{errors.roomTypeId}</div>
                        )}
                      </div>

                      {/* Bed Count */}
                      <div className="mb-3">
                        <label className="form-label">No of Bed</label>
                        <CommonSelect
                          className={`select ${errors.bedCount ? "is-invalid" : ""}`}
                          options={bedcount}
                          value={formData.bedCount}
                          onChange={(option) => handleSelectChange("bedCount", option?.value || null)}
                        />
                        {errors.bedCount && <div className="invalid-feedback">{errors.bedCount}</div>}
                      </div>

                      {/* Cost per Bed */}
                      <div className="mb-0">
                        <label className="form-label">Cost per Bed</label>
                        <input
                          type="number"
                          name="costPerBed"
                          value={formData.costPerBed || ""}
                          onChange={handleChange}
                          className={`form-control ${errors.costPerBed ? "is-invalid" : ""}`}
                          placeholder="Enter cost per bed"
                        />
                        {errors.costPerBed && (
                          <div className="invalid-feedback">{errors.costPerBed}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-light me-2"
                  // onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Adding..." : "Add Hostel Room"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Add Hostel Rooms */}
        {/* Edit Hostel Room */}
        <div className="modal fade" id="edit_hostel_rooms">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Hostel Room</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Room No</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Room No"
                          defaultValue="A1"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Hostel Name</label>
                        <CommonSelect
                          className="select"
                          options={hostelOptions}
                        // defaultValue={roomtype[0].value}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Room Type</label>
                        <CommonSelect
                          className="select"
                          options={roomTypeOptions}
                        // defaultValue={roomtype[0].value}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">No of Bed</label>
                        <CommonSelect
                          className="select"
                          options={bedcount}
                        // defaultValue={bedcount[0].value}
                        />
                      </div>
                      <div className="mb-0">
                        <label className="form-label">Cost per Bed</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Cost per Bed"
                          defaultValue="$200"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <Link
                    to="#"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <Link
                    to="#"
                    data-bs-dismiss="modal"
                    className="btn btn-primary"
                  >
                    Save Changes
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Edit Hostel Room */}
      </>
    </>
  );
};

export default HostelRooms;
