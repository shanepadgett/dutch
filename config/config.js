module.exports = {
  development: {
    url: process.env.DB_CONNECTION_STRING_DEV,
    dialect: 'mysql'
  },
  test: {
    url: process.env.DB_CONNECTION_STRING_TEST,
    dialect: 'mysql'
  },
  production: {
    url: process.env.DB_CONNECTION_STRING_PROD,
    dialect: 'mysql'
  }
}
