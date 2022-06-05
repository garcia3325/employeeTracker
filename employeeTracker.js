const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "password",
	database: "employee_DB",
	multipleStatements: true,
});
connection.connect(function (err) {
	if (err) throw err;
	start();
});

function start() {
	inquirer
		.prompt({
			name: "menu",
			type: "list",
			message: "What action would you like to take",
			choices: [
				"View Departments",
				"View roles",
				"View employees",
				"Add Department",
				"Add role",
				"Add employee",
				"Update employee roles",
				"Exit",
			],
		})
		.then(function (answer) {
			switch (answer.menu) {
				case "View Departments":
					viewDepartments();
					break;
				case "View roles":
					viewRoles();
					break;
				case "View employees":
					viewEmployees();
					break;
				case "Add Department":
					addDepartment();
					break;
				case "Add role":
					addRole();
					break;
				case "Add employee":
					addEmployees();
					break;
				case "Update employee roles":
					updateEmpRole();
					break;
				case "Exit":
					connection.end();
					break;
				default:
					break;
			}
		});
}

function viewDepartments() {
	connection.query(
		"SELECT name as Departments FROM employee_DB.department;",
		function (error, results, fields) {
			if (error) throw error;
			console.table(results);
			start();
		}
	);
}

function viewRoles() {
	connection.query(
		"SELECT title as Role,salary as Salary,b.name as Department FROM role a left join department b on a.department_id = b.id ;",
		function (error, results, fields) {
			if (error) throw error;
			console.table(results);
			start();
		}
	);
}

function viewEmployees() {
	connection.query(
		"SELECT concat(a.first_name,' ',a.last_name) as 'Employee Name', b.title as Title, IFNULL(concat(c.first_name,' ',c.last_name),'') as 'Manager Name' FROM employee a left join role b on a.role_id = b.id left join employee c  on a.manager_id = c.id;",
		function (error, results, fields) {
			if (error) throw error;
			console.table(results);
			start();
		}
	);
}

function addDepartment() {
	inquirer
		.prompt({
			name: "departmentName",
			type: "input",
			message: "What is the Department name you would like to add?",
		})
		.then(function (answer) {
			connection.query(
				"INSERT INTO `employee_DB`.`department`(`name`)VALUES(?);",
				[answer.departmentName],
				function (error, results, fields) {
					if (error) throw error;
					console.log(
						"Successfully Added: " + [answer.departmentName] + " To: "
					);
					viewDepartments();
				}
			);
		});
}

function addRole() {
	connection.query("SELECT * FROM employee_DB.department;", function (
		error,
		results,
		fields
	) {
		
		if (error) throw error;
		let depArray = results.map((obj) => {
			return { name: obj.name, value: obj };
		});
		inquirer
			.prompt([
				{
					name: "title",
					type: "input",
					message: "What is the role's Title ?",
				},
				{
					name: "salary",
					type: "input",
					message: "What is the role's salary ?",
				},
				{
					name: "department",
					type: "list",
					message: "Which department does this role belong to ?",
					choices: depArray,
				},
			])
			.then(function (answer) {
				connection.query(
					"INSERT INTO `employee_DB`.`role`(`title`,`salary`,`department_id`)VALUES(?,?,?);",
					[
						answer.title,
						Math.floor(parseInt(answer.salary)),
						answer.department.id,
					],
					function (error, results, fields) {
						if (error) throw error;
						console.log(
							"Successfully Added: " +
								answer.title +
								" with a salary of " +
								answer.salary +
								" within the " +
								answer.department.name +
								" Department To: "
						);
						viewRoles();
					}
				);
			});
	});
}

function addEmployees() {
	connection.query(
		'SELECT id,title FROM employee_DB.role; SELECT id, concat(first_name," ",last_name) as manager FROM  employee_DB.employee;',
		function (error, results, fields) {
			if (error) throw error;
			let rolesArray = results[0].map((obj) => {
				return { name: obj.title, value: obj };
			});
			let managersArray = results[1].map((obj) => {
				return { name: obj.manager, value: obj };
			});
			inquirer
				.prompt([
					{
						name: "firstname",
						type: "input",
						message: "Employee's First Name ?",
					},
					{
						name: "lastname",
						type: "input",
						message: "Employee's Last Name ?",
					},
					{
						name: "manager",
						type: "list",
						message: "What is the Employee's Manager?",
						choices: managersArray,
					},
					{
						name: "role",
						type: "list",
						message: "What is the Employee's Role ?",
						choices: rolesArray,
					},
				])
				.then(function (answer) {
					connection.query(
						"INSERT INTO `employee_DB`.`employee`(`first_name`,`last_name`,`manager_id`,`role_id`)VALUES(?,?,?,?);",
						[
							answer.firstname,
							answer.lastname,
							answer.manager.id,
							answer.role.id,
						],
						function (error, results, fields) {
							if (error) throw error;
							console.log(
								"Successfully Added: " +
									answer.firstname +
									" " +
									answer.lastname +
									" reporting to  " +
									answer.manager +
									" as a " +
									answer.role +
									" To: "
							);
							viewEmployees();
						}
					);
				});
		}
	);
}

function updateEmpRole() {
	connection.query(
		'SELECT id,concat(first_name," ",last_name) as employeeName FROM employee_DB.employee; SELECT id,title FROM employee_DB.role;',
		function (error, results, fields) {
			if (error) throw error;
			let empArray = results[0].map((obj) => {
				return { name: obj.employeeName, value: obj };
			});
			let rolesArray = results[1].map((obj) => {
				return { name: obj.title, value: obj };
			});
			inquirer
				.prompt([
					{
						name: "selectedEmployee",
						type: "list",
						message: "Which Employee's role would you like to update ?",
						choices: empArray,
					},
					{
						name: "selectedRole",
						type: "list",
						message: "What is their new role ?",
						choices: rolesArray,
					},
				])
				.then(function (answer) {
					connection.query(
						"UPDATE `employee_DB`.`employee`SET `role_id` = ? WHERE `id` = ?;",
						[answer.selectedRole.id, answer.selectedEmployee.id],
						function (error, results, fields) {
							if (error) throw error;
							console.log(
								"Successfully Updated: " +
									answer.selectedEmployee.name +
									" role to " +
									answer.selectedRole.name
							);
							viewEmployees();
						}
					);
				});
		}
	);
}