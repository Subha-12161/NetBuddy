require('../db/conn');
const Complain = require('../model/complaintsSchema');
const User = require('../model/mobileUserSchema');
const PdfPrinter = require('pdfmake');
const path = require('path');
let imagePath = path.join((__dirname, 'public/assets/images/header.PNG'));
const fonts = {
    Roboto: {
        normal: (__dirname, 'public/assets/fonts/Roboto-Regular.ttf'),
        bold: (__dirname, 'public/assets/fonts/Roboto-Bold.ttf'),
        italics: (__dirname, 'public/assets/fonts/Roboto-Italic.ttf'),
        bolditalics: (__dirname, 'public/assets/fonts/Roboto-MediumItalic.ttf')
    }
};


// all complaint
const viewComplain = async (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let limit = 100;
    let offset = (page - 1) * limit;

    try {
        const totalComplaints = await Complain.countDocuments();
        const complaints = await Complain.find().skip(offset).limit(limit).sort({ createdAt: -1 });

        let totalPages = Math.ceil(totalComplaints / limit);

        res.send({
            complaints: complaints,
            currentPage: page,
            totalPages: totalPages
        });
    } catch (error) {
        console.log(`error is ${error}`);
        res.send("error");
    }
};

// single complaint
const viewSingleComplain = async (req, res) => {
    try {
        let id = req.params.id;
        if (id) {
            const dataFound = await Complain.findOne({ taskSNo: id });
            if (!dataFound) {
                res.send("Data not found");
            } else {
                if (dataFound.status == "Open") {
                    const upData = await Complain.findByIdAndUpdate({ _id: dataFound._id }, { status: "In-progress" });
                }

                function calculate(array) {
                    let totalRsrp = 0;
                    let totalRsrq = 0;
                    let totalSinr = 0;
                    let totalCqi = 0;

                    let lowestRsrp = isNaN(Number(array[0].rsrp)) ? 0 : Number(array[0].rsrp);
                    let lowestRsrq = isNaN(Number(array[0].rsrq)) ? 0 : Number(array[0].rsrq);
                    let highestRsrp = isNaN(Number(array[0].rsrp)) ? 0 : Number(array[0].rsrp);
                    let highestRsrq = isNaN(Number(array[0].rsrq)) ? 0 : Number(array[0].rsrq);
                    let lowestSinr = isNaN(Number(array[0].sinr)) ? 0 : Number(array[0].sinr);
                    let lowestCqi = isNaN(Number(array[0].cqi)) ? 0 : Number(array[0].cqi);
                    let highestSinr = isNaN(Number(array[0].sinr)) ? 0 : Number(array[0].sinr);
                    let highestCqi = isNaN(Number(array[0].cqi)) ? 0 : Number(array[0].cqi);

                    let avgRsrp, avgRsrq, avgSinr, avgCqi;

                    for (const obj of array) {
                        totalRsrp += (isNaN(Number(obj.rsrp))) ? 0 : Number(obj.rsrp);
                        totalRsrq += (isNaN(Number(obj.rsrq))) ? 0 : Number(obj.rsrq);
                        totalSinr += (isNaN(Number(obj.sinr))) ? 0 : Number(obj.sinr);
                        totalCqi += (isNaN(Number(obj.cqi))) ? 0 : Number(obj.cqi);

                        lowestRsrp = (Number(obj.rsrp) < lowestRsrp) ? isNaN(Number(obj.rsrp)) ? 0 : Number(obj.rsrp) : isNaN(lowestRsrp) ? 0 : lowestRsrp;
                        lowestRsrq = (Number(obj.rsrq) < lowestRsrq) ? isNaN(Number(obj.rsrq)) ? 0 : Number(obj.rsrq) : isNaN(lowestRsrq) ? 0 : lowestRsrq;
                        lowestSinr = (Number(obj.sinr) < lowestSinr) ? isNaN(Number(obj.sinr)) ? 0 : Number(obj.sinr) : isNaN(lowestSinr) ? 0 : lowestSinr;
                        lowestCqi = (Number(obj.cqi) < lowestCqi) ? isNaN(Number(obj.cqi)) ? 0 : Number(obj.cqi) : isNaN(lowestCqi) ? 0 : lowestCqi;

                        highestRsrp = (Number(obj.rsrp) > highestRsrp) ? isNaN(Number(obj.rsrp)) ? 0 : Number(obj.rsrp) : highestRsrp;
                        highestRsrq = (Number(obj.rsrq) > highestRsrq) ? isNaN(Number(obj.rsrq)) ? 0 : Number(obj.rsrq) : highestRsrq;
                        highestSinr = (Number(obj.sinr) > highestSinr) ? isNaN(Number(obj.sinr)) ? 0 : Number(obj.sinr) : highestSinr;
                        highestCqi = (Number(obj.cqi) > highestCqi) ? isNaN(Number(obj.cqi)) ? 0 : Number(obj.cqi) : highestCqi;

                    }

                    avgRsrp = Math.round(totalRsrp / array.length);
                    avgRsrq = Math.round(totalRsrq / array.length);
                    avgSinr = Math.round(totalSinr / array.length);
                    avgCqi = Math.round(totalCqi / array.length);

                    return calculated_result = { lowestRsrp, avgRsrp, highestRsrp, lowestRsrq, avgRsrq, highestRsrq, lowestSinr, avgSinr, highestSinr, lowestCqi, avgCqi, highestCqi }
                }

                let sim1data = dataFound.four_g.data ? dataFound.four_g.data : "";
                let sim2data = dataFound.four_g_sim2.data ? dataFound.four_g_sim2.data : "";

                let sim1_ext_data = {};
                if (sim1data != "") {
                    sim1_ext_data['cid'] = !sim1data ? "" : sim1data[0].c_id;
                    sim1_ext_data['tac'] = !sim1data ? "" : sim1data[0].tac;
                    sim1_ext_data['pci'] = !sim1data ? "" : sim1data[0].pci;
                    sim1_ext_data['mnc'] = !sim1data ? "" : sim1data[0].mnc;
                    sim1_ext_data['mcc'] = !sim1data ? "" : sim1data[0].mcc;
                    sim1_ext_data['band'] = !sim1data ? "" : sim1data[0].band;
                    sim1_ext_data['arfcn'] = !sim1data ? "" : sim1data[0].arfcn;
                }

                let sim2_ext_data = {};
                if (sim2data != "") {
                    sim2_ext_data['cid'] = !sim2data ? "" : sim2data[0].c_id;
                    sim2_ext_data['tac'] = !sim2data ? "" : sim2data[0].tac;
                    sim2_ext_data['pci'] = !sim2data ? "" : sim2data[0].pci;
                    sim2_ext_data['mnc'] = !sim2data ? "" : sim2data[0].mnc;
                    sim2_ext_data['mcc'] = !sim2data ? "" : sim2data[0].mcc;
                    sim2_ext_data['band'] = !sim2data ? "" : sim2data[0].band;
                    sim2_ext_data['arfcn'] = !sim2data ? "" : sim2data[0].arfcn;
                }
                // console.log("sim1_ext_data : ", sim1_ext_data, " && ", "sim2_ext_data : ", sim2_ext_data);

                let sim1res, sim2res;
                if (sim1data != "") {
                    sim1res = calculate(sim1data);
                } if (sim2data != "") {
                    sim2res = calculate(sim2data);
                }
                res.send({ complaint: dataFound, sim1res, sim2res, sim1_ext_data, sim2_ext_data });
            }
        } else {
            res.send("Id not found in url");
        }
    } catch (error) {
        console.log(`error is ${error}`);
        res.send("error");
    }
};

// close complain
const closeComplaint = async (req, res) => {
    try {
        const remarks_text = req.body.remarks_text;
        const outcome = req.body.outcome;
        const _id = req.body._id;
        const resData = await Complain.findByIdAndUpdate({ _id }, { closeRemarks: remarks_text, outcome, status: "Closed" });
        if (resData) {
            res.status(200).send("OK");
        } else {
            res.status(500).send("Something went wrong");
        }
    } catch (error) {
        res.send("error");
    }
};


// create complain
const createComplain = async (req, res) => {
    try {
        let complaintData = {};

        const userData = await User.findOne({ email: req.body.user.email });

        complaintData.userId = userData._id;
        complaintData.user_id_object = userData._id;
        complaintData.name = userData.name;
        complaintData.taskSNo = "NB" + userData.mobile + "-" + userData.complaints_count;
        let count = userData.complaints_count + 1;
        await User.findOneAndUpdate({ email: userData.email, complaints_count: count });

        complaintData.crystalDate = req.body.details.crystalDate;
        complaintData.registrationToken = req.body.details.registrationToken;
        complaintData.location = req.body.details.location;
        complaintData.latitude = req.body.details.latitude;
        complaintData.longitude = req.body.details.longitude;
        complaintData.networkType = req.body.details.networkType;
        complaintData.testType = req.body.details.testType;
        complaintData.four_g = req.body.details.four_g;
        complaintData.four_g_sim2 = req.body.details.four_g_sim2;
        complaintData.neighbours_list = req.body.details.neighbours_list;
        complaintData.neighbours_list_sim2 = req.body.details.neighbours_list_sim2;
        complaintData.cellIdWiseData = req.body.details.cellIdWiseData;
        complaintData.cellIdWiseDataSim2 = req.body.details.cellIdWiseDataSim2;
        complaintData.areaname = req.body.details.areaname;
        complaintData.sim2 = req.body.details.sim1;
        complaintData.sim2 = req.body.details.sim2;
        complaintData.email = req.body.user.email;
        complaintData.mobile = req.body.user.mobile;
        complaintData.complaintdate = new Date().toLocaleDateString();
        complaintData.complainttime = new Date().toLocaleTimeString();

        complaintData.three_g = (req.body.details.three_g == "") ? "" : req.body.details.three_g;
        complaintData.three_g_sim2 = (req.body.details.three_g_sim2 == "") ? "" : req.body.details.three_g_sim2;
        complaintData.two_g = (req.body.details.two_g == "") ? "" : req.body.details.two_g;
        complaintData.two_g_sim2 = (req.body.details.two_g_sim2 == "") ? "" : req.body.details.two_g_sim2;

        // if (req.body.user.test_type == "Data Test") {
        complaintData.dataTest = req.body.dataTest;
        complaintData.videoResArraySim1 = req.body.details.videoResArraySim1 ? req.body.details.videoResArraySim1 : "";
        complaintData.videoResArraySim2 = req.body.details.videoResArraySim2 ? req.body.details.videoResArraySim2 : "";
        // }

        const complaint = new Complain(complaintData);
        await complaint.save();
        console.log(`${req.body.details.testType} complaint Successfull saved `);
        res.status(201).json({ Message: "Successfull" });


    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred: " + error.message);
    }
}


