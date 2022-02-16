const fs = require('fs');
const readline = require('readline');
var { Client } = require('@opensearch-project/opensearch');

var host = 'localhost';
var protocol = 'http';
var port = 9200;
var auth = 'admin:admin';

var client = new Client({
  node: protocol + '://' + auth + '@' + host + ':' + port,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function processLineByLine() {
  const fileStream = fs.createReadStream('./passports.json');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    try {
      const passport = JSON.parse(line);
      const { locator, home, language, taggings } = passport;
      if (locator && taggings && taggings.length) {
        console.log(`adding record for locator ${locator}...`);
        console.log({ locator, home, language, taggings });
        const languageAsTagging = {
          predicate: 'http://www.bbc.co.uk/ontologies/coreconcepts/language',
          value: language,
        };
        const dateFirstReleaseTagging = taggings.find(
          (tagging) =>
            tagging.predicate ===
            'http://www.bbc.co.uk/ontologies/creativework/dateFirstReleased'
        );
        const dateFirstReleased = dateFirstReleaseTagging
          ? dateFirstReleaseTagging.value
          : undefined;
        await client.index({
          index: 'disco',
          body: {
            passportData: {
              locator,
              home,
              dateFirstReleased,
              taggings: [...taggings, languageAsTagging],
            },
          },
          refresh: true,
        });
      }
    } catch (e) {
      console.log('sad face', e);
    }
  }
}

processLineByLine();
