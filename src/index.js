import * as tf from '@tensorflow/tfjs';

import Canvas from "./canvas.js";
import v2d from "./v2d.js";

import MlXor from "./MlXor.js";
import trainData from "../data/training.json";

var mlx = new MlXor(tf);

var w = 800,
    h = 800,
    res = w/20,
    res2 = res/2,
    rows = h / res,
    cols = w / res;
var center = new v2d(w/2, h/2);

var data = new Array;
for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
        data.push([i/cols, j/rows]);
    }
}
var xs = mlx.prepareInput(data),
    ys;

var platno = new Canvas(document.getElementById('view'), w, h);

var train = () => {
    mlx.trainWith(trainData, //{
//            onTrainEnd : (logs) => {
////                platno.draw(dc, false);
//                console.log(logs);
////                return 1;
//            }
        //    onBatchEnd : (batch, logs) => {
        //         console.log(batch, logs);
        //    },
        //    onEpochEnd : (ep, lm) => {
        //        platno.draw(dc, false);
        //        if (ep % 100 == 0) {
        //            console.log(ep, lm)
        //        }
        //    }
//        }
    ).then(e => {

//        platno.draw(dc, false);
        setTimeout(train, 10)
    });
}

var dc = async function (ctx) {
    platno.clear("hsla(0, 0%, 0%, 1)");

    ys = mlx.predict(xs).dataSync();
//    console.log(data);
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            var pos = {x:i*res, y:j*res};
            platno.rectangle2(pos, res, res, "hsla(0, 0%, "+ (ys[i + cols * j])*100 +"%, 1)", true)
//            platno.rectangle2(pos, res, res, "hsla(0, 50%, 100%, 1)", false)
            platno.text(ys[i + cols * j].toFixed(2) , pos.x + res2 - 15, pos.y + res2 + 5, "#FF0000", "15px Tahoma")
        }
    }
    platno.text(platno.fps , 10, 30, "#FFFFFF")
    return 1;
};

train();
platno.draw(dc, true);
