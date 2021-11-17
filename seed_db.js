require('dotenv').config('./.env')
const { MongoClient } = require('mongodb');
const puppeteer = require('puppeteer');

async function main() {
    // TODO
    const url = process.env.MONGO_URL;

    const client = new MongoClient(url);
    console.log("Connected!");
    try {
        await client.connect();
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);