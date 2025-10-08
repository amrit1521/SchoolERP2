const PdfTemplate1 = ({
  studentItem,
  index,
  exam,
}: {
  studentItem: any;
  index: number;
  exam: any;
}) => {
  return (
    <div
      id={`collapse${studentItem.rollnum}-${index}`}
      className="accordion-collapse collapse"
      data-bs-parent="#accordionExample"
    >
      <div
        className="accordion-body"
        style={{ padding: "20px", backgroundColor: "white" }}
      >
        {/* PDF Header */}
        <div className="d-flex align-items-center justify-content-center mb-4">
          <img
            src="/assets/img/download-img.png"
            alt="School Logo"
            style={{ height: "80px", marginRight: "20px" }}
          />
          <div>
            <h2>Whizlancer International School</h2>
            <p className="text-center">Gorakhpur Uttar Pradesh</p>
          </div>
        </div>

        {/* Student Info */}
        <div className="d-flex align-items-center justify-content-between">
          <div style={{ marginBottom: "20px" }}>
            <div>
              <strong className="fw-bold">Student Name:</strong>{" "}
              {studentItem.firstname} {studentItem.lastname}
            </div>
            <div>
              <strong className="fw-bold">Class & Section:</strong>{" "}
              {studentItem.class} - {studentItem.section}
            </div>
            <div>
              <strong className="fw-bold">Roll Number:</strong>{" "}
              {studentItem.rollnum}
            </div>
          </div>
          <div>
            <div>
              <strong className="fw-bold">Father's Name:</strong>{" "}
              {studentItem.fat_name}
            </div>
            <div>
              <strong className="fw-bold">Father's Mobile:</strong>{" "}
              {studentItem.phone_num}
            </div>
            <div></div>
          </div>
        </div>

        <hr />
        {/* Table */}
        {/* Table */}
        <div className="table-responsive">
          <table className="table">
            <thead className="thead-light">
              <tr>
                <th>Subject</th>
                <th>Max Marks</th>
                <th>Min Marks</th>
                <th>Marks Obtained</th>
                <th>Grade</th>
                <th className="text-end">Result</th>
              </tr>
            </thead>
            <tbody>
              {exam.subjects.map((subject: any, subIndex: number) => (
                <tr key={subIndex}>
                  <td>{subject.subject_name}</td>
                  <td>{subject.max_mark}</td>
                  <td>{subject.min_mark}</td>
                  <td>{subject.mark_obtained}</td>
                  <td className="fw-semibold">{subject.grade}</td>
                  <td className="text-end">
                    <span
                      className={`badge d-inline-flex align-items-center ${
                        subject.result === "Pass"
                          ? "badge-soft-success"
                          : "badge-soft-danger"
                      }`}
                    >
                      <i className="ti ti-circle-filled fs-5 me-1" />
                      {subject.result}
                    </span>
                  </td>
                </tr>
              ))}

              {/* Totals Row */}
              {(() => {
                const totalMax = exam.subjects.reduce(
                  (sum: number, sub: any) => sum + Number(sub.max_mark),
                  0
                );
                const totalObtained = exam.subjects.reduce(
                  (sum: number, sub: any) => sum + Number(sub.mark_obtained),
                  0
                );
                const percentage = ((totalObtained / totalMax) * 100).toFixed(
                  2
                );
                const status = Number(percentage) > 33 ? "Pass" : "Fail";
                return (
                  <tr className="fw-bold border border-5 ">
                    <td>Rank:30</td>
                    <td colSpan={2}>Total:{totalMax}</td>

                    <td>Toatal Obtained:{totalObtained}</td>
                    <td className="text-end">Per: {percentage}%</td>
                    <td
                      className={`${
                        status == "Pass" ? "text-success" : "text-danger"
                      }`}
                    >
                      {status}
                    </td>
                  </tr>
                );
              })()}
            </tbody>
          </table>
        </div>

        <div
          className="mt-3 p-3 border border-warning rounded"
          style={{ backgroundColor: "#fff8e1" }}
        >
          <strong>Disclaimer:</strong> The results displayed above are
          **provisional** and generated based on the available data. The school
          reserves the right to make corrections or adjustments if discrepancies
          are found. This report is for **informational purposes only** and
          should not be considered as the final official document.
        </div>
      </div>
    </div>
  );
};

