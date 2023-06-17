/*
A parking management system.
Author: Hoyue
*/

//Build a heap for distance.
var heapSize = 0;
class Heap{
    constructor(x,y)
    {
        this.x = x;
        this.y = y;
        this.distance = Math.sqrt((x-1)*(x-1) + y * y);
    }
}

var heap = new Array(4 * 9);
heap[0] = -1;
var index = 1;
heap[index++] = new Heap(0, 1);
for (var x = 0; x < 4; x++) {
    for (var y = 2; y < 9; y++) {
        heap[index++] = new Heap(x, y);
    }
}
heapSize = index - 1;
const SIZE = heapSize;
buildMinHeap(heap,heapSize);


//Initialise all postions
class Position {
    constructor(status, name, t) {
    this.status = status;
    this.name = name;
    this.t = t;
    }
}

var pos = new Array(4);
for (var x = 0; x < 4; x++) {
    pos[x] = new Array(9);
    for (var y = 0; y < 9; y++) {
    if (!y || (y == 1 && x)) {
        pos[x][y] = new Position("null", "", "");
        continue;
    } 
    pos[x][y] = new Position("available", "", "");
    }
}


//Car entering.
function input()
{
    if (heapSize < 1)
    {
        window.alert("The parking area is full!");
        throw new Error("heap overflow.");
    }
    var entranceTime = document.getElementById("entrance_time");
    var entranceName = document.getElementById("entrance_name");
    var acTest = /^([0-9]{4})\/([0-1][0-9])\/([0-3][0-9]) ([0-2][0-9]):([0-5][0-9]):([0-5][0-9])$/;
    if(!acTest.test(entranceTime.value))
    {
        window.alert("The time is not formatted correctly!");
        throw new Error("Time format error.");
    }
    if(!entranceName.value)
    {
        window.alert("The name of license could not be empty!");
        throw new Error("name error.");
    }

    var parkArea = extractMinFromHeap(heap);
    pos[parkArea.x][parkArea.y].status = 'occupied';
    pos[parkArea.x][parkArea.y].name = entranceName.value;
    pos[parkArea.x][parkArea.y].t = entranceTime.value;

    var table = document.getElementById("ParkingArea");
    var cell = table.rows[9-parkArea.y].cells[parkArea.x+1];
    cell.style.backgroundColor = "red";
    cell.innerHTML = entranceName.value;
    cell.style.color = "green";

    var info = document.getElementById("info_box");
    info.innerHTML = "<b>" + entranceName.value + "</b> parks at <b>" + String.fromCharCode(parkArea.x + 65) + parkArea.x + parkArea.y + "</b>";

}


//Car leaving.
function output()
{
    var time = document.getElementById("out_time");
    var acTest = /^([0-9]{4})\/([0-1][0-9])\/([0-3][0-9]) ([0-2][0-9]):([0-5][0-9]):([0-5][0-9])$/;
    if(!acTest.test(time.value))
    {
        window.alert("The time is not formatted correctly!");
        throw new Error("Time format error.");
    }
    var outTime = new Date(time.value);
    var outName = document.getElementById("out_name");
    if(!outName.value)
    {
        window.alert("The name of license could not be empty!");
        throw new Error("name error.");
    }

    var flag = 0;
    for(var i = heapSize + 1; i <= SIZE; i++)
    {
        var temp = heap[i];
        if(pos[temp.x][temp.y].status == 'occupied' && pos[temp.x][temp.y].name == outName.value)
        {
            flag = 1;
            var inTime = new Date(pos[temp.x][temp.y].t);
            var diff = (outTime.getTime() - inTime.getTime()) / (1000 * 60 * 60);
            if(diff < 0)
            {
                window.alert("The exit time must not be less than the entry time!");
                throw new Error("Time error.");
            }
            var fee = wealth(Math.ceil(diff));

            var table = document.getElementById("ParkingArea");
            var cell = table.rows[9-temp.y].cells[temp.x+1];
            cell.style.backgroundColor = "green";
            cell.innerHTML = "";
            var info = document.getElementById("info_box");
            info.innerHTML = "<b>" + outName.value + "</b> was parked for <b>" + Math.floor(diff) + "hours and " + Math.round((diff - Math.floor(diff)) * 60) + "minutes</b> from " + pos[temp.x][temp.y].t + " to " + time.value + "<br>Fee: <b>" + fee + "</b> yuan";

            pos[temp.x][temp.y].name = "";
            pos[temp.x][temp.y].t = "";
            pos[temp.x][temp.y].status = "available";
            insertHeap(heap,i);
        }
    }
    if(!flag)
    {
        window.alert("License mismatch!");
                throw new Error("No parking.");
    }
}

function wealth(t)
{
    if(t > 0)
        return t-1;
    else return 0;
}


//loding
function loding(){
    var table = document.getElementById("ParkingArea");
    for(var i = 0; i < 9; i++)  //y
        for(var j = 0; j < 4; j++)  //x
        {
            var cell = table.rows[9-i].cells[j+1];
            if(cell.innerHTML == "Entrance") continue;
            if(pos[j][i].status == "null")
                cell.style.backgroundColor = "aquamarine";
            else cell.style.backgroundColor = "green";
        }
}

//heap instruction
function heapParent(i) {
    return Math.floor(i / 2);
}

function left(i) {
    return i * 2;
}

function right(i) {
    return i * 2 + 1;
}

function minHeapify(A, i) {
    var l = left(i);
    var r = right(i);
    var smallest = i;

    if (l <= heapSize && A[l].distance < A[i].distance)
        smallest = l;
    
    if (r <= heapSize && A[r].distance < A[smallest].distance)
        smallest = r;

    if (smallest !== i) {
        var temp = A[i];
        A[i] = A[smallest];
        A[smallest] = temp;
        minHeapify(A, smallest);
    }
}

function buildMinHeap(A, n) {
    for (var i = Math.floor(n / 2); i >= 1; i--) {
        minHeapify(A, i);
    }
}

function extractMinFromHeap(A) {
    if (heapSize < 1)
        throw new Error("heap underflow");

    const minElement = A[1];
    A[1] = A[heapSize];
    A[heapSize] = minElement;
    heapSize --;
    minHeapify(A, 1);
    return minElement;
}

function insertHeap(A,index){
    if (heapSize == SIZE)
        throw new Error("heap overflow");
    const element = A[heapSize + 1];
    A[++heapSize] = A[index];
    A[index] = element;
    for (var i = Math.floor(heapSize / 2); i >= 1; i--) {
        minHeapify(A, i);
    }
}