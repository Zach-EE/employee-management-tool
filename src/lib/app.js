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
            type: 'rawlist',
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
                        break;

                    case commandList.commandList[2]:
                        console.log(commandList.commandList[2]);
                        break;

                    case commandList.commandList[3]:
                        console.log(commandList.commandList[3]);
                        break;
                }
            }
            
        }); 

        
}
// All DB queries for application
const getEmployees = () => {
    return query(queries.viewAllEmployees);
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


module.exports ={start};