'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { KpiCard } from '@/components/dashboard/KpiCard'
import { sampleLeads } from '@/lib/seed'
import { Lead, LeadStage } from '@/types/domain'

const stages: { key: LeadStage; title: string }[] = [
  { key: 'new_lead', title: 'New Lead' },
  { key: 'contacted', title: 'Contacted' },
  { key: 'demo_scheduled', title: 'Demo Scheduled' },
  { key: 'trial_started', title: 'Trial Started' },
  { key: 'converted', title: 'Converted' },
  { key: 'lost', title: 'Lost' }
]

const sourceColors: Record<Lead['leadSource'], string> = {
  Website: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
  Referral: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
  'Cold Call': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
  Other: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
}

export default function SalesPipelinePage() {
  const [leads, setLeads] = useState<Record<LeadStage, Lead[]>>(() => {
    const grouped: Record<LeadStage, Lead[]> = {
      new_lead: [],
      contacted: [],
      demo_scheduled: [],
      trial_started: [],
      converted: [],
      lost: []
    }
    for (const lead of sampleLeads) {
      grouped[lead.stage].push(lead)
    }
    return grouped
  })

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [note, setNote] = useState('')
  const [nextAction, setNextAction] = useState('')
  const [nextDue, setNextDue] = useState('')

  const [showAddLead, setShowAddLead] = useState(false)
  const [newLeadData, setNewLeadData] = useState({
    businessName: '',
    leadSource: 'Website' as Lead['leadSource'],
    estimatedDealSize: '',
    lastContactDate: '',
    assignedTo: '',
    contactPerson: '',
    email: '',
    phone: ''
  })

  useEffect(() => {
    if (selectedLead) {
      setNextAction(selectedLead.nextStep || '')
      setNextDue(selectedLead.nextStepDue ? selectedLead.nextStepDue.split('T')[0] : '')
      setNote('')
    }
  }, [selectedLead])

  const allLeads = Object.values(leads).flat()
  const activeLeads = allLeads.filter(l => l.stage !== 'lost' && l.stage !== 'converted')
  const totalPipeline = activeLeads.reduce((sum, l) => sum + l.estimatedDealSize, 0)
  const averageDeal = activeLeads.length ? totalPipeline / activeLeads.length : 0
  const leadToTrial = leads.trial_started.length && leads.new_lead.length
    ? (leads.trial_started.length / leads.new_lead.length) * 100
    : 0
  const trialToConversion = leads.converted.length && leads.trial_started.length
    ? (leads.converted.length / leads.trial_started.length) * 100
    : 0

  const handleDragStart = (e: React.DragEvent, lead: Lead, stage: LeadStage) => {
    e.dataTransfer.setData('leadId', lead.id)
    e.dataTransfer.setData('sourceStage', stage)
  }

  const handleDrop = (e: React.DragEvent, targetStage: LeadStage) => {
    e.preventDefault()
    const leadId = e.dataTransfer.getData('leadId')
    const sourceStage = e.dataTransfer.getData('sourceStage') as LeadStage
    if (!leadId || !sourceStage || sourceStage === targetStage) return

    setLeads(prev => {
      const lead = prev[sourceStage].find(l => l.id === leadId)
      if (!lead) return prev
      const updated: Record<LeadStage, Lead[]> = {
        ...prev,
        [sourceStage]: prev[sourceStage].filter(l => l.id !== leadId),
        [targetStage]: [...prev[targetStage], { ...lead, stage: targetStage }]
      }
      return updated
    })
  }

  const handleNewLeadChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setNewLeadData(prev => ({ ...prev, [name]: value }))
  }

  const handleCreateLead = () => {
    if (
      !newLeadData.businessName.trim() ||
      !newLeadData.estimatedDealSize ||
      !newLeadData.assignedTo
    )
      return

    const lead: Lead = {
      id: crypto.randomUUID(),
      businessName: newLeadData.businessName,
      leadSource: newLeadData.leadSource,
      estimatedDealSize: Number(newLeadData.estimatedDealSize),
      lastContactDate: newLeadData.lastContactDate
        ? new Date(newLeadData.lastContactDate).toISOString()
        : new Date().toISOString(),
      assignedTo: newLeadData.assignedTo,
      stage: 'new_lead',
      contactPerson: newLeadData.contactPerson,
      email: newLeadData.email,
      phone: newLeadData.phone,
      activity: []
    }

    setLeads(prev => ({
      ...prev,
      new_lead: [...prev.new_lead, lead]
    }))

    setNewLeadData({
      businessName: '',
      leadSource: 'Website',
      estimatedDealSize: '',
      lastContactDate: '',
      assignedTo: '',
      contactPerson: '',
      email: '',
      phone: ''
    })
    setShowAddLead(false)
  }

  const handleAddNote = () => {
    if (!selectedLead || !note.trim()) return
    const updatedLead: Lead = {
      ...selectedLead,
      activity: [...selectedLead.activity, { date: new Date().toISOString(), note, type: 'note' }]
    }
    setLeads(prev => {
      const updated = { ...prev }
      updated[updatedLead.stage] = prev[updatedLead.stage].map(l =>
        l.id === updatedLead.id ? updatedLead : l
      )
      return updated
    })
    setSelectedLead(updatedLead)
    setNote('')
  }

  const handleSaveNext = () => {
    if (!selectedLead) return
    const updatedLead: Lead = {
      ...selectedLead,
      nextStep: nextAction,
      nextStepDue: nextDue ? new Date(nextDue).toISOString() : undefined
    }
    setLeads(prev => {
      const updated = { ...prev }
      updated[updatedLead.stage] = prev[updatedLead.stage].map(l =>
        l.id === updatedLead.id ? updatedLead : l
      )
      return updated
    })
    setSelectedLead(updatedLead)
  }

  return (
    <DashboardLayout showSearch={false}>
      <div className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sales Pipeline</h1>
            <button
              onClick={() => setShowAddLead(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Add Lead
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KpiCard
              title="Total Pipeline Value"
              value={`$${totalPipeline.toLocaleString()}`}
              gradient="blue"
            />
            <KpiCard
              title="Average Deal Size"
              value={`$${averageDeal.toFixed(0)}`}
              gradient="green"
            />
            <KpiCard
              title="Lead→Trial Conversion"
              value={`${leadToTrial.toFixed(1)}%`}
              gradient="purple"
            />
            <KpiCard
              title="Trial→Conversion Rate"
              value={`${trialToConversion.toFixed(1)}%`}
              gradient="orange"
            />
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4">
            {stages.map(stage => (
              <div
                key={stage.key}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 w-64 flex-shrink-0"
                onDragOver={e => e.preventDefault()}
                onDrop={e => handleDrop(e, stage.key)}
              >
                <h3 className="font-semibold mb-3 text-gray-700 dark:text-gray-200">
                  {stage.title}
                </h3>
                <div className="space-y-3">
                  {leads[stage.key].map(lead => (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={e => handleDragStart(e, lead, stage.key)}
                      onClick={() => setSelectedLead(lead)}
                      className="bg-white dark:bg-gray-900 p-3 rounded shadow cursor-move"
                    >
                      <p className="font-medium text-gray-900 dark:text-white">
                        {lead.businessName}
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded ${sourceColors[lead.leadSource]}`}>
                        {lead.leadSource}
                      </span>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                        ${lead.estimatedDealSize.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Last contact: {new Date(lead.lastContactDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Assigned: {lead.assignedTo}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAddLead && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowAddLead(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Add Lead
            </h2>
            <div className="space-y-2">
              <input
                name="businessName"
                value={newLeadData.businessName}
                onChange={handleNewLeadChange}
                placeholder="Business Name"
                className="w-full border rounded p-2 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
              <select
                name="leadSource"
                value={newLeadData.leadSource}
                onChange={handleNewLeadChange}
                className="w-full border rounded p-2 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              >
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="Cold Call">Cold Call</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="number"
                name="estimatedDealSize"
                value={newLeadData.estimatedDealSize}
                onChange={handleNewLeadChange}
                placeholder="Estimated Deal Size"
                className="w-full border rounded p-2 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
              <input
                type="date"
                name="lastContactDate"
                value={newLeadData.lastContactDate}
                onChange={handleNewLeadChange}
                className="w-full border rounded p-2 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
              <input
                name="assignedTo"
                value={newLeadData.assignedTo}
                onChange={handleNewLeadChange}
                placeholder="Assigned To"
                className="w-full border rounded p-2 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
              <input
                name="contactPerson"
                value={newLeadData.contactPerson}
                onChange={handleNewLeadChange}
                placeholder="Contact Person"
                className="w-full border rounded p-2 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
              <input
                name="email"
                value={newLeadData.email}
                onChange={handleNewLeadChange}
                placeholder="Email"
                className="w-full border rounded p-2 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
              <input
                name="phone"
                value={newLeadData.phone}
                onChange={handleNewLeadChange}
                placeholder="Phone"
                className="w-full border rounded p-2 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowAddLead(false)}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm text-gray-800 dark:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateLead}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedLead && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedLead(null)}
        >
          <div
            className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-lg w-full"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              {selectedLead.businessName}
            </h2>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p>
                <strong>Contact:</strong> {selectedLead.contactPerson} ({selectedLead.email}, {selectedLead.phone})
              </p>
              <p>
                <strong>Status:</strong> {selectedLead.stage.replace('_', ' ')}
              </p>
              <p>
                <strong>Deal Size:</strong> ${selectedLead.estimatedDealSize.toLocaleString()}
              </p>
              <p>
                <strong>Expected Close:</strong>{' '}
                {selectedLead.expectedCloseDate
                  ? new Date(selectedLead.expectedCloseDate).toLocaleDateString()
                  : '—'}
              </p>
            </div>

            <div className="mt-4">
              <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Activity Log</h3>
              <ul className="max-h-40 overflow-y-auto text-sm space-y-1 text-gray-700 dark:text-gray-300">
                {selectedLead.activity.map((act, i) => (
                  <li key={i}>
                    {new Date(act.date).toLocaleDateString()}: {act.note}
                  </li>
                ))}
              </ul>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Add note"
                className="w-full mt-2 border rounded p-2 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
              <button
                onClick={handleAddNote}
                className="mt-2 px-3 py-1 bg-green-600 text-white rounded text-sm"
              >
                Add Note
              </button>
            </div>

            <div className="mt-4">
              <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Next Steps</h3>
              <input
                value={nextAction}
                onChange={e => setNextAction(e.target.value)}
                placeholder="Next action"
                className="w-full border rounded p-2 text-sm mb-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
              <input
                type="date"
                value={nextDue}
                onChange={e => setNextDue(e.target.value)}
                className="w-full border rounded p-2 text-sm mb-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
              <button
                onClick={handleSaveNext}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
              >
                Save
              </button>
            </div>

            <button
              onClick={() => setSelectedLead(null)}
              className="mt-6 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
