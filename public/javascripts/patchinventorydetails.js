$(function() {
    // function mytest() {
    // Real Time chart
    var data = [],
        totalPoints = 40;

    function getBatteryData() {
        var patchresult = document.getElementById("patchresult").innerText;
        console.log("sudks1", patchresult);
        var data = patchresult.split(',')
        console.log("sudks1", data);
        // var data = [50, 80, 90, 100, 90, 85, 84, 80]
        // const request = require('https');

        // request('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY', { json: true }, (err, res, body) => {
        //     if (err) { return console.log(err); }
        //     console.log(body.url);
        //     console.log(body.explanation);
        // });
        // const Influx = require('influx');

        // const influx = new Influx.InfluxDB({
        //     host: 'localhost',
        //     database: 'example',
        //     schema: [{
        //         measurement: 'cpu_load_short',
        //         fields: { Int_value: Influx.FieldType.INTEGER },
        //         tags: ['host', 'region']
        //     }]
        // });
        // influx.query(`select * from cpu_load_short`).then(results => {
        //     console.log(results)
        // })

        var res = []
        for (var i = 0; i < data.length; i++) {
            res.push([i, data[i]])
        }
        return res;
    }

    function getRandomData() {
        if (data.length > 0) data = data.slice(1);
        // Do a random walk
        while (data.length < totalPoints) {
            var prev = data.length > 0 ? data[data.length - 1] : 50,
                y = prev + Math.random() * 10 - 5;
            if (y < 0) {
                y = 0;
            } else if (y > 100) {
                y = 100;
            }
            data.push(y);
        }
        // Zip the generated y values with the x values
        var res = [];
        for (var i = 0; i < data.length; ++i) {
            res.push([i, data[i]])
        }
        console.log(res);
        return res;
    }
    // Set up the control widget
    var updateInterval = 2;
    $("#updateInterval").val(updateInterval).on('change', function() {
        var v = $(this).val();
        if (v && !isNaN(+v)) {
            updateInterval = +v;
            if (updateInterval < 1) {
                updateInterval = 1;
            } else if (updateInterval > 3000) {
                updateInterval = 3000;
            }
            $(this).val("" + updateInterval);
        }
    });

    var plot = $.plot(`#patch-battery`, [getBatteryData()], {
        series: {
            shadowSize: 0 // Drawing is faster without shadows
        },
        yaxis: {
            min: 0,
            max: 100,
            show: true
        },
        xaxis: {
            show: true
        },
        colors: ["#26c6da"],
        grid: {
            color: "#AFAFAF",
            hoverable: true,
            borderWidth: 0
        },
        tooltip: true,
        tooltipOpts: {
            content: "Y: %y",
            defaultTheme: false
        }
    });


    function update() {
        plot.setData([getBatteryData()]);
        // Since the axes don't change, we don't need to call plot.setupGrid()
        plot.draw();
        // setTimeout(update, updateInterval);
    }
    update();
    // getECGData();
    // }
});

