import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Sprout,
    Sun,
    Bug,
    Scissors,
    BadgeCheck,
    IndianRupee,
    ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimelineStep {
    phase: string;
    icon: any;
    status: 'completed' | 'current' | 'upcoming';
    details: string;
    color: string;
}

const LIFECYCLE_STAGES: TimelineStep[] = [
    {
        phase: 'Sowing',
        icon: Sprout,
        status: 'completed',
        details: 'Initial planting & fertilization',
        color: 'text-success'
    },
    {
        phase: 'Vegetative',
        icon: Sun,
        status: 'current',
        details: 'Critical growth & nutrient uptake',
        color: 'text-primary'
    },
    {
        phase: 'Pest Window',
        icon: Bug,
        status: 'upcoming',
        details: 'High vulnerability to local pests',
        color: 'text-warning'
    },
    {
        phase: 'Harvest',
        icon: Scissors,
        status: 'upcoming',
        details: 'Peak quality gathering window',
        color: 'text-neon-green'
    },
    {
        phase: 'Best Sell',
        icon: IndianRupee,
        status: 'upcoming',
        details: 'Maximized ROI period',
        color: 'text-primary'
    }
];

export function CropLifecycle() {
    return (
        <Card className="glassmorphism border-primary/20 overflow-hidden">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                    <BadgeCheck className="h-5 w-5 text-primary" />
                    Crop Lifecycle Timeline
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative">
                    {/* Progress Line */}
                    <div className="absolute top-[22px] left-0 w-full h-1 bg-muted rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '35%' }}
                            className="h-full bg-primary"
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                        />
                    </div>

                    <div className="grid grid-cols-5 gap-2 relative z-10">
                        {LIFECYCLE_STAGES.map((step, index) => (
                            <div key={step.phase} className="flex flex-col items-center text-center">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={cn(
                                        "w-12 h-12 rounded-full flex items-center justify-center border-2 mb-3 bg-card transition-all",
                                        step.status === 'completed' ? "border-success bg-success/10" :
                                            step.status === 'current' ? "border-primary bg-primary/10 shadow-glow-sm" :
                                                "border-muted bg-muted/5 opacity-60"
                                    )}
                                >
                                    <step.icon className={cn("h-5 w-5",
                                        step.status === 'completed' ? "text-success" :
                                            step.status === 'current' ? "text-primary" :
                                                "text-muted-foreground"
                                    )} />
                                </motion.div>
                                <h4 className={cn("text-xs font-bold mb-1",
                                    step.status === 'upcoming' ? "text-muted-foreground" : "text-foreground"
                                )}>
                                    {step.phase}
                                </h4>
                                <p className="text-[9px] text-muted-foreground leading-[1.1] hidden md:block">
                                    {step.details}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-between bg-primary/5 rounded-lg p-3 border border-primary/10">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-xs font-medium">Currently in <strong className="text-primary">Vegetative Phase</strong></span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        Next: Pest Window (12 days) <ArrowRight className="h-2 w-2" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
