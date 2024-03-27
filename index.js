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

inquirer
  .prompt([
    {
        type: 'list',
        message: 'What would you like to do?',
        name:'intro',
        choices:['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department']
    }
  ])
  .then((data) => {
    const introChoice = data.intro
    switch(introChoice){
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
                    choices: [db.query('SELECT name FROM department')]
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: 'Who is the employees manager?',
                    choices: ['None', db.query('SELECT name FROM employee')]
                },
                {
                    
                }
            ])
            
    }
  });