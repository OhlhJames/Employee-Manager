// These lines are so that the javascript can access the Filesystem and Inquirer packages
const inquirer = require("inquirer");
const express = require("express");
const mysql = require("mysql2");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
  {
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "employee_db",
  },
  console.log(`Connected to the employee_db database.`)
);

async function allDepartments (){
  db.query(`SELECT * FROM department`, (err, res) => {
    console.table(res);
  });
}

async function allRoles(){
  db.query(`SELECT * FROM role`, (err, res) => {
    console.table(res);
  });
}
 
async function allEmployees (){
  db.query("SELECT * FROM employee", async (err, res) => {
    console.table(res);
  });
}

function menu () {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "intro",
        choices: [
          "View All Employees",
          "Add Employee",
          "Update Employee Role",
          "View All Roles",
          "Add Role",
          "View All Departments",
          "Add Department",
          "Quit",
        ],
      },
    ])
    .then((data) => {
      db.query("SELECT * FROM role", (err, res) => {
        if (err) {
          console.log(err);
          return;
        }
        const roleList = [];

        if (res.length) {
          for (let i = 0; i < res.length; i++) {
            roleList.push(res[i]);
          }
        }
        const deptList = [];
        db.query("SELECT * FROM department", (err, res) => {
          if (err) {
            console.log(err);
            return;
          }
          if (res.length) {
            for (let i = 0; i < res.length; i++) {
              deptList.push(res[i]);
            }
          }
          const employeeList = [];
          db.query("SELECT * FROM employee", (err, res) => {
            if (err) {
              console.log(err);
              return;
            }
            if (res.length) {
              for (let i = 0; i < res.length; i++) {
                employeeList.push(res[i]);
              }
            }
              choices({roleList, deptList, employeeList, data});
          });
        });
      });
    });
}
async function choices({roleList, deptList, employeeList, data}) {
  const introChoice = await data.intro;
  let more = true
  switch (introChoice) {
    case "View All Employees":
      allEmployees();
      break;
    case "Add Employee":
    inquirer 
        .prompt([
          {
            type: "input",
            name: "firstName",
            message: "What is the employees  first name?",
          },
          {
            type: "input",
            name: "lastName",
            message: "What is the employees last name?",
          },
          {
            type: "list",
            name: "role",
            message: "What is the employees role?",
            choices: roleList.map((role) => {
              return`${role.title}`
            }),
          },
          {
            type: "list",
            name: "manager",
            message: "Who is the employees manager?",
            choices: ["none"],
          },
        ])
        .then((data) => {
          if ((data.manager = "none")) {
            data.manager = null;
          }
          const wait = db.query(
            `SELECT * FROM role WHERE title = ?`, data.role, (err, res) => {
              console.log(res)
              const values = [ data.firstName,data.lastName,res[0].id,data.manager,];
              db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`, values, (err, res) => {
                  if (err) {
                    console.log(err);
                  }
                });
              allEmployees();
            });
        })
      break;
    case "Update Employee Role":
      inquirer
        .prompt([
          {
            type: "list",
            name: "employeeSelect",
            message: "Which employee would you like to update?",
            choices: employeeList.map((employee) => {
                return `${employee.first_name} ${employee.last_name}`;
            }
            ),
          },
          {
            type: "list",
            name: "roleSelect",
            message: "Which role should they receive?",
            choices: roleList.map((role)=>{
              return `${role.title}`
            }),
          },
        ])
        .then((data) => {
          const employeeNames = data.employeeSelect.split(" ")
          db.query( `SELECT * FROM role WHERE title = ?`, data.roleSelect, (err, res) => {
              const role = res[0].id;
              db.query(`SELECT * FROM employee WHERE first_name =? AND last_name =?`, employeeNames, (err, res) => {
                  const employeeId = res[0].id
                  const values = [role, employeeId];
                  db.query(`UPDATE employee SET role_id = ? WHERE id = ?`, values, (err, res) => {
                      if (err) {
                        console.log(err);
                      }
                      console.log(employeeId)
                      db.query(`SELECT * FROM employee WHERE id = ?`, employeeId, (err, res) => {
                        console.table(res);
                      });
                    });
                });
            });
          })
      break;
    case "View All Roles":
      allRoles();
      break;
    case "Add Role":
      inquirer
        .prompt([
          {
            type: "input",
            name: "roleTitle",
            message: "What is the title of this role?",
          },
          {
            type: "input",
            name: "rolePay",
            message: "What is the salary for this position?",
          },
          {
            type: "list",
            name: "roleDept",
            message: "Which department does this role belong to?",
            choices: deptList,
          },
        ])
        .then((data) => {
          db.query(`SELECT * FROM department WHERE name = ?`, data.role, (err, res) => {
              const values = [res[0].id, data.rolePay, data.roleTitle];
              db.query(`INSERT INTO department (title, salary, department_id) VALUES (?,?,?)`, values, (err, res) => {
                  if (err) {
                    console.log(err);
                  }
                });
            });
          allRoles()
        });
      
      break;
    case "View All Departments":
      allDepartments()
      break;
    case "Add Department":
      inquirer
        .prompt([
          {
            type: "input",
            name: "deptName",
            message: "What is the name of the department?",
          },
        ])
        .then((data) => {
          db.query(
            `INSERT INTO department (name) VALUES (?)`,
            data.deptName,
            (err, res) => {
              if (err) {
                console.log(err);
              }
            });
          allDepartments()
        });
      break;
    case "Quit":
      let more = false
      return more
  }
  if(more){
    menu();
  }
}


menu();