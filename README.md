# Discovery Opensearch spike. Dev-testing scripts

## Run the docker scripts with

```bash
docker-compose up
```

## Download the test db data from [here](https://www.dropbox.com/s/fnfvv293mb6y8wk/passports.json?dl=0)

## Set up mappings

Using your favourite REST client, `PUT` the following to  http://localhost:9200/disco

```json
{
  "mappings": {
    "properties": {
      "passportData": {
        "properties": {
          "locator": { "type": "keyword" },
          "dateFirstReleased": { "type": "date" },
          "taggings": {
            "type": "nested",
            "properties": {
              "predicate": { "type": "keyword" },
              "value": { "type": "keyword" },
              "score": { "type": "float" }
            }
          },
          "passportMetadata": {
            "properties": {
              "createdTimestamp": { "type": "date" },
              "lastUpatedTimestamp": { "type": "date" }
            }
          }
        }
      }
    }
  }
}
```

## Using the OpenSearch dashboard

Should be available [here](http://localhost:5601/app/dev_tools#/console)

## Install

(this needs node 14 or better!)

```bash
yarn install
```

## Run the backfil script

```bash
node backfill.js
```
