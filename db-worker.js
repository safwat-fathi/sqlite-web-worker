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
	} catch (error) {
		console.error(error);
	}
};
