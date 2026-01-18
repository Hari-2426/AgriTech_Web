import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare,
    Mic,
    MicOff,
    X,
    Send,
    Volume2,
    VolumeX,
    Sparkles,
    Bot,
    User,
    MoreHorizontal,
    ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    intent?: string;
    suggestions?: string[];
    language?: string;
    timestamp: Date;
}

export function AICopilot() {
    const { t, language } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [speechStatus, setSpeechStatus] = useState<'loading' | 'ready' | 'error'>('loading');
    const [showVoiceList, setShowVoiceList] = useState(false);
    const scrollEndRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);
    const hasSpokenGreeting = useRef(false);

    const farmerData = JSON.parse(localStorage.getItem('farmerData') || '{}');
    const token = localStorage.getItem('token');
    const farmerId = farmerData.farmerId || null;

    // Reset copilot when user changes (login/logout)
    useEffect(() => {
        resetCopilot();
    }, [farmerId, token]);

    const resetCopilot = () => {
        setMessages([]);
        hasSpokenGreeting.current = false;
        setInputText('');
        setIsListening(false);
        setIsSpeaking(false);
        window.speechSynthesis.cancel();
    };

    useEffect(() => {
        // Initialize initial greeting if empty
        if (messages.length === 0) {
            const greeting = language === 'te'
                ? "నమస్కారం! నేను మీ AI వ్యవసాయ సహాయకుడిని. మీకు పంటలు, ధరలు లేదా మార్కెట్ గురించి ఏదైనా సందేహం ఉందా?"
                : "Namaste! I am your AI Farming Copilot. Do you have any questions about crops, prices, or market trends?";

            setMessages([{
                id: '1',
                text: greeting,
                sender: 'bot',
                language: language === 'te' ? 'telugu' : 'english',
                timestamp: new Date(),
                suggestions: language === 'te'
                    ? ['ఈ సీజన్లో ఏ పంట బాగుంటుంది?', 'పంట ధరలు ఎప్పుడు పెరుగుతాయి?', 'ఆకులు పసుపుగా మారుతున్నాయి']
                    : ['Which crop is best for this season?', 'When will crop prices increase?', 'Why are my leaves turning yellow?']
            }]);
        }
    }, [language]);

    // Speak greeting only when opened for the first time
    useEffect(() => {
        if (isOpen && !hasSpokenGreeting.current && messages.length > 0) {
            hasSpokenGreeting.current = true;
            // Small delay to ensure browser speech engine is ready after interaction
            setTimeout(() => {
                speakText(messages[0].text, messages[0].language);
            }, 500);
        }
    }, [isOpen, messages]);

    useEffect(() => {
        // Setup STT
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = language === 'te' ? 'te-IN' : 'en-IN';

            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInputText(transcript);
                setIsListening(false);
                handleSend(transcript);
            };

            recognitionRef.current.onerror = () => setIsListening(false);
            recognitionRef.current.onend = () => setIsListening(false);
        }
    }, [language]);

    useEffect(() => {
        scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            setIsListening(true);
            recognitionRef.current?.start();
        }
    };

    const getPhoneticTelugu = (text: string) => {
        const mapping: { [key: string]: string } = {
            "నమస్కారం": "Namaskaram",
            "నేను మీ AI": "Nenu mee AI",
            "సహాయకుడిని": "sahayakudini",
            "సందేహం ఉందా": "sandeham undaa",
            "పంటలు": "Pantalu",
            "వరి": "Vari",
            "పత్తి": "Patti",
            "మిరప": "Mirapa",
            "వేరుశనగ": "Verusanaga",
            "ముక్కజొన్న": "Mukkajonna",
            "కూరగాయలు": "Kura-gayalu",
            "ఖరీఫ్": "Kharif",
            "సీజన్": "Season",
            "అనువైనది": "Anuvainadi",
            "సరిపోతుంది": "Saripotundi",
            "బాగుంటుంది": "Baaguntundi",
            "లాభదాయకం": "Labha-dayakam",
            "దిగుబడికి": "Digubadiki",
            "సహాయపడుతుంది": "Sahayapadutundi",
            "నేలలోని": "nelaloni",
            "తేమ": "tema",
            "ధరలు": "Dharalu",
            "పెరుగుతాయి": "Perugutayi",
            "తగ్గుతాయి": "Taggutayi",
            "మార్కెట్": "Market",
            "అమ్మాలి": "Ammali",
            "వేచి ఉండాలి": "Vechi undali",
            "జాగ్రత్తలు": "Jagrattalu",
            "నివారణ": "Nivarana",
            "పరిస్థితిని": "paristithini",
            "నిరోధించడానికి": "nirodhinchadaniki",
            "మారుతోంది": "marutondi",
            "వ్యాప్తిని": "vyaptini",
            "చల్లవద్దు": "challavaddu",
            "లో": " lo ",
            "మరియు": " mariyu ",
            "కోసం": " kosam ",
            "కు": " ku ",
            "కి": " ki ",
            "ని": " ni ",
            "ఉంది": " undi ",
            "లేదా": " leda ",
            "ఎక్కువ": " ekkuva ",
            "తక్కువ": " takkuva ",
            "చాలా": " chaala ",
            "మంచి": " manchi ",
            "పంట": " panta ",
            "వేస్తే": " vesthe ",
            "వస్తుంది": " vastundi ",
            "చెప్పండి": " cheppandi ",
            "అడగండి": " adagandi ",
            "సదుపాయం": " sadupayam ",
            "ప్రస్తుత": " prastuta ",
            "ఇప్పుడు": " ippudu ",
            "మునుపు": " munupu ",
            "తర్వాత": " tarvatha ",
            "వచ్చే": " vacche ",
            "వారం": " vaaram ",
            "నత్రజని": " nitrogen ",
            "ఎరువులు": " eruvulu ",
            "తెగుళ్లు": " tegullu "
        };

        let phonetic = text;
        const keys = Object.keys(mapping).sort((a, b) => b.length - a.length);
        keys.forEach(key => {
            phonetic = phonetic.replace(new RegExp(key, 'g'), mapping[key]);
        });
        return phonetic.replace(/[^\x00-\x7F]/g, " ");
    };

    const speakText = (text: string, forceLang?: string) => {
        if (!('speechSynthesis' in window)) {
            setSpeechStatus('error');
            return;
        }

        window.speechSynthesis.cancel();

        const isTelugu = forceLang === 'te' || forceLang === 'telugu' || (forceLang === undefined && /[\u0C00-\u0C7F]/.test(text));

        // Essential: Small delay after cancel ensures the next speak call is accepted by the browser engine
        setTimeout(() => {
            const utterance = new SpeechSynthesisUtterance(text);
            const voices = window.speechSynthesis.getVoices();

            if (voices.length === 0) {
                setSpeechStatus('loading');
                return;
            }

            setSpeechStatus('ready');

            if (isTelugu) {
                const teVoice = voices.find(v =>
                    v.lang.toLowerCase().includes('te-in') ||
                    v.lang.toLowerCase().startsWith('te') ||
                    v.name.toLowerCase().includes('telugu')
                );

                if (teVoice) {
                    utterance.voice = teVoice;
                    utterance.lang = 'te-IN';
                } else {
                    // EMERGENCY FALLBACK: If no Telugu voice, transliterate to phonetic sounds and use English voice
                    utterance.text = getPhoneticTelugu(text);
                    const fallbackEnVoice = voices.find(v => v.lang.includes('en-IN')) ||
                        voices.find(v => v.lang.includes('en-GB'));
                    if (fallbackEnVoice) utterance.voice = fallbackEnVoice;
                    utterance.lang = 'en-IN'; // Force English lang so the engine accepts phonetic text
                    console.log('Phonetic Fallback Active (No native voice):', utterance.text);
                }
            } else {
                const enVoice = voices.find(v => v.lang.includes('en-IN')) ||
                    voices.find(v => v.lang.includes('en-GB')) ||
                    voices.find(v => v.lang.includes('en-US'));
                if (enVoice) utterance.voice = enVoice;
                utterance.lang = 'en-IN';
            }

            utterance.rate = 0.85;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = (e) => {
                console.error('TTS Error:', e);
                setSpeechStatus('error');
                setIsSpeaking(false);
            };

            window.speechSynthesis.speak(utterance);
        }, 150);
    };

    // Pre-load voices and handle changes
    useEffect(() => {
        if ('speechSynthesis' in window) {
            const checkVoices = () => {
                const available = window.speechSynthesis.getVoices();
                if (available.length > 0) {
                    setSpeechStatus('ready');
                }
            };
            checkVoices();
            window.speechSynthesis.onvoiceschanged = checkVoices;
            // Interaction might be needed for some browsers to list voices
            const timer = setTimeout(checkVoices, 1000);
            return () => {
                window.speechSynthesis.onvoiceschanged = null;
                clearTimeout(timer);
            };
        }
    }, []);

    const handleSend = async (textOverride?: string) => {
        const textToSubmit = textOverride || inputText;
        if (!textToSubmit.trim() || isTyping) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: textToSubmit,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsTyping(true);

        // --- Frontend Local Brain (Fallback Logic) ---
        const getLocalAIResponse = (queryText: string) => {
            const query = queryText.toLowerCase().trim();
            const isTelugu = /[\u0C00-\u0C7F]/.test(query);
            const langKey = isTelugu ? 'telugu' : 'english';

            // Priority based patterns (Specific to General)
            const patterns = [
                {
                    intent: 'disease_guidance',
                    keywords: ['disease', 'yellow', 'spots', 'pest', 'precaution', 'bugs', 'insects', 'worm', 'fungus', 'leaf', 'sick', 'virus', 'రోగం', 'పసుపు', 'మచ్చలు', 'పురుగుల', 'మందులు', 'నివారణ', 'తెగుళ్లు', 'తెగులు', 'వ్యాధి']
                },
                {
                    intent: 'price_reason',
                    keywords: ['why low', 'falling', 'different', 'middleman', 'stable', 'msp', 'cost', 'reason', 'తగ్గింది', 'పడిపోతుంది', 'భిన్నంగా', 'మధ్యవర్తులు', 'మద్దతు ధర', 'తక్కువ', 'ధర ఎందుకు', 'ధర తక్కువ']
                },
                {
                    intent: 'sell_timing',
                    keywords: ['sell', 'harvest', 'when', 'wait', 'demand', 'hold', 'prices', 'increase', 'market', 'timing', 'అమ్మాలి', 'సమయమా', 'ఆగాలా', 'మార్కెట్', 'నిల్వ', 'ధరలు', 'పెరుగుతాయా', 'కోత', 'అమ్ముకోవచ్చా']
                },
                {
                    intent: 'crop_recommendation',
                    keywords: ['crop', 'best', 'grow', 'suitable', 'season', 'paddy', 'cotton', 'maize', 'pomegranate', 'chili', 'mirchi', 'rice', 'suggest', 'plant', 'పంట', 'బాగుంటుంది', 'వేయాలి', 'ఆదాయం', 'సరిపోతుంది', 'వరి', 'పత్తి', 'మొక్కజొన్న', 'మిర్చి', 'సీజన్', 'ఖరీఫ్', 'రబీ', 'ఏ పంట']
                },
                {
                    intent: 'weather_risk',
                    keywords: ['weather', 'rain', 'rainfall', 'drought', 'dry', 'heat', 'delay', 'sowing', 'cold', 'wind', 'forecast', 'storm', 'cloudy', 'వాతావరణం', 'వర్షం', 'ఎండ', 'ప్రమాదం', 'ఆలస్యం', 'విత్తనాలు', 'గాలులు', 'వరద', 'తుఫాను']
                },
                {
                    intent: 'education',
                    keywords: ['rotation', 'soil', 'test', 'sustainable', 'diversification', 'losses', 'awareness', 'decisions', 'tips', 'trick', 'nitrogen', 'urea', 'organic', 'fertilizer', 'ఎరువులు', 'మార్పిడి', 'పరీక్ష', 'ముఖ్యం', 'నష్టాలు', 'అవగాహన', 'నిర్ణయాలు', 'చిట్కాలు', 'సలహా', 'యూరియా']
                }
            ];

            let matchedIntent = 'unsupported';
            for (const p of patterns) {
                if (p.keywords.some(kw => query.includes(kw))) {
                    matchedIntent = p.intent;
                    break;
                }
            }

            let answer = '';
            let actions: string[] = [];
            const districtName = farmerData.district || 'Guntur';
            const seasonName = 'Kharif';
            const cropName = farmerData.cropType || 'Crop';

            if (matchedIntent === 'unsupported') {
                const fallbacks = isTelugu
                    ? [
                        'క్షమించండి, మీ ప్రశ్న గురించి నాకు సమాచారం లేదు. దయచేసి పంట సూచనలు, ధరలు లేదా వాతావరణం గురించి అడగండి.',
                        'నన్ను అడగండి: "ఏ పంట వేయాలి?", "ధర ఎప్పుడు పెరుగుతుంది?" లేదా "వరి సాగు చిట్కాలు".',
                        'క్షమించండి, ఇది నాకు కొత్త విషయం. మీరు మార్కెట్ ధరలు లేదా తెగుళ్ల నివారణ గురించి అడగగలరా?'
                    ]
                    : [
                        'I am sorry, I do not have specific information for that. Please ask about crops, prices, or weather.',
                        'Try asking: "Which crop is best?", "When to sell?", or "Rice farming tips".',
                        'I am still learning! Could you ask about market prices or pest management instead?'
                    ];
                answer = fallbacks[Math.floor(Math.random() * fallbacks.length)];
                actions = isTelugu ? ['పంట సూచనలు', 'ధరల వివరాలు', 'వాతావరణం'] : ['Crop Suggestions', 'Price Trends', 'Weather'];
            } else {
                switch (matchedIntent) {
                    case 'crop_recommendation':
                        answer = isTelugu
                            ? `${districtName}లో ప్రస్తుత ${seasonName} సీజన్ కోసం వరి మరియు పత్తి అత్యంత లాభదాయకం. నీటి లభ్యత తక్కువగా ఉంటే వేరుశనగ ప్రయత్నించండి.`
                            : `For the current ${seasonName} season in ${districtName}, Paddy and Cotton are the most profitable. If you have limited water, try Groundnut.`;
                        actions = isTelugu ? ["వరి ధర", "నీటి చిట్కాలు"] : ["Paddy Price", "Water Tips"];
                        break;
                    case 'sell_timing':
                        answer = isTelugu
                            ? `మార్కెట్ సరఫరా ఇప్పుడు ఎక్కువగా ఉంది. నిల్వ సదుపాయం ఉంటే 15 రోజులు ఆగండి; ${districtName}లో ప్రారంభ రద్దీ తర్వాత ధరలు పెరుగుతాయి.`
                            : `Market trends show supply is peaking. Wait 15 days if you have good storage; prices in ${districtName} usually rise after the initial rush.`;
                        actions = isTelugu ? ["సమీప గోదాము", "ధరల చరిత్ర"] : ["Nearby Warehouse", "Price History"];
                        break;
                    case 'price_reason':
                        answer = isTelugu
                            ? `${districtName}లో గత ఏడాది కంటే ధర తక్కువగా ఉంది, ఎందుకంటే దేశవ్యాప్తంగా దిగుబడి పెరిగింది. రవాణా ఖర్చుల వల్ల మధ్యవర్తులు కూడా తక్కువ ధర అడుగుతున్నారు.`
                            : `Prices in ${districtName} are currently lower due to high national supply. Middlemen are quoting lower due to transport costs. I suggest checking MSP rates before selling.`;
                        actions = isTelugu ? ["మద్దతు ధర", "మార్కెట్ యార్డ్"] : ["Check MSP", "Market Yard"];
                        break;
                    case 'disease_guidance':
                        answer = isTelugu
                            ? "ఆకులపై పసుపు మచ్చలు అంటే 'లీఫ్ స్పాట్' తెగులు కావచ్చు. వెంటనే వేప నూనె వాడండి లేదా AI స్కానర్ ద్వారా మరోసారి పరీక్షించండి."
                            : "Yellow spots on leaves often mean 'Leaf Spot' fungus. Use Neem oil immediately or consult the AI Scanner for a closer check.";
                        actions = isTelugu ? ["AI స్కానర్ వాడండి", "సేంద్రీయ పిచికారీ"] : ["Use AI Scanner", "Organic Spray Tips"];
                        break;
                    case 'weather_risk':
                        answer = isTelugu
                            ? `${districtName} ఉపగ్రహ సమాచారం ప్రకారం 10 రోజుల పాటు పొడి వాతావరణం ఉంటుంది. మీ ${cropName} పొలాలకు ప్రత్యామ్నాయ నీటి వసతి సిద్ధం చేసుకోండి.`
                            : `Satellite data for ${districtName} indicates a dry spell for 10 days. Ensure secondary irrigation is ready for your ${cropName} fields.`;
                        actions = isTelugu ? ["వారపు వాతావరణం", "నీటి పొదుపు చిట్కాలు"] : ["Weekly Forecast", "Water Saving Tips"];
                        break;
                    case 'education':
                        answer = isTelugu
                            ? "స్మార్ట్ చిట్కా: పప్పుధాన్యాలతో పంట మార్పిడి చేస్తే నేలలో సహజంగా నత్రజని పెరుగుతుంది. దీనివల్ల మీకు యూరియా ఖర్చు తగ్గుతుంది!"
                            : "Smart Tip: Rotating crops with pulses adds 20kg of Nitrogen back to your soil naturally. This saves you money on Urea!";
                        actions = isTelugu ? ["నేల ఆరోగ్య కార్డు", "ఖర్చు తగ్గించుకోండి"] : ["Soil Health Card", "Money Saving Tips"];
                        break;
                    default:
                        answer = isTelugu ? "నన్ను అడగండి: 'ఏ పంట వేయాలి', 'ధర ఎంత', లేదా 'వ్యాధి నివారణ'?" : "Ask me about crops, prices or pest control.";
                }
            }

            return { answer, intent: matchedIntent, actions, language: langKey };
        };

        try {
            const response = await fetch('http://localhost:5000/api/ai/copilot/query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    text: textToSubmit,
                    state: farmerData.state,
                    district: farmerData.district,
                    season: 'Kharif',
                    crop: farmerData.cropType
                })
            });

            if (!response.ok) throw new Error('Backend unreachable');
            const result = await response.json();

            if (result.success) {
                const aiData = result.data;
                const botMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    text: aiData.answer,
                    sender: 'bot',
                    intent: aiData.intent,
                    suggestions: aiData.suggested_actions,
                    language: aiData.language,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, botMsg]);
                speakText(aiData.answer, aiData.language);
            } else {
                throw new Error('API returned failure');
            }
        } catch (error) {
            console.warn('Copilot Backend Error, using Local Brain:', error);
            // Fallback to local rule-based engine
            const localAI = getLocalAIResponse(textToSubmit);
            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: localAI.answer,
                sender: 'bot',
                intent: localAI.intent,
                suggestions: localAI.actions,
                language: localAI.language,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMsg]);
            speakText(localAI.answer, localAI.language);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-4">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="w-[380px] md:w-[420px] max-h-[600px] flex flex-col"
                    >
                        <Card className="flex flex-col h-[600px] shadow-2xl border-none overflow-hidden rounded-[2rem] bg-card/95 backdrop-blur-xl">
                            {/* Header */}
                            <div className="p-6 bg-gradient-to-r from-primary to-emerald-600 text-white flex items-center justify-between shadow-lg">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                                        <Bot className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-sm uppercase tracking-widest">AI Farming Copilot</h3>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                            <span className="text-[10px] font-bold opacity-80 uppercase">Context Aware | {farmerData.district}</span>
                                        </div>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/10 rounded-xl">
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>

                            {/* Voice Diagnostic Tool (Mini) */}
                            <div className="px-6 py-2 bg-black/5 flex items-center justify-between text-[8px] font-black uppercase tracking-widest text-muted-foreground border-b border-primary/5">
                                <div className="flex items-center gap-2">
                                    <div className={cn(
                                        "h-1.5 w-1.5 rounded-full animate-pulse",
                                        speechStatus === 'ready' ? "bg-emerald-500" : "bg-amber-500"
                                    )} />
                                    <span>Voice: {speechStatus} | {language === 'te' ? 'Telugu' : 'English'}</span>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowVoiceList(!showVoiceList)}
                                        className="hover:text-primary transition-colors hover:underline"
                                    >
                                        {showVoiceList ? 'Hide List' : 'Check System Voices'}
                                    </button>
                                    <button
                                        onClick={() => speakText(language === 'te' ? "వాయిస్ పరీక్ష విజయవంతమైంది" : "Voice test successful", 'te')}
                                        className="hover:text-primary transition-colors hover:underline"
                                    >
                                        Test Telugu
                                    </button>
                                </div>
                            </div>

                            {showVoiceList && (
                                <div className="max-h-32 overflow-y-auto bg-black/10 border-b border-primary/10 p-4 text-[10px] space-y-1 font-mono">
                                    <p className="font-bold text-primary mb-2 italic uppercase tracking-tighter">System Voice Database:</p>
                                    {window.speechSynthesis.getVoices().map((v, i) => (
                                        <div key={i} className={cn(
                                            "flex gap-2 py-0.5 border-b border-black/5 last:border-0",
                                            v.lang.toLowerCase().includes('te') ? "text-emerald-500 font-bold bg-emerald-500/5 px-1" : "text-muted-foreground"
                                        )}>
                                            <span className="shrink-0 bg-black/20 px-1 rounded">[{v.lang}]</span>
                                            <span className="truncate">{v.name}</span>
                                            {v.lang.toLowerCase().includes('te') && <span className="shrink-0">🌟 (TELUGU FOUND)</span>}
                                        </div>
                                    ))}
                                    {window.speechSynthesis.getVoices().length === 0 && (
                                        <p className="text-amber-500 italic">No voices detected. Browser engine warm-up required...</p>
                                    )}
                                </div>
                            )}

                            {/* Chat Area */}
                            <ScrollArea className="flex-1 p-6">
                                <div className="space-y-6">
                                    {messages.map((msg, i) => (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className={cn(
                                                "flex gap-3 max-w-[85%]",
                                                msg.sender === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                                            )}
                                        >
                                            <div className={cn(
                                                "h-8 w-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                                                msg.sender === 'user' ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                                            )}>
                                                {msg.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                                            </div>
                                            <div className="space-y-2">
                                                <div className={cn(
                                                    "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                                                    msg.sender === 'user'
                                                        ? "bg-primary text-white rounded-tr-none font-medium text-right"
                                                        : "bg-muted/50 rounded-tl-none font-bold"
                                                )}>
                                                    {msg.text}
                                                </div>

                                                {msg.sender === 'bot' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 rounded-lg opacity-40 hover:opacity-100 hover:bg-primary/10 transition-all"
                                                        onClick={() => speakText(msg.text, msg.language)}
                                                    >
                                                        <Volume2 className="h-3 w-3" />
                                                    </Button>
                                                )}

                                                {msg.suggestions && msg.suggestions.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 pt-1">
                                                        {msg.suggestions.map((s, idx) => (
                                                            <Badge
                                                                key={idx}
                                                                variant="outline"
                                                                className="bg-primary/5 text-primary border-primary/20 font-black text-[9px] uppercase tracking-tighter px-2.5 py-1 cursor-pointer hover:bg-primary hover:text-white transition-colors"
                                                                onClick={() => handleSend(s)}
                                                            >
                                                                {s}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                )}

                                                <p className={cn(
                                                    "text-[9px] text-muted-foreground font-black uppercase tracking-widest opacity-40 px-1",
                                                    msg.sender === 'user' ? "text-right" : "text-left"
                                                )}>
                                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                    {isTyping && (
                                        <div className="flex gap-3 mr-auto items-center">
                                            <div className="h-8 w-8 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                                                <Bot className="h-4 w-4" />
                                            </div>
                                            <div className="bg-muted/30 p-4 rounded-2xl rounded-tl-none">
                                                <MoreHorizontal className="h-4 w-4 animate-pulse" />
                                            </div>
                                        </div>
                                    )}
                                    <div ref={scrollEndRef} />
                                </div>
                            </ScrollArea>

                            {/* Input Area */}
                            <div className="p-6 border-t bg-muted/20">
                                <div className="flex items-center gap-3">
                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            className="w-full bg-background border border-primary/10 rounded-2xl p-4 pr-12 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50 h-14"
                                            placeholder={isListening ? (language === 'te' ? 'వింటున్నాను...' : 'Listening...') : (language === 'te' ? 'ఏదైనా అడగండి...' : 'Ask anything...')}
                                            value={inputText}
                                            onChange={(e) => setInputText(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className={cn(
                                                "absolute right-2 top-2 h-10 w-10 transition-all rounded-xl",
                                                inputText.trim() ? "text-primary hover:bg-primary/10" : "text-muted-foreground opacity-30"
                                            )}
                                            onClick={() => handleSend()}
                                            disabled={!inputText.trim()}
                                        >
                                            <Send className="h-5 w-5" />
                                        </Button>
                                    </div>
                                    <Button
                                        onClick={toggleListening}
                                        className={cn(
                                            "h-14 w-14 rounded-2xl shadow-xl transition-all duration-300 active:scale-90",
                                            isListening ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-primary hover:bg-primary/90"
                                        )}
                                    >
                                        {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                                    </Button>
                                </div>

                                <div className="mt-4 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <div className={cn("h-2 w-2 rounded-full", isSpeaking ? "bg-primary animate-pulse" : "bg-muted")} />
                                        <span>{isSpeaking ? 'Speaking' : 'Muted'}</span>
                                    </div>
                                    <span className="opacity-40">Rule-Based Guidance</span>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Toggle Button */}
            <motion.button
                animate={isOpen ? { scale: 0.8, rotate: 90, opacity: 0 } : { scale: 1, rotate: 0, opacity: 1 }}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className="h-16 w-16 bg-gradient-to-br from-primary to-emerald-600 rounded-[1.5rem] shadow-2xl flex items-center justify-center text-white relative group border-2 border-white/20"
            >
                <Sparkles className="h-8 w-8" />
                <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center animate-bounce">
                    <span className="text-[10px] font-black">1</span>
                </div>

                {/* Tooltip */}
                <div className="absolute right-20 bg-card/95 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-black shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all text-primary border border-primary/10 pointer-events-none uppercase tracking-widest">
                    {t('nav.assistant') || 'AI Copilot'}
                </div>
            </motion.button>
        </div>
    );
}
