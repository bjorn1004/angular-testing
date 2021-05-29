/* eslint-disable @typescript-eslint/naming-convention */
const NeoCities = require('neocities');
import * as https from 'https';
import { IncomingMessage } from 'http';
import * as fs from 'fs';
const login = require('./neologin.json');

interface NeoResponse {
	result: string;
	message: string;
}

interface BaseFile {
	path: string;
	updated_at: string;
}
interface File extends BaseFile {
	is_directory: false;
	size: number;
	sha1_hash: string;
}

interface Directory extends BaseFile {
	is_directory: true;
}

interface ListResponse {
	result: 'success' | 'error';
	files: (File | Directory)[];
}

type UploadFile = {
	name: string;
	path: string;
};

const api = new NeoCities(login.username, login.password);

const distFolder = 'dist/angular-app';

let files: string[];
let filesToUpload: UploadFile[];
fs.readdir(distFolder, { withFileTypes: true }, (err, _files) => {
	files = _files.filter((item) => !item.isDirectory()).map((item) => item.name);
	console.log(files);
	filesToUpload = ((): UploadFile[] => {
		const newCoreFiles: UploadFile[] = [];
		files.forEach((file) => {
			newCoreFiles.push({ name: file, path: `dist/angular-app/${file}` });
		});
		return newCoreFiles;
	})();
	console.log(filesToUpload);
});

const onRequestList = (res: IncomingMessage) => {
	let rawData = '';
	res.on('data', (d) => {
		rawData += d;
	});
	res.on('end', () => onListGet(rawData));
};

const onListGet = (rawData: string) => {
	const data = JSON.parse(rawData) as ListResponse;
	if (data.result !== 'success') {
		console.error('Error getting list from neocities');
	} else {
		console.log(data);
		const directories: string[] = data.files
			.filter((file) => file.is_directory)
			.map((directory) => directory.path) as string[];
		const coreFiles: string[] = data.files
			.filter((file) => !file.is_directory && !directories.some((directory) => file.path.startsWith(directory)))
			.map((file) => file.path)
			.filter((file) => file !== 'index.html');
		console.log('CORE FILES: ', coreFiles);

		const onDeletedFiles = (r: NeoResponse) => {
			console.log(r.message);
			console.log('Uploading new files...');
			api.upload(filesToUpload, (a: NeoResponse) => console.log(a.result));
		};
		console.log('Deleting old files...');
		api.delete(coreFiles, onDeletedFiles);
	}
};

console.log(`https://${login.username}:${login.password}@neocities.org/api/list`);
https.get(`https://${login.username}:${login.password}@neocities.org/api/list`, onRequestList);
