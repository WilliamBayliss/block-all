require('dotenv').config('./.env');
const puppeteer = require('puppeteer');
const { MongoClient } = require('mongodb');

async function addAccountsToDB(twitterAccounts) {
    // Set url and create mongoDB client
    const url = process.env.MONGO_URL;
    const client = new MongoClient(url);
    try {
        // Connect to db
        await client.connect();
        console.log('Connected to MongoDB!');
        
        // Push all created account objects to the database
        await accounts.insertMany(twitterAccounts)

        console.log("Database seeded!")

    } catch (e) {
        console.error(e);
    } finally {
        client.close();
    }
}

async function scrapePromotedAccounts() {



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
            // Twitter has more than one login landing screen for username and the input fields have different names, 
            // need to do more testing and potentially evaluate which screen has been served to avoid bugs
            await page.waitForSelector('input[name="text"]');
            await page.focus('input[name="text"]')
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
        console.log("Login Success");

        // TODO MAIN
        await page.waitForSelector('article[data-testid="tweet"]');
        console.log("Tweets Exist")
        // Get Array of tweet divs
        // Check if each tweet is promoted
            // Get href for username
            // Add to DB
        console.log(tweets);
        // addAccountsToDB(twitterAccounts);


    } catch {
        // TODO Login failure handling
    } finally {
        console.log("Terminating")
        // browser.close();
    }
}

scrapePromotedAccounts();

