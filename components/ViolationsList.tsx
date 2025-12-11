'use client'

import { useState } from 'react'

export interface Violation {
  id: string
  product: string
  asin: string
  issueType: string
  atRiskSales: number
  impact: 'High' | 'Medium' | 'Low'
  status: string
  opened: string
}

interface Props {
  violations: Violation[]
}

export function ViolationsList({ violations }: Props) {
  const [searchQuery, setSearchQuery] = useState('')
  const [timeFilter, setTimeFilter] = useState('All Time')
  const [statusFilter, setStatusFilter] = useState('All Statuses')

  if (violations.length === 0) {
    return (
      <div className="bg-[#1a1f2e] rounded-lg p-8">
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No issues found</p>
          <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filter settings.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters Section */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by ASIN, Product, or Issue Type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1a1f2e] border border-gray-700 rounded-lg px-4 py-2.5 pl-10 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
            />
            <svg className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-600 border border-gray-700 px-1.5 py-0.5 rounded">⌘ K</span>
          </div>
        </div>
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="bg-[#1a1f2e] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500"
          aria-label="Time filter"
        >
          <option>All Time</option>
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#1a1f2e] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500"
          aria-label="Status filter"
        >
          <option>All Statuses</option>
          <option>Working</option>
          <option>Waiting on Client</option>
          <option>Submitted</option>
          <option>Denied</option>
        </select>
      </div>

      {/* Table Section */}
      <div className="bg-[#1a1f2e] rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white font-semibold text-lg">Violation Tracker</h2>
              <p className="text-gray-400 text-sm">{violations.length} issues found</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search ASIN or Product..."
                  className="bg-[#0f1419] border border-gray-700 rounded-lg px-4 py-2 pl-9 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-orange-500 w-64"
                />
                <svg className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors" aria-label="Filter options">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </button>
              <select className="bg-transparent border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500" aria-label="Filter by status">
                <option>All Statuses</option>
                <option>Working</option>
                <option>Waiting on Client</option>
                <option>Submitted</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#151a26]">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Product</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Issue Type</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">$ At Risk</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Impact</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  <button className="flex items-center gap-1 hover:text-white">
                    Opened
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {violations.map((violation) => (
                <tr key={violation.id} className="hover:bg-[#1e2433] transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-white font-medium text-sm">{violation.product}</div>
                    <a 
                      href={`https://www.amazon.com/dp/${violation.asin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-500 hover:text-orange-400 text-xs"
                      title="View on Amazon"
                    >
                      {violation.asin}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-gray-300 text-sm">{violation.issueType}</td>
                  <td className="px-6 py-4 text-white font-medium text-sm">${violation.atRiskSales.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded text-xs font-medium ${
                      violation.impact === 'High' ? 'bg-red-500/20 text-red-400' :
                      violation.impact === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {violation.impact}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded text-xs font-medium bg-gray-700 text-gray-300">
                      {violation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">{violation.opened}</td>
                  <td className="px-6 py-4">
                    <button className="text-orange-500 hover:text-orange-400 text-sm font-medium">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
