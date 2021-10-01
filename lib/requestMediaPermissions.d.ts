export declare type MediaPermissionsError = {
    type?: MediaPermissionsErrorType;
    name: string;
    message?: string;
};
export declare enum MediaPermissionsErrorType {
    /** (macOS) browser does not have permission to access cam/mic */
    SystemPermissionDenied = "SystemPermissionDenied",
    /** user denied permission for site to access cam/mic */
    UserPermissionDenied = "UserPermissionDenied",
    /** (Windows) browser does not have permission to access cam/mic OR camera is in use by another application or browser tab */
    CouldNotStartVideoSource = "CouldNotStartVideoSource",
    /** all other errors */
    Generic = "Generic"
}
/**
 * Request camera and mic permissions from the browser.
 * @returns
 */
export declare const requestMediaPermissions: (constraints?: MediaStreamConstraints | undefined) => Promise<boolean>;
export declare const requestAudioPermissions: () => Promise<boolean>;
export declare const requestVideoPermissions: () => Promise<boolean>;
