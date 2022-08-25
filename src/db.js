async function connect(){
    if(global.connection && global.connection.state !== 'disconnected')
        return global.connection;
 
    const mysql = require("mysql2/promise");
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'test',
        password: process.env.DB_PASSWORD || 'test',
        database: process.env.DB || 'lab1',
        multipleStatements: true
      } );
    console.log("Conectou no MySQL!");
    global.connection = connection;
    return connection;
}

async function selectUserByLogin(user, password){
    const conn = await connect();

    const query = `SELECT * FROM users WHERE user = '${user}' AND password = '${password}';`;
    const [rows] = await conn.query(query);
    return rows;
}

module.exports = {selectUserByLogin}
