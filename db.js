import sql from 'mssql'

const config = {
    user: 'sa',
    password: 'welcome123',
    server: 'localhost\\SQLEXPRESS', // localhost\SQLEXPRESS    You can use 'localhost\\instance' to connect to named instance
    database: 'EXAMS',
    encrypt: false,
    trustServerCertificate: true,
}


export const connection = new sql.ConnectionPool(config).connect()
    .then(p => {
        console.log('Connected to MSSQL')
        return p
    })
    .catch(err => console.log('Database Connection Failed! Bad Config: ', err))


