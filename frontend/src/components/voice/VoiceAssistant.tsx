import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, X, MessageCircle, Waves, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface VoiceAssistantProps {
  onNavigate: (page: string) => void;
  autoGreet?: boolean;
}

export function VoiceAssistant({ onNavigate, autoGreet = true }: VoiceAssistantProps) {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [currentCaption, setCurrentCaption] = useState('');
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const hasGreeted = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Speech synthesis with caption display
  const speak = useCallback((text: string, highlightId?: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'te' ? 'te-IN' : 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setCurrentCaption(text);
        if (highlightId) setHighlightedElement(highlightId);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setCurrentCaption('');
        setHighlightedElement(null);
      };

      window.speechSynthesis.speak(utterance);
    }
  }, [language]);

  // Auto-greet on first load
  useEffect(() => {
    if (autoGreet && !hasGreeted.current) {
      hasGreeted.current = true;
      const timer = setTimeout(() => {
        const greeting = language === 'te'
          ? 'నమస్కారం! ఈ రోజు మీ పంట ఆరోగ్యం మరియు వాతావరణ అప్‌డేట్ ఇక్కడ ఉంది.'
          : "Hello! Here's today's crop health and weather update.";
        speak(greeting, 'dashboard');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [autoGreet, language, speak]);

  // Process voice commands
  const processCommand = useCallback((command: string) => {
    const lowerCommand = command.toLowerCase();
    let response = '';
    let highlightId = '';

    if (lowerCommand.includes('scan') || lowerCommand.includes('disease') || lowerCommand.includes('స్కాన్') || lowerCommand.includes('వ్యాధి')) {
      response = t('voice.scanHelp');
      highlightId = 'disease';
      onNavigate('scanner');
    } else if (lowerCommand.includes('best crop') || lowerCommand.includes('ఏ పంట') || lowerCommand.includes('which crop')) {
      response = language === 'te'
        ? 'ప్రస్తుత సీజన్‌కు మిర్చి మరియు పత్తి ఉత్తమమైనవి. ఇవి ఎకరాకు ₹45,000 పైగా లాభాన్ని అందిస్తాయి.'
        : 'Based on your district, Chili and Cotton are best for this season. Expect over ₹45,000 profit per acre.';
      highlightId = 'insights';
      onNavigate('dashboard');
    } else if (lowerCommand.includes('sell') || lowerCommand.includes('అమ్ము') || lowerCommand.includes('market')) {
      response = language === 'te'
        ? 'పంటను అమ్మడానికి ఇది సరైన సమయం! మార్కెట్ ధరలు ప్రస్తుతం 12% పెరుగుదలలో ఉన్నాయి.'
        : 'It is the perfect time to sell! Market prices for your crop are currently trending up by 12%.';
      highlightId = 'market';
      onNavigate('dropdown');
    } else if (lowerCommand.includes('why low') || lowerCommand.includes('ధర తక్కువ') || lowerCommand.includes('price low')) {
      response = language === 'te'
        ? 'పక్క జిల్లాల్లో సరఫరా ఎక్కువగా ఉండటం వల్ల ధర తగ్గింది. మరో 10 రోజులు ఆగడం మంచిది.'
        : 'Prices are low due to high supply from Guntur. I recommend waiting 10 days for a price rebound.';
    } else if (lowerCommand.includes('weather') || lowerCommand.includes('వాతావరణం') || lowerCommand.includes('rain') || lowerCommand.includes('వర్షం')) {
      response = t('voice.weatherHelp');
      highlightId = 'weather';
      onNavigate('weather');
    } else if (lowerCommand.includes('water') || lowerCommand.includes('irrigation') || lowerCommand.includes('నీటిపారుదల') || lowerCommand.includes('నీరు')) {
      response = t('voice.irrigationHelp');
      highlightId = 'irrigation';
      onNavigate('irrigation');
    } else if (lowerCommand.includes('fertilizer') || lowerCommand.includes('ఎరువు')) {
      response = language === 'te'
        ? 'ఎరువుల విభాగానికి వెళ్లండి. మీ పంట మరియు పెరుగుదల దశను ఎంచుకోండి.'
        : 'Go to fertilizer section. Select your crop and growth stage.';
      highlightId = 'fertilizer';
      onNavigate('fertilizer');
    } else if (lowerCommand.includes('hello') || lowerCommand.includes('hi') || lowerCommand.includes('నమస్కారం') || lowerCommand.includes('హలో')) {
      response = t('voice.greeting');
    } else if (lowerCommand.includes('home') || lowerCommand.includes('dashboard') || lowerCommand.includes('హోమ్') || lowerCommand.includes('డాష్‌బోర్డ్')) {
      response = language === 'te'
        ? 'డాష్‌బోర్డ్‌కు తిరిగి వెళ్తోంది.'
        : 'Going back to dashboard.';
      onNavigate('dashboard');
    } else {
      response = language === 'te'
        ? 'క్షమించండి, నేను అర్థం చేసుకోలేదు. "ఏ పంట బాగుంటుంది?", "మార్కెట్ ఎలా ఉంది?" లేదా "స్కాన్" అని అడిగి చూడండి.'
        : 'Sorry, I didn\'t understand. Try asking "Which crop is best?", "When to sell?" or "Scan my crop".';
    }

    setMessages(prev => [...prev, { text: response, isUser: false }]);
    speak(response, highlightId);
  }, [language, onNavigate, speak, t]);

  // Speech recognition
  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      const errorMsg = language === 'te'
        ? 'మీ బ్రౌజర్ వాయిస్ రికగ్నిషన్‌ను సపోర్ట్ చేయదు'
        : 'Your browser doesn\'t support voice recognition';
      setMessages(prev => [...prev, { text: errorMsg, isUser: false }]);
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = language === 'te' ? 'te-IN' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      setCurrentMessage('');
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setCurrentMessage(transcript);

      if (event.results[0].isFinal) {
        setMessages(prev => [...prev, { text: transcript, isUser: true }]);
        processCommand(transcript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setCurrentMessage('');
    };

    recognition.start();
  }, [language, processCommand]);

  // Open assistant with greeting
  const openAssistant = useCallback(() => {
    setIsOpen(true);
    if (messages.length === 0) {
      const greeting = t('voice.greeting');
      setMessages([{ text: greeting, isUser: false }]);
      setTimeout(() => speak(greeting), 500);
    }
  }, [messages.length, speak, t]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <>
      {/* Caption display when speaking */}
      <AnimatePresence>
        {isSpeaking && currentCaption && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50 max-w-md px-6 py-3 bg-card/95 backdrop-blur-md rounded-2xl shadow-2xl border border-primary/20"
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <Volume2 className="h-5 w-5 text-primary" />
              </motion.div>
              <p className="text-sm">{currentCaption}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Voice Button */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", delay: 1, stiffness: 200 }}
        className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-40"
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={openAssistant}
            size="lg"
            className={cn(
              "h-16 w-16 rounded-full shadow-xl relative overflow-hidden",
              "bg-gradient-to-br from-primary via-primary to-neon-green",
              "dark:from-neon-green dark:via-primary dark:to-primary",
              "hover:shadow-neon transition-all duration-300",
              isSpeaking && "animate-pulse-neon"
            )}
          >
            <motion.div
              animate={isSpeaking ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5, repeat: isSpeaking ? Infinity : 0 }}
              className="relative z-10"
            >
              {isSpeaking ? (
                <Waves className="h-7 w-7" />
              ) : (
                <MessageCircle className="h-7 w-7" />
              )}
            </motion.div>

            {/* Sparkle effect */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              <Sparkles className="absolute top-1 right-1 h-3 w-3 text-white/50" />
            </motion.div>
          </Button>
        </motion.div>

        {/* Multiple pulse rings */}
        <motion.div
          animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full bg-primary pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 2.2], opacity: [0.4, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          className="absolute inset-0 rounded-full bg-neon-green pointer-events-none"
        />
      </motion.div>

      {/* Voice Assistant Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-4 md:bottom-24 md:right-8 z-50 w-80 max-h-[70vh] bg-card/95 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-primary via-primary to-neon-green p-4 text-primary-foreground overflow-hidden">
              {/* Animated background */}
              <motion.div
                animate={{ x: [0, 100, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              />

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={isSpeaking ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.5, repeat: isSpeaking ? Infinity : 0 }}
                    className="p-2 rounded-full bg-white/20"
                  >
                    <Volume2 className="h-5 w-5" />
                  </motion.div>
                  <div>
                    <span className="font-semibold block">{t('voice.title')}</span>
                    <span className="text-xs text-white/70">
                      {isSpeaking ? t('voice.speaking') : t('voice.ready')}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-primary-foreground hover:bg-white/20 rounded-full"
                  onClick={() => {
                    setIsOpen(false);
                    window.speechSynthesis?.cancel();
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="h-64 overflow-y-auto p-4 space-y-3 scrollbar-hide bg-gradient-to-b from-transparent to-muted/20">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.isUser ? 20 : -20, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={cn(
                    "p-3 rounded-2xl max-w-[85%] text-sm shadow-sm",
                    msg.isUser
                      ? "ml-auto bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-br-sm"
                      : "bg-muted/80 backdrop-blur-sm rounded-bl-sm border border-border/30"
                  )}
                >
                  {msg.text}
                </motion.div>
              ))}

              {/* Current transcription */}
              {currentMessage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 rounded-2xl max-w-[85%] ml-auto bg-primary/50 text-primary-foreground rounded-br-sm text-sm backdrop-blur-sm"
                >
                  <span className="flex items-center gap-2">
                    <motion.span
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      🎤
                    </motion.span>
                    {currentMessage}...
                  </span>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Mic Button */}
            <div className="p-4 border-t border-border/50 bg-background/50 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3">
                {/* Voice visualization bars */}
                {isListening && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-1 h-8"
                  >
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ scaleY: [0.3, 1, 0.3] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                        className="w-1 h-full bg-primary rounded-full origin-center"
                      />
                    ))}
                  </motion.div>
                )}

                <motion.button
                  onClick={startListening}
                  disabled={isListening}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  className={cn(
                    "h-16 w-16 rounded-full flex items-center justify-center transition-all shadow-lg",
                    isListening
                      ? "bg-destructive text-destructive-foreground animate-pulse shadow-destructive/30"
                      : "bg-gradient-to-br from-primary to-neon-green text-primary-foreground hover:shadow-neon"
                  )}
                >
                  {isListening ? (
                    <MicOff className="h-7 w-7" />
                  ) : (
                    <Mic className="h-7 w-7" />
                  )}
                </motion.button>
                <p className="text-xs text-muted-foreground">
                  {isListening ? t('voice.listening') : t('voice.tapToSpeak')}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}