INSERT INTO department (name)
VALUES ("Testing"),
       ("Sales"),
       ("Design");

INSERT INTO role (title, salary, department_id)
VALUES ("Lead Tester", 70000, 1),
       ("Tester", 50000, 1),
       ("Sales Lead", 70000, 2),
       ("Salesperson", 40000, 2),
       ("Head Designer", 100000, 3),
       ("Lead Designer", 85000, 3),
       ("Designer II", 70000, 3),
       ("Designer I", 55000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Matthew", "Wright", 1, NULL),
       ("Dalton", "Smith", 2, 1),
       ("Linda", "Jones", 3, NULL),
       ("Mike", "Carlton", 4, 3),
       ("James", "Howzer", 5, NULL),
       ("Steven", "Gill", 6, 5),
       ("Jarod", "Steel", 7, 6);