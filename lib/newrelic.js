export const config = {
    app_name: [process.env.NEWRELIC_APP_NAME],
    license_key: process.env.NEWRELIC_LICENSE_KEY,
    logging: {
        level: 'info'
    }
};
