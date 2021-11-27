This is a simple automation script that will get a list of twitter accounts from a database and block them all in the browser!

Credentials for seeding and fetching data from the DB, and for Twitter login are stored in the .env file.
 - seed_db.js will seed a database with a list of twitter accounts with a name and twitterURL value, it needs write permissions so continue to need .env variables to use the mongoDB
 - block_all.js needs write only so I will be looking at adding credentials for a read-only account to it so that it will work without needing to seed your own database, although if you wish to do so seed_db.js will do that for you after setup.

 Twitter login credentials are also stored in the .env file. The script will log into your account, grab the list of accounts to block from the database and go through and block each one. It will check if an account is already blocked to avoid unblocking any accounts.

 I built this script mostly to block companies that serve me adds on twitter as a little experiment to learn browser automation with puppeteer and interacting with a database in JS.