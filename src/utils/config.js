require('dotenv').config()

const PostgreSQL = {
  database: {
    host: process.env.POSTGRESQL_HOST,
    user: process.env.POSTGRESQL_USER,
    password: process.env.POSTGRESQL_PASSWORD,
    database: process.env.POSTGRESQL_DATABASE,
  },
}

module.exports = {
  PostgreSQL,
}
