import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export type Language = 'en' | 'te' | 'hi';

interface Translations {
  [key: string]: {
    en: string;
    te: string;
    hi: string;
  };
}

// Translation dictionary
export const translations: Translations = {
  // Header & Navigation
  'app.name': { en: 'AgriAssist', te: 'అగ్రి అసిస్ట్', hi: 'एग्री असिस्ट' },
  'app.tagline': { en: 'Smart Farming', te: 'స్మార్ట్ వ్యవసాయం', hi: 'स्मार्ट खेती' },
  'nav.dashboard': { en: 'Dashboard', te: 'డాష్‌బోర్డ్', hi: 'డैशबोर्ड' },
  'nav.cropScanner': { en: 'Crop Scanner', te: 'పంట స్కానర్', hi: 'ఫసల్ స్కానర్' },
  'nav.irrigation': { en: 'Irrigation', te: 'నీటిపారుదల', hi: 'సించాయీ' },
  'nav.weather': { en: 'Weather', te: 'వాతావరణం', hi: 'మౌసమ్' },
  'nav.fertilizer': { en: 'Fertilizer', te: 'ఎరువులు', hi: 'ఉర్వరక్' },
  'nav.home': { en: 'Home', te: 'హోమ్', hi: 'హోమ్' },
  'nav.scan': { en: 'Scan', te: 'స్కాన్', hi: 'స్కాన్' },
  'nav.water': { en: 'Water', te: 'నీరు', hi: 'పానీ' },
  'nav.register': { en: 'Farmer Registration', te: 'రైతు నమోదు', hi: ' కిసాన్ పంజీకరణ్' },
  'nav.guidance': { en: 'Crop Guidance', te: 'పంట మార్గదర్శకత్వం', hi: 'ఫసల్ మార్గదర్శన్' },
  'nav.market': { en: 'Market Insights', te: 'మార్కెట్ అంతర్దృష్టులు', hi: 'బాజార్ అంతర్దృష్టి' },
  'nav.demand': { en: 'Demand & Supply', te: 'డిమాండ్ & సప్లై', hi: 'మాంగ్ ఔర్ ఆపూర్తి' },
  'nav.insights': { en: 'Regional Insights', te: 'ప్రాంతీయ అంతర్దృష్టులు', hi: 'క్షేత్రీయ అంతర్దృష్టి' },
  'nav.profiles': { en: 'Farmer Profiles', te: 'రైతు ప్రొఫైల్స్', hi: 'కిసాన్ ప్రొఫైల్' },
  'nav.farmHealth': { en: 'Farm Health', te: 'వ్యవసాయ ఆరోగ్యం', hi: 'ఖేత్ కా స్వాస్థ్య' },

  // Dashboard
  'dashboard.welcome': { en: 'Good Morning, Farmer!', te: 'శుభోదయం, రైతు!', hi: 'సుప్రభాత్, కిసాన్!' },
  'dashboard.welcomeTitle': { en: 'Welcome to AgriAssist', te: 'అగ్రి అసిస్ట్‌కు స్వాగతం', hi: 'అగ్రి అసిస్ట్ మేం స్వాగత్ హై' },
  'dashboard.welcomeDesc': { en: 'Your smart farming companion. Monitor crop health, get AI-powered insights, and optimize your farm\'s productivity.', te: 'మీ స్మార్ట్ వ్యవసాయ సహచరుడు. పంట ఆరోగ్యాన్ని పర్యవేక్షించండి, AI-ఆధారిత అంతర్దృష్టులను పొందండి, మీ వ్యవసాయ ఉత్పాదకతను మెరుగుపర్చేందుకు.', hi: 'ఆపకా స్మార్ట్ ఖేతీ సాథీ. ఫసల్ స్వాస్థ్య కీ నిగరానీ కరేం, AI-సంచాలిత్ అంతర్దృష్టి ప్రాప్త కరేం.' },
  'dashboard.quickActions': { en: 'Quick Actions', te: 'త్వరిత చర్యలు', hi: 'త్వరిత్ కారవై' },
  'dashboard.farmOverview': { en: 'Farm Overview', te: 'వ్యవసాయ అవలోకనం', hi: 'ఖేత్ కా అవలోకన్' },
  'dashboard.todayWeather': { en: "Today's Weather", te: 'ఈ రోజు వాతావరణం', hi: 'ఆజ్ కా మౌసమ్' },
  'dashboard.farmHealth': { en: 'Farm Health', te: 'వ్యవసాయ ఆరోగ్యం', hi: 'ఖేత్ కా స్వాస్థ్య' },
  'dashboard.overallScore': { en: 'Overall Score', te: 'మొత్తం స్కోరు', hi: 'సమగ్ర స్కోర్' },
  'dashboard.thisWeek': { en: 'This week', te: 'ఈ వారం', hi: 'ఇస్ సప్తాహ్' },

  // Stats
  'stats.totalCrops': { en: 'Total Crops', te: 'మొత్తం పంటలు', hi: 'కుల్ ఫసలేం' },
  'stats.healthyCrops': { en: 'Healthy Crops', te: 'ఆరోగ్యకరమైన పంటలు', hi: 'స్వస్థ్ ఫసలేం' },
  'stats.waterSaved': { en: 'Water Saved', te: 'ఆదా చేసిన నీరు', hi: 'బచాయా గయా పానీ' },
  'stats.activeAlerts': { en: 'Active Alerts', te: 'యాక్టివ్ హెచ్చరికలు', hi: 'సక్రియ అలర్ట్' },
  'stats.acrossFields': { en: 'Across 4 fields', te: '4 పొలాల్లో', hi: '4 ఖేతోం మేం' },
  'stats.thisMonth': { en: 'This month', te: 'ఈ నెల', hi: 'ఇస్ మహీనే' },
  'stats.critical': { en: 'critical', te: 'క్లిష్టమైన', hi: 'గంభీర్' },

  // Quick Actions
  'action.scanCrop': { en: 'Scan Crop', te: 'పంట స్కాన్', hi: 'ఫసల్ స్కాన్' },
  'action.diseaseDetection': { en: 'AI Disease Detection', te: 'AI వ్యాధి గుర్తింపు', hi: 'AI రోగ్ పహచాన్' },
  'action.checkWater': { en: 'Check Water', te: 'నీరు తనిఖీ', hi: 'పానీ జాంచేం' },
  'action.irrigationStatus': { en: 'Irrigation Status', te: 'నీటిపారుదల స్థితి', hi: 'సించాయీ స్థితి' },
  'action.forecastAlerts': { en: 'Forecast & Alerts', te: 'అంచనా & హెచ్చరికలు', hi: 'పూర్వానుమాన్ ఔర్ అలర్ట్' },
  'action.recommendations': { en: 'Recommendations', te: 'సిఫార్సులు', hi: 'సిఫారిశేం' },

  // Crop Health
  'health.healthy': { en: 'Healthy', te: 'ఆరోగ్యకరం', hi: 'స్వస్థ్' },
  'health.warning': { en: 'Needs Attention', te: 'శ్రద్ధ అవసరం', hi: 'ధ్యాన్ దేనే కీ జరూరత్' },
  'health.critical': { en: 'Critical', te: 'క్లిష్టమైన', hi: 'గంభీర్' },
  'health.lastChecked': { en: 'Last checked', te: 'చివరి తనిఖీ', hi: 'అంతిమ్ జాంచ్' },
  'health.score': { en: 'Health Score', te: 'ఆరోగ్య స్కోరు', hi: 'స్వాస్థ్య స్కోర్' },

  // Alerts
  'alerts.title': { en: 'Alerts', te: 'హెచ్చరికలు', hi: 'అలర్ట్' },
  'alerts.new': { en: 'new', te: 'కొత్త', hi: 'నయా' },
  'alerts.markAllRead': { en: 'Mark all read', te: 'అన్నీ చదివినట్లు గుర్తించు', hi: 'సభీ పఢే హుయే' },
  'alerts.allCaughtUp': { en: 'All caught up! No new alerts.', te: 'అన్నీ పూర్తయ్యాయి! కొత్త హెచ్చరికలు లేవు.', hi: 'సబ్ పకడ లియా! కోయి నయా అలర్ట్ నహీం.' },
  'alerts.viewAll': { en: 'View all alerts', te: 'అన్ని హెచ్చరికలు చూడండి', hi: 'సభీ అలర్ట్ దేఖేం' },

  // Severity
  'severity.info': { en: 'Info', te: 'సమాచారం', hi: 'జానకారీ' },
  'severity.warning': { en: 'Warning', te: 'హెచ్చరిక', hi: 'చేతావనీ' },
  'severity.critical': { en: 'Critical', te: 'క్లిష్టమైన', hi: 'గంభీర్' },

  // Disease Scanner
  'scanner.title': { en: 'AI Crop Disease Scanner', te: 'AI పంట వ్యాధి స్కానర్', hi: 'AI ఫసల్ రోగ్ స్కానర్' },
  'scanner.desc': { en: 'Upload a photo of your crop to detect diseases and get treatment recommendations', te: 'వ్యాధులను గుర్తించడానికి మరియు చికిత్స సిఫార్సులను పొందడానికి మీ పంట ఫోటోను అప్‌లోడ్ చేయండి', hi: 'రోగోం కా పతా లగానే కే లియే అపనీ ఫసల్ కీ తస్వీర్ అప్‌లోడ్ కరేం' },
  'scanner.selectCrop': { en: 'Select Crop & Upload Image', te: 'పంటను ఎంచుకోండి & చిత్రాన్ని అప్‌లోడ్ చేయండి', hi: 'ఫసల్ చునేం ఔర్ ఛవి అప్‌లోడ్ కరేం' },
  'scanner.stepOne': { en: '1. Select Crop & Upload Image', te: '1. పంటను ఎంచుకోండి & చిత్రాన్ని అప్‌లోడ్ చేయండి', hi: '1. ఫసల్ చునేం ఔర్ ఛవి అప్‌లోడ్ కరేం' },
  'scanner.stepTwo': { en: '2. Analysis Results', te: '2. విశ్లేషణ ఫలితాలు', hi: '2. విశ్లేషణ్ పరిణామ్' },
  'scanner.cropType': { en: 'Crop Type', te: 'పంట రకం', hi: 'ఫసల్ ప్రకార్' },
  'scanner.selectYourCrop': { en: 'Select your crop', te: 'మీ పంటను ఎంచుకోండి', hi: 'అపనీ ఫసల్ చునేం' },
  'scanner.dropImage': { en: 'Drop your image here', te: 'మీ చిత్రాన్ని ఇక్కడ డ్రాప్ చేయండి', hi: 'అపనీ ఛవి యహాఁ ఛోడేం' },
  'scanner.orClick': { en: 'or click to browse', te: 'లేదా బ్రౌజ్ చేయడానికి క్లిక్ చేయండి', hi: 'యా బ్రౌజ్ కరనే కే లియే క్లిక్ కరేం' },
  'scanner.upload': { en: 'Upload', te: 'అప్‌లోడ్', hi: 'అప్‌లోడ్' },
  'scanner.camera': { en: 'Camera', te: 'కెమెరా', hi: 'కైమరా' },
  'scanner.analyzeCrop': { en: 'Analyze Crop', te: 'పంటను విశ్లేషించండి', hi: 'ఫసల్ కా విశ్లేషణ్ కరేం' },
  'scanner.analyzing': { en: 'Analyzing...', te: 'విశ్లేషిస్తోంది...', hi: 'విశ్లేషణ్ హో రహా హై...' },
  'scanner.analyzingCrop': { en: 'Analyzing crop...', te: 'పంటను విశ్లేషిస్తోంది...', hi: 'ఫసల్ కా విశ్లేషణ్ హో రహా హై...' },
  'scanner.results': { en: 'Analysis Results', te: 'విశ్లేషణ ఫలితాలు', hi: 'విశ్లేషణ్ పరిణామ్' },
  'scanner.noAnalysis': { en: 'No analysis yet', te: 'ఇంకా విశ్లేషణ లేదు', hi: 'అభీ తక్ కోయి విశ్లేషణ్ నహీం' },
  'scanner.noAnalysisDesc': { en: 'Upload a crop image and click "Analyze Crop" to get AI-powered disease detection', te: 'AI-ఆధారిత వ్యాధి గుర్తింపు పొందడానికి పంట చిత్రాన్ని అప్‌లోడ్ చేసి "పంటను విశ్లేషించండి" క్లిక్ చేయండి', hi: 'AI-సంచాలిత్ రోగ్ పహచాన్ కే లియే ఫసల్ ఛవి అప్‌లోడ్ కరేం' },
  'scanner.confidence': { en: 'Confidence', te: 'విశ్వాసం', hi: 'విశ్వాస్' },
  'scanner.severity': { en: 'Severity Level', te: 'తీవ్రత స్థాయి', hi: 'గంభీరతా స్త్ర్' },
  'scanner.symptoms': { en: 'Symptoms', te: 'లక్షణాలు', hi: 'లక్షణ్' },
  'scanner.treatment': { en: 'Treatment Steps', te: 'చికిత్స దశలు', hi: 'ఉపచార్ కే చరణ్' },
  'scanner.prevention': { en: 'Prevention Tips', te: 'నివారణ చిట్కాలు', hi: 'రోక్తామ్ కే టిప్స్' },
  'scanner.analysisComplete': { en: 'Analysis complete!', te: 'విశ్లేషణ పూర్తయింది!', hi: 'విశ్లేషణ్ పూర్ణ్!' },
  'scanner.analysisError': { en: 'Failed to analyze image. Please try again.', te: 'చిత్రాన్ని విశ్లేషించడంలో విఫలమైంది. దయచేసి మళ్ళీ ప్రయత్నికండి.', hi: 'ఛవి కా విశ్లేషణ్ కరనే మేం విఫల్. కృపయా పునః ప్రయాస్ కరేం.' },
  'scanner.selectCropError': { en: 'Please select a crop type and upload an image', te: 'దయచేసి పంట రకాన్ని ఎంచుకోండి మరియు చిత్రాన్ని అప్‌లోడ్ చేయండి', hi: 'కృపయా ఫసల్ ప్రకార్ చునేం ఔర్ ఛవి అప్‌లోడ్ కరేం' },
  'scanner.severityLow': { en: 'Low Severity', te: 'తక్కువ తీవ్రత', hi: 'కమ్ గంభీరతా' },
  'scanner.severityMedium': { en: 'Medium Severity', te: 'మధ్యస్థ తీవ్రత', hi: 'మధ్యమ్ గంభీరతా' },
  'scanner.severityHigh': { en: 'High Severity', te: 'అధిక తీవ్రత', hi: 'ఉచ్ఛ గంభీరతా' },
  'scanner.severityCritical': { en: 'Critical Severity', te: 'క్లిష్టమైన తీవ్రత', hi: 'గంభీర్ గంభీరతా' },

  // Irrigation
  'irrigation.title': { en: 'Smart Irrigation Advisor', te: 'స్మార్ట్ నీటిపారుదల సలహాదారు', hi: 'స్మార్ట్ సించాయీ సలాహ్కార్' },
  'irrigation.desc': { en: 'AI-powered water management for optimal crop growth', te: 'అనుకూలమైన పంట పెరుగుదల కోసం AI-ఆధారిత నీటి నిర్వహణ', hi: 'ఇష్టతమ్ ఫసల్ వృద్ధి కే లియే AI-సంచాలిత్ జల్ ప్రబంధన్' },
  'irrigation.soilMoisture': { en: 'Soil Moisture', te: 'నేల తేమ', hi: 'మిట్టీ కీ నమీ' },
  'irrigation.needsWater': { en: 'Needs Water', te: 'నీరు అవసరం', hi: 'పానీ కీ జరూరత్' },
  'irrigation.optimal': { en: 'Optimal', te: 'అనుకూలం', hi: 'ఇష్టతమ్' },
  'irrigation.wellHydrated': { en: 'Well Hydrated', te: 'బాగా తడిసిన', hi: 'అచ్ఛీ తరహ్ సే హైడ్రేటెడ్' },
  'irrigation.low': { en: 'Low', te: 'తక్కువ', hi: 'కమ్' },
  'irrigation.high': { en: 'High', te: 'అధికం', hi: 'ఉచ్ఛ' },
  'irrigation.recommended': { en: 'Recommended Water', te: 'సిఫార్సు చేసిన నీరు', hi: 'అనుశంసిత్ పానీ' },
  'irrigation.perCycle': { en: 'Per irrigation cycle', te: 'ప్రతి నీటిపారుదల చక్రానికి', hi: 'ప్రతి సించాయీ చక్ర కే లియే' },
  'irrigation.next': { en: 'Next', te: 'తదుపరి', hi: 'అగలా' },
  'irrigation.savings': { en: 'Water Savings', te: 'నీటి ఆదా', hi: 'పానీ కీ బచత్' },
  'irrigation.compared': { en: 'Compared to traditional methods', te: 'సాంప్రదాయ పద్ధతులతో పోల్చితే', hi: 'పారంపరిక్ తరీకోం కీ తులనా మేం' },
  'irrigation.weeklySchedule': { en: 'Weekly Irrigation Schedule', te: 'వారపు నీటిపారుదల షెడ్యూల్', hi: 'సాప్తహిక్ సించాయీ అనుసూచీ' },
  'irrigation.dailyWaterRequirements': { en: 'Daily Water Requirements', te: 'రోజువారీ నీటి అవసరం', hi: 'దైనిక్ పానీ కీ ఆవశ్యకతా' },
  'irrigation.dailyWaterRequirementsDesc': { en: 'A quick view of water needed per day (7 days).', te: '7 రోజులుగా ప్రతి రోజూ అవసరమైన నీటి త్వరిత దృశ్యం.', hi: '7 దినోం కే లియే ప్రతి దిన్ ఆవశ్యక్ పానీ.' },
  'irrigation.unitLiters': { en: 'Liters (L)', te: 'లీటర్లు (L)', hi: 'లీటర్ (L)' },
  'irrigation.legendCompleted': { en: 'Completed', te: 'పూర్తయింది', hi: 'పూర్ణ్' },
  'irrigation.legendScheduled': { en: 'Scheduled', te: 'షెడ్యూల్ చేయబడింది', hi: 'నిర్ధారిత్' },
  'irrigation.legendSkipped': { en: 'Skipped', te: 'దాటవేయబడింది', hi: 'ఛోడ్ దియా' },
  'irrigation.scheduled': { en: 'Scheduled', te: 'షెడ్యూల్ చేయబడింది', hi: 'నిర్ధారిత్' },
  'irrigation.completed': { en: 'Completed', te: 'పూర్తయింది', hi: 'పూర్ణ్' },
  'irrigation.skipped': { en: 'Skipped', te: 'దాటవేయబడింది', hi: 'ఛోడ్ దియా' },

  // Weather
  'weather.title': { en: 'Weather Intelligence Center', te: 'వాతావరణ ఇంటెలిజెన్స్ సెంటర్', hi: 'మౌసమ్ ఖుఫియా కేంద్ర' },
  'weather.desc': { en: 'Real-time weather data for smart farming decisions', te: 'స్మార్ట్ వ్యవసాయ నిర్ణయాల కోసం రియల్-టైమ్ వాతావరణ డేటా', hi: 'స్మార్ట్ ఖేతీ నిర్ణయోం కే లియే రీల్-టైమ్ మౌసమ్ డేటా' },
  'weather.current': { en: 'Current Weather', te: 'ప్రస్తుత వాతావరణం', hi: 'వర్తమాన్ మౌసమ్' },
  'weather.humidity': { en: 'Humidity', te: 'తేమ', hi: 'ఆర్ద్రతా' },
  'weather.wind': { en: 'Wind', te: 'గాలి', hi: 'హవా' },
  'weather.feelsLike': { en: 'Feels Like', te: 'అనుభూతి', hi: 'మహసూస్ హోతా హై' },
  'weather.uvIndex': { en: 'UV Index', te: 'UV సూచిక', hi: 'UV సూచకాఁక్' },
  'weather.hourly': { en: 'Hourly Forecast', te: 'గంటకు అంచనా', hi: 'ప్రతి ఘంటా పూర్వానుమాన్' },
  'weather.daily': { en: '7-Day Forecast', te: '7-రోజుల అంచనా', hi: '7-దిన్ కా పూర్వానుమాన్' },
  'weather.today': { en: 'Today', te: 'ఈ రోజు', hi: 'ఆజ్' },
  'weather.alerts': { en: 'Weather Alerts', te: 'వాతావరణ హెచ్చరికలు', hi: 'మౌసమ్ అలర్ట్' },
  'weather.highUV': { en: 'High UV Index Expected', te: 'అధిక UV సూచిక అంచనా', hi: 'ఉచ్ఛ UV సూచకాఁక్ అపేక్షిత్' },
  'weather.highUVDesc': { en: 'UV levels will be high between 11 AM - 3 PM.', te: 'UV స్థాయిలు ఉదయం 11 - మధ్యాహ్నం 3 మధ్య అధికంగా ఉంటాయి.', hi: 'UV స్త్ర్ 11 AM - 3 PM కే బీచ్ ఉచ్ఛ హోంగే.' },
  'weather.rainExpected': { en: 'Rain Expected Tomorrow', te: 'రేపు వర్షం అంచనా', hi: 'కల్ బారిష్ కీ సంభావనా' },
  'weather.rainExpectedDesc': { en: 'Light rainfall expected in the afternoon.', te: 'మధ్యాహ్నం తేలికపాటి వర్షం అంచనా.', hi: 'దోపహర్ మేం హల్కీ బారిష్ కీ సంభావనా.' },
  'weather.moderate': { en: 'Moderate', te: 'మధ్యస్థం', hi: 'మధ్యమ్' },
  'weather.info': { en: 'Info', te: 'సమాచారం', hi: 'జానకారీ' },

  // Fertilizer
  'fertilizer.title': { en: 'Fertilizer & Treatment Advisor', te: 'ఎరువులు & చికిత్స సలహాదారు', hi: 'ఉర్వరక్ ఔర్ ఉపచార్ సలాహ్కార్' },
  'fertilizer.desc': { en: 'Get AI-powered fertilizer recommendations for your crops', te: 'మీ పంటలకు AI-ఆధారిత ఎరువు సిఫార్సులను పొందండి', hi: 'అపనీ ఫసలోం కే లియే AI-సంచాలిత్ ఉర్వరక్ సిఫారిశేం ప్రాప్త్ కరేం' },
  'fertilizer.selectCrop': { en: 'Select Your Crop', te: 'మీ పంటను ఎంచుకోండి', hi: 'అపనీ ఫసల్ చునేం' },
  'fertilizer.chooseCrop': { en: 'Choose crop type', te: 'పంట రకాన్ని ఎంచుకోండి', hi: 'ఫసల్ ప్రకార్ చునేం' },
  'fertilizer.growthStage': { en: 'Growth Stage', te: 'పెరుగుదల దశ', hi: 'వికాస్ చరణ్' },
  'fertilizer.selectStage': { en: 'Select growth stage', te: 'పెరుగుదల దశను ఎంచుకోండి', hi: 'వికాస్ చరణ్ చునేం' },
  'fertilizer.recommended': { en: 'Recommended Fertilizers', te: 'సిఫార్సు చేసిన ఎరువులు', hi: 'అనుశంసిత్ ఉర్వరక్' },
  'fertilizer.dosage': { en: 'Dosage', te: 'మోతాదు', hi: 'ఖురాక్' },
  'fertilizer.timing': { en: 'Timing', te: 'సమయం', hi: 'సమయ్' },
  'fertilizer.getRecommendations': { en: 'Get Personalized Recommendations', te: 'వ్యక్తిగత సిఫార్సులను పొందండి', hi: 'వ్యక్తిగత సిఫారిశేం ప్రాప్త్ కరేం' },
  'fertilizer.nitrogenUrea': { en: 'Nitrogen Fertilizer (Urea)', te: 'నత్రజని ఎరువు (యూరియా)', hi: 'నైట్రోజన్ ఉర్వరక్ (యూరియా)' },
  'fertilizer.phosphorusDAP': { en: 'Phosphorus Fertilizer (DAP)', te: 'భాస్వరం ఎరువు (DAP)', hi: 'ఫాస్ఫోరస్ ఉర్వరక్ (DAP)' },
  'fertilizer.potassiumMOP': { en: 'Potassium (MOP)', te: 'పొటాషియం (MOP)', hi: 'పొటాషియమ్ (MOP)' },
  'fertilizer.applyVegetative': { en: 'Apply in vegetative stage', te: 'వృక్షసంబంధ దశలో వాడండి', hi: 'వనస్పతి అవస్థా మేం లగాయేం' },
  'fertilizer.applyPlanting': { en: 'Apply at planting', te: 'నాటే సమయంలో వాడండి', hi: 'రోపణ్ కే సమయ్ లగాయేం' },
  'fertilizer.applyFlowering': { en: 'Apply during flowering', te: 'పుష్పించే సమయంలో వాడండి', hi: 'ఫూల్ ఆనే కే దౌరాన్ లగాయేం' },
  'fertilizer.avoidRain': { en: 'Avoid application before rain', te: 'వర్షానికి ముందు వాడకండి', hi: 'బారిష్ సే పహలే లగానే సే బచేం' },
  'fertilizer.keepAway': { en: 'Keep away from seeds', te: 'విత్తనాలకు దూరంగా ఉంచండి', hi: 'బీజోం సే దూర్ రఖేం' },
  'fertilizer.noMix': { en: 'Do not mix with urea', te: 'యూరియాతో కలపకండి', hi: 'యూరియా కే సాథ్ న మిలాయేం' },
  'fertilizer.type': { en: 'fertilizer', te: 'ఎరువు', hi: 'ఉర్వరక్' },

  // Growth Stages
  'stage.seedling': { en: 'Seedling', te: 'మొలక', hi: 'అంకుర్' },
  'stage.vegetative': { en: 'Vegetative', te: 'వృక్షసంబంధమైన', hi: 'వనస్పతి' },
  'stage.flowering': { en: 'Flowering', te: 'పుష్పించే', hi: 'ఫూల్ ఆనా' },
  'stage.fruiting': { en: 'Fruiting', te: 'ఫలాలు', hi: 'ఫల్ లగనా' },
  'stage.harvest': { en: 'Near Harvest', te: 'పంట సమయం', hi: 'కటాయీ కే పాస్' },

  // Crops
  'crop.rice': { en: 'Rice', te: 'వరి', hi: 'చావల్' },
  'crop.wheat': { en: 'Wheat', te: 'గోధుమ', hi: 'గేహూఁ' },
  'crop.tomato': { en: 'Tomato', te: 'టమాటా', hi: 'టమాటర్' },
  'crop.potato': { en: 'Potato', te: 'బంగాళాదుంప', hi: 'ఆలూ' },
  'crop.corn': { en: 'Corn', te: 'మొక్కజొన్న', hi: 'మక్కా' },
  'crop.cotton': { en: 'Cotton', te: 'పత్తి', hi: 'కపాస్' },
  'crop.sugarcane': { en: 'Sugarcane', te: 'చెరకు', hi: 'గన్నా' },
  'crop.chili': { en: 'Chili', te: 'మిరపకాయ', hi: 'మిర్చ్' },
  'crop.onion': { en: 'Onion', te: 'ఉల్లిపాయ', hi: 'ప్యాజ్' },
  'crop.groundnut': { en: 'Groundnut', te: 'వేరుశెనగ', hi: 'మూంగ్ఫలీ' },
  'crop.soybean': { en: 'Soybean', te: 'సోయాబీన్', hi: 'సోయాబీన్' },
  'crop.other': { en: 'Other', te: 'ఇతర', hi: 'అన్య' },

  // Common
  'common.loading': { en: 'Loading...', te: 'లోడ్ అవుతోంది...', hi: 'లోడ్ హో రహా హై...' },
  'common.error': { en: 'Error', te: 'లోపం', hi: 'త్రుటి' },
  'common.success': { en: 'Success', te: 'విజయం', hi: 'సఫలతా' },
  'common.save': { en: 'Save', te: 'సేవ్', hi: 'సహేజేం' },
  'common.cancel': { en: 'Cancel', te: 'రద్దు', hi: 'రద్దు కరేం' },
  'common.close': { en: 'Close', te: 'మూసివేయి', hi: 'బంద్ కరేం' },
  'common.settings': { en: 'Settings', te: 'సెట్టింగ్‌లు', hi: 'సెటింగ్స్' },
  'common.back': { en: 'Back', te: 'వెనుకకు', hi: 'పీచే' },
  'common.next': { en: 'Next', te: 'తదుపరి', hi: 'అగలా' },
  'common.view': { en: 'View', te: 'చూడండి', hi: 'దేఖేం' },
  'common.edit': { en: 'Edit', te: 'సవరించు', hi: 'సంపాదిత కరేం' },
  'common.update': { en: 'Update', te: 'అప్‌డేట్', hi: 'అప్‌డేట్ కరేం' },
  'common.delete': { en: 'Delete', te: 'తొలగించు', hi: 'హటాయేం' },
  'common.season': { en: 'Season', te: 'సీజన్', hi: 'సీజన్' },

  // Voice Assistant
  'voice.title': { en: 'Voice Assistant', te: 'వాయిస్ అసిస్టెంట్', hi: 'వాయిస్ అసిస్టెంట్' },
  'voice.listening': { en: 'Listening...', te: 'వింటోంది...', hi: 'సున్ రహా హై...' },
  'voice.tapToSpeak': { en: 'Tap to speak', te: 'మాట్లాడటానికి టాప్ చేయండి', hi: 'బోల్నే కే లియే ట్యాప్ కరేం' },
  'voice.speaking': { en: 'Speaking...', te: 'మాట్లాడుతోంది...', hi: 'బోల్ రహా హై...' },
  'voice.greeting': { en: 'Hello! How can I help you with farming today?', te: 'నమస్కారం! ఎలా సహాయం చేయగలను?', hi: 'నమస్తే! మై కైసే మదద్ కర్ సక్తా హూ?' },
  'voice.scanHelp': { en: 'You can scan your crop for diseases.', te: 'వ్యాధుల కోసం పంటను స్కాన్ చేయవచ్చు.', hi: 'ఆప్ ఫసల్ స్కాన్ కర్ సక్తే హై.' },
  'voice.weatherHelp': { en: 'Check the weather section for today\'s forecast.', te: 'వాతావరణం అంచనా చూడండి.', hi: 'మౌసమ్ పూర్వానుమాన్ దేఖేం.' },
  'voice.irrigationHelp': { en: 'Your soil moisture is being monitored.', te: 'మీ నేల తేమ పర్యవేక్షించబడుతోంది.', hi: 'ఆపకీ మిట్టీ కీ నమీ దేఖి జారీ హై.' },
  'voice.ready': { en: 'Ready to help', te: 'సహాయం చేయడానికి సిద్ధంగా ఉంది', hi: 'మదద్ కే లియే తయార్' },

  // Splash Screen
  'splash.quote': { en: 'Agriculture is the most healthful, most useful and most noble employment of man.', te: 'వ్యవసాయం మానవుని అత్యంత ఆరోగ్యకరమైన వృత్తి.', hi: 'కృషి మనుష్య కా సబ్సే స్వాస్థ్యవర్ధక్ వ్యవసాయ్ హై.' },
  'splash.author': { en: '- George Washington', te: '- జార్జ్ వాషింగ్టన్', hi: '- జార్జ్ వాశింగటన్' },
  'splash.loading': { en: 'Initializing AI Systems...', te: 'AI సిస్టమ్స్ ప్రారంభమవుతోంది...', hi: 'AI సిస్టమ్ ప్రారమ్భ్ హో రహా హై...' },
  'splash.skip': { en: 'Skip', te: 'దాటవేయి', hi: 'ఛోడేం' },

  // Farm Health Pulse
  'health.farmHealth': { en: 'Farm Health Monitor', te: 'వ్యవసాయ ఆరోగ్య మానిటర్', hi: 'ఖేత్ స్వాస్థ్య మానిటర్' },
  'health.status.excellent': { en: 'Excellent condition', te: 'అద్భుతమైన పరిస్థితి', hi: 'ఉత్కృష్ట స్థితి' },
  'health.status.good': { en: 'Good condition', te: 'మంచి పరిస్థితి', hi: 'అచ్ఛీ స్థితి' },
  'health.status.warning': { en: 'Warning', te: 'హెచ్చరిక', hi: 'చేతావనీ' },
  'health.status.critical': { en: 'Critical', te: 'క్లిష్టమైన', hi: 'గంభీర్' },
  'health.fromYesterday': { en: 'from yesterday', te: 'నిన్నటి నుండి', hi: 'కల్ సే' },
  'health.clickForDetails': { en: 'Click for details', te: 'వివరాల కోసం క్లిక్ చేయండి', hi: 'వివరణ్ కే లియే ట్యాప్ కరేం' },
  'health.soilHealth': { en: 'Soil Health', te: 'నేల ఆరోగ్యం', hi: 'మిట్టీ కా స్వాస్థ్య' },
  'health.cropHealth': { en: 'Crop Health', te: 'పంట ఆరోగ్యం', hi: 'ఫసల్ స్వాస్థ్య' },
  'health.waterLevel': { en: 'Water Level', te: 'నీటి స్థాయి', hi: 'జల్ స్త్ర్' },
  'health.pestRisk': { en: 'Pest Risk', te: 'తెగులు ప్రమాదం', hi: 'కీట్ జోఖిమ్' },

  // Days of week
  'day.mon': { en: 'Mon', te: 'సోమ', hi: 'సోమ' },
  'day.tue': { en: 'Tue', te: 'మంగళ', hi: 'మంగళ్' },
  'day.wed': { en: 'Wed', te: 'బుధ', hi: 'బుధ్' },
  'day.thu': { en: 'Thu', te: 'గురు', hi: 'గురు' },
  'day.fri': { en: 'Fri', te: 'శుక్ర', hi: 'శుక్ర్' },
  'day.sat': { en: 'Sat', te: 'శని', hi: 'శని' },
  'day.sun': { en: 'Sun', te: 'ఆది', hi: 'రవి' },

  // Farmer Registration
  'farmer.registration': { en: 'Farmer Registration', te: 'రైతు నమోదు', hi: 'కిసాన్ పంజీకరణ్' },
  'farmer.registrationSubtitle': { en: 'Join our smart farming community', te: 'మా సమాజంలో చేరండి', hi: 'హమారే సముదాయ్ మే శామిల్ హోం' },
  'farmer.identityDetails': { en: 'Identity Details', te: 'గుర్తింపు వివరాలు', hi: 'పహచాన్ వివరణ్' },
  'farmer.identityDescription': { en: 'Enter your ID and name', te: 'మీ ID మరియు పేరు నమోదు చేయండి', hi: 'అపనీ ID ఔర్ నామ్ దర్జ్ కరేం' },
  'farmer.locationDetails': { en: 'Location Details', te: 'స్థాన వివరాలు', hi: 'స్థాన్ వివరణ్' },
  'farmer.locationDescription': { en: 'Where is your farm located?', te: 'మీ వ్యవసాయం ఎక్కడ ఉంది?', hi: 'ఆపకా ఖేత్ కహాఁ హై?' },
  'farmer.cropDetails': { en: 'Crop Details', te: 'పంట వివరాలు', hi: 'ఫసల్ వివరణ్' },
  'farmer.cropDescription': { en: 'What crops are you growing?', te: 'మీరు ఏ పంటలు పండిస్తున్నారు?', hi: 'ఆప్ కౌన్ సీ ఫసలేం ఉగా రహే హైం?' },
  'farmer.farmerId': { en: 'Farmer ID', te: 'రైతు ID', hi: 'కిసాన్ ID' },
  'farmer.name': { en: 'Full Name', te: 'పూర్తి పేరు', hi: 'పూరా నామ్' },
  'farmer.enterName': { en: 'Enter your full name', te: 'మీ పేరు నమోదు చేయండి', hi: 'అపనా పూరా నామ్ దర్జ్ కరేం' },
  'farmer.village': { en: 'Village', te: 'గ్రామం', hi: 'గాఁవ్' },
  'farmer.enterVillage': { en: 'Enter village name', te: 'గ్రామం పేరు నమోదు చేయండి', hi: 'గాఁవ్ కా నామ్ దర్జ్ కరేం' },
  'farmer.mandal': { en: 'Mandal/Taluk', te: 'మండల్', hi: 'మండల్/తాలూకా' },
  'farmer.district': { en: 'District', te: 'జిల్లా', hi: 'జిల్లా' },
  'farmer.selectDistrict': { en: 'Select district', te: 'జిల్లాను ఎంచుకోండి', hi: 'జిల్లా చునేం' },
  'farmer.cropType': { en: 'Primary Crop', te: 'ప్రాథమిక పంట', hi: 'ప్రాథమిక్ ఫసల్' },
  'farmer.quantity': { en: 'Expected Quantity', te: 'అంచనా పరిమాణం', hi: 'అపేక్షిత్ మాత్రా' },
  'farmer.landSize': { en: 'Land Size', te: 'భూమి పరిమాణం', hi: 'భూమి కా ఆకార్' },
  'farmer.register': { en: 'Register', te: 'నమోదు', hi: 'పంజీకరణ్' },
  'farmer.registrationSuccess': { en: 'Registration successful!', te: 'నమోదు విజయవంతం!', hi: 'పంజీకరణ్ సఫల్!' },
  'farmer.registrationComplete': { en: 'Registration Complete!', te: 'నమోదు పూర్తయింది!', hi: 'పంజీకరణ్ పూర్ణ్!' },
  'farmer.welcomeMessage': { en: 'Welcome to AgriAssist.', te: 'అగ్రి అసిస్ట్‌కు స్వాగతం.', hi: 'అగ్రి అసిస్ట్ మే స్వాగత్ హై.' },
  'farmer.editDetails': { en: 'Edit Details', te: 'వివరాలను సవరించు', hi: 'వివరణ్ సంపాదిత కరేం' },
  'farmer.location': { en: 'Location', te: 'స్థానం', hi: 'స్థాన్' },
  'farmer.crop': { en: 'Crop', te: 'పంట', hi: 'ఫసల్' },

  // Intelligence Features
  'intel.decisionScore': { en: 'Farmer Decision Score™', te: 'రైతు నిర్ణయ స్కోరు™', hi: 'కిసాన్ నిర్ణయ్ స్కోర్™' },
  'intel.decisionTrace': { en: 'Decision Trace Engine™', te: 'నిర్ణయ జాడ ఇంజిన్™', hi: 'నిర్ణయ్ ట్రేస్ ఇంజన్™' },
  'intel.lossPrevention': { en: 'Loss Prevention Meter', te: 'నష్ట నివారణ మీటర్', hi: 'నుక్సాన్ రోక్తామ్ మీటర్' },
  'intel.failureWarning': { en: 'Crop Failure Early-Warning', te: 'పంట వైఫల్య హెచ్చరిక', hi: 'ఫసల్ విఫలతా పూర్వానుమాన్' },
  'intel.rotationAdvisor': { en: 'Rotation Advisor', te: 'పంట మార్పిడి సలహాదారు', hi: 'ఫసల్ చక్ర సలాహ్కార్' },
  'intel.explainDecision': { en: 'Explain My Decision', te: 'నా నిర్ణయాన్ని వివరించండి', hi: 'మేరే నిర్ణయ్ కీ వ్యాఖ్యా కరేం' },
  'intel.why': { en: 'WHY?', te: 'ఎందుకు?', hi: 'క్యోం?' },
  'intel.decisionFactors': { en: 'Decision Intelligence Factors', te: 'నిర్ణయ అంశాలు', hi: 'నిర్ణయ్ కారక్' },
  'intel.regretScore': { en: 'Regret Score™', te: 'రిగ్రెట్ స్కోరు™', hi: 'పఛతావా స్కోర్™' },
  'intel.learningIndex': { en: 'Farmer Learning Index', te: 'రైతు అభ్యాస సూచిక', hi: 'కిసాన్ శిక్షణ్ సూచకాఁక్' },
  'intel.whatWrong': { en: 'What went wrong?', te: 'ఏమి తప్పు జరిగింది?', hi: 'క్యా గలత్ హువా?' },
  'intel.seasonAnalysis': { en: 'Season Analysis', te: 'సీజన్ విశ్లేషణ', hi: 'సీజన్ విశ్లేషణ్' },
  'intel.learningImproved': { en: 'Your farming decisions improved by 22% compared to last year.', te: 'మీ నిర్ణయాలు 22% మెరుగుపడ్డాయి.', hi: 'ఆప్కే నిర్ణయ్ 22% సుధరే హైం.' },
  'intel.liveUtilities': { en: 'Live Farm Utilities', te: 'ప్రత్యక్ష సౌకర్యాలు', hi: 'లైవ్ ఉపయోగితాయేం' },
  'intel.impactStory': { en: 'Community Impact Story', te: 'సంఘం ప్రభావ కధ', hi: 'ప్రభావ్ కహానీ' },
  'intel.smartRecs': { en: 'Smart Recommendations', te: 'స్మార్ట్ సిఫార్సులు', hi: 'స్మార్ట్ సిఫారిశేం' },
  'intel.whatIf': { en: '"What-If" Simulator', te: '"వాట్-ఇఫ్" సిమ్యులేటర్', hi: '"వాట్-ఇఫ్" సిమ్యులేటర్' },
  'intel.optimizedFor': { en: 'Optimized for', te: 'అనుకూలపరచబడింది', hi: 'అనుకూలిత్' },
  'intel.estProfit': { en: 'Est. Profit/Acre', te: 'అంచనా లాభం/ఎకరా', hi: 'అనుమానిత్ లాభ్' },
  'intel.whyChoice': { en: 'WHY THIS CHOICE?', te: 'ఈ ఎంపిక ఎందుకు?', hi: 'యహ్ చునావ్ క్యోం?' },
  'intel.simulatorMode': { en: 'Simulation Mode – Estimates Only', te: 'సిమ్యులేషన్ మోడ్ - అంచనాలు మాత్రమే', hi: 'సిమ్యులేషన్ మోడ్ - కేవల్ అనుమాన్' },
  'intel.scenarioConfig': { en: 'Scenario Configuration', te: 'దృశ్య కాన్ఫిగరేషన్', hi: 'పరిదృశ్య కాన్ఫిగరేషన్' },
  'intel.simCrop': { en: 'Simulation Crop', te: 'సిమ్యులేషన్ పంట', hi: 'సిమ్యులేషన్ ఫసల్' },
  'intel.sellStrategy': { en: 'Sell Timing Strategy', te: 'అమ్మకపు సమయ వ్యూహం', hi: 'బిక్రీ సమయ్ కి రణనీతి' },
  'intel.sellHarvest': { en: 'Sell at Harvest', te: 'కోత సమయంలో అమ్మండి', hi: 'కటాయీ పర్ బేచేం' },
  'intel.delay2Months': { en: 'Delay 2 Months', te: '2 నెలల జాప్యం', hi: '2 మహీనే కీ దేరీ' },
  'intel.runSimulation': { en: 'Run Simulation', te: 'సిమ్యులేషన్ రన్ చేయండి', hi: 'సిమ్యులేషన్ చలాయేం' },
  'intel.simulating': { en: 'Simulating Decisions...', te: 'నిర్ణయాలను సిమ్యులేట్ చేస్తోంది...', hi: 'నిర్ణయోం కా సిమ్యులేషన్ హో రహా హై...' },
  'intel.simOutput': { en: 'Simulated Output', te: 'సిమ్యులేట్ చేసిన అవుట్పుట్', hi: 'సిమ్యులేటెడ్ అవుట్‌పుట్' },

  // Market
  'market.priceShockIndicator': { en: 'PRICE SHOCK RISK INDICATOR', te: 'ధర షాక్ ప్రమాద సూచిక', hi: 'మూల్య జోఖిమ్ సూచక్' },
  'market.districtComparison': { en: 'DISTRICT INTELLIGENCE COMPARISON', te: 'జిల్ల్లా పోలిక', hi: 'జిల్ల్లా తులనా' },
  'market.bestSell': { en: 'BEST TIME TO SELL', te: 'అమ్మడానికి ఉత్తమ సమయం', hi: 'బేచ్నే కా సహీ సమయ్' },
  'market.waitRebound': { en: 'WAIT FOR REBOUND', te: 'ధర పుంజుకునే వరకు వేచి ఉండండి', hi: 'వాపసీ కీ ప్రతీక్షా కరేం' },
  'market.avgMarket': { en: 'AVERAGE MARKET', te: 'సగటు మార్కెట్', hi: 'ఔసత్ బాజార్' },
  'market.sentiment': { en: 'Market Sentiment', te: 'మార్కెట్ సెంటిమెంట్', hi: 'బాజార్ కి భావనా' },
  'market.regionalAnalysis': { en: 'REGIONAL ANALYSIS', te: 'ప్రాంతీయ విశ్లేషణ', hi: 'క్షేత్రీయ విశ్లేషణ్' },
  'market.exploreNeighbor': { en: 'EXPLORE NEIGHBOR DATA', te: 'పొరుగు డేటాను చూడండి', hi: 'పడోసీ డేటా దేఖేం' },
  'market.title': { en: 'Market Insights', te: 'మార్కెట్ అంతర్దృష్టులు', hi: 'బాజార్ అంతర్దృష్టి' },
  'market.subtitle': { en: 'Expected yield, prices, and AI predictions', te: 'ధరలు మరియు AI అంచనాలు', hi: 'మూల్య ఔర్ AI పూర్వానుమాన్' },
  'market.avgYield': { en: 'Avg. Yield', te: 'సగటు దిగుబడి', hi: 'ఔసత్ ఉపజ్' },
  'market.currentPrice': { en: 'Current Price', te: 'ప్రస్తుత ధర', hi: 'వర్తమాన్ మూల్య' },
  'market.aiPrediction': { en: 'AI Prediction', te: 'AI అంచనా', hi: 'AI పూర్వానుమాన్' },
  'market.priceHistory': { en: 'Price History', te: 'ధర చరిత్ర', hi: 'మూల్య ఇతిహాస్' },
  'market.last6Months': { en: 'Last 6 months trend', te: 'గత 6 నెలల ట్రెండ్', hi: 'పిఛలే 6 మహీనో కా రుజాన్' },
  'market.yieldTrend': { en: 'Yield Trend', te: 'దిగుబడి ట్రెండ్', hi: 'ఉపజ్ రుజాన్' },
  'market.last5Years': { en: 'Last 5 years', te: 'గత 5 సంవత్సరాలు', hi: 'పిఛలే 5 సాల్' },

  // Demand & Supply (Added)
  'demand.title': { en: 'Market Demand & Potential Buyers', te: 'మార్కెట్ డిమాండ్ & కొనుగోలుదారులు', hi: 'बाजार की मांग और खरीदार' },
  'demand.subtitle': { en: 'Identify high-demand regions and connect with Bulk Buyers', te: 'అధిక డిమాండ్ ఉన్న ప్రాంతాలను గుర్తించండి మరియు కొనుగోలుదారులతో కనెక్ట్ అవ్వండి', hi: 'उच्च मांग वाले क्षेत्रों की पहचान करें' },
  'demand.problem': { en: 'Market Gap', te: 'మార్కెట్ గ్యాప్', hi: 'बाजार अंतराल' },
  'demand.problemDesc': { en: 'Farmers often face low prices due to local oversupply.', te: 'స్థానిక సరఫరా ఎక్కువగా ఉండటం వల్ల రైతులు తరచుగా తక్కువ ధరలను ఎదుర్కొంటారు.', hi: 'स्थानीय अधिक आपूर्ति के कारण किसानों को कम कीमतों का सामना करना पड़ता है।' },
  'demand.solution': { en: 'Direct Connect', te: 'డైరెక్ట్ కనెక్ట్', hi: 'सीधा संपर्क' },
  'demand.solutionDesc': { en: 'Connecting you with regions having supply shortages for better margins.', te: 'మెరుగైన లాభాల కోసం సరఫరా కొరత ఉన్న ప్రాంతాలతో మిమ్మల్ని అనుసంధానిస్తుంది.', hi: 'बेहतर मार्जिन के लिए आपूर्ति की कमी वाले क्षेत्रों से आपको जोड़ना।' },
  'demand.impact': { en: 'Profit Growth', te: 'లాభాల వృద్ధి', hi: 'लाभ वृद्धि' },
  'demand.impactDesc': { en: 'Expect 20-30% higher returns by targeting high-demand metro areas.', te: 'మెట్రో ఏరియాలను లక్ష్యంగా చేసుకోవడం ద్వారా 20-30% అధిక రాబడిని పొందవచ్చు.', hi: 'उच्च मांग वाले क्षेत्रों को लक्षित करके 20-30% अधिक रिटर्न की अपेक्षा करें।' },
  'demand.highDemandAreas': { en: 'High Demand Regions', te: 'అధిక డిమాండ్ ఉన్న ప్రాంతాలు', hi: 'उच्च मांग वाले क्षेत्र' },
  'demand.potentialBuyers': { en: 'Verified Bulk Buyers', te: 'ధృవీకరించబడిన కొనుగోలుదారులు', hi: 'सत्यापित थोक खरीदार' },
  'demand.demandLevel': { en: 'Demand Level', te: 'డిమాండ్ స్థాయి', hi: 'मांग का स्तर' },
  'demand.priceBonus': { en: 'Expected Price Bonus', te: 'ఆశించిన ధర బోనస్', hi: 'अपेक्षित मूल्य बोनस' },
  'demand.trustScore': { en: 'Trust Score', te: 'నమ్మక సూచిక', hi: 'ट्रस्ट स्कोर' },
  'demand.priceRange': { en: 'Average Price Range', te: 'సగటు ధర పరిధి', hi: 'औसत मूल्य सीमा' },
  'demand.contactBuyer': { en: 'Contact Buyer Now', te: 'కొనుగోలుదారుని సంప్రదించండి', hi: 'खरीदार से संपर्क करें' },

  // Crop Guidance (Added)
  'guidance.expertAdvice': { en: 'AI Expert Advice', te: 'AI నిపుణుల సలహా', hi: 'AI विशेषज्ञ सलाह' },
  'guidance.title': { en: 'Precision Farming Guidance', te: 'ఖచ్చితమైన వ్యవసాయ మార్గదర్శకత్వం', hi: 'सटीक खेती मार्गदर्शन' },
  'guidance.subtitle': { en: 'Science-backed strategies to maximize yield and minimize effort', te: 'దిగుబడిని పెంచడానికి సైన్స్ ఆధారిత వ్యూహాలు', hi: 'उपज बढ़ाने के लिए विज्ञान-आधारित रणनीतियाँ' },
  'guidance.problem': { en: 'Traditional Risks', te: 'సాంప్రదాయ ప్రమాదాలు', hi: 'पारंपरिक जोखिम' },
  'guidance.problemDesc': { en: 'Unexpected soil fatigue and pest outbreaks can ruin harvests.', te: 'నేల అలసట మరియు తెగుళ్లు పంటలను నాశనం చేస్తాయి.', hi: 'मिट्टी की थकान और कीटों का प्रकोप फसल खराब कर सकता है।' },
  'guidance.solution': { en: 'Smart Monitoring', te: 'స్మార్ట్ మానిటరింగ్', hi: 'स्मार्ट निगरानी' },
  'guidance.solutionDesc': { en: 'Real-time alerts and precision crop rotation schedules.', te: 'రీయల్-టైమ్ అలర్ట్లు మరియు ఖచ్చితమైన పంట మార్పిడి షెడ్యూల్.', hi: 'रीयल-टाइम अलर्ट और सटीक फसल चक्र कार्यक्रम।' },
  'guidance.impact': { en: 'Sustainability', te: 'సుస్థిరత', hi: 'स्थिरता' },
  'guidance.impactDesc': { en: 'Reduced chemical usage and naturally enriched soil nutrients.', te: 'రసాయనాల వినియోగం తగ్గింపు మరియు నేల పోషకాల పెంపు.', hi: 'कम रसायनों का उपयोग और मिट्टी के पोषक तत्व।' },
  'guidance.bestPractices': { en: 'Best Practices', te: 'ఉత్తమ పద్ధతులు', hi: 'सर्वोत्तम प्रथाएं' },
  'guidance.diseasePrevention': { en: 'Disease Prevention', te: 'వ్యాధి నివారణ', hi: 'रोग की रोकथाम' },
  'guidance.climatePrecautions': { en: 'Climate Precautions', te: 'వాతావరణ జాగ్రత్తలు', hi: 'जलवायु सावधानियां' },

  // Dashboard Misc (Added)
  'dashboard.recommendations': { en: 'AI Strategy Recommendations', te: 'AI వ్యూహ సిఫార్సులు', hi: 'AI रणनीति अनुशंसाएं' },
  'dashboard.cropHealth': { en: 'Live Crop Health Monitoring', te: 'లైవ్ పంట ఆరోగ్య పర్యవేక్షణ', hi: 'लाइव फसल स्वास्थ्य निगरानी' },
  'dashboard.scanNew': { en: 'Analyze New Sample', te: 'కొత్త నమూనాను విశ్లేషించండి', hi: 'नए नमूने का विश्लेषण' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('agri_language');
    return (saved as Language) || 'en';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('agri_language', lang);
  }, []);

  const t = useCallback((key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[language];
  }, [language]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
