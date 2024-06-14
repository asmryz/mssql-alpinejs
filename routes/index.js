import express from 'express'
const router = express.Router()
import { connection } from '../db.js'
import sql from 'mssql'

router.get('/', function (req, res) {
    res.render('index', { locals: { title: 'Welcome!' } });
})

router.get('/api/years', (req, res) => {
    try {
        connection.then(async db => {
            const result = await db.query(`SELECT DISTINCT(year) FROM recap ORDER BY Year;`)
            res.status(200).json(result.recordset)
        });
    } catch (err) { res.status(500).send(err.message) }
})

router.get('/api/semesters', (req, res) => {
    try {
        connection.then(async db => {
            const result = await db.query(`SELECT DISTINCT(Semester) FROM recap ORDER BY Semester;`)
            res.status(200).json(result.recordset)
        });
    } catch (err) { res.status(500).send(err.message) }
})

router.get(`/api/batch/:year/:semester`, (req, res) => {
    try {
        connection.then(async db => {
            const result = await db.request()
            .input('year', sql.VarChar, req.params.year)
            .input('semester', sql.VarChar, req.params.semester)
            .query(`SELECT DISTINCT(Class) FROM recap WHERE Year = @year AND Semester = @semester;`)
            res.status(200).json(result.recordset)
        });
    } catch (err) { res.status(500).send(err.message) }
})

router.get(`/api/batch/:year/:semester/:batch`, (req, res) => {
    try {
        connection.then(async db => {
            const result = await db.request()
            .input('year', sql.VarChar, req.params.year)
            .input('semester', sql.VarChar, req.params.semester)
            .input('batch', sql.VarChar, req.params.batch)
            .query(`SELECT r.*, c.title FROM recap r, course c WHERE r.cid = c.cid AND Year = @year AND Semester = @semester AND Class = @batch;`)
            res.status(200).json(result.recordset)
        });
    } catch (err) { res.status(500).send(err.message) }
})

router.get(`/api/recap/:rid`, (req, res) => {
    try {
        connection.then(async db => {
            const result = await db.request()
            .input('rid', sql.Int, req.params.rid)
            .query(`SELECT DISTINCT(s.regno), t.name, (
                        SELECT FORMAT(SUM(gpa * cr) / SUM(cr), '0.00') AS CGPA
                        FROM (
                            SELECT m.regno, m.marks, m.rid,ROUND(marks, 0) as rmarks, r.Semester, r.Year, r.Class,r.fid, c.cid, c.code, c.title, c.theory, c.lab, g.grade, g.gpa, c.theory + c.lab as cr
                            FROM cmarks m, grade g, recap r, course c
                            WHERE 1=1
                            AND m.rid = r.rid
                            AND r.cid = c.cid
                            AND regno = s.regno
                            AND hid = 246
                            AND g.gpa <> 0
                            AND ROUND(marks, 0) BETWEEN g.start AND g.[end]) A
                        ) CGPA
                    FROM cmarks s, student t
                    WHERE rid = @rid
                    AND s.regno = t.regno`)
                    //console.log(result.recordset)
            res.status(200).json(result.recordset)
        });
    } catch (err) { res.status(500).send(err.message) }
})

router.get('/api/department/:dept_name', (req, res) => {
    try {
        connection.then(async db => {
            const result = await db.request()
                .input('deptName', sql.VarChar, req.params.dept_name)
                .query(`SELECT * FROM department WHERE dept_name = @deptName;`)
                console.log(result.recordset)
            res.status(200).json(result.recordset)
        });
    } catch (err) { res.status(500).send(err.message) }
})

router.get('/api/courses/:id', (req, res) => {
    try {
        connection.then(async db => {
            const result = await db.request()
                .input('Id', sql.VarChar, req.params.id)
                .query(
                    `SELECT * FROM course WHERE course_id = @Id; 
                    SELECT DISTINCT(dept_name) FROM department`
                )
                console.log(result.recordsets)
            res.status(200).json(result.recordsets)
        });
    } catch (err) { res.status(500).send(err.message) }
})

router.post('/api/courses/save', async (req, res) => {
    console.log(req.body)
    try {

        connection.then(async db => {
            const result = await  db.request()
            .input(`course_id`, sql.VarChar, req.body.course_id)
            .input(`title`, sql.VarChar, req.body.title)
            .input(`dept_name`, sql.VarChar, req.body.dept_name)
            .input(`credits`, sql.Numeric, req.body.credits)
            .query(`UPDATE course SET title = @title, dept_name = @dept_name, credits = @credits WHERE course_id = @course_id;
                    SELECT * FROM course`);
            console.log(result);
            if(result.rowsAffected[0] === 1){
                res.status(200).json(result.recordset);
            }

        })

        // const request = new sql.Request()
        // request.query('update myAwesomeTable set awesomness = 100', (err, result) => {
        //     console.log(result.rowsAffected)
        // })        
        
    } catch (error) {
        console.log(error.message)
    }
})

router.get('/col', (req, res) => {
    try {
        connection.then(async db => {
            const result = await db.query(`SELECT * FROM course;`)
            console.log(result.recordset.columns.course_id.type) // true
            console.log(result.recordset.columns.course_id.type === sql) // true
            res.status(200).json(result.recordset.columns)
        });
    } catch (err) { res.status(500).send(err.message) }
})

export default router

    // const pool = await poolPromise
    // const result = await pool
    //     .input('input_parameter', sql.Int, req.query.input_parameter)
    //     .query('select * from mytable where id = @input_parameter')      

    // res.json(result.recordset)