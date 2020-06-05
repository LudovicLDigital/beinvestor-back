module.exports = {
    apps : [{
        watch: '.',
        name: "BeInvestor-api",
        script: "./src/app.js",
        env_production: {
            NODE_ENV: "production",
        }
    }],
};
