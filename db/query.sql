USE employee_db;

SELECT CONCAT( employee.first_name, ' ', employee.last_name) as name,
       role.title,
       role.salary,
       department.name as department,
       CONCAT( m.first_name, ' ', m.last_name ) as manager
    FROM employee
    JOIN role ON role.id = employee.role_id
    LEFT JOIN department ON department.id = role.department_id
    LEFT JOIN employee m ON employee.manager_id = m.id;