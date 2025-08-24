'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Client } from '@/types/domain'

interface RenewalModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (renewalData: RenewalFormData) => void
  client?: Client
  isLoading?: boolean
}

interface RenewalFormData {
  clientId: string
  planType: 'basic' | 'professional' | 'enterprise'
  billingCycle: 'monthly' | 'quarterly' | 'yearly'
  renewalDate: string
  credits: number
  autoRenewal: boolean
  paymentMethod: 'card' | 'bank' | 'invoice'
  notes?: string
}

type RenewalFormErrors = Partial<Record<keyof RenewalFormData, string>>

const plans = [
  {
    id: 'basic',
    name: 'Basic Plan',
    description: 'Essential features for small businesses',
    monthlyPrice: 29,
    features: ['Up to 100 jobs/month', 'Basic reporting', 'Email support'],
    color: 'border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700'
  },
  {
    id: 'professional',
    name: 'Professional Plan',
    description: 'Advanced features for growing businesses',
    monthlyPrice: 79,
    features: ['Up to 500 jobs/month', 'Advanced analytics', 'Priority support', 'API access'],
    color: 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20',
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise Plan',
    description: 'Full-featured solution for large organizations',
    monthlyPrice: 199,
    features: ['Unlimited jobs', 'Custom integrations', '24/7 support', 'Dedicated account manager'],
    color: 'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20'
  }
]

