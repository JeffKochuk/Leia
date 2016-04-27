// 'use strict';
//
// const http = require('https');
// const SEGMENT_LOOKUP = {
//   host: 'secure.p01.eloqua.com',
//   path: '/Api/rest/2.0/assets/contact/segments?depth=Complete',
//   headers: {
//     authorization: process.env.AUTHORIZATION
//   }
// };
//
// http.get(SEGMENT_LOOKUP, (res) => {
//   let body = '';
//   res.on('data', (chunk) => {
//     console.log('Got a chunk!');
//     body += chunk;
//   });
//   res.on('end', () => {
//     const elementTypes = {};
//     const fullResponse = JSON.parse(body);
//     for (const obj of fullResponse.elements) {
//       for (const obj2 of obj.elements) {
//         if (obj2.type.includes('Filter')) {
//           console.log('***************');
//           console.log(JSON.stringify(obj2));
//           console.log('+++++++++++++++');
//           console.log(JSON.stringify(obj));
//           console.log('***************');
//         }
//
//       }
//     }
//     console.log(JSON.stringify(elementTypes));
//   });
// });
// console.log('This may take a while');
