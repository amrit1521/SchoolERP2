
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { Link } from "react-router-dom";
// import { leaveType } from "../../../core/common/selectoption/selectoption";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import CommonSelect from "../../../core/common/commonSelect";
import type React from "react";
import { handleModalPopUp } from "../../../handlePopUpmodal";
import { toast } from "react-toastify";
import { addLeave, getAllLeaveTypeData } from "../../../service/api";
import { useEffect, useState } from "react";


type props = {
  onAdd?: () => void;
  teacherId?: string;
};

export interface ApplyLeave {
  idOrRollNum: number | string | null;
  leave_type_id: number | null;
  from_date: string;
  to_date: string;
  leave_day_type: string;
  no_of_days: number | null;
  reason: string;
  leave_date: string;
  role_id:number|null,
}


const TeacherModal: React.FC<props> = ({ onAdd, teacherId }) => {
 
  // const getModalContainer = () => {
  //   const modalElement = document.getElementById("modal-datepicker");
  //   return modalElement ? modalElement : document.body;
  // };

  const [applayLeaveForm, setApplayLeaveForm] = useState<ApplyLeave>({
    idOrRollNum: null,
    leave_type_id: null,
    from_date: "",
    to_date: "",
    leave_day_type: "",
    no_of_days: null,
    reason: "",
    leave_date: "",
    role_id:2
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // fetch leave type options

  const [leaveOptions, setLeaveOptions] = useState<{ value: number; label: string }[]>([]);

  const fetchLeaveTypes = async () => {

    try {
      const { data } = await getAllLeaveTypeData();
      if (data.success) {
        const options = data.data.map((item: any) => ({ value: item.id, label: item.name }));
        setLeaveOptions(options);
      }
    } catch (error) {
      console.error(error);
    } finally {

    }
  };


  useEffect(() => {
    fetchLeaveTypes()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setApplayLeaveForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: keyof ApplyLeave, value: string | number) => {
    setApplayLeaveForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (name: keyof ApplyLeave, value: string) => {
    setApplayLeaveForm((prev) => ({ ...prev, [name]: value }))
  }

  // Validates ApplyLeave form, returns an object with errors
  const validateLeaveForm = (form: ApplyLeave) => {
    const errors: Record<string, string> = {};

    if (!form.leave_date) {
      errors.leave_date = "Leave date is required";
    }

    if (!form.leave_type_id) {
      errors.leave_type_id = "Leave type is required";
    }

    if (!form.from_date) {
      errors.from_date = "From date is required";
    }

    if (!form.to_date) {
      errors.to_date = "To date is required";
    }


    if (form.from_date && form.to_date) {
      const from = dayjs(form.from_date, "DD MMM YYYY");
      const to = dayjs(form.to_date, "DD MMM YYYY");
      if (from.isAfter(to)) {
        errors.to_date = "To date must be after From date";
      }
    }

    if (!form.leave_day_type) {
      errors.leave_day_type = "Leave day type is required";
    }

    if (!form.no_of_days || form.no_of_days <= 0) {
      errors.no_of_days = "Number of days must be greater than 0";
    }

    if (!form.reason) {
      errors.reason = "Reason is required";
    }
    setFormErrors(errors)
    return errors;
  };



  const handleLeaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!teacherId || !onAdd) return
    const updatedForm = { ...applayLeaveForm, idOrRollNum: teacherId };
    const errors = validateLeaveForm(updatedForm);

    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      toast.error(firstError);
      return;
    }

    try {
      const { data } = await addLeave(updatedForm);

      if (data.success) {
        toast.success(data.message);
        onAdd()
        setApplayLeaveForm({
          idOrRollNum: null,
          leave_type_id: null,
          from_date: "",
          to_date: "",
          leave_day_type: "",
          no_of_days: null,
          reason: "",
          leave_date: "",
          role_id:null
        });

        handleModalPopUp("apply_leave");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };


  const handleCancelLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setApplayLeaveForm({
      idOrRollNum: null,
      leave_type_id: null,
      from_date: "",
      to_date: "",
      leave_day_type: "",
      no_of_days: null,
      reason: "",
      leave_date: "",
      role_id:null

    })
  }


  return (
    <>

      <>
        {/* Login Details */}
        <div className="modal fade" id="login_detail">
          <div className="modal-dialog modal-dialog-centered  modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Login Details</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <div className="modal-body">
                <div className="student-detail-info">
                  <span className="student-img">
                    <ImageWithBasePath
                      src="assets/img/teachers/teacher-01.jpg"
                      alt="img"
                    />
                  </span>
                  <div className="name-info">
                    <h6>
                      Teresa <span>III, A</span>
                    </h6>
                  </div>
                </div>
                <div className="table-responsive custom-table no-datatable_length">
                  <table className="table datanew">
                    <thead className="thead-light">
                      <tr>
                        <th>User Type</th>
                        <th>User Name</th>
                        <th>Password </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Teacher</td>
                        <td>teacher20</td>
                        <td>teacher@53</td>
                      </tr>
                      <tr>
                        <td>Parent</td>
                        <td>parent53</td>
                        <td>parent@53</td>
                      </tr>
                    </tbody>
                  </table>
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
              </div>
            </div>
          </div>
        </div>
        {/* /Login Details */}
      </>
      {/* Apply Leave */}
      <div className="modal fade" id="apply_leave">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Apply Leave</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>

            <form onSubmit={handleLeaveSubmit}>
              <div className="modal-body">
                <div className="row">
                  {/* Leave Date */}
                  <div className="col-md-12 mb-3">
                    <label className="form-label">Leave Date</label>
                    <DatePicker
                      className="form-control datetimepicker"
                      format="DD MMM YYYY"
                      value={applayLeaveForm.leave_date ? dayjs(applayLeaveForm.leave_date, "DD MMM YYYY") : null}
                      placeholder="Select Date"
                      onChange={(date) => handleDateChange("leave_date", date ? dayjs(date).format("DD MMM YYYY") : "")}
                    />
                    {formErrors.leave_date && <small className="text-danger">{formErrors.leave_date}</small>}
                  </div>

                  {/* Leave Type */}
                  <div className="col-md-12 mb-3">
                    <label className="form-label">Leave Type</label>
                    <CommonSelect
                      className="select"
                      options={leaveOptions}
                      value={applayLeaveForm.leave_type_id}
                      onChange={(opt) => handleSelectChange("leave_type_id", opt ? opt.value : "")}
                    />
                    {formErrors.leave_type_id && <small className="text-danger">{formErrors.leave_type_id}</small>}
                  </div>

                  {/* From Date */}
                  <div className="col-md-12 mb-3">
                    <label className="form-label">Leave From Date</label>
                    <DatePicker
                      className="form-control datetimepicker"
                      format="DD MMM YYYY"
                      value={applayLeaveForm.from_date ? dayjs(applayLeaveForm.from_date, "DD MMM YYYY") : null}
                      placeholder="Select Date"
                      onChange={(date) => handleDateChange("from_date", date ? dayjs(date).format("DD MMM YYYY") : "")}
                    />
                    {formErrors.from_date && <small className="text-danger">{formErrors.from_date}</small>}
                  </div>

                  {/* To Date */}
                  <div className="col-md-12 mb-3">
                    <label className="form-label">Leave To Date</label>
                    <DatePicker
                      className="form-control datetimepicker"
                      format="DD MMM YYYY"
                      value={applayLeaveForm.to_date ? dayjs(applayLeaveForm.to_date, "DD MMM YYYY") : null}
                      placeholder="Select Date"
                      onChange={(date) => handleDateChange("to_date", date ? dayjs(date).format("DD MMM YYYY") : "")}
                    />
                    {formErrors.to_date && <small className="text-danger">{formErrors.to_date}</small>}
                  </div>

                  {/* Leave Days */}
                  <div className="col-md-12 mb-3">
                    <label className="form-label">Leave Days</label>
                    <div className="d-flex align-items-center check-radio-group">
                      <label htmlFor="fullday" className="custom-radio me-3">
                        <input
                          id="fullday"
                          type="radio"
                          name="leave_day_type"
                          value="full"
                          checked={applayLeaveForm.leave_day_type === "full"}
                          onChange={handleChange}
                        />
                        <span className="checkmark" />
                        Full Day
                      </label>
                      <label htmlFor="firsthalf" className="custom-radio me-3">
                        <input
                          id="firsthalf"
                          type="radio"
                          name="leave_day_type"
                          value="first_half"
                          checked={applayLeaveForm.leave_day_type === "first_half"}
                          onChange={handleChange}
                        />
                        <span className="checkmark" />
                        First Half
                      </label>
                      <label htmlFor="secondhalf" className="custom-radio">
                        <input
                          id="secondhalf"
                          type="radio"
                          name="leave_day_type"
                          value="second_half"
                          checked={applayLeaveForm.leave_day_type === "second_half"}
                          onChange={handleChange}
                        />
                        <span className="checkmark" />
                        Second Half
                      </label>
                    </div>
                    {formErrors.leave_day_type && <small className="text-danger">{formErrors.leave_day_type}</small>}
                  </div>

                  {/* No of Days */}
                  <div className="col-md-12 mb-3">
                    <label className="form-label">No of Days</label>
                    <input
                      type="number"
                      className="form-control"
                      name="no_of_days"
                      value={applayLeaveForm.no_of_days || ""}
                      onChange={handleChange}
                    />
                    {formErrors.no_of_days && <small className="text-danger">{formErrors.no_of_days}</small>}
                  </div>

                  {/* Reason */}
                  <div className="col-md-12 mb-0">
                    <label className="form-label">Reason</label>
                    <input
                      type="text"
                      className="form-control"
                      name="reason"
                      value={applayLeaveForm.reason}
                      onChange={handleChange}
                    />
                    {formErrors.reason && <small className="text-danger">{formErrors.reason}</small>}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  onClick={handleCancelLeave}
                  type="button"
                  className="btn btn-light me-2"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Apply Leave
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>
      {/* /Apply Leave */}
    </>
  );
};

export default TeacherModal;
