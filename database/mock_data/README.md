# Mock Data
This file should explain how to import the mock data into the AFFORDABLE database. 

## ***Note that this will erase any and all table rows from 1-1000ish (some tables get more than 1000 rows added) for the affected tables

##
First navigate to the mock_data folder in the terminal window and then,
run these commands in the terminal to import the data:

```
mysql -u root -p
(Then Enter your password)
source AddMockData.sql
quit
```

