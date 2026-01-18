import { useState, useMemo } from 'react';
import { CropType } from '@/types/agri';

export type DecisionScoreStatus = 'Excellent' | 'Good' | 'Risky' | 'High Risk';

export interface IntelligenceData {
    decisionScore: number;
    scoreStatus: DecisionScoreStatus;
    scoreReasons: string[];
    lossAvoided: number;
    failureRisk: 'Low' | 'Medium' | 'High';
    failureReason: string;
    priceShockRisk: 'Low' | 'Medium' | 'High';
    knowledgeLevel: 'Beginner' | 'Intermediate' | 'Advanced';
    knowledgeProgress: number;
    nearbyDistrictComparison: string;
    regretScore: number;
    regretMessage: string;
}

export function useIntelligence() {
    const farmerDataString = localStorage.getItem('farmerData');
    const farmerData = farmerDataString ? JSON.parse(farmerDataString) : null;

    const district = farmerData?.district || 'Guntur';
    const state = farmerData?.state || 'Andhra Pradesh';
    const selectedCrop = (farmerData?.cropType as CropType) || 'rice';

    // Track "read" insights in localStorage for Knowledge Level
    const readInsightsCount = parseInt(localStorage.getItem('agri_insights_read') || '0', 10);

    const intelligence = useMemo((): IntelligenceData => {
        let score = 100;
        const reasons: string[] = [];

        // Rule-based Score Logic
        // 1. Crop Suitability (Simplified)
        const isCottonInAP = selectedCrop === 'cotton' && state === 'Andhra Pradesh';
        const isRiceEverywhere = selectedCrop === 'rice';

        if (selectedCrop === 'tomato') {
            score -= 20; // High risk crop
            reasons.push('High price volatility for tomato this season');
        }

        if (state === 'Telangana' && selectedCrop === 'rice') {
            score -= 15; // Possible water stress assumption in some areas
            reasons.push('Region-specific water stress forecast');
        }

        // 2. Sell Timing (Simulated)
        const currentMonth = new Date().getMonth();
        if (currentMonth >= 2 && currentMonth <= 4 && selectedCrop === 'wheat') {
            score -= 20; // Bad sell timing for wheat
            reasons.push('Market saturation expected during harvest peak');
        }

        // 3. Soil match (Simulated)
        if (selectedCrop === 'groundnut' && district === 'Guntur') {
            score -= 10;
            reasons.push('Sub-optimal soil pH for groundnut in this block');
        }

        // Bounds check
        score = Math.max(30, score);

        let status: DecisionScoreStatus = 'Excellent';
        if (score < 40) status = 'High Risk';
        else if (score < 60) status = 'Risky';
        else if (score < 80) status = 'Good';

        // Loss Avoided Logic
        const lossAvoided = score > 70 ? (score - 70) * 800 + 4000 : 2000;

        // Failure Risk
        let failureRisk: 'Low' | 'Medium' | 'High' = 'Low';
        let failureReason = 'Stable climate and soil conditions expected.';
        if (score < 50) {
            failureRisk = 'High';
            failureReason = 'High disease window overlap and water stress predicted.';
        } else if (score < 75) {
            failureRisk = 'Medium';
            failureReason = 'Minor seasonal mismatch detected.';
        }

        // Knowledge Level
        let kLevel: 'Beginner' | 'Intermediate' | 'Advanced' = 'Beginner';
        if (readInsightsCount > 10) kLevel = 'Advanced';
        else if (readInsightsCount > 5) kLevel = 'Intermediate';

        // Nearby District Comparison
        const nearbyComparison = state === 'Andhra Pradesh'
            ? 'Nearby Krishna district farmers earn 12% more due to multi-crop diversification.'
            : 'Neighboring Nizamabad fields show 8% higher yield due to smart irrigation adoption.';

        // Regret Logic (Simulated)
        const regretScore = score < 60 ? 65 : 15;
        const regretMessage = score < 60
            ? 'Choosing high-risk crops in saturation periods often leads to sub-optimal profit.'
            : 'Your decision align well with regional security standards.';

        return {
            decisionScore: score,
            scoreStatus: status,
            scoreReasons: reasons.length > 0 ? reasons : ['Optimal conditions for selected crop'],
            lossAvoided,
            failureRisk,
            failureReason,
            priceShockRisk: selectedCrop === 'tomato' || selectedCrop === 'onion' ? 'High' : 'Low',
            knowledgeLevel: kLevel,
            knowledgeProgress: Math.min(100, (readInsightsCount / 15) * 100),
            nearbyDistrictComparison: nearbyComparison,
            regretScore,
            regretMessage
        };
    }, [selectedCrop, state, district, readInsightsCount]);

    const incrementKnowledge = () => {
        const current = parseInt(localStorage.getItem('agri_insights_read') || '0', 10);
        localStorage.setItem('agri_insights_read', (current + 1).toString());
    };

    return { intelligence, incrementKnowledge };
}
