const puppeteer = require("puppeteer")
const fs = require("fs/promises")



async function start () {

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: false,
        userDataDir: './tmp'
    })
    const page = await browser.newPage()

    await page.goto("https://learnwebcode.github.io/practice-requests/")

   // await page.screenshot({ path:'kizo.png' })

   const names = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("h2 > a > span")).map(x => x.textContent)
   })

   //await fs.writeFile("names.txt", names.join("\r\n"))


   await page.click("#clickme")
   const clickeddata = await page.$eval("#data", el => el.textContent)
  // console.log(clickeddata);

   const photos = await page.$$eval("img", (imgs) =>{
    return imgs.map(x => x.src)
   })


   await page.type("#ourfield", "blue")
   await Promise.all([page.click("#ourform button"), page.waitForNavigation() ])
   
   const info = await page.$eval("#message", el => el.textContent)
   console.log(info);


   for (const photo of photos) {
        const imagepage = await page.goto(photo)
        await fs.writeFile(photo.split("/").pop(), await imagepage.buffer())
    }




    //await browser.close()
}

start()