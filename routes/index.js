import express from 'express'
const router = express.Router()
import { connection } from '../db.js'
import sql from 'mssql'

router.get('/', function (req, res) {
    res.render('index', { locals: { title: 'Welcome!' } });
})

router.get('/api/courses', (req, res) => {
    try {
        connection.then(async db => {
            const result = await db.query(`SELECT * FROM course;`)
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

router.post('/api/courses/save', (req, res) => {
    console.log(req.body)
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