const express = require("express");
const cors = require("cors");

const { sql, poolPromise } = require("./db");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Student Management System API is running");
});

app.get("/api/students", async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool
            .request()
            .query("SELECT * FROM Students");

        res.json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to retrieve students"
        });
    }
});

app.post("/api/students", async (req, res) => {
    try {
        const { FullName, Email, Program, Age } = req.body;

        const pool = await poolPromise;

        await pool
            .request()
            .input("FullName", sql.VarChar(100), FullName)
            .input("Email", sql.VarChar(100), Email)
            .input("Program", sql.VarChar(100), Program)
            .input("Age", sql.Int, Age)
            .query(`
                INSERT INTO Students (FullName, Email, Program, Age)
                VALUES (@FullName, @Email, @Program, @Age)
            `);

        res.status(201).json({
            message: "Student added successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to add student"
        });
    }
});

app.put("/api/students/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { FullName, Email, Program, Age } = req.body;

        const pool = await poolPromise;

        await pool
            .request()
            .input("StudentID", sql.Int, id)
            .input("FullName", sql.VarChar(100), FullName)
            .input("Email", sql.VarChar(100), Email)
            .input("Program", sql.VarChar(100), Program)
            .input("Age", sql.Int, Age)
            .query(`
                UPDATE Students
                SET FullName = @FullName,
                    Email = @Email,
                    Program = @Program,
                    Age = @Age
                WHERE StudentID = @StudentID
            `);

        res.json({
            message: "Student updated successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to update student"
        });
    }
});

app.delete("/api/students/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const pool = await poolPromise;

        await pool
            .request()
            .input("StudentID", sql.Int, id)
            .query(`
                DELETE FROM Students
                WHERE StudentID = @StudentID
            `);

        res.json({
            message: "Student deleted successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to delete student"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});