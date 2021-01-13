# Table of Contents
- [Project Setup (Continued)](#Project-Setup-(Continued))
  - [Setting Up the MySQL Database](##Setting-Up-the-MySQL-Database)
  - [Running the Back-End](##Running-the-Back-End)


# Project Setup (Continued)
## Setting Up the MySQL Database
Assuming that your MySQL instance is configured with user "root" and password "password", then just run the following script:
```
yarn create-affordable-database
```

This script takes all of the `.sql` files found in the `database` folder of the root directory and sets up the Affordable database.

Note: it is important that the server and the database are running in the same timezones. If you are running them on the same machine, ensure that your mysql `@@GLOBAL.time_zone` and `@@SESSION.time_zone` are set to `'SYSTEM'`.

## Set up environment variables
In order for AFFORDABLE to connect to MySQL (and other services in the future), you must define how to connect to the services by creating `.env` file in the `server` folder. For developer instances where you're running MySQL locally, using the root account with the password `password`, you can typically use the values below. Otherwise, change the values to be appropriate for your environment.

`.env`:
```
AFFORDABLE_DB_HOST=localhost
AFFORDABLE_DB_USER=root
AFFORDABLE_DB_PASSWORD=password
AFFORDABLE_DB_NAME=Affordable
AFFORDABLE_SES_KEY_ID=<yourAwsSesKey>
AFFORDABLE_SES_KEY_SECRET=<yourAwsSesSecret>
AFFORDABLE_SES_REGION=<yourAwsSesRegion>
AFFORDABLE_EMAIL_ENABLED=true
AFFORDABLE_FRONTEND_URL=http://localhost:3000
AFFORDABLE_BACKEND_URL=http://localhost:4000
AFFORDABLE_ADMIN_USER=admin
AFFORDABLE_ADMIN_PASSWORD=password
AFFORDABLE_ADMIN_EMAIL=admin@affordhealth.org
AFFORDABLE_ADMIN_ID=1
AFFORDABLE_TOKEN_SIGNING_KEY=secret
```

## Running the Back-End
Assuming that the Affordable database has been set up (instructions [above](##Setting-Up-the-MySQL-Database)) correctly, download the necessary dependencies by running:
```
yarn global add typescript
yarn install
```
Once the dependencies have been downloaded, run the following command to get the back-end started:
```
yarn compile
yarn start
```
The back-end should be up and running at this point (indicated by a message saying "Back-end is up and running!")