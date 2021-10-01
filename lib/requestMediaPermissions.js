"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestVideoPermissions = exports.requestAudioPermissions = exports.requestMediaPermissions = exports.MediaPermissionsErrorType = void 0;
const bowser_1 = __importDefault(require("bowser"));
var MediaPermissionsErrorType;
(function (MediaPermissionsErrorType) {
    /** (macOS) browser does not have permission to access cam/mic */
    MediaPermissionsErrorType["SystemPermissionDenied"] = "SystemPermissionDenied";
    /** user denied permission for site to access cam/mic */
    MediaPermissionsErrorType["UserPermissionDenied"] = "UserPermissionDenied";
    /** (Windows) browser does not have permission to access cam/mic OR camera is in use by another application or browser tab */
    MediaPermissionsErrorType["CouldNotStartVideoSource"] = "CouldNotStartVideoSource";
    /** all other errors */
    MediaPermissionsErrorType["Generic"] = "Generic";
})(MediaPermissionsErrorType = exports.MediaPermissionsErrorType || (exports.MediaPermissionsErrorType = {}));
/**
 * Request camera and mic permissions from the browser.
 * @returns
 */
const requestMediaPermissions = (constraints) => {
    return new Promise((resolve, reject) => {
        navigator.mediaDevices
            .getUserMedia(constraints !== null && constraints !== void 0 ? constraints : { audio: true, video: true })
            .then((stream) => {
            stream.getTracks().forEach((t) => {
                t.stop();
            });
            resolve(true);
        })
            .catch((err) => {
            const browser = bowser_1.default.getParser(window.navigator.userAgent);
            const browserName = browser.getBrowserName();
            const errName = err.name;
            const errMessage = err.message;
            let errorType = MediaPermissionsErrorType.Generic;
            if (browserName === 'Chrome') {
                if (errName === 'NotAllowedError') {
                    if (errMessage === 'Permission denied by system') {
                        errorType =
                            MediaPermissionsErrorType.SystemPermissionDenied;
                    }
                    else if (errMessage === 'Permission denied') {
                        errorType =
                            MediaPermissionsErrorType.UserPermissionDenied;
                    }
                }
                else if (errName === 'NotReadableError') {
                    errorType =
                        MediaPermissionsErrorType.CouldNotStartVideoSource;
                }
            }
            else if (browserName === 'Safari') {
                if (errName === 'NotAllowedError') {
                    errorType =
                        MediaPermissionsErrorType.UserPermissionDenied;
                }
            }
            else if (browserName === 'Microsoft Edge') {
                if (errName === 'NotAllowedError') {
                    errorType =
                        MediaPermissionsErrorType.UserPermissionDenied;
                }
                else if (errName === 'NotReadableError') {
                    errorType =
                        MediaPermissionsErrorType.CouldNotStartVideoSource;
                }
            }
            else if (browserName === 'Firefox') {
                // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#exceptions
                if (errName === 'NotFoundError') {
                    errorType =
                        MediaPermissionsErrorType.SystemPermissionDenied;
                }
                else if (errName === 'NotReadableError') {
                    errorType =
                        MediaPermissionsErrorType.SystemPermissionDenied;
                }
                else if (errName === 'NotAllowedError') {
                    errorType =
                        MediaPermissionsErrorType.UserPermissionDenied;
                }
                else if (errName === 'AbortError') {
                    errorType =
                        MediaPermissionsErrorType.CouldNotStartVideoSource;
                }
            }
            reject({
                type: errorType,
                name: err.name,
                message: err.message,
            });
            // Brave cannot be detected by the bowser library because they removed Brave from the User Agent to reduce fingerprinting
            // https://github.com/brave/browser-laptop/blob/master/CHANGELOG.md#090
        });
    });
};
exports.requestMediaPermissions = requestMediaPermissions;
const requestAudioPermissions = () => (0, exports.requestMediaPermissions)({ audio: true, video: false });
exports.requestAudioPermissions = requestAudioPermissions;
const requestVideoPermissions = () => (0, exports.requestMediaPermissions)({ audio: false, video: true });
exports.requestVideoPermissions = requestVideoPermissions;
