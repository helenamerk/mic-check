import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import './App.css';

import { MediaOnboardingDialog } from './components/MediaOnboardingDialog';

const theme = createTheme({
	components: {
		MuiButton: {
			styleOverrides: {
				root: { borderRadius: 20 },
			},
		},
		MuiDialog: {
			styleOverrides: {
				root: {
					borderRadius: 20,
				},
				paper: { borderRadius: 20, padding: 30 },
			},
		},
	},
	palette: {
		primary: {
			main: '#5568E5',
			dark: '#0a2463',
		},
		secondary: {
			main: '#CFDBFF',
		},
	},
	typography: {
		button: {
			textTransform: 'none',
		},
	},
});

function App() {
	return (
		<div className="App">
			<ThemeProvider theme={theme}>
				<header className="App-header"></header>
				<MediaOnboardingDialog />
			</ThemeProvider>
		</div>
	);
}

export default App;
