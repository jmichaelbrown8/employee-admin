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
        const results = await db.query(`
            SELECT role.id,
                   role.title,
                   department.name as department,
                   role.salary
            FROM role
            LEFT JOIN department ON department.id = role.department_id;`
        );
        console.table(results);
    } catch (err) {
        console.error(err);
    }
}

// view all employees, 
async function viewAllEmployees() {
    // show id, first_name, last_name, title, department name, salary, manager
    try {
        const results = await db.query(`
            SELECT employee.id,
                   employee.first_name,
                   employee.last_name,
                   role.title,
                   department.name as department,
                   role.salary,
                   CONCAT( m.first_name, ' ', m.last_name ) as manager
            FROM employee
            JOIN role ON role.id = employee.role_id
            LEFT JOIN department ON department.id = role.department_id
            LEFT JOIN employee m ON employee.manager_id = m.id;`
     );
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