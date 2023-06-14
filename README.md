# Evidence App - BE

Project still in progress... ⏲
BE part of application allows to:

* logging work hours and then downloading user csv file 📁 with counted hours per each day and grouped by project
* creating overall report per each user with logged hours and saving it in company google drive

## Used tech | libs
* csv writer
* Google API (OAuth API + Drive)

## Requirements
 
* Nest JS (^16.0.0)
* Type ORM (^0.3)
* PG (^8.10.0)
* PostgreSQL (^14.0)

## DB Connection

Example of .env file

```
DB_HOST=
DB_PASSWORD=
DB_NAME=
DB_HOST=
DB_USER=
DB_PORT=
ENVIRONMENT=
```

1. In cmd you should login by command psql -U name_of_user using user that will be save in .env file as DATABASE_USER
2. Create a database table by command create database betsync_development (table and columns will be created after runing a server)
3. Create .env file in root directory
4. Based on .env.example add values to connect with DB

## Run Project

To run project in dev mode (after establish DB connection): 


> npm run start:dev

