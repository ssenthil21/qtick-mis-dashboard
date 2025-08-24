'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { UserModal } from '@/components/modals/UserModal'
import { sampleUsers } from '@/lib/seed'
import { User } from '@/types/domain'

function getRoleColor(role: User['role']) {
  switch (role) {
    case 'Admin':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    case 'Manager':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    case 'Analyst':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    case 'Viewer':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}

function getStatusColor(status: User['status']) {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    case 'Inactive':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>(sampleUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleToggleStatus = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' }
        : user
    ))
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(user => user.id !== userId))
      // Show success toast (would be connected to toast system)
      console.log('User deleted successfully')
    }
  }

  const handleCreateUser = async (userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'>) => {
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const newUser: User = {
        ...userData,
        id: `user-${Date.now()}`,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      }
      
      setUsers(prev => [...prev, newUser])
      setIsUserModalOpen(false)
      setEditingUser(undefined)
      
      // Show success toast (would be connected to toast system)
      console.log('User created successfully')
    } catch (error) {
      console.error('Failed to create user:', error)
      // Show error toast (would be connected to toast system)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditUser = async (userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'>) => {
    if (!editingUser) return
    
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const updatedUser: User = {
        ...editingUser,
        ...userData
      }
      
      setUsers(prev => prev.map(user => 
        user.id === editingUser.id ? updatedUser : user
      ))
      setIsUserModalOpen(false)
      setEditingUser(undefined)
      
      // Show success toast (would be connected to toast system)
      console.log('User updated successfully')
    } catch (error) {
      console.error('Failed to update user:', error)
      // Show error toast (would be connected to toast system)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenCreateModal = () => {
    setEditingUser(undefined)
    setIsUserModalOpen(true)
  }

  const handleOpenEditModal = (user: User) => {
    setEditingUser(user)
    setIsUserModalOpen(true)
  }

  const handleCloseModal = () => {
    if (!isLoading) {
      setIsUserModalOpen(false)
      setEditingUser(undefined)
    }
  }

  const activeUsersCount = users.filter(user => user.status === 'Active').length
  const adminCount = users.filter(user => user.role === 'Admin').length
  const recentLoginsCount = users.filter(user => {
    const lastLogin = new Date(user.lastLogin)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    return lastLogin > oneDayAgo
  }).length

  return (
    <DashboardLayout showSearch={false}>
      <div className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin</h1>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{users.length}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{activeUsersCount}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{adminCount}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Administrators</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{recentLoginsCount}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Recent Logins</p>
                </div>
              </div>
            </div>
          </div>

          {/* User Management Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">User Management</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Manage user accounts, roles, and permissions
                  </p>
                </div>
                <button 
                  onClick={handleOpenCreateModal}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add New User
                </button>
              </div>
              
              {/* Search and Filters */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="all">All Roles</option>
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Analyst">Analyst</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>
                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="all">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {user.avatar ? (
                              <img className="h-10 w-10 rounded-full" src={user.avatar} alt={user.name} />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  {user.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1 ${user.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatDateTime(user.lastLogin)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleToggleStatus(user.id)}
                            className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white transition-colors ${
                              user.status === 'Active' 
                                ? 'bg-red-600 hover:bg-red-700' 
                                : 'bg-green-600 hover:bg-green-700'
                            }`}
                          >
                            {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                          </button>
                          <button 
                            onClick={() => handleOpenEditModal(user)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No users found</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Try adjusting your search or filter criteria.
                  </p>
                </div>
              )}
            </div>
            
            {/* Table Footer */}
            <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Showing {filteredUsers.length} of {users.length} users
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Last updated: {new Date().toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Modal */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={handleCloseModal}
        onSubmit={editingUser ? handleEditUser : handleCreateUser}
        user={editingUser}
        isLoading={isLoading}
      />
    </DashboardLayout>
  )
}