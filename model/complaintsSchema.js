const mongoose = require('mongoose');

const complaintsSchema = new mongoose.Schema({
    status: {
        type: String,
        default: "Open"
    },
    crystalDate: {
        type: String,
        require: true
    },
    registrationToken: {
        type: String,
        require: true
    },
    location: {
        type: String,
        require: true
    },
    latitude: {
        type: String,
        require: true
    },
    longitude: {
        type: String,
        require: true
    },
    networkType: {
        type: String,
        require: true
    },
    testType: {
        type: String,
        require: true
    },
    four_g_sim2: {
        type: Object,
        require: false
    },
    four_g: {
        type: Object,
        require: false
    },
    three_g: {
        type: Object,
        require: false
    },
    three_g_sim2: {
        type: Object,
        require: false
    },
    two_g: {
        type: Object,
        require: false
    },
    two_g_sim2: {
        type: Object,
        require: false
    },
    neighbours_list: {
        type: Object,
        require: false
    },
    neighbours_list_sim2: {
        type: Object,
        require: false
    },
    cellIdWiseData: {
        type: Object,
        require: false
    },
    cellIdWiseDataSim2: {
        type: Object,
        require: false
    },
    areaname: {
        type: String,
        require: true
    },
    videoResArraySim1: {
        type: Array,
        require: false
    },
    videoResArraySim2: {
        type: Array,
        require: false
    },
    sim1: {
        type: String,
        require: false
    },
    sim2: {
        type: String,
        require: false
    },
    projectId: {
        type: String,
        require: true,
        default: "58e48764495218b19f3d66af"
    },
    project: {
        type: String,
        require: true,
        default: "NetBuddy"
    },
    source: {
        type: String,
        required: true,
        default: "NetBuddy"
    },
    isPublished: {
        type: Boolean,
        required: true,
        default: true
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false
    },
    isResolved: {
        type: Boolean,
        required: true,
        default: false
    },
    startDateTime: {
        type: Date,
        default: Date.now
    },
    complaintdate: {
        type: String,
        require: true
    },
    complainttime: {
        type: String,
        require: true
    },
    dataTest: {
        type: Object,
        require: false
    },
    taskSNo: {
        type: String,
        require: true
    },
    userId: {
        type: String,
        require: true
    },
    user_id_object: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    mobile: {
        type: String,
        require: true
    },
    closeRemarks: {
        type: String,
        required: false
    },
    outcome: {
        type: String,
        required: false
    },
});

const Complaint = mongoose.model("COMPLAINT", complaintsSchema);

module.exports = Complaint;