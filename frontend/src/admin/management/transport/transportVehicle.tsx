import { useEffect, useRef, useState } from "react";
import { all_routes } from "../../router/all_routes";
import PredefinedDateRanges from "../../../core/common/datePicker";
import CommonSelect from "../../../core/common/commonSelect";
import {
  driverFilter2,
  driverName,
  GPSDevice,
  status,
  vehicleModel,
  VehicleNumber,
} from "../../../core/common/selectoption/selectoption";
import type { TableData } from "../../../core/data/interface";
import Table from "../../../core/common/dataTable/index";
import TooltipOption from "../../../core/common/tooltipOption";
import TransportModal from "./transportModal";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { transportVehicles } from "../../../core/data/json/transport_vehicle";
import { Link } from "react-router-dom";
import { deleteVehicleById, getAllVehicle } from "../../../service/api";
import { toast } from "react-toastify";

interface TransportVehicleProps {
  id: number;
  vehicleNo: string;
  vehicleModel: string;
  madeofYear: string;
  registrationNo: string;
  chassisNo: string;
  seatCapacity: number;
  gpsTrackingId: string;
  driver: number;
  driverLicense: string;
  driverContactNo: string;
  driverAddress: string;
  status: number;
}

const TransportVehicle = () => {
  const routes = all_routes;
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const data = transportVehicles;
  const [vehicleDetails, setVehicleDetails] = useState<TransportVehicleProps[]>(
    []
  );
  const [filterVehicleDetails, setFilterVehicleDetails] = useState<
    TransportVehicleProps[]
  >([]);
  const [selectedVehicleInfo, setSelecteVehicleInfo] =
    useState<TransportVehicleProps | null>(null);

  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };

  const fetchVehicleDetails = async () => {
    try {
      const { data } = await getAllVehicle();
      if (data.success) {
        console.log("data: ", data);
        setVehicleDetails(
          data.result.map((item: any) => ({
            id: item.id,
            vehicleNo: item.vehicle_no,
            vehicleModel: item.vehicle_model,
            madeofYear: item.made_of_year,
            registrationNo: item.registration_no,
            chassisNo: item.chassis_no,
            seatCapacity: item.seat_capacity,
            gpsTrackingId: item.gps_tracking_id,
            driver: item.driver_id,
            driverLicense: item.driver_license,
            driverContactNo: item.driver_contact_no,
            driverAddress: item.driver_address,
            status: item.status,
          }))
        );
        setFilterVehicleDetails(
          data.result.map((item: any) => ({
            id: item.id,
            vehicleNo: item.vehicle_no,
            vehicleModel: item.vehicle_model,
            madeofYear: item.made_of_year,
            registrationNo: item.registration_no,
            chassisNo: item.chassis_no,
            seatCapacity: item.seat_capacity,
            gpsTrackingId: item.gps_tracking_id,
            driver: item.driver_id,
            driverLicense: item.driver_license,
            driverContactNo: item.driver_contact_no,
            driverAddress: item.driver_address,
            status: item.status,
          }))
        );
        // setPickupPointOption(
        //   data.result.map((point: PickupPoint) => ({
        //     value: point.id,
        //     label: point.pickPointName,
        //   }))
        // );
      } else {
        toast.error(data.message || "Failed to fetch vehicle details");
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to fetch vehicle details"
      );
    }
  };

  useEffect(() => {
    fetchVehicleDetails();
  }, []);

  const handleDelete = async (id: number) => {
    console.log("handleDelete Called: ", id);
    try {
      const { data } = await deleteVehicleById(id);
      if (data.success) {
        toast.success(data.message || "Vehicle Info deleted successfully");
        fetchVehicleDetails();
      } else {
        toast.error(data.message || "Failed to delete vehicle Info");
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Error deleting vehicle Info."
      );
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (text: string) => (
        <Link to="#" className="link-primary">
          BB0{text}
        </Link>
      ),
      sorter: (a: TableData, b: TableData) => a.id.length - b.id.length,
    },
    {
      title: "Vehicle No",
      dataIndex: "vehicleNo",
      sorter: (a: TableData, b: TableData) =>
        a.vehicleNo.length - b.vehicleNo.length,
    },
    {
      title: "Vehicle Model",
      dataIndex: "vehicleModel",
      sorter: (a: TableData, b: TableData) =>
        a.vehicleModel.length - b.vehicleModel.length,
    },
    {
      title: "Made of Year",
      dataIndex: "madeofYear",
      sorter: (a: TableData, b: TableData) =>
        a.madeofYear.length - b.madeofYear.length,
    },
    {
      title: "Registration No",
      dataIndex: "registrationNo",
      sorter: (a: TableData, b: TableData) =>
        a.registrationNo.length - b.registrationNo.length,
    },
    {
      title: "Chassis No",
      dataIndex: "chassisNo",
      render: (text: string) => (
        <span className="badge bg-soft-light">{text}</span>
      ),
      sorter: (a: TableData, b: TableData) =>
        a.chassisNo.length - b.chassisNo.length,
    },
    {
      title: "GPS Device ID",
      dataIndex: "gpsTrackingId",
      sorter: (a: TableData, b: TableData) => a.gps.length - b.gps.length,
    },
    {
      title: " ",
      dataIndex: "driverContactNo",
      render: () => (
        <Link
          to="#"
          className="btn btn-light live track"
          data-bs-toggle="modal"
          data-bs-target="#live_track"
        >
          Live Track
        </Link>
      ),
    },
    {
      title: "Driver",
      dataIndex: "driver",
      render: (text: string, record: any) => (
        <div className="d-flex align-items-center">
          <Link to="#" className="avatar avatar-md">
            <ImageWithBasePath
              src={record.img}
              className="img-fluid rounded-circle"
              alt="img"
            />
          </Link>
          <div className="ms-2">
            <p className="text-dark mb-0">
              <Link to="#">
                {driverName.find((item) => item.value == text)?.label}
              </Link>
            </p>
            <span className="fs-12">{record.driverContactNo}</span>
          </div>
        </div>
      ),
      sorter: (a: TableData, b: TableData) => a.name.length - b.name.length,
    },

    {
      title: "Status",
      dataIndex: "status",
      render: (text: number) => (
        <>
          {text === 1 ? (
            <span className="badge badge-soft-success d-inline-flex align-items-center">
              <i className="ti ti-circle-filled fs-5 me-1"></i>
              {"Active"}
            </span>
          ) : (
            <span className="badge badge-soft-danger d-inline-flex align-items-center">
              <i className="ti ti-circle-filled fs-5 me-1"></i>
              {"Inactive"}
            </span>
          )}
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.status.length - b.status.length,
    },

    {
      title: "Action",
      dataIndex: "action",
      render: (_: any, record: any) => (
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
                    data-bs-target="#edit_vehicle"
                    onClick={() => setSelecteVehicleInfo(record)}
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
                    onClick={() => setSelecteVehicleInfo(record)}
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
              <h3 className="page-title mb-1">Transport</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Management</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Transport
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
                  data-bs-target="#add_vehicle"
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Vehicle
                </Link>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          {/* Students List */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Transport</h4>
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
                              <label className="form-label">
                                Vehicle Number
                              </label>
                              <CommonSelect
                                className="select"
                                options={VehicleNumber}
                                defaultValue={undefined}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Model</label>
                              <CommonSelect
                                className="select"
                                options={vehicleModel}
                                // defaultValue={vehicleModel[0]}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Name</label>
                              <CommonSelect
                                className="select"
                                options={driverName}
                                // defaultValue={driverName[0]}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">GPS Device</label>
                              <CommonSelect
                                className="select"
                                options={GPSDevice}
                                defaultValue={undefined}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-0">
                              <label className="form-label">Driver</label>
                              <CommonSelect
                                className="select"
                                options={driverName}
                                defaultValue={undefined}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Status</label>
                              <CommonSelect
                                className="select"
                                options={status}
                                // defaultValue={status[0]}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-0">
                              <label className="form-label">More Filter</label>
                              <CommonSelect
                                className="select"
                                options={driverFilter2}
                                // defaultValue={driverFilter2[0]}
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
              <Table
                dataSource={filterVehicleDetails}
                columns={columns}
                Selection={true}
              />
              {/* /Student List */}
            </div>
          </div>
          {/* /Students List */}
        </div>
      </div>
      {/* /Page Wrapper */}
      <TransportModal
        onAdded={fetchVehicleDetails}
        onUpdated={fetchVehicleDetails}
        selectedItem={selectedVehicleInfo}
        clearSelected={() => setSelecteVehicleInfo(null)}
        handleDelete={() =>
          selectedVehicleInfo && handleDelete(selectedVehicleInfo.id)
        }
      />
    </>
  );
};

export default TransportVehicle;