export function RenewalModal({ isOpen, onClose, onSubmit, client, isLoading = false }: RenewalModalProps) {
  const [formData, setFormData] = useState<RenewalFormData>({
    clientId: client?.id || '',
    planType: 'professional',
    billingCycle: 'yearly',
    renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    credits: 0,
    autoRenewal: true,
    paymentMethod: 'card',
    notes: ''
  })

  const [errors, setErrors] = useState<RenewalFormErrors>({})

  const validateForm = (): boolean => {
    const newErrors: RenewalFormErrors = {}

    if (!formData.renewalDate) {
      newErrors.renewalDate = 'Renewal date is required'
    } else {
      const renewalDate = new Date(formData.renewalDate)
      const today = new Date()
      if (renewalDate <= today) {
        newErrors.renewalDate = 'Renewal date must be in the future'
      }
    }

    if (formData.credits < 0) {
      newErrors.credits = 'Credits cannot be negative'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    onSubmit({
      ...formData,
      clientId: client?.id || formData.clientId
    })
  }

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        clientId: client?.id || '',
        planType: 'professional',
        billingCycle: 'yearly',
        renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        credits: 0,
        autoRenewal: true,
        paymentMethod: 'card',
        notes: ''
      })
      setErrors({})
      onClose()
    }
  }

  const selectedPlan = plans.find(plan => plan.id === formData.planType)
  const calculatePrice = () => {
    if (!selectedPlan) return 0
    
    const basePrice = selectedPlan.monthlyPrice
    const months = formData.billingCycle === 'monthly' ? 1 : formData.billingCycle === 'quarterly' ? 3 : 12
    const totalPrice = basePrice * months
    
    // Apply discounts for longer billing cycles
    if (formData.billingCycle === 'quarterly') {
      return totalPrice * 0.95 // 5% discount
    } else if (formData.billingCycle === 'yearly') {
      return totalPrice * 0.85 // 15% discount
    }
    
    return totalPrice
  }

  const getBillingCycleLabel = () => {
    switch (formData.billingCycle) {
      case 'monthly': return 'Monthly'
      case 'quarterly': return 'Quarterly (5% discount)'
      case 'yearly': return 'Yearly (15% discount)'
      default: return ''
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Renew Subscription - ${client?.name || 'Client'}`}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Client Info */}
        {client && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Current Client</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Name:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{client.name}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Industry:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{client.industry}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Current Status:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  client.status === 'Paid' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : client.status === 'Trial'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                }`}>
                  {client.status}
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Monthly Jobs:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{client.monthlyJobs}</span>
              </div>
            </div>
          </div>
        )}

        {/* Plan Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Select Plan
          </label>
          <div className="grid grid-cols-1 gap-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative border rounded-lg p-4 cursor-pointer transition-colors ${
                  formData.planType === plan.id
                    ? plan.color
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
                onClick={() => !isLoading && setFormData(prev => ({ ...prev, planType: plan.id as any }))}
              >
                {plan.popular && (
                  <div className="absolute -top-2 left-4">
                    <span className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="flex items-start">
                  <input
                    type="radio"
                    name="planType"
                    value={plan.id}
                    checked={formData.planType === plan.id}
                    onChange={(e) => setFormData(prev => ({ ...prev, planType: e.target.value as any }))}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    disabled={isLoading}
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {plan.name}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {plan.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          ${plan.monthlyPrice}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          per month
                        </div>
                      </div>
                    </div>
                    <ul className="mt-2 text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <svg className="w-3 h-3 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Billing Cycle */}
        <div>
          <label htmlFor="billingCycle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Billing Cycle
          </label>
          <select
            id="billingCycle"
            value={formData.billingCycle}
            onChange={(e) => setFormData(prev => ({ ...prev, billingCycle: e.target.value as any }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            disabled={isLoading}
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly (5% discount)</option>
            <option value="yearly">Yearly (15% discount)</option>
          </select>
        </div>

        {/* Renewal Date */}
        <div>
          <label htmlFor="renewalDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Renewal Date *
          </label>
          <input
            type="date"
            id="renewalDate"
            value={formData.renewalDate}
            onChange={(e) => setFormData(prev => ({ ...prev, renewalDate: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${
              errors.renewalDate ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
            }`}
            disabled={isLoading}
          />
          {errors.renewalDate && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.renewalDate}</p>
          )}
        </div>

        {/* Additional Credits */}
        <div>
          <label htmlFor="credits" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Additional Credits
          </label>
          <input
            type="number"
            id="credits"
            min="0"
            max="10000"
            value={formData.credits}
            onChange={(e) => setFormData(prev => ({ ...prev, credits: parseInt(e.target.value) || 0 }))}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${
              errors.credits ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
            }`}
            disabled={isLoading}
          />
          {errors.credits && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.credits}</p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Add extra credits for additional jobs beyond the plan limit ($0.50 per credit)
          </p>
        </div>

        {/* Payment Method */}
        <div>
          <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Payment Method
          </label>
          <select
            id="paymentMethod"
            value={formData.paymentMethod}
            onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value as any }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            disabled={isLoading}
          >
            <option value="card">Credit/Debit Card</option>
            <option value="bank">Bank Transfer</option>
            <option value="invoice">Invoice (Net 30)</option>
          </select>
        </div>

        {/* Auto Renewal */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="autoRenewal"
            checked={formData.autoRenewal}
            onChange={(e) => setFormData(prev => ({ ...prev, autoRenewal: e.target.checked }))}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            disabled={isLoading}
          />
          <label htmlFor="autoRenewal" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Enable automatic renewal
          </label>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Any additional notes or special instructions..."
            disabled={isLoading}
          />
        </div>

        {/* Pricing Summary */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Pricing Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Plan:</span>
              <span className="text-gray-900 dark:text-white">{selectedPlan?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Billing:</span>
              <span className="text-gray-900 dark:text-white">{getBillingCycleLabel()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Subscription:</span>
              <span className="text-gray-900 dark:text-white">${calculatePrice().toFixed(2)}</span>
            </div>
            {formData.credits > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Credits ({formData.credits}):</span>
                <span className="text-gray-900 dark:text-white">${(formData.credits * 0.5).toFixed(2)}</span>
              </div>
            )}
            <div className="border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
              <div className="flex justify-between font-medium">
                <span className="text-gray-900 dark:text-white">Total:</span>
                <span className="text-gray-900 dark:text-white">
                  ${(calculatePrice() + (formData.credits * 0.5)).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600">
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Renewal...
              </>
            ) : (
              'Process Renewal'
            )}
          </button>
        </div>
      </form>
    </Modal>
  )
}