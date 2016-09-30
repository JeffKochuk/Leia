import fetch from 'node-fetch';
import { EloquaLogs } from '../imports/collections.js';
const EloquaOptions = {
  headers: {
    authorization: process.env.AUTHORIZATION,
  },
};

export const getOneEloquaPage = function(id, page = 1) {
    if(!id) throw new Meteor.Error(`id: ${id} is not valid`);
    const url = `${LEIA_VIEW_URL}/${id}?page=${page}`;
    return fetch(url,EloquaOptions)
        .then(res => res.json());
};

// Take an Eloqua URI and a function. Applies the function to the body of each page. Use this one to insert values  
export const getEloquaDataPromise = (url, applyToEach) => {
  console.log(`Getting URL Promise: ${url}`);
  return fetch(url, EloquaOptions)
    .then((res) => res.json())
    .then((body) => {
      console.log(body.total + 'elements in query');
      const numPagesToGet = parseInt(body.total, 10) / parseInt(body.pageSize, 10);
      EloquaLogs.insert({ url, numPagesToGet, date: new Date() });
      const pagesArray = [];
      applyToEach(body);
      if (numPagesToGet > 1) {
        for (let i = 1; i < numPagesToGet; i++) {
          pagesArray.push(
            fetch(`${url}?page=${i + 1}`, EloquaOptions)
              .then(res => res.json())
              .then(applyToEach)
          );
        }
        Promise.all(pagesArray).await();
      }
      return body.total;
    });
};

// Get eloqua data and return all data as an array
export const getEloquaDataResults = (url) => {
  console.log(`Getting URL Promise: ${url}`);
  return fetch(url, EloquaOptions)
    .then((res) => res.json())
    .then((body) => {
      console.log(body.total + 'elements in query');
      const numPagesToGet = parseInt(body.total, 10) / parseInt(body.pageSize, 10);
      EloquaLogs.insert({ url, numPagesToGet, date: new Date() });
      let pagesArray = [];
      let retArray = body.elements;
      if (numPagesToGet > 1) {
        for (let i = 1; i < numPagesToGet; i++) {
          pagesArray.push(
            fetch(`${url}?page=${i + 1}`, EloquaOptions)
              .then(res => res.json())
              .then(json => json.elements)
          );
        }
        const newElements = Promise.all(pagesArray).await();
        for (let row of newElements) {
          retArray = retArray.concat(row);
        }
      }

      return retArray;
    });
};

// NO ID NEEDED for Segments_url
export const SEGMENTS_URL = 'https://secure.p01.eloqua.com/Api/rest/2.0/assets/contact/segments';
// MAKE SURE to add a ID to CONTACTS_URL
// https://secure.p01.eloqua.com/API/REST/2.0/data/contact/view/100081/contacts/segment/943
export const CONTACTS_URL = 'https://secure.p01.eloqua.com/API/REST/2.0/data/contact/view/100081/contacts/segment';

export const LEIA_VIEW_URL = 'https://secure.p01.eloqua.com/API/REST/2.0/data/contact/view/100190/contacts/segment';



