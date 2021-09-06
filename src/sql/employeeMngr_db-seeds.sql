USE employeeMngr_db;

INSERT INTO employee (firstname, lastname) VALUES ('Jimmy','Buffet');

INSERT INTO employee (firstname, lastname, manageryn) VALUES ('Zach','Brown','Y');

INSERT INTO department (name) VALUES ('Engineering');

INSERT INTO role (title, salary) VALUES ('Software Engineer', 75000.00), ('Engineering Manager', 125000.00);

UPDATE employee SET role_id=(select id from role where title = 'Engineering Manager') where employee.firstname = 'Zach' and employee.lastname = 'Brown';

UPDATE role SET department_id=(select id from department where name = 'Engineering') where title in ('Software Engineer','Engineering Manager');

UPDATE employee SET role_id=(select id from role where title = 'Software Engineer'), manager_id=2 where employee.firstname = 'Jimmy' and employee.lastname = 'Buffet';