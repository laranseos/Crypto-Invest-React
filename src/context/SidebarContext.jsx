import React, { useState, useContext } from 'react';

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isSignupOpen, setSignupOpen] = useState(false);
	const [isLogout, setLogout] = useState(false);

	const openSidebar = () => {
		setIsSidebarOpen(true);
		setSignupOpen(false);
		setLogout(false);
	};

	const closeSidebar = () => {
		setIsSidebarOpen(false);
		setSignupOpen(false);
	};

	const openSignup = () => {
		setSignupOpen(true);
		setIsSidebarOpen(false);
		setLogout(false);
	};

	const openLogout = () => {
		setLogout(true);
	}

	return (
		<AppContext.Provider
			value={{ isSidebarOpen, isSignupOpen, isLogout, openLogout, openSidebar, closeSidebar, openSignup }}
		>
			{children}
		</AppContext.Provider>
	);
};

export const useGlobalContext = () => {
	return useContext(AppContext);
};

export { AppContext, AppProvider };
