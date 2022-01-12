const puppeteer = require('puppeteer');


const thorLabsScraper = async (url) => {
    
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

    //if the page makes a  request to a resource type of image or stylesheet then abort that request
    page.on('request', request => {
        if (request.resourceType() === 'image' || request.resourceType() === 'stylesheet' || blocked_domains.some(domain => url.includes(domain)))
            request.abort();
        else
            request.continue();
    });
    
    await page.goto(url, {waitUntil: 'domcontentloaded'});

    let namesUntidy = await page.$$eval('td', (noms) => {
        return noms.map(x => x.textContent.replace('\n', '').trim())
    });

    let nameswithDuplicates = namesUntidy.filter( item =>  item.startsWith("LA"))
                           .filter(item => item.length < 7);

    
    let names = [... new Set(nameswithDuplicates)];
    
    const prices = await page.$$eval('td[class="CSS4"][align="right"][style="padding-right: 15px;"]', (prix) => {
        return prix.map(x => x.textContent.replace('\n', '').trim())
    })

    let allFeatures = await page.$$eval('td[align="center"][valign="middle"]', (features) => {
        return features.map(x => x.textContent.replace('\n', '').trim())
    })

   let allFeaturesWithoutEmptyStrings = allFeatures.filter(item => item.length > 0)
                                                    
   /* Create a multidimensional array with all features corresponding to an index
     of the array so I can loop afterwards and collect each in their own variable */                                                 

   let multidimensionalAllFeatures = allFeaturesWithoutEmptyStrings.reduce((a, c, i) => {
    return i % 7 === 0 ? a.concat([allFeaturesWithoutEmptyStrings.slice(i, i + 7)]) : a;
  }, []);

  

  let diameters = []; let focalLengths = [];
  for (let i = 0; i < multidimensionalAllFeatures.length; i++) {
     diameters.push(multidimensionalAllFeatures[i][0]);
     focalLengths.push(multidimensionalAllFeatures[i][1]);
  }

  

  /* Forced manipulations to deal with the messy selector structure of the site. 
     I'm getting rid of 14 products */
  
   names.splice(17, 9);
   prices.splice(17, 9);
  
   names.splice(43, 5);
   prices.splice(43, 5);

   
  let dataStructure =  names.map(name => {
    return {
        'name': name,
        'provider': 'thorLabs'
    }
})
for (let i = 0; i < dataStructure.length; i++) {
    dataStructure[i].price = prices[i];
    dataStructure[i].diameter = diameters[i];
    dataStructure[i].focalLength = focalLengths[i];
}








    browser.close();
    
    
    return dataStructure;

};


module.exports = thorLabsScraper;