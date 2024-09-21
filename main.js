(async () => {
	const $readDataBtn = document.querySelector("button");
	const $readDataInput = document.querySelector("input");

	$readDataBtn.addEventListener("click", () => {
		const table = $readDataInput.value;

		if (!table) {
			return;
		}

		dbWorker.postMessage({ action: "read", table });
	});

	const dbWorker = new Worker("db-worker.js");

	dbWorker.onmessage = event => {
		console.log("Received message from worker:", event.data);
	};

	dbWorker.postMessage({ action: "init" });
	dbWorker.postMessage({ action: "insert" });
})();
