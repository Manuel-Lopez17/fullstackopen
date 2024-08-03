const notificationReducer = (state, action) => {
	switch (action.type) {
		case 'SET_NOTIFICATION':
			return action.payload;
		case 'CLEAR_NOTIFICATION':
			return null;
		default:
			return state;
	}
};

export const setNotification = (message, type = 'info', duration = 5000) => {
	return dispatch => {
		dispatch({ type: 'SET_NOTIFICATION', payload: { message, type } });
		setTimeout(() => {
			dispatch({ type: 'CLEAR_NOTIFICATION' });
		}, duration);
	};
};

export default notificationReducer;
