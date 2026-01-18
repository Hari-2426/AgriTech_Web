const Analysis = require('../models/Analysis');
const CropDisease = require('../models/CropDisease');
const { formatResponse } = require('../utils/responseFormatter');
const path = require('path');

// @desc    Analyze crop image (Rule-based)
// @route   POST /api/crop/analyze
// @access  Private
exports.analyzeCrop = async (req, res, next) => {
    try {
        if (!req.file) {
            res.status(400);
            throw new Error('Please upload an image');
        }

        const fileName = req.file.originalname.toLowerCase();
        let detectedCrop = req.body.cropType || ''; // User might provide it

        // Knowledge Base - normally from DB, but let's have some fallbacks
        const diseases = await CropDisease.find();

        let matches = [];

        // 1. Keyword matching on filename
        for (const disease of diseases) {
            const hasKeyword = disease.keywords.some(kw => fileName.includes(kw.toLowerCase()));
            if (hasKeyword) {
                matches.push(disease);
            }
        }

        let resultDisease;

        if (matches.length > 0) {
            // Pick the best match or first match
            resultDisease = matches[0];
        } else {
            // 2. Fallback: Heuristic based on cropType and randomness
            const cropSpecificDiseases = diseases.filter(d => d.cropName.toLowerCase() === detectedCrop.toLowerCase());

            if (cropSpecificDiseases.length > 0) {
                // Return a random disease for that crop
                resultDisease = cropSpecificDiseases[Math.floor(Math.random() * cropSpecificDiseases.length)];
            } else {
                // Total fallback: Healthy or common generic disease
                resultDisease = diseases[0] || {
                    cropName: detectedCrop || 'Unknown',
                    diseaseName: 'Healthy',
                    symptoms: ['No unusual symptoms detected'],
                    remedies: ['Maintain regular irrigation and fertilization'],
                    prevention: ['Continue regular monitoring'],
                    severityRange: { min: 0, max: 0 }
                };
            }
        }

        // 3. Simulated Severity Logic
        // Calculate based on "noise" or "brightness" in a real app, 
        // here we use bounded randomness for simulation.
        const severity = Math.floor(
            Math.random() * (resultDisease.severityRange.max - resultDisease.severityRange.min + 1)
        ) + resultDisease.severityRange.min;

        // Bounded confidence (60-95%)
        const confidence = (Math.random() * (95 - 60) + 60).toFixed(2);

        // Save to History
        const analysis = await Analysis.create({
            farmerId: req.user.id,
            imageUrl: `/uploads/${req.file.filename}`,
            cropName: resultDisease.cropName,
            diseaseName: resultDisease.diseaseName,
            severity,
            confidence,
            results: {
                symptoms: resultDisease.symptoms,
                remedies: resultDisease.remedies,
                prevention: resultDisease.prevention
            }
        });

        res.status(200).json(formatResponse(true, 'Analysis complete', analysis));
    } catch (error) {
        next(error);
    }
};

// @desc    Get analysis history
// @route   GET /api/crop/history
// @access  Private
exports.getHistory = async (req, res, next) => {
    try {
        const history = await Analysis.find({ farmerId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(formatResponse(true, 'History retrieved', history));
    } catch (error) {
        next(error);
    }
};
