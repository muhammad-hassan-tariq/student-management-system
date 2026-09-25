import { useEffect, useState } from "react";

function App() {
    const [message, setMessage] = useState("");
const [error, setError] = useState("");
    const [students, setStudents] = useState([]);
const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        FullName: "",
        Email: "",
        Program: "",
        Age: ""
    });

    const fetchStudents = async () => {
        const response = await fetch("http://localhost:5000/api/students");
        const data = await response.json();
        setStudents(data);
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
            setEditingId(null);
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

        setFormData({
            FullName: "",
            Email: "",
            Program: "",
            Age: ""
        });

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
};
    const deleteStudent = async (id) => {
    const confirmDelete = window.confirm(
        "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) {
        return;
    }

    await fetch(`http://localhost:5000/api/students/${id}`, {
        method: "DELETE"
    });

    fetchStudents();
};

    return (
        <div>
            <h1>Student Management System</h1>

            <h2>Add Student</h2>
{message && <p className="success">{message}</p>}
{error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="FullName"
                    placeholder="Full Name"
                    value={formData.FullName}
                    onChange={handleChange}
                    required
                />

                <input
                    type="email"
                    name="Email"
                    placeholder="Email"
                    value={formData.Email}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="Program"
                    placeholder="Program"
                    value={formData.Program}
                    onChange={handleChange}
                    required
                />

                <input
                    type="number"
                    name="Age"
                    placeholder="Age"
                    value={formData.Age}
                    onChange={handleChange}
                    required
                />

                <button type="submit">
                  {editingId ? "Update Student" : "Add Student"}</button>
            </form>

            <h2>Students</h2>

            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Program</th>
                        <th>Age</th>
                    </tr>
                </thead>

                <tbody>
                    {students.map((student) => (
                        <tr key={student.StudentID}>
                            <td>{student.StudentID}</td>
                            <td>{student.FullName}</td>
                            <td>{student.Email}</td>
                            <td>{student.Program}</td>
                            <td>{student.Age}</td>
         
                            <td>
                               <button onClick={() => editStudent(student)}>
        Edit
    </button>
        <button onClick={() => deleteStudent(student.StudentID)}>
            Delete
        </button>
    </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;