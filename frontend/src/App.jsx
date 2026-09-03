import { useMemo, useState } from 'react'

const classifications = [
  'SOFTWARE / IT RELATED',
  'PARTIALLY SOFTWARE / IT RELATED',
  'NOT SOFTWARE / IT RELATED',
  'UNCLEAR',
]

const basicFields = [
  ['country', 'Country'],
  ['projectName', 'Project Name'],
  ['tenderTitle', 'Tender Title'],
  ['referenceNo', 'Reference No.'],
  ['tenderId', 'Tender ID'],
  ['client', 'Client / Organization'],
  ['portal', 'Portal'],
  ['publishedDate', 'Published Date'],
  ['lastDate', 'Last Date (Submission Deadline)'],
  ['submissionTime', 'Submission Time'],
]

const commercialFields = [
  ['tenderSecurity', 'Tender Security'],
  ['contractPeriod', 'Contract / Service Period'],
  ['tenderDocPrice', 'Tender Document Price'],
  ['performanceSecurity', 'Performance Security'],
]

const eligibilityFields = [
  ['generalExperience', 'General Experience'],
  ['similarExperience', 'Similar Experience'],
  ['similarProjectValue', 'Similar Project Value'],
  ['avgTurnover', 'Average Annual Turnover'],
  ['financialResources', 'Financial Resources'],
  ['certification', 'Required Certification'],
  ['localPresence', 'Local Presence'],
]

function emptyTender(id) {
  return {
    id,
    classification: '',
    basic: Object.fromEntries(basicFields.map(([key]) => [key, ''])),
    mainIdea: '',
    commercial: Object.fromEntries(commercialFields.map(([key]) => [key, ''])),
    technical: [''],
    technology: [''],
    operational: [''],
    eligibility: Object.fromEntries(eligibilityFields.map(([key]) => [key, ''])),
    jv: { participation: '', leadMember: '', memberRules: '', localPartner: '', jvAgreement: '' },
    documents: [''],
    management: [''],
    notes: '',
  }
}

