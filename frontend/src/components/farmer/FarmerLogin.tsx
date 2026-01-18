import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, Key, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface FarmerLoginProps {
    onLogin: () => void;
    onRegisterClick: () => void;
}

export function FarmerLogin({ onLogin, onRegisterClick }: FarmerLoginProps) {
    const [identifier, setIdentifier] = useState('');
    const [otp, setOtp] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState('');
    const [step, setStep] = useState<'id' | 'otp'>('id');
    const [error, setError] = useState<string | null>(null);

    const handleSendOtp = () => {
        setError(null);
        const input = identifier.trim().toLowerCase();

        // Get registered farmers from persistent list
        const registeredFarmers = JSON.parse(localStorage.getItem('registeredFarmers') || '[]');
        const existingFarmer = registeredFarmers.find((f: any) =>
            f.farmerId?.toLowerCase() === input ||
            f.phone === input
        );

        if (existingFarmer) {
            const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
            setGeneratedOtp(newOtp);
            setStep('otp');
            toast.success(`Debug: Your OTP is ${newOtp}`);
        } else {
            setError('Account not found. Please register.');
        }
    };

    const handleVerifyOtp = () => {
        if (otp === generatedOtp) {
            // Restore session by finding the farmer again
            const registeredFarmers = JSON.parse(localStorage.getItem('registeredFarmers') || '[]');
            const input = identifier.trim().toLowerCase();
            const existingFarmer = registeredFarmers.find((f: any) =>
                f.farmerId?.toLowerCase() === input ||
                f.phone === input
            );

            if (existingFarmer) {
                localStorage.setItem('farmerData', JSON.stringify(existingFarmer));
            }

            onLogin();
            toast.success('Successfully logged in!');
        } else {
            toast.error('Invalid OTP. Please try again.');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <Card className="p-8 futuristic-card">
                    <div className="text-center mb-8">
                        <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <User className="h-8 w-8 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold">Farmer Login</h1>
                        <p className="text-muted-foreground mt-2">Access your personalized dashboard</p>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 'id' ? (
                            <motion.div
                                key="id-step"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Farmer ID or Phone Number</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Enter ID or Phone"
                                            className="pl-10"
                                            value={identifier}
                                            onChange={(e) => setIdentifier(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-lg text-sm"
                                    >
                                        <AlertCircle className="h-4 w-4 shrink-0" />
                                        <p>{error}</p>
                                        <Button
                                            variant="link"
                                            className="text-primary p-0 h-auto ml-auto font-bold"
                                            onClick={onRegisterClick}
                                        >
                                            Register
                                        </Button>
                                    </motion.div>
                                )}

                                <Button className="w-full" size="lg" onClick={handleSendOtp} disabled={!identifier}>
                                    Send OTP
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="otp-step"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-medium">Enter 6-Digit OTP</label>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-auto p-0 text-xs text-primary"
                                            onClick={() => setStep('id')}
                                        >
                                            Change ID
                                        </Button>
                                    </div>
                                    <div className="relative">
                                        <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="000000"
                                            maxLength={6}
                                            className="pl-10 tracking-widest text-lg font-mono"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <Button className="w-full" size="lg" onClick={handleVerifyOtp} disabled={otp.length !== 6}>
                                    Verify & Login
                                </Button>

                                <div className="text-center">
                                    <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={handleSendOtp}>
                                        <RefreshCw className="mr-2 h-3 w-3" />
                                        Resend OTP
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="mt-8 pt-6 border-t text-center">
                        <p className="text-sm text-muted-foreground">
                            Don't have an account?{' '}
                            <Button variant="link" className="p-0 font-bold" onClick={onRegisterClick}>
                                Register Now
                            </Button>
                        </p>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}
