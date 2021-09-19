import Bowser from 'bowser';

export type MediaPermissionsError = {
	type?: MediaPermissionsErrorType;
	name: string;
	message?: string;
};

export enum MediaPermissionsErrorType {
	/** (macOS) browser does not have permission to access cam/mic */
	SystemPermissionDenied = 'SystemPermissionDenied',
	/** user denied permission for site to access cam/mic */
	UserPermissionDenied = 'UserPermissionDenied',
	/** (Windows) browser does not have permission to access cam/mic OR camera is in use by another application or browser tab */
	CouldNotStartVideoSource = 'CouldNotStartVideoSource',
	/** all other errors */
	Generic = 'Generic',
}

/**
 * Request camera and mic permissions from the browser.
 * @returns
 */
export const requestMediaPermissions = () => {
	return new Promise<boolean>((resolve, reject) => {
		let constraints = { audio: true, video: true };
		navigator.mediaDevices
			.getUserMedia(constraints)
			.then((stream: MediaStream) => {
				stream.getTracks().forEach((t) => {
					t.stop();
				});
				resolve(true);
			})
			.catch((err: any) => {
				const browser = Bowser.getParser(window.navigator.userAgent);
				const browserName = browser.getBrowserName();
				// console.log(browserName);
				// console.log(err.name);
				// console.log(err.message);
				// console.log(browser);

				const errName = err.name;
				const errMessage = err.message;
				let errorType: MediaPermissionsErrorType =
					MediaPermissionsErrorType.Generic;
				if (browserName === 'Chrome') {
					if (errName === 'NotAllowedError') {
						if (errMessage === 'Permission denied by system') {
							errorType =
								MediaPermissionsErrorType.SystemPermissionDenied;
						} else if (errMessage === 'Permission denied') {
							errorType =
								MediaPermissionsErrorType.UserPermissionDenied;
						}
					} else if (errName === 'NotReadableError') {
						errorType =
							MediaPermissionsErrorType.CouldNotStartVideoSource;
					}
				} else if (browserName === 'Safari') {
					if (errName === 'NotAllowedError') {
						errorType =
							MediaPermissionsErrorType.UserPermissionDenied;
					}
				} else if (browserName === 'Microsoft Edge') {
					if (errName === 'NotAllowedError') {
						errorType =
							MediaPermissionsErrorType.UserPermissionDenied;
					} else if (errName === 'NotReadableError') {
						errorType =
							MediaPermissionsErrorType.CouldNotStartVideoSource;
					}
				} else if (browserName === 'Firefox') {
					// https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#exceptions
					if (errName === 'NotFoundError') {
						errorType =
							MediaPermissionsErrorType.SystemPermissionDenied;
					} else if (errName === 'NotReadableError') {
						errorType =
							MediaPermissionsErrorType.SystemPermissionDenied;
					} else if (errName === 'NotAllowedError') {
						errorType =
							MediaPermissionsErrorType.UserPermissionDenied;
					} else if (errName === 'AbortError') {
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
