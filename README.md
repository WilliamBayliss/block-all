This is a simple automation script that will get a list of twitter accounts from a database and block them all in the browser!

Credentials for seeding and fetching data from the DB, and for Twitter login are stored in the .env file.
 - block_list.js pulls a list of accounts from a database, logs into your twitter account and will go through the list and block each account. If the account is already blocked it will simply skip over it.
 - update_list.js will log into your twitter account and scrape your feed for promoted tweets. It will get the name and twitter url of 10 accounts advertising to you at a time and add them to the database.

 this way you can run update_list.js > block_list.js as you would like to gradually block accounts that are advertising on twitter. Feel free to adjust the # of accounts collected. I set it to 10 because after a while twitter will stop loading additional tweets if you have autoscrolled far enough. 

 Twitter login credentials are also stored in the .env file. The script will log into your account, grab the list of accounts to block from the database and go through and block each one. It will check if an account is already blocked to avoid unblocking any accounts.

 I built this script mostly to block companies that serve me adds on twitter as a little experiment to learn browser automation with puppeteer and interacting with a database in JS. Learned a lot about web scraping, passing information between the execution context in the browser and the node environment contect, and manipulating DOM properties with Puppeteer.