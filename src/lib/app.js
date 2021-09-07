// DB connection config file
const connection = require('../config/config');

const queries = require('./queries');
const commandList = require('./commandList');
const consoleTable = require('console.table');
const inquirer = require('inquirer');
// allows for promises to be used with connection.query
const util = require("util");
const query = util.promisify(connection.query).bind(connection);

const start = () => {
    inquirer
        .prompt({
            name: 'action',
            type: 'list',
            message: 'Please make a decision: ',
            choices: commandList.commandList
        })
        .then((answer) => {
            if (answer.action === 'Quit'){
                quitEmployMngr();
            }else {
                switch (answer.action) {
                    case commandList.commandList[0]:
                        // console.log(commandList.commandList[0]);
                        viewAllEmployees();
                        break;

                    case commandList.commandList[1]:
                        // console.log(commandList.commandList[1]);
                        viewAllRoles();
                        break;

                    case commandList.commandList[2]:
                        // console.log(commandList.commandList[2]);
                        viewAllDepartments();
                        break;

                    case commandList.commandList[3]:
                        // console.log(commandList.commandList[3]);
                        addEmployee();
                        break;

                    case commandList.commandList[4]:
                        // console.log(commandList.commandList[4]);
                        addDepartment();
                        break;

                    case commandList.commandList[5]:
                        // console.log(commandList.commandList[5]);
                        addRole();
                        break;

                    case commandList.commandList[6]:
                        // console.log(commandList.commandList[6]);
                        updateEmployeeRole();;
                        break;
                    // TODO: ADD ADDITIONAL OPTIONS BY UPDATING commandList.js and following case convention                 
                }
            }
            
        }); 

        
}
//* DB queries for application
const getEmployees = () => {
    return query(queries.viewAllEmployees);
}
const getRoles = () => {
    return query(queries.viewAllRoles);
}
const getDepartment = () => {
    return query(queries.viewAllDepartments);
}
const getManagers = () => {
    return query(queries.viewAllManagers);
}

//* View Functions
// viewAllDepartments: shows user table of all departments in company
const viewAllDepartments = async () => {
    try {
        const rows = await getDepartment();
        console.table(rows);
        start();
    } catch (err) {
        console.log(err);
    }
}
// viewAllRoles: shows user table of all employee roles and departments
const viewAllRoles = async () => {
    try {
        const rows = await getRoles();
        console.table(rows);
        start();
    } catch (err) {
        console.log(err);
    }
}
// viewAllEmployees: shows users employee table with employee profile data
const viewAllEmployees = async () => {
    try {
        const rows = await getEmployees();
        console.table(rows);
        start();
    } catch (err) {
        console.log(err);
    }
}

