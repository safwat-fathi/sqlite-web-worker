// self.importScripts("https://cdn.jsdelivr.net/npm/sql.js@1.8.0/dist/sql-wasm.js");
self.importScripts("sql-wasm.js");

let db = null; // This will hold the reference to the in-memory database

// Initialize the SQLite DB
async function initDB() {
	const SQL = await initSqlJs({
		locateFile: fileName => `${fileName}`,
	});

	if (!db) {
		db = new SQL.Database(); // Create a new in-memory SQLite database
	}

	return db;
}

function insert() {
	db.run("INSERT INTO users (id, name, age) VALUES (?,?,?)", [1, "Sami", 33]);
	db.run("INSERT INTO users (id, name, age) VALUES (?,?,?)", [2, "Ahmed", 23]);

	db.run("INSERT INTO users (id, name, age) VALUES (?,?,?)", [3, "Ali", 28]);
}

function read(table) {
	let data = [];

	db.each(`SELECT * FROM ${table}`, function (row) {
		data.push(row);
	});

	return data;
}

self.onmessage = async function (event) {
	try {
		const { action, table } = event.data;

		console.log("message from main:", event.data);

		await initDB();

		if (action === "init") {
			db.run("CREATE TABLE IF NOT EXISTS users (id unique, name, age)");
		}

		if (action === "read") {
			const data = read(table);
			self.postMessage(data);
		}

		if (action === "insert") {
			insert();
		}
		// if (event.data === "select") {
		// 	select();
		// }
		// if (event.data === "delete") {
		// 	deleteData();
		// }
		// if (event.data === "update") {
		// 	update();
		// }
		// if (event.data === "close") {
		// 	close();
		// }
		// function init() {
		// 	const db = openDatabase("mydb", "1.0", "Test DB", 2 * 1024 * 1024);
		// 	db.transaction(function (tx) {
		// 		tx.executeSql(
		// 			"CREATE TABLE IF NOT EXISTS users (id unique, name, age)"
		// 		);
		// 	});
		// }
		// function insert() {
		// 	const db = openDatabase("mydb", "1.0", "Test DB", 2 * 1024 * 1024);
		// 	db.transaction(function (tx) {
		// 		tx.executeSql("INSERT INTO users (id, name, age) VALUES (?,?,?)", [
		// 			1,
		// 			"Ahmed",
		// 			23,
		// 		]);
		// 		tx.executeSql("INSERT INTO users (id, name, age) VALUES (?,?,?)", [
		// 			2,
		// 			"Ahmed",
		// 			23,
		// 		]);
		// 		tx.executeSql("INSERT INTO users (id, name, age) VALUES (?,?,?)", [
		// 			3,
		// 			"Ahmed",
		// 			23,
		// 		]);
		// 		tx.executeSql("INSERT INTO users (id, name, age) VALUES (?,?,?)", [
		// 			4,
		// 			"Ahmed",
		// 			23,
		// 		]);
		// 	});
		// }
		// function select() {
		// 	const db = openDatabase("mydb", "1.0", "Test DB", 2 * 1024 * 1024);
		// 	db.transaction(function (tx) {
		// 		tx.executeSql("SELECT * FROM users", [], function (tx, results) {
		// 			var len = results.rows.length,
		// 				i;
		// 			for (i = 0; i < len; i++) {
		// 				console.log("id: " + results.rows.item(i).id);
		// 				console.log("name: " + results.rows.item(i).name);
		// 				console.log("age: " + results.rows.item(i).age);
		// 			}
		// 		});
		// 	});
		// }
		// function deleteData() {
		// 	const db = openDatabase("mydb", "1.0", "Test DB", 2 * 1024 * 1024);
		// 	db.transaction(function (tx) {
		// 		tx.executeSql("DELETE FROM users");
		// 	});
		// }
		// function update() {
		// 	const db = openDatabase("mydb", "1.0", "Test DB", 2 * 1024 * 1024);
		// 	db.transaction(function (tx) {
		// 		tx.executeSql("UPDATE users SET name = ? WHERE id = ?", ["Ahmed", 1]);
		// 	});
		// }
		// function close() {
		// 	const db = openDatabase("mydb", "1.0", "Test DB", 2 * 1024 * 1024);
		// 	db.close();
		// }
	} catch (error) {
		console.error(error);
	}
};
