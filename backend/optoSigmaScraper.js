const puppeteer = require('puppeteer');



const optoSigmaScraper = async (url) => {
    
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const blocked_domains = [
    'https://pagead2.googlesyndication.com',
    'https://creativecdn.com',
    'https://www.googletagmanager.com',
    'https://cdn.krxd.net',
    'https://adservice.google.com',
    'https://cdn.concert.io',
    'https://z.moatads.com',
    'https://cdn.permutive.com'
      ];
    
    await page.setRequestInterception(true);

    //if the page makes a  request to a resource type of image or stylesheet then abort that            request
    page.on('request', request => {
        if (request.resourceType() === 'image' || request.resourceType() === 'stylesheet' || blocked_domains.some(domain => url.includes(domain)))
            request.abort();
        else
            request.continue();
    });
    
    await page.goto(url, {waitUntil: 'domcontentloaded'});

    const names = await page.$$eval(".sku-cell", (noms) => {
        return noms.map(x => x.textContent.replace('\n', '').trim())
    })

    const prices = await page.$$eval(".price", (prix) => {
                    return prix.map(x => x.textContent.replace('\n', '').trim())
                })
      
    const diameters = await page.$$eval('td[data-label="Diameter φD"]', (diametres) => {
        return diametres.map(x => x.textContent.replace('\n', '').trim())
    })
    
    const focalLengths = await page.$$eval('td[data-label="Focal length"]', (focales) => {
        return focales.map(x => x.textContent.replace('\n', '').trim())
    })

    
    let dataStructure = names.map(name => {
        return {
            'name': name,
            'provider': 'optoSigma'
        }
    })
    for (let i = 0; i < dataStructure.length; i++) {
        dataStructure[i].price = prices[i];
        dataStructure[i].diameter = diameters[i];
        dataStructure[i].focalLength = focalLengths[i];
    }
    //console.log("names: ", names);
    //console.log("prices: ", prices);
    //console.log('data structure: ', dataStructure);
    
    //console.log('diameters: ', diameters);
    browser.close();
    
    return dataStructure; 
    
}

module.exports = optoSigmaScraper;