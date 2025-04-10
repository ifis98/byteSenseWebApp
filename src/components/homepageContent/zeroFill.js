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
    //let date = new Date(time)
    return {
        gr: pressure,
        ts: new Date (time)
    };
};

//testing new
//change to date objects


//Test 1: should create 4 new arrays before last index
console.log("TEST 1: \n")
var dataArray1 = [pair([1],1651535597580), pair([1],1651535597585),pair([1],1651535597590),pair([1],1651535599594)];
console.log(analyze(dataArray1));
console.log("\n")
//Test 2: Should create no new arrays
console.log("TEST 2: \n")
var dataArray2 = [pair([1,2],1651535597580), pair([1,2],1651535597585),pair([1,2],1651535597590),pair([1,2],1651535597595)];
console.log(analyze(dataArray2));
console.log("\n")
//Test 3: Should create 1 array after index 0
console.log("TEST 3: \n")
var dataArray3 = [pair([1,2],1651535599999), pair([1,2],1651535600500),pair([1,2],1651535600510),pair([1,2],1651535600511)];
console.log(analyze(dataArray3));
console.log("\n")
//Test 4: Should create an array between each point
console.log("TEST 4: \n")
var dataArray4 = [pair([1,2],1651535600500), pair([1,2],1651535601001),pair([1,2],1651535601502),pair([1,2],1651535602003)];
console.log(analyze(dataArray4));
console.log("\n")
//Test 5: Should create 2 arrays between each point
console.log("TEST 5: \n")
var dataArray5 = [pair([1,2],1651535600500), pair([1,2],1651535601502),pair([1,2],1651535602504),pair([1,2],1651535603507)];
console.log(analyze(dataArray5));
console.log("\n")



console.log(zeroArray);

// .5 seconds


//given function

export function analyze(arr){
    return findEpisodes(fillZero(arr))
}

export function fillZero(arr){
    var fixedArr = [];
    //grab first array
    var prevtime = new Date(arr[0].ts);
    var currtime = new Date(arr[1].ts);
    prevtime = prevtime.getTime();
    currtime = currtime.getTime();
    //create zero array
    var zeroLen = arr[0].gr.length;
    var zeroArray = createArray(zeroLen);
    var oneArray = createArray(zeroLen);
    oneArray.fill(1)
    //loop through array
    fixedArr.push(pair(oneArray,new Date(prevtime)))
    for(let i = 1; i < arr.length; i++) {
         prevtime = new Date(arr[i-1].ts);
         currtime = new Date(arr[i].ts);
        prevtime = prevtime.getTime();
        currtime = currtime.getTime();
        const diff = currtime - prevtime;
        const arraysToAdd = Math.trunc(diff/halfsec);
        //if there is more than a half second of space
        
        if (diff >  halfsec){
           
        //add a zero array at every half second since prevtime
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
    //grab first array
    var prevtime = new Date(arr[0].ts);
    var currtime = new Date(arr[1].ts);
    prevtime = prevtime.getTime();
    currtime = currtime.getTime();
    //create zero array
    var zeroLen = arr[1].gr.length;
    var zeroArray = createArray(zeroLen);
    var oneArray = createArray(zeroLen);
    oneArray.fill(1)
    //loop through array
    fixedArr.push(pair(arr[0].gr,new Date(prevtime)))
    for(let i = 1; i < arr.length; i++) {
        prevtime = new Date(arr[i-1].ts);
        currtime = new Date(arr[i].ts);
        prevtime = prevtime.getTime();
        currtime = currtime.getTime();
        const diff = currtime - prevtime;
        const arraysToAdd = Math.trunc(diff/halfsec);
        //if there is more than a half second of space
        
        if (diff >  halfsec){
           
        //add a zero array at every half second since prevtime
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


