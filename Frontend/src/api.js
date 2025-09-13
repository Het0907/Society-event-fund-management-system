import axios from 'axios'

export const api = axios.create({
  baseURL: '/api'
})

// Members
export const fetchMembers = () => api.get('/members').then(r => r.data)
export const createMember = (data) => api.post('/members', data).then(r => r.data)
export const updateMember = (id, data) => api.put(`/members/${id}`, data).then(r => r.data)
export const deleteMember = (id) => api.delete(`/members/${id}`).then(r => r.data)

// Events
export const fetchEvents = () => api.get('/events').then(r => r.data)
export const createEvent = (data) => api.post('/events', data).then(r => r.data)
export const updateEvent = (id, data) => api.put(`/events/${id}`, data).then(r => r.data)
export const deleteEvent = (id) => api.delete(`/events/${id}`).then(r => r.data)

// Contributions
export const fetchContributions = (eventId) => api.get(`/events/${eventId}/contributions`).then(r => r.data)
export const createContribution = (eventId, data) => api.post(`/events/${eventId}/contributions`, data).then(r => r.data)
export const updateContribution = (eventId, id, data) => api.put(`/events/${eventId}/contributions/${id}`, data).then(r => r.data)
export const deleteContribution = (eventId, id) => api.delete(`/events/${eventId}/contributions/${id}`).then(r => r.data)

// Expenses
export const fetchExpenses = (eventId) => api.get(`/events/${eventId}/expenses`).then(r => r.data)
export const createExpense = (eventId, data) => api.post(`/events/${eventId}/expenses`, data).then(r => r.data)
export const updateExpense = (eventId, id, data) => api.put(`/events/${eventId}/expenses/${id}`, data).then(r => r.data)
export const deleteExpense = (eventId, id) => api.delete(`/events/${eventId}/expenses/${id}`).then(r => r.data)

// Reports
export const downloadExcel = async (eventId, fileName) => {
  const response = await api.get(`/events/${eventId}/report/excel`, { responseType: 'blob' })
  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
  link.remove()
}
