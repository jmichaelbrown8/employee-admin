USE employee_db;

/*


-- Query for updating employee role --
UPDATE employee
SET role_id = ?
WHERE id = ?;



-- Query for adding new employee --
INSERT INTO employee ( first_name, last_name, role_id, manager_id )
    VALUES ( ?, ?, ?, ? )



-- Query for adding new role --
INSERT INTO role (title, salary, department_id)
    VALUES (?, ?, ?)


-- Query for inserting new department --
INSERT INTO department (name)
    VALUES ("name")


-- Query for view all roles --
SELECT role.id,
       role.title,
       department.name as department,
       role.salary
FROM role
LEFT JOIN department ON department.id = role.department_id;


-- Query for view all employees --
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
    LEFT JOIN employee m ON employee.manager_id = m.id;