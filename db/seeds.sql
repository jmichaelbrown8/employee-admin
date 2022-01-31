USE employee_db;

INSERT INTO department (id, name)
VALUES (1, 'Engineering'),
       (2, 'Finance'),
       (3, 'Legal'),
       (4, 'Sales & Marketing');

INSERT INTO role (id, title, salary, department_id)
VALUES (1, 'CEO', 1000000, NULL),
       (2, 'CTO', 350000, 1),
       (3, 'CFO', 350000, 2),

       (4, 'VP of Product', 200000, 1),
       (5, 'VP of Finance', 200000, 2),
       (6, 'VP of Legal', 250000, 3),
       (7, 'VP of Sales & Marketing', 200000, 4),

       (8, 'Engineering Director', 175000, 1),
       (9, 'Finance Director', 175000, 2),
       (10, 'Legal Director', 200000, 3),
       (11, 'Sales Director', 175000, 4),
       (12, 'Marketing Director', 175000, 4),

       (13, 'Engineering Manager', 150000, 1),
       (14, 'Product Manager', 150000, 1),
       (15, 'Lead Lawyer', 150000, 3),
       (16, 'Sales Manager', 150000, 4),
       (17, 'Marketing Manager', 150000, 4),

       (18, 'Engineer', 100000, 1),
       (19, 'Accountant', 80000, 2),
       (20, 'Lawyer', 125000, 3),
       (21, 'Salesperson', 80000, 4),
       (22, 'Marketer', 75000, 4);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, 'Lee', 'Iacocca', 1, NULL),
       (2, 'Arash', 'Ferdowsi', 2, 1),
       (3, 'April', 'Underwood', 4, 1),
       (4, 'Thurgood', 'Marshall', 6, 1),
       (5, 'Daniel', 'Wieden', 7, 1);

-- These employees have no one reporting to them, so don't need to set an id --
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
       ('William', 'Gates', 18, 2),
       ('Steve', 'Wozniak', 18, 2),
       ('Jimmy', 'Wales', 18, 2),
       ('Max', 'Levchin', 18, 2),
       ('Mark', 'Zuckerberg', 18, 2),
       ('Stephen', 'Jobs', 14, 3),
       ('Tim', 'Cook', 14, 3),
       ('Rachel', 'Sheppard', 22, 5),
       ('Sean', 'Parker', 18, 2);
