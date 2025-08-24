'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'

interface OnboardingModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (onboardingData: OnboardingFormData) => void
  isLoading?: boolean
}

interface OnboardingFormData {
  clientName: string
  industry: string
  contactName: string
  contactEmail: string
  contactPhone: string
  businessSize: 'small' | 'medium' | 'large'
  expectedJobs: number
  features: string[]
  notes?: string
}

type OnboardingFormErrors = Partial<Record<keyof OnboardingFormData, string>>

const industries = [
  'Saloon',
  'Spa', 
  'Turf Club',
  'Clinics',
  'Laundry Shop',
  'Food Truck',
  'Other'
]

const availableFeatures = [
  { id: 'billing', name: 'Billing & Invoicing', description: 'Automated billing and payment processing' },
  { id: 'appointments', name: 'Appointment Scheduling', description: 'Online booking and calendar management' },
  { id: 'loyalty', name: 'Loyalty Programs', description: 'Customer rewards and retention programs' },
  { id: 'reviews', name: 'Review Management', description: 'Collect and manage customer reviews' },
  { id: 'reporting', name: 'Analytics & Reporting', description: 'Business insights and performance metrics' },
  { id: 'campaigns', name: 'Marketing Campaigns', description: 'Email and SMS marketing automation' },
  { id: 'inventory', name: 'Inventory Management', description: 'Track products and supplies' },
  { id: 'staff', name: 'Staff Management', description: 'Employee scheduling and performance tracking' }
]

export function OnboardingModal({ isOpen, onClose, onSubmit, isLoading = false }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<OnboardingFormData>({
    clientName: '',
    industry: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    businessSize: 'small',
    expectedJobs: 10,
    features: [],
    notes: ''
  })

  const [errors, setErrors] = useState<OnboardingFormErrors>({})

  const validateStep = (step: number): boolean => {
    const newErrors: OnboardingFormErrors = {}

    if (step === 1) {
      if (!formData.clientName.trim()) {
        newErrors.clientName = 'Business name is required'
      }
      if (!formData.industry) {
        newErrors.industry = 'Please select an industry'
      }
    }

    if (step === 2) {
      if (!formData.contactName.trim()) {
        newErrors.contactName = 'Contact name is required'
      }
      if (!formData.contactEmail.trim()) {
        newErrors.contactEmail = 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
        newErrors.contactEmail = 'Please enter a valid email address'
      }
    }

    if (step === 3) {
      if (formData.features.length === 0) {
        newErrors.features = 'Please select at least one feature'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4))
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      onSubmit(formData)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setCurrentStep(1)
      setFormData({
        clientName: '',
        industry: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        businessSize: 'small',
        expectedJobs: 10,
        features: [],
        notes: ''
      })
      setErrors({})
      onClose()
    }
  }

  const handleFeatureToggle = (featureId: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter(f => f !== featureId)
        : [...prev.features, featureId]
    }))
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Business Information
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Let's start with some basic information about your business.
              </p>
            </div>

            <div>
              <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Business Name *
              </label>
              <input
                type="text"
                id="clientName"
                value={formData.clientName}
                onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${
                  errors.clientName ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Enter your business name"
                disabled={isLoading}
              />
              {errors.clientName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.clientName}</p>
              )}
            </div>

            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Industry *
              </label>
              <select
                id="industry"
                value={formData.industry}
                onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${
                  errors.industry ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                }`}
                disabled={isLoading}
              >
                <option value="">Select your industry</option>
                {industries.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
              {errors.industry && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.industry}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Business Size
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'small', label: 'Small', description: '1-10 employees' },
                  { value: 'medium', label: 'Medium', description: '11-50 employees' },
                  { value: 'large', label: 'Large', description: '50+ employees' }
                ].map((size) => (
                  <div
                    key={size.value}
                    className={`relative border rounded-lg p-3 cursor-pointer transition-colors ${
                      formData.businessSize === size.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                    onClick={() => !isLoading && setFormData(prev => ({ ...prev, businessSize: size.value as any }))}
                  >
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {size.label}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {size.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Contact Information
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Who should we contact for account setup and support?
              </p>
            </div>

            <div>
              <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contact Name *
              </label>
              <input
                type="text"
                id="contactName"
                value={formData.contactName}
                onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${
                  errors.contactName ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Enter contact person's name"
                disabled={isLoading}
              />
              {errors.contactName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.contactName}</p>
              )}
            </div>

            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="contactEmail"
                value={formData.contactEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${
                  errors.contactEmail ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Enter email address"
                disabled={isLoading}
              />
              {errors.contactEmail && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.contactEmail}</p>
              )}
            </div>

            <div>
              <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="contactPhone"
                value={formData.contactPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter phone number (optional)"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="expectedJobs" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Expected Monthly Jobs
              </label>
              <input
                type="number"
                id="expectedJobs"
                min="1"
                max="10000"
                value={formData.expectedJobs}
                onChange={(e) => setFormData(prev => ({ ...prev, expectedJobs: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                disabled={isLoading}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                This helps us recommend the right plan for your business.
              </p>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Select Features
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Choose the features that are most important for your business.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {availableFeatures.map((feature) => (
                <div
                  key={feature.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    formData.features.includes(feature.id)
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                  onClick={() => !isLoading && handleFeatureToggle(feature.id)}
                >
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      checked={formData.features.includes(feature.id)}
                      onChange={() => handleFeatureToggle(feature.id)}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      disabled={isLoading}
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {feature.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {feature.description}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {errors.features && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.features}</p>
            )}
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Additional Notes
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Any additional information or special requirements?
              </p>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                rows={4}
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter any additional notes or requirements..."
                disabled={isLoading}
              />
            </div>

            {/* Summary */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Business:</span>
                  <span className="text-gray-900 dark:text-white">{formData.clientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Industry:</span>
                  <span className="text-gray-900 dark:text-white">{formData.industry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Contact:</span>
                  <span className="text-gray-900 dark:text-white">{formData.contactName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Features:</span>
                  <span className="text-gray-900 dark:text-white">{formData.features.length} selected</span>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Client Onboarding"
      size="lg"
    >
      <div className="mb-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                }`}
              >
                {step}
              </div>
              {step < 4 && (
                <div
                  className={`w-16 h-1 mx-2 ${
                    step < currentStep
                      ? 'bg-blue-600'
                      : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        {renderStep()}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-600 mt-8">
          <button
            type="button"
            onClick={currentStep === 1 ? handleClose : handlePrevious}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {currentStep === 1 ? 'Cancel' : 'Previous'}
          </button>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            Step {currentStep} of 4
          </div>

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                'Complete Onboarding'
              )}
            </button>
          )}
        </div>
      </div>
    </Modal>
  )
}