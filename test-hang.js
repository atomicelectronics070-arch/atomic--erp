const { chromium } = require('playwright');
const { PrismaClient } = require('@prisma/client');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function test() {
    try {
        console.log(`Testing Playwright launch with path: ${CHROME_PATH}...`);
        const browser = await chromium.launch({ 
            headless: true,
            executablePath: CHROME_PATH
        });
        console.log("Playwright launch success!");
        await browser.close();
        
        console.log("Testing Prisma connection...");
        const prisma = new PrismaClient();
        const count = await prisma.category.count();
        console.log(`Prisma query success! Category count: ${count}`);
        await prisma.$disconnect();
    } catch(e) {
        console.error(e);
    }
}
test();
