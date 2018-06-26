"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const https = require("https");
const _1 = require("./");
const qs = require("querystring");
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
    console.log(req.body);
    let gRes = await verifyCaptcha(req.body['g-recaptcha-response'], req.ip).catch(err => err.code ? { error: err.code } : err);
    console.log(gRes);
    try {
        let data = JSON.parse(gRes.toString());
        if (data.success && data.success != false) {
            const path = '/advertiser/login', data = {
                username: req.body.username,
                password: req.body.password
            };
            let apiRes = await new _1.HttpRequest().post(path, data).catch(err => err.code ? { code: err.code } : err);
            if (apiRes.code)
                return res.status(res.statusCode).json({ error: 'CANT_CONTACT_API_SERVER' });
            else {
                // start session and send http cookies to the client, then redirect 
                // res.redirect('/client/advertiser/dashboard')
            }
        }
    }
    catch (err) {
        // error parsing json, jump to return statement below
    }
    res.cookie('SSID', 'gsg63g0gbcd53b', { path: '/', maxAge: 1000 * 60 * 60 * 24 });
    return res.status(res.statusCode).json({ message: 'success' });
}
exports.advertiserLogin = advertiserLogin;
async function advertiserSignUp(req, res) {
    // sign client up, follow oAuth protocol,
    // jwt standards and similar authentication protocols
    return res.end();
}
exports.advertiserSignUp = advertiserSignUp;
