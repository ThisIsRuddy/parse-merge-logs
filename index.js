const _ = require("lodash");
const fs = require("fs");
const readline = require("readline");
const async = require("async");
const Stream = require("stream");

const LOGS_DIR = "./logs";
const OUTPUT_DIR = "./output";

processDirectory("2018-12-20");

function processDirectory(resultFileName) {
	const files = fs.readdirSync(LOGS_DIR);

	async.map(
		files,
		(file, callback) => {
			processFile(`${LOGS_DIR}/${file}`, callback);
		},
		(err, output) => {
			if (err) return console.error(err);
			const outputFileName = `${OUTPUT_DIR}/${resultFileName}.txt`;
			const results = [].concat.apply([], output);
			const writeStream = fs.createWriteStream(outputFileName);
			async.each(results, value => writeStream.write(`${value}\n`));
			console.log(
				`Finished! - Lines parsed: '${
					results.length
				}', Output stored: 'outputFileName'.`
			);
		}
	);
}

function processFile(inputFile, callback) {
	let instream = fs.createReadStream(inputFile);
	let outstream = new Stream();
	let rl = readline.createInterface(instream, outstream);
	let lines = [];
	let counter = 0;

	rl.on("line", line => {
		counter++;
		if (counter > 4) return lines.push(line);
	});

	rl.on("close", () => callback(null, lines));
}
