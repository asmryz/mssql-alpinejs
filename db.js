import sql from 'mssql'

const config = {
    user: 'sa',
    password: 'Welcome@123',
    server: 'localhost', // You can use 'localhost\\instance' to connect to named instance
    database: 'Silberschatz',
    synchronize: true,
    trustServerCertificate: true,
}


export const connection = new sql.ConnectionPool(config).connect()
    .then(p => {
        console.log('Connected to MSSQL')
        return p
    })
    .catch(err => console.log('Database Connection Failed! Bad Config: ', err))


