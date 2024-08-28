# URLShortener JS
Hi, I'm a simple RESTful API for shortening URLs, builded in NodeJS and using PostgreSQL as database, Express for HTTP requests and pg-migrate for migrations.

## Getting Started

### Pre-requisites

```
Node version 20.11.0
Docker
```

All you will need to run me is configure a .env with the following informations:

```
DB_HOST=*the host of your database*
DB_PORT=*your database port*
DATABASE='urlShortener'
DB_USER=*your database user*
DB_PASSWORD=*the password of database user*
APP_NAME=*the name of the app*
BASE_URL=*the base url that the app will be running*
PORT=*the port that the application will run*
DATABASE_URL=*postgreSQL url*
```
PS: the values between asteriscs are custom.

After that, it'll be necessary run the following:
```
npm install
docker-compose up
```

On a new terminal, execute the following:
```
npm run migrate up
node index
```
And now your app will be running 🙏