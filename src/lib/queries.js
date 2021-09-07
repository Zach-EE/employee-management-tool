// DB queries paths found here
const path = require('path');
const fs = require('fs');

const queries = {

    viewAllEmployees: fs.readFileSync(path.join(__dirname, '../sql/viewAllEmp.sql')).toString(),

    viewAllRoles: fs.readFileSync(path.join(__dirname, '../sql/viewAllRoles.sql')).toString(),

    viewAllDepartments: fs.readFileSync(path.join(__dirname, '../sql/viewAllDep.sql')).toString(),

    viewAllManagers: fs.readFileSync(path.join(__dirname, '../sql/viewAllManagers.sql')).toString(),

    addEmployee: fs.readFileSync(path.join(__dirname, '../sql/addEmployee.sql')).toString(),

    addDepartment: fs.readFileSync(path.join(__dirname, '../sql/addDepartment.sql')).toString(),

    addRole: fs.readFileSync(path.join(__dirname, '../sql/addRole.sql')).toString(),

    updateEmployeeRole: fs.readFileSync(path.join(__dirname, '../sql/updateEmployee.sql')).toString(),
    

}

module.exports = queries;