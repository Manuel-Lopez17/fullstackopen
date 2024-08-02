import React, { createContext, useState, useContext, useCallback } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
	const [notification, setNotification] = useState(null);

	const addNotification = useCallback((message, type = 'info', duration = 5000) => {
		setNotification({ message, type });
		setTimeout(() => {
			setNotification(null);
		}, duration);
	}, []);

	return (
		<NotificationContext.Provider value={{ notification, addNotification }}>
			{children}
		</NotificationContext.Provider>
	);
};

export const useNotification = () => useContext(NotificationContext);
