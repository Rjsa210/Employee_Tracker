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
        // case 'Update employee role': 
        //   updateEmployee();
        //   break;
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
//add role //flawed code
// const addRole = () => { 
//   connection.query('SELECT * FROM department', (err, results) => {
//     if (err) throw err;

//     inquirer
//       .prompt([
//         {
//           name: 'newRole',
//           type: 'input',
//           message: 'What is the name of the new role?'
//         },
//         {
//           name: 'salary',
//           type: 'input',
//           message: 'what is the salary of the new role?'
//         },
//         {
//           name: 'department_id',
//           type: 'rawlist',
//           choices: () => {
//             const deptArray = [];
//             results.forEach((department) => {
//               deptArray.push(JSON.stringify(department));
//               // deptArray.push(department);
//             });
//             return deptArray;
//           },
//           message: 'To what department does the new role belong?'
//         },
//       ])
//       .then((answer) => {
//         connection.query(
//           'INSERT INTO role SET ?',
//           {
//             title: answer.newRole,
//             salary: answer.salary,
//             department_id: JSON.parse(answer.department_id).id,
//             // department_id: () => {
//             //   let string = JSON.stringify(answer.department_id);
//             //   let parse = JSON.parse(string);
//             //   return parse.id;
//             // }
//             // department_id: getDeptIdByName(answer.department_id)
//           },
//           (err) => {
//             if (err) throw err;
//             console.log(`${answer.newRole} added to roles at $${answer.salary} per year!`);
//             pressAnyKey()
//               .then(() => {
//                 startPrgm();
//               })
//           }
//         );
//       });
//   })
// }

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
              deptArray.push({name});
              // deptArray.push(department);
            });

            return (deptArray);
          },
          message: 'To what department does the new role belong?'
        },
      ])
      .then((answer) => {
        console.log({
          title: answer.newRole,
          salary: answer.salary,
          department_id: getDeptIdByName(answer.department_id),
        })
        // getDeptIdByName(answer.department_id)
        // connection.query(
        //   'INSERT INTO role SET ?',
        //   {
        //     title: answer.newRole,
        //     salary: answer.salary,
        //     department_id: getDeptIdByName(answer.department_id),
        //   },
        //   (err) => {
        //     if (err) throw err;
        //     console.log(`${answer.newRole} added to roles at $${answer.salary} per year!`);
        //     pressAnyKey()
        //       .then(() => {
        //         startPrgm();
        //       })
        //   }
        // );
      });
  })
}
//add employee
const addEmployee = () => {
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
    ])
    .then((answer) => {
      connection.query(
        'INSERT INTO employee SET ?',
        {
          first_name: answer.newEmpFN,
          last_name: answer.newEmpLN,
        },
        (err) => {
          if (err) throw err;
          console.log(`${answer.newEmpFN} ${answer.newEmpLN} added to employee roster as a JOB ROLE! reporting to MANAGER!`);
          pressAnyKey()
            .then(() => {
              startPrgm();
            })
        }
      );
    });
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

//small functions
const getDeptIdByName = (deptname) => {
  connection.query(
    `SELECT id FROM department WHERE name=?`,
    [deptname],
    (err, results) => {
      if (err) throw err;
      console.log(results[0].id);
      console.log(typeof(results[0].id));
      return results[0].id;
    }
  )
}

//test functions

const displayDepts = () => {
  connection.query(
    'SELECT * FROM department', (err, results) => {
      const deptArray = [];
      if (err) throw err;
      results.forEach(({ name }) => {

        deptArray.push(name);

      });
      console.log(deptArray);
    }
  )
}



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