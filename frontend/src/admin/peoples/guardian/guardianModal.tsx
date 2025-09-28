
import { Link } from "react-router-dom";
import { deleteFile, guardianForEdit, Imageurl, uploadStudentFile } from "../../../service/api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export interface GuardianData {
  id: number;
  name: string;
  email: string;
  phone_num: string;
  img_src: string;
}




const GuardianModal = () => {

  const [formData, setFormData] = useState<GuardianData>({
    id: 51,
    name: "",
    phone_num: "",
    email: "",
    img_src: "",
  });

  const [guaImg, setGuaImg] = useState<File | null>(null)
  const [guaImgPath, setGuaImgPath] = useState<string>("")
  const [guaImgId, setGuaImgId] = useState<number|null>(null)
  const [orginalImgPath, setOriginalImgPath] = useState<string>("")


  const fetchGuardianDataForEdit = async () => {
    try {
      const { data } = await guardianForEdit(51)
      console.log(data)
      if (data.success) {
        setFormData({
          id: 49,
          name: data.data.name,
          phone_num: data.data.phone_num,
          email: data.data.email,
          img_src: data.data.img_src,
        })
        setOriginalImgPath(data.data.img_src)
      }

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchGuardianDataForEdit()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];


      if (!["image/jpeg", "image/png", "application/pdf"].includes(file.type)) {
        toast.error("Only JPG, PNG, or PDF files are allowed.");
        return;
      }

      setGuaImg(file);
      const imgformData = new FormData();
      imgformData.append("stufile", file);

      try {

        const res = await uploadStudentFile(imgformData)
        const uploadedPath = res.data.file; // filename from backend
        const id = res.data.insertId;
        setGuaImgPath(uploadedPath);
        setGuaImgId(id)


      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
  };

     const deleteImage = async (id: Number) => {
          if (!id) return;
  
          try {
              const deletefile = await deleteFile(id)
  
              if (deletefile.data.success) {             
                      setGuaImgId(null);
                      setGuaImg(null);
                      setGuaImgPath(orginalImgPath);             
                }         
          } catch (error) {
              console.error("Error deleting file:", error);
          }
      };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(guaImgPath)

  };





  return (
    <>
      {/* Add Parent */}
      <div className="modal fade" id="add_guardian">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add Guardian</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <form >
              <div id="modal-tag2" className="modal-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="d-flex align-items-center upload-pic flex-wrap row-gap-3 mb-3">
                      <div className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0 text-dark frames">
                        <i className="ti ti-photo-plus fs-16" />
                      </div>
                      <div className="profile-upload">
                        <div className="profile-uploader d-flex align-items-center">
                          <div className="drag-upload-btn mb-3">
                            Upload
                            <input
                              type="file"
                              className="form-control image-sign"
                              multiple
                            />
                          </div>
                          <Link
                            to="#"
                            className="btn btn-primary mb-3"
                          >
                            Remove
                          </Link>
                        </div>
                        <p>Upload image size 4MB, Format JPG, PNG, SVG</p>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input type="text" className="form-control" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Phone Number</label>
                      <input type="text" className="form-control" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email Address</label>
                      <input type="text" className="form-control" />
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
                <Link to="#" data-bs-dismiss="modal" className="btn btn-primary">
                  Add Guardian
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Add Parent */}
      {/* Edit Parent */}
      <div className="modal fade" id="edit_guardian">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            {/* Header */}
            <div className="modal-header">
              <h4 className="modal-title">Edit Guardian</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div id="modal-tag" className="modal-body">
                <div className="row">
                  <div className="col-md-12">
                    {/* Upload Section */}
                    <div className="d-flex align-items-center upload-pic flex-wrap row-gap-3 mb-3">
                      <div className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0 text-dark frames">

                        {
                          guaImgId && guaImg ? (<img
                            src={URL.createObjectURL(guaImg)}
                            alt="guardian"
                            className=""
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />) : (<img
                            src={`${Imageurl}/${orginalImgPath}`}
                            alt="guardian"
                            className=""
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />)
                        }
                      </div>

                      <div className="profile-upload">
                        <div className="profile-uploader d-flex align-items-center">
                          <div className="drag-upload-btn mb-3">
                            Upload
                            <input
                              type="file"
                              className="form-control image-sign"
                              onChange={handleFileChange}
                            />
                          </div>
                          {guaImgId && (
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm mb-3"
                              onClick={()=>deleteImage(guaImgId)}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <p>Upload image size 4MB, Format JPG, PNG, SVG</p>
                      </div>
                    </div>

                    {/* Name */}
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Phone */}
                    <div className="mb-3">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Phone Number"
                        name="phone_num"
                        value={formData.phone_num}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Email */}
                    <div className="mb-3">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Enter Email Address"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="modal-footer">
                <Link
                  to="#"
                  className="btn btn-light me-2"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </Link>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Edit Parent */}

    </>
  );
};

export default GuardianModal;
