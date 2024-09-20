const fs = require('fs');
const path = require('path');
const axios = require('axios');
const AWS = require('aws-sdk');
require('dotenv').config();

const s3 = new AWS.S3({
    endpoint: process.env.S3_ENDPOINT,
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    s3ForcePathStyle: true,
    signatureVersion: 'v4'
});

// Define log file paths
const logFilePath = path.join(__dirname, 'logs.txt');
const errorLogFilePath = path.join(__dirname, 'error_logs.txt');

// Function to write to log file
const writeLog = (message) => {
    fs.appendFileSync(logFilePath, `${new Date().toISOString()} - ${message}\n`);
};

// Function to write to error log file
const writeErrorLog = (message) => {
    fs.appendFileSync(errorLogFilePath, `${new Date().toISOString()} - ${message}\n`);
};

// Function to upload file content to S3 Bucket
const upload = (fileContent, bucketName, key) => {
    const params = {
        Bucket: bucketName,
        Key: key,
        Body: fileContent
    };

    s3.upload(params).on('httpUploadProgress', (progress) => {
        const progressLogMessage = `Uploading ${key} - ${progress.loaded} of ${progress.total} bytes`;
        console.log(progressLogMessage);
    }).send((err, data) => {
        if (err) {
            const errorLogMessage = `Error uploading ${key}: ${err}`;
            console.log(errorLogMessage);
            writeLog(errorLogMessage);
            writeErrorLog(errorLogMessage);
        } else {
            const successLogMessage = `Successfully uploaded ${key} to ${data.Location}`;
            console.log(successLogMessage);
            writeLog(successLogMessage);
        }
    });
};

// Function to get file content from URL
const getFileContentFromUrl = async (url) => {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        return Buffer.from(response.data, 'binary');
    } catch (err) {
        console.error(`Error fetching file from ${url}: ${err.message}`);
        throw err;
    }
};

// Function to upload file from URL to S3 Bucket
const uploadFromUrl = async (url, bucketName, key) => {
    try {
        const fileContent = await getFileContentFromUrl(url);
        upload(fileContent, bucketName, key);
    } catch (err) {
        // Error handling is already done in getFileContentFromUrl
    }
};

// Function to get file content
const getFileContent = (filePath) => {
    try {
        return fs.readFileSync(filePath);
    } catch (err) {
        console.error(`Error reading file ${filePath}: ${err}`);
        throw err;
    }
};

// Function to upload single file to S3 Bucket
const uploadSingleFile = (filePath, bucketName, key) => {
    try {
        const fileContent = getFileContent(filePath);
        upload(fileContent, bucketName, key);
    } catch (err) {
        // Error handling is already done in getFileContent
    }
};

// Function to recursively get all files in a directory
const getFiles = (dir, files_) => {
    files_ = files_ || [];
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getFiles(filePath, files_);
        } else {
            files_.push(filePath);
            console.log(`Found file: ${filePath}`);
        }
    }
    return files_;
};

// Function to upload directory to S3 Bucket
const uploadDirectory = (directory, bucketName) => {
    console.log(`Scanning directory: ${directory}`);
    const files = getFiles(directory);
    console.log(`Total files found: ${files.length}`);

    files.forEach((file) => {
        try {
            const fileContent = getFileContent(file);
            const key = path.relative(directory, file); // This keeps the directory structure in the key
            console.log(`Uploading ${file}`);
            upload(fileContent, bucketName, key);
        } catch (err) {
            // Error handling is already done in getFileContent
            const errorLogMessage = `Error uploading ${file}: ${err}`;
            console.log(errorLogMessage);
            writeLog(errorLogMessage);
            writeErrorLog(errorLogMessage);
        }
    });
};

// Main function
const main = async () => {
    const directoryPath = process.env.DIRECTORY_PATH;
    const bucketName = process.env.BUCKET_NAME;
console.log('====================================');
console.log(directoryPath);
console.log('====================================');
    uploadDirectory(directoryPath, bucketName);
};

main();