const PdfTemplate2 = ({
  studentItem,
  index,
  exam,
}: {
  studentItem: any;
  index: number;
  exam: any;
}) => {
  const totalMax = exam.subjects.reduce(
    (sum: number, sub: any) => sum + Number(sub.max_mark),
    0
  );
  const totalObtained = exam.subjects.reduce(
    (sum: number, sub: any) => sum + Number(sub.mark_obtained),
    0
  );
  const percentage = ((totalObtained / totalMax) * 100).toFixed(2);
  const status = Number(percentage) > 33 ? "Pass" : "Fail";

  return (
    <div
      id={`collapse${studentItem.rollnum}-${index}`}
      className="accordion-collapse collapse"
      data-bs-parent="#accordionExample"
    >
      <div
        className="accordion-body p-4"
        style={{ background: "#f9f9f9", fontFamily: "Arial, sans-serif" }}
      >
        <div className="text-center mb-4">
          <img
            src="/assets/img/download-img.png"
            alt="School Logo"
            style={{ height: "80px" }}
          />
          <h2 className="mt-2 mb-0">Whizlancer International School</h2>
          <small className="text-muted">Gorakhpur, Uttar Pradesh</small>
        </div>

        <div className="d-flex justify-content-between bg-white shadow-sm rounded p-3 mb-4">
          <div>
            <p>
              <strong>Name:</strong> {studentItem.firstname}{" "}
              {studentItem.lastname}
            </p>
            <p>
              <strong>Class:</strong> {studentItem.class} -{" "}
              {studentItem.section}
            </p>
            <p>
              <strong>Roll No:</strong> {studentItem.rollnum}
            </p>
          </div>
          <div>
            <p>
              <strong>Father's Name:</strong> {studentItem.fat_name}
            </p>
            <p>
              <strong>Contact:</strong> {studentItem.phone_num}
            </p>
          </div>
        </div>

        <table className="table table-bordered text-center bg-white shadow-sm">
          <thead className="table-primary">
            <tr>
              <th>Subject</th>
              <th>Max</th>
              <th>Min</th>
              <th>Obtained</th>
              <th>Grade</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {exam.subjects.map((subject: any, i: number) => (
              <tr key={i}>
                <td>{subject.subject_name}</td>
                <td>{subject.max_mark}</td>
                <td>{subject.min_mark}</td>
                <td>{subject.mark_obtained}</td>
                <td>{subject.grade}</td>
                <td
                  className={
                    subject.result === "Pass" ? "text-success" : "text-danger"
                  }
                >
                  {subject.result}
                </td>
              </tr>
            ))}
            <tr className="fw-bold table-secondary">
              <td>Rank: 30</td>
              <td colSpan={2}>Total: {totalMax}</td>
              <td>Obtained: {totalObtained}</td>
              <td>Per: {percentage}%</td>
              <td
                className={status === "Pass" ? "text-success" : "text-danger"}
              >
                {status}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="alert alert-warning mt-3">
          <strong>Disclaimer:</strong> Results are provisional and subject to
          change based on further review.
        </div>
      </div>
    </div>
  );
};

const PdfTemplate3 = ({
  studentItem,
  index,
  exam,
}: {
  studentItem: any;
  index: number;
  exam: any;
}) => {
  const totalMax = exam.subjects.reduce(
    (sum: number, sub: any) => sum + Number(sub.max_mark),
    0
  );
  const totalObtained = exam.subjects.reduce(
    (sum: number, sub: any) => sum + Number(sub.mark_obtained),
    0
  );
  const percentage = ((totalObtained / totalMax) * 100).toFixed(2);
  const status = Number(percentage) > 33 ? "Pass" : "Fail";

  return (
    <div
      id={`collapse${studentItem.rollnum}-${index}`}
      className="accordion-collapse collapse"
      data-bs-parent="#accordionExample"
    >
      <div
        className="accordion-body d-flex"
        style={{ fontFamily: "Segoe UI", background: "#fff" }}
      >
        <div
          style={{
            width: "250px",
            background: "#003366",
            color: "#fff",
            padding: "20px",
            borderRadius: "10px 0 0 10px",
          }}
        >
          <img
            src="/assets/img/download-img.png"
            alt="School Logo"
            style={{ width: "100%" }}
          />
          <h5 className="mt-3">Student Info</h5>
          <hr style={{ borderColor: "#fff" }} />
          <p>
            <strong>Name:</strong>
            <br /> {studentItem.firstname} {studentItem.lastname}
          </p>
          <p>
            <strong>Class:</strong>
            <br /> {studentItem.class} - {studentItem.section}
          </p>
          <p>
            <strong>Roll No:</strong>
            <br /> {studentItem.rollnum}
          </p>
          <p>
            <strong>Father's Name:</strong>
            <br /> {studentItem.fat_name}
          </p>
          <p>
            <strong>Phone:</strong>
            <br /> {studentItem.phone_num}
          </p>
        </div>

        <div className="flex-grow-1 p-4">
          <div className="text-center mb-4">
            <h2>Whizlancer International School</h2>
            <p className="text-muted">Gorakhpur, Uttar Pradesh</p>
          </div>

          <table className="table table-striped table-bordered">
            <thead className="table-dark text-white">
              <tr>
                <th>Subject</th>
                <th>Max</th>
                <th>Min</th>
                <th>Obtained</th>
                <th>Grade</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {exam.subjects.map((subject: any, i: number) => (
                <tr key={i}>
                  <td>{subject.subject_name}</td>
                  <td>{subject.max_mark}</td>
                  <td>{subject.min_mark}</td>
                  <td>{subject.mark_obtained}</td>
                  <td>{subject.grade}</td>
                  <td
                    className={
                      subject.result === "Pass" ? "text-success" : "text-danger"
                    }
                  >
                    {subject.result}
                  </td>
                </tr>
              ))}
              <tr className="fw-bold bg-light">
                <td>Rank: 30</td>
                <td colSpan={2}>Total: {totalMax}</td>
                <td>Obtained: {totalObtained}</td>
                <td>Per: {percentage}%</td>
                <td
                  className={status === "Pass" ? "text-success" : "text-danger"}
                >
                  {status}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-3 p-3 border border-warning bg-light rounded">
            <strong>Disclaimer:</strong> The results shown are provisional and
            for informational use only.
          </div>
        </div>
      </div>
    </div>
  );
};

