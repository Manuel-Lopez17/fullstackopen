import { configureStore } from '@reduxjs/toolkit'
import anecdoteReducer, { fetchAnecdotes } from './reducers/anecdoteReducer'
import filterReducer from './reducers/filterReducer'
import notificationReducer from './reducers/notificationReducer'

const store = configureStore({
	reducer: {
		anecdotes: anecdoteReducer,
		filter: filterReducer,
		notification: notificationReducer
	}
})

store.dispatch(fetchAnecdotes())

export default store
