import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Bus, Navigation, X, Save, MapPin, Search, Loader2 } from 'lucide-react';


const LocationAutocomplete = ({ value, onChange, placeholder, label, required, disabled, error }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [networkError, setNetworkError] = useState(null);

    const inputRef = useRef(null);
    const dropdownRef = useRef(null);
    const debounceRef = useRef(null);
    const abortRef = useRef(null);

    useEffect(() => {
        if (value?.name) setQuery(value.name);
        else setQuery('');
    }, [value]);

    useEffect(() => {
        const handler = (e) => {
            if (
                inputRef.current && !inputRef.current.contains(e.target) &&
                dropdownRef.current && !dropdownRef.current.contains(e.target)
            ) setIsOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const search = useCallback(async (q) => {
        if (q.trim().length < 2) { setSuggestions([]); setIsOpen(false); return; }
        if (abortRef.current) abortRef.current.abort();
        abortRef.current = new AbortController();
        setIsLoading(true);
        setNetworkError(null);
        try {
            const params = new URLSearchParams({
                q: `${q}, Cameroun`,
                format: 'json',
                addressdetails: '1',
                limit: '7',
                countrycodes: 'cm',
                'accept-language': 'fr',
            });
            const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
                signal: abortRef.current.signal,
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            const results = data.map((item) => {
                const addr = item.address || {};
                const parts = [
                    addr.neighbourhood || addr.suburb || addr.quarter || addr.village,
                    addr.city || addr.town || addr.county || addr.state_district,
                    addr.state,
                ].filter(Boolean);
                const shortName = parts.slice(0, 2).join(', ') || item.display_name.split(',')[0];
                return {
                    id: item.place_id,
                    name: shortName,
                    displayName: item.display_name,
                    latitude: parseFloat(item.lat),
                    longitude: parseFloat(item.lon),
                };
            });
            setSuggestions(results);
            setIsOpen(results.length > 0);
            setHighlightedIndex(-1);
        } catch (err) {
            if (err.name === 'AbortError') return;
            setNetworkError('OpenStreetMap indisponible. Vérifiez votre connexion.');
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleInputChange = (e) => {
        const q = e.target.value;
        setQuery(q);
        if (!q) { onChange(null); setSuggestions([]); setIsOpen(false); return; }
        if (value && q !== value.name) onChange(null);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => search(q), 350);
    };

    const handleSelect = (s) => {
        setQuery(s.name);
        setSuggestions([]);
        setIsOpen(false);
        onChange({ name: s.name, displayName: s.displayName, latitude: s.latitude, longitude: s.longitude });
    };

    const handleClear = () => {
        setQuery('');
        setSuggestions([]);
        setIsOpen(false);
        onChange(null);
        inputRef.current?.focus();
    };

    const handleKeyDown = (e) => {
        if (!isOpen || !suggestions.length) return;
        if (e.key === 'ArrowDown') { e.preventDefault(); setHighlightedIndex(i => Math.min(i + 1, suggestions.length - 1)); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlightedIndex(i => Math.max(i - 1, 0)); }
        else if (e.key === 'Enter') { e.preventDefault(); if (highlightedIndex >= 0) handleSelect(suggestions[highlightedIndex]); }
        else if (e.key === 'Escape') setIsOpen(false);
    };

    const isSelected = !!(value?.latitude);

    return (
        <div className="relative">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className={`
                relative flex items-center border rounded-lg transition-all bg-white
                ${error ? 'border-red-300 ring-1 ring-red-200' : isSelected ? 'border-green-400 ring-1 ring-green-100' : 'border-gray-200'}
                ${disabled ? 'opacity-60 bg-gray-50' : ''}
                focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500
            `}>
                <div className="pl-3 flex-shrink-0 text-gray-400">
                    {isLoading
                        ? <Loader2 size={15} className="animate-spin text-blue-500" />
                        : isSelected
                            ? <MapPin size={15} className="text-green-500" />
                            : <Search size={15} />
                    }
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => suggestions.length > 0 && setIsOpen(true)}
                    placeholder={placeholder}
                    disabled={disabled}
                    autoComplete="off"
                    className="flex-1 px-2 py-2 text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400"
                />
                {/* Coordonnées affichées si sélectionné */}
                {isSelected && (
                    <span className="text-xs text-green-600 font-mono px-2 whitespace-nowrap hidden sm:block">
                        {value.latitude.toFixed(4)}, {value.longitude.toFixed(4)}
                    </span>
                )}
                {query && !disabled && (
                    <button type="button" onClick={handleClear} className="pr-2 pl-1 text-gray-400 hover:text-gray-600" tabIndex={-1}>
                        <X size={13} />
                    </button>
                )}
            </div>

            {/* Coordonnées sur mobile */}
            {isSelected && (
                <p className="text-xs text-green-600 mt-1 sm:hidden">
                    📍 {value.latitude.toFixed(5)}, {value.longitude.toFixed(5)}
                </p>
            )}
            {networkError && <p className="text-xs text-orange-500 mt-1">{networkError}</p>}
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

            {/* Dropdown */}
            {isOpen && suggestions.length > 0 && (
                <div ref={dropdownRef} className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                    <div className="px-3 py-1.5 border-b border-gray-100 flex justify-between">
                        <span className="text-xs text-gray-400">Résultats au Cameroun</span>
                        <span className="text-xs text-gray-400">{suggestions.length} résultat{suggestions.length > 1 ? 's' : ''}</span>
                    </div>
                    <ul className="max-h-52 overflow-y-auto">
                        {suggestions.map((s, idx) => (
                            <li key={s.id}>
                                <button
                                    type="button"
                                    className={`w-full text-left px-3 py-2.5 flex items-start gap-2 transition-colors ${highlightedIndex === idx ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                                    onMouseEnter={() => setHighlightedIndex(idx)}
                                    onMouseDown={(e) => { e.preventDefault(); handleSelect(s); }}
                                >
                                    <MapPin size={13} className="text-blue-500 mt-0.5 flex-shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-gray-800 truncate">{s.name}</p>
                                        <p className="text-xs text-gray-400 truncate">{s.displayName}</p>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                    <div className="px-3 py-1 border-t border-gray-100">
                        <span className="text-xs text-gray-300">© OpenStreetMap contributors</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LocationAutocomplete;