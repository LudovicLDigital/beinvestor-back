module.exports = {
    apps : [{
        watch: '.',
        name: "BeInvestor-api",
        script: "./src/app.js",
        env_production: {
            NODE_ENV: "production",
        },
        error_file: 'err.log',
        out_file: 'out.log',
        log_file: 'combined.log',
        time: true
    }],
};