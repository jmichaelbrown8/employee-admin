USE employee_db;

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