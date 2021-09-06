const path = require('path');
const fs = require('fs');

const queries = {

    viewAllEmployees: fs.readFileSync(path.join(__dirname, '../sql/viewAllEmp.sql')).toString(),

    viewAllRoles: fs.readFileSync(path.join(__dirname, '../sql/viewAllRoles.sql')).toString(),

    viewAllDepartments: fs.readFileSync(path.join(__dirname, '../sql/viewAllDep.sql')).toString(),

    viewAllManagers: fs.readFileSync(path.join(__dirname, '../sql/viewAllManagers.sql')).toString(),

    addEmployee: fs.readFileSync(path.join(__dirname, '../sql/addEmployee.sql')).toString(),

}

module.exports = queries;