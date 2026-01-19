'use client';

import { ScoreBreakdown } from '@/types';

interface ScoreDisplayProps {
    score: number;
    breakdown: ScoreBreakdown;
    showDetails?: boolean;
}

const SCORE_LABELS: Record<keyof ScoreBreakdown, { label: string; icon: string }> = {
    colorHarmony: { label: 'Color Harmony', icon: '🎨' },
    styleMatch: { label: 'Style Match', icon: '✨' },
    occasionFit: { label: 'Occasion Fit', icon: '📅' },
    seasonRelevance: { label: 'Season', icon: '🌤️' },
    budgetAlignment: { label: 'Budget Fit', icon: '💰' },
};

function getScoreColor(score: number): string {
    if (score >= 0.85) return 'text-emerald-600';
    if (score >= 0.70) return 'text-blue-600';
    if (score >= 0.50) return 'text-amber-600';
    return 'text-red-600';
}

function getScoreGradient(score: number): string {
    if (score >= 0.85) return 'from-emerald-400 to-emerald-600';
    if (score >= 0.70) return 'from-blue-400 to-blue-600';
    if (score >= 0.50) return 'from-amber-400 to-amber-600';
    return 'from-red-400 to-red-600';
}

function ScoreBar({ value, label, icon }: { value: number; label: string; icon: string }) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-sm">{icon}</span>
            <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-600">{label}</span>
                    <span className={`text-xs font-semibold ${getScoreColor(value)}`}>
                        {Math.round(value * 100)}%
                    </span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full bg-gradient-to-r ${getScoreGradient(value)} transition-all duration-500`}
                        style={{ width: `${value * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
}

export default function ScoreDisplay({ score, breakdown, showDetails = true }: ScoreDisplayProps) {
    const scoreLabel = score >= 0.85 ? 'Excellent' : score >= 0.70 ? 'Good' : score >= 0.50 ? 'Fair' : 'Low';

    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-sm font-medium text-gray-500">Match Score</h3>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className={`text-4xl font-bold ${getScoreColor(score)}`}>
                            {Math.round(score * 100)}
                        </span>
                        <span className="text-gray-400 text-sm">/100</span>
                    </div>
                </div>
                <div className={`
          px-3 py-1.5 rounded-full text-sm font-medium
          ${score >= 0.85 ? 'bg-emerald-100 text-emerald-800' : ''}
          ${score >= 0.70 && score < 0.85 ? 'bg-blue-100 text-blue-800' : ''}
          ${score >= 0.50 && score < 0.70 ? 'bg-amber-100 text-amber-800' : ''}
          ${score < 0.50 ? 'bg-red-100 text-red-800' : ''}
        `}>
                    {scoreLabel}
                </div>
            </div>

            {showDetails && (
                <div className="space-y-3 pt-4 border-t border-gray-100">
                    {Object.entries(breakdown).map(([key, value]) => (
                        <ScoreBar
                            key={key}
                            value={value}
                            label={SCORE_LABELS[key as keyof ScoreBreakdown].label}
                            icon={SCORE_LABELS[key as keyof ScoreBreakdown].icon}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
