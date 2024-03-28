// These lines are so that the javascript can access the Filesystem and Inquirer packages
const inquirer = require('inquirer');
const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)
);


inquirer.prompt([
    {
        type: 'list',
        message: 'What would you like to do?',
        name:'intro',
        choices:['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit']
    }
])
.then((data) => {
    const introChoice = data.intro
    db.query('SELECT name FROM department', function(err,res) {
        const deptList = results;
        return deptList;
    });
    db.query('SELECT name FROM employee', function(err,res) {
        const employeeList = results;
        return employeeList;
    });
    db.query('SELECT title FROM role', function(err,res) {
        const roleList = results;
        return roleList;
    });
    switch(introChoice, employeeList, deptList){
        case 'View All Employees':
            db.query('SELECT * FROM employee', function(err, res) {
                console.log(results)
            });
            break;
        case 'Add Employee':
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'firstName',
                    message: 'What is the employees  first name?',
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message:'What is the employees last name?',
                },
                {
                    type: 'list',
                    name: 'role',
                    message: 'What is the employees role?',
                    choices: [deptList]
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: 'Who is the employees manager?',
                    choices: ['None', employeeList]
                }
            ])
            .then((data) => {
                db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (${data.firstName},${data.lastName},${data.role},${data.manager})`)
            });
            break;
        case 'Update Employee Role':
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employeeSelect',
                    message: 'Which employee would you like to update?',
                    choices:[employeeList]
                },
                {
                    type: 'list',
                    name: 'roleSelect',
                    message: 'Which role should they receive?',
                    choices:[roleList]
                }
            ])
            .then((data) =>{
                db.query(`UPDATE employee SET role_id = "${data.roleSelect}" WHERE id = ${employeeSelect}`)
            });
            break;
        case 'View All Roles':
            db.query(`SELECT * FROM department;`, function (err, results) {
                console.log(results)
            });
            break;
        case 'Add Role':
            inquirer.prompt([
                {
                    type: 'input',
                    name:'roleTitle',
                    message: 'What is the title of this role?',
                },
                {
                    type: 'input',
                    name: 'rolePay',
                    message: 'What is the salary for this position?',
                },
                {
                    type: 'list',
                    name:'roleDept',
                    message:'Which department does this role belong to?',
                    choices:[deptList]
                }
            ])
            .then((data) =>{
                db.query(`INSERT INTO department (title, salary, department_id) VALUES ("${data.roleTitle}","${data.rolePay}","${data.roleDept}");`);
                db.query(`SELECT * FROM role;`, function (err, results) {
                    console.log(results)
                });
            });
            break;
        case 'View All Departments':
            db.query(`SELECT * FROM department;`, function (err, results) {
                console.log(results)
            });
            break;
        case 'Add Department':
            inquirer.prompt([
                {
                    type: 'input',
                    name:'deptName',
                    message: 'What is the name of the department?'
                }
            ])
            .then((data) => {
                db.query(`INSERT INTO department (name) VALUES ("${data.deptName}");`);
                db.query(`SELECT * FROM department;`, function (err, results) {
                    console.log(results)
                });
            });
            break;
        case 'Quit':
            break; 
    }
});

