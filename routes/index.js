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