// mytest()
$(function() {
    // function mytest() {
    // Real Time chart
    var data = [],
        totalPoints = 40;

    function getECGData() {
        var ecgpatchresult = document.getElementById("ecgpatchresult").innerText;
        console.log("sudks1", ecgpatchresult);
        var data = ecgpatchresult.split(',')
        console.log("sudks1", data);

        var res = []
        for (var i = 0; i < data.length; i++) {
            res.push([i, data[i]])
        }
        return res;
    }

    function getRandomData() {
        if (data.length > 0) data = data.slice(1);
        // Do a random walk
        while (data.length < totalPoints) {
            var prev = data.length > 0 ? data[data.length - 1] : 50,
                y = prev + Math.random() * 10 - 5;
            if (y < 0) {
                y = 0;
            } else if (y > 100) {
                y = 100;
            }
            data.push(y);
        }
        // Zip the generated y values with the x values
        var res = [];
        for (var i = 0; i < data.length; ++i) {
            res.push([i, data[i]])
        }
        console.log(res);
        return res;
    }
    // Set up the control widget
    var updateInterval = 2;
    $("#updateInterval").val(updateInterval).on('change', function() {
        var v = $(this).val();
        if (v && !isNaN(+v)) {
            updateInterval = +v;
            if (updateInterval < 1) {
                updateInterval = 1;
            } else if (updateInterval > 3000) {
                updateInterval = 3000;
            }
            $(this).val("" + updateInterval);
        }
    });

    // webgl-plot sudks
    // import WebGLplot, { WebglLine, ColorRGBA } from "webgl-plot";
    // const canvas = document.getElementById("my_canvas");
    // const devicePixelRatio = window.devicePixelRatio || 1;
    // canvas.width = canvas.clientWidth * devicePixelRatio;
    // canvas.height = canvas.clientHeight * devicePixelRatio;
    // const numX = canvas.width;
    // const color = new ColorRGBA(Math.random(), Math.random(), Math.random(), 1);
    // const line = new WebglLine(color, numX);
    // const wglp = new WebGLplot(canvas);
    // line.lineSpaceX(-1, 2 / numX);
    // wglp.addLine(line);

    // function newFrame() {
    //     update1();
    //     wglp.update();
    //     requestAnimationFrame(newFrame);
    // }
    // requestAnimationFrame(newFrame);

    // function update1() {
    //     const freq = 0.001;
    //     const amp = 0.5;
    //     const noise = 0.1;

    //     for (let i = 0; i < line.numPoints; i++) {
    //         const ySin = Math.sin(Math.PI * i * freq * Math.PI * 2);
    //         const yNoise = Math.random() - 0.5;
    //         line.setY(i, ySin * amp + yNoise * noise);
    //     }
    // }

    // Old graph
    var plot = $.plot(`#patch-ecg`, [getECGData()], {
        series: {
            shadowSize: 0 // Drawing is faster without shadows
        },
        yaxis: {
            min: -1000,
            max: 2000,
            show: true
        },
        xaxis: {
            show: true,
            // min: 1501742528755,
            // max: 1601742538755,
            // mode: "time",
            // timeBase: "milliseconds",
            // timeformat: "%Y/%m/%d/%H:%M:%S"
        },
        colors: ["#26c6da"],
        grid: {
            color: "#AFAFAF",
            hoverable: true,
            borderWidth: 0
        },
        tooltip: false,
        tooltipOpts: {
            content: "Y: %y",
            defaultTheme: false
        }
    });


    function update() {
        plot.setData([getECGData()]);
        // Since the axes don't change, we don't need to call plot.setupGrid()
        plot.draw();
        // setTimeout(update, updateInterval);
    }
    update();
    // getECGData();
    // }
});


$(function() {
    // function mytest() {
    // Real Time chart
    var data = [],
        totalPoints = 40;

    function getRRData() {
        var rrpatchresult = document.getElementById("rrpatchresult").innerText;
        console.log("sudks1", rrpatchresult);
        var data = rrpatchresult.split(',')
        console.log("sudks1", data);

        var res = []
        for (var i = 0; i < data.length; i++) {
            res.push([i, data[i]])
        }
        return res;
    }

    function getRandomData() {
        if (data.length > 0) data = data.slice(1);
        // Do a random walk
        while (data.length < totalPoints) {
            var prev = data.length > 0 ? data[data.length - 1] : 50,
                y = prev + Math.random() * 10 - 5;
            if (y < 0) {
                y = 0;
            } else if (y > 100) {
                y = 100;
            }
            data.push(y);
        }
        // Zip the generated y values with the x values
        var res = [];
        for (var i = 0; i < data.length; ++i) {
            res.push([i, data[i]])
        }
        console.log(res);
        return res;
    }
    // Set up the control widget
    var updateInterval = 2;
    $("#updateInterval").val(updateInterval).on('change', function() {
        var v = $(this).val();
        if (v && !isNaN(+v)) {
            updateInterval = +v;
            if (updateInterval < 1) {
                updateInterval = 1;
            } else if (updateInterval > 3000) {
                updateInterval = 3000;
            }
            $(this).val("" + updateInterval);
        }
    });

    // webgl-plot sudks
    // import WebGLplot, { WebglLine, ColorRGBA } from "webgl-plot";
    // const canvas = document.getElementById("my_canvas");
    // const devicePixelRatio = window.devicePixelRatio || 1;
    // canvas.width = canvas.clientWidth * devicePixelRatio;
    // canvas.height = canvas.clientHeight * devicePixelRatio;
    // const numX = canvas.width;
    // const color = new ColorRGBA(Math.random(), Math.random(), Math.random(), 1);
    // const line = new WebglLine(color, numX);
    // const wglp = new WebGLplot(canvas);
    // line.lineSpaceX(-1, 2 / numX);
    // wglp.addLine(line);

    // function newFrame() {
    //     update1();
    //     wglp.update();
    //     requestAnimationFrame(newFrame);
    // }
    // requestAnimationFrame(newFrame);

    // function update1() {
    //     const freq = 0.001;
    //     const amp = 0.5;
    //     const noise = 0.1;

    //     for (let i = 0; i < line.numPoints; i++) {
    //         const ySin = Math.sin(Math.PI * i * freq * Math.PI * 2);
    //         const yNoise = Math.random() - 0.5;
    //         line.setY(i, ySin * amp + yNoise * noise);
    //     }
    // }

    // Old graph
    var plot = $.plot(`#patch-rr`, [getRRData()], {
        series: {
            shadowSize: 0 // Drawing is faster without shadows
        },
        yaxis: {
            min: -20,
            max: 50,
            show: true
        },
        xaxis: {
            show: true,
            // min: 1501742528755,
            // max: 1601742538755,
            // mode: "time",
            // timeBase: "milliseconds",
            // timeformat: "%Y/%m/%d/%H:%M:%S"
        },
        colors: ["#26c6da"],
        grid: {
            color: "#AFAFAF",
            hoverable: true,
            borderWidth: 0
        },
        tooltip: false,
        tooltipOpts: {
            content: "Y: %y",
            defaultTheme: false
        }
    });


    function update() {
        plot.setData([getRRData()]);
        // Since the axes don't change, we don't need to call plot.setupGrid()
        plot.draw();
        // setTimeout(update, updateInterval);
    }
    update();
    // getECGData();
    // }
});


