# Affordable Client Calls for Admin Users
*The goal of this document is to outline the process for interacting with the AFFORDABLE server as an admin without a User Interface. While a proper admin user interface is encouraged moving forward in development, currently an admin can interact with Affordable using the simple scripts located in this folder. Likewise, if there are any future issues or bugs with the Affordable frontend that arise after deployment, these scripts allow admins to provide a quick fix to users as a solution is developed.*

__DO NOT SHARE THIS DOCUMENT, OR ANY OF THE SCRIPTS IN THIS FOLDER, WITH USERS WHO ARE NOT PART OF THE AFFORDABLE TEAM__

## To Run
### ts-node
All of the scripts in this folder are run using ts-node, allowing them to be run from the command line. The ts-node dependency has already been added to the client's json package. The script to run ts-node can also be found here:
```
"ts-node": "ts-node --dir ./src/admin_examples"
```
Modify this field in package.json to suit your needs.

### Prerequisites 
There are a couple of housekeeping items to do before these scripts can be run effectively in the AFFORDABLE platform. These steps include:
1. __Changing the base url__. These scripts use the AffordableAdminClient class, and the base url this class calls will need to change to fit your development/production environment. This can be done in either:
    - The default value of the AffordableClient's `getBaseUrl()` method.
    - Set using the AffordableClient's `setBaseUrl()` upon compilation/build. 
2. __Build and compile the code__. Make sure the codebase is built and compiled. Primarily the core, client, and server folders should all be built and compiled.
3. __Run the server__. The admin scripts will be making calls to the server. Make sure this server is running and has an established connection to the database.
4. __Edit the scripts__. The data used in the scripts currently is example data used to show what kind of input each method of the AffordableClient needs. Please make sure this data is updated to the proper data you want to use before calling the method. (For example, when verifying a user's email, make sure that that you are inputing data for an existing user and you put in data for the user you want to verify).

### Run Command
To run any of these scripts, please enter the following in the command line:
```
yarn ts-node ~\script.ts
```
__NOTE:__ The the path to the script is depended on where you are located in the AFFORDABLE codebase