// export PDF Sim 1
const exportPdfSim1 = async (req, res) => {
    try {

        let id = req.params.id;
        if (id) {
            const dataFound = await Complain.findOne({ taskSNo: id });
            if (!dataFound) {
                res.send("Data not found");
            } else {

                function calculate(array) {
                    let totalRsrp = 0;
                    let totalRsrq = 0;
                    let totalSinr = 0;
                    let totalCqi = 0;

                    let lowestRsrp = isNaN(Number(array[0].rsrp)) ? 0 : Number(array[0].rsrp);
                    let lowestRsrq = isNaN(Number(array[0].rsrq)) ? 0 : Number(array[0].rsrq);
                    let highestRsrp = isNaN(Number(array[0].rsrp)) ? 0 : Number(array[0].rsrp);
                    let highestRsrq = isNaN(Number(array[0].rsrq)) ? 0 : Number(array[0].rsrq);
                    let lowestSinr = isNaN(Number(array[0].sinr)) ? 0 : Number(array[0].sinr);
                    let lowestCqi = isNaN(Number(array[0].cqi)) ? 0 : Number(array[0].cqi);
                    let highestSinr = isNaN(Number(array[0].sinr)) ? 0 : Number(array[0].sinr);
                    let highestCqi = isNaN(Number(array[0].cqi)) ? 0 : Number(array[0].cqi);

                    let avgRsrp, avgRsrq, avgSinr, avgCqi;

                    for (const obj of array) {
                        totalRsrp += (isNaN(Number(obj.rsrp))) ? 0 : Number(obj.rsrp);
                        totalRsrq += (isNaN(Number(obj.rsrq))) ? 0 : Number(obj.rsrq);
                        totalSinr += (isNaN(Number(obj.sinr))) ? 0 : Number(obj.sinr);
                        totalCqi += (isNaN(Number(obj.cqi))) ? 0 : Number(obj.cqi);

                        lowestRsrp = (Number(obj.rsrp) < lowestRsrp) ? isNaN(Number(obj.rsrp)) ? 0 : Number(obj.rsrp) : isNaN(lowestRsrp) ? 0 : lowestRsrp;
                        lowestRsrq = (Number(obj.rsrq) < lowestRsrq) ? isNaN(Number(obj.rsrq)) ? 0 : Number(obj.rsrq) : isNaN(lowestRsrq) ? 0 : lowestRsrq;
                        lowestSinr = (Number(obj.sinr) < lowestSinr) ? isNaN(Number(obj.sinr)) ? 0 : Number(obj.sinr) : isNaN(lowestSinr) ? 0 : lowestSinr;
                        lowestCqi = (Number(obj.cqi) < lowestCqi) ? isNaN(Number(obj.cqi)) ? 0 : Number(obj.cqi) : isNaN(lowestCqi) ? 0 : lowestCqi;

                        highestRsrp = (Number(obj.rsrp) > highestRsrp) ? isNaN(Number(obj.rsrp)) ? 0 : Number(obj.rsrp) : highestRsrp;
                        highestRsrq = (Number(obj.rsrq) > highestRsrq) ? isNaN(Number(obj.rsrq)) ? 0 : Number(obj.rsrq) : highestRsrq;
                        highestSinr = (Number(obj.sinr) > highestSinr) ? isNaN(Number(obj.sinr)) ? 0 : Number(obj.sinr) : highestSinr;
                        highestCqi = (Number(obj.cqi) > highestCqi) ? isNaN(Number(obj.cqi)) ? 0 : Number(obj.cqi) : highestCqi;

                    }

                    avgRsrp = Math.round(totalRsrp / array.length);
                    avgRsrq = Math.round(totalRsrq / array.length);
                    avgSinr = Math.round(totalSinr / array.length);
                    avgCqi = Math.round(totalCqi / array.length);

                    return calculated_result = { lowestRsrp, avgRsrp, highestRsrp, lowestRsrq, avgRsrq, highestRsrq, lowestSinr, avgSinr, highestSinr, lowestCqi, avgCqi, highestCqi }
                }

                let sim1data = dataFound.four_g.data ? dataFound.four_g.data : "";
                let sim2data = dataFound.four_g_sim2.data ? dataFound.four_g_sim2.data : "";

                let sim1_ext_data = {};
                if (sim1data != "") {
                    sim1_ext_data['cid'] = !sim1data ? "" : sim1data[0].c_id;
                    sim1_ext_data['tac'] = !sim1data ? "" : sim1data[0].tac;
                    sim1_ext_data['pci'] = !sim1data ? "" : sim1data[0].pci;
                    sim1_ext_data['mnc'] = !sim1data ? "" : sim1data[0].mnc;
                    sim1_ext_data['mcc'] = !sim1data ? "" : sim1data[0].mcc;
                    sim1_ext_data['band'] = !sim1data ? "" : sim1data[0].band;
                    sim1_ext_data['arfcn'] = !sim1data ? "" : sim1data[0].arfcn;
                }

                let sim2_ext_data = {};
                if (sim2data != "") {
                    sim2_ext_data['cid'] = !sim2data ? "" : sim2data[0].c_id;
                    sim2_ext_data['tac'] = !sim2data ? "" : sim2data[0].tac;
                    sim2_ext_data['pci'] = !sim2data ? "" : sim2data[0].pci;
                    sim2_ext_data['mnc'] = !sim2data ? "" : sim2data[0].mnc;
                    sim2_ext_data['mcc'] = !sim2data ? "" : sim2data[0].mcc;
                    sim2_ext_data['band'] = !sim2data ? "" : sim2data[0].band;
                    sim2_ext_data['arfcn'] = !sim2data ? "" : sim2data[0].arfcn;
                }

                let sim1res, sim2res;
                if (sim1data != "") {
                    sim1res = calculate(sim1data);
                } if (sim2data != "") {
                    sim2res = calculate(sim2data);
                }
                let resFound = { dataFound: dataFound, sim1res: sim1res, sim2res: sim2res, sim1_ext_data: sim1_ext_data, sim2_ext_data: sim2_ext_data };
                // res.send(resFound);



                //PDF cal 
                let filename = 'complaint-SIM-1-data-' + id + '-date-' + new Date().toLocaleDateString().replace(/\//g, '-') + '.pdf';
                let printer = new PdfPrinter(fonts);
                var docDefinition = {
                    content: [
                        // 0
                        {
                            columns: [
                                [{
                                    image: imagePath,
                                    width: 430,
                                }],
                                [{
                                    marginTop: 15,
                                    text: 'SIM 1 : ' + resFound.dataFound.sim1.toUpperCase(),
                                    width: 'auto',
                                    bold: true,
                                }]
                            ]
                        },

                        // 1
                        {
                            marginTop: 5,
                            canvas: [
                                {
                                    type: 'line',
                                    x1: 0, y1: 5,
                                    x2: 515, y2: 5,
                                    lineWidth: 2
                                }
                            ]
                        },

                        // 2
                        {
                            columns:
                                [
                                    [{
                                        marginTop: 10,
                                        text: 'OPERATOR : ' + resFound.dataFound.sim1,
                                        width: 'auto',
                                        bold: true,

                                    },
                                    {
                                        marginTop: 10,
                                        text: 'MOBILE NO : ' + resFound.dataFound.mobile,
                                        width: 'auto',
                                        bold: true,

                                    },
                                        , {
                                        marginTop: 10,
                                        text: 'Date : ' + resFound.dataFound.complaintdate,
                                        width: 'auto',
                                        bold: true,
                                    }],
                                    [
                                        {
                                            marginTop: 10,
                                            text: 'CUSTOMER NAME : ' + resFound.dataFound.name,
                                            width: 'auto',
                                            bold: true,

                                        },
                                        {
                                            marginTop: 10,
                                            text: 'LAT & LONG : ' + resFound.dataFound.latitude + ' & ' + resFound.dataFound.longitude,
                                            width: 'auto',
                                            bold: true,

                                        }
                                    ]
                                ]
                        },

                        // 3
                        {
                            marginTop: 20,
                            text: 'RF MEASUREMENTS',
                            width: 'auto',
                            bold: true,
                            decoration: 'underline'
                        },

                        // 4
                        {
                            columns:
                                [
                                    [{
                                        marginTop: 10,
                                        text: 'BAND : ' + resFound.sim1_ext_data.band,
                                        width: 'auto',
                                        bold: true,
                                    },
                                    {
                                        marginTop: 10,
                                        text: 'ARFCN : ' + resFound.sim1_ext_data.arfcn,
                                        width: 'auto',
                                        bold: true,

                                    }],
                                    [{
                                        marginTop: 10,
                                        text: 'MCC : ' + ((resFound.sim1_ext_data.mcc) ? resFound.sim1_ext_data.mcc : '-'),
                                        width: 'auto',
                                        bold: true,

                                    },
                                    {
                                        marginTop: 10,
                                        text: 'MNC : ' + ((resFound.sim1_ext_data.mnc) ? resFound.sim1_ext_data.mnc : '-'),
                                        width: 'auto',
                                        bold: true,

                                    }],
                                    [{
                                        marginTop: 10,
                                        text: 'TAC : ' + ((resFound.sim1_ext_data.tac) ? resFound.sim1_ext_data.tac : '-'),
                                        width: 'auto',
                                        bold: true,

                                    }]
                                ]
                        },

                        // 5
                        {
                            marginTop: 20,
                            text: 'SERVING CELLS',
                            width: 'auto',
                            bold: true,
                            decoration: 'underline'
                        },

                        // 6
                        {
                            marginTop: 10,
                            style: 'tableExample',
                            table: {
                                widths: [95, 95, 95, 95, 95],
                                body: [
                                    [
                                        {
                                            table: {
                                                widths: ['*'],
                                                body: [
                                                    [{ text: 'Time Stamp', bold: true, color: '#000000', textAlign: 'center', alignment: 'center' }],
                                                    [{ text: 'HH:MM:SS', bold: true, color: '#000000', textAlign: 'center', alignment: 'center' }],
                                                ]
                                            },
                                            layout: 'noBorders',
                                        },
                                        {
                                            table: {
                                                widths: ['*'],
                                                body: [
                                                    [{ text: 'CELL ID', bold: true, color: '#000000', textAlign: 'center', alignment: 'center' }],
                                                ]
                                            },
                                            layout: 'noBorders',
                                        },
                                        {
                                            table: {
                                                widths: ['*'],
                                                body: [
                                                    [{ text: 'RSRP', bold: true, color: '#000000', textAlign: 'center', alignment: 'center' }],
                                                    [{ text: '(high, low, average)', bold: true, color: '#000000', textAlign: 'center', alignment: 'center' }],
                                                ]
                                            },
                                            layout: 'noBorders',
                                        },
                                        {
                                            table: {
                                                widths: ['*'],
                                                body: [
                                                    [{ text: 'RSRQ', bold: true, color: '#000000', textAlign: 'center', alignment: 'center' }],
                                                    [{ text: '(high, low, average)', bold: true, color: '#000000', textAlign: 'center', alignment: 'center' }],
                                                ]
                                            },
                                            layout: 'noBorders',
                                        },
                                        {
                                            table: {
                                                widths: ['*'],
                                                body: [
                                                    [{ text: 'SINR', bold: true, color: '#000000', textAlign: 'center', alignment: 'center' }],
                                                    [{ text: '(high, low, average)', bold: true, color: '#000000', textAlign: 'center', alignment: 'center' }],
                                                ]
                                            },
                                            layout: 'noBorders',
                                        },
                                    ]
                                ],
                                heights: function (row) {
                                    return row === 0 ? 20 : 40;
                                }
                            }
                        },

                        // 7
                        [],

                        // 8
                        [],

                        // 9
                        [],

                        // 10
                        [],

                        // 11
                        {
                            marginTop: 20,
                            canvas: [
                                {
                                    type: 'line',
                                    x1: 0, y1: 5,
                                    x2: 515, y2: 5,
                                    lineWidth: 2
                                }
                            ]
                        },

                        // 12
                        {
                            marginTop: 10,
                            text: 'SUMMARY',
                            width: 'auto',
                            bold: true,
                            decoration: 'underline'
                        },

                        // 13
                        [],

                        // 14
                        {
                            marginTop: 5,
                            canvas: [
                                {
                                    type: 'line',
                                    x1: 0, y1: 5,
                                    x2: 515, y2: 5,
                                    lineWidth: 2
                                }
                            ]
                        },

                        // 15
                        {
                            marginTop: 10,
                            text: "Disclaimer : These measurements are carried out in real time basis by the user from the test location and the parameters captured are as per the conditions of the network in the particular test location at the time of testing and can vary from time to time. The NetBuddy app captures these measurements with the intent of highlighting the prevalent network conditions at the test location at that point in time and is to be used only as a reference for the respective Service Provider to undertake further analysis. NetBuddy app shall not be responsible if there is Average or Poor network coverage.",
                            width: 'auto',
                            fontSize: 7,
                        },

                    ]
                };


                // Calculation for pdf data
                docDefinition.content[6].table.body.push([
                    { text: resFound.dataFound.complainttime, color: '#000000', textAlign: 'center', alignment: 'center', marginTop: 10 },
                    { text: resFound.sim1_ext_data.cid, color: '#000000', textAlign: 'center', alignment: 'center', marginTop: 10 },
                    { text: resFound.sim1res.highestRsrp + ', ' + resFound.sim1res.lowestRsrp + ', ' + resFound.sim1res.avgRsrp, color: '#000000', textAlign: 'center', alignment: 'center', marginTop: 10 },
                    { text: resFound.sim1res.highestRsrq + ', ' + resFound.sim1res.lowestRsrq + ', ' + resFound.sim1res.avgRsrq, color: '#000000', textAlign: 'center', alignment: 'center', marginTop: 10 },
                    { text: resFound.sim1res.highestSinr + ', ' + resFound.sim1res.lowestSinr + ', ' + resFound.sim1res.avgSinr, color: '#000000', textAlign: 'center', alignment: 'center', marginTop: 10 }
                ]);

                // // neighbours_list
                if (resFound.dataFound.neighbours_list.data != "") {
                    docDefinition.content[7].push({
                        marginTop: 10,
                        canvas: [
                            {
                                type: 'line',
                                x1: 0, y1: 5,
                                x2: 515, y2: 5,
                                lineWidth: 2
                            }
                        ]
                    });

                    docDefinition.content[8].push({
                        marginTop: 20,
                        text: 'NEIGHBOUR CELLS',
                        width: 'auto',
                        bold: true,
                        decoration: 'underline'
                    });

                    resFound.dataFound.neighbours_list.data.forEach(function (nei_list) {
                        docDefinition.content[9].push(
                            {
                                columns: [
                                    {
                                        marginTop: 10,
                                        text: 'CELL ID : ' + nei_list.c_id,
                                        width: 100,
                                        bold: true,
                                    },
                                    {
                                        marginTop: 10,
                                        text: 'LAC : ' + nei_list.lac,
                                        width: 100,
                                        bold: true,
                                    },
                                    {
                                        marginTop: 10,
                                        text: 'CI : ' + nei_list.nci,
                                        width: 100,
                                        bold: true,
                                    },
                                    {
                                        marginTop: 10,
                                        text: 'ARFCN : ' + nei_list.arfcn,
                                        width: 100,
                                        bold: true,
                                    }
                                ]
                            }
                        );
                    });


                }
                //For Data Test complaint
                if (resFound.dataFound.testType == "Data Test") {
                    docDefinition.content[10].push(
                        {
                            marginTop: 50,
                            text: 'DATA DIAGNOSTIC TEST RESULTS',
                            width: 'auto',
                            bold: true,
                            decoration: 'underline',
                            fontSize: 15
                        },
                        {
                            marginTop: 20,
                            text: 'YouTube Video Streaming Test',
                            width: 'auto',
                            bold: true,
                            decoration: 'underline'
                        },
                        {
                            marginTop: 10,
                            columns:
                                [
                                    [{
                                        marginTop: 10,
                                        text: 'Playback Speed : ' + resFound.dataFound.dataTest.playback_rate,
                                        width: 'auto',
                                        bold: true,

                                    },
                                    {
                                        marginTop: 10,
                                        text: 'Total Interruption : ' + resFound.dataFound.dataTest.interruptions,
                                        width: 'auto',
                                        bold: true,

                                    }],
                                    [{
                                        marginTop: 10,
                                        text: 'Duration : ' + resFound.dataFound.dataTest.duration,
                                        width: 'auto',
                                        bold: true,
                                    },
                                    {
                                        marginTop: 10,
                                        text: 'Bytes Transferred : ' + resFound.dataFound.dataTest.bytesTransferred,
                                        width: 'auto',
                                        bold: true,
                                    }],
                                    [{
                                        marginTop: 10,
                                        text: 'Initial Loading Time : ' + resFound.dataFound.dataTest.initial,
                                        width: 'auto',
                                        bold: true,
                                    }]
                                ]
                        },
                        {
                            marginTop: 30,
                            style: 'tableExample',
                            table: {
                                widths: [100, 100, 100, 100, 100],
                                body: [
                                    [
                                        {
                                            table: {
                                                widths: ['*'],
                                                body: [
                                                    [{ text: 'Time', bold: true, color: '#000000', textAlign: 'center', alignment: 'center' }]
                                                ]
                                            },
                                            layout: 'noBorders',
                                        },
                                        {
                                            table: {
                                                widths: ['*'],
                                                body: [
                                                    [{ text: 'VIDEO RESOLUTION', bold: true, color: '#000000', textAlign: 'center', alignment: 'center' }]
                                                ]
                                            },
                                            layout: 'noBorders',
                                        },
                                        {
                                            table: {
                                                widths: ['*'],
                                                body: [
                                                    [{ text: 'CELL ID', marginTop: 10, bold: true, color: '#000000', textAlign: 'center', alignment: 'center' }]
                                                ]
                                            },
                                            layout: 'noBorders',
                                        },
                                        {
                                            table: {
                                                widths: ['*'],
                                                body: [
                                                    [{ text: 'Type', marginTop: 10, bold: true, color: '#000000', textAlign: 'center', alignment: 'center' }]
                                                ]
                                            },
                                            layout: 'noBorders',
                                        }
                                    ],
                                    [
                                        { text: resFound.dataFound.complainttime, color: '#000000', textAlign: 'center', alignment: 'center', marginTop: 10 },
                                        { text: resFound.dataFound.videoResArraySim1[0].videoResolution, color: '#000000', textAlign: 'center', alignment: 'center', marginTop: 10 },
                                        { text: resFound.dataFound.videoResArraySim1[0].c_id, color: '#000000', textAlign: 'center', alignment: 'center', marginTop: 10 },
                                        { text: resFound.dataFound.videoResArraySim1[0].networkType, color: '#000000', textAlign: 'center', alignment: 'center', marginTop: 10 }
                                    ]
                                ],
                                heights: function (row) {
                                    return row === 0 ? 20 : 40;
                                }
                            }
                        },
                        {
                            marginTop: 30,
                            text: 'Webpage Loading Test',
                            width: 'auto',
                            bold: true,
                            decoration: 'underline'
                        },
                        {
                            columns:
                                [
                                    [{
                                        marginTop: 10,
                                        text: 'Amazon Loading Time : ' + resFound.dataFound.dataTest.browsing_amazon,
                                        width: 'auto',
                                        bold: true,

                                    }],
                                    [{
                                        marginTop: 10,
                                        text: 'Flipkart Loading Time : ' + resFound.dataFound.dataTest.browsing_flip,
                                        width: 'auto',
                                        bold: true,

                                    }]
                                ]
                        }
                    );
                }

                // For summary text
                var rsrp_avg_quality, rsrq_avg_quality, sinr_avg_quality, summary_description, rsrq_sinr_quality, data_test_summary_description, Text_for_summary;

                // RSRP QUALITY
                if ((resFound.sim1res.avgRsrp * -1) < 100) {
                    rsrp_avg_quality = "Good"
                }
                else if ((resFound.sim1res.avgRsrp * -1) >= 100 && (resFound.sim1res.avgRsrp * -1) <= 110) {
                    rsrp_avg_quality = "Average"
                }
                else {
                    rsrp_avg_quality = "Poor"
                }

                // RSRQ QUALITY
                if ((resFound.sim1res.avgRsrq * -1) >= 1 && (resFound.sim1res.avgRsrq * -1) <= 15) {
                    rsrq_avg_quality = "Good"
                }
                else if ((resFound.sim1res.avgRsrq * -1) > 15 && (resFound.sim1res.avgRsrq * -1) <= 20) {
                    rsrq_avg_quality = "Average"
                }
                else {
                    rsrq_avg_quality = "Poor"
                }

                // SINR QUALITY
                if ((resFound.sim1res.avgSinr >= 13) && (resFound.sim1res.avgSinr <= 20)) {
                    sinr_avg_quality = "Good"
                }
                else if ((resFound.sim1res.avgSinr >= 0) && (resFound.sim1res.avgSinr < 13)) {
                    sinr_avg_quality = "Average"
                }
                else {
                    sinr_avg_quality = "Poor"
                }

                // RSRQ and SINR
                if (rsrq_avg_quality == "Good" && sinr_avg_quality == "Good") {
                    rsrq_sinr_quality = "Good"
                }
                if ((rsrq_avg_quality == "Good" && sinr_avg_quality == "Average") || (rsrq_avg_quality == "Average" && sinr_avg_quality == "Good")) {
                    rsrq_sinr_quality = "Average"
                }
                if ((rsrq_avg_quality == "Good" && sinr_avg_quality == "Poor") || (rsrq_avg_quality == "Poor" && sinr_avg_quality == "Good")) {
                    rsrq_sinr_quality = "Poor"
                }

                if (rsrq_avg_quality == "Average" && sinr_avg_quality == "Average") {
                    rsrq_sinr_quality = "Average"
                }
                if ((rsrq_avg_quality == "Average" && sinr_avg_quality == "Poor") || (rsrq_avg_quality == "Poor" && sinr_avg_quality == "Average")) {
                    rsrq_sinr_quality = "Poor"
                }
                if (rsrq_avg_quality == "Poor" && sinr_avg_quality == "Poor") {
                    rsrq_sinr_quality = "Poor"
                }

                // For summary
                if (rsrp_avg_quality == "Good" && rsrq_sinr_quality == "Good") {
                    summary_description = "The network coverage and quality ranges are both within universally acceptable 'Good' levels on this floor and as such users  should not be facing  any network issues in this area."
                }

                if (rsrp_avg_quality == "Good" && rsrq_sinr_quality == "Average") {
                    summary_description = "The network coverage in this area is within acceptable 'Good' levels however , the quality of the network is relatively weak and considered 'Average'.This could lead to minor interruptions and in case users are experiencing disruptions to their call or messaging transactions, this report may be shared with the concerned Service Provider for corrective actions."
                }

                if (rsrp_avg_quality == "Good" && rsrq_sinr_quality == "Poor") {
                    summary_description = "The network coverage in this area is within acceptable 'Good' levels however , the quality of the network is relatively very weak and considered 'Poor'. This could lead to call quality interruptions and in case users are experiencing such disruptions to their call or messaging transactions, this report may be shared with the concerned Service Provider for corrective actions. "
                }

                if (rsrp_avg_quality == "Average" && rsrq_sinr_quality == "Good") {
                    summary_description = "The network coverage in this area is relatively weak and considered 'Average' however , the quality of the network is 'Good'. This could lead to minor coverage issues and in case users are experiencing disruptions to their call or messaging transactions, this report may be shared with the concerned Service Provider for corrective actions. "
                }

                if (rsrp_avg_quality == "Average" && rsrq_sinr_quality == "Average") {
                    summary_description = "The network coverage and quality in this area are both relatively weak and considered 'Average'. This could lead to interruptions and in case users are experiencing disruptions to their calls or messaging transactions, this report may be shared with the concerned Service Provider for corrective actions."
                }

                if (rsrp_avg_quality == "Average" && rsrq_sinr_quality == "Poor") {
                    summary_description = "The network coverage in this area is weak and considered 'Average' however , the quality of the network is relatively very weak and considered 'Poor'. This could lead to call quality interruptions and in case users are experiencing such disruptions to their call or messaging transactions, this report may be shared with the concerned Service Provider for corrective actions."
                }

                if (rsrp_avg_quality == "Poor" && rsrq_sinr_quality == "Good") {
                    summary_description = "The network coverage is very weak and considered 'Poor' and the quality is relatively weak and considered 'Good'. This could lead to issues like ‘out of coverage area’ messages, call connectivity issues , call drop problems or call quality interruptions like voice clarity issues or one way speech. In case users are experiencing such issues this report may be shared with the concerned Service Provider for corrective actions."
                }

                if (rsrp_avg_quality == "Poor" && rsrq_sinr_quality == "Average") {
                    summary_description = "The network coverage is very weak and considered 'Poor' and the quality is relatively weak and considered 'Average'. This could lead to issues like ‘out of coverage area’ messages, call connectivity issues , call drop problems or call quality interruptions like voice clarity issues or one way speech. In case users are experiencing such issues this report may be shared with the concerned Service Provider for corrective actions. "
                }

                if (rsrp_avg_quality == "Poor" && rsrq_sinr_quality == "Poor") {
                    summary_description = "The network coverage and quality ranges are both relatively very weak and considered 'Poor' levels.   This could lead to major issues like ‘out of coverage area’ messages, call connectivity issues, call drop problems or quality interruptions like voice clarity issues or one way speech. In case users are experiencing such issues this report may be shared with the concerned Service Provider for corrective actions. "
                }


                // for data test summary
                if (resFound.dataFound.testType == "Data Test") {
                    //Good	Good	Buffering
                    if (rsrp_avg_quality == "Good" && rsrq_sinr_quality == "Good" && resFound.dataFound.videoResArraySim1.length > 0) {
                        data_test_summary_description = "The network coverage and quality ranges are both within universally acceptable 'Good' levels but YouTube buffering is observed. This report may be shared with the concerned Service Provider for corrective actions ";
                    }
                    //Good	Good	No Buffering
                    if (rsrp_avg_quality == "Good" && rsrq_sinr_quality == "Good" && resFound.dataFound.videoResArraySim1.length == 0) {
                        data_test_summary_description = "The network coverage and quality ranges are both within universally acceptable 'Good' levels and no data buffering  observed. Users  should not be facing  any network issues in this area.  ";
                    }
                    //Good	Average	Buffering
                    if (rsrp_avg_quality == "Good" && rsrq_sinr_quality == "Average" && resFound.dataFound.videoResArraySim1.length > 0) {
                        data_test_summary_description = "The network coverage in this area is within acceptable 'Good' levels. However , the quality of the network is relatively weak and considered 'Average' and Youtube buffering  is observed. In case users are experiencing any issues, this report may be shared with the concerned Service Provider for corrective actions.";
                    }
                    //Good	Average	No Buffering
                    if (rsrp_avg_quality == "Good" && rsrq_sinr_quality == "Average" && resFound.dataFound.videoResArraySim1.length == 0) {
                        data_test_summary_description = "The network coverage in this area is within acceptable 'Good' levels however , the quality of the network is relatively weak and considered 'Average' and Youtube buffering is observed. In case users are experiencing any issues, this report may be shared with the concerned Service Provider for corrective actions ";
                    }
                    //Good	Poor	Buffering
                    if (rsrp_avg_quality == "Good" && rsrq_sinr_quality == "Poor" && resFound.dataFound.videoResArraySim1.length > 0) {
                        data_test_summary_description = "The network coverage in this area is within acceptable 'Good' levels however , the quality of the network is relatively very weak and considered 'Poor' and youtube buffering observed. In case users are experiencing any issues, this report may be shared with the concerned Service Provider for corrective actions ";
                    }
                    //Good	Poor	No Buffering
                    if (rsrp_avg_quality == "Good" && rsrq_sinr_quality == "Poor" && resFound.dataFound.videoResArraySim1.length == 0) {
                        data_test_summary_description = "The network coverage in this area is within acceptable 'Good' levels however , the quality of the network is relatively very weak and considered 'Poor' and currently no Youtube buffering is observed. In case users are experiencing any issues, this report may be shared with the concerned Service Provider for corrective actions ";
                    }
                    //Average	Good	Buffering
                    if (rsrp_avg_quality == "Average" && rsrq_sinr_quality == "Good" && resFound.dataFound.videoResArraySim1.length > 0) {
                        data_test_summary_description = "The network coverage in this area is relatively weak and considered 'Average' however , the quality of the network is 'Good' and Youtube buffering observed. In case users are experiencing any issues, this report may be shared with the concerned Service Provider for corrective actions ";
                    }
                    //Average	Good	No Buffering
                    if (rsrp_avg_quality == "Average" && rsrq_sinr_quality == "Good" && resFound.dataFound.videoResArraySim1.length == 0) {
                        data_test_summary_description = "The network coverage in this area is relatively weak and considered 'Average' however , the quality of the network is 'Good' and currently no Youtube buffering observed. In case users are experiencing any issues, this report may be shared with the concerned Service Provider for corrective actions ";
                    }
                    //Average	Average	Buffering
                    if (rsrp_avg_quality == "Average" && rsrq_sinr_quality == "Average" && resFound.dataFound.videoResArraySim1.length > 0) {
                        data_test_summary_description = "The network coverage and quality in this area are both relatively weak and considered 'Average' and Youtube buffering observed. In case users are experiencing any issues, this report may be shared with the concerned Service Provider for corrective actions ";
                    }
                    //Average	Average	No Buffering
                    if (rsrp_avg_quality == "Average" && rsrq_sinr_quality == "Average" && resFound.dataFound.videoResArraySim1.length == 0) {
                        data_test_summary_description = "The network coverage and quality in this area are both relatively weak and considered 'Average' and currently no Youtube buffering observed. In case users are experiencing any issues, this report may be shared with the concerned Service Provider for corrective actions ";
                    }
                    //Average	Poor	Buffering
                    if (rsrp_avg_quality == "Average" && rsrq_sinr_quality == "Poor" && resFound.dataFound.videoResArraySim1.length > 0) {
                        data_test_summary_description = "The network coverage in this area is weak and considered 'Average' however , the quality of the network is relatively very weak and considered 'Poor' and Youtube buffering observed. In case users are experiencing any issues, this report may be shared with the concerned Service Provider for corrective actions ";
                    }
                    //Average	Poor	No Buffering
                    if (rsrp_avg_quality == "Average" && rsrq_sinr_quality == "Poor" && resFound.dataFound.videoResArraySim1.length == 0) {
                        data_test_summary_description = "The network coverage in this area is weak and considered 'Average' however , the quality of the network is relatively very weak and considered 'Poor' and currently no Youtube buffering observed. In case users are experiencing any issues, this report may be shared with the concerned Service Provider for corrective actions ";
                    }
                    //Poor	Average	Buffering
                    if (rsrp_avg_quality == "Poor" && rsrq_sinr_quality == "Average" && resFound.dataFound.videoResArraySim1.length > 0) {
                        data_test_summary_description = "The network coverage is very weak and considered 'Poor' and the quality is relatively weak and considered 'Average' and Youtube buffering observed.  In case users are experiencing any issues this report may be shared with the concerned Service Provider for corrective actions ";
                    }
                    //Poor	Average	No Buffering
                    if (rsrp_avg_quality == "Poor" && rsrq_sinr_quality == "Average" && resFound.dataFound.videoResArraySim1.length == 0) {
                        data_test_summary_description = "The network coverage is very weak and considered 'Poor' and the quality is relatively weak and considered 'Average' and currently no Youtube buffering observed.  In case users are experiencing any issues this report may be shared with the concerned Service Provider for corrective actions ";
                    }
                    //Poor	Poor	Buffering
                    if (rsrp_avg_quality == "Poor" && rsrq_sinr_quality == "Poor" && resFound.dataFound.videoResArraySim1.length > 0) {
                        data_test_summary_description = "The network coverage and quality ranges are both relatively very weak and considered 'Poor' levels and Youtube buffering observed.In case users are experiencing any issues this report may be shared with the concerned Service Provider for corrective actions ";
                    }
                    //Poor	Poor	No Buffering
                    if (rsrp_avg_quality == "Poor" && rsrq_sinr_quality == "Poor" && resFound.dataFound.videoResArraySim1.length == 0) {
                        data_test_summary_description = "The network coverage and quality ranges are both relatively very weak and considered 'Poor' levels and Currentlt no Youtube buffering observed.In case users are experiencing any issues this report may be shared with the concerned Service Provider for corrective actions ";
                    }
                }

                (resFound.dataFound.testType == "Data Test") ? (Text_for_summary = data_test_summary_description) : Text_for_summary = summary_description
                // Summery data push
                docDefinition.content[13].push({ marginTop: 10, text: Text_for_summary, width: 'auto', fontSize: 12 });

                res.set('content-type', 'application/pdf');
                res.setHeader('Content-disposition', 'attachment; filename=' + filename);
                let pdfDoc = printer.createPdfKitDocument(docDefinition);
                pdfDoc.pipe(res);
                pdfDoc.end();

                return res.status(200);
            }
        } else {
            res.send("Id not found in url");
        }

    } catch (error) {
        console.log(`sim1 pdf error ${error}`);
    }
}

// export PDF Sim 2
const exportPdfSim2 = async (req, res) => {
    try {

        let id = req.params.id;
        if (id) {
            const dataFound = await Complain.findOne({ taskSNo: id });
            if (!dataFound) {
                res.send("Data not found");
            } else {

                function calculate(array) {
                    let totalRsrp = 0;
                    let totalRsrq = 0;
                    let totalSinr = 0;
                    let totalCqi = 0;

                    let lowestRsrp = isNaN(Number(array[0].rsrp)) ? 0 : Number(array[0].rsrp);
                    let lowestRsrq = isNaN(Number(array[0].rsrq)) ? 0 : Number(array[0].rsrq);
                    let highestRsrp = isNaN(Number(array[0].rsrp)) ? 0 : Number(array[0].rsrp);
                    let highestRsrq = isNaN(Number(array[0].rsrq)) ? 0 : Number(array[0].rsrq);
                    let lowestSinr = isNaN(Number(array[0].sinr)) ? 0 : Number(array[0].sinr);
                    let lowestCqi = isNaN(Number(array[0].cqi)) ? 0 : Number(array[0].cqi);
                    let highestSinr = isNaN(Number(array[0].sinr)) ? 0 : Number(array[0].sinr);
                    let highestCqi = isNaN(Number(array[0].cqi)) ? 0 : Number(array[0].cqi);

                    let avgRsrp, avgRsrq, avgSinr, avgCqi;

                    for (const obj of array) {
                        totalRsrp += (isNaN(Number(obj.rsrp))) ? 0 : Number(obj.rsrp);
                        totalRsrq += (isNaN(Number(obj.rsrq))) ? 0 : Number(obj.rsrq);
                        totalSinr += (isNaN(Number(obj.sinr))) ? 0 : Number(obj.sinr);
                        totalCqi += (isNaN(Number(obj.cqi))) ? 0 : Number(obj.cqi);

                        lowestRsrp = (Number(obj.rsrp) < lowestRsrp) ? isNaN(Number(obj.rsrp)) ? 0 : Number(obj.rsrp) : isNaN(lowestRsrp) ? 0 : lowestRsrp;
                        lowestRsrq = (Number(obj.rsrq) < lowestRsrq) ? isNaN(Number(obj.rsrq)) ? 0 : Number(obj.rsrq) : isNaN(lowestRsrq) ? 0 : lowestRsrq;
                        lowestSinr = (Number(obj.sinr) < lowestSinr) ? isNaN(Number(obj.sinr)) ? 0 : Number(obj.sinr) : isNaN(lowestSinr) ? 0 : lowestSinr;
                        lowestCqi = (Number(obj.cqi) < lowestCqi) ? isNaN(Number(obj.cqi)) ? 0 : Number(obj.cqi) : isNaN(lowestCqi) ? 0 : lowestCqi;

                        highestRsrp = (Number(obj.rsrp) > highestRsrp) ? isNaN(Number(obj.rsrp)) ? 0 : Number(obj.rsrp) : highestRsrp;
                        highestRsrq = (Number(obj.rsrq) > highestRsrq) ? isNaN(Number(obj.rsrq)) ? 0 : Number(obj.rsrq) : highestRsrq;
                        highestSinr = (Number(obj.sinr) > highestSinr) ? isNaN(Number(obj.sinr)) ? 0 : Number(obj.sinr) : highestSinr;
                        highestCqi = (Number(obj.cqi) > highestCqi) ? isNaN(Number(obj.cqi)) ? 0 : Number(obj.cqi) : highestCqi;

                    }

                    avgRsrp = Math.round(totalRsrp / array.length);
                    avgRsrq = Math.round(totalRsrq / array.length);
                    avgSinr = Math.round(totalSinr / array.length);
                    avgCqi = Math.round(totalCqi / array.length);

                    return calculated_result = { lowestRsrp, avgRsrp, highestRsrp, lowestRsrq, avgRsrq, highestRsrq, lowestSinr, avgSinr, highestSinr, lowestCqi, avgCqi, highestCqi }
                }

                let sim2data = dataFound.four_g_sim2.data ? dataFound.four_g_sim2.data : "";
                let sim2_ext_data = {};
                if (sim2data != "") {
                    sim2_ext_data['cid'] = !sim2data ? "" : sim2data[0].c_id;
                    sim2_ext_data['tac'] = !sim2data ? "" : sim2data[0].tac;
                    sim2_ext_data['pci'] = !sim2data ? "" : sim2data[0].pci;
                    sim2_ext_data['mnc'] = !sim2data ? "" : sim2data[0].mnc;
                    sim2_ext_data['mcc'] = !sim2data ? "" : sim2data[0].mcc;
                    sim2_ext_data['band'] = !sim2data ? "" : sim2data[0].band;
                    sim2_ext_data['arfcn'] = !sim2data ? "" : sim2data[0].arfcn;
                }

                let sim2res;
                if (sim2data != "") {
                    sim2res = calculate(sim2data);
                }
                let resFound = { dataFound: dataFound, sim2res: sim2res, sim2_ext_data: sim2_ext_data };
                // res.send(resFound);



                //PDF cal 
                let filename = 'complaint-SIM-2-data-' + id + '-date-' + new Date().toLocaleDateString().replace(/\//g, '-') + '.pdf';
                let printer = new PdfPrinter(fonts);
                var docDefinition = {
                    content: [
                        // 0
                        {
                            columns: [
                                [{
                                    image: imagePath,
                                    width: 430,
                                }],
                                [{
                                    marginTop: 15,
                                    text: 'SIM 2 : ' + resFound.dataFound.sim2.toUpperCase(),
                                    width: 'auto',
                                    bold: true,
                                }]
                            ]
                        },

                        // 1
                        {
                            marginTop: 5,
                            canvas: [
                                {
                                    type: 'line',
                                    x1: 0, y1: 5,
                                    x2: 515, y2: 5,
                                    lineWidth: 2
                                }
                            ]
                        },

                        // 2
                        {
                            columns:
                                [
                                    [{
                                        marginTop: 10,
                                        text: 'OPERATOR : ' + resFound.dataFound.sim2,
                                        width: 'auto',
                                        bold: true,

                                    },
                                    {
                                        marginTop: 10,
                                        text: 'MOBILE NO : ' + resFound.dataFound.mobile,
                                        width: 'auto',
                                        bold: true,

                                    },
                                        , {
                                        marginTop: 10,
                                        text: 'Date : ' + resFound.dataFound.complaintdate,
                                        width: 'auto',
                                        bold: true,
                                    }],
                                    [
                                        {
                                            marginTop: 10,
                                            text: 'CUSTOMER NAME : ' + resFound.dataFound.name,
                                            width: 'auto',
                                            bold: true,

                                        },
                                        {
                                            marginTop: 10,
                                            text: 'LAT & LONG : ' + resFound.dataFound.latitude + ' & ' + resFound.dataFound.longitude,
                                            width: 'auto',
                                            bold: true,

                                        }
                                    ]
                                ]
                        },

                        // 3
                        {
                            marginTop: 20,
                            text: 'RF MEASUREMENTS',
                            width: 'auto',
                            bold: true,
                            decoration: 'underline'
                        },

                        // 4
                        {
                            columns:
                                [
                                    [{
                                        marginTop: 10,
                                        text: 'BAND : ' + resFound.sim2_ext_data.band,
                                        width: 'auto',
                                        bold: true,
                                    },
                                    {
                                        marginTop: 10,
                                        text: 'ARFCN : ' + resFound.sim2_ext_data.arfcn,
                                        width: 'auto',
                                        bold: true,

                                    }],
                                    [{
                                        marginTop: 10,
                                        text: 'MCC : ' + ((resFound.sim2_ext_data.mcc) ? resFound.sim2_ext_data.mcc : '-'),
                                        width: 'auto',
                                        bold: true,

                                    },
                                    {
                                        marginTop: 10,
                                        text: 'MNC : ' + ((resFound.sim2_ext_data.mnc) ? resFound.sim2_ext_data.mnc : '-'),
                                        width: 'auto',
                                        bold: true,

                                    }],
                                    [{
                                        marginTop: 10,
                                        text: 'TAC : ' + ((resFound.sim2_ext_data.tac) ? resFound.sim2_ext_data.tac : '-'),
                                        width: 'auto',
                                        bold: true,

                                    }]
                                ]
                        },

                        // 5
                        {
                            marginTop: 20,
                            text: 'SERVING CELLS',
                            width: 'auto',
                            bold: true,
                            decoration: 'underline'
                        },

                        // 6
                        {
                            marginTop: 10,
                            style: 'tableExample',
                            table: {
                                widths: [95, 95, 95, 95, 95],
                                body: [
                                    [
                                        {
                                            table: {
                                                widths: ['*'],
                                                body: [
                                                    [{ text: 'Time Stamp', bold: true, color: '#000000', textAlign: 'center', alignment: 'center' }],
                                                    [{ text: 'HH:MM:SS', bold: true, color: '#000000', textAlign: 'center', alignment: 'center' }],
                                                ]
                                            },
                                            layout: 'noBorders',
                                        },
                                        {
                                            table: {
                                                widths: ['*'],
                                                body: [
                                                    [{ text: 'CELL ID', bold: true, color: '#000000', textAlign: 'center', alignment: 'center' }],
                                                ]
                                            },
                                            layout: 'noBorders',
                                        },
                                        {
                                            table: {
                                                widths: ['*'],
                                                body: [
                                                    [{ text: 'RSRP', bold: true, color: '#000000', textAlign: 'center', alignment: 'center' }],
                                                    [{ text: '(high, low, average)', bold: true, color: '#000000', textAlign: 'center', alignment: 'center' }],
                                                ]
                                            },
                                            layout: 'noBorders',
                                        },
                                        {
                                            table: {
                                                widths: ['*'],
                                                body: [
                                                    [{ text: 'RSRQ', bold: true, color: '#000000', textAlign: 'center', alignment: 'center' }],
                                                    [{ text: '(high, low, average)', bold: true, color: '#000000', textAlign: 'center', alignment: 'center' }],
                                                ]
                                            },
                                            layout: 'noBorders',
                                        },
                                        {
                                            table: {
                                                widths: ['*'],
                                                body: [
                                                    [{ text: 'SINR', bold: true, color: '#000000', textAlign: 'center', alignment: 'center' }],
                                                    [{ text: '(high, low, average)', bold: true, color: '#000000', textAlign: 'center', alignment: 'center' }],
                                                ]
                                            },
                                            layout: 'noBorders',
                                        },
                                    ]
                                ],
                                heights: function (row) {
                                    return row === 0 ? 20 : 40;
                                }
                            }
                        },

                        // 7
                        [],

                        // 8
                        [],

                        // 9
                        [],

                        // 10
                        [],

                        // 11
                        {
                            marginTop: 20,
                            canvas: [
                                {
                                    type: 'line',
                                    x1: 0, y1: 5,
                                    x2: 515, y2: 5,
                                    lineWidth: 2
                                }
                            ]
                        },

                        // 12
                        {
                            marginTop: 10,
                            text: 'SUMMARY',
                            width: 'auto',
                            bold: true,
                            decoration: 'underline'
                        },

                        // 13
                        [],

                        // 14
                        {
                            marginTop: 5,
                            canvas: [
                                {
                                    type: 'line',
                                    x1: 0, y1: 5,
                                    x2: 515, y2: 5,
                                    lineWidth: 2
                                }
                            ]
                        },

                        // 15
                        {
                            marginTop: 10,
                            text: "Disclaimer : These measurements are carried out in real time basis by the user from the test location and the parameters captured are as per the conditions of the network in the particular test location at the time of testing and can vary from time to time. The NetBuddy app captures these measurements with the intent of highlighting the prevalent network conditions at the test location at that point in time and is to be used only as a reference for the respective Service Provider to undertake further analysis. NetBuddy app shall not be responsible if there is Average or Poor network coverage.",
                            width: 'auto',
                            fontSize: 7,
                        },

                    ]
                };


                // Calculation for pdf data
                docDefinition.content[6].table.body.push([
                    { text: resFound.dataFound.complainttime, color: '#000000', textAlign: 'center', alignment: 'center', marginTop: 10 },
                    { text: resFound.sim2_ext_data.cid, color: '#000000', textAlign: 'center', alignment: 'center', marginTop: 10 },
                    { text: resFound.sim2res.highestRsrp + ', ' + resFound.sim2res.lowestRsrp + ', ' + resFound.sim2res.avgRsrp, color: '#000000', textAlign: 'center', alignment: 'center', marginTop: 10 },
                    { text: resFound.sim2res.highestRsrq + ', ' + resFound.sim2res.lowestRsrq + ', ' + resFound.sim2res.avgRsrq, color: '#000000', textAlign: 'center', alignment: 'center', marginTop: 10 },
                    { text: resFound.sim2res.highestSinr + ', ' + resFound.sim2res.lowestSinr + ', ' + resFound.sim2res.avgSinr, color: '#000000', textAlign: 'center', alignment: 'center', marginTop: 10 }
                ]);

                // // neighbours_list
                if (resFound.dataFound.neighbours_list.data != "") {
                    docDefinition.content[7].push({
                        marginTop: 10,
                        canvas: [
                            {
                                type: 'line',
                                x1: 0, y1: 5,
                                x2: 515, y2: 5,
                                lineWidth: 2
                            }
                        ]
                    });

                    docDefinition.content[8].push({
                        marginTop: 20,
                        text: 'NEIGHBOUR CELLS',
                        width: 'auto',
                        bold: true,
                        decoration: 'underline'
                    });

                    resFound.dataFound.neighbours_list.data.forEach(function (nei_list) {
                        docDefinition.content[9].push(
                            {
                                columns: [
                                    {
                                        marginTop: 10,
                                        text: 'CELL ID : ' + nei_list.c_id,
                                        width: 100,
                                        bold: true,
                                    },
                                    {
                                        marginTop: 10,
                                        text: 'LAC : ' + nei_list.lac,
                                        width: 100,
                                        bold: true,
                                    },
                                    {
                                        marginTop: 10,
                                        text: 'CI : ' + nei_list.nci,
                                        width: 100,
                                        bold: true,
                                    },
                                    {
                                        marginTop: 10,
                                        text: 'ARFCN : ' + nei_list.arfcn,
                                        width: 100,
                                        bold: true,
                                    }
                                ]
                            }
                        );
                    });


                }
                //For Data Test complaint
                if (resFound.dataFound.testType == "Data Test") {
                    docDefinition.content[10].push(
                        {
                            marginTop: 50,
                            text: 'DATA DIAGNOSTIC TEST RESULTS',
                            width: 'auto',
                            bold: true,
                            decoration: 'underline',
                            fontSize: 15
                        },
                        {
                            marginTop: 20,
                            text: 'YouTube Video Streaming Test',
                            width: 'auto',
                            bold: true,
                            decoration: 'underline'
                        },
                        {
                            marginTop: 10,
                            columns:
                                [
                                    [{
                                        marginTop: 10,
                                        text: 'Playback Speed : ' + resFound.dataFound.dataTest.playback_rate,
                                        width: 'auto',
                                        bold: true,

                                    },
                                    {
                                        marginTop: 10,
                                        text: 'Total Interruption : ' + resFound.dataFound.dataTest.interruptions,
                                        width: 'auto',
                                        bold: true,

                                    }],
                                    [{
                                        marginTop: 10,
                                        text: 'Duration : ' + resFound.dataFound.dataTest.duration,
                                        width: 'auto',
                                        bold: true,
                                    },
                                    {
                                        marginTop: 10,
                                        text: 'Bytes Transferred : ' + resFound.dataFound.dataTest.bytesTransferred,
                                        width: 'auto',
                                        bold: true,
                                    }],
                                    [{
                                        marginTop: 10,
                                        text: 'Initial Loading Time : ' + resFound.dataFound.dataTest.initial,
                                        width: 'auto',
                                        bold: true,
                                    }]
                                ]
                        },
                        {
                            marginTop: 30,
                            style: 'tableExample',
                            table: {
                                widths: [100, 100, 100, 100, 100],
                                body: [
                                    [
                                        {
                                            table: {
                                                widths: ['*'],
                                                body: [
                                                    [{ text: 'Time', bold: true, color: '#000000', textAlign: 'center', alignment: 'center' }]
                                                ]
                                            },
                                            layout: 'noBorders',
                                        },
                                        {
                                            table: {
                                                widths: ['*'],
                                                body: [
                                                    [{ text: 'VIDEO RESOLUTION', bold: true, color: '#000000', textAlign: 'center', alignment: 'center' }]
                                                ]
                                            },
                                            layout: 'noBorders',
                                        },
                                        {
                                            table: {
                                                widths: ['*'],
                                                body: [
                                                    [{ text: 'CELL ID', marginTop: 10, bold: true, color: '#000000', textAlign: 'center', alignment: 'center' }]
                                                ]
                                            },
                                            layout: 'noBorders',
                                        },
                                        {
                                            table: {
                                                widths: ['*'],
                                                body: [
                                                    [{ text: 'Type', marginTop: 10, bold: true, color: '#000000', textAlign: 'center', alignment: 'center' }]
                                                ]
                                            },
                                            layout: 'noBorders',
                                        }
                                    ],
                                    [
                                        { text: resFound.dataFound.complainttime, color: '#000000', textAlign: 'center', alignment: 'center', marginTop: 10 },
                                        { text: resFound.dataFound.videoResArraySim1[0].videoResolution, color: '#000000', textAlign: 'center', alignment: 'center', marginTop: 10 },
                                        { text: resFound.dataFound.videoResArraySim1[0].c_id, color: '#000000', textAlign: 'center', alignment: 'center', marginTop: 10 },
                                        { text: resFound.dataFound.videoResArraySim1[0].networkType, color: '#000000', textAlign: 'center', alignment: 'center', marginTop: 10 }
                                    ]
                                ],
                                heights: function (row) {
                                    return row === 0 ? 20 : 40;
                                }
                            }
                        },
                        {
                            marginTop: 30,
                            text: 'Webpage Loading Test',
                            width: 'auto',
                            bold: true,
                            decoration: 'underline'
                        },
                        {
                            columns:
                                [
                                    [{
                                        marginTop: 10,
                                        text: 'Amazon Loading Time : ' + resFound.dataFound.dataTest.browsing_amazon,
                                        width: 'auto',
                                        bold: true,

                                    }],
                                    [{
                                        marginTop: 10,
                                        text: 'Flipkart Loading Time : ' + resFound.dataFound.dataTest.browsing_flip,
                                        width: 'auto',
                                        bold: true,

                                    }]
                                ]
                        }
                    );
                }

                // For summary text
                var rsrp_avg_quality, rsrq_avg_quality, sinr_avg_quality, summary_description, rsrq_sinr_quality, data_test_summary_description, Text_for_summary;

                // RSRP QUALITY
                if ((resFound.sim2res.avgRsrp * -1) < 100) {
                    rsrp_avg_quality = "Good"
                }
                else if ((resFound.sim2res.avgRsrp * -1) >= 100 && (resFound.sim2res.avgRsrp * -1) <= 110) {
                    rsrp_avg_quality = "Average"
                }
                else {
                    rsrp_avg_quality = "Poor"
                }

                // RSRQ QUALITY
                if ((resFound.sim2res.avgRsrq * -1) >= 1 && (resFound.sim2res.avgRsrq * -1) <= 15) {
                    rsrq_avg_quality = "Good"
                }
                else if ((resFound.sim2res.avgRsrq * -1) > 15 && (resFound.sim2res.avgRsrq * -1) <= 20) {
                    rsrq_avg_quality = "Average"
                }
                else {
                    rsrq_avg_quality = "Poor"
                }

                // SINR QUALITY
                if ((resFound.sim2res.avgSinr >= 13) && (resFound.sim2res.avgSinr <= 20)) {
                    sinr_avg_quality = "Good"
                }
                else if ((resFound.sim2res.avgSinr >= 0) && (resFound.sim2res.avgSinr < 13)) {
                    sinr_avg_quality = "Average"
                }
                else {
                    sinr_avg_quality = "Poor"
                }

                // RSRQ and SINR
                if (rsrq_avg_quality == "Good" && sinr_avg_quality == "Good") {
                    rsrq_sinr_quality = "Good"
                }
                if ((rsrq_avg_quality == "Good" && sinr_avg_quality == "Average") || (rsrq_avg_quality == "Average" && sinr_avg_quality == "Good")) {
                    rsrq_sinr_quality = "Average"
                }
                if ((rsrq_avg_quality == "Good" && sinr_avg_quality == "Poor") || (rsrq_avg_quality == "Poor" && sinr_avg_quality == "Good")) {
                    rsrq_sinr_quality = "Poor"
                }

                if (rsrq_avg_quality == "Average" && sinr_avg_quality == "Average") {
                    rsrq_sinr_quality = "Average"
                }
                if ((rsrq_avg_quality == "Average" && sinr_avg_quality == "Poor") || (rsrq_avg_quality == "Poor" && sinr_avg_quality == "Average")) {
                    rsrq_sinr_quality = "Poor"
                }
                if (rsrq_avg_quality == "Poor" && sinr_avg_quality == "Poor") {
                    rsrq_sinr_quality = "Poor"
                }

                // For summary
                if (rsrp_avg_quality == "Good" && rsrq_sinr_quality == "Good") {
                    summary_description = "The network coverage and quality ranges are both within universally acceptable 'Good' levels on this floor and as such users  should not be facing  any network issues in this area."
                }

                if (rsrp_avg_quality == "Good" && rsrq_sinr_quality == "Average") {
                    summary_description = "The network coverage in this area is within acceptable 'Good' levels however , the quality of the network is relatively weak and considered 'Average'.This could lead to minor interruptions and in case users are experiencing disruptions to their call or messaging transactions, this report may be shared with the concerned Service Provider for corrective actions."
                }

                if (rsrp_avg_quality == "Good" && rsrq_sinr_quality == "Poor") {
                    summary_description = "The network coverage in this area is within acceptable 'Good' levels however , the quality of the network is relatively very weak and considered 'Poor'. This could lead to call quality interruptions and in case users are experiencing such disruptions to their call or messaging transactions, this report may be shared with the concerned Service Provider for corrective actions. "
                }

                if (rsrp_avg_quality == "Average" && rsrq_sinr_quality == "Good") {
                    summary_description = "The network coverage in this area is relatively weak and considered 'Average' however , the quality of the network is 'Good'. This could lead to minor coverage issues and in case users are experiencing disruptions to their call or messaging transactions, this report may be shared with the concerned Service Provider for corrective actions. "
                }

                if (rsrp_avg_quality == "Average" && rsrq_sinr_quality == "Average") {
                    summary_description = "The network coverage and quality in this area are both relatively weak and considered 'Average'. This could lead to interruptions and in case users are experiencing disruptions to their calls or messaging transactions, this report may be shared with the concerned Service Provider for corrective actions."
                }

                if (rsrp_avg_quality == "Average" && rsrq_sinr_quality == "Poor") {
                    summary_description = "The network coverage in this area is weak and considered 'Average' however , the quality of the network is relatively very weak and considered 'Poor'. This could lead to call quality interruptions and in case users are experiencing such disruptions to their call or messaging transactions, this report may be shared with the concerned Service Provider for corrective actions."
                }

                if (rsrp_avg_quality == "Poor" && rsrq_sinr_quality == "Good") {
                    summary_description = "The network coverage is very weak and considered 'Poor' and the quality is relatively weak and considered 'Good'. This could lead to issues like ‘out of coverage area’ messages, call connectivity issues , call drop problems or call quality interruptions like voice clarity issues or one way speech. In case users are experiencing such issues this report may be shared with the concerned Service Provider for corrective actions."
                }

                if (rsrp_avg_quality == "Poor" && rsrq_sinr_quality == "Average") {
                    summary_description = "The network coverage is very weak and considered 'Poor' and the quality is relatively weak and considered 'Average'. This could lead to issues like ‘out of coverage area’ messages, call connectivity issues , call drop problems or call quality interruptions like voice clarity issues or one way speech. In case users are experiencing such issues this report may be shared with the concerned Service Provider for corrective actions. "
                }

                if (rsrp_avg_quality == "Poor" && rsrq_sinr_quality == "Poor") {
                    summary_description = "The network coverage and quality ranges are both relatively very weak and considered 'Poor' levels.   This could lead to major issues like ‘out of coverage area’ messages, call connectivity issues, call drop problems or quality interruptions like voice clarity issues or one way speech. In case users are experiencing such issues this report may be shared with the concerned Service Provider for corrective actions. "
                }


                // for data test summary
                if (resFound.dataFound.testType == "Data Test") {
                    //Good	Good	Buffering
                    if (rsrp_avg_quality == "Good" && rsrq_sinr_quality == "Good" && resFound.dataFound.videoResArraySim1.length > 0) {
                        data_test_summary_description = "The network coverage and quality ranges are both within universally acceptable 'Good' levels but YouTube buffering is observed. This report may be shared with the concerned Service Provider for corrective actions ";
                    }
                    //Good	Good	No Buffering
                    if (rsrp_avg_quality == "Good" && rsrq_sinr_quality == "Good" && resFound.dataFound.videoResArraySim1.length == 0) {
                        data_test_summary_description = "The network coverage and quality ranges are both within universally acceptable 'Good' levels and no data buffering  observed. Users  should not be facing  any network issues in this area.  ";
                    }
                    //Good	Average	Buffering
                    if (rsrp_avg_quality == "Good" && rsrq_sinr_quality == "Average" && resFound.dataFound.videoResArraySim1.length > 0) {
                        data_test_summary_description = "The network coverage in this area is within acceptable 'Good' levels. However , the quality of the network is relatively weak and considered 'Average' and Youtube buffering  is observed. In case users are experiencing any issues, this report may be shared with the concerned Service Provider for corrective actions.";
                    }
                    //Good	Average	No Buffering
                    if (rsrp_avg_quality == "Good" && rsrq_sinr_quality == "Average" && resFound.dataFound.videoResArraySim1.length == 0) {
                        data_test_summary_description = "The network coverage in this area is within acceptable 'Good' levels however , the quality of the network is relatively weak and considered 'Average' and Youtube buffering is observed. In case users are experiencing any issues, this report may be shared with the concerned Service Provider for corrective actions ";
                    }
                    //Good	Poor	Buffering
                    if (rsrp_avg_quality == "Good" && rsrq_sinr_quality == "Poor" && resFound.dataFound.videoResArraySim1.length > 0) {
                        data_test_summary_description = "The network coverage in this area is within acceptable 'Good' levels however , the quality of the network is relatively very weak and considered 'Poor' and youtube buffering observed. In case users are experiencing any issues, this report may be shared with the concerned Service Provider for corrective actions ";
                    }
                    //Good	Poor	No Buffering
                    if (rsrp_avg_quality == "Good" && rsrq_sinr_quality == "Poor" && resFound.dataFound.videoResArraySim1.length == 0) {
                        data_test_summary_description = "The network coverage in this area is within acceptable 'Good' levels however , the quality of the network is relatively very weak and considered 'Poor' and currently no Youtube buffering is observed. In case users are experiencing any issues, this report may be shared with the concerned Service Provider for corrective actions ";
                    }
                    //Average	Good	Buffering
                    if (rsrp_avg_quality == "Average" && rsrq_sinr_quality == "Good" && resFound.dataFound.videoResArraySim1.length > 0) {
                        data_test_summary_description = "The network coverage in this area is relatively weak and considered 'Average' however , the quality of the network is 'Good' and Youtube buffering observed. In case users are experiencing any issues, this report may be shared with the concerned Service Provider for corrective actions ";
                    }
                    //Average	Good	No Buffering
                    if (rsrp_avg_quality == "Average" && rsrq_sinr_quality == "Good" && resFound.dataFound.videoResArraySim1.length == 0) {
                        data_test_summary_description = "The network coverage in this area is relatively weak and considered 'Average' however , the quality of the network is 'Good' and currently no Youtube buffering observed. In case users are experiencing any issues, this report may be shared with the concerned Service Provider for corrective actions ";
                    }
                    //Average	Average	Buffering
                    if (rsrp_avg_quality == "Average" && rsrq_sinr_quality == "Average" && resFound.dataFound.videoResArraySim1.length > 0) {
                        data_test_summary_description = "The network coverage and quality in this area are both relatively weak and considered 'Average' and Youtube buffering observed. In case users are experiencing any issues, this report may be shared with the concerned Service Provider for corrective actions ";
                    }
                    //Average	Average	No Buffering
                    if (rsrp_avg_quality == "Average" && rsrq_sinr_quality == "Average" && resFound.dataFound.videoResArraySim1.length == 0) {
                        data_test_summary_description = "The network coverage and quality in this area are both relatively weak and considered 'Average' and currently no Youtube buffering observed. In case users are experiencing any issues, this report may be shared with the concerned Service Provider for corrective actions ";
                    }
                    //Average	Poor	Buffering
                    if (rsrp_avg_quality == "Average" && rsrq_sinr_quality == "Poor" && resFound.dataFound.videoResArraySim1.length > 0) {
                        data_test_summary_description = "The network coverage in this area is weak and considered 'Average' however , the quality of the network is relatively very weak and considered 'Poor' and Youtube buffering observed. In case users are experiencing any issues, this report may be shared with the concerned Service Provider for corrective actions ";
                    }
                    //Average	Poor	No Buffering
                    if (rsrp_avg_quality == "Average" && rsrq_sinr_quality == "Poor" && resFound.dataFound.videoResArraySim1.length == 0) {
                        data_test_summary_description = "The network coverage in this area is weak and considered 'Average' however , the quality of the network is relatively very weak and considered 'Poor' and currently no Youtube buffering observed. In case users are experiencing any issues, this report may be shared with the concerned Service Provider for corrective actions ";
                    }
                    //Poor	Average	Buffering
                    if (rsrp_avg_quality == "Poor" && rsrq_sinr_quality == "Average" && resFound.dataFound.videoResArraySim1.length > 0) {
                        data_test_summary_description = "The network coverage is very weak and considered 'Poor' and the quality is relatively weak and considered 'Average' and Youtube buffering observed.  In case users are experiencing any issues this report may be shared with the concerned Service Provider for corrective actions ";
                    }
                    //Poor	Average	No Buffering
                    if (rsrp_avg_quality == "Poor" && rsrq_sinr_quality == "Average" && resFound.dataFound.videoResArraySim1.length == 0) {
                        data_test_summary_description = "The network coverage is very weak and considered 'Poor' and the quality is relatively weak and considered 'Average' and currently no Youtube buffering observed.  In case users are experiencing any issues this report may be shared with the concerned Service Provider for corrective actions ";
                    }
                    //Poor	Poor	Buffering
                    if (rsrp_avg_quality == "Poor" && rsrq_sinr_quality == "Poor" && resFound.dataFound.videoResArraySim1.length > 0) {
                        data_test_summary_description = "The network coverage and quality ranges are both relatively very weak and considered 'Poor' levels and Youtube buffering observed.In case users are experiencing any issues this report may be shared with the concerned Service Provider for corrective actions ";
                    }
                    //Poor	Poor	No Buffering
                    if (rsrp_avg_quality == "Poor" && rsrq_sinr_quality == "Poor" && resFound.dataFound.videoResArraySim1.length == 0) {
                        data_test_summary_description = "The network coverage and quality ranges are both relatively very weak and considered 'Poor' levels and Currentlt no Youtube buffering observed.In case users are experiencing any issues this report may be shared with the concerned Service Provider for corrective actions ";
                    }
                }

                (resFound.dataFound.testType == "Data Test") ? (Text_for_summary = data_test_summary_description) : Text_for_summary = summary_description
                // Summery data push
                docDefinition.content[13].push({ marginTop: 10, text: Text_for_summary, width: 'auto', fontSize: 12 });

                res.set('content-type', 'application/pdf');
                res.setHeader('Content-disposition', 'attachment; filename=' + filename);
                let pdfDoc = printer.createPdfKitDocument(docDefinition);
                pdfDoc.pipe(res);
                pdfDoc.end();

                return res.status(200);
            }
        } else {
            res.send("Id not found in url");
        }

    } catch (error) {
        console.log(`sim2 pdf error ${error}`);
    }
}


module.exports = { viewComplain, viewSingleComplain, closeComplaint, createComplain, exportPdfSim1, exportPdfSim2 };