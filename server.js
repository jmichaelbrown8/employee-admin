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
            'Update Employee Role',
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
            await addEmployee();
            break;
        case 'Update Employee Role':
            await updateEmployeeRole();
            break;
        case 'View All Roles':
            await viewAllRoles();
            break;
        case 'Add Role':
            await addRole();
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

/** Prompts the user for the title, salary, and department of the new role, then adds that to the database. */
async function addRole() {

    // get department choices from the database
    let deptChoices = await db.query('SELECT * FROM department');

    // map the id to value (so id is returned from the inquirer.prompt)
    deptChoices = deptChoices.map(
        (obj) => { 
            obj.value = obj.id; 
            return obj; 
        }
    );

    const { title, salary, department_id } = await inquirer.prompt([
        {
            type: 'input',
            message: 'What is the title of the new role?',
            name: 'title'
        }, {
            type: 'number',
            message: 'What is the salary for the role?',
            name: 'salary'
        }, {
            type: 'list',
            choices: deptChoices,
            message: 'Which department is this role in?',
            name: 'department_id'
        }
    ]);

    try {
        await db.query(`
                INSERT INTO role (title, salary, department_id)
                    VALUES (?, ?, ?)
            `, 
            [title, salary, department_id]
        );
        console.log(`Added ${title} to the database`);
    } catch (err) {
        console.error(err);
    }
}

/** Prompts the user for the employees first name, last name, role, and manager, then adds them to the database */
async function addEmployee() {

    // get role choices from the database
    let roleChoices = await db.query('SELECT * FROM role');

    // map the id to value (so id is returned from the inquirer.prompt)
    roleChoices = roleChoices.map(
        (obj) => { 
            obj.value = obj.id; 
            obj.name = obj.title;
            return obj; 
        }
    );

    // get manager choices from the database
    let managerChoices = await db.query(`
        SELECT id, 
               CONCAT( first_name, ' ', last_name ) as name 
        FROM employee`
    );

    // map the id to value (so id is returned from the inquirer.prompt)
    managerChoices = managerChoices.map(
        (obj) => { 
            obj.value = obj.id; 
            return obj; 
        }
    );

    const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
        {
            type: 'input',
            message: 'What is the employee\'s first name?',
            name: 'first_name'
        }, {
            type: 'input',
            message: 'What is the employee\'s last name?',
            name: 'last_name'
        }, {
            type: 'list',
            choices: roleChoices,
            message: 'What is the employee\'s role?',
            name: 'role_id'
        }, {
            type: 'list',
            choices: managerChoices,
            message: 'Who is the employee\'s manager?',
            name: 'manager_id'
        }
    ]);

    try {
        await db.query(`
            INSERT INTO employee ( first_name, last_name, role_id, manager_id )
                VALUES ( ?, ?, ?, ? )
        `, [first_name, last_name, role_id, manager_id]);
        console.log(`Added ${first_name} ${last_name} to the database`);
    } catch (err) {
        console.log(err);
    }
}

/** Prompt for which employee and which role, then update the employee's role in the database. */
async function updateEmployeeRole() {

    const employees = await db.query(`
        SELECT id AS value, 
               CONCAT(first_name, ' ', last_name) AS name
               FROM employee
    `);
    
    const roles = await db.query(`
        SELECT id AS value,
               title AS name
               FROM role
    `);

    // prompt for which employee to update, and which role to set
    const { id, role_id } = await inquirer.prompt([{
        type: 'list',
        message: 'Which employee would you like to update?',
        name: 'id',
        choices: employees
    }, {
        type: 'list',
        message: 'Which role should be added?',
        name: 'role_id',
        choices: roles    
    }]);

    // update
    try {
        await db.query(`
            UPDATE employee
                SET role_id = ?
                WHERE id = ?;
        `, [role_id, id]);
        console.log(`Updated employee ${id}`);
    } catch (err) {
        console.log(err);
    }

}

// BONUS 

// Update employee managers.

// View employees by manager.

// View employees by department.

// Delete departments, roles, and employees.

// View the total utilized budget of a department—in other words, the combined salaries of all employees in that department.