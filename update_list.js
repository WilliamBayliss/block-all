require('dotenv').config('./.env');
const puppeteer = require('puppeteer');
const { scrollPageToBottom } = require('puppeteer-autoscroll-down')
const { MongoClient } = require('mongodb');


async function addAccountsToDB(twitterAccounts) {
    // Set url and create mongoDB client
    const url = process.env.MONGO_URL;
    const client = new MongoClient(url);
    try {
        // Connect to db
        console.log("Connecting to MongoDB...")
        await client.connect();
        console.log('Connected!');
        console.log("Inserting accounts...")

        const accounts = client.db('blockAll').collection('accounts');
        // Push all created account objects to the database
        await accounts.insertMany(twitterAccounts)
        console.log("Accounts added to database!")
    } catch (e) {
        console.error(e);
    } finally {
        client.close();
    }
}

async function scrapePromotedAccounts(page) {
    let promotedAccounts = [];
    // await page.reload();
    // Scroll down to load more tweets
    await page.waitForSelector('article[data-testid="tweet"]');
    // Get Array of tweet divs
    while (promotedAccounts.length <= 10) {
        let scrapedAccounts = await page.evaluate( () => {
            let array = [];
            let timeline = document.querySelector('div[aria-label="Timeline: Your Home Timeline"]');
            let tweets = timeline.querySelectorAll('div[data-testid="placementTracking"]');
            for (let tweet of tweets) {
                if (tweet.textContent.endsWith("Promoted")) {
                    let tweetContent = tweet.innerText.split(/\r?\n/);
                    let accountName = tweetContent[0];
                    let handle = tweetContent[1];
                    let name = handle.substring(1);
                    let accountURL = `https://twitter.com/${name}`
                    let accountDetails = {
                        name: accountName,
                        twitterURL: accountURL
                    }
                    if (array.some(account => account["name"] == accountDetails["name"]) == false) {
                        array.push(accountDetails)       
                    }
                }
            }
            return array
        });
        // console.log(scrapedAccounts)
        for (let accountDetails of scrapedAccounts) {
            if (promotedAccounts.some(account => account["name"] == accountDetails["name"]) == false) {
                promotedAccounts.push(accountDetails)
                console.log(accountDetails)
            }
        }
        await scrollPageToBottom(page, {size: 100, delay: 100, stepsLimit: 1})
    };
    return promotedAccounts;
}

async function update_list() {

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
        // Wait for page to finish loading
        await page.waitForSelector('article[data-testid="tweet"]');
        console.log("Scraping Promoted Tweets...")
        let promotedAccounts = await scrapePromotedAccounts(page);
        console.log("Pushing accounts to DB...")
        await addAccountsToDB(promotedAccounts);
    } catch {
        // TODO Login failure handling
    } finally {
        console.log("All done! Have a nice day =)")
        browser.close();
    }
}

update_list();

