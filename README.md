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

## Documentation

### Errors

| Error Type (MediaPermissionsError) | Description                                                                |
| ---------------------------------- | -------------------------------------------------------------------------- |
| SystemPermissionDenied             | Browser does not have access to camera or microphone (common on macOS)     |
| UserPermissionDenied               | User did not grant camera or microphone permissions in the popup           |
| CouldNotStartVideoSource           | Another application or browser tab is using the camera (common on Windows) |
| Generic                            | Everything else                                                            |

## Dependencies

### [bowser](https://github.com/lancedikson/bowser)

A small, fast and rich-API browser/platform/engine detector for both browser and node.

## Resources

-   [Common getUserMedia() Errors](https://blog.addpipe.com/common-getusermedia-errors/) - A great read explaining various errors when calling getUserMedia() on Firefox vs Chrome. (slightly outdated)
-   [MediaDevices.getUserMedia()](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia) - Mozilla's documentation for the reason behind errors when calling getUserMedia().
-   [StackOverflow: reprompt for permissions with getUserMedia() after initial denial](https://stackoverflow.com/a/52701322/6643002) - Some good responses for ways to ask for permission to access camera and microphone.
