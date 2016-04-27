const request = require('request');
const fetch = require('node-fetch');

export const getGenerator = function* (num, callback) {
  for (let i = 1; i < num; i++) {
    // console.log(`Yielding ${i} of ${num}`);
    if (callback && i >= num) {
      console.log('Hitting callback');
      return callback();
    }
    yield i;
  }
  return undefined;
};

const getLookUp = url => ({
  url,
  json: true,
  headers: {
    'cache-control': 'no-cache',
    authorization: process.env.AUTHORIZATION,
  },
});

const Options = {
  headers: {
    authorization: process.env.AUTHORIZATION,
  },
};

// Perform an eloqua lookup. Deals with the data. Then calls the callback.
// url is the lookup url. Use SEGMENTS_URL for segments or CONTACTS_URL+ID for segment contacts
// applyToEach should take three arguments just like the callback from request()
//     error -> If the request errored
//     res ->   Response object / event emitter / headers
//     body ->  JSON object retrieved from the REST URL
// PARAM: callback is a function which is called after all requests have completed.
export const getEloquaData = (url, applyToEach, callback) => {
  console.log(`Getting URL: ${url}`);
  const firstLookup = getLookUp(url);
  request(firstLookup, (error, res, body) => {
    const numPagesToGet = parseInt(body.total, 10) / parseInt(body.pageSize, 10);
    const done = getGenerator(numPagesToGet, callback);
    console.log(`${body.total} Elements to load`);
    console.log(`${parseInt(numPagesToGet, 10)} pages needed`);
    for (let i = 1; i < numPagesToGet; i++) {
      const nextLookup = getLookUp(`${url}?page=${i + 1}`);
      request(nextLookup, (e, r, b) => {
        applyToEach(e, r, b);
        done.next();
      });
    }
    applyToEach(error, res, body);
    done.next();
  });
};

export const getEloquaDataPromise = (url, applyToEach) => {
  console.log(`Getting URL Promise: ${url}`);
  return fetch(url, Options)
    .then((res) => res.json())
    .then((body) => {
      console.log(body.total + 'elements in segment');
      const numPagesToGet = parseInt(body.total, 10) / parseInt(body.pageSize, 10);
      const pagesArray = [];
      applyToEach(body);
      if (numPagesToGet > 1) {
        for (let i = 1; i < numPagesToGet; i++) {
          pagesArray.push(
            fetch(`${url}?page=${i + 1}`, Options)
              .then(res => res.json())
              .then(applyToEach)
          );
        }
        const proms = Promise.all(pagesArray).await();
        console.log(proms);
      }
      return body.total;
    });
};

// NO ID NEEDED for Segments_url
export const SEGMENTS_URL = 'https://secure.p01.eloqua.com/Api/rest/2.0/assets/contact/segments';
// MAKE SURE to add a ID to CONTACTS_URL
// https://secure.p01.eloqua.com/API/REST/2.0/data/contact/view/100081/contacts/segment/943
export const CONTACTS_URL = 'https://secure.p01.eloqua.com/API/REST/2.0/data/contact/view/100081/contacts/segment/';



