'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { User } from '@/types/domain'

interface UserModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'>) => void
  user?: User // For editing existing users
  isLoading?: boolean
}

interface FormData {
  name: string
  email: string
  role: User['role']
  status: User['status']
  permissions: string[]
}

const rolePermissions: Record<User['role'], string[]> = {
  Admin: ['read', 'write', 'delete', 'admin'],
  Manager: ['read', 'write'],
  Analyst: ['read', 'write'],
  Viewer: ['read']
}

export function UserModal({ isOpen, onClose, onSubmit, user, isLoading = false }: UserModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'Viewer',
    status: user?.status || 'Active',
    permissions: user?.permissions || ['read']
  })

  const [errors, setErrors] = useState<Partial<FormData>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
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
      name: formData.name.trim(),
      email: formData.email.trim(),
      role: formData.role,
      status: formData.status,
      permissions: rolePermissions[formData.role]
    })
  }

  const handleRoleChange = (role: User['role']) => {
    setFormData(prev => ({
      ...prev,
      role,
      permissions: rolePermissions[role]
    }))
  }

  const handleClose = () => {
    if (!isLoading) {
      // Reset form when closing
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        role: user?.role || 'Viewer',
        status: user?.status || 'Active',
        permissions: user?.permissions || ['read']
      })
      setErrors({})
      onClose()
    }
  }

  const getRoleDescription = (role: User['role']) => {
    switch (role) {
      case 'Admin':
        return 'Full system access including user management'
      case 'Manager':
        return 'Can view and edit data, manage clients'
      case 'Analyst':
        return 'Can view and analyze data, generate reports'
      case 'Viewer':
        return 'Read-only access to dashboards and reports'
      default:
        return ''
    }
  }

  const getRoleColor = (role: User['role']) => {
    switch (role) {
      case 'Admin':
        return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
      case 'Manager':
        return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
      case 'Analyst':
        return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
      case 'Viewer':
        return 'border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700'
      default:
        return 'border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700'
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={user ? 'Edit User' : 'Add New User'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${
              errors.name 
                ? 'border-red-300 dark:border-red-600' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Enter full name"
            disabled={isLoading}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${
              errors.email 
                ? 'border-red-300 dark:border-red-600' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Enter email address"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
          )}
        </div>

        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Role *
          </label>
          <div className="grid grid-cols-1 gap-3">
            {(['Admin', 'Manager', 'Analyst', 'Viewer'] as User['role'][]).map((role) => (
              <div
                key={role}
                className={`relative border rounded-lg p-3 cursor-pointer transition-colors ${
                  formData.role === role
                    ? getRoleColor(role)
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
                onClick={() => !isLoading && handleRoleChange(role)}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    id={`role-${role}`}
                    name="role"
                    value={role}
                    checked={formData.role === role}
                    onChange={() => handleRoleChange(role)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    disabled={isLoading}
                  />
                  <div className="ml-3">
                    <label htmlFor={`role-${role}`} className="block text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
                      {role}
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {getRoleDescription(role)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Field */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as User['status'] }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            disabled={isLoading}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Permissions Display */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Permissions
          </label>
          <div className="flex flex-wrap gap-2">
            {rolePermissions[formData.role].map((permission) => (
              <span
                key={permission}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
              >
                {permission}
              </span>
            ))}
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Permissions are automatically assigned based on the selected role.
          </p>
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
                {user ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              user ? 'Update User' : 'Create User'
            )}
          </button>
        </div>
      </form>
    </Modal>
  )
}