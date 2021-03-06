"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const https = require("https");
const qs = require("querystring");
const bcrypt = require("bcrypt");
const Advertiser_1 = require("../models/Advertiser");
const send_email_1 = require("../utils/send-email");
const mongoose_1 = require("mongoose");
const Publisher_1 = require("../models/Publisher");
const apiServerUrl = process.env.NODE_ENV === 'production' ? 'adxserver.herokuapp.com' : '127.0.0.1:5000';
async function verifyCaptcha(captcha, ip) {
    return new Promise((resolve, reject) => {
        let req = https.request({
            method: 'POST',
            host: 'www.google.com',
            path: '/recaptcha/api/siteverify',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }, (res) => {
            res.on('data', data => resolve(data));
            res.on('error', error => reject(error));
        });
        req.write(qs.stringify({ secret: '6LdN1FEUAAAAAGHokcf3kHwvrWrfJ5hZfCGtDwE2', response: captcha, remoteip: ip }));
        req.on('error', error => reject(error));
        req.end();
    });
}
exports.verifyCaptcha = verifyCaptcha;
async function advertiserLogin(req, res) {
    let captcha = await verifyCaptcha(req.body['g-recaptcha-response'], req.ip).catch(e => e);
    try {
        if (JSON.parse(captcha.toString()).success != true) {
            return res.status(500).json({ error: 'captcha_error' });
        }
    }
    catch (e) {
        return res.status(500).json({ error: 'captcha_error' });
    }
    let clientData = await Advertiser_1.default.find({ emailAddress: req.body['username'] }).select('password ssid').exec();
    if (clientData.length < 1)
        return res.status(res.statusCode).json({ error: 'NOT_FOUND' });
    if (!bcrypt.compareSync(req.body['password'], clientData[0]['password']))
        return res.status(res.statusCode).json({ error: 'WRONG_PASS' });
    res.cookie('SSID', clientData[0]['ssid'], { path: '/client', maxAge: 1000 * 60 * 60 * 24 });
    res.cookie('API', apiServerUrl, { path: '/client', maxAge: 1000 * 60 * 60 * 24 });
    return res.status(res.statusCode).json({ message: 'success' });
}
exports.advertiserLogin = advertiserLogin;
async function advertiserSignUp(req, res) {
    let captcha = await verifyCaptcha(req.body['g-recaptcha-response'], req.ip).catch(e => e);
    try {
        if (JSON.parse(captcha.toString()).success != true) {
            return res.status(500).json({ error: 'captcha_error' });
        }
    }
    catch (e) {
        return res.status(500).json({ error: 'captcha_error' });
    }
    let SSID = Buffer.from(req.body['emailaddress'] + ':' + req.body['fullnames']).toString('base64'), hashPassword = await bcrypt.hashSync(req.body['password'], 8), verificationCode = (Number(new Date()) % 7e9).toString(29).toUpperCase(), advertiser = new Advertiser_1.default({
        _id: new mongoose_1.Types.ObjectId(),
        fullNames: req.body['fullnames'],
        emailAddress: req.body['emailaddress'],
        password: hashPassword,
        ssid: SSID,
        joinedAs: req.body['businesstarget'],
        verificationCode: verificationCode,
        businessGroupTarget: req.body['businessgrouptarget']
    }), emailCheck = await Advertiser_1.default.find({ emailAddress: req.body['emailaddress'] }).select('emailaddress').exec();
    if (emailCheck.length > 0)
        return res.status(res.statusCode).json({ error: 'EMAIL_EXISTS' });
    let saveResult = await advertiser.save().then(data => data['emailAddress'] == req.body['emailaddress']), emailStatus = await send_email_1.sendMail(req.body['emailaddress'], `Verify your account using code: ${verificationCode}`);
    return res.status(res.statusCode).json({ signupStatus: saveResult, emailStatus: emailStatus });
}
exports.advertiserSignUp = advertiserSignUp;
async function publisherSignUp(req, res) {
    let SSID = Buffer.from(req.body['publisherEmail'] + new Date()).toString('base64').slice(0, -5), hashPassword = await bcrypt.hashSync(req.body['publisherPassword'], 8), publisher = new Publisher_1.default({
        _id: new mongoose_1.Types.ObjectId(),
        publisherEmail: req.body['publisherEmail'],
        publisherAppUrl: req.body['publisherWebsite'],
        publisherPassword: hashPassword,
        publisherDefaultWallet: null,
        publisherSsid: SSID
    }), emailCheck = await Publisher_1.default.find({ publisherEmail: req.body['publisherEmail'] }).select('publisherEmail').exec();
    if (emailCheck.length > 0)
        return res.status(res.statusCode).json({ signupStatus: false });
    let saveResult = await publisher.save().then(data => data['publisherEmail'] == req.body['publisherEmail']);
    return res.status(res.statusCode).json({ signupStatus: saveResult });
}
exports.publisherSignUp = publisherSignUp;
async function publisherSignIn(req, res) {
    // check whether their app url is verified
    let publisherData = await Publisher_1.default.find({ publisherEmail: req.body['publisherEmail'] }).select('publisherPassword publisherSsid -_id').exec();
    if (publisherData.length < 1)
        return res.status(res.statusCode).json({ error: 'does-not-exist' });
    if (!bcrypt.compareSync(req.body['publisherPassword'], publisherData[0]['publisherPassword']))
        return res.status(res.statusCode).json({ loginStatus: false });
    res.cookie('PUBSSID', publisherData[0]['publisherSsid'], { path: '/publisher', maxAge: 1000 * 60 * 60 * 24 });
    res.cookie('API', apiServerUrl, { path: '/publisher', maxAge: 1000 * 60 * 60 * 24 });
    return res.status(res.statusCode).json({ loginStatus: true });
}
exports.publisherSignIn = publisherSignIn;
