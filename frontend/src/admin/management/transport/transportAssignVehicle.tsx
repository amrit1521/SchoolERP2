import { use, useEffect, useRef, useState } from "react";
import { all_routes } from "../../router/all_routes";
import { Link } from "react-router-dom";
import PredefinedDateRanges from "../../../core/common/datePicker";
import CommonSelect from "../../../core/common/commonSelect";
import {
  driverFilter3,
  driverName,
  PickupPoint2,
  routesList,
  status,
  VehicleNumber,
} from "../../../core/common/selectoption/selectoption";
import type { TableData } from "../../../core/data/interface";
import Table from "../../../core/common/dataTable/index";
import TooltipOption from "../../../core/common/tooltipOption";
import TransportModal from "./transportModal";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { transportAssignData } from "../../../core/data/json/transport_assign";
import {
  deleteAssignedVehicleById,
  getAllAssignedVehicles,
} from "../../../service/api";
import { toast } from "react-toastify";

interface TransportAssignVehicleProps {
  id: number;
  routeName: string;
  vehicleNo: string;
  driver: string;
  driverPhone: string;
  status: number;
}

const TransportAssignVehicle = () => {
  const routes = all_routes;
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const data = transportAssignData;
  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };
  const [allAssignedVehicles, setAllAssignedVehicles] = useState<
    TransportAssignVehicleProps[]
  >([]);
  const [filteredAssignedVehicles, setFilteredAssignedVehicles] = useState<
    TransportAssignVehicleProps[]
  >([]);
  const [selectedAssignedVehicle, setSelectedAssignedVehicle] =
    useState<any>(null);

  const fetchAssginedVehicle = async () => {
    try {
      const { data } = await getAllAssignedVehicles();
      if (data.success) {
        console.log("data: ", data);
        setAllAssignedVehicles(
          data.result.map((item: any) => ({
            id: item.id,
            routeName: item.routeName,
            vehicleNo: item.vehicle_no,
            driver: item.driver_id,
            driverPhone: item.driver_contact_no,
            status: item.status,
          }))
        );
        setFilteredAssignedVehicles(
          data.result.map((item: any) => ({
            id: item.id,
            routeName: item.routeName,
            vehicleNo: item.vehicle_no,
            driver: item.driver_id,
            driverPhone: item.driver_contact_no,
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
        toast.error(data.message || "Failed to fetch assigned vehicles");
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to fetch assigned vehicles"
      );
    }
  };

  useEffect(() => {
    fetchAssginedVehicle();
  }, []);

  const handleDelete = async (id: number) => {
    console.log("handleDelete Called: ", id);
    try {
      const { data } = await deleteAssignedVehicleById(id);
      if (data.success) {
        toast.success(data.message || "Assigned Vehicle deleted successfully");
        fetchAssginedVehicle();
      } else {
        toast.error(data.message || "Failed to delete assigned vehicle");
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Error deleting assigned vehicle."
      );
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (text: string) => (
        <Link to="#" className="link-primary">
          AV0{text}
        </Link>
      ),
      sorter: (a: TableData, b: TableData) => a.id.length - b.id.length,
    },
    {
      title: "Route",
      dataIndex: "routeName",
      sorter: (a: TableData, b: TableData) => a.route.length - b.route.length,
    },
    // {
    //   title: "Pickup Point",
    //   dataIndex: "pickupPoint",
    //   sorter: (a: TableData, b: TableData) =>
    //     a.pickupPoint.length - b.pickupPoint.length,
    // },
    {
      title: "Vehicle",
      dataIndex: "vehicleNo",
      sorter: (a: TableData, b: TableData) =>
        a.vehicle.length - b.vehicle.length,
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
            <span className="fs-12">{record.driverPhone}</span>
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
                    data-bs-target="#edit_assign_vehicle"
                    onClick={() => setSelectedAssignedVehicle(record)}
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
                    onClick={() => setSelectedAssignedVehicle(record)}
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
              <h3 className="page-title mb-1">Assign Vehicle</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Management</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Assign Vehicle
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
                  data-bs-target="#add_assign_vehicle"
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Assign New Vehicle
                </Link>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          {/* Students List */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Assign Vehicle List</h4>
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
                              <label className="form-label">Route</label>
                              <CommonSelect
                                className="select"
                                options={routesList}
                                defaultValue={undefined}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Pickup Points
                              </label>
                              <CommonSelect
                                className="select"
                                options={PickupPoint2}
                                defaultValue={undefined}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
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
                                defaultValue={status[0]}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-0">
                              <label className="form-label">More Filter</label>
                              <CommonSelect
                                className="select"
                                options={driverFilter3}
                                defaultValue={undefined}
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
                dataSource={filteredAssignedVehicles}
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
        onAdded={fetchAssginedVehicle}
        selectedItem={selectedAssignedVehicle}
        handleDelete={() =>
          selectedAssignedVehicle && handleDelete(selectedAssignedVehicle.id)
        }
      />
    </>
  );
};

export default TransportAssignVehicle;
