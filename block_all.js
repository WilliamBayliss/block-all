require('dotenv').config('./.env');
const puppeteer = require('puppeteer');
const { MongoClient } = require('mongodb');

async function getAccountsToBlock() {
    const url = process.env.MONGO_URL
    const client = new MongoClient(url);
    let accounts
    try {
        await client.connect();
        console.log("Connected!");
        accounts = await client.db('blockAll').collection('accounts').find({}).toArray();

    } catch (e) {
        console.log(e);

    } finally {
        await client.close();
    }
    return accounts
}

async function blockAll() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    let twitterAccount = {
        email: process.env.TWITTER_EMAIL,
        username: process.env.TWITTER_USERNAME,
        password: process.env.TWITTER_PASSWORD
    };
    try {
        // Navigate to login page
        await page.goto('https://twitter.com/i/flow/login');
        // Select username field, type username and press enter
        await page.waitForSelector('input[name=username]');
        await page.focus('input[name=username]');
        await page.keyboard.type(twitterAccount.username);
        await page.keyboard.press('Enter');
        try {

            // Select password field, type password and press enter
            await page.waitForSelector('input[name="password"]');
            await page.focus('input[name="password"]');
            await page.keyboard.type(twitterAccount.password);
            await page.keyboard.press('Enter');
        } catch (e) {
            console.log(e)
            // TODO: if password field doesn't come up twitter is likely prompting for another piece of user info
            // So check for another input field for email and fill that out if it comes up
        }

        await page.waitForNavigation();

        // Get list of twitter accounts from DB
        let accounts = await getAccountsToBlock();
        
        // Iterate over accounts, blocking each one
        for (let account of accounts) {
            await page.goto(account.twitterURL);
            await page.waitForNavigation();

        }


    } catch (e) {
        console.log(e);
    } finally {
        browser.close();
    }
}

blockAll();