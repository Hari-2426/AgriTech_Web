import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart3,
    PieChart as PieChartIcon,
    TrendingUp,
    MapPin,
    Calendar,
    IndianRupee
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend
} from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';
import { GET_INSIGHTS } from '@/lib/mockData';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function CropInsights() {
    const { t } = useLanguage();
    const [season, setSeason] = useState('Kharif');

    const farmerData = JSON.parse(localStorage.getItem('farmerData') || '{"district": "Guntur", "state": "Andhra Pradesh"}');
    const district = farmerData.district || 'Guntur';
    const state = farmerData.state || 'Andhra Pradesh';

    const regionalData = useMemo(() => {
        return GET_INSIGHTS(state, district, season);
    }, [state, district, season]);

    const CustomTooltip = ({ active, payload, isCurrency }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-card/95 border border-primary/20 p-3 rounded-lg shadow-2xl backdrop-blur-md">
                    <p className="font-bold text-foreground text-sm mb-1">{payload[0].name}</p>
                    <p className="text-sm font-bold text-primary">
                        {isCurrency ? `₹${payload[0].value.toLocaleString()}` : `${payload[0].value}%`}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-neon-green to-agri-leaf bg-clip-text text-transparent">
                        Regional Insights
                    </h1>
                    <p className="text-muted-foreground flex items-center gap-2 mt-1">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="font-medium text-foreground">{district}</span>, {state}
                    </p>
                </motion.div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-card/50 border border-primary/10 rounded-xl px-4 py-2 text-sm font-medium shadow-sm backdrop-blur-sm">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground font-bold">Season:</span>
                        <Select value={season} onValueChange={setSeason}>
                            <SelectTrigger className="border-none bg-transparent h-auto p-0 focus:ring-0 w-[100px] font-bold text-primary">
                                <SelectValue placeholder="Select Season" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Kharif">Kharif</SelectItem>
                                <SelectItem value="Rabi">Rabi</SelectItem>
                                <SelectItem value="Zaid">Zaid</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pie Chart 1 - Crop Distribution */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="glassmorphism h-full border-none shadow-glow-sm overflow-hidden">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <PieChartIcon className="h-5 w-5 text-primary" />
                                Crop Sowing Distribution
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Percentage of cultivated area in {district}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="h-[320px] pt-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={regionalData.distribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {regionalData.distribution.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                                className="hover:opacity-80 transition-opacity"
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend
                                        verticalAlign="bottom"
                                        height={48}
                                        iconType="circle"
                                        formatter={(value) => <span className="text-xs font-medium text-foreground">{value}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Pie Chart 2 - Profitability */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="glassmorphism h-full border-none shadow-glow-sm overflow-hidden">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <TrendingUp className="h-5 w-5 text-neon-green" />
                                Average Profitability
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Estimated profit (₹ per acre) for major crops
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="h-[320px] pt-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={regionalData.profitability}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {regionalData.profitability.map((entry, index) => (
                                            <Cell
                                                key={`cell-profit-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                                className="hover:opacity-80 transition-opacity"
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip isCurrency={true} />} />
                                    <Legend
                                        verticalAlign="bottom"
                                        height={48}
                                        iconType="circle"
                                        formatter={(value) => <span className="text-xs font-medium text-foreground">{value}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Insights Summary */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <Card className="border-primary/20 bg-primary/5 shadow-glow-sm">
                    <CardContent className="py-6 flex items-start gap-4">
                        <div className="bg-primary/20 p-3 rounded-xl shadow-inner">
                            <IndianRupee className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
                                Seasonal Insight for {district}
                                <span className="text-xs font-normal bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider">{season}</span>
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Our data indicates that while <strong>{regionalData.distribution[0]?.name}</strong> covers the largest area in {district},
                                <strong>{regionalData.profitability.reduce((prev, current) => prev.value > current.value ? prev : current).name}</strong>
                                offers the highest returns per acre this season. We recommend checking the
                                <span className="text-primary font-bold mx-1 hover:underline cursor-pointer" onClick={() => window.location.reload()}>Market Insights</span>
                                section for real-time price trends.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