$(function() {
    // function mytest() {
    // Real Time chart
    var data = [],
        totalPoints = 40;

    function getHRData() {
        var hrpatchresult = document.getElementById("hrpatchresult").innerText;
        console.log("sudks1", hrpatchresult);
        var data = hrpatchresult.split(',')
        console.log("sudks1", data);

        var res = []
        for (var i = 0; i < data.length; i++) {
            res.push([i, data[i]])
        }
        return res;
    }

    function getRandomData() {
        if (data.length > 0) data = data.slice(1);
        // Do a random walk
        while (data.length < totalPoints) {
            var prev = data.length > 0 ? data[data.length - 1] : 50,
                y = prev + Math.random() * 10 - 5;
            if (y < 0) {
                y = 0;
            } else if (y > 100) {
                y = 100;
            }
            data.push(y);
        }
        // Zip the generated y values with the x values
        var res = [];
        for (var i = 0; i < data.length; ++i) {
            res.push([i, data[i]])
        }
        console.log(res);
        return res;
    }
    // Set up the control widget
    var updateInterval = 2;
    $("#updateInterval").val(updateInterval).on('change', function() {
        var v = $(this).val();
        if (v && !isNaN(+v)) {
            updateInterval = +v;
            if (updateInterval < 1) {
                updateInterval = 1;
            } else if (updateInterval > 3000) {
                updateInterval = 3000;
            }
            $(this).val("" + updateInterval);
        }
    });

    // webgl-plot sudks
    // import WebGLplot, { WebglLine, ColorRGBA } from "webgl-plot";
    // const canvas = document.getElementById("my_canvas");
    // const devicePixelRatio = window.devicePixelRatio || 1;
    // canvas.width = canvas.clientWidth * devicePixelRatio;
    // canvas.height = canvas.clientHeight * devicePixelRatio;
    // const numX = canvas.width;
    // const color = new ColorRGBA(Math.random(), Math.random(), Math.random(), 1);
    // const line = new WebglLine(color, numX);
    // const wglp = new WebGLplot(canvas);
    // line.lineSpaceX(-1, 2 / numX);
    // wglp.addLine(line);

    // function newFrame() {
    //     update1();
    //     wglp.update();
    //     requestAnimationFrame(newFrame);
    // }
    // requestAnimationFrame(newFrame);

    // function update1() {
    //     const freq = 0.001;
    //     const amp = 0.5;
    //     const noise = 0.1;

    //     for (let i = 0; i < line.numPoints; i++) {
    //         const ySin = Math.sin(Math.PI * i * freq * Math.PI * 2);
    //         const yNoise = Math.random() - 0.5;
    //         line.setY(i, ySin * amp + yNoise * noise);
    //     }
    // }

    // Old graph
    var plot = $.plot(`#patch-hr`, [getHRData()], {
        series: {
            shadowSize: 0 // Drawing is faster without shadows
        },
        yaxis: {
            min: -100,
            max: 200,
            show: true
        },
        xaxis: {
            show: true,
            // min: 1501742528755,
            // max: 1601742538755,
            // mode: "time",
            // timeBase: "milliseconds",
            // timeformat: "%Y/%m/%d/%H:%M:%S"
        },
        colors: ["#26c6da"],
        grid: {
            color: "#AFAFAF",
            hoverable: true,
            borderWidth: 0
        },
        tooltip: false,
        tooltipOpts: {
            content: "Y: %y",
            defaultTheme: false
        }
    });


    function update() {
        plot.setData([getHRData()]);
        // Since the axes don't change, we don't need to call plot.setupGrid()
        plot.draw();
        // setTimeout(update, updateInterval);
    }
    update();
    // getECGData();
    // }
});
// mytest()