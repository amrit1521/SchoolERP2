
import ImageWithBasePath from '../../../core/common/imageWithBasePath'
import { Link } from 'react-router-dom'

import { paymentType } from '../../../core/common/selectoption/selectoption'
import { DatePicker, Skeleton } from 'antd'
import dayjs from "dayjs";
import CommonSelect from '../../../core/common/commonSelect'
import React, { useEffect, useState } from 'react'
import { addLeave, allFeesGroupName, allFeesTypeName, getAllLeaveTypeData, stuFeesSubmit } from '../../../service/api'
import { toast } from 'react-toastify'
import { handleModalPopUp } from '../../../handlePopUpmodal';

type Props = {
  rollnum: number;
  onAdd: Function;
}
export interface ApplyLeave {
  student_rollnum: number | null;
  leave_type_id: number | null;
  from_date: string;
  to_date: string;
  leave_day_type: string;
  no_of_days: number | null;
  reason: string;
  leave_date: string;
}

export interface FeesFormData {
  student_rollnum: number;
  feesGroup: string;
  feesType: string;
  amount: string;
  collectionDate: string;
  paymentType: string;
  paymentRef: string;
  notes: string;
}

const StudentModals: React.FC<Props> = ({ rollnum, onAdd }) => {

  const [applayLeaveForm, setApplayLeaveForm] = useState<ApplyLeave>({
    student_rollnum: rollnum,
    leave_type_id: null,
    from_date: "",
    to_date: "",
    leave_day_type: "",
    no_of_days: null,
    reason: "",
    leave_date: "",
  })

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


  const handleLeaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data } = await addLeave(applayLeaveForm)
      if (data.success) {
        onAdd()
        toast.success(data.message)
        setApplayLeaveForm({
          student_rollnum: rollnum,
          leave_type_id: null,
          from_date: "",
          to_date: "",
          leave_day_type: "",
          no_of_days: null,
          reason: "",
          leave_date: "",
        })
      }

    } catch (error) {
      console.log(error)
    }
  }



  // add fees -------------------------------------------------------------

  const [formData, setFormData] = useState<FeesFormData>({
    student_rollnum: rollnum,
    feesGroup: "",
    feesType: "",
    amount: "",
    collectionDate: "",
    paymentType: "",
    paymentRef: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Partial<FeesFormData>>({});


  const handleFeesInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked ? "1" : "0"
          : value,
    }));
  };



  const handleFeesSelectChange = (name: keyof FeesFormData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFeesDateChange = (
    name: keyof FeesFormData,
    dateString: string
  ) => {
    setFormData((prev) => ({ ...prev, [name]: dateString }));
  };

  const cancelSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    handleModalPopUp('add_fees_collect')
    setFormData({
      student_rollnum: 0,
      feesGroup: "",
      feesType: "",
      amount: "",
      collectionDate: "",
      paymentType: "",
      paymentRef: "",
      notes: "",
    })
    setErrors({});
  }

  const validateForm = () => {
    const newErrors: Partial<FeesFormData> = {};

    if (!formData.feesGroup) newErrors.feesGroup = "Fees Group is required";
    if (!formData.feesType) newErrors.feesType = "Fees Type is required";
    if (!formData.amount) newErrors.amount = "Amount is required";
    else if (isNaN(Number(formData.amount))) newErrors.amount = "Amount must be a number";

    if (!formData.collectionDate) newErrors.collectionDate = "Collection Date is required";
    if (!formData.paymentType) newErrors.paymentType = "Payment Type is required";
    if (!formData.paymentRef) newErrors.paymentRef = "Payment Reference is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handeFeesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    try {
      const { data } = await stuFeesSubmit(formData)
      if (data.success) {
        toast.success(data.message)
        handleModalPopUp('add_fees_collect')
        setFormData({
          student_rollnum: 0,
          feesGroup: "",
          feesType: "",
          amount: "",
          collectionDate: "",
          paymentType: "",
          paymentRef: "",
          notes: "",
        })
        setErrors({}); // reset errors
      }
    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }


  // sir ke kehne per comment kiya h maine ye
  // interface StudentForFees {
  //   class: string;
  //   section: string;
  //   img: string;
  //   name: string;
  // }
  // const [stuDet, setStuDet] = useState<StudentForFees>({
  //   class: '',
  //   section: '',
  //   img: '',
  //   name: '',
  // })
  // const [loading, setloading] = useState<boolean>(false)

  // useEffect(() => {

  //   const fetchStudentDetForFees = async (id: number) => {
  //     setloading(true)
  //     try {
  //       const { data } = await studentDetForFees(id)
  //       if (data.success) {
  //         setStuDet(data.student)
  //       }
  //     } catch (error: any) {
  //       console.log(error)
  //       toast.error(error.response.data.message)
  //     } finally {
  //       setloading(false)
  //     }

  //   }
  //   fetchStudentDetForFees(id)

  // }, [id])
  // sir ke kehne per comment kiya h maine ye


  const [feesGroupOptions, setFeesGroupOptions] = useState<{ value: number; label: string }[]>([]);
  const [feesTypeOptions, setFeesTypeOptions] = useState<{ value: number; label: string }[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [leaveOptions, setLeaveOptions] = useState<{ value: number; label: string }[]>([]);



  const fetchFeesOptions = async () => {
    setLoadingOptions(true);
    try {
      const [groupRes, typeRes] = await Promise.all([allFeesGroupName(), allFeesTypeName()]);
      if (groupRes.data.success) {
        setFeesGroupOptions(groupRes.data.feesGroups.map((g: any) => ({ value: g.id, label: g.feesGroup })));
      }
      if (typeRes.data.success) {
        setFeesTypeOptions(typeRes.data.feesTypes.map((t: any) => ({ value: t.id, label: t.name })));
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Failed to load fees options.');
    } finally {
      setLoadingOptions(false);
    }
  };



  const fetchLeaveTypes = async () => {
    try {
      const { data } = await getAllLeaveTypeData();
      if (data.success) {
        const options = data.data.map((item: any) => ({ value: item.id, label: item.name }));
        setLeaveOptions(options);
      }
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    fetchFeesOptions()
    fetchLeaveTypes()
  }, [])

  return (
    <>


      {/* Add Fees Collect */}
      <div className="modal fade" id="add_fees_collect">
        <div className="modal-dialog modal-dialog-centered  modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <div className="d-flex align-items-center">
                <h4 className="modal-title">Collect Fees</h4>
                <span className="badge badge-sm bg-primary ms-2">AD124556</span>
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
            <form onSubmit={handeFeesSubmit}>
              <div id="modal-datepicker" className="modal-body">
                <div className="bg-light-300 p-3 pb-0 rounded mb-4">
                  {/* sir ke kenhe per abhi maine ye commment kiya h */}
                  <div className="row align-items-center">
                    <div className="col-lg-3 col-md-6">
                      {/* {
            loading ?
              (<div className="d-flex align-items-center mb-3">
                <div className="avatar avatar-md me-2">
                 
                  <Skeleton.Avatar active  />
                </div>
                <div  className="d-flex flex-column">
                 <Skeleton.Input  active size='small' style={{width:'50'}} />
                 <Skeleton.Input  active size='small' style={{width:'50'}} />
                </div>
              </div>)
              :
              (<div className="d-flex align-items-center mb-3">
                <div className="avatar avatar-md me-2">
                  <img src={`${Imageurl}/${stuDet.img}`} alt="img" />
                </div>
                <div  className="d-flex flex-column">
                  <span className="text-dark">{stuDet.name}</span>{`${stuDet.class} , ${stuDet.section}`}
                </div>
              </div>)
          } */}
                    </div>

                    {/* <div className="col-lg-3 col-md-6">
          <div className="mb-3">
            <span className="fs-12 mb-1">Total Outstanding</span>
            <p className="text-dark">2000</p>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="mb-3">
            <span className="fs-12 mb-1">Last Date</span>
            <p className="text-dark">25 May 2024</p>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="mb-3">
            <span className="badge badge-soft-danger">
              <i className="ti ti-circle-filled me-2" />
              Unpaid
            </span>
          </div>
        </div> */}
                  </div>
                </div>

                <div className="row">
                  {/* Fees Group */}
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Fees Group</label>
                      <CommonSelect
                        className="select"
                        options={feesGroupOptions}
                        value={formData.feesGroup}
                        onChange={(option) =>
                          handleFeesSelectChange("feesGroup", option ? option.value : "")
                        }
                      />
                      {errors.feesGroup && (
                        <small className="text-danger">{errors.feesGroup}</small>
                      )}
                    </div>
                  </div>

                  {/* Fees Type */}
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Fees Type</label>
                      <CommonSelect
                        className="select"
                        options={feesTypeOptions}
                        value={formData.feesType}
                        onChange={(option) =>
                          handleFeesSelectChange("feesType", option ? option.value : "")
                        }
                      />
                      {errors.feesType && (
                        <small className="text-danger">{errors.feesType}</small>
                      )}
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Amount</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Amount"
                        name="amount"
                        value={formData.amount}
                        onChange={handleFeesInputChange}
                      />
                      {errors.amount && (
                        <small className="text-danger">{errors.amount}</small>
                      )}
                    </div>
                  </div>

                  {/* Collection Date */}
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Collection Date</label>
                      <div className="date-pic">
                        <DatePicker
                          className="form-control datetimepicker"
                          format="DD MMM YYYY"
                          value={
                            formData.collectionDate
                              ? dayjs(formData.collectionDate, "DD MMM YYYY")
                              : null
                          }
                          placeholder="Select Date"
                          onChange={(dateString) =>
                            handleFeesDateChange(
                              "collectionDate",
                              Array.isArray(dateString) ? dateString[0] : dateString
                            )
                          }
                        />
                        <span className="cal-icon">
                          <i className="ti ti-calendar" />
                        </span>
                      </div>
                      {errors.collectionDate && (
                        <small className="text-danger">{errors.collectionDate}</small>
                      )}
                    </div>
                  </div>

                  {/* Payment Type */}
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Payment Type</label>
                      <CommonSelect
                        className="select"
                        options={paymentType}
                        value={formData.paymentType}
                        onChange={(option) =>
                          handleFeesSelectChange("paymentType", option ? option.value : "")
                        }
                      />
                      {errors.paymentType && (
                        <small className="text-danger">{errors.paymentType}</small>
                      )}
                    </div>
                  </div>

                  {/* Payment Reference */}
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Payment Reference No</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Payment Reference No"
                        name="paymentRef"
                        value={formData.paymentRef}
                        onChange={handleFeesInputChange}
                      />
                      {errors.paymentRef && (
                        <small className="text-danger">{errors.paymentRef}</small>
                      )}
                    </div>
                  </div>

                  {/* Status Toggle */}

                  {/* <div className="col-lg-12">
        <div className="modal-satus-toggle d-flex align-items-center justify-content-between mb-3">
          <div className="status-title">
            <h5>Status</h5>
            <p>Change the Status by toggle </p>
          </div>
          <div className="status-toggle modal-status">
            <input
              type="checkbox"
              id="user1"
              className="check"
              name='status'
              checked={formData.status==='1'}
              onChange={handleFeesInputChange}
            />
            <label htmlFor="user1" className="checktoggle"> </label>
          </div>
        </div>
      </div> */}

                  {/* Notes */}
                  <div className="col-lg-12">
                    <div className="mb-0">
                      <label className="form-label">Notes</label>
                      <textarea
                        rows={4}
                        className="form-control"
                        placeholder="Add Notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleFeesInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-light me-2" onClick={(e) => cancelSubmit(e)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Pay Fees
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>
      {/* Add Fees Collect */}


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
                  You want to delete all the marked items, this cant be undone once
                  you delete.
                </p>
                <div className="d-flex justify-content-center">
                  <Link
                    to="#"
                    className="btn btn-light me-3"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <Link to="#" className="btn btn-danger" data-bs-dismiss="modal">
                    Yes, Delete
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Delete Modal */}

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
                    <ImageWithBasePath src="assets/img/students/student-01.jpg" alt="Img" />
                  </span>
                  <div className="name-info">
                    <h6>
                      Janet <span>III, A</span>
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
                        <td>Parent</td>
                        <td>parent53</td>
                        <td>parent@53</td>
                      </tr>
                      <tr>
                        <td>Student</td>
                        <td>student20</td>
                        <td>stdt@53</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer">
                <Link to="#" className="btn btn-light me-2" data-bs-dismiss="modal">
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* /Login Details */}
      </>
      <>
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
              <form onSubmit={handleLeaveSubmit} >
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Leave Date</label>
                        <div className="date-pic">
                          <DatePicker

                            className="form-control datetimepicker"
                            format="DD MMM YYYY"
                            value={
                              applayLeaveForm.leave_date
                                ? dayjs(applayLeaveForm.leave_date, "DD MMM YYYY")
                                : null
                            }
                            placeholder="Select Date"

                            onChange={(dateString) =>
                              handleDateChange("leave_date", Array.isArray(dateString) ? dateString[0] : dateString)
                            }

                          />
                          <span className="cal-icon">
                            <i className="ti ti-calendar" />
                          </span>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Leave Type</label>
                        {loadingOptions ? <Skeleton.Input style={{ width: '100%' }} active /> :
                          <CommonSelect
                            className="select"
                            options={leaveOptions}
                            value={applayLeaveForm.leave_type_id}
                            onChange={(opt) => handleSelectChange('leave_type_id', opt ? opt.value : "")}
                          />
                        }
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Leave From date</label>
                        <div className="date-pic">
                          <DatePicker

                            className="form-control datetimepicker"
                            format="YYYY-MM-DD"
                            value={
                              applayLeaveForm.from_date
                                ? dayjs(applayLeaveForm.from_date, "DD MMM YYYY")
                                : null
                            }
                            placeholder="Select Date"

                            onChange={(dateString) =>
                              handleDateChange("from_date", Array.isArray(dateString) ? dateString[0] : dateString)
                            }

                          />
                          <span className="cal-icon">
                            <i className="ti ti-calendar" />
                          </span>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Leave to Date</label>
                        <div className="date-pic">
                          <DatePicker

                            className="form-control datetimepicker"
                            format="DD MMM YYYY"
                            value={
                              applayLeaveForm.to_date
                                ? dayjs(applayLeaveForm.to_date, "DD MMM YYYY")
                                : null
                            }
                            placeholder="Select Date"

                            onChange={(dateString) =>
                              handleDateChange("to_date", Array.isArray(dateString) ? dateString[0] : dateString)
                            }

                          />
                          <span className="cal-icon">
                            <i className="ti ti-calendar" />
                          </span>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Leave Days</label>
                        <div className="d-flex align-items-center check-radio-group">

                          {/* Full Day */}
                          <label htmlFor="fullday" className="custom-radio">
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


                          <label htmlFor="firsthalf" className="custom-radio">
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
                      </div>


                      <div className="mb-3">
                        <label className="form-label">No of Days</label>
                        <input type="text" className="form-control" name='no_of_days' value={applayLeaveForm.no_of_days || ''} onChange={handleChange} />
                      </div>
                      <div className="mb-0">
                        <label className="form-label">Reason</label>
                        <input type="text" className="form-control" name='reason' value={applayLeaveForm.reason} onChange={handleChange} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <Link to="#" className="btn btn-light me-2" data-bs-dismiss="modal">
                    Cancel
                  </Link>
                  <button type='submit' data-bs-dismiss="modal" className="btn btn-primary">
                    Apply Leave
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /Apply Leave */}
      </>

    </>

  )
}

export default StudentModals