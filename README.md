# mic-check

A lightweight package for requesting camera and microphone permissions from the browser with better error handling.

---

## Installation

```
npm install mic-check
```

or

```
yarn add mic-check
```

## Usage

```ts
import {
  MediaPermissionsError
  MediaPermissionsErrorType,
  requestMediaPermissions
} from 'mic-check';

requestMediaPermissions()
	.then(() => {
		// can successfully access camera and microphone streams
		// DO SOMETHING HERE
	})
	.catch((err: MediaPermissionsError) => {
		const { type, name, message } = err;
		if (type === MediaPermissionsErrorType.SystemPermissionDenied) {
			// browser does not have permission to access camera or microphone
		} else if (type === MediaPermissionsErrorType.UserPermissionDenied) {
			// user didn't allow app to access camera or microphone
		} else if (type === MediaPermissionsErrorType.CouldNotStartVideoSource) {
			// camera is in use by another application (Zoom, Skype) or browser tab (Google Meet, Messenger Video)
			// (mostly Windows specific problem)
		} else {
			// not all error types are handled by this library
		}
	});

```

## Dependencies

### [bowser](https://github.com/lancedikson/bowser)

A small, fast and rich-API browser/platform/engine detector for both browser and node.
