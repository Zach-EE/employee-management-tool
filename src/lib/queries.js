const path = require('path');
const fs = require('fs');

const queries = {
    viewAllEmployees: fs.readFileSync(path.join(__dirname, '../sql/viewAllEmp.sql')).toString()
}

module.exports = queries;