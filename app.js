const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
const dotenv = require('dotenv');
const pressAnyKey = require('press-any-key');
dotenv.config();

//create connection to mySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: process.env.mySQLPW,
  database: 'fakebiz_DB'
});
//start function 

//opening prompt what would you like to do:  add dept, add role, add employee ,view dept, view roles ,view employees ,update employee role, exit. 
const startPrgm = () => {
  inquirer
    .prompt([
      {
        name: 'wantdo',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
          'Add a department',
          'Add a role',
          'Add an employee',
          'View department',
          'View roles',
          'View employees',
          'Update employee role',
          'Exit'
        ],

      },
    ])
    .then((answer) => {
      switch (answer.wantdo) {
        case 'Add a department':
          addDept();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'View department':
          viewDept();
          break;
        case 'View roles':
          viewRole();
          break;
        case 'View employees':
          viewEmployee();
          break;
        case 'Update employee role':
          updateEmployee();
          break;
        default:
          quitPrgm();
          break;
      }
    });
}
//add dept function
const addDept = () => {
  inquirer
    .prompt([
      {
        name: 'newDept',
        type: 'input',
        message: 'What is the name of the new department?'

      },
    ])
    .then((answer) => {
      connection.query(
        'INSERT INTO department SET ?',
        { name: answer.newDept },
        (err) => {
          if (err) throw err;
          console.log(`${answer.newDept} added to departments!`);
          pressAnyKey()
            .then(() => {
              startPrgm();
            })
        }
      );
    });
}

const addRole = () => {
  connection.query('SELECT * FROM department', (err, results) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: 'newRole',
          type: 'input',
          message: 'What is the name of the new role?'
        },
        {
          name: 'salary',
          type: 'input',
          message: 'what is the salary of the new role?'
        },
        {
          name: 'department_id',
          type: 'rawlist',
          choices: () => {
            const deptArray = [];
            results.forEach(({ name, id }) => {
              deptArray.push({ name: name, value: id });
              // deptArray.push(department);
            });

            return (deptArray);
          },
          message: 'To what department does the new role belong?'
        },
      ])
      .then((answer) => {
        connection.query(
          'INSERT INTO role SET ?',
          {
            title: answer.newRole,
            salary: answer.salary,
            department_id: answer.department_id,
          },
          (err) => {
            if (err) throw err;
            console.log(`${answer.newRole} added to roles at $${answer.salary} per year!`);
            pressAnyKey()
              .then(() => {
                startPrgm();
              })
          }
        );
      });
  })
}
//add employee
const addEmployee = () => {
  connection.query('SELECT * FROM role', (err, results) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: 'newEmpFN',
          type: 'input',
          message: 'What is the new employee\'s first name?'
        },
        {
          name: 'newEmpLN',
          type: 'input',
          message: 'What is the new employee\'s last name?'
        },
        {
          name: 'newEmpRole',
          type: 'rawlist',
          choices: () => {
            const roleArray = [];
            results.forEach(({ title, id }) => {
              roleArray.push({ name: title, value: id });
            })
            return (roleArray);
          },
          message: 'What is the new employee\'s job title',
        },
      ])
      .then((answer) => {
        connection.query(
          'INSERT INTO employee SET ?',
          {
            first_name: answer.newEmpFN,
            last_name: answer.newEmpLN,
            role_id: answer.newEmpRole
          },

          (err) => {
            if (err) throw err;
            console.log(`${answer.newEmpFN} ${answer.newEmpLN} added to employee roster
            !`);
            pressAnyKey()
              .then(() => {
                startPrgm();
              })
          }
        );
      });
  })


}
//view dept 
const viewDept = () => {
  connection.query('SELECT * FROM department', (err, results) => {
    if (err) throw err;
    console.table('DEPARTMENTS', results)
    pressAnyKey()
      .then(() => {
        startPrgm();
      })
  });
}
//view roles
const viewRole = () => {
  connection.query('SELECT * FROM role', (err, results) => {
    if (err) throw err;
    console.table('ROLES', results)
    pressAnyKey()
      .then(() => {
        startPrgm();
      })
  });
}
//view employee
const viewEmployee = () => {
  connection.query('SELECT * FROM employee', (err, results) => {
    if (err) throw err;
    console.table('EMPLOYEES', results)
    pressAnyKey()
      .then(() => {
        startPrgm();
      })
  });
}




// update employeerole
const updateEmployee = () => {
  connection.query(
    'SELECT * FROM employee', (err, results) => {
      if (err) throw err;
      inquirer
        .prompt([
          {
            name: 'updateEmp',
            type: 'rawlist',
            choices: () => {
              const empArray = [];
              results.forEach(({ first_name, last_name, id }) => {
                empArray.push({ name: `${first_name} ${last_name}`, value: id })
              })
              return (empArray);
            }
          }
        ])
        .then((answers) => {
          chooseNewRole(answers.updateEmp);

        });
    })
}


//small functions
const chooseNewRole = (employee) => {
  connection.query(
    'SELECT * FROM role', (err, results) => {
      if (err) throw err;
      inquirer
        .prompt([
          {
            name: 'updateRole',
            type: 'rawlist',
            choices: () => {
              const roleArray = [];
              results.forEach(({ id, title }) => {
                roleArray.push({ name: title, value: id })
              })
              return (roleArray);
            }

          }
        ])
        .then((answers) => {
          connection.query(
            'UPDATE employee SET role_id=? WHERE id=?', [answers.updateRole, employee], (err, results) => {
              if (err) throw err;
              console.log(`Employee role updated!`)
              pressAnyKey()
                .then(() => {
                  startPrgm();
                }
                )
            })
        })
    }
  )}
//test functions

  //exit
  const quitPrgm = () => {
    console.log('Good Bye');
    connection.end();
  }




  //start listener
  connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    // getDeptIdByNam
    startPrgm();
  })