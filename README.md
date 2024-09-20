# Multi-directory S3 Upload - Efficiently Upload Files from Directories to S3 Buckets

This project is a simple tool for uploading multiple files from a directory to an S3 bucket. It supports maintaining the directory structure during the upload and allows progress monitoring for each file.

## Features

- Upload multiple files from a directory to an S3 bucket.
- Progress monitoring during file upload.
- Retains directory structure in the bucket.
- Activity and error logs for tracking.

## Requirements

- Node.js v14+
- Yarn (or npm)
- S3 bucket access credentials

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/jefremassingue/multi-directory-s3-upload.git
   cd multi-directory-s3-upload
   ```

2. Install project dependencies:

   ```bash
   yarn install
   ```

3. Configure the environment variables in the `.env` file. An example is provided in `.env.example`:

   ```
   S3_ENDPOINT=your-s3-endpoint
   S3_ACCESS_KEY=your-access-key
   S3_SECRET_KEY=your-secret-key
   BUCKET_NAME=your-bucket-name
   DIRECTORY_PATH=path-to-your-directory
   ```

4. Run the upload command:

   ```bash
   yarn upload
   ```

## Logs

- **logs.txt**: Stores success logs and general information.
- **error_logs.txt**: Stores error logs and upload failures.

Log files are automatically generated in the root directory of the project.

## Contribution

Feel free to contribute improvements or bug fixes. To get started:

1. Fork the project.
2. Create a new branch for your feature/fix: `git checkout -b my-feature`.
3. Commit your changes: `git commit -m 'Add my feature'`.
4. Push your changes: `git push origin my-feature`.
5. Open a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Author

**Jefre Massingue**  
[jefre.dev@gmail.com](mailto:jefre.dev@gmail.com)
