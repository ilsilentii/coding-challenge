const puppeteer = require('puppeteer');
const fs = require('fs');

puppeteer.launch({ headless: true }).then(async browser => {
	const page = await browser.newPage();
	await page.goto("https://www.nytimes.com/");
	await page.waitForSelector('body');
    var posts = await page.evaluate(() => {
       
        let posts = document.body.querySelectorAll('.assetWrapper');       
        postItems = [];
        posts.forEach((item) => {
            let title = ''
            let summary = ''
            let link = ''
            try{
             title = item.querySelector('h2').innerText;
            if (title!=''){
                 summary = item.querySelector('p').innerText;
                 link = item.querySelector('a').href;
                 postItems.push({title: title, link: link, summary: summary});
            }
            }catch(e){
            }
        });
        
        var items = { 
            "posts": postItems
        };
        return items;
        
    });
   
    fs.writeFile('SavedLinks.txt', '', function(err) {
    	if(err) {
    		throw err
    	}
    })
   let file
   posts.posts.forEach(post => {
   		file = `Title: ${post.title} \nLink: ${post.link} \nSummary: ${post.summary} \n\n`
   		fs.appendFile('SavedLinks.txt', file, function(err) {
   			if(err) {
    			throw err
    		}	
   		})
    })
   console.log('Saved Links!')
   await browser.close();
}).catch(function(error) {
    console.error(error);
});