
## Setup API Backend and Database  
Setup local dev environment and run the backend. Tested with 

```bash
Docker version 20.10.8, build 3967b7d

node  v14.15.1

npm 6.14.11

npx 6.14.11

nest 8.1.4

```

http://localhost:3001/v1/challenge

## Step1: Setup database 
simple docker-compose up  in ../database see [REDAME.md](../database/README.md) 

## Step2 : Install all packages 

```bash
$ npm install
```

## Step 3: Running the app

```bash
# setup your local environment 
$ cp .env.sample .env

# migrations and seed database 
$ npm run db:migrate
$ npm run db:seed 

# run your local api backend 
$ npm run start:dev


# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Step 4: Test the app

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run seed (if not done)
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Todo 
- discover in code or refer to http://localhost:3001/v1/challenge

## Support and Nest Documentation

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).


## License

Nest is [MIT licensed](LICENSE).
