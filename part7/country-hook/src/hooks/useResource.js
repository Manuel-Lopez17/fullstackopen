import { useState, useEffect } from 'react'
import axios from 'axios'

export const useResource = (baseUrl) => {
	const [resources, setResources] = useState([])

	useEffect(() => {
		axios.get(baseUrl).then(response => {
			setResources(response.data)
		})
	}, [baseUrl])

	const create = async (newObject) => {
		const response = await axios.post(baseUrl, newObject)
		setResources(resources.concat(response.data))
	}

	return [
		resources,
		{
			create
		}
	]
}
