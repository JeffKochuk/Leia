import mysql from 'mysql';
import promisify  from 'es6-promisify';


var getConnection = () => {
    let connection = mysql.createConnection({
        host     : '57cde97f5110e22ff00009e3-marketing.itos.redhat.com',
        port     : 46396,
        user     : 'admin8Rnx4xt',
        password : 'bL22Jnls_aVP',
        database : 'columbodb'
    });
    connection.connect();
    return connection;
};


export { getConnection } ;