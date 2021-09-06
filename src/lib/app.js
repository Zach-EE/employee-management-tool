const connection = require('../config/config');
const consoleTable = require('console.table');
const inquirer = require('inquirer');
const commandList = require('./commandList');
const queries = require('./queries');

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
                console.log('quit');
            }else {
                switch (answer.action) {
                    case commandList.commandList[0]:
                        console.log(commandList.commandList[0]);
                        viewAllEmployees();
                        break;

                    case commandList.commandList[1]:
                        console.log(commandList.commandList[1]);
                        viewAllRoles();
                        break;

                    case commandList.commandList[2]:
                        console.log(commandList.commandList[2]);
                        viewAllDepartments();
                        break;

                    case commandList.commandList[3]:
                        console.log(commandList.commandList[3]);
                        addEmployee();
                        break;
                }
            }
            
        }); 

        
}
// All DB queries for application
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
const viewAllDepartments = async () => {
    try {
        const rows = await getDepartment();
        console.table(rows);
        start();
    } catch (err) {
        console.log(err);
    }
}

const viewAllRoles = async () => {
    try {
        const rows = await getRoles();
        console.table(rows);
        start();
    } catch (err) {
        console.log(err);
    }
}

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
                            console.log(`The new employee ${answer.empFirstName} ${answer.empLastName} was added successfully!`);
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

module.exports ={start};