const PdfTemplate4 = ({ studentItem, index, exam }: any) => {
  const totalMax = exam.subjects.reduce(
    (sum: number, sub: any) => sum + +sub.max_mark,
    0
  );
  const totalObtained = exam.subjects.reduce(
    (sum: number, sub: any) => sum + +sub.mark_obtained,
    0
  );
  const percentage = ((totalObtained / totalMax) * 100).toFixed(2);
  const status = +percentage > 33 ? "Pass" : "Fail";

  return (
    <div
      className="accordion-collapse collapse"
      id={`collapse${studentItem.rollnum}-${index}`}
    >
      <div
        style={{
          padding: "50px",
          fontFamily: "'Georgia', serif",
          background: "#fffdf5",
          border: "10px solid #d4af37",
          borderRadius: "15px",
          textAlign: "center",
        }}
      >
        <img
          src="/assets/img/download-img.png"
          alt="Logo"
          style={{ height: "70px", marginBottom: "10px" }}
        />
        <h1 style={{ color: "#2c3e50" }}>
          Certificate of Academic Performance
        </h1>
        <p>This is to certify that</p>
        <h2>
          {studentItem.firstname} {studentItem.lastname}
        </h2>
        <p>
          of class{" "}
          <strong>
            {studentItem.class}-{studentItem.section}
          </strong>
          , Roll No: <strong>{studentItem.rollnum}</strong>
        </p>
        <p>has achieved the following results in the current term:</p>

        <table
          style={{
            width: "80%",
            margin: "20px auto",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f0e6d6" }}>
              <th>Subject</th>
              <th>Max</th>
              <th>Min</th>
              <th>Obtained</th>
              <th>Grade</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {exam.subjects.map((subject: any, i: number) => (
              <tr key={i}>
                <td>{subject.subject_name}</td>
                <td>{subject.max_mark}</td>
                <td>{subject.min_mark}</td>
                <td>{subject.mark_obtained}</td>
                <td>{subject.grade}</td>
                <td>{subject.result}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Overall Percentage: {percentage}%</h3>
        <h3 style={{ color: status === "Pass" ? "green" : "red" }}>
          Status: {status}
        </h3>

        <p style={{ marginTop: "30px", fontSize: "12px", color: "#666" }}>
          This is a provisional certificate generated for informational
          purposes.
        </p>
      </div>
    </div>
  );
};

const PdfTemplate5 = ({ studentItem, index, exam }: any) => {
  const totalMax = exam.subjects.reduce(
    (sum: number, sub: any) => sum + +sub.max_mark,
    0
  );
  const totalObtained = exam.subjects.reduce(
    (sum: number, sub: any) => sum + +sub.mark_obtained,
    0
  );
  const percentage = ((totalObtained / totalMax) * 100).toFixed(2);
  const status = +percentage > 33 ? "Pass" : "Fail";

  return (
    <div
      className="accordion-collapse collapse"
      id={`collapse${studentItem.rollnum}-${index}`}
    >
      <div
        style={{
          display: "flex",
          fontFamily: "Roboto, sans-serif",
          background: "#f0f0f0",
          padding: "20px",
        }}
      >
        <div
          style={{
            width: "30%",
            background: "#1e293b",
            color: "#fff",
            padding: "20px",
            borderRadius: "8px",
            marginRight: "20px",
          }}
        >
          <img
            src="/assets/img/download-img.png"
            alt="Logo"
            style={{ width: "100%", marginBottom: "15px" }}
          />
          <h4>
            {studentItem.firstname} {studentItem.lastname}
          </h4>
          <p>
            <strong>Class:</strong> {studentItem.class}-{studentItem.section}
          </p>
          <p>
            <strong>Roll No:</strong> {studentItem.rollnum}
          </p>
          <p>
            <strong>Father:</strong> {studentItem.fat_name}
          </p>
          <p>
            <strong>Phone:</strong> {studentItem.phone_num}
          </p>
        </div>

        <div
          style={{
            width: "70%",
            background: "#fff",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <h3 className="mb-3">Exam Results</h3>
          <table className="table table-sm table-striped">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Max</th>
                <th>Min</th>
                <th>Obtained</th>
                <th>Grade</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {exam.subjects.map((sub: any, i: number) => (
                <tr key={i}>
                  <td>{sub.subject_name}</td>
                  <td>{sub.max_mark}</td>
                  <td>{sub.min_mark}</td>
                  <td>{sub.mark_obtained}</td>
                  <td>{sub.grade}</td>
                  <td
                    className={
                      sub.result === "Pass" ? "text-success" : "text-danger"
                    }
                  >
                    {sub.result}
                  </td>
                </tr>
              ))}
              <tr className="fw-bold">
                <td>Rank: 30</td>
                <td colSpan={2}>Total: {totalMax}</td>
                <td>{totalObtained}</td>
                <td>{percentage}%</td>
                <td
                  className={status === "Pass" ? "text-success" : "text-danger"}
                >
                  {status}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const PdfTemplate6 = ({ studentItem, index, exam }: any) => {
  const totalMax = exam.subjects.reduce(
    (sum: number, sub: any) => sum + +sub.max_mark,
    0
  );
  const totalObtained = exam.subjects.reduce(
    (sum: number, sub: any) => sum + +sub.mark_obtained,
    0
  );
  const percentage = ((totalObtained / totalMax) * 100).toFixed(2);
  const status = +percentage > 33 ? "Pass" : "Fail";

  return (
    <div
      className="accordion-collapse collapse"
      id={`collapse${studentItem.rollnum}-${index}`}
    >
      <div
        style={{
          background: "#f7f9fb",
          padding: "30px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div className="text-center mb-4">
          <img
            src="/assets/img/download-img.png"
            alt="Logo"
            style={{ height: "60px" }}
          />
          <h2>Whizlancer International School</h2>
          <p>
            Academic Timeline for {studentItem.firstname} {studentItem.lastname}
          </p>
        </div>

        <div
          style={{
            borderLeft: "4px solid #007BFF",
            marginLeft: "20px",
            paddingLeft: "20px",
          }}
        >
          {exam.subjects.map((subject: any, i: number) => (
            <div key={i} style={{ marginBottom: "25px", position: "relative" }}>
              <div
                style={{
                  background: "#fff",
                  padding: "15px",
                  borderRadius: "8px",
                  boxShadow: "0 0 10px rgba(0,0,0,0.05)",
                  borderLeft: `5px solid ${
                    subject.result === "Pass" ? "#28a745" : "#dc3545"
                  }`,
                }}
              >
                <h5>{subject.subject_name}</h5>
                <p>
                  Max: {subject.max_mark} | Min: {subject.min_mark} | Obtained:{" "}
                  {subject.mark_obtained}
                </p>
                <p>
                  Grade: <strong>{subject.grade}</strong> —{" "}
                  <span
                    style={{
                      color: subject.result === "Pass" ? "green" : "red",
                    }}
                  >
                    {subject.result}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-4">
          <h4>
            Total: {totalObtained}/{totalMax} ({percentage}%)
          </h4>
          <h4 style={{ color: status === "Pass" ? "green" : "red" }}>
            Final Status: {status}
          </h4>
        </div>

        <p
          className="text-muted mt-4"
          style={{ fontSize: "12px", textAlign: "center" }}
        >
          * Timeline is for visual representation. Results are subject to
          review.
        </p>
      </div>
    </div>
  );
};

export {
  PdfTemplate1,
  PdfTemplate2,
  PdfTemplate3,
  PdfTemplate4,
  PdfTemplate5,
  PdfTemplate6,
};
