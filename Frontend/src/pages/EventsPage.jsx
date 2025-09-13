import { useEffect, useState } from 'react'
import { fetchEvents, createEvent, deleteEvent } from '../api'
import { Link } from 'react-router-dom'
import Card from '../components/Card'
import Modal from '../components/Modal'
import { FaPlus, FaCalendarAlt, FaTrash, FaEye, FaChartLine } from 'react-icons/fa'

export default function EventsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ event_name: '', event_year: new Date().getFullYear() })

  const load = async () => {
    setLoading(true)
    try {
      const data = await fetchEvents()
      setEvents(data)
    } catch (error) {
      console.error('Failed to load events:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      await createEvent({ ...form, event_year: Number(form.event_year) })
      setForm({ event_name: '', event_year: new Date().getFullYear() })
      setModalOpen(false)
      await load()
    } catch (error) {
      console.error('Failed to create event:', error)
    }
  }

  const handleDelete = async (eventId, eventName) => {
    if (window.confirm(`Are you sure you want to delete "${eventName}"? This action cannot be undone.`)) {
      try {
        await deleteEvent(eventId)
        await load()
      } catch (error) {
        console.error('Failed to delete event:', error)
      }
    }
  }

  const grouped = events.reduce((acc, e) => {
    acc[e.event_year] = acc[e.event_year] || []
    acc[e.event_year].push(e)
    return acc
  }, {})

  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a))

  if (loading) {
    return <div className="loading">Loading events...</div>
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Events Dashboard</h1>
          <p className="page-subtitle">
            Manage and track your society events and their financial details
          </p>
        </div>
        <button 
          onClick={() => setModalOpen(true)} 
          className="btn btn-primary"
        >
          <FaPlus /> Add New Event
        </button>
      </div>

      {events.length === 0 ? (
        <Card variant="elevated" className="text-center">
          <div className="empty-state">
            <div className="empty-state-icon">
              <FaCalendarAlt />
            </div>
            <h3>No Events Yet</h3>
            <p>Create your first event to start tracking finances and managing contributions.</p>
            <button 
              onClick={() => setModalOpen(true)} 
              className="btn btn-primary mt-4"
            >
              <FaPlus /> Create First Event
            </button>
          </div>
        </Card>
      ) : (
        years.map(year => (
          <div key={year} className="section-header">
            <h2 className="section-title">{year} Events</h2>
            <div className="grid grid-cols-auto-fill">
              {grouped[year].map(event => (
                <Card key={event._id} variant="elevated">
                  <div style={{ marginBottom: 'var(--space-4)' }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 'var(--space-2)',
                      marginBottom: 'var(--space-2)'
                    }}>
                      <FaCalendarAlt style={{ color: 'var(--primary-600)' }} />
                      <h3 style={{ 
                        margin: 0, 
                        fontSize: '1.25rem', 
                        fontWeight: 600,
                        color: 'var(--gray-900)'
                      }}>
                        {event.event_name}
                      </h3>
                    </div>
                    <p style={{ 
                      color: 'var(--gray-600)', 
                      margin: 0,
                      fontSize: '0.875rem'
                    }}>
                      Track contributions, expenses, and generate financial reports
                    </p>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    gap: 'var(--space-2)',
                    marginTop: 'var(--space-4)'
                  }}>
                    <Link 
                      to={`/events/${event._id}`}
                      className="btn btn-primary flex-1"
                      style={{ textDecoration: 'none', justifyContent: 'center' }}
                    >
                      <FaEye /> View Details
                    </Link>
                    <button 
                      onClick={() => handleDelete(event._id, event.event_name)}
                      className="btn btn-danger btn-sm"
                      style={{ padding: 'var(--space-3)' }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))
      )}

      <Modal 
        open={modalOpen} 
        title="Create New Event" 
        onClose={() => setModalOpen(false)}
        size="md"
      >
        <form onSubmit={onSubmit} className="grid gap-4">
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: 'var(--space-2)', 
              fontWeight: 500,
              color: 'var(--gray-700)'
            }}>
              Event Name
            </label>
            <input 
              placeholder="e.g., Annual Celebration, Diwali Function" 
              value={form.event_name} 
              onChange={e => setForm({ ...form, event_name: e.target.value })} 
              required 
            />
          </div>
          
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: 'var(--space-2)', 
              fontWeight: 500,
              color: 'var(--gray-700)'
            }}>
              Event Year
            </label>
            <input 
              type="number" 
              min="2020"
              max="2030"
              placeholder="Event Year" 
              value={form.event_year} 
              onChange={e => setForm({ ...form, event_year: e.target.value })} 
              required 
            />
          </div>
          
          <div style={{ 
            display: 'flex', 
            gap: 'var(--space-3)',
            marginTop: 'var(--space-4)'
          }}>
            <button 
              type="button" 
              onClick={() => setModalOpen(false)}
              className="btn btn-secondary flex-1"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary flex-1"
            >
              <FaPlus /> Create Event
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
