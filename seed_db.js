require('dotenv').config('./.env')
const { MongoClient } = require('mongodb');
const puppeteer = require('puppeteer');

const twitterAccounts = {
    "TIDAL" : "https://twitter.com/TIDAL",
    "DUOLINGO" : "https://twitter.com/duolingo",
    "FACEBOOK" : "https://twitter.com/Facebook",
    "FORD" : "https://twitter.com/Ford",
    "TESLA" : "https://twitter.com/Tesla"
}


async function seedDB() {
    // Set url and create mongoDB client
    const url = process.env.MONGO_URL;
    const client = new MongoClient(url);
    try {
        // Connect to db
        await client.connect();
        console.log('Connected!');
        // get collection from mongo
        const accounts = client.db('blockAll').collection('accounts');
        // empty collection
        accounts.drop();
        
        // Create an object for each key/value pair in twitterAccounts
        accountsToPush = [];
        for (let account in twitterAccounts) {

            let accountInDB = {
                name: account,
                twitterURL: twitterAccounts[account]
            }
            // add object to array
            accountsToPush.push(accountInDB);
        }
        // Push all created account objects to the database
        accounts.insertMany(accountsToPush)

        console.log("Database seeded!")

    } catch (e) {
        console.error(e);
    } finally {
       await client.close();
    }
}

seedDB();