//* Add to DB Functions:
const addEmployee = async () => {
    try {
        const promptUser = () => {
            return inquirer
                .prompt([
                    {
                        name: "empFirstName",
                        type: "input",
                        message: "Enter New Employee's First Name...",
                    },
                    {
                        name: "empLastName",
                        type: "input",
                        message: "Enter New Employee's Last Name...",
                    },
                    {
                        name: "empManagerYN",
                        type: "list",
                        message: "Employee is a Manager...",
                        choices: ["N", "Y"],
                    },
                    {
                        name: "empRoleId",
                        type: "rawlist",
                        message: "Select Employees Role...",
                        choices: function (){
                            const choicesArray = [];
                            roles.forEach((role) =>{
                                const roleObj = {
                                    name: role.title,
                                    value: role.id
                                }
                                choicesArray.push(roleObj)
                            })
                            return choicesArray;
                        }
                    },
                    {
                        name: "empManagerId",
                        type: "rawlist",
                        choices: function () {
                            const choiceArray = [];
                            managers.forEach((mgr) => {
                                const mgrObj = {
                                    name: mgr.name,
                                    value: mgr.id
                                }
                                choiceArray.push(mgrObj)
                            })
                            return choiceArray;
                        },
                        message: "Select a manager for the new employee."
                    }
                ])
                .then((answer) => {
                    connection.query(
                        queries.addEmployee,
                        {
                            firstname: answer.empFirstName,
                            lastname: answer.empLastName,
                            role_id: answer.empRoleId,
                            manager_id: answer.empManagerId,
                            manageryn: answer.empManagerYN
                        },
                        (err) => {
                            if (err) throw err;
                            console.log(`Success: Employee  ${answer.empFirstName} ${answer.empLastName} was added to DB`);
                            start();
                        });
                });
        }

        // await functions 
        const roles = await getRoles();
        const managers = await getManagers();
        await promptUser();

    } catch (err) {
        console.log(err);
    }
}
const addDepartment = async () => {
    try {
        const promptUser = () => {
            return inquirer
                .prompt([
                    {
                        name: "deptName",
                        type: "input",
                        message: "Please Enter New Department Name...",
                    }
                ])
                .then((answer) => {
                    connection.query(
                        queries.addDepartment,
                        {
                            name: answer.deptName
                        },
                        (err) => {
                            if (err) throw err;
                            console.log(`Success: ${answer.deptName} department added to db...\n`);
                            start();
                        });
                });
        }
        await promptUser();
    } catch (err) {
        console.log(err);
    }
}
const addRole = async () => {
    try {
        const promptUser = () => {
            return inquirer
                .prompt([
                    {
                        name: "roleTitle",
                        type: "input",
                        message: "Enter Role Title...",
                    },
                    {
                        name: "roleSalary",
                        type: "input",
                        message: "Enter Salary for Role (ex. 80000)...",
                    },
                    {
                        name: "roleDeptId",
                        type: "rawlist",
                        choices: function () {
                            const choiceArray = [];
                            depts.forEach((dept) => {
                                const deptObj = {
                                    name: dept.department_name,
                                    value: dept.id
                                }
                                choiceArray.push(deptObj)
                            })
                            return choiceArray;
                        },
                        message: "What Department is Role in?..."

                    }
                ])
                .then((answer) => {
                    connection.query(
                        queries.addRole,
                        {
                            title: answer.roleTitle,
                            salary: answer.roleSalary,
                            department_id: answer.roleDeptId
                        },
                        (err) => {
                            if (err) throw err;
                            console.log(`Success: New Role ${answer.role} added to ${answer.roleDeptId}`);
                            start();
                        }
                    )
                })
        }
        const depts = await getDepartment();
        await promptUser();
    } catch (err) {
        console.log(err);
    }
}
//* Update DB Functions
// updateEmployeeRole: allows user to pick from list of employees and update role in db
const updateEmployeeRole = async () => {
    try {
        const promptUser = () => {
            return inquirer
                .prompt([
                    {
                        name: "empID",
                        type: "rawlist",
                        choices: function () {
                            const choiceArray = [];
                            emps.forEach((emp) => {
                                const empObj = {
                                    name: `${emp.firstname} ${emp.lastname}`,
                                    value: emp.id
                                    }
                                    choiceArray.push(empObj)
                                })
                                return choiceArray;
                            },
                            message: "Select Employee to Update..."

                    },
                    {
                        name: "empRoleId",
                        type: "rawlist",
                        choices: function () {
                            const choiceArray = [];
                            roles.forEach((role) => {
                                const roleObj = {
                                    name: role.title,
                                    value: role.id
                                }
                                choiceArray.push(roleObj)
                            })
                            return choiceArray;
                        },
                        message: "Select New Role..."
                    }
                ])
                .then((answer) => {
                    connection.query(
                        queries.updateEmployeeRole,
                        [
                            {
                                role_id: answer.empRoleId
                            },
                            {
                                id: answer.empID
                            }
                        ],
                        (err) => {
                            if (err) throw err;
                            console.log(`Success: Employee job Role Updated...`);
                            start();
                        });
                });
        }
        const emps = await getEmployees();
        const roles = await getRoles();
        await promptUser();
    } catch (err) {
        console.log(err);
    }
}

// TODO: add features to updateDepartments, updateRoles, deleteEmp, deleteDepartment...etc
//* Exit application
const quitEmployMngr = () => {
    console.log(`Thank you for using the Employee Manager Tool!\n GOODBYE....`);
    return connection.end();
}
module.exports ={start};