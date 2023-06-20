# Evidence App - BE

Project still in progress... ⏲
BE part of application allows to:

* logging work hours and then downloading user csv file 📁 with counted hours per each day and grouped by project
* creating overall report per each user with logged hours and saving it in company google drive

## Used tech | libs
* Csv-writer
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
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URL=
```

1. In cmd you should login by command psql -U name_of_user using user that will be save in .env file as DATABASE_USER
2. Create a database table by command create database betsync_development (table and columns will be created after runing a server)
3. Create .env file in root directory
4. Based on .env.example add values to connect with DB

## Run Project

To run project in dev mode (after establish DB connection) + add google-api-key.json generated from google api console: 

> npm run start:dev

## Planned features
<img width="816" alt="image" src="https://github.com/Kinga-Jaworska/Evidence_BE/assets/67658221/f3a6b453-8be8-4dd7-a890-7a425177f694">

- [x] User Service (P3)
- [x] Task Service (P1)
- [ ] Notification Service (P4)
- [x] CSV Generator (P2)
- [ ] Request Service (-)
