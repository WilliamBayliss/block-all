require('dotenv').config('./.env')
const { MongoClient } = require('mongodb');
const puppeteer = require('puppeteer');

const twitterAccounts = {
    "TIDAL" : "https://twitter.com/TIDAL"
}


async function seedDB() {
    // TODO
    const url = process.env.MONGO_URL;
    const client = new MongoClient(url);
    try {
        await client.connect();
        console.log('Connected!');
        const accounts = client.db('blockAll').collection('accounts');
        accounts.drop();
        accountsToPush = [];
        for (let account in twitterAccounts) {

            let accountInDB = {
                name: account,
                twitterURL: twitterAccounts[account]
            }

            accountsToPush.push(accountInDB);
        }

        accounts.insertMany(accountsToPush)

        console.log("Database seeded!")

    } catch (e) {
        console.error(e);
    } finally {
       await client.close();
    }
}

seedDB();