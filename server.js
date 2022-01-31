const inquirer = require('inquirer');
const util = require('util');
const mysql = require('mysql2');
const cTable = require('console.table');

// Connect to database
const db = mysql.createConnection({
    host: '127.0.0.1',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: 'password',
    database: 'employee_db'
});

// allows db.query to be async
db.query = util.promisify( db.query );

// view all departments, 
async function viewAllDepartments() {
    try {
        const results = await db.query('SELECT * FROM department');
        console.table(results);
    } catch (err) {
        console.error(err);
    }
}

// view all roles, 
async function viewAllRoles() {
    // show id, title, department name, salary
    try {
        const results = await db.query('SELECT * FROM role');
        console.table(results);
    } catch (err) {
        console.error(err);
    }
}

// view all employees, 
async function viewAllEmployees() {
    // show id, first_name, last_name, title, department name, salary, manager
    try {
        const results = await db.query('SELECT * FROM employee');
        console.table(results);
    } catch (err) {
        console.error(err);
    }
}

// add a department, 
function addDepartment(name) {}

// add a role, 
function addRole(title, salary, department) {}

// add an employee, 
function addEmployee(firstName, lastName, role, manager) {}

// and update an employee role
function updateEmployee(id, firstName, lastName, role, manager) {}

// BONUS 

// Update employee managers.

// View employees by manager.

// View employees by department.

// Delete departments, roles, and employees.

// View the total utilized budget of a department—in other words, the combined salaries of all employees in that department.