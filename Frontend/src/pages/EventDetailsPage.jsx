import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchMembers, fetchContributions, createContribution, deleteContribution, fetchExpenses, createExpense, deleteExpense, fetchEvents, downloadExcel } from '../api'
import StatCard from '../components/StatCard'
import Card from '../components/Card'
import { FaDownload, FaPlus, FaMoneyBillWave, FaReceipt, FaUsers, FaStore, FaTrash, FaCalendarAlt, FaArrowUp, FaArrowDown } from 'react-icons/fa'

export default function EventDetailsPage() {
  const { eventId } = useParams()
  const [members, setMembers] = useState([])
  const [event, setEvent] = useState(null)
  const [contribs, setContribs] = useState([])
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)

  const [contribForm, setContribForm] = useState({ member_id: '', attendees: 0, amount_paid: 0, payment_date: '' })
  const [expenseForm, setExpenseForm] = useState({ vendor_name: '', description: '', amount_paid: 0, payment_date: '' })

  const load = async () => {
    setLoading(true)
    try {
      const [m, c, e, evs] = await Promise.all([
        fetchMembers(),
        fetchContributions(eventId),
        fetchExpenses(eventId),
        fetchEvents()
      ])
      setMembers(m)
      setContribs(c)
      setExpenses(e)
      setEvent(evs.find(x => x._id === eventId) || null)
    } catch (error) {
      console.error('Failed to load event details:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [eventId])

  const totals = useMemo(() => {
    const totalCollections = contribs.reduce((sum, x) => sum + Number(x.amount_paid || 0), 0)
    const totalExpenses = expenses.reduce((sum, x) => sum + Number(x.amount_paid || 0), 0)
    const surplus = totalCollections - totalExpenses
    return { totalCollections, totalExpenses, surplus }
  }, [contribs, expenses])

  const onAddContribution = async (e) => {
    e.preventDefault()
    try {
      await createContribution(eventId, { 
        ...contribForm, 
        attendees: contribForm.attendees ? Number(contribForm.attendees) : null, 
        amount_paid: Number(contribForm.amount_paid),
        payment_date: contribForm.payment_date || null
      })
      setContribForm({ member_id: '', attendees: 0, amount_paid: 0, payment_date: '' })
      await load()
    } catch (error) {
      console.error('Failed to add contribution:', error)
    }
  }

  const onAddExpense = async (e) => {
    e.preventDefault()
    try {
      await createExpense(eventId, { 
        ...expenseForm, 
        amount_paid: Number(expenseForm.amount_paid) 
      })
      setExpenseForm({ vendor_name: '', description: '', amount_paid: 0, payment_date: '' })
      await load()
    } catch (error) {
      console.error('Failed to add expense:', error)
    }
  }

  const onDownloadExcel = async () => {
    try {
      const name = event ? `${event.event_name.replace(/\s+/g, '_')}_${event.event_year}_Financial_Report.xlsx` : 'Event_Report.xlsx'
      await downloadExcel(eventId, name)
    } catch (error) {
      console.error('Failed to download report:', error)
    }
  }

  const handleDeleteContribution = async (contribId, memberName) => {
    if (window.confirm(`Remove contribution from ${memberName}?`)) {
      try {
        await deleteContribution(eventId, contribId)
        await load()
      } catch (error) {
        console.error('Failed to delete contribution:', error)
      }
    }
  }

  const handleDeleteExpense = async (expenseId, vendor) => {
    if (window.confirm(`Remove expense from ${vendor}?`)) {
      try {
        await deleteExpense(eventId, expenseId)
        await load()
      } catch (error) {
        console.error('Failed to delete expense:', error)
      }
    }
  }

  if (loading) {
    return <div className="loading">Loading event details...</div>
  }

  if (!event) {
    return (
      <div className="empty-state">
        <h3>Event Not Found</h3>
        <p>The requested event could not be found.</p>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <FaCalendarAlt style={{ marginRight: 'var(--space-3)', color: 'var(--primary-600)' }} />
            {event.event_name}
          </h1>
          <p className="page-subtitle">
            Financial tracking for {event.event_year} • {contribs.length} contributions • {expenses.length} expenses
          </p>
        </div>
        <button 
          onClick={onDownloadExcel} 
          className="btn btn-secondary"
        >
          <FaDownload /> Download Excel Report
        </button>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-3 mb-8">
        <StatCard 
          label="Total Collections" 
          value={`₹${totals.totalCollections.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
          trend="up" 
          color="var(--success-600)"
          subtitle={`From ${contribs.length} member contributions`}
          icon={<FaArrowUp />}
        />
        <StatCard 
          label="Total Expenses" 
          value={`₹${totals.totalExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
          trend="down" 
          color="var(--warning-600)"
          subtitle={`Across ${expenses.length} vendor payments`}
          icon={<FaArrowDown />}
        />
        <StatCard 
          label={totals.surplus >= 0 ? 'Surplus' : 'Deficit'} 
          value={`₹${Math.abs(totals.surplus).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
          trend={totals.surplus >= 0 ? 'up' : 'down'} 
          color={totals.surplus >= 0 ? 'var(--success-600)' : 'var(--danger-600)'}
          subtitle={totals.surplus >= 0 ? 'Available balance' : 'Amount over budget'}
          icon={totals.surplus >= 0 ? <FaArrowUp /> : <FaArrowDown />}
        />
      </div>

      {/* Contributions and Expenses */}
      <div className="grid grid-cols-2">
        {/* Member Contributions */}
        <Card 
          title="Member Contributions" 
          subtitle="Payments received from society members for this event"
          variant="elevated"
        >
          <form onSubmit={onAddContribution} className="grid gap-4 mb-6">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Select Member
              </label>
              <select 
                value={contribForm.member_id} 
                onChange={e => setContribForm({ ...contribForm, member_id: e.target.value })} 
                required
              >
                <option value="">Choose a member...</option>
                {members.map(m => (
                  <option key={m._id} value={m._id}>
                    {m.house_number} - {m.full_name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Attendees
                </label>
                <input 
                  type="number" 
                  min="0"
                  placeholder="0" 
                  value={contribForm.attendees} 
                  onChange={e => setContribForm({ ...contribForm, attendees: e.target.value })} 
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Amount (₹)
                </label>
                <input 
                  type="number" 
                  min="0"
                  step="0.01"
                  placeholder="0.00" 
                  value={contribForm.amount_paid} 
                  onChange={e => setContribForm({ ...contribForm, amount_paid: e.target.value })} 
                  required 
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Payment Date
                </label>
                <input 
                  type="date" 
                  value={contribForm.payment_date} 
                  onChange={e => setContribForm({ ...contribForm, payment_date: e.target.value })} 
                />
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary">
              <FaPlus /> Add Contribution
            </button>
          </form>

          {/* Contributions Table */}
          <div style={{ overflowX: 'auto' }}>
            {contribs.length === 0 ? (
              <div className="text-center" style={{ padding: 'var(--space-8)', color: 'var(--gray-500)' }}>
                <FaUsers style={{ fontSize: '2rem', marginBottom: 'var(--space-4)', opacity: 0.5 }} />
                <p>No contributions recorded yet.</p>
                <p className="text-sm">Add the first contribution to get started.</p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>House</th>
                    <th>Member</th>
                    <th className="text-center">Attendees</th>
                    <th className="text-right">Amount</th>
                    <th>Date</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[...contribs]
                    .sort((a, b) => {
                      const ha = a.member_id?.house_number || '';
                      const hb = b.member_id?.house_number || '';
                      return ha.localeCompare(hb, undefined, { numeric: true, sensitivity: 'base' });
                    })
                    .map(c => (
                      <tr key={c._id}>
                        <td>
                          <span style={{ 
                            background: 'var(--primary-50)', 
                            color: 'var(--primary-700)',
                            padding: 'var(--space-1) var(--space-2)',
                            borderRadius: 'var(--radius)',
                            fontSize: '0.75rem',
                            fontWeight: 600
                          }}>
                            {c.member_id?.house_number || 'N/A'}
                          </span>
                        </td>
                        <td className="font-semibold">{c.member_id?.full_name || 'Unknown Member'}</td>
                        <td className="text-center">{c.attendees}</td>
                        <td className="text-right font-semibold text-success">
                          ₹{Number(c.amount_paid).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="text-sm">{c.payment_date?.slice(0,10) || 'Not specified'}</td>
                        <td className="text-center">
                          <button 
                            onClick={() => handleDeleteContribution(c._id, c.member_id?.full_name)}
                            className="btn btn-danger btn-sm"
                            title="Remove contribution"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>

        {/* Vendor Expenses */}
        <Card 
          title="Vendor Expenses" 
          subtitle="Payments made to vendors for services and purchases"
          variant="elevated"
        >
          <form onSubmit={onAddExpense} className="grid gap-4 mb-6">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Vendor Name
              </label>
              <input 
                placeholder="e.g., Catering Service, DJ, Decorator" 
                value={expenseForm.vendor_name} 
                onChange={e => setExpenseForm({ ...expenseForm, vendor_name: e.target.value })} 
                required 
              />
            </div>
            
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Description
              </label>
              <input 
                placeholder="e.g., Food catering for 100 people, Sound system rental" 
                value={expenseForm.description} 
                onChange={e => setExpenseForm({ ...expenseForm, description: e.target.value })} 
                required 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Amount (₹)
                </label>
                <input 
                  type="number" 
                  min="0"
                  step="0.01"
                  placeholder="0.00" 
                  value={expenseForm.amount_paid} 
                  onChange={e => setExpenseForm({ ...expenseForm, amount_paid: e.target.value })} 
                  required 
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Payment Date
                </label>
                <input 
                  type="date" 
                  value={expenseForm.payment_date} 
                  onChange={e => setExpenseForm({ ...expenseForm, payment_date: e.target.value })} 
                  required 
                />
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary">
              <FaPlus /> Add Expense
            </button>
          </form>

          {/* Expenses Table */}
          <div style={{ overflowX: 'auto' }}>
            {expenses.length === 0 ? (
              <div className="text-center" style={{ padding: 'var(--space-8)', color: 'var(--gray-500)' }}>
                <FaStore style={{ fontSize: '2rem', marginBottom: 'var(--space-4)', opacity: 0.5 }} />
                <p>No expenses recorded yet.</p>
                <p className="text-sm">Add the first expense to track spending.</p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Vendor</th>
                    <th>Description</th>
                    <th className="text-right">Amount</th>
                    <th>Date</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map(x => (
                    <tr key={x._id}>
                      <td className="font-semibold">{x.vendor_name}</td>
                      <td className="text-sm">{x.description}</td>
                      <td className="text-right font-semibold text-danger">
                        ₹{Number(x.amount_paid).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="text-sm">{x.payment_date?.slice(0,10) || 'Not specified'}</td>
                      <td className="text-center">
                        <button 
                          onClick={() => handleDeleteExpense(x._id, x.vendor_name)}
                          className="btn btn-danger btn-sm"
                          title="Remove expense"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
