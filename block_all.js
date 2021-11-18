require('dotenv').config('./.env');
const puppeteer = require('puppeteer');
const { MongoClient } = require('mongodb');

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
        }

        await page.waitForNavigation();

    } catch (e) {
        console.log(e);
    } finally {
        browser.close();
    }
}

blockAll();