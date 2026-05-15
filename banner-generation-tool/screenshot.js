const path = require("path");
const { pathToFileURL } = require("url");
const { chromium } = require("playwright");

const shots = [
    {
        file: "linkedin-banner.html",
        output: "../assets/linkedin-banner.png",
        viewport: { width: 1584, height: 396 }
    },
    {
        file: "social-preview.html",
        output: "../assets/social-preview.png",
        viewport: { width: 1200, height: 630 }
    }
];

(async () => {
    const browser = await chromium.launch();

    for (const shot of shots) {
        const page = await browser.newPage({
            viewport: shot.viewport,
            deviceScaleFactor: 2
        });

        const filePath = path.resolve(__dirname, shot.file);
        await page.goto(pathToFileURL(filePath).href, { waitUntil: "networkidle" });
        await page.screenshot({
            path: path.resolve(__dirname, shot.output),
            fullPage: false
        });

        await page.close();
    }

    await browser.close();
})();