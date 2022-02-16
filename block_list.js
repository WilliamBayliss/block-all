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

async function blockFromList() {
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

        await page.waitForNavigation();

        // Get list of twitter accounts from DB
        let accounts = await getAccountsToBlock();
        
        // Iterate over accounts, blocking each one
        for (let account of accounts) {
            try {
                const newPage = await browser.newPage();
                await newPage.goto(account.twitterURL);
                console.log(`Blocking ${account.name}...`)
                console.log(`${account.twitterURL}`)
                
                let threeDotsButton = 'div[data-testid="userActions"]';
                await newPage.waitForSelector(threeDotsButton);
                // Check whether 'Unblock' button is present
                if (await newPage.$('div[data-testid$="-unblock"]') == null) {
                    // Block account
                    await newPage.click(threeDotsButton);
                    await newPage.waitForSelector('div[data-testid="block"]');
                    await newPage.click('div[data-testid="block"]');
                    await newPage.waitForSelector('div[data-testid="confirmationSheetDialog"]')
                    await newPage.click('div[data-testid="confirmationSheetConfirm"]')
                    console.log('Success!')
                } else {
                    // If unblock present account is already blocked
                    console.log(`${account.name} is already blocked.`)
                }
                
                await newPage.close();
                } catch(error) {
                    console.log(error);
                }
            }


    } catch (e) {
        console.log(e);
    } finally {
        browser.close();
    }
}

blockFromList();