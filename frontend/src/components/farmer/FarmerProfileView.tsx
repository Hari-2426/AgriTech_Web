import { motion } from 'framer-motion';
import { User, MapPin, Tag, Minimize2, LogOut, CheckCircle2, Copy, Check, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

interface FarmerProfileViewProps {
    onLogout: () => void;
}

export function FarmerProfileView({ onLogout }: FarmerProfileViewProps) {
    const { t } = useLanguage();
    const [copied, setCopied] = useState(false);
    const farmerDataString = localStorage.getItem('farmerData');
    const farmerData = farmerDataString ? JSON.parse(farmerDataString) : null;

    if (!farmerData) return null;

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success("Farmer ID copied!");
        setTimeout(() => setCopied(false), 2000);
    };

    const profileDetails = [
        { label: 'Phone Number', value: farmerData.phone, icon: Phone },
        { label: t('farmer.landSize'), value: `${farmerData.landSize} Acres`, icon: Minimize2 },
        { label: 'State', value: farmerData.state, icon: MapPin },
        { label: t('farmer.district'), value: farmerData.district, icon: MapPin },
        { label: t('farmer.village'), value: farmerData.village, icon: MapPin },
        { label: 'Pincode', value: farmerData.pincode, icon: Tag },
    ];

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <Card className="overflow-hidden border-none shadow-2xl bg-card rounded-[2.5rem]">
                    <div className="h-40 bg-gradient-to-r from-primary/80 via-primary to-emerald-500 relative">
                        <div className="absolute -bottom-16 left-12">
                            <Avatar className="h-32 w-32 border-[6px] border-background ring-4 ring-primary/10 shadow-2xl">
                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${farmerData.name}`} />
                                <AvatarFallback className="bg-muted text-4xl font-black text-primary">
                                    {farmerData.name?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </div>

                    <div className="pt-20 pb-10 px-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-4xl font-black flex items-center gap-3 tracking-tight">
                                {farmerData.name}
                                <div className="p-1 rounded-full bg-primary/20">
                                    <CheckCircle2 className="h-6 w-6 text-primary fill-primary" />
                                </div>
                            </h1>
                            <div className="flex items-center gap-3 mt-2">
                                <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black text-primary uppercase tracking-widest">
                                    {farmerData.state === 'Andhra Pradesh' ? 'AP' : 'TG'} Farmer
                                </div>
                                <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest opacity-60">Verified Profile</span>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={onLogout} className="rounded-full px-8 h-12 text-destructive hover:bg-destructive/10 hover:text-destructive font-black uppercase tracking-widest text-[10px] border border-destructive/20">
                            <LogOut className="mr-3 h-4 w-4" />
                            Sign Out
                        </Button>
                    </div>

                    <div className="px-12 pb-12">
                        <div className="bg-muted/30 border-2 border-dashed border-primary/20 rounded-3xl p-6 flex items-center justify-between group shadow-inner">
                            <div>
                                <p className="text-[10px] uppercase font-black text-muted-foreground mb-1 tracking-[0.2em]">{t('farmer.farmerId')}</p>
                                <p className="text-2xl font-mono font-black text-primary select-all tracking-tight">{farmerData.farmerId}</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => copyToClipboard(farmerData.farmerId)}
                                className="h-12 w-12 rounded-2xl hover:bg-primary/10 text-primary transition-all active:scale-90"
                            >
                                {copied ? <Check className="h-6 w-6" /> : <Copy className="h-6 w-6" />}
                            </Button>
                        </div>
                    </div>
                </Card>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
                {profileDetails.map((detail, index) => (
                    <motion.div
                        key={detail.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Card className="p-6 flex items-center gap-5 hover:bg-muted/80 transition-all border-none shadow-xl rounded-[1.5rem] cursor-default group">
                            <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                <detail.icon className="h-6 w-6 text-primary group-hover:text-white" />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black mb-1">{detail.label}</p>
                                <p className="text-base font-black text-foreground tracking-tight">{detail.value}</p>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
