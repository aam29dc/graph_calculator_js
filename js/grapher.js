"use strict";
let cx = document.querySelector('canvas').getContext('2d');

let zeroX = cx.canvas.width/2;
let zeroY = cx.canvas.height/2;
let dx = 0;     //y shift
let dy = 0;     //x shift
let z = 1;      //zoom

function drawMajorAxes(){
    cx.setTransform(1, 0, 0, 1, 0, 0);
    cx.clearRect(0, 0, cx.canvas.width, cx.canvas.height);
    cx.scale(zeroX*z, -zeroY*z);
    cx.translate((1+dx)/z, -(1+dy)/z);

    cx.strokeStyle = 'black';
    cx.lineWidth = 2/(300*z);
    cx.beginPath();
    cx.moveTo(-(1+dx)/z, 0);    //x axis
    cx.lineTo((1-dx)/z, 0);
    cx.moveTo(0, -(1-dy)/z);    //y axis
    cx.lineTo(0, (1+dy)/z);
    cx.stroke();

    document.getElementById('zoom').innerText = z;
    document.getElementById('xshift').innerText = dx;
    document.getElementById('yshift').innerText = dy;
}

let styles = ['rgb(255,0,0)', 'rgb(0,255,0)', 'rgb(0,0,255)', 'rgb(255,255,0)', 'rgb(0,255,255)', 'rgb(255,0,255)'];

function graph(i, str){
    let y = 0;
    let x = -(1+dx)/z;
    let error = document.getElementById(`error${i+1}`);
    
    try {
        eval(str.toLowerCase().replace('x', `(${x})`));
    } catch(e) {
        if(e instanceof SyntaxError){
            error.innerText = "Syntax error";
            return;
        }
        else if(e instanceof ReferenceError){
            error.innerText = "Reference error";
            return;
        }
        else if(e instanceof TypeError){
            error.innerText = "Type error";
            return;
        }
    }

    error.innerText = "";
    cx.beginPath();
    cx.strokeStyle = styles[i];
    cx.lineWidth = 2/(300*z);
    for(;x<=(1-dx+0.1)/z;x+=1/(50*z)){
        y = eval(str.toLowerCase().replace('x', `(${x})`));
        cx.lineTo(x,y);
    }
    cx.stroke();
}

drawMajorAxes();

let equations = document.getElementsByClassName('equation');

for(let i = 0;i<equations.length;i++){
    equations[i].addEventListener('input', () => {
        graph(i, equations[i].value);
    });
}

function graphEquations(){
    drawMajorAxes();
    for(let i = 0;i<equations.length;i++){
        if(equations[i].value !== '') graph(i, equations[i].value);
    }
}

cx.canvas.addEventListener('wheel', (e) => {
    if(e.wheelDelta < 0 && Math.log2(z) > -126) z /= 2;
    else if(z < 1048576) z *= 2;
    graphEquations();
});

document.body.addEventListener('keydown', (e) => {
    switch(e.key){
        case 'ArrowUp':
            dy += .1;
            break;
        case 'ArrowDown':
            dy += -.1;
            break;
        case 'ArrowLeft':
            dx += .1;
            break;
        case 'ArrowRight':
            dx += -.1;
            break;
    }
    graphEquations();
});

document.getElementById('in').addEventListener('click', () => {
    if(z < 1048576) z *= 2;
    graphEquations();
});
document.getElementById('out').addEventListener('click', () => {
    if(Math.log2(z) > -126) z /= 2;
    graphEquations();
});
document.getElementById('up').addEventListener('click', () => {
    dy += .1;
    graphEquations();
});
document.getElementById('down').addEventListener('click', () => {
    dy += -.1;
    graphEquations();
});
document.getElementById('left').addEventListener('click', () => {
    dx += .1;
    graphEquations();
});
document.getElementById('right').addEventListener('click', () => {
    dx += -.1;
    graphEquations();
});
document.getElementById('resetpos').addEventListener('click', () => {
    z = 1;
    dx = 0;
    dy = 0;
    graphEquations();
});