'use client'

import { useState, useRef, useEffect } from 'react'
import { MapPin, ChevronDown, Search, X, Check, Sparkles } from 'lucide-react'
import { CITIES, TOP_CITIES } from '@/lib/data'

interface CitySearchDropdownProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  inputClassName?: string
}

export default function CitySearchDropdown({ 
  value,
  onChange, 
  placeholder = "Select or search city...", 
  className = "",
  inputClassName = ""
}: CitySearchDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Filter cities based on search term
  const filteredCities = CITIES.filter(city =>
    city.toLowerCase().includes(searchTerm.trim().toLowerCase())
  )

  // Auto-focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 50)
    } else {
      setSearchTerm('')
    }
  }, [isOpen])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  function handleCitySelect(city: string) {
    onChange(city)
    setSearchTerm('')
    setIsOpen(false)
  }

  function handleClearSelection(e: React.MouseEvent) {
    e.stopPropagation()
    onChange('')
    setSearchTerm('')
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  const isSelectedInList = CITIES.includes(value)

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Trigger Box */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3 border rounded-xl bg-white cursor-pointer transition-all ${
          isOpen
            ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
            : value
            ? 'border-slate-300 shadow-xs'
            : 'border-slate-300'
        } ${inputClassName}`}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <MapPin className={`w-4 h-4 shrink-0 ${value ? 'text-blue-600' : 'text-slate-400'}`} />
          {value ? (
            <span className="font-semibold text-slate-800 text-sm truncate">{value}</span>
          ) : (
            <span className="text-slate-400 text-sm">{placeholder}</span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          {value && (
            <button
              type="button"
              onClick={handleClearSelection}
              className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              title="Clear selection"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-blue-600' : ''
            }`}
          />
        </div>
      </div>

      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
          {/* Live Search Input Bar */}
          <div className="p-3 border-b border-slate-100 bg-slate-50/80 sticky top-0 z-10 backdrop-blur-xs">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search 100+ cities in Pakistan..."
                className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium transition-all"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between mt-2 px-1 text-[11px] font-semibold text-slate-400">
              <span>Cities ({filteredCities.length})</span>
              {searchTerm && (
                <span className="text-blue-600">Press city to select</span>
              )}
            </div>
          </div>

          {/* Quick Select Top Cities Chips (shown when search is empty or small) */}
          {!searchTerm && (
            <div className="p-3 border-b border-slate-100 bg-slate-50/40">
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Top Cities</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {TOP_CITIES.slice(0, 10).map((topCity) => (
                  <button
                    key={topCity}
                    type="button"
                    onClick={() => handleCitySelect(topCity)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      value === topCity
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700'
                    }`}
                  >
                    {topCity}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Scrollable City List */}
          <div className="max-h-56 overflow-y-auto divide-y divide-slate-50 p-1">
            {filteredCities.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-sm font-semibold text-slate-600">No matching cities found</p>
                {searchTerm.trim() && (
                  <button
                    type="button"
                    onClick={() => handleCitySelect(searchTerm.trim())}
                    className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    <span>Use &quot;{searchTerm.trim()}&quot; as City</span>
                  </button>
                )}
              </div>
            ) : (
              filteredCities.map((city) => {
                const isSelected = value === city
                return (
                  <button
                    key={city}
                    type="button"
                    onClick={() => handleCitySelect(city)}
                    className={`w-full px-3 py-2.5 text-left rounded-xl transition-all cursor-pointer flex items-center justify-between text-sm ${
                      isSelected
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'hover:bg-slate-50 text-slate-700 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span>{city}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
