import React, { type JSX } from "react";
import dayjs from "dayjs";

interface Product {
  name: string;
  quantity: number;
  unitPrice: number;
  discount: number;
}

interface Invoice {
  invoiceNo: string;
  invoiceDate: string;
  dueDate: string;
  firstname: string;
  lastname: string;
  class: string;
  section: string;
  email: string;
  address: string;
  subtotal: number;
  totalDiscount: number;
  tax: number;
  total: number;
  status: string;
  method: string;
  description: string;
  terms: string;
  notes: string;
  logo: string;
  signatureName: string;
  customer: string;
}

const InvoicePreviewModal: React.FC = () => {
  const invoice: Invoice = {
    invoiceNo: "INV001",
    invoiceDate: "2025-10-10",
    dueDate: "2025-10-20",
    firstname: "Aarav",
    lastname: "Sharma",
    class: "10",
    section: "A",
    email: "aarav.sharma@example.com",
    address: "123 Green Park Road, Lucknow, India",
    subtotal: 5000,
    totalDiscount: 200,
    tax: 150,
    total: 4950,
    status: "paid",
    method: "UPI",
    description: "Tuition Fees\nLibrary Charges",
    terms:
      "Payment must be made before due date\nLate fees applicable after due date",
    notes: "Thank you for your payment.",
    logo: "school-logo.png",
    signatureName: "Principal",
    customer: "Aarav Sharma",
  };

  const products: Product[] = [
    { name: "Tuition Fee", quantity: 1, unitPrice: 3000, discount: 5 },
    { name: "Library Fee", quantity: 1, unitPrice: 1000, discount: 0 },
    { name: "Lab Fee", quantity: 1, unitPrice: 1000, discount: 0 },
  ];

  const formattedDate = dayjs(invoice.invoiceDate).format("DD MMM YYYY");
  const dueDate = dayjs(invoice.dueDate).format("DD MMM YYYY");
  const generatedOn = dayjs().format("DD MMM YYYY HH:mm");

  const subtotal = Number(invoice.subtotal);
  const discount = Number(invoice.totalDiscount);
  const tax = Number(invoice.tax);
  const total = Number(invoice.total);

  const formatList = (text: string): JSX.Element[] => {
    if (!text) return [<li key="none">None</li>];
    return text
      .split(/\r?\n/)
      .filter((line) => line.trim() !== "")
      .map((line, i) => <li key={i}>{line.trim()}</li>);
  };

  return (
    <div
      className="modal fade"
      id="view_invoice"
      tabIndex={-1}
      aria-labelledby="viewInvoiceLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content" style={{ borderRadius: "10px" }}>
          <div
            style={{
              position: "relative",
              padding: "40px 50px",
              background: "#fff",
              borderRadius: "10px",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            {/* Background watermark logo */}
            <div
              style={{
                backgroundImage: `url('http://localhost:3004/api/stu/uploads/image/${invoice.logo}')`,
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                opacity: 0.08,
                width: "420px",
                height: "420px",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                zIndex: 0,
                pointerEvents: "none",
              }}
            ></div>

            {/* ================= HEADER FIXED ================= */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: "20px",
                marginBottom: "30px",
                position: "relative",
                zIndex: 1,
              }}
            >
              {/* Left Section */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "15px",
                  flex: 1,
                  minWidth: "250px",
                }}
              >
                <img
                  src={`http://localhost:3004/api/stu/uploads/image/${invoice.logo}`}
                  alt="Logo"
                  style={{
                    height: "70px",
                    width: "70px",
                    borderRadius: "8px",
                    border: "2px solid #007bff",
                    objectFit: "contain",
                  }}
                />
                <div style={{ lineHeight: "1.6", fontSize: "13px", color: "#444" }}>
                  <strong
                    style={{
                      display: "block",
                      fontSize: "15px",
                      color: "#007bff",
                      marginBottom: "4px",
                    }}
                  >
                    Little Flower School, GKP
                  </strong>
                  123 Education Street, Springfield
                  <br />
                  Phone: +91 9876543210
                  <br />
                  Email: contact@springfield.edu
                </div>
              </div>

              {/* Right Section */}
              <div
                style={{
                  textAlign: "right",
                  fontSize: "13px",
                  lineHeight: "1.5",
                  flex: 1,
                  minWidth: "220px",
                }}
              >
                <h2
                  style={{
                    color: "#007bff",
                    fontSize: "28px",
                    marginBottom: "6px",
                    fontWeight: 700,
                  }}
                >
                  INVOICE
                </h2>
                Invoice No: <strong>{invoice.invoiceNo}</strong>
                <br />
                Date: {formattedDate}
                <br />
                Due: {dueDate}
                <br />
                Status:{" "}
                <span
                  style={{
                    background:
                      invoice.status === "paid" ? "#d4edda" : "#fdecea",
                    color: invoice.status === "paid" ? "#155724" : "#7f1d1d",
                    padding: "2px 8px",
                    borderRadius: "5px",
                    fontWeight: 600,
                  }}
                >
                  {invoice.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* BILL TO */}
            <div
              style={{
                background: "#f0f6ff",
                borderLeft: "4px solid #007bff",
                padding: "15px",
                borderRadius: "6px",
                margin: "20px 0",
              }}
            >
              <strong>Bill To:</strong>
              <br />
              <strong>Name:</strong> {invoice.firstname} {invoice.lastname}
              <br />
              <strong>Class:</strong> {invoice.class}-{invoice.section}
              <br />
              <strong>Email:</strong> {invoice.email}
              <br />
              <strong>Address:</strong> {invoice.address}
            </div>

            {/* PRODUCTS TABLE */}
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "15px",
                fontSize: "13px",
                zIndex: 1,
                position: "relative",
              }}
            >
              <thead>
                <tr style={{}}>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>#</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Product</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Qty</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Unit Price</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Discount</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={i}>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>{i + 1}</td>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>{p.name}</td>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>{p.quantity}</td>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>₹{p.unitPrice.toFixed(2)}</td>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>{p.discount}%</td>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                      ₹
                      {(
                        p.quantity * p.unitPrice -
                        (p.discount / 100) * (p.quantity * p.unitPrice)
                      ).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* TOTALS */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "25px",
              }}
            >
              <table style={{ width: "40%", border: "none", fontSize: "13px" }}>
                <tbody>
                  <tr>
                    <td>Subtotal:</td>
                    <td>₹{subtotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Discount:</td>
                    <td>₹{discount.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Tax:</td>
                    <td>₹{tax.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold", borderTop: "2px solid #000" }}>
                      Total:
                    </td>
                    <td style={{ fontWeight: "bold", borderTop: "2px solid #000" }}>
                      ₹{total.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td>Payment Method:</td>
                    <td>{invoice.method}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* DETAILS */}
            <div style={{ marginTop: "20px" }}>
              <h5 style={{ color: "#007bff", textDecoration: "underline" }}>Description:</h5>
              <ul>{formatList(invoice.description)}</ul>

              <h5 style={{ color: "#007bff", textDecoration: "underline" }}>Terms:</h5>
              <ul>{formatList(invoice.terms)}</ul>

              <h5 style={{ color: "#007bff", textDecoration: "underline" }}>Notes:</h5>
              <ul>{formatList(invoice.notes)}</ul>
            </div>

            {/* SIGNATURES */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "50px",
                flexWrap: "wrap",
                gap: "20px",
              }}
            >
              <div style={{ width: "45%", textAlign: "center" }}>
                <div
                  style={{
                    marginTop: "40px",
                    borderTop: "1px solid #444",
                    marginBottom: "5px",
                  }}
                ></div>
                <strong>{invoice.signatureName}</strong>
                <br />
                Authorized Signature
              </div>
              <div style={{ width: "45%", textAlign: "center" }}>
                <div
                  style={{
                    marginTop: "40px",
                    borderTop: "1px solid #444",
                    marginBottom: "5px",
                  }}
                ></div>
                <strong>{invoice.customer}</strong>
                <br />
                Customer Signature
              </div>
            </div>

            {/* FOOTER */}
            <div
              style={{
                textAlign: "center",
                fontSize: "11px",
                color: "#777",
                marginTop: "40px",
                borderTop: "1px solid #ddd",
                paddingTop: "10px",
              }}
            >
              Generated on {generatedOn}
              <br />
              &copy; {new Date().getFullYear()} Little Flower School | All Rights Reserved
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreviewModal;
