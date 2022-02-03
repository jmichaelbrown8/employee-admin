const inquirer = require('inquirer');
const util = require('util');
const mysql = require('mysql2');
const cTable = require('console.table');
const { resolve } = require('path');

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

// Start the menu loop
menu();

/** Menu function loop to prompt the user for what action they'd like to take */
async function menu() {
    const { action } = await inquirer.prompt([{
        type: 'list',
        choices: [
            'View All Employees',
            'Add Employee',
            'Update Employee',
            'View All Roles',
            'Add Role',
            'View All Departments',
            'Add Department',
            'Quit'
        ],
        message: 'What would you like to do?',
        name: 'action'
    }]);

    switch (action) {
        case 'View All Employees':
            await viewAllEmployees();
            break;
        case 'Add Employee':
            break;
        case 'Update Employee':
            break;
        case 'View All Roles':
            await viewAllRoles();
            break;
        case 'Add Role':
            break;
        case 'View All Departments':
            await viewAllDepartments();
            break;
        case 'Add Department':
            await addDepartment();
            break;
        case 'Quit':
        default:
            db.end();
            return null;
    }

    menu();
}

/** View All Departments: (id, name) */
async function viewAllDepartments() {
    try {
        const results = await db.query('SELECT * FROM department');
        console.table(results);
    } catch (err) {
        console.error(err);
    }
}

/** View All Roles: (id, title, department, salary) */
async function viewAllRoles() {
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

/** View All Employees: (id, first_name, last_name, title, department, salary, manager) */
async function viewAllEmployees() {
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

/** Prompts the user for a name of the department, then inserts it into the database. */
async function addDepartment() {

    const { name } = await inquirer.prompt([{
        type: 'input',
        message: 'What is the new department name?',
        name: 'name'
    }]);

    try {
        await db.query(`
            INSERT INTO department (name)
            VALUES (?)
            `, 
            name
        );
        console.log(`Added ${name} to the database`);
        
    } catch (err) {
        console.error(err);
    }
}

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