import mysql from 'mysql';

export const getConnection = () => {
    // const connection = mysql.createConnection({
    //     host     : '584099dfecdd5c15db000029-marketing.itos.redhat.com',
    //     port     : 54816,
    //     user     : 'adminYeMvBUb',
    //     password : 'nVNdcJBDaazL',
    //     database : 'workflows1',
    //     multipleStatements: 'true'
    // });
    const connection = mysql.createConnection({
        host     : '585027b4ecdd5c44f6000050-marketing.itos.redhat.com',
        port     : 50271,
        user     : 'admina22ViNn',
        password : 'mEv5gF3Kbi_N',
        database : 'wbdb',
        multipleStatements: 'true'
    });
    connection.connect();
    return connection;
};

export const getQueryPromise = () => {
    const connection = getConnection();
    return (qString) => {
        return new Promise((resolve, reject) => {
            connection.query(qString, (err, data) => {
                if (err) return reject(err);
                resolve(data);
            })
        })
    };
};