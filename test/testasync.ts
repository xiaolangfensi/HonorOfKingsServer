// async function timeout(flag) {
//     if (flag) {
//         return 'hello world';
//     }
//     else {
//         throw 'failure';
//     }
// }

// timeout(false).catch(err => {
//     console.log(err);
// })

function doubleAfter2Seconds(num) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(2 * num);
        }, 2000)
    })
}

async function testResult() {
    let first = await doubleAfter2Seconds(30);
    let second = await doubleAfter2Seconds(50);
    let third = await doubleAfter2Seconds(30);

    console.log(`${first} + ${second} + ${third}`);
}

testResult();
