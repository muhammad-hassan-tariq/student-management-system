import { useEffect, useState } from "react";
import "./App.css";

function App() {
    const [students, setStudents] = useState([]);

    const [formData, setFormData] = useState({
        FullName: "",
        Email: "",
        Program: "",
        Age: ""
    });

    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const fetchStudents = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/students"
            );

            const data = await response.json();
            setStudents(data);
        } catch (error) {
            setError("Unable to connect to the server.");
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (Number(formData.Age) <= 0) {
            setError("Age must be greater than 0.");
            return;
        }

        try {
            if (editingId) {
                const response = await fetch(
                    `http://localhost:5000/api/students/${editingId}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            ...formData,
                            Age: Number(formData.Age)
                        })
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to update student.");
                }

                setMessage("Student updated successfully.");
            } else {
                const response = await fetch(
                    "http://localhost:5000/api/students",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            ...formData,
                            Age: Number(formData.Age)
                        })
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to add student.");
                }

                setMessage("Student added successfully.");
            }

            resetForm();
            fetchStudents();
        } catch (error) {
            setError(error.message);
        }
    };

    const editStudent = (student) => {
        setEditingId(student.StudentID);

        setFormData({
            FullName: student.FullName,
            Email: student.Email,
            Program: student.Program,
            Age: student.Age
        });

        setMessage("");
        setError("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const deleteStudent = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this student?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5000/api/students/${id}`,
                {
                    method: "DELETE"
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete student.");
            }

            setMessage("Student deleted successfully.");
            fetchStudents();
        } catch (error) {
            setError(error.message);
        }
    };

    const resetForm = () => {
        setFormData({
            FullName: "",
            Email: "",
            Program: "",
            Age: ""
        });

        setEditingId(null);
    };

    const filteredStudents = students.filter((student) => {
        const search = searchTerm.toLowerCase();

        return (
            student.FullName.toLowerCase().includes(search) ||
            student.Email.toLowerCase().includes(search) ||
            student.Program.toLowerCase().includes(search)
        );
    });

    return (
        <div className="app">
            <header className="header">
                <div>
                    <h1>Student Management System</h1>
                    <p>Manage student records easily</p>
                </div>
            </header>

            <main className="container">

                <section className="stats-card">
                    <div>
                        <span className="stats-label">Total Students</span>
                        <span className="stats-number">{students.length}</span>
                    </div>
                </section>

                <section className="form-card">
                    <h2>
                        {editingId ? "Update Student" : "Add Student"}
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">

                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="FullName"
                                    placeholder="Enter full name"
                                    value={formData.FullName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="Email"
                                    placeholder="Enter email"
                                    value={formData.Email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Program</label>
                                <input
                                    type="text"
                                    name="Program"
                                    placeholder="e.g. BSIT"
                                    value={formData.Program}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Age</label>
                                <input
                                    type="number"
                                    name="Age"
                                    placeholder="Enter age"
                                    value={formData.Age}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                        </div>

                        <div className="form-buttons">
                            <button className="primary-btn" type="submit">
                                {editingId
                                    ? "Update Student"
                                    : "Add Student"}
                            </button>

                            {editingId && (
                                <button
                                    className="secondary-btn"
                                    type="button"
                                    onClick={resetForm}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>

                    {message && (
                        <div className="success-message">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}
                </section>

                <section className="students-card">
                    <div className="students-header">
                        <div>
                            <h2>Students</h2>
                            <p>
                                {filteredStudents.length} student
                                {filteredStudents.length !== 1
                                    ? "s"
                                    : ""}{" "}
                                displayed
                            </p>
                        </div>

                        <input
                            className="search-input"
                            type="text"
                            placeholder="Search students..."
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(e.target.value)
                            }
                        />
                    </div>

                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Program</th>
                                    <th>Age</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredStudents.length > 0 ? (
                                    filteredStudents.map((student) => (
                                        <tr key={student.StudentID}>
                                            <td>{student.StudentID}</td>
                                            <td>{student.FullName}</td>
                                            <td>{student.Email}</td>
                                            <td>{student.Program}</td>
                                            <td>{student.Age}</td>
                                            <td className="actions">
                                                <button
                                                    className="edit-btn"
                                                    onClick={() =>
                                                        editStudent(student)
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="delete-btn"
                                                    onClick={() =>
                                                        deleteStudent(
                                                            student.StudentID
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="no-results"
                                        >
                                            No students found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

            </main>

            <footer>
                <p>Student Management System | React + Node.js + SQL Server</p>
            </footer>
        </div>
    );
}

export default App;