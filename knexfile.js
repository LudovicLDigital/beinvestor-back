const knexConfig = {
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: 'root',
        database: 'beinvestorapi'
    },
    pool: { min: 2, max: 5 }
};
module.exports = knexConfig;