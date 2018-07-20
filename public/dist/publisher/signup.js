var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
(function (f) {
    if (typeof module != 'undefined')
        throw new Error('Should not run in Node environment!');
    f();
})(function () {
    var pubForm = document.forms['publisherSignUp'], websiteUrl = pubForm.querySelector('input[name="publisherWebsite"]');
    var api = 'http://127.0.0.1:5000';
    if (!window.location.origin.includes('127.0.0.1'))
        api = 'https://adxserver.herokuapp.com';
    websiteUrl.addEventListener('blur', function (e) {
        return __awaiter(this, void 0, void 0, function () {
            var verificationStatus;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        document.getElementById('verificationStatus').innerHTML = '<span class="text-info">Verifying url ...<span class="mdi mdi-loading mdi-spin"></span></span>';
                        return [4 /*yield*/, asyncRequest(api + '/api/v1/data/validate-url', { url: this.value })];
                    case 1:
                        verificationStatus = _a.sent();
                        if (verificationStatus['status'] == true)
                            document.getElementById('verificationStatus').innerHTML = '<span class="text-success">Url has been approved</span>';
                        else
                            document.getElementById('verificationStatus').innerHTML = '<small class="text-danger">Url verification failed. Ensure url exists and does not contain http:// or https://</small>';
                        return [2 /*return*/];
                }
            });
        });
    });
    pubForm.addEventListener('submit', function (e) {
        return __awaiter(this, void 0, void 0, function () {
            var pubData, signUpStatus;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        e.preventDefault();
                        return [4 /*yield*/, extractFormData(this)];
                    case 1:
                        pubData = _a.sent();
                        return [4 /*yield*/, asyncRequest('/api/publisher/signup', pubData)];
                    case 2:
                        signUpStatus = _a.sent();
                        console.log(pubData);
                        return [2 /*return*/];
                }
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbnVwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3B1Ymxpc2hlci9zaWdudXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxDQUFDLFVBQVUsQ0FBQztJQUNSLElBQUksT0FBTyxNQUFNLElBQUksV0FBVztRQUM1QixNQUFNLElBQUksS0FBSyxDQUFDLHFDQUFxQyxDQUFDLENBQUE7SUFDMUQsQ0FBQyxFQUFFLENBQUE7QUFDUCxDQUFDLENBQUMsQ0FBQztJQUNDLElBQUksT0FBTyxHQUFvQixRQUFRLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLEVBQzVELFVBQVUsR0FBcUIsT0FBTyxDQUFDLGFBQWEsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFBO0lBRTFGLElBQUksR0FBRyxHQUFHLHVCQUF1QixDQUFBO0lBQ2pDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDO1FBQzdDLEdBQUcsR0FBRyxpQ0FBaUMsQ0FBQTtJQUUzQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLFVBQWdCLENBQUM7Ozs7Ozt3QkFDakQsUUFBUSxDQUFDLGNBQWMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLFNBQVMsR0FBRyxnR0FBZ0csQ0FBQTt3QkFDakkscUJBQU0sWUFBWSxDQUFDLEdBQUcsR0FBRywyQkFBMkIsRUFBRSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBQTs7d0JBQS9GLGtCQUFrQixHQUFHLFNBQTBFO3dCQUNuRyxJQUFJLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxJQUFJLElBQUk7NEJBQ3BDLFFBQVEsQ0FBQyxjQUFjLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxTQUFTLEdBQUcseURBQXlELENBQUE7OzRCQUVuSCxRQUFRLENBQUMsY0FBYyxDQUFDLG9CQUFvQixDQUFDLENBQUMsU0FBUyxHQUFHLHdIQUF3SCxDQUFBOzs7OztLQUN6TCxDQUFDLENBQUE7SUFFRixPQUFPLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFVBQWdCLENBQUM7Ozs7Ozt3QkFDaEQsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFBO3dCQUNKLHFCQUFNLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBQTs7d0JBQXJDLE9BQU8sR0FBRyxTQUEyQjt3QkFDdEIscUJBQU0sWUFBWSxDQUFDLHVCQUF1QixFQUFFLE9BQU8sQ0FBQyxFQUFBOzt3QkFBbkUsWUFBWSxHQUFHLFNBQW9EO3dCQUV2RSxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFBOzs7OztLQUN2QixDQUFDLENBQUE7QUFDTixDQUFDLENBQUMsQ0FBQSJ9