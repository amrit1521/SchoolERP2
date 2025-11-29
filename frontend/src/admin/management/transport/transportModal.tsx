import { Link } from "react-router-dom";
import {
  // driverName,
  // PickupPoint2,
  // routesList,
  // VehicleNumber,
} from "../../../core/common/selectoption/selectoption";
import CommonSelect from "../../../core/common/commonSelect";
// import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import dayjs from "dayjs";
import { DatePicker } from "antd";
import {
  addPickUpPoints,
  addRoutes,
  addVehicle,
  allDriversForOption,
  assignVehicleToRoute,
  getAllAssignedVehicles,
  getAllTransportRoutes,
  getAllVehicle,
  // getTransportRoutesByRouteId,
  udpateTransportRoutes,
  updateAssignedVehicle,
  updateTransportPickupPoints,
  updateVehicleById,
} from "../../../service/api";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

interface TransportModalProps {
  onAdded: () => void;
  onUpdated: () => void;
  selectedItem: any | null;
  clearSelected: () => void;
  handleDelete: (id: number) => void;
}

const TransportModal: React.FC<TransportModalProps> = ({
  onAdded,
  onUpdated,
  selectedItem,
  clearSelected,
  handleDelete,
}) => {
  // const today = new Date();
  // const year = today.getFullYear();
  // const month = String(today.getMonth() + 1).padStart(2, "0"); // Month is zero-based, so we add 1
  // const day = String(today.getDate()).padStart(2, "0");
  // const formattedDate = `${month}-${day}-${year}`;
  // const defaultValue = dayjs(formattedDate);
  // routes modules:
  const [routeName, setRouteName] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      selectedItem &&
      Object.prototype.hasOwnProperty.call(selectedItem, "routeName")
    ) {
      setRouteName(selectedItem.routeName || "");
      setIsActive(selectedItem.status === 1);
    } else {
      resetForm();
    }
  }, [selectedItem]);

  const resetForm = () => {
    setRouteName("");
    setIsActive(true);
  };

  const validateForm = (): boolean => {
    if (!routeName.trim()) {
      toast.error("Please enter a route name");
      return false;
    }
    return true;
  };

  const handleCreateRoutes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const date = new Date();
      const options: any = { day: "2-digit", month: "long", year: "numeric" };
      const payload = {
        routeName,
        status: isActive ? 1 : 0,
        addedOn: date.toLocaleDateString("en-GB", options),
      };
      const { data } = await addRoutes(payload);
      if (data.success) {
        toast.success(data.message || "Route added successfully");
        resetForm();
        onAdded();
        closeModal("add_routes");
      } else {
        toast.error(data.message || "Failed to add route");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error adding route");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRoutes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !selectedItem) return;
    setLoading(true);
    try {
      const payload = { routeName, status: isActive ? 1 : 0 };
      const { data } = await udpateTransportRoutes(payload, selectedItem.id);
      if (data.success) {
        toast.success(data.message || "Route updated successfully");
        resetForm();
        onUpdated();
        clearSelected();
        closeModal("edit_routes");
      } else {
        toast.error(data.message || "Failed to update route");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error updating route");
    } finally {
      setLoading(false);
    }
  };

  const handleResetModalForm = () => {
    clearSelected();
  };

  const handleDeleteRecord = () => {
    handleDelete(selectedItem?.id);
  };

  const closeModal = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const modal = (window as any).bootstrap?.Modal?.getInstance(el);
      modal?.hide();
    }
  };

  // pickup Points Module:
  const [routeListOption, setRouteListOption] = useState<any[]>([]);
  const [pickPointName, setPickPointName] = useState("");
  const [selectedRotues, setSelectedRoutes] = useState<any>();
  const [pickupStatus, setPickupStatus] = useState(false);
  const fetchRoutes = async () => {
    try {
      const { data } = await getAllTransportRoutes();
      if (data.success) {
        setRouteListOption(
          data.result
            .filter((e: any) => e.status === 1)
            .map((e: any) => ({ value: e.id, label: e.routeName }))
        );
      } else {
        toast.error(data.message || "Failed to load routes");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load routes");
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const validatePickUpForm = (): boolean => {
    if (!pickPointName.trim()) {
      toast.error("Pickup Point Name is required.");
      return false;
    }

    // if (!selectedRotues || !selectedRotues.value) {
    //   toast.error("Please select a route.");
    //   return false;
    // }

    return true;
  };

  const resetPickUpForm = () => {
    setPickPointName("");
    setSelectedRoutes(null);
    setPickupStatus(false);
  };

  const handleCreatePickupPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePickUpForm()) return;
    try {
      const date = new Date();
      const options: any = { day: "2-digit", month: "long", year: "numeric" };
      const payload = {
        route_id: selectedRotues?.value,
        pickPointName: pickPointName,
        status: pickupStatus,
        addedOn: date.toLocaleDateString("en-GB", options),
      };
      const { data } = await addPickUpPoints(payload);
      if (data.success) {
        toast.success(data.message || "Pick up Points added successfully");
        resetPickUpForm();
        onAdded();
        closeModal("add_pickup");
      } else {
        toast.error(data.message || "Failed to load pick up points.");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error adding route");
    }
  };

  useEffect(() => {
    if (
      selectedItem &&
      Object.prototype.hasOwnProperty.call(selectedItem, "pickPointName")
    ) {
      setPickPointName(selectedItem.pickPointName || "");
      setPickupStatus(selectedItem.status === 1);
    } else {
      resetPickUpForm();
    }
  }, [selectedItem]);

  const handleUpdatePickupPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePickUpForm() || !selectedItem) return;
    setLoading(true);
    const date = new Date();
    const options: any = { day: "2-digit", month: "long", year: "numeric" };
    try {
      const payload = {
        pickPointName,
        status: pickupStatus ? 1 : 0,
        addedOn: date.toLocaleDateString("en-GB", options),
      };
      const { data } = await updateTransportPickupPoints(
        payload,
        selectedItem.id
      );
      if (data.success) {
        toast.success(data.message || "Pick up Points updated successfully");
        resetPickUpForm();
        onAdded();
        closeModal("edit_pickup");
      } else {
        toast.error(data.message || "Failed to update pick up points.");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Error updating pick up points"
      );
    } finally {
      setLoading(false);
    }
    resetPickUpForm();
  };

  // Add New Vehicle Module:
  const [driveropt, setDriveropt] = useState<{ value: number, label: string }[]>([])
  const [vehicleNo, setVehicleNo] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [madeOfYear, setMadeOfYear] = useState("");
  const [registrationNo, setRegistrationNo] = useState("");
  const [chassisNo, setChassisNo] = useState("");
  const [seatCapacity, setSeatCapacity] = useState("");
  const [gpsTrackingId, setGpsTrackingId] = useState("");
  const [driver, setDriver] = useState<number | null>(null);
  const [errors, setErrors] = useState<any>({})

  const fetchAllDriversForOption = async () => {
    try {
      const { data } = await allDriversForOption();

      if (data.success) {
        setDriveropt(
          data.data.map((d: any) => ({
            value: d.id,
            label: d.name,
          }))
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllDriversForOption()
  }, [])

  const vehicleFormReset = () => {
    setVehicleNo("");
    setVehicleModel("");
    setMadeOfYear("");
    setRegistrationNo("");
    setChassisNo("");
    setSeatCapacity("");
    setGpsTrackingId("");
    setDriver(null);

  };

  const validateVehicleForm = () => {
    let newErrors: any = {};
    const vehicleRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/;

    if (!vehicleNo.trim()) {
      newErrors.vehicleNo = "Vehicle Number is required";
    } else if (!vehicleRegex.test(vehicleNo.toUpperCase().replace(/\s/g, ""))) {
      newErrors.vehicleNo =
        "Invalid Vehicle Number format. Example: UP32AB1234";
    }

    // OTHER VALIDATIONS
    if (!vehicleModel.trim()) {
      newErrors.vehicleModel = "Vehicle Model is required";
    }

    if (!madeOfYear) {
      newErrors.madeOfYear = "Made of Year is required";
    }

    if (!registrationNo.trim()) {
      newErrors.registrationNo = "Registration Number is required";
    }

    if (!chassisNo.trim()) {
      newErrors.chassisNo = "Chassis Number is required";
    }

    if (!seatCapacity) {
      newErrors.seatCapacity = "Seat Capacity is required";
    }

    if (!gpsTrackingId.trim()) {
      newErrors.gpsTrackingId = "GPS Tracking ID is required";
    }

    if (!driver) {
      newErrors.driver = "Please select a driver";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };


  const handleAddNewVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implement the logic to add a new vehicle here
    if (!validateVehicleForm()) return
    const newVehicle = {
      vehicleNo,
      vehicleModel,
      madeOfYear,
      registrationNo,
      chassisNo,
      seatCapacity,
      gpsTrackingId,
      driver,
      status: 1,
    };

    try {
      const { data } = await addVehicle(newVehicle);
      if (data.success) {
        toast.success(data.message || "Vehicle added successfully");
        vehicleFormReset();
        onAdded();
        setErrors({})
        closeModal("add_vehicle");
      } else {
        toast.error(data.message || "Failed to add vehicle");
      }
    } catch (error: any) {
      console.log(error)
      toast.error(error.response?.data?.message || "Error adding vehicle");
    }
  };

  useEffect(() => {
    if (
      selectedItem &&
      Object.prototype.hasOwnProperty.call(selectedItem, "registrationNo") &&
      Object.prototype.hasOwnProperty.call(selectedItem, "vehicleNo") &&
      Object.prototype.hasOwnProperty.call(selectedItem, "vehicleModel")
    ) {
      setVehicleNo(selectedItem.vehicleNo || "");
      setVehicleModel(selectedItem.vehicleModel || "");
      setMadeOfYear(dayjs(selectedItem.madeofYear).format("DD MMM YYYY") || "");
      setRegistrationNo(selectedItem.registrationNo || "");
      setChassisNo(selectedItem.chassisNo || "");
      setSeatCapacity(selectedItem.seatCapacity || "");
      setGpsTrackingId(selectedItem.gpsTrackingId || "");
      setDriver(selectedItem.driverId);

    } else {
      vehicleFormReset();
    }
  }, [selectedItem]);

  const handleUpdateVehicle = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedItem) return;
    if (!validateVehicleForm()) return
    const updatedVehicle = {
      vehicleNo,
      vehicleModel,
      madeOfYear,
      registrationNo,
      chassisNo,
      seatCapacity,
      gpsTrackingId,
      driver,
      status: 1,
    };
    try {
      const { data } = await updateVehicleById(
        updatedVehicle,
        selectedItem?.id
      );
      if (data.success) {
        toast.success(data.message || "Vehicle updated successfully");
        vehicleFormReset();
        onUpdated();
        setErrors({})
        closeModal("edit_vehicle");
      } else {
        toast.error(data.message || "Failed to update vehicle");
      }
    } catch (error: any) {
      console.log(error)
      toast.error(error.response?.data?.message || "Error updating vehicle");
    }
  };


  const [selectAssignRoute, setSelectAssignRoute] = useState<any>(null);
  const [vehicleOption, setVehicleOption] = useState<any[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [isVehicleAssigned, setIsVehicleAssigned] = useState(false);
  const fetchAllVehicles = async () => {
    try {
      const { data } = await getAllVehicle();
      const result = await getAllAssignedVehicles();
      if (data.success) {
        const unassignedVehicles = selectedItem?.routeId
          ? data.result.filter(
            (vehicle: any) =>
              !result.data.result.some(
                (assigned: any) =>
                  assigned.vehicle_no === vehicle.vehicle_no &&
                  assigned.route_id !== selectAssignRoute?.value
              )
          )
          : data.result.filter(
            (vehicle: any) =>
              !result.data.result.some(
                (assigned: any) => assigned.vehicle_no === vehicle.vehicle_no
              )
          );
        setVehicleOption(
          unassignedVehicles.map((v: any) => ({
            value: v.id,
            label: v.vehicle_no,
          }))
        );
      } else {
        toast.error(data.message || "Failed to load vehicles");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load vehicles");
    }
  };

  useEffect(() => {
    if (selectAssignRoute?.value) {
      fetchAllVehicles();
    } else {
      vehicleAssignedFormReset();
    }
  }, [selectAssignRoute?.value]);

  const vehicleAssignedFormReset = () => {
    setSelectAssignRoute({ value: null, label: null });
    setSelectedVehicle({ value: null, label: null });
    setIsVehicleAssigned(false);
  };

  const handleAssignedVehicle = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectAssignRoute?.value || !selectedVehicle?.value) {
      toast.error("Please select both route and vehicle.");
      return;
    }

    try {
      const payload = {
        route_id: selectAssignRoute.value,
        vehicle_id: selectedVehicle.value,
        status: isVehicleAssigned ? 1 : 0,
      };

      const { data } = await assignVehicleToRoute(payload);

      if (data.success) {
        toast.success(data.message || "Vehicle assigned successfully");
        onAdded();
        closeModal("add_assign_vehicle");
        vehicleAssignedFormReset();
      } else {
        toast.error(data.message || "Failed to assign vehicle");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error assigning vehicle");
    }
  };

  useEffect(() => {
    if (selectedItem && selectedItem?.routeId && selectedItem?.vehicleId) {
      setSelectAssignRoute({
        value: selectedItem.routeId,
        label: selectedItem.routeName || "",
      });
      setSelectedVehicle({
        value: selectedItem.vehicleId,
        label: selectedItem.vehicleNo || "",
      });
      setIsVehicleAssigned(selectedItem.status === 1);
    } else {
      vehicleAssignedFormReset();
    }
  }, [selectedItem]);

  useEffect(() => {
    const handleModalClose = () => {
      vehicleAssignedFormReset();
    };

    window.addEventListener("modalClosed:add_assign_vehicle", handleModalClose);

    return () => {
      window.removeEventListener(
        "modalClosed:add_assign_vehicle",
        handleModalClose
      );
    };
  }, []);

  const handleUpdateAssignedVehicle = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectAssignRoute?.value || !selectedVehicle?.value) {
      toast.error("Please select both route and vehicle.");
      return;
    }

    try {
      const payload = {
        route_id: selectAssignRoute.value,
        vehicle_id: selectedVehicle.value,
        status: isVehicleAssigned ? 1 : 0,
      };

      const { data } = await updateAssignedVehicle(payload, selectedItem?.id);

      if (data.success) {
        toast.success(data.message || "Vehicle updated successfully");
        onUpdated();
        closeModal("add_assign_vehicle");
        vehicleAssignedFormReset();
      } else {
        toast.error(data.message || "Failed to update vehicle");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error updating vehicle");
    }
  };

  return (
    <>
      <>
        {/* Add Route */}
        <div className="modal fade" id="add_routes" tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Route</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form onSubmit={handleCreateRoutes}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Route Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Route Name"
                      value={routeName}
                      onChange={(e) => setRouteName(e.target.value)}
                    />
                  </div>
                  <div className="modal-status-toggle d-flex align-items-center justify-content-between">
                    <div className="status-title">
                      <h5>Status</h5>
                      <p>Change the status by toggle</p>
                    </div>
                    <div className="status-toggle modal-status">
                      <input
                        type="checkbox"
                        id="userStatus1"
                        className="check"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                      />
                      <label
                        htmlFor="userStatus1"
                        className="checktoggle"
                      ></label>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <Link
                    to="#"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                    onClick={handleResetModalForm}
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Adding..." : "Add Route"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Edit Route */}
        <div className="modal fade" id="edit_routes" tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Route</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form onSubmit={handleUpdateRoutes}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Route Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={routeName}
                      onChange={(e) => setRouteName(e.target.value)}
                    />
                  </div>
                  <div className="modal-status-toggle d-flex align-items-center justify-content-between">
                    <div className="status-title">
                      <h5>Status</h5>
                      <p>Change the status by toggle</p>
                    </div>
                    <div className="status-toggle modal-status">
                      <input
                        type="checkbox"
                        id="userStatus2"
                        className="check"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                      />
                      <label
                        htmlFor="userStatus2"
                        className="checktoggle"
                      ></label>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <Link
                    to="#"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                    onClick={handleResetModalForm}
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
      <>
        {/* Add Assign New Vehicle */}
        <div className="modal fade" id="add_assign_vehicle">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Assign New Vehicle</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    handleResetModalForm();
                    vehicleAssignedFormReset();
                  }}
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form onSubmit={handleAssignedVehicle}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Select Route</label>

                        <CommonSelect
                          className="select"
                          options={routeListOption}
                          value={selectAssignRoute?.value}
                          onChange={(opt) => setSelectAssignRoute(opt)}
                        />
                      </div>
                      {/* <div className="mb-3">
                        <label className="form-label">
                          Select Pickup Point
                        </label>
                        <CommonSelect
                          className="select"
                          options={assignedPickupPointsOptions}
                          value={selectedPickupPoint?.value}
                          onChange={(opt) => setSelectedPickupPoint(opt)}
                        />
                      </div> */}
                      <div className="mb-3">
                        <label className="form-label">Select Vehicle</label>
                        <CommonSelect
                          className="select"
                          options={vehicleOption}
                          value={selectedVehicle?.value}
                          onChange={(opt) => setSelectedVehicle(opt)}
                        />
                      </div>
                      <div className="modal-status-toggle d-flex align-items-center justify-content-between">
                        <div className="status-title">
                          <h5>Status</h5>
                          <p>Change the status by toggle</p>
                        </div>
                        <div className="status-toggle modal-status">
                          <input
                            type="checkbox"
                            id="vehicleStatus2"
                            className="check"
                            checked={isVehicleAssigned}
                            onChange={(e) =>
                              setIsVehicleAssigned(e.target.checked)
                            }
                          />
                          <label
                            htmlFor="vehicleStatus2"
                            className="checktoggle"
                          ></label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                    onClick={() => {
                      handleResetModalForm();
                      vehicleAssignedFormReset();
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    data-bs-dismiss="modal"
                    className="btn btn-primary"
                  >
                    Assign Now
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Add Assign New Vehicle */}
        {/* Edit Assign New Vehicle */}
        <div className="modal fade" id="edit_assign_vehicle">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Assign Vehicle</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    handleResetModalForm();
                    vehicleAssignedFormReset();
                  }}
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form onSubmit={handleUpdateAssignedVehicle}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Select Route</label>
                        <CommonSelect
                          className="select"
                          options={routeListOption.filter(
                            (e) => e.value === selectAssignRoute?.value
                          )}
                          value={selectAssignRoute?.value}
                          onChange={(opt) => setSelectAssignRoute(opt)}
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label">Select Vehicle</label>
                        <CommonSelect
                          className="select"
                          options={vehicleOption}
                          value={selectedVehicle?.value}
                          onChange={(opt) => setSelectedVehicle(opt)}
                        />  
                      </div>
                      {/* <div className="assigned-driver mb-3">
                        <h6>Assigned Driver</h6>
                        <div className="assigned-driver-info">
                          <span className="driver-img">
                            <ImageWithBasePath
                              src="assets/img/parents/parent-01.jpg"
                              alt="Img"
                            />
                          </span>
                          <div>
                            <h5>
                              {
                                driverName.find(
                                  (item) => item.value == selectedItem?.driver
                                )?.label
                              }
                            </h5>
                            <span>
                              {selectedItem ? selectedItem?.driverPhone : ""}
                            </span>
                          </div>
                        </div>
                      </div> */}
                      <div className="modal-status-toggle d-flex align-items-center justify-content-between">
                        <div className="status-title">
                          <h5>Status</h5>
                          <p>Change the status by toggle</p>
                        </div>
                        <div className="status-toggle modal-status">
                          <input
                            type="checkbox"
                            id="vehicleStatus2"
                            className="check"
                            checked={isVehicleAssigned}
                            onChange={(e) =>
                              setIsVehicleAssigned(e.target.checked)
                            }
                          />
                          <label
                            htmlFor="vehicleStatus2"
                            className="checktoggle"
                          ></label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <Link
                    to="#"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                    onClick={() => {
                      handleResetModalForm();
                      vehicleAssignedFormReset();
                    }}
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    data-bs-dismiss="modal"
                    className="btn btn-primary"
                  >
                    Assign Now
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Edit Assign New Vehicle */}
      </>
      <>
        {/* Add Pickup */}
        <div className="modal fade" id="add_pickup">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Pickup Point</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form onSubmit={handleCreatePickupPoints}>
                <div className="modal-body">
                  <div className="row">
                    <div className="mb-3">
                      <label className="form-label">Select Route</label>

                      <CommonSelect
                        className="select"
                        options={routeListOption}
                        value={selectedRotues?.value}
                        onChange={(opt) => setSelectedRoutes(opt)}
                      />
                    </div>
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Pickup Point</label>
                        <input
                          type="text"
                          className="form-control"
                          value={pickPointName}
                          onChange={(e) => setPickPointName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="modal-satus-toggle d-flex align-items-center justify-content-between">
                      <div className="status-title">
                        <h5>Status</h5>
                        <p>Change the Status by toggle </p>
                      </div>
                      <div className="status-toggle modal-status">
                        <input
                          type="checkbox"
                          id="user1"
                          className="check"
                          checked={pickupStatus}
                          onChange={(e) => setPickupStatus(e.target.checked)}
                        />
                        <label htmlFor="user1" className="checktoggle">
                          {" "}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <Link
                    to="#"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                    onClick={handleResetModalForm}
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    data-bs-dismiss="modal"
                    className="btn btn-primary"
                  >
                    Add Pickup Point
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Add Pickup */}
        {/* Edit Pickup */}
        <div className="modal fade" id="edit_pickup">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Pickup Point</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form onSubmit={handleUpdatePickupPoints}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Pickup Point</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Pickup Point"
                          value={pickPointName}
                          onChange={(e) => setPickPointName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="modal-satus-toggle d-flex align-items-center justify-content-between">
                      <div className="status-title">
                        <h5>Status</h5>
                        <p>Change the Status by toggle </p>
                      </div>
                      <div className="status-toggle modal-status">
                        <input
                          type="checkbox"
                          id="user2"
                          className="check"
                          checked={pickupStatus}
                          onChange={(e) => setPickupStatus(e.target.checked)}
                        />
                        <label htmlFor="user2" className="checktoggle">
                          {" "}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <Link
                    to="#"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                    onClick={handleResetModalForm}
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    data-bs-dismiss="modal"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Edit Pickup */}
      </>
      <>
        {/* Add Driver */}
        <div className="modal fade" id="add_driver">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add New Driver</h4>
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
                        <label className="form-label">Name</label>
                        <input type="text" className="form-control" />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Phone Number</label>
                        <input type="text" className="form-control" />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">
                          Driving License Number
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Driving License Number"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Address</label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                    <div className="modal-satus-toggle d-flex align-items-center justify-content-between">
                      <div className="status-title">
                        <h5>Status</h5>
                        <p>Change the Status by toggle </p>
                      </div>
                      <div className="status-toggle modal-status">
                        <input type="checkbox" id="user1" className="check" />
                        <label htmlFor="user1" className="checktoggle">
                          {" "}
                        </label>
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
                    Add Driver
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Add Driver */}
        {/* Edit Driver */}
        <div className="modal fade" id="edit_driver">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Driver</h4>
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
                        <label className="form-label">Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Name"
                          defaultValue="Thomas"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Phone Number</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Phone Number"
                          defaultValue="+1 64044 74890"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">
                          Driving License Number
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Driving License Number"
                          defaultValue="LC7899456689"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Address</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Address"
                          defaultValue="2233 Wood Street, Slidell, LA"
                        />
                      </div>
                    </div>
                    <div className="modal-satus-toggle d-flex align-items-center justify-content-between">
                      <div className="status-title">
                        <h5>Status</h5>
                        <p>Change the Status by toggle </p>
                      </div>
                      <div className="status-toggle modal-status">
                        <input
                          type="checkbox"
                          id="user2"
                          className="check"
                          defaultChecked
                        />
                        <label htmlFor="user2" className="checktoggle">
                          {" "}
                        </label>
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
        {/* Edit Driver */}
      </>
      <>
        {/* Add New Vehicle */}
        <div className="modal fade" id="add_vehicle">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add New Vehicle</h4>
                <button type="button" className="btn-close custom-btn-close" data-bs-dismiss="modal">
                  <i className="ti ti-x" />
                </button>
              </div>

              <form onSubmit={handleAddNewVehicle}>
                <div className="modal-body" id="modal-datepicker">
                  <div className="row">
                    <div className="col-md-12">

                      <div className="row">

                        {/* Vehicle No */}
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Vehicle No</label>
                            <input
                              type="text"
                              className="form-control"
                              value={vehicleNo}
                              onChange={(e) => setVehicleNo(e.target.value)}
                            />
                            {errors?.vehicleNo && (
                              <span style={{ color: "red", fontSize: "11px", marginTop: "3px", display: "block" }}>
                                {errors.vehicleNo}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Vehicle Model */}
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Vehicle Model</label>
                            <input
                              type="text"
                              className="form-control"
                              value={vehicleModel}
                              onChange={(e) => setVehicleModel(e.target.value)}
                            />
                            {errors?.vehicleModel && (
                              <span style={{ color: "red", fontSize: "11px", marginTop: "3px", display: "block" }}>
                                {errors.vehicleModel}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Made of Year */}
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Made of Year</label>
                            <div className="date-pic">

                              <DatePicker
                                className="form-control datetimepicker"
                                format="DD MMM YYYY"
                                value={madeOfYear?dayjs(madeOfYear, "DD MMM YYYY"):null}
                                placeholder="Select Date"
                                onChange={(date) => setMadeOfYear(date ? dayjs(date).format("DD MMM YYYY") : "")}
                              />
                              <span className="cal-icon"><i className="ti ti-calendar" /></span>
                            </div>

                            {errors?.madeOfYear && (
                              <span style={{ color: "red", fontSize: "11px", marginTop: "3px", display: "block" }}>
                                {errors.madeOfYear}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Registration No */}
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Registration No</label>
                            <input
                              type="text"
                              className="form-control"
                              value={registrationNo}
                              onChange={(e) => setRegistrationNo(e.target.value)}
                            />
                            {errors?.registrationNo && (
                              <span style={{ color: "red", fontSize: "11px", marginTop: "3px", display: "block" }}>
                                {errors.registrationNo}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Chassis No */}
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Chassis No</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Chassis No"
                              value={chassisNo}
                              onChange={(e) => setChassisNo(e.target.value)}
                            />
                            {errors?.chassisNo && (
                              <span style={{ color: "red", fontSize: "11px", marginTop: "3px", display: "block" }}>
                                {errors.chassisNo}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Seat Capacity */}
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Seat Capacity</label>
                            <input
                              type="text"
                              className="form-control"
                              value={seatCapacity}
                              onChange={(e) => setSeatCapacity(e.target.value)}
                            />
                            {errors?.seatCapacity && (
                              <span style={{ color: "red", fontSize: "11px", marginTop: "3px", display: "block" }}>
                                {errors.seatCapacity}
                              </span>
                            )}
                          </div>
                        </div>

                      </div>

                      {/* GPS Tracking ID */}
                      <div className="mb-3">
                        <label className="form-label">GPS Tracking ID</label>
                        <input
                          type="text"
                          className="form-control"
                          value={gpsTrackingId}
                          onChange={(e) => setGpsTrackingId(e.target.value)}
                        />
                        {errors?.gpsTrackingId && (
                          <span style={{ color: "red", fontSize: "11px", marginTop: "3px", display: "block" }}>
                            {errors.gpsTrackingId}
                          </span>
                        )}
                      </div>

                      <hr />

                      <div className="mb-3">
                        <h4>Driver details</h4>
                      </div>

                      {/* Driver Select */}
                      <div className="mb-3">
                        <label className="form-label">Select Driver</label>
                        <CommonSelect
                          className="select"
                          options={driveropt}
                          value={driver}
                          onChange={(opt) => setDriver(opt ? Number(opt.value) : null)}
                        />

                        {errors?.driver && (
                          <span style={{ color: "red", fontSize: "11px", marginTop: "3px", display: "block" }}>
                            {errors.driver}
                          </span>
                        )}
                      </div>

                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <Link
                    to="#"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                    onClick={handleResetModalForm}
                  >
                    Cancel
                  </Link>

                  <button type="submit" className="btn btn-primary">
                    Add New Vehicle
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Add New Vehicle */}
        {/* Edit New Vehicle */}
        <div className="modal fade" id="edit_vehicle">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header align-items-center">
                <div className="d-flex align-items-center">
                  <h4 className="modal-title">Edit Vehicle</h4>

                </div>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form onSubmit={handleUpdateVehicle}>
                <div className="modal-body" id="modal-datepicker2">
                  <div className="row">
                    <div className="col-md-12">

                      <div className="row">

                        {/* Vehicle No */}
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Vehicle No</label>
                            <input
                              type="text"
                              className="form-control"
                              value={vehicleNo}
                              onChange={(e) => setVehicleNo(e.target.value)}
                            />
                            {errors?.vehicleNo && (
                              <span style={{ color: "red", fontSize: "11px", marginTop: "3px", display: "block" }}>
                                {errors.vehicleNo}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Vehicle Model */}
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Vehicle Model</label>
                            <input
                              type="text"
                              className="form-control"
                              value={vehicleModel}
                              onChange={(e) => setVehicleModel(e.target.value)}
                            />
                            {errors?.vehicleModel && (
                              <span style={{ color: "red", fontSize: "11px", marginTop: "3px", display: "block" }}>
                                {errors.vehicleModel}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Made of Year */}
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Made of Year</label>
                            <div className="date-pic">
                              <DatePicker
                                className="form-control datetimepicker"
                                format="DD MMM YYYY"
                                value={madeOfYear?dayjs(madeOfYear, "DD MMM YYYY"):null}
                                placeholder="Select Date"
                                onChange={(date) => setMadeOfYear(date ? dayjs(date).format("DD MMM YYYY") : "")}
                              />
                              <span className="cal-icon"><i className="ti ti-calendar" /></span>
                            </div>

                            {errors?.madeOfYear && (
                              <span style={{ color: "red", fontSize: "11px", marginTop: "3px", display: "block" }}>
                                {errors.madeOfYear}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Registration No */}
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Registration No</label>
                            <input
                              type="text"
                              className="form-control"
                              value={registrationNo}
                              onChange={(e) => setRegistrationNo(e.target.value)}
                            />
                            {errors?.registrationNo && (
                              <span style={{ color: "red", fontSize: "11px", marginTop: "3px", display: "block" }}>
                                {errors.registrationNo}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Chassis No */}
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Chassis No</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Chassis No"
                              value={chassisNo}
                              onChange={(e) => setChassisNo(e.target.value)}
                            />
                            {errors?.chassisNo && (
                              <span style={{ color: "red", fontSize: "11px", marginTop: "3px", display: "block" }}>
                                {errors.chassisNo}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Seat Capacity */}
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Seat Capacity</label>
                            <input
                              type="number"
                              className="form-control"
                              value={seatCapacity}
                              onChange={(e) => setSeatCapacity(e.target.value)}
                            />
                            {errors?.seatCapacity && (
                              <span style={{ color: "red", fontSize: "11px", marginTop: "3px", display: "block" }}>
                                {errors.seatCapacity}
                              </span>
                            )}
                          </div>
                        </div>

                      </div>

                      {/* GPS Tracking ID */}
                      <div className="mb-3">
                        <label className="form-label">GPS Tracking ID</label>
                        <input
                          type="text"
                          className="form-control"
                          value={gpsTrackingId}
                          onChange={(e) => setGpsTrackingId(e.target.value)}
                        />
                        {errors?.gpsTrackingId && (
                          <span style={{ color: "red", fontSize: "11px", marginTop: "3px", display: "block" }}>
                            {errors.gpsTrackingId}
                          </span>
                        )}
                      </div>

                      <hr />

                      <div className="mb-3">
                        <h4>Driver details</h4>
                      </div>

                      {/* Driver Select */}
                      <div className="mb-3">
                        <label className="form-label">Select Driver</label>
                        <CommonSelect
                          className="select"
                          options={driveropt}
                          value={driver}
                          onChange={(opt) => setDriver(opt ? Number(opt.value) : null)}
                        />

                        {errors?.driver && (
                          <span style={{ color: "red", fontSize: "11px", marginTop: "3px", display: "block" }}>
                            {errors.driver}
                          </span>
                        )}
                      </div>

                    </div>

                  </div>
                </div>
                <div className="modal-footer">
                  <Link
                    to="#"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                    onClick={handleResetModalForm}
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"

                    className="btn btn-primary"
                  >
                    Save Vehicle
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Edit New Vehicle */}
        {/* Live Track */}
        <div className="modal fade" id="live_track">
          <div className="modal-dialog modal-dialog-centered  modal-xl">
            <div className="modal-content">
              <div className="modal-header align-items-center">
                <div className="d-flex align-items-center">
                  <h4 className="modal-title">Live Tracking Vehicle</h4>
                  <span className="badge badge-soft-primary ms-2">
                    GPS Tracking ID : GPS7899456689
                  </span>
                </div>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <div className="modal-body mb-4">
                <ul className="book-taker-info live-track-info justify-content-between">
                  <li>
                    <span>Vehicle No</span>
                    <h6>8930</h6>
                  </li>
                  <li>
                    <span>Vehicle Model</span>
                    <h6>Scania</h6>
                  </li>
                  <li>
                    <span>Driver</span>
                    <h6>Thomas</h6>
                  </li>
                  <li>
                    <span>Driver Contact No</span>
                    <h6>+1 45644 54784</h6>
                  </li>
                </ul>
                <div className="live-track-map w-100">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3321.6088932774796!2d-117.8132203247921!3d33.64138153931407!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80dcddf599c1986f%3A0x6826f6868b4f8e35!2sHillcrest%2C%20Irvine%2C%20CA%2092603%2C%20USA!5e0!3m2!1sen!2sin!4v1706772657955!5m2!1sen!2sin"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
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
                  Reset to Live Location
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* Live Track */}
      </>

      {/* Delete Modal */}
      <div className="modal fade" id="delete-modal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form>
              <div className="modal-body text-center">
                <span className="delete-icon">
                  <i className="ti ti-trash-x" />
                </span>
                <h4>Confirm Deletion</h4>
                <p>
                  You want to delete this item, this cannot be undone
                  once you delete.
                </p>
                <div className="d-flex justify-content-center">
                  <Link
                    to="#"
                    className="btn btn-light me-3"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <Link
                    to="#"
                    className="btn btn-danger"
                    data-bs-dismiss="modal"
                    onClick={handleDeleteRecord}
                  >
                    Yes, Delete
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Delete Modal */}
    </>
  );
};

export default TransportModal;
