"use strict";
exports.__esModule = true;
/* eslint-disable @typescript-eslint/naming-convention */
var NeoCities = require('neocities');
var https = require("https");
var fs = require("fs");
var login = require('./neologin.json');
var api = new NeoCities(login.username, login.password);
var distFolder = 'dist/angular-app';
var files;
var filesToUpload;
fs.readdir(distFolder, { withFileTypes: true }, function (err, _files) {
    files = _files.filter(function (item) { return !item.isDirectory(); }).map(function (item) { return item.name; });
    console.log(files);
    filesToUpload = (function () {
        var newCoreFiles = [];
        files.forEach(function (file) {
            newCoreFiles.push({ name: file, path: "dist/angular-app/" + file });
        });
        return newCoreFiles;
    })();
    console.log(filesToUpload);
});
var onRequestList = function (res) {
    var rawData = '';
    res.on('data', function (d) {
        rawData += d;
    });
    res.on('end', function () { return onListGet(rawData); });
};
var onListGet = function (rawData) {
    var data = JSON.parse(rawData);
    if (data.result !== 'success') {
        console.error('Error getting list from neocities');
    }
    else {
        console.log(data);
        var directories_1 = data.files
            .filter(function (file) { return file.is_directory; })
            .map(function (directory) { return directory.path; });
        var coreFiles = data.files
            .filter(function (file) { return !file.is_directory && !directories_1.some(function (directory) { return file.path.startsWith(directory); }); })
            .map(function (file) { return file.path; })
            .filter(function (file) { return file !== 'index.html'; });
        console.log('CORE FILES: ', coreFiles);
        var onDeletedFiles = function (r) {
            console.log(r.message);
            console.log('Uploading new files...');
            api.upload(filesToUpload, function (a) { return console.log(a.result); });
        };
        console.log('Deleting old files...');
        api["delete"](coreFiles, onDeletedFiles);
    }
};
console.log("https://" + login.username + ":" + login.password + "@neocities.org/api/list");
https.get("https://" + login.username + ":" + login.password + "@neocities.org/api/list", onRequestList);
