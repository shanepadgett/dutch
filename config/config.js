require('dotenv').config()

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
    url: "mysql://pkbekmxkd4vxedv4:e6jvymqebtnzhvo9@zf4nk2bcqjvif4in.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/wsfk48l52dpisnok",
    dialect: 'mysql'
  }
}