function App() {
  const [entries, setEntries] = useState([])
  const [current, setCurrent] = useState(null)
  const [query, setQuery] = useState('')
  const [saved, setSaved] = useState(true)

  const filteredEntries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return entries.filter((entry) =>
      [entry.basic.tenderTitle, entry.basic.tenderId, entry.basic.referenceNo]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery),
    )
  }, [entries, query])

  function startNew() {
    setCurrent(emptyTender(`t_${Date.now()}`))
    setSaved(false)
  }

  function updatePath(path, value) {
    const [section, key] = path.split('.')
    setCurrent((entry) => ({ ...entry, [section]: { ...entry[section], [key]: value } }))
    setSaved(false)
  }

  function updateList(key, index, value) {
    setCurrent((entry) => {
      const next = [...entry[key]]
      next[index] = value
      return { ...entry, [key]: next }
    })
    setSaved(false)
  }

  function addListItem(key) {
    setCurrent((entry) => ({ ...entry, [key]: [...entry[key], ''] }))
    setSaved(false)
  }

  function removeListItem(key, index) {
    setCurrent((entry) => {
      const next = entry[key].filter((_, itemIndex) => itemIndex !== index)
      return { ...entry, [key]: next.length ? next : [''] }
    })
    setSaved(false)
  }

  function saveCurrent() {
    if (!current) return
    setEntries((existing) => {
      const summary = {
        ...current,
        title: current.basic.tenderTitle || current.basic.projectName || 'Untitled tender',
      }
      const index = existing.findIndex((entry) => entry.id === current.id)
      if (index === -1) return [...existing, summary]
      const next = [...existing]
      next[index] = summary
      return next
    })
    setSaved(true)
  }

  function deleteCurrent() {
    if (!current || !window.confirm('Delete this tender entry?')) return
    setEntries((existing) => existing.filter((entry) => entry.id !== current.id))
    setCurrent(null)
  }

  function renderFields(section, fields, values) {
    return (
      <div className="field-grid">
        {fields.map(([key, label]) => (
          <label className="field" key={key}>
            <span>{label}</span>
            <input value={values[key]} onChange={(event) => updatePath(`${section}.${key}`, event.target.value)} />
          </label>
        ))}
      </div>
    )
  }

  function renderListEditor(key, placeholder) {
    return (
      <div className="list-editor">
        {current[key].map((value, index) => (
          <div className="list-row" key={`${key}-${index}`}>
            <input
              value={value}
              placeholder={placeholder}
              onChange={(event) => updateList(key, index, event.target.value)}
            />
            <button className="remove-button" onClick={() => removeListItem(key, index)} aria-label="Remove line">
              ×
            </button>
          </div>
        ))}
        <button className="add-button" onClick={() => addListItem(key)}>+ Add line</button>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <header className="sidebar-header">
          <h1>Tender Registry</h1>
          <p>Data entry - fields from the Tender Summary template</p>
        </header>
        <button className="new-button" onClick={startNew}>+ New tender entry</button>
        <div className="search">
          <input placeholder="Search by title, ref no. or ID..." value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
        <div className="entry-list">
          {filteredEntries.length === 0 ? (
            <p className="empty-sidebar">{entries.length ? 'No matches.' : 'No entries yet. Start a new entry.'}</p>
          ) : filteredEntries.map((entry) => (
            <button className={`entry-card ${current?.id === entry.id ? 'active' : ''}`} key={entry.id} onClick={() => { setCurrent(entry); setSaved(true) }}>
              <small>{entry.basic.tenderId || 'No ID'} {entry.basic.referenceNo && `· ${entry.basic.referenceNo}`}</small>
              <strong>{entry.title}</strong>
              <span>{entry.basic.lastDate ? `Deadline: ${entry.basic.lastDate}` : 'No deadline set'}</span>
            </button>
          ))}
        </div>
      </aside>

      <main className="main-panel">
        {!current ? (
          <div className="empty-main">
            <h2>No entry selected</h2>
            <p>Choose a tender from the list or start a new entry to capture the summary fields.</p>
          </div>
        ) : (
          <>
            <div className="topbar">
              <span className={saved ? 'status saved' : 'status'}><i />{saved ? 'Saved' : 'Unsaved changes'}</span>
              <div className="actions">
                <button onClick={() => downloadJson(current)}>Export JSON</button>
                <button className="danger" onClick={deleteCurrent}>Delete</button>
                <button className="primary" onClick={saveCurrent}>Save entry</button>
              </div>
            </div>
            <div className="content">
              <input className="title-input" value={current.basic.tenderTitle} placeholder="Tender title..." onChange={(event) => updatePath('basic.tenderTitle', event.target.value)} />
              <p className="id-line">{current.basic.tenderId || 'Tender ID not set'} {current.basic.referenceNo && `· ${current.basic.referenceNo}`}</p>
              <div className="classification">
                {classifications.map((classification) => <button className={current.classification === classification ? 'active' : ''} key={classification} onClick={() => { setCurrent({ ...current, classification }); setSaved(false) }}>{classification}</button>)}
              </div>
              <section><h2>Basic Information</h2>{renderFields('basic', basicFields, current.basic)}</section>
              <section><h2>Requirements</h2><h3>Main Idea</h3><textarea value={current.mainIdea} onChange={(event) => { setCurrent({ ...current, mainIdea: event.target.value }); setSaved(false) }} placeholder="What the tender is about and what the client wants..." /><h3>Commercial Requirements</h3>{renderFields('commercial', commercialFields, current.commercial)}<h3>Technical Requirements</h3>{renderListEditor('technical', 'e.g. Web-based information management system')}<h3>Software / Technology Mentioned</h3>{renderListEditor('technology', 'e.g. Oracle Database, RFID, GIS')}<h3>Operational / Service Requirements</h3>{renderListEditor('operational', 'e.g. Operation and maintenance, user support')}</section>
              <section><h2>Key Eligibility / Qualification</h2><p className="hint">The tender's stated requirement only - not a bidder-specific assessment.</p>{renderFields('eligibility', eligibilityFields, current.eligibility)}</section>
              <section><h2>JV / Consortium</h2>{renderFields('jv', [['participation', 'JV Participation'], ['leadMember', 'Lead Member Requirement'], ['memberRules', 'Member Qualification / Experience Rules'], ['localPartner', 'Local Partner Requirement'], ['jvAgreement', 'JV Agreement Requirement']], current.jv)}</section>
              <section><h2>Documents Required in Submission</h2>{renderListEditor('documents', 'Required submission document')}</section>
              <section><h2>Important for Management</h2>{renderListEditor('management', 'Relevance, opportunity, requirement, concern, or deadline')}</section>
              <section><h2>Notes / Comments</h2><textarea value={current.notes} onChange={(event) => { setCurrent({ ...current, notes: event.target.value }); setSaved(false) }} /></section>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

function downloadJson(entry) {
  const blob = new Blob([JSON.stringify(entry, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${entry.basic.tenderId || entry.id}.json`
  link.click()
  URL.revokeObjectURL(url)
}

export default App
