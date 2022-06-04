-- Set the DB
USE employee_DB;
-- Populate Departments
INSERT INTO department (id,name)
    VALUES
        (1,'Sales'),
        (2,'Finance'),
        (3,'Legal'),
        (4,'Engineering');

-- Populate Roles 
INSERT INTO role (id,title,salary,department_id)
    VALUES
        (01,'Salesperson',80000.01,1),
        (02,'Lead Engineer',150000.02,4),
        (03,'Software Engineer',120000.03,4),
        (04,'Account Manager',160000.04,2),
        (05,'Accountant',125000.00,2),
        (06,'Legal Team Lead',250000.05,3),
        (07,'Lawyer',198000.06,3);

-- Populate Employees

INSERT INTO employee (id,first_name,last_name,manager_id,role_id)
    VALUES
        (001,'John','Doe',NULL,NULL),
        (002,'Mike','Chan',001,01,
        (003,'Ashley','Rodriguez',NULL,02),
        (004,'Kevin','Tupik',003,03),
        (005,'Kumal','Singh',NULL,04),
        (006,'Natalia','Brown',005,05),
        (007,'Sarah','Lourd',NULL,06),
        (008,'Tom','Allen',007,07);