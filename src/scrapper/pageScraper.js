
function rand() {
  return ~~(Math.random() * 2000 + 500);
}


const scraperObject = {
  async scraper(browser, params) {
    const {
    title,
    amount,
    period,
    city,
    salary,
    websites
    } = params;
    const jobUrl = `https://hh.ru/search/vacancy?clusters=true&area=1&ored_clusters=true&enable_snippets=true&salary=&text=${title}`;
    let page = await browser.newPage();
    console.log(`Navigating to ${jobUrl}...`);
    await page.goto(jobUrl);
    // Wait for the required DOM to be rendered
    await page.waitForSelector('#a11y-main-content');
    await page.waitForTimeout(1000);
    // Get the link to all the required vacancies
    let urls = await page.$$eval('h3 > .resume-search-item__name > .g-user-content', links => {
      // // Make sure the book to be scraped is in stock
      // links = links.filter(link => link.querySelector('.instock.availability > i').textContent !== "In stock")

      // Extract the links from the data
      links = links.map(el => el.querySelector('a').href);
      return links;
    });
    //console.log(urls);

    // Loop through each of those links, open a new page instance and get the relevant data from them
    let pagePromise = (link) => new Promise(async (resolve, reject) => {
      let dataObj = {};
      let newPage = await browser.newPage();
      await newPage.goto(link);
      await page.waitForTimeout(rand());
      try {
        dataObj['vacancyName'] = await newPage.$eval('#a11y-main-content > h1 > span', text => text.textContent);
      } catch (err) {
        dataObj['vacancyName'] = '';
      }
      try {
        dataObj['companyName'] = await newPage.$eval('[data-qa="vacancy-company-name"] > span > span', text => text.textContent);
      } catch (err) {
        dataObj['companyName'] = '';
      }
      try {
        dataObj['salary'] = await newPage.$eval('[data-qa="vacancy-salary"] > span', text => text.textContent);
      } catch (err) {
        dataObj['salary'] = '';
      }
      try {
        dataObj['city'] = await newPage.$eval('[data-qa="vacancy-view-location"]', text => text.textContent);
      } catch (err) {
        dataObj['city'] = '';
      };
      try {
        dataObj['description'] = await newPage.$eval('[data-qa="vacancy-description"]', text => text.textContent);
      } catch (err) {
        dataObj['description'] = '';
      }
      resolve(dataObj);
      await page.waitForTimeout(rand());
      await newPage.close();
    });

    let scrapedData = [];
    let countLinks = 0;
    for (link in urls) {
      let currentPageData = await pagePromise(urls[link]);
      scrapedData.push(currentPageData);
      //console.log(currentPageData);
      ++countLinks;
      if (countLinks > amount - 1) break;
    }

    /* Analizing received data */
    let wordsObj = {};
    let allRecords = await AllSkill.findAll({
      where: {
        jobName: title
      }
    });
    for (let i = 0; i < allRecords.length; i++) {
      wordsObj[allRecords[i].name] = allRecords[i].count;
    }
    //console.log(wordsObj);

    for (let i = 0; i < scrapedData.length; i++) {
      let wordsArr = scrapedData[i].description.trim().replace(/[^a-zA-Zа-яА-Я0-9\s]/gmi, ' ').toUpperCase().split(/[\s\n!?, \/ \( \) :;•]/gmi).filter(el => (el !== '') && (el !== '–') && !(+el));
      //console.log(wordsArr);
      for (let j = 0; j < wordsArr.length; j++) {

        if (!wordsObj[wordsArr[j]]) {
          // console.log('=====>', wordsArr[j]);
          wordsObj[wordsArr[j]] = 1;
        } else {
          ++wordsObj[wordsArr[j]];
        }
      }

      //console.log(wordsObj);


      for (let skill in wordsObj) {
        if (skill.search(/[a-z0-9]/gmi) >= 0) {
          //console.log(skill, ' : ', wordsObj[skill]);
          const found = await AllSkill.findOne({
            where: {
              name: skill,
              jobName: url,
            }
          });
          if (found) {
            found.set({
              count: wordsObj[skill],
            });
            await found.save();
          } else {
            const record = await AllSkill.create({
              name: skill,
              count: wordsObj[skill],
              jobName: url,
              // companyName: wordsObj[companyName],
              // vacancyName: wordsObj[vacancyName],
            });
          };
        }
      }

    }
    //console.log(wordsObj);

  }
}

module.exports = scraperObject;
