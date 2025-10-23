import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CommonSelect from "../../../core/common/commonSelect";
// import { feeGroup, feesTypes } from "../../../core/common/selectoption/selectoption";
import { DatePicker } from 'antd'
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { addFeesGroup, addFeesMaster, addFeesType, allFeesGroup, allFeesType, deleteFeesGroup, deleteFeesMaster, deleteFeesType, editFeesGroup, editFeesMaster, editFeesType, speFeesGroup, speFeesMaster, speFeesType } from "../../../service/api";
import { handleModalPopUp } from "../../../handlePopUpmodal";
import { Spinner } from "../../../spinner";
// import { feesReportData } from "../../../service/reports";

type Props = {
  onAction: () => void;
  editId?: number | null;
  deleteId?: number | null;
  type?: string;
}
interface FeesGroup {
  id: number;
  feesGroup: string;
}

interface FeesType {
  id: number;
  name: string;
}



const FeesModal: React.FC<Props> = ({ onAction, editId, deleteId, type }) => {
  // const [activeContent, setActiveContent] = useState('');
  // const handleContentChange = (event: any) => {
  //   setActiveContent(event.target.value);
  // };
  // const today = new Date()
  // const year = today.getFullYear()
  // const month = String(today.getMonth() + 1).padStart(2, '0') // Month is zero-based, so we add 1
  // const day = String(today.getDate()).padStart(2, '0')
  // const formattedDate = `${month}-${day}-${year}`
  // const defaultValue = dayjs(formattedDate);
  // const getModalContainer = () => {
  //   const modalElement = document.getElementById('modal-datepicker');
  //   return modalElement ? modalElement : document.body; // Fallback to document.body if modalElement is null
  // };
  // const getModalContainer2 = () => {
  //   const modalElement = document.getElementById('modal-datepicker2');
  //   return modalElement ? modalElement : document.body; // Fallback to document.body if modalElement is null
  // };


  //  add fees group -----------------------------------------------------------------------------------------------------
  interface FeesGroupForm {
    feesGroup: string;
    description: string;
    status: string; // "0" or "1"
  }

  const [feesFormData, setFeesFormData] = useState<FeesGroupForm>({
    feesGroup: "",
    description: "",
    status: "0", // default unchecked
  });


  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    setFeesFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked ? "1" : "0" : value,
    }));
  };

  const handelCancelFees = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setFeesFormData({
      feesGroup: "",
      description: "",
      status: "0",
    })
    editId = null
  }


  const handleFeesGroupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { feesGroup, description } = feesFormData;

    if (!feesGroup.trim() || !description.trim()) {
      toast.error('Required fields are mandatory!');
      return;
    }

    try {
    
      const { data } = editId
        ? await editFeesGroup(feesFormData, editId)
        : await addFeesGroup(feesFormData);

      if (data.success) {
        toast.success(data.message || 'Action successful!');
        handleModalPopUp(editId ? 'edit_fees_group' : 'add_fees_group');

      
        setFeesFormData({
          feesGroup: '',
          description: '',
          status: '0',
        });
        editId = null;
        onAction();
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Something went wrong!');
    }
  };




  // add fees type------------------------------------------------------------------

  const [feesGroupOption, setFeesGroupOption] = useState<FeesGroup[]>([]);
  const [feesTypeOption, setFeesTypeOption] = useState<FeesType[]>([]);
  // const [loading, setLoading] = useState(false);

  const fetchBothOptions = useCallback(async () => {
    // setLoading(true);
    try {
      const [feesGroupRes, feesTypeRes] = await Promise.all([
        allFeesGroup(),
        allFeesType(),
      ]);

      if (feesGroupRes?.data?.success) {
        setFeesGroupOption(feesGroupRes.data.feesGroups);
      } else {
        toast.error("Failed to load Fees Group options!");
      }

      if (feesTypeRes?.data?.success) {
        setFeesTypeOption(feesTypeRes.data.feesTypes);
      } else {
        toast.error("Failed to load Fees Type options!");
      }
    } catch (error: any) {
      console.error("Error fetching options:", error);
      const message =
        error?.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(message);
    }
  }, []);

  useEffect(() => {
    fetchBothOptions();
  }, [fetchBothOptions]);

 
  const option1 = useMemo(
    () =>
      feesGroupOption.map((item) => ({
        value: item.id,
        label: item.feesGroup,
      })),
    [feesGroupOption]
  );

  const option2 = useMemo(
    () =>
      feesTypeOption.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    [feesTypeOption]
  );

  // add fees type form----------------------------------------------------------------

  interface FeesTypeForm {
    name: string;
    feesGroup: number;
    description: string;
    status: string;
  }

  const [feesTypeFormData, setFeesTypeFormData] = useState<FeesTypeForm>({
    name: '',
    feesGroup: 0,
    description: '',
    status: '0',
  })

  const handleFeesTypeInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFeesTypeFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked ? "1" : "0" : value }))
  }

  const handleFeesSelectChange = (name: keyof FeesTypeForm, value: string | number) => {
    setFeesTypeFormData((prev) => ({ ...prev, [name]: value }))

  }


  const handleFeesTypeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { name, feesGroup, description } = feesTypeFormData;

    if (!name || !feesGroup || !description) {
      toast.warning('Required fields are mandatory!');
      return;
    }

    try {

      const { data } = editId
        ? await editFeesType(feesTypeFormData, editId)
        : await addFeesType(feesTypeFormData);

      if (data.success) {
        toast.success(data.message);
        handleModalPopUp(editId ? 'edit_fees_Type' : 'add_fees_Type');

        // Reset form and state
        setFeesTypeFormData({
          name: '',
          feesGroup: 0,
          description: '',
          status: '',
        });
        onAction();
        editId = null;
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Something went wrong!');
    }
  };


  const handleFeesTypeCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setFeesTypeFormData({
      name: '',
      feesGroup: 0,
      description: '',
      status: '',
    })
    editId = null
  }



  // fees master--------------------------------------------------------------

  interface FeesMasterForm {
    feesGroup: number | null;
    feesType: number | null;
    dueDate: string;
    amount: string;
    fineType: "" | "percentage" | "fixed";
    percentage: string;
    percentageAmount: string;
    fixedAmount: string;
    status: string;
    totalAmount: string;
    fineAmount: string;
  }

  const [feesMasterForm, setFeesMasterForm] = useState<FeesMasterForm>({
    feesGroup: null,
    feesType: null,
    dueDate: "",
    amount: "",
    fineType: "",
    percentage: "",
    percentageAmount: "",
    fixedAmount: "",
    status: "0",
    totalAmount: "",
    fineAmount: ""
  });


  const handleFeesMasterSelectChange = (
    name: keyof FeesMasterForm,
    value: string | number
  ) => {
    setFeesMasterForm((prev) => ({ ...prev, [name]: value }));
  };


  const handleFeesMasterInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;

    setFeesMasterForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    }));
  };

  const handleFeesMasterDateChange = (date: string) => {
    setFeesMasterForm((prev) => ({ ...prev, dueDate: date }));
  };

  const handleFeesMasterFineTypeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFeesMasterForm((prev) => ({
      ...prev,
      fineType: e.target.value as FeesMasterForm["fineType"],
    }));
  };

  const [errors, setErrors] = useState<Partial<Record<keyof FeesMasterForm, string>>>({});
  const [loading ,setLoading] = useState<boolean>(false)
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FeesMasterForm, string>> = {};

    if (!feesMasterForm.feesGroup) newErrors.feesGroup = "Fees Group is required";
    if (!feesMasterForm.feesType) newErrors.feesType = "Fees Type is required";
    if (!feesMasterForm.dueDate) newErrors.dueDate = "Due Date is required";

    if (!feesMasterForm.amount || Number(feesMasterForm.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    if (feesMasterForm.fineType === "percentage") {
      if (!feesMasterForm.percentage || Number(feesMasterForm.percentage) <= 0) {
        newErrors.percentage = "Percentage fine must be greater than 0";
      }
    } else if (feesMasterForm.fineType === "fixed") {
      if (!feesMasterForm.fixedAmount || Number(feesMasterForm.fixedAmount) <= 0) {
        newErrors.fixedAmount = "Fixed fine must be greater than 0";
      }
    }

    if (!feesMasterForm.status) newErrors.status = "Status is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // ✅ return true if no errors
  };

  const handleFeesMasterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    let baseAmount = Number(feesMasterForm.amount) || 0;
    let percentageAmount = "";
    let fixedAmount = "";
    let total = baseAmount;

    if (feesMasterForm.fineType === "percentage") {
      const fine = (baseAmount * Number(feesMasterForm.percentage || 0)) / 100;
      percentageAmount = fine.toString();
      total += fine;
      fixedAmount = "";
    } else if (feesMasterForm.fineType === "fixed") {
      const fine = Number(feesMasterForm.fixedAmount || 0);
      fixedAmount = fine.toString();
      total += fine;
      percentageAmount = "";
    } else {
      // No fine
      fixedAmount = "";
      percentageAmount = "";
    }



    const updatedForm: FeesMasterForm = {
      ...feesMasterForm,
      percentageAmount,
      fixedAmount,
      fineAmount: percentageAmount || fixedAmount || '0',
      totalAmount: Math.ceil(total).toString(),
    };

    try {
      if (editId) {
        const { data } = await editFeesMaster(updatedForm, editId)
        if (data.success) {
          handleModalPopUp('edit_fees_master')
        }

      } else {
        const { data } = await addFeesMaster(updatedForm)
        if (data.success) {
          toast.success(data.message)

          handleModalPopUp("add_fees_master")

        }
      }
      onAction()
      setFeesMasterForm({
        feesGroup: null,
        feesType: null,
        dueDate: "",
        amount: "",
        fineType: "",
        percentage: "",
        percentageAmount: "",
        fixedAmount: "",
        status: "0",
        totalAmount: "",
        fineAmount: ""
      })

    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  };

  const handleFeesMasterCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    editId = null
    setFeesMasterForm({
      feesGroup: null,
      feesType: null,
      dueDate: "",
      amount: "",
      fineType: "",
      percentage: "",
      percentageAmount: "",
      fixedAmount: "",
      status: "0",
      totalAmount: "",
      fineAmount: ""
    })

  }





  // edit fees group
  const fetchGroupById = async (id: number) => {

    try {
      const { data } = await speFeesGroup(id)
      if (data.success) {
        setFeesFormData({
          feesGroup: data.data.feesGroup,
          description: data.data.description,
          status: data.data.status,
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const fetchTypeById = async (id: number) => {
    try {

      const { data } = await speFeesType(id)

      if (data.success) {
        setFeesTypeFormData({
          name: data.data.name,
          feesGroup: data.data.feesGroupId,
          description: data.data.description,
          status: data.data.status,
        })
      }

    } catch (error) {
      console.log(error)
    }
  }

  const fetchFeesMasterById = async (id: number) => {
    setLoading(true)
    try {
      const { data } = await speFeesMaster(id)
    
      if (data.success) {
        setFeesMasterForm({
          feesGroup: data.data.feesGroup,
          feesType: data.data.feesType,
          dueDate: dayjs(data.data.dueDate).format('DD MMM YYYY'),
          amount: data.data.amount,
          fineType: data.data.fineType || "",
          fixedAmount: data.data.fixedAmount || "0",
          percentage: data.data.percentage || "0",
          percentageAmount: (data.data.percentageAmount ?? data.data.percentageamount) || "0",
          status: data.data.status || "0",
          totalAmount: (data.data.totalAmount ?? data.data.totalamount) || "0",
          fineAmount: (data.data.fineAmount ?? data.data.fineamount) || "0",
        });


      }

    } catch (error) {
      console.log(error)
    }finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    if (editId) {
      if (type === "feesgroup") {
        fetchGroupById(editId)
      } else if (type === "feestype") {
        fetchTypeById(editId)
      } else if (type === "feesmaster") {
        fetchFeesMasterById(editId)
      } else {
        throw new Error("Invalid type");
      }
    }
  }, [editId])

  // common delete 
  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!deleteId) return;

    try {
      let data: any;

      if (type === "feesgroup") {
        data = await deleteFeesGroup(deleteId);
      } else if (type === "feestype") {
        data = await deleteFeesType(deleteId);
      } else if (type === "feesmaster") {
        data = await deleteFeesMaster(deleteId);
      } else {
        throw new Error("Invalid type");
      }

      if (data?.data?.success) {
        toast.success(data.data.message || "Action completed successfully");
        onAction();
        handleModalPopUp("delete-modal");
      } else {
        toast.error(data?.data?.message || "Something went wrong");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || error.message);
    }
  };



  return (
    <>
      <>
        {/* Add Fees Master */}
        <div className="modal fade" id="add_fees_master">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <div className="d-flex align-items-center">
                  <h4 className="modal-title">Add Fees Master</h4>
                  <span className="badge bg-soft-info ms-2">2024 - 2025</span>
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

              <form onSubmit={handleFeesMasterSubmit}>
                <div className="modal-body" id="modal-datepicker2">
                  <div className="row">
                    <div className="col-md-12">
                      {/* Fees Group */}
                      <div className="mb-3">
                        <label className="form-label">Fees Group</label>
                        <CommonSelect
                          className="select"
                            value={feesMasterForm.feesGroup}
                          options={option1}
                          onChange={(opt) =>
                            handleFeesMasterSelectChange("feesGroup", opt ? opt.value : "")
                          }
                        />
                        {errors.feesGroup && (
                          <span className="text-danger">{errors.feesGroup}</span>
                        )}
                      </div>

                      {/* Fees Type */}
                      <div className="mb-3">
                        <label className="form-label">Fees Type</label>
                        <CommonSelect
                          className="select"
                          options={option2}
                            value={feesMasterForm.feesType}
                          onChange={(opt) =>
                            handleFeesMasterSelectChange("feesType", opt ? opt.value : "")
                          }
                        />
                        {errors.feesType && (
                          <span className="text-danger">{errors.feesType}</span>
                        )}
                      </div>
                    </div>

                    {/* Due Date + Amount */}
                    <div className="col-md-12">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Due Date</label>
                            <div className="date-pic">
                              <DatePicker
                                className="form-control datetimepicker"
                                format="DD MMM YYYY"
                                value={
                                  feesMasterForm.dueDate
                                    ? dayjs(feesMasterForm.dueDate, "DD MMM YYYY")
                                    : null
                                }
                                placeholder="Select Date"
                                onChange={(dateString) =>
                                  handleFeesMasterDateChange(
                                    Array.isArray(dateString) ? dateString[0] : dateString
                                  )
                                }
                              />
                              <span className="cal-icon">
                                <i className="ti ti-calendar" />
                              </span>
                            </div>
                            {errors.dueDate && (
                              <span className="text-danger">{errors.dueDate}</span>
                            )}
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Amount</label>
                            <input
                              type="number"
                              className="form-control"
                              name="amount"
                              value={feesMasterForm.amount}
                              onChange={handleFeesMasterInputChange}
                            />
                            {errors.amount && (
                              <span className="text-danger">{errors.amount}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Fine Type */}
                      <div className="mb-3">
                        <label className="form-label">Fine Type</label>
                        <div className="d-flex align-items-center check-radio-group">
                          <label className="custom-radio">
                            <input
                              type="radio"
                              name="fineType"
                              value=""
                              checked={feesMasterForm.fineType === ""}
                              onChange={handleFeesMasterFineTypeChange}
                            />
                            <span className="checkmark" /> None
                          </label>

                          <label className="custom-radio percentage-radio">
                            <input
                              type="radio"
                              name="fineType"
                              value="percentage"
                              checked={feesMasterForm.fineType === "percentage"}
                              onChange={handleFeesMasterFineTypeChange}
                            />
                            <span className="checkmark" /> Percentage
                          </label>

                          <label className="custom-radio fixed-radio">
                            <input
                              type="radio"
                              name="fineType"
                              value="fixed"
                              checked={feesMasterForm.fineType === "fixed"}
                              onChange={handleFeesMasterFineTypeChange}
                            />
                            <span className="checkmark" /> Fixed
                          </label>
                        </div>
                        {errors.fineType && (
                          <span className="text-danger">{errors.fineType}</span>
                        )}
                      </div>

                      {/* Percentage Fine Fields */}
                      {feesMasterForm.fineType === "percentage" && (
                        <div className="percentage-field percentage-field-show">
                          <div className="row">
                            <div className="col-lg-6">
                              <div className="mb-3">
                                <label className="form-label">Percentage</label>
                                <input
                                  type="number"
                                  className="form-control"
                                  placeholder="%"
                                  name="percentage"
                                  value={feesMasterForm.percentage}
                                  onChange={handleFeesMasterInputChange}
                                />
                                {errors.percentage && (
                                  <span className="text-danger">{errors.percentage}</span>
                                )}
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="mb-3">
                                <label className="form-label">Amount </label>
                                <input
                                  type="number"
                                  className="form-control"
                                  placeholder="$"
                                  name="percentageAmount"
                                  value={
                                    Number(feesMasterForm.amount || 0) +
                                    (Number(feesMasterForm.amount || 0) *
                                      Number(feesMasterForm.percentage || 0)) /
                                    100
                                  }
                                  readOnly
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Fixed Fine Fields */}
                      {feesMasterForm.fineType === "fixed" && (
                        <div className="fixed-field fixed-field-show">
                          <div className="row">
                            <div className="col-lg-12">
                              <div className="mb-3">
                                <label className="form-label">Amount </label>
                                <input
                                  type="number"
                                  className="form-control"
                                  placeholder="$"
                                  name="fixedAmount"
                                  value={feesMasterForm.fixedAmount}
                                  onChange={handleFeesMasterInputChange}
                                />
                                {errors.fixedAmount && (
                                  <span className="text-danger">{errors.fixedAmount}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Status */}
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="status-title">
                        <h5>Status</h5>
                        <p>Change the Status by toggle</p>
                      </div>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="switch-sm"
                          name="status"
                          checked={feesMasterForm.status === "1"}
                          onChange={handleFeesMasterInputChange}
                        />
                      </div>
                    </div>
                    {errors.status && <span className="text-danger">{errors.status}</span>}
                  </div>
                </div>

                {/* Footer */}
                <div className="modal-footer">
                  <button onClick={(e) => handleFeesMasterCancel(e)} type="button" className="btn btn-light me-2" data-bs-dismiss="modal">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add Fees Master
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Add Fees Master*/}

        {/* Edit Fees Master */}
        <div className="modal fade" id="edit_fees_master">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <div className="d-flex align-items-center">
                  <h4 className="modal-title">Edit Fees Master</h4>
                  <span className="badge bg-soft-info ms-2">2024 - 2025</span>
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
               {
                loading&&loading?<Spinner/>:( <form onSubmit={handleFeesMasterSubmit}>
                <div className="modal-body" id="modal-datepicker2">
                  <div className="row">
                    <div className="col-md-12">
                      {/* Fees Group */}
                      <div className="mb-3">
                        <label className="form-label">Fees Group</label>
                        <CommonSelect
                          className="select"
                          value={feesMasterForm.feesGroup}
                          options={option1}
                          onChange={(opt) =>
                            handleFeesMasterSelectChange("feesGroup", opt ? opt.value : "")
                          }
                        />
                        {errors.feesGroup && (
                          <span className="text-danger">{errors.feesGroup}</span>
                        )}
                      </div>

                      {/* Fees Type */}
                      <div className="mb-3">
                        <label className="form-label">Fees Type</label>
                        <CommonSelect
                          className="select"
                          options={option2}
                          value={feesMasterForm.feesType}
                          onChange={(opt) =>
                            handleFeesMasterSelectChange("feesType", opt ? opt.value : "")
                          }
                        />
                        {errors.feesType && (
                          <span className="text-danger">{errors.feesType}</span>
                        )}
                      </div>
                    </div>

                    {/* Due Date + Amount */}
                    <div className="col-md-12">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Due Date</label>
                            <div className="date-pic">
                              <DatePicker
                                className="form-control datetimepicker"
                                format="DD MMM YYYY"
                                value={
                                  feesMasterForm.dueDate
                                    ? dayjs(feesMasterForm.dueDate, "DD MMM YYYY")
                                    : null
                                }
                                placeholder="Select Date"
                                onChange={(dateString) =>
                                  handleFeesMasterDateChange(
                                    Array.isArray(dateString) ? dateString[0] : dateString
                                  )
                                }
                              />
                              <span className="cal-icon">
                                <i className="ti ti-calendar" />
                              </span>
                            </div>
                            {errors.dueDate && (
                              <span className="text-danger">{errors.dueDate}</span>
                            )}
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Amount</label>
                            <input
                              type="number"
                              className="form-control"
                              name="amount"
                              value={feesMasterForm.amount}
                              onChange={handleFeesMasterInputChange}
                            />
                            {errors.amount && (
                              <span className="text-danger">{errors.amount}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Fine Type */}
                      <div className="mb-3">
                        <label className="form-label">Fine Type</label>
                        <div className="d-flex align-items-center check-radio-group">
                          <label className="custom-radio">
                            <input
                              type="radio"
                              name="fineType"
                              value=""
                              checked={feesMasterForm.fineType === ""}
                              onChange={handleFeesMasterFineTypeChange}
                            />
                            <span className="checkmark" /> None
                          </label>

                          <label className="custom-radio percentage-radio">
                            <input
                              type="radio"
                              name="fineType"
                              value="percentage"
                              checked={feesMasterForm.fineType === "percentage"}
                              onChange={handleFeesMasterFineTypeChange}
                            />
                            <span className="checkmark" /> Percentage
                          </label>

                          <label className="custom-radio fixed-radio">
                            <input
                              type="radio"
                              name="fineType"
                              value="fixed"
                              checked={feesMasterForm.fineType === "fixed"}
                              onChange={handleFeesMasterFineTypeChange}
                            />
                            <span className="checkmark" /> Fixed
                          </label>
                        </div>
                        {errors.fineType && (
                          <span className="text-danger">{errors.fineType}</span>
                        )}
                      </div>

                      {/* Percentage Fine Fields */}
                      {feesMasterForm.fineType === "percentage" && (
                        <div className="percentage-field percentage-field-show">
                          <div className="row">
                            <div className="col-lg-6">
                              <div className="mb-3">
                                <label className="form-label">Percentage</label>
                                <input
                                  type="number"
                                  className="form-control"
                                  placeholder="%"
                                  name="percentage"
                                  value={feesMasterForm.percentage}
                                  onChange={handleFeesMasterInputChange}
                                />
                                {errors.percentage && (
                                  <span className="text-danger">{errors.percentage}</span>
                                )}
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="mb-3">
                                <label className="form-label">Amount</label>
                                <input
                                  type="number"
                                  className="form-control"
                                  placeholder="$"
                                  name="percentageAmount"
                                  value={
                                    Number(feesMasterForm.amount || 0) +
                                    (Number(feesMasterForm.amount || 0) *
                                      Number(feesMasterForm.percentage || 0)) /
                                    100
                                  }
                                  readOnly
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Fixed Fine Fields */}
                      {feesMasterForm.fineType === "fixed" && (
                        <div className="fixed-field fixed-field-show">
                          <div className="row">
                            <div className="col-lg-12">
                              <div className="mb-3">
                                <label className="form-label">Amount </label>
                                <input
                                  type="number"
                                  className="form-control"
                                  placeholder="$"
                                  name="fixedAmount"
                                  value={feesMasterForm.fixedAmount}
                                  onChange={handleFeesMasterInputChange}
                                />
                                {errors.fixedAmount && (
                                  <span className="text-danger">{errors.fixedAmount}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Status */}
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="status-title">
                        <h5>Status</h5>
                        <p>Change the Status by toggle</p>
                      </div>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="switch-sm"
                          name="status"
                          checked={feesMasterForm.status === "1"}
                          onChange={handleFeesMasterInputChange}
                        />
                      </div>
                    </div>
                    {errors.status && <span className="text-danger">{errors.status}</span>}
                  </div>
                </div>

                {/* Footer */}
                <div className="modal-footer">
                  <button onClick={(e) => handleFeesMasterCancel(e)} type="button" className="btn btn-light me-2" data-bs-dismiss="modal">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Edit Fees Master
                  </button>
                </div>
              </form>)
               }
            </div>
          </div>
        </div>
        {/* Edit Fees Master*/}
      </>



      {/* add fees type */}
      <>
        <div className="modal fade" id="add_fees_Type">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Fees Type</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>

              <form onSubmit={handleFeesTypeSubmit}>
                <div className="modal-body">
                  <div className="row">
                    {/* Name */}
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input
                          type="text"
                          name="name"
                          value={feesTypeFormData.name}
                          onChange={handleFeesTypeInput}
                          className="form-control"
                          placeholder="Enter Fees Type Name"
                        />
                      </div>


                      <div className="mb-3">
                        <div className="d-flex justify-content-between">
                          <label className="form-label">Fees Group</label>
                        </div>
                        <CommonSelect
                          className="select"
                          options={option1}
                          value={feesTypeFormData.feesGroup}
                          onChange={(opt) => handleFeesSelectChange('feesGroup', opt ? opt.value : '')}
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        name="description"
                        className="form-control"
                        rows={4}
                        value={feesTypeFormData.description}
                        onChange={handleFeesTypeInput}
                        placeholder="Enter description"
                      />
                    </div>

                    {/* Status */}
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="status-title">
                        <h5>Status</h5>
                        <p>Change the Status by toggle </p>
                      </div>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="status"
                          checked={feesTypeFormData.status === '1'}
                          onChange={handleFeesTypeInput}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    onClick={(e) => handleFeesTypeCancel(e)}
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary ">
                    Add Fees Type
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Edit Fees Type */}
        <div className="modal fade" id="edit_fees_Type">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Fees Type</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form onSubmit={handleFeesTypeSubmit}>
                <div className="modal-body">
                  <div className="row">
                    {/* Name */}
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input
                          type="text"
                          name="name"
                          value={feesTypeFormData.name}
                          onChange={handleFeesTypeInput}
                          className="form-control"
                          placeholder="Enter Fees Type Name"
                        />
                      </div>


                      <div className="mb-3">
                        <div className="d-flex justify-content-between">
                          <label className="form-label">Fees Group</label>
                        </div>
                        <CommonSelect
                          className="select"
                          options={option1}
                          value={feesTypeFormData.feesGroup}
                          onChange={(opt) => handleFeesSelectChange('feesGroup', opt ? opt.value : '')}
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        name="description"
                        className="form-control"
                        rows={4}
                        value={feesTypeFormData.description}
                        onChange={handleFeesTypeInput}
                        placeholder="Enter description"
                      />
                    </div>

                    {/* Status */}
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="status-title">
                        <h5>Status</h5>
                        <p>Change the Status by toggle </p>
                      </div>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="status"
                          checked={feesTypeFormData.status === '1'}
                          onChange={handleFeesTypeInput}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    onClick={(e) => handleFeesTypeCancel(e)}
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary ">
                    Edit Fees Type
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Edit Fees Type */}
      </>


      <>
        {/* Add Fees Group */}
        <div className="modal fade" id="add_fees_group">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Fees Group</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>

              {/* modified form */}
              <form onSubmit={handleFeesGroupSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Fees Group</label>
                        <input
                          type="text"
                          className="form-control"
                          name="feesGroup"
                          value={feesFormData.feesGroup}
                          onChange={handleInput}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                          className="form-control"
                          rows={4}
                          name="description"
                          value={feesFormData.description}
                          onChange={handleInput}
                        />
                      </div>

                      <div className="d-flex align-items-center justify-content-between">
                        <div className="status-title">
                          <h5>Status</h5>
                          <p>Change the Status by toggle</p>
                        </div>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="switch-sm"
                            name="status"
                            checked={feesFormData.status === '1'}
                            onChange={handleInput}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    onClick={(e) => handelCancelFees(e)}
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    // data-bs-dismiss="modal"
                    className="btn btn-primary"
                  >
                    Add Fees Group
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Add Fees Group */}

        {/* Edit Fees Group */}
        <div className="modal fade" id="edit_fees_group">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Fees Group</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form onSubmit={handleFeesGroupSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Fees Group</label>
                        <input
                          type="text"
                          className="form-control"
                          name="feesGroup"
                          value={feesFormData.feesGroup}
                          onChange={handleInput}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                          className="form-control"
                          rows={4}
                          name="description"
                          value={feesFormData.description}
                          onChange={handleInput}
                        />
                      </div>

                      <div className="d-flex align-items-center justify-content-between">
                        <div className="status-title">
                          <h5>Status</h5>
                          <p>Change the Status by toggle</p>
                        </div>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="switch-sm"
                            name="status"
                            checked={feesFormData.status === '1'}
                            onChange={handleInput}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    onClick={(e) => handelCancelFees(e)}
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    // data-bs-dismiss="modal"
                    className="btn btn-primary"
                  >
                    Edit Fees Group
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Edit Fees Group */}
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
                  You want to delete this item, this cant be undone
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
                  <button
                    type="button"
                    onClick={(e) => handleDelete(e)}
                    className="btn btn-danger"

                  >
                    Yes, Delete
                  </button>
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

export default FeesModal;
