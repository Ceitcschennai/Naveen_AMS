import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/PermanentEmp.css";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const API_BASE = "http://localhost:5000";

// Fetch permanent employees
const fetchPermanentEmployees = async () => {
  try {
    const response = await axios.get(`${API_BASE}/api/employees/permanent`);
    return response.data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    return [];
  }
};

// Update employee
const updateEmployee = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_BASE}/api/employees/${id}`, updatedData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating employee:", error);
  }
};

export default function PermanentEmployees() {

  const [employees, setEmployees] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [viewingEmployee, setViewingEmployee] = useState(null);

  const [editForm, setEditForm] = useState({
    id: "",
    empId: "",
    name: "",
    role: "",
    email: "",
    gender: "",
    department: "",
    place: "",
    country: "",
    type: "",
    image: null,
  });

  useEffect(() => {
    const loadEmployees = async () => {
      const data = await fetchPermanentEmployees();
      setEmployees(data);
    };
    loadEmployees();
  }, []);

  // Search filter
  const filteredEmployees = employees.filter((emp) =>
    (emp.emp_id || "").toLowerCase().includes(searchId.toLowerCase())
  );

  const handleEditClick = (employee) => {
    setEditingEmployee(employee);

    setEditForm({
      id: employee.id,
      empId: employee.emp_id || "",
      name: employee.name || "",
      role: employee.role || "",
      email: employee.email || "",
      gender: employee.gender || "",
      department: employee.department || "",
      place: employee.place || "",
      country: employee.country || "",
      type: employee.type || "",
      image: null,
    });
  };

  const handleSave = async () => {

    const formData = new FormData();

    Object.keys(editForm).forEach((key) => {
      if (key === "image") {
        if (editForm.image) {
          formData.append("image", editForm.image);
        }
      } else if (key !== "id") {
        formData.append(key, editForm[key]);
      }
    });

    await updateEmployee(editForm.id, formData);

    const updatedList = await fetchPermanentEmployees();
    setEmployees(updatedList);

    setEditingEmployee(null);
  };

  return (
    <div className="permanent-container">

      <Sidebar />

      <div className="permanent-content">

        <Header />

        <div className="employees-container">

          <h2>Permanent Employees List</h2>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by Employee ID..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
          </div>

          <div className="employees-grid">

            {filteredEmployees.length > 0 ? (

              filteredEmployees.map((employee) => (

                <div key={employee.id} className="employee-card">

                  {employee.image ? (
                    <img
                      src={`${API_BASE}/uploads/${employee.image}`}
                      alt={employee.name}
                      className="employee-image"
                    />
                  ) : (
                    <div className="employee-image" style={{ display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#e0e0e0", color: "#888", fontSize: "14px" }}>
                      No Image
                    </div>
                  )}

                  <div className="employee-details">

                    <h3>{employee.name}</h3>

                    <p>
                      <strong>Emp ID:</strong> {employee.emp_id}
                    </p>

                    <p>
                      <strong>Role:</strong> {employee.role}
                    </p>

                    <p>
                      <strong>Department:</strong> {employee.department || "N/A"}
                    </p>

                  </div>

                  <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>

                    <button
                      onClick={() => setViewingEmployee(employee)}
                      style={{
                        padding: "8px 12px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer"
                      }}
                    >
                      View
                    </button>

                    <button
                      onClick={() => handleEditClick(employee)}
                      style={{
                        padding: "8px 12px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer"
                      }}
                    >
                      Edit
                    </button>

                  </div>

                </div>

              ))

            ) : (
              <p>No employees found.</p>
            )}

          </div>
        </div>
      </div>

      {/* VIEW MODAL */}

      {viewingEmployee && (
        <div className="modal-overlay">
          <div className="modal">

            <h3>Employee Details</h3>

            <p><strong>Name:</strong> {viewingEmployee.name}</p>
            <p><strong>Emp ID:</strong> {viewingEmployee.emp_id}</p>
            <p><strong>Role:</strong> {viewingEmployee.role}</p>
            <p><strong>Email:</strong> {viewingEmployee.email}</p>
            <p><strong>Gender:</strong> {viewingEmployee.gender}</p>
            <p><strong>Department:</strong> {viewingEmployee.department}</p>
            <p><strong>Place:</strong> {viewingEmployee.place}</p>
            <p><strong>Country:</strong> {viewingEmployee.country}</p>
            <p><strong>Type:</strong> {viewingEmployee.type}</p>

            <button
              className="modal-close"
              onClick={() => setViewingEmployee(null)}
            >
              Close
            </button>

          </div>
        </div>
      )}

      {/* EDIT MODAL */}

      {editingEmployee && (
        <div className="modal-overlay">

          <div className="modal">

            <h3>Edit Employee</h3>

            <form className="form-grid">
              <input
                type="text"
                placeholder="Employee ID"
                value={editForm.empId}
                onChange={(e) =>
                  setEditForm({ ...editForm, empId: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Role"
                value={editForm.role}
                onChange={(e) =>
                  setEditForm({ ...editForm, role: e.target.value })
                }
              />

              <input
                type="email"
                placeholder="Email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Gender"
                value={editForm.gender}
                onChange={(e) =>
                  setEditForm({ ...editForm, gender: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Department"
                value={editForm.department}
                onChange={(e) =>
                  setEditForm({ ...editForm, department: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Place"
                value={editForm.place}
                onChange={(e) =>
                  setEditForm({ ...editForm, place: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Country"
                value={editForm.country}
                onChange={(e) =>
                  setEditForm({ ...editForm, country: e.target.value })
                }
              />

              <select
                className="full-width"
                value={editForm.type}
                onChange={(e) =>
                  setEditForm({ ...editForm, type: e.target.value })
                }
              >
                <option value="">Select Employee Type</option>
                <option value="Permanent">Permanent</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>

              <input
                className="full-width"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setEditForm({ ...editForm, image: e.target.files[0] })
                }
              />
            </form>

            <div className="modal-buttons">
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setEditingEmployee(null)}>Cancel</button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}