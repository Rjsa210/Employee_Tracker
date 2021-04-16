const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
const dotenv = require('dotenv');
dotenv.config();

//create connection to mySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: process.env.mySQLPW,
  database: 'fakebiz_DB'
}
//start function 

//opening prompt what would you like to do:  add dept, add role, add employee ,view dept, view roles ,view employees ,update employee role, exit. 
