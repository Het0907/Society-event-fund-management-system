import { useEffect, useMemo, useState } from 'react'
import { fetchMembers, createMember, updateMember, deleteMember } from '../api'
import Card from '../components/Card'
import Modal from '../components/Modal'
import { FaPlus, FaSearch, FaEdit, FaTrash, FaUser, FaHome, FaPhone, FaUsers } from 'react-icons/fa'

export default function MembersPage() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ full_name: '', house_number: '', contact_number: '' })
  const [editingId, setEditingId] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const data = await fetchMembers()
      setMembers(data)
    } catch (error) {
      console.error('Failed to load members:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    if (!query) return members
    const q = query.toLowerCase()
    return members.filter(m => 
      m.full_name.toLowerCase().includes(q) || 
      m.house_number.toLowerCase().includes(q) ||
      m.contact_number.toLowerCase().includes(q)
    )
  }, [query, members])

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await updateMember(editingId, form)
        setEditingId(null)
      } else {
        await createMember(form)
      }
      setForm({ full_name: '', house_number: '', contact_number: '' })
      setModalOpen(false)
      await load()
    } catch (error) {
      console.error('Failed to save member:', error)
    }
  }

  const onEdit = (m) => {
    setEditingId(m._id)
    setForm({ full_name: m.full_name, house_number: m.house_number, contact_number: m.contact_number })
    setModalOpen(true)
  }

  const onDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      try {
        await deleteMember(id)
        await load()
      } catch (error) {
        console.error('Failed to delete member:', error)
      }
    }
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingId(null)
    setForm({ full_name: '', house_number: '', contact_number: '' })
  }

  if (loading) {
    return <div className="loading">Loading members...</div>
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Society Members</h1>
          <p className="page-subtitle">
            Manage member information and contact details
          </p>
        </div>
        <button 
          onClick={() => { setEditingId(null); setForm({ full_name: '', house_number: '', contact_number: '' }); setModalOpen(true) }} 
          className="btn btn-primary"
        >
          <FaPlus /> Add New Member
        </button>
      </div>

      <Card variant="elevated">
        {/* Search and Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr auto', 
          gap: 'var(--space-4)', 
          alignItems: 'center',
          marginBottom: 'var(--space-6)'
        }}>
          <div style={{ position: 'relative' }}>
            <FaSearch style={{ 
              position: 'absolute', 
              left: 'var(--space-3)', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: 'var(--gray-400)',
              fontSize: '0.875rem'
            }} />
            <input 
              placeholder="Search by name, house number, or contact..." 
              value={query} 
              onChange={e => setQuery(e.target.value)}
              style={{ paddingLeft: 'var(--space-8)' }}
            />
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'var(--space-2)',
            color: 'var(--gray-600)',
            fontSize: '0.875rem',
            fontWeight: 500
          }}>
            <FaUsers />
            <span>{filtered.length} of {members.length} members</span>
          </div>
        </div>

        {/* Members Table */}
        {members.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <FaUsers />
            </div>
            <h3>No Members Yet</h3>
            <p>Add your first society member to get started with event management.</p>
            <button 
              onClick={() => setModalOpen(true)} 
              className="btn btn-primary mt-4"
            >
              <FaPlus /> Add First Member
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center" style={{ padding: 'var(--space-8)', color: 'var(--gray-500)' }}>
            <FaSearch style={{ fontSize: '2rem', marginBottom: 'var(--space-4)', opacity: 0.5 }} />
            <p>No members found matching your search.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <FaUser /> Full Name
                  </th>
                  <th style={{ minWidth: '120px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <FaHome /> House Number
                    </div>
                  </th>
                  <th style={{ minWidth: '140px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <FaPhone /> Contact Number
                    </div>
                  </th>
                  <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(m => (
                  <tr key={m._id}>
                    <td style={{ fontWeight: 500 }}>{m.full_name}</td>
                    <td>
                      <span style={{ 
                        background: 'var(--primary-50)', 
                        color: 'var(--primary-700)',
                        padding: 'var(--space-1) var(--space-2)',
                        borderRadius: 'var(--radius)',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}>
                        {m.house_number}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'monospace' }}>{m.contact_number}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'center' }}>
                        <button 
                          onClick={() => onEdit(m)}
                          className="btn btn-secondary btn-sm"
                          title="Edit member"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => onDelete(m._id, m.full_name)} 
                          className="btn btn-danger btn-sm"
                          title="Delete member"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal 
        open={modalOpen} 
        title={editingId ? 'Edit Member' : 'Add New Member'} 
        onClose={closeModal}
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
              <FaUser style={{ marginRight: 'var(--space-2)' }} />
              Full Name
            </label>
            <input 
              placeholder="Enter full name" 
              value={form.full_name} 
              onChange={e => setForm({ ...form, full_name: e.target.value })} 
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
              <FaHome style={{ marginRight: 'var(--space-2)' }} />
              House Number
            </label>
            <input 
              placeholder="e.g., A-101, B-25" 
              value={form.house_number} 
              onChange={e => setForm({ ...form, house_number: e.target.value })} 
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
              <FaPhone style={{ marginRight: 'var(--space-2)' }} />
              Contact Number
            </label>
            <input 
              placeholder="e.g., +91 9876543210" 
              value={form.contact_number} 
              onChange={e => setForm({ ...form, contact_number: e.target.value })} 
            />
          </div>
          
          <div style={{ 
            display: 'flex', 
            gap: 'var(--space-3)',
            marginTop: 'var(--space-4)'
          }}>
            <button 
              type="button" 
              onClick={closeModal}
              className="btn btn-secondary flex-1"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary flex-1"
            >
              {editingId ? <><FaEdit /> Update Member</> : <><FaPlus /> Add Member</>}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
