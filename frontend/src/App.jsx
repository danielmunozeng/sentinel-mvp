import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

const API_URL = 'https://organic-carnival-x596qgwqvwq629qq-8000.app.github.dev/api/evaluations/'

function App() {
  const [evaluations, setEvaluations] = useState([])
  const [form, setForm] = useState({
    company_name: '',
    responsible_name: '',
    evaluation_date: '',
    risk_level: 'Low',
    status: 'Pending',
    observations: '',
  })
  const [editingId, setEditingId] = useState(null)

  const fetchEvaluations = async () => {
    try {
      const response = await axios.get(API_URL)
      setEvaluations(response.data)
    } catch (error) {
      console.error('Error loading evaluations:', error)
    }
  }

  useEffect(() => {
    fetchEvaluations()
  }, [])

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const resetForm = () => {
    setForm({
      company_name: '',
      responsible_name: '',
      evaluation_date: '',
      risk_level: 'Low',
      status: 'Pending',
      observations: '',
    })
    setEditingId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await axios.put(`${API_URL}${editingId}/`, form)
      } else {
        await axios.post(API_URL, form)
      }
      fetchEvaluations()
      resetForm()
    } catch (error) {
      console.error('Error saving evaluation:', error)
    }
  }

  const handleEdit = (evaluation) => {
    setForm({
      company_name: evaluation.company_name,
      responsible_name: evaluation.responsible_name,
      evaluation_date: evaluation.evaluation_date,
      risk_level: evaluation.risk_level,
      status: evaluation.status,
      observations: evaluation.observations,
    })
    setEditingId(evaluation.id)
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this evaluation?')
    if (!confirmDelete) return

    try {
      await axios.delete(`${API_URL}${id}/`)
      fetchEvaluations()
    } catch (error) {
      console.error('Error deleting evaluation:', error)
    }
  }

  const getRiskClass = (risk) => {
    switch (risk) {
      case 'Low':
        return 'risk low'
      case 'Medium':
        return 'risk medium'
      case 'High':
        return 'risk high'
      case 'Critical':
        return 'risk critical'
      default:
        return 'risk'
    }
  }

  return (
    <div className="container">
      <header>
        <h1>TDS Sentinel MVP</h1>
        <p>Cybersecurity Risk Evaluations CRUD</p>
      </header>

      <section className="card">
        <h2>{editingId ? 'Edit Evaluation' : 'Create Evaluation'}</h2>
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            name="company_name"
            placeholder="Company name"
            value={form.company_name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="responsible_name"
            placeholder="Responsible name"
            value={form.responsible_name}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="evaluation_date"
            value={form.evaluation_date}
            onChange={handleChange}
            required
          />
          <select name="risk_level" value={form.risk_level} onChange={handleChange}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <textarea
            name="observations"
            placeholder="Observations"
            value={form.observations}
            onChange={handleChange}
            rows="4"
          />
          <div className="actions">
            <button type="submit">{editingId ? 'Update' : 'Create'}</button>
            <button type="button" onClick={resetForm} className="secondary">
              Clear
            </button>
          </div>
        </form>
      </section>

      <section className="card">
        <h2>Evaluation List</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Responsible</th>
                <th>Date</th>
                <th>Risk</th>
                <th>Status</th>
                <th>Observations</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {evaluations.length > 0 ? (
                evaluations.map((evaluation) => (
                  <tr key={evaluation.id}>
                    <td>{evaluation.company_name}</td>
                    <td>{evaluation.responsible_name}</td>
                    <td>{evaluation.evaluation_date}</td>
                    <td>
                      <span className={getRiskClass(evaluation.risk_level)}>
                        {evaluation.risk_level}
                      </span>
                    </td>
                    <td>{evaluation.status}</td>
                    <td>{evaluation.observations}</td>
                    <td>
                      <button onClick={() => handleEdit(evaluation)} className="small">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(evaluation.id)} className="small danger">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No evaluations found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default App