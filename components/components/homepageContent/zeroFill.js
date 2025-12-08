import {findEpisodes} from "./DBSCAN.js";

/*testing

function randomDate(start, end) {
    start = Date.parse(start);
    end = Date.parse(end);

    return new Date(Math.floor(Math.random() * (end - start + 1) + start));
}

*/

const zeroArray = [];
const halfsec = 500;

function pair(pressure, time){
    return {
        gr: pressure,
        ts: new Date (time)
    };
};

// Utility harness below exercises fillZero with various timestamp gaps using Date objects


// Test 1: expect four zero-filled arrays before the final reading
console.log("TEST 1: \n")
var dataArray1 = [pair([1],1651535597580), pair([1],1651535597585),pair([1],1651535597590),pair([1],1651535599594)];
console.log(analyze(dataArray1));
console.log("\n")
// Test 2: consecutive readings are within half-second, so no padding
console.log("TEST 2: \n")
var dataArray2 = [pair([1,2],1651535597580), pair([1,2],1651535597585),pair([1,2],1651535597590),pair([1,2],1651535597595)];
console.log(analyze(dataArray2));
console.log("\n")
// Test 3: a single half-second gap should produce one padded entry
console.log("TEST 3: \n")
var dataArray3 = [pair([1,2],1651535599999), pair([1,2],1651535600500),pair([1,2],1651535600510),pair([1,2],1651535600511)];
console.log(analyze(dataArray3));
console.log("\n")
// Test 4: every interval exceeds half a second, so each gap is padded
console.log("TEST 4: \n")
var dataArray4 = [pair([1,2],1651535600500), pair([1,2],1651535601001),pair([1,2],1651535601502),pair([1,2],1651535602003)];
console.log(analyze(dataArray4));
console.log("\n")
// Test 5: larger gaps require two padded arrays between readings
console.log("TEST 5: \n")
var dataArray5 = [pair([1,2],1651535600500), pair([1,2],1651535601502),pair([1,2],1651535602504),pair([1,2],1651535603507)];
console.log(analyze(dataArray5));
console.log("\n")



console.log(zeroArray);

// Half-second gap threshold in milliseconds


// Fill gaps between readings and run clustering

export function analyze(arr){
    return findEpisodes(fillZero(arr))
}

export function fillZero(arr){
    var fixedArr = [];
    // Seed with the first timestamp to establish a starting point
    var prevtime = new Date(arr[0].ts);
    var currtime = new Date(arr[1].ts);
    prevtime = prevtime.getTime();
    currtime = currtime.getTime();
    // Prepare reusable arrays for padding and normalization
    var zeroLen = arr[0].gr.length;
    var zeroArray = createArray(zeroLen);
    var oneArray = createArray(zeroLen);
    oneArray.fill(1)
    // Walk the remaining data, inserting zero arrays wherever gaps exist
    fixedArr.push(pair(oneArray,new Date(prevtime)))
    for(let i = 1; i < arr.length; i++) {
         prevtime = new Date(arr[i-1].ts);
         currtime = new Date(arr[i].ts);
        prevtime = prevtime.getTime();
        currtime = currtime.getTime();
        const diff = currtime - prevtime;
        const arraysToAdd = Math.trunc(diff/halfsec);
        // Only pad when there is more than a half-second gap
        
        if (diff >  halfsec){
           
        // Insert zero arrays at each half-second increment from the previous timestamp
            var temp = prevtime+ halfsec;
           // var date = new Date (temp);
            for (let j = 0; j < arraysToAdd; j++){
                fixedArr.push ({
                    gr: zeroArray,
                    ts: new Date (temp)
                })
                temp = temp + halfsec;
           }
        }
        fixedArr.push(pair(oneArray,new Date (currtime)))
    }
    console.log(fixedArr)
    return fixedArr;
    
}

export function fillZeroRaw(arr){
    var fixedArr = [];
    // Seed with the first timestamp to establish a starting point
    var prevtime = new Date(arr[0].ts);
    var currtime = new Date(arr[1].ts);
    prevtime = prevtime.getTime();
    currtime = currtime.getTime();
    // Prepare reusable arrays for padding and normalization
    var zeroLen = arr[1].gr.length;
    var zeroArray = createArray(zeroLen);
    var oneArray = createArray(zeroLen);
    oneArray.fill(1)
    // Walk the remaining data, inserting zero arrays wherever gaps exist
    fixedArr.push(pair(arr[0].gr,new Date(prevtime)))
    for(let i = 1; i < arr.length; i++) {
        prevtime = new Date(arr[i-1].ts);
        currtime = new Date(arr[i].ts);
        prevtime = prevtime.getTime();
        currtime = currtime.getTime();
        const diff = currtime - prevtime;
        const arraysToAdd = Math.trunc(diff/halfsec);
        // Only pad when there is more than a half-second gap
        
        if (diff >  halfsec){
           
        // Insert zero arrays at each half-second increment from the previous timestamp
            var temp = prevtime+ halfsec;
           // var date = new Date (temp);
            for (let j = 0; j < arraysToAdd; j++){
                fixedArr.push ({
                    gr: zeroArray,
                    ts: new Date (temp)
                })
                temp = temp + halfsec;
           }
        }
        fixedArr.push(pair(arr[i].gr,new Date (currtime)))
    }
    console.log(fixedArr)
    return fixedArr;
    
}

//replace with array of given set size
//make obj




//create zeroArray
function createArray(zeroLen){
    let zeroArray = [];
    for (var i = 0; i < zeroLen; i++) {
        zeroArray.push(0);
    }
    return zeroArray;

}


