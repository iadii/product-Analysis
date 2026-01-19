'use client';

import { RecommendationFilters } from '@/types';

interface FilterPanelProps {
    filters: RecommendationFilters;
    onChange: (filters: RecommendationFilters) => void;
}

const OCCASIONS = ['casual', 'gym', 'party', 'date', 'work', 'outdoor'];
const SEASONS = ['all', 'spring', 'summer', 'fall', 'winter'];
const STYLES = ['casual', 'athletic', 'streetwear', 'formal', 'luxury', 'minimalist'];

export default function FilterPanel({ filters, onChange }: FilterPanelProps) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>

            <div className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Occasion</label>
                    <div className="flex flex-wrap gap-2">
                        {OCCASIONS.map((occasion) => (
                            <button
                                key={occasion}
                                onClick={() => onChange({
                                    ...filters,
                                    occasion: filters.occasion === occasion ? undefined : occasion
                                })}
                                className={`
                  px-3 py-1.5 rounded-full text-sm font-medium transition-all capitalize
                  ${filters.occasion === occasion
                                        ? 'bg-violet-500 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                `}
                            >
                                {occasion}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Season</label>
                    <div className="flex flex-wrap gap-2">
                        {SEASONS.map((season) => (
                            <button
                                key={season}
                                onClick={() => onChange({
                                    ...filters,
                                    season: filters.season === season ? undefined : season
                                })}
                                className={`
                  px-3 py-1.5 rounded-full text-sm font-medium transition-all capitalize
                  ${filters.season === season
                                        ? 'bg-violet-500 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                `}
                            >
                                {season}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
                    <div className="flex flex-wrap gap-2">
                        {STYLES.map((style) => (
                            <button
                                key={style}
                                onClick={() => onChange({
                                    ...filters,
                                    style: filters.style === style ? undefined : style
                                })}
                                className={`
                  px-3 py-1.5 rounded-full text-sm font-medium transition-all capitalize
                  ${filters.style === style
                                        ? 'bg-violet-500 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                `}
                            >
                                {style}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Budget: {filters.maxBudget ? `₹${filters.maxBudget.toLocaleString()}` : 'No limit'}
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="200000"
                        step="5000"
                        value={filters.maxBudget || 0}
                        onChange={(e) => onChange({
                            ...filters,
                            maxBudget: parseInt(e.target.value) || undefined
                        })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-violet-500"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>No limit</span>
                        <span>₹2L</span>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Outfits: {filters.limit || 5}
                    </label>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={filters.limit || 5}
                        onChange={(e) => onChange({ ...filters, limit: parseInt(e.target.value) })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-violet-500"
                    />
                </div>

                {(filters.occasion || filters.season || filters.style || filters.maxBudget) && (
                    <button
                        onClick={() => onChange({ limit: filters.limit })}
                        className="w-full py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                    >
                        Clear Filters
                    </button>
                )}
            </div>
        </div>
    );
}
