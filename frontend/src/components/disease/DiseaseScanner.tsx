import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Camera, Leaf, Loader2, AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CROP_OPTIONS, type CropType, type DiseaseAnalysis } from '@/types/agri';
import { MOCK_ANALYSIS_RESULT } from '@/lib/mockData';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

export function DiseaseScanner() {
  const { t, language } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState<CropType | ''>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<DiseaseAnalysis | null>(null);
  const [scanProgress, setScanProgress] = useState(0);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setAnalysisResult(null);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setAnalysisResult(null);
    }
  }, []);

  const analyzeImage = async () => {
    if (!imagePreview || !selectedCrop) {
      toast.error(t('scanner.selectCropError'));
      return;
    }

    setIsAnalyzing(true);
    setScanProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setScanProgress(prev => Math.min(prev + 10, 90));
    }, 300);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockResult: DiseaseAnalysis = {
        diseaseName: MOCK_ANALYSIS_RESULT.disease,
        confidence: MOCK_ANALYSIS_RESULT.confidence,
        severity: 'medium',
        description: `Your ${selectedCrop} crop shows typical symptoms of ${MOCK_ANALYSIS_RESULT.disease}. Early intervention is recommended to prevent spread across the field.`,
        symptoms: MOCK_ANALYSIS_RESULT.symptoms,
        treatment: MOCK_ANALYSIS_RESULT.treatments,
        preventiveMeasures: MOCK_ANALYSIS_RESULT.precautions,
        recommendedProducts: [
          { name: 'Copper Fungicide', type: 'fungicide', dosage: '2.5g per Liter' },
          { name: 'Neem Oil', type: 'pesticide', dosage: '5ml per Liter' }
        ]
      };

      setScanProgress(100);
      setAnalysisResult(mockResult);
      toast.success(t('scanner.analysisComplete'));
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error(t('scanner.analysisError'));
    } finally {
      clearInterval(progressInterval);
      setIsAnalyzing(false);
    }
  };

  const resetScanner = () => {
    setImageFile(null);
    setImagePreview(null);
    setAnalysisResult(null);
    setScanProgress(0);
  };

  const getSeverityLabel = (severity: string) => {
    const labels: Record<string, string> = {
      low: t('scanner.severityLow'),
      medium: t('scanner.severityMedium'),
      high: t('scanner.severityHigh'),
      critical: t('scanner.severityCritical'),
    };
    return labels[severity] || severity;
  };

  const severityConfig = {
    low: { color: 'text-primary', bg: 'bg-primary/10', label: t('scanner.severityLow') },
    medium: { color: 'text-warning-foreground', bg: 'bg-warning/10', label: t('scanner.severityMedium') },
    high: { color: 'text-destructive', bg: 'bg-destructive/10', label: t('scanner.severityHigh') },
    critical: { color: 'text-destructive', bg: 'bg-destructive/20', label: t('scanner.severityCritical') },
  };

  const getCropLabel = (value: string) => {
    const key = `crop.${value}`;
    return t(key) !== key ? t(key) : CROP_OPTIONS.find(c => c.value === value)?.label || value;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary" />
            {t('scanner.title')}
          </h1>
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 animate-pulse font-mono text-[10px]">
            AI PROTOTYPE MODE
          </Badge>
        </div>
        <p className="text-muted-foreground">
          {t('scanner.desc')}
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <Card className="p-6">
            <h2 className="font-semibold mb-4">{t('scanner.stepOne')}</h2>

            {/* Crop Selection */}
            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block">{t('scanner.cropType')}</label>
              <Select value={selectedCrop} onValueChange={(v) => setSelectedCrop(v as CropType)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('scanner.selectYourCrop')} />
                </SelectTrigger>
                <SelectContent>
                  {CROP_OPTIONS.map(crop => (
                    <SelectItem key={crop.value} value={crop.value}>
                      <span className="flex items-center gap-2">
                        <span>{crop.icon}</span>
                        <span>{getCropLabel(crop.value)}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Image Upload Area */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className={cn(
                "relative border-2 border-dashed rounded-xl p-8 text-center transition-all",
                "hover:border-primary hover:bg-primary/5",
                imagePreview ? "border-primary bg-primary/5" : "border-muted-foreground/30"
              )}
            >
              <AnimatePresence mode="wait">
                {imagePreview ? (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative"
                  >
                    <img
                      src={imagePreview}
                      alt="Crop preview"
                      className="max-h-64 mx-auto rounded-lg shadow-md"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={resetScanner}
                    >
                      <X className="h-4 w-4" />
                    </Button>

                    {/* Scanning overlay */}
                    {isAnalyzing && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center"
                      >
                        <div className="relative mb-4">
                          <Loader2 className="h-12 w-12 text-primary animate-spin" />
                          <div className="absolute inset-0 h-full w-full border-4 border-primary/30 rounded-full scanning" />
                        </div>
                        <p className="font-medium">{t('scanner.analyzingCrop')}</p>
                        <div className="w-48 mt-3">
                          <Progress value={scanProgress} className="h-2" />
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="font-medium mb-1">{t('scanner.dropImage')}</p>
                    <p className="text-sm text-muted-foreground mb-4">{t('scanner.orClick')}</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="flex gap-2 justify-center">
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        {t('scanner.upload')}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Camera className="h-4 w-4 mr-2" />
                        {t('scanner.camera')}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Analyze Button */}
            <Button
              className="w-full mt-4"
              size="lg"
              disabled={!imagePreview || !selectedCrop || isAnalyzing}
              onClick={analyzeImage}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t('scanner.analyzing')}
                </>
              ) : (
                <>
                  <Leaf className="h-4 w-4 mr-2" />
                  {t('scanner.analyzeCrop')}
                </>
              )}
            </Button>
          </Card>
        </motion.div>

        {/* Results Section */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <Card className="p-6 h-full">
            <h2 className="font-semibold mb-4">{t('scanner.stepTwo')}</h2>

            <AnimatePresence mode="wait">
              {analysisResult ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Disease Name & Severity */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{analysisResult.diseaseName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('scanner.confidence')}: {analysisResult.confidence}%
                      </p>
                    </div>
                    <Badge className={cn(severityConfig[analysisResult.severity].bg, severityConfig[analysisResult.severity].color)}>
                      {severityConfig[analysisResult.severity].label}
                    </Badge>
                  </div>

                  {/* Severity Meter */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{t('scanner.severity')}</span>
                      <span className={severityConfig[analysisResult.severity].color}>
                        {analysisResult.severity === 'low' ? '25%' :
                          analysisResult.severity === 'medium' ? '50%' :
                            analysisResult.severity === 'high' ? '75%' : '95%'}
                      </span>
                    </div>
                    <Progress
                      value={analysisResult.severity === 'low' ? 25 :
                        analysisResult.severity === 'medium' ? 50 :
                          analysisResult.severity === 'high' ? 75 : 95}
                      className="h-3"
                    />
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground">{analysisResult.description}</p>

                  {/* Accordion for details */}
                  <Accordion type="multiple" className="w-full">
                    <AccordionItem value="symptoms">
                      <AccordionTrigger className="text-sm">
                        <span className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-warning" />
                          {t('scanner.symptoms')}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          {analysisResult.symptoms.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="treatment">
                      <AccordionTrigger className="text-sm">
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          {t('scanner.treatment')}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                          {analysisResult.treatment.map((t, i) => <li key={i}>{t}</li>)}
                        </ol>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="prevention">
                      <AccordionTrigger className="text-sm">
                        <span className="flex items-center gap-2">
                          <Leaf className="h-4 w-4 text-primary" />
                          {t('scanner.prevention')}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          {analysisResult.preventiveMeasures.map((p, i) => <li key={i}>{p}</li>)}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center py-12"
                >
                  <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Leaf className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium mb-1">{t('scanner.noAnalysis')}</h3>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    {t('scanner.noAnalysisDesc')}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
