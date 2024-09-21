//async 

function resolveAfter2Seconds() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('resolved');
    }, 2000);
  });
}

async function asyncCall() {
  console.log('calling');
  const result = await resolveAfter2Seconds();
  console.log(result);
  // Expected output: "resolved"
}

asyncCall();

//


// //example 2:
// function apiOn(event) {
//   return new Promise(resolve => {
//     api.on(event, response => resolve(response));
//   });
// }

// async function test() {
//   return await apiOn( 'someEvent' ); // await is actually optional here
//                                       // you'd return a Promise either way.
// }

// async function whatever() {
//   // snip
//   const response = await test();
//   // use response here
//   // snip
// }