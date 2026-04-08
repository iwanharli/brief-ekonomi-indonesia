import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, 
  Globe, DollarSign, Flame, Shield, Activity, 
  BarChart3, Clock, Zap, Menu, X
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, Cell
} from 'recharts';

// Data types
interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  color: 'green' | 'red' | 'orange' | 'blue' | 'teal';
  oldValue?: string;
}

interface IntelCardProps {
  tag: string;
  title: string;
  description: string;
  color: 'green' | 'red' | 'orange' | 'blue' | 'purple' | 'teal';
}

// Color mappings
const colorMap = {
  green: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/30 text-emerald-400',
  red: 'from-red-500/20 to-red-600/5 border-red-500/30 text-red-400',
  orange: 'from-amber-500/20 to-amber-600/5 border-amber-500/30 text-amber-400',
  blue: 'from-blue-500/20 to-blue-600/5 border-blue-500/30 text-blue-400',
  teal: 'from-teal-500/20 to-teal-600/5 border-teal-500/30 text-teal-400',
  purple: 'from-purple-500/20 to-purple-600/5 border-purple-500/30 text-purple-400',
};

const badgeColorMap = {
  green: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  red: 'bg-red-500/20 text-red-400 border-red-500/30',
  orange: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  teal: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

// Components
const StatCard = ({ label, value, delta, trend, icon, color, oldValue }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={`relative overflow-hidden rounded-xl border bg-gradient-to-br ${colorMap[color]} p-5 card-hover`}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
        {delta && (
          <p className={`mt-1 text-sm flex items-center gap-1 ${trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-amber-400'}`}>
            {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : trend === 'down' ? <TrendingDown className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
            {delta}
          </p>
        )}
        {oldValue && (
          <p className="mt-1 text-xs text-muted-foreground line-through opacity-60">{oldValue}</p>
        )}
      </div>
      <div className="p-2 rounded-lg bg-white/5">{icon}</div>
    </div>
  </motion.div>
);

const IntelCard = ({ tag, title, description, color }: IntelCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className={`rounded-xl border bg-gradient-to-br ${colorMap[color]} p-5 card-hover`}
  >
    <Badge variant="outline" className={`mb-3 ${badgeColorMap[color]}`}>
      {tag}
    </Badge>
    <h4 className="text-lg font-semibold mb-2">{title}</h4>
    <p className="text-sm text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ 
      __html: description.replace(/<strong>/g, '<span class="text-foreground font-semibold">').replace(/<\/strong>/g, '</span>') 
    }} />
  </motion.div>
);

const TimelineItem = ({ date, title, description, color }: { date: string; title: string; description: string; color: string }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className="relative pl-8 pb-8 border-l-2 border-border last:pb-0"
  >
    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 ${color} bg-background`} />
    <p className="text-xs font-mono text-muted-foreground mb-1">{date}</p>
    <h4 className="text-base font-semibold mb-1">{title}</h4>
    <p className="text-sm text-muted-foreground">{description}</p>
  </motion.div>
);

// Chart data
const deficitData = [
  { scenario: 'WTI $70', value: 2.3, color: '#10b981' },
  { scenario: 'WTI $95', value: 2.9, color: '#f59e0b' },
  { scenario: 'WTI $113', value: 3.5, color: '#f97316' },
  { scenario: 'WTI $130', value: 4.2, color: '#ef4444' },
  { scenario: 'GREAT Inst.', value: 4.3, color: '#dc2626' },
];

const ihsgData = [
  { date: '2 Apr', value: 7026 },
  { date: '3 Apr', value: 7050 },
  { date: '4 Apr', value: 7035 },
  { date: '5 Apr', value: 7010 },
  { date: '6 Apr', value: 6995 },
  { date: '7 Apr', value: 6971 },
  { date: '8 Apr', value: 7207 },
];

const tarifData = [
  { country: 'Vietnam', value: 46, color: '#ef4444' },
  { country: 'Thailand', value: 36, color: '#f97316' },
  { country: 'Malaysia', value: 25, color: '#f59e0b' },
  { country: 'Filipina', value: 20, color: '#eab308' },
  { country: 'Indonesia', value: 19, color: '#10b981' },
];

const riskData = [
  { label: 'Hormuz Dibuka Permanen', value: 35, color: '#10b981' },
  { label: 'Gencatan Runtuh', value: 28, color: '#ef4444' },
  { label: 'Houthi Blokir Bab el-Mandeb', value: 40, color: '#f97316' },
  { label: 'Eskalasi Nuklir', value: 5, color: '#dc2626' },
  { label: 'Negosiasi Islamabad Sukses', value: 25, color: '#10b981' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('iran');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auto-update timestamp
  useEffect(() => {}, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                <Activity className="w-4 h-4 text-background" />
              </div>
              <span className="font-bold text-sm tracking-wider">REPORT</span>
              <span className="text-muted-foreground text-sm">· APR 2026</span>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              <Button 
                variant={activeTab === 'iran' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setActiveTab('iran')}
                className={activeTab === 'iran' ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30' : ''}
              >
                <Flame className="w-4 h-4 mr-2" />
                Situasi Perang Iran
              </Button>
              <Button 
                variant={activeTab === 'indonesia' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setActiveTab('indonesia')}
                className={activeTab === 'indonesia' ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' : ''}
              >
                <Globe className="w-4 h-4 mr-2" />
                Situasi Indonesia
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-glow" />
                LIVE UPDATE
              </div>
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t bg-background"
            >
              <div className="px-4 py-3 space-y-2">
                <Button 
                  variant={activeTab === 'iran' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => { setActiveTab('iran'); setMobileMenuOpen(false); }}
                >
                  <Flame className="w-4 h-4 mr-2" />
                  Situasi Perang Iran
                </Button>
                <Button 
                  variant={activeTab === 'indonesia' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => { setActiveTab('indonesia'); setMobileMenuOpen(false); }}
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Situasi Indonesia
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <AnimatePresence mode="wait">
            {activeTab === 'iran' ? (
              <motion.div
                key="iran-hero"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    GENCATAN SENJATA — 8 APRIL 2026
                  </Badge>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
                  PERANG AS–IRAN–ISRAEL:
                  <span className="block gradient-text mt-2">GENCATAN SENJATA 2 MINGGU</span>
                  <span className="block text-amber-400 mt-2">HORMUZ DIBUKA</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mb-6">
                  Trump tangguhkan serangan 90 menit sebelum deadline. Iran sepakat buka Selat Hormuz. 
                  Minyak anjlok 16%. Negosiasi lanjutan di Islamabad mulai 10 April 2026.
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-emerald-400">Hormuz: DIBUKA TERBATAS</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span>WTI: ~$95/bbl <span className="text-emerald-400">↓16%</span></span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Berlaku s.d. ~22 April</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="indonesia-hero"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    DAMPAK GENCATAN — UPDATE MAKROEKONOMI
                  </Badge>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
                  INDONESIA PASCA
                  <span className="block gradient-text mt-2">GENCATAN SENJATA:</span>
                  <span className="block text-amber-400 mt-2">BADAI MEREDA — TAPI BELUM AMAN</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mb-6">
                  Gencatan senjata AS–Iran langsung angkat IHSG +3,39%, rupiah menguat ke Rp16.985. 
                  Minyak turun $18/bbl → tekanan APBN berkurang. Namun tarif Trump 19% dan defisit 0,93% PDB tetap jadi catatan berat.
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">IHSG: 7.207 (+3,39%)</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span>Rupiah: Rp16.985 <span className="text-emerald-400">↑</span></span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="text-red-400">Defisit: 0,93% PDB</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Ticker */}
      <div className="border-y bg-card/50 overflow-hidden">
        <div className="flex animate-ticker whitespace-nowrap py-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-12 px-6">
              <span className="text-sm"><span className="text-muted-foreground">STATUS PERANG:</span> <span className="text-emerald-400 font-medium">GENCATAN SENJATA 2 MINGGU</span></span>
              <span className="text-sm"><span className="text-muted-foreground">HORMUZ:</span> <span className="text-emerald-400 font-medium">DIBUKA — jalur aman terbatas</span></span>
              <span className="text-sm"><span className="text-muted-foreground">WTI CRUDE:</span> <span className="text-emerald-400 font-medium">~$95/bbl ▼ -16%</span></span>
              <span className="text-sm"><span className="text-muted-foreground">BRENT:</span> <span className="text-emerald-400 font-medium">~$94/bbl ▼ dari &gt;$140</span></span>
              <span className="text-sm"><span className="text-muted-foreground">NEGOSIASI:</span> <span className="text-amber-400 font-medium">Islamabad — mulai 10 Apr</span></span>
              <span className="text-sm"><span className="text-muted-foreground">USD/IDR:</span> <span className="text-emerald-400 font-medium">Rp16.985 ▲ Menguat</span></span>
              <span className="text-sm"><span className="text-muted-foreground">IHSG:</span> <span className="text-emerald-400 font-medium">7.207 ▲ +3,39%</span></span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          {activeTab === 'iran' ? (
            <motion.div
              key="iran-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-12"
            >
              {/* Stats Grid */}
              <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="text-4xl text-muted-foreground/30 font-black">01</span>
                  DASHBOARD UTAMA
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard 
                    label="Minyak WTI (8 Apr)" 
                    value="~$95" 
                    delta="Turun dari $113,66" 
                    trend="down"
                    icon={<DollarSign className="w-5 h-5" />}
                    color="teal"
                    oldValue="lama: $113,66/bbl"
                  />
                  <StatCard 
                    label="Brent Dated" 
                    value="~$94" 
                    delta="Dari &gt;$140 (rekor)" 
                    trend="down"
                    icon={<DollarSign className="w-5 h-5" />}
                    color="green"
                    oldValue="lama: &gt;$140/bbl REKOR"
                  />
                  <StatCard 
                    label="Status Selat Hormuz" 
                    value="DIBUKA" 
                    delta="Terbatas 2 minggu" 
                    trend="up"
                    icon={<Globe className="w-5 h-5" />}
                    color="green"
                    oldValue="lama: 90% di bawah normal"
                  />
                  <StatCard 
                    label="Negosiasi Islamabad" 
                    value="10 Apr" 
                    delta="AS–Iran–Israel mulai Jumat" 
                    trend="neutral"
                    icon={<Clock className="w-5 h-5" />}
                    color="blue"
                  />
                  <StatCard 
                    label="Emas Global" 
                    value="$4.648" 
                    delta="Stabil $4.648–4.681/oz" 
                    trend="neutral"
                    icon={<Zap className="w-5 h-5" />}
                    color="orange"
                    oldValue="lama: $5.019/oz (tidak akurat)"
                  />
                  <StatCard 
                    label="TNI UNIFIL Lebanon" 
                    value="3 GUGUR" 
                    delta="8 terluka — serangan Israel" 
                    trend="up"
                    icon={<Shield className="w-5 h-5" />}
                    color="red"
                  />
                  <StatCard 
                    label="Lalu Lintas Hormuz" 
                    value="10%→?" 
                    delta="Masih normalisasi bertahap" 
                    trend="neutral"
                    icon={<Activity className="w-5 h-5" />}
                    color="orange"
                  />
                  <StatCard 
                    label="Gencatan Berlaku" 
                    value="s.d. ~22 Apr" 
                    delta="Dapat diperpanjang" 
                    trend="up"
                    icon={<CheckCircle2 className="w-5 h-5" />}
                    color="green"
                  />
                </div>
              </section>

              {/* Timeline */}
              <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="text-4xl text-muted-foreground/30 font-black">02</span>
                  KRONOLOGI GENCATAN SENJATA
                </h2>
                <Card className="p-6">
                  <div className="space-y-0">
                    <TimelineItem 
                      date="28 FEBRUARI 2026"
                      title="AS & Israel Serang Iran — Perang Dimulai"
                      description="Serangan serentak menargetkan kepemimpinan IRGC. Khamenei dilaporkan tewas. Iran balas dengan rudal ke pangkalan AS di Timur Tengah. Selat Hormuz ditutup efektif — 20% minyak dunia terblokir."
                      color="border-red-500 bg-red-500/20"
                    />
                    <TimelineItem 
                      date="1–31 MARET 2026"
                      title="Eskalasi — Hormuz 90% Tertutup — Minyak Meledak"
                      description="WTI tembus $91–$99/bbl. Houthi bergabung 28 Maret, ancam tutup Bab el-Mandeb. Saudi naikkan premi Arab Light ke $19.50 di atas benchmark (rekor). 3 prajurit TNI gugur di Lebanon (29–30 Mar)."
                      color="border-red-500 bg-red-500/20"
                    />
                    <TimelineItem 
                      date="6–7 APRIL 2026"
                      title="Puncak Eskalasi — Ultimatum Trump"
                      description="WTI $113,66 (6 Apr). Brent &gt;$140 (rekor). Trump: 'Seluruh peradaban akan mati malam ini.' Deadline bagi Iran buka Hormuz atau infrastruktur dibom. Rupiah jeblok ke Rp17.105."
                      color="border-red-500 bg-red-500/20"
                    />
                    <TimelineItem 
                      date="7 APRIL 2026 · MALAM"
                      title="Pakistan Mediasi — Proposal 2 Minggu"
                      description="PM Shehbaz Sharif & Jenderal Asim Munir desak Trump tunda deadline. Pakistan juga desak Iran buka Hormuz sebagai 'isyarat niat baik'. Iran sampaikan rencana 10 poin ke AS & Israel."
                      color="border-amber-500 bg-amber-500/20"
                    />
                    <TimelineItem 
                      date="8 APRIL 2026 · 07.00 WIB"
                      title="GENCATAN SENJATA DIUMUMKAN — 90 Menit Sebelum Deadline"
                      description="Trump umumkan penangguhan 2 minggu via Truth Social. Menlu Iran Abbas Araghchi konfirmasi Hormuz dibuka dengan koordinasi militer Iran. Israel juga ikut gencatan. Minyak anjlok 16% dalam hitungan jam."
                      color="border-emerald-500 bg-emerald-500/20"
                    />
                    <TimelineItem 
                      date="10 APRIL 2026 · ISLAMABAD"
                      title="Negosiasi Formal Dimulai"
                      description="AS, Iran, Israel bertemu di Pakistan untuk bahas detail proposal damai. Topik: akses permanen Hormuz, ganti rugi infrastruktur Iran, penghentian total permusuhan, dan framework nuklir Iran."
                      color="border-emerald-500 bg-emerald-500/20"
                    />
                  </div>
                </Card>
              </section>

              {/* Intel Cards */}
              <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="text-4xl text-muted-foreground/30 font-black">03</span>
                  SITUASI TERKINI
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <IntelCard 
                    tag="✅ POSITIF — BARU"
                    title="Hormuz Dibuka — Tanker Mulai Bergerak"
                    description="Selat Hormuz dibuka terbatas dengan koordinasi militer Iran selama 2 minggu. Tanker mulai mendapat izin lewat. Namun <strong>belum kembali normal penuh</strong> — volume masih jauh di bawah 20 juta barel/hari."
                    color="green"
                  />
                  <IntelCard 
                    tag="✅ POSITIF — BARU"
                    title="Israel Ikut Gencatan Senjata"
                    description="Dua pejabat Gedung Putih konfirmasi Israel bagian dari gencatan senjata 2 minggu. Israel hentikan serangan udara ke wilayah Iran selama proses negosiasi."
                    color="green"
                  />
                  <IntelCard 
                    tag="⚠ MASIH BERJALAN"
                    title='Iran: "Perang Belum Berakhir"'
                    description="DKNAT Iran: <strong>'Tangan kami tetap di pelatuk. Kesalahan sekecil apa pun akan ditanggapi dengan kekuatan penuh.'</strong> Iran ajukan 10 syarat perdamaian."
                    color="orange"
                  />
                  <IntelCard 
                    tag="⚠ BELUM SELESAI"
                    title="Houthi — Bab el-Mandeb Masih Mengancam"
                    description="Houthi Yemen bergabung 28 Maret. Meski gencatan AS–Iran berlaku, <strong>Houthi belum resmi masuk gencatan</strong>. Laut Merah dan Bab el-Mandeb masih dalam kondisi siaga tinggi."
                    color="orange"
                  />
                  <IntelCard 
                    tag="🇮🇩 DAMPAK LANGSUNG RI"
                    title="3 Prajurit TNI Gugur di Lebanon"
                    description="Mayor Inf. Zulmi Aditya Iskandar, Serka Muhammad Nur Ichwan, Kopda Farizal Rhomadhon gugur 29–30 Maret 2026. PBB: <strong>'Berpotensi dikategorikan kejahatan perang.'</strong>"
                    color="red"
                  />
                  <IntelCard 
                    tag="🌍 GEOPOLITIK GLOBAL"
                    title="Negosiasi Islamabad: 4 Topik Kunci"
                    description="Akses Selat Hormuz permanen · Ganti rugi kerusakan infrastruktur Iran · Penghentian total & permanen semua konflik kawasan · Framework nuklir Iran pasca-konflik."
                    color="blue"
                  />
                </div>
              </section>

              {/* Scenarios & Risk */}
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-amber-400" />
                      SKENARIO 2 MINGGU KE DEPAN
                    </CardTitle>
                  </CardHeader>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-emerald-400">Negosiasi Berhasil</span>
                        <Badge className="bg-emerald-500/20 text-emerald-400">25%</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Gencatan diperpanjang, Hormuz dibuka permanen</p>
                      <div className="flex gap-4 mt-2 text-xs">
                        <span className="text-emerald-400">WTI: $75–85</span>
                        <span className="text-emerald-400">Rupiah: Rp16.500–16.700</span>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-amber-400">Negosiasi Deadlock</span>
                        <Badge className="bg-amber-500/20 text-amber-400">45%</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Jeda berulang, tidak ada solusi permanen</p>
                      <div className="flex gap-4 mt-2 text-xs">
                        <span className="text-amber-400">WTI: $88–98</span>
                        <span className="text-amber-400">Rupiah: Rp16.800–17.100</span>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-red-400">Gencatan Runtuh</span>
                        <Badge className="bg-red-500/20 text-red-400">30%</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Salah satu pihak langgar perjanjian</p>
                      <div className="flex gap-4 mt-2 text-xs">
                        <span className="text-red-400">WTI: $115–135</span>
                        <span className="text-red-400">Rupiah: Rp17.300–17.800</span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-amber-400" />
                      INDEKS RISIKO KAWASAN
                    </CardTitle>
                  </CardHeader>
                  <div className="space-y-4">
                    {riskData.map((item, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">{item.label}</span>
                          <span style={{ color: item.color }} className="font-medium">{item.value}%</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${item.value}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: idx * 0.1 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="indonesia-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-12"
            >
              {/* Stats Grid */}
              <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="text-4xl text-muted-foreground/30 font-black">01</span>
                  DASHBOARD UTAMA
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard 
                    label="Kurs Rupiah (8 Apr)" 
                    value="16.985" 
                    delta="Menguat dari Rp17.105" 
                    trend="up"
                    icon={<DollarSign className="w-5 h-5" />}
                    color="green"
                    oldValue="lama: 17.064 (7 Apr)"
                  />
                  <StatCard 
                    label="Minyak WTI (8 Apr)" 
                    value="~$95" 
                    delta="Turun dari $113,66" 
                    trend="down"
                    icon={<DollarSign className="w-5 h-5" />}
                    color="teal"
                    oldValue="lama: $113,66/bbl"
                  />
                  <StatCard 
                    label="Defisit APBN (Mar)" 
                    value="0,93%" 
                    delta="Rp240,1T vs 0,41% 2025" 
                    trend="up"
                    icon={<TrendingUp className="w-5 h-5" />}
                    color="red"
                  />
                  <StatCard 
                    label="Cadangan Devisa" 
                    value="$154,6B" 
                    delta="Data Jan · Feb turun" 
                    trend="down"
                    icon={<Shield className="w-5 h-5" />}
                    color="orange"
                  />
                  <StatCard 
                    label="IHSG (8 Apr pagi)" 
                    value="7.207" 
                    delta="Sesi I: +3,39%" 
                    trend="up"
                    icon={<BarChart3 className="w-5 h-5" />}
                    color="green"
                    oldValue="lama: 6.971 (7 Apr)"
                  />
                  <StatCard 
                    label="Inflasi (Maret 2026)" 
                    value="3,48%" 
                    delta="Turun dari 4,76% Feb" 
                    trend="down"
                    icon={<Activity className="w-5 h-5" />}
                    color="green"
                  />
                  <StatCard 
                    label="SAL (Bantalan Fiskal)" 
                    value="Rp420T" 
                    delta="Siap digunakan — buffer aktif" 
                    trend="up"
                    icon={<Zap className="w-5 h-5" />}
                    color="orange"
                  />
                  <StatCard 
                    label="Emas Antam (8 Apr)" 
                    value="Rp2,9jt" 
                    delta="+Rp50.000/gr dari kemarin" 
                    trend="up"
                    icon={<Zap className="w-5 h-5" />}
                    color="green"
                  />
                </div>
              </section>

              {/* Impact Cards */}
              <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="text-4xl text-muted-foreground/30 font-black">02</span>
                  DAMPAK GENCATAN SENJATA KE INDONESIA
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <IntelCard 
                    tag="📉 INSTAN POSITIF"
                    title="Tekanan Fiskal Berkurang ~Rp126T"
                    description="Minyak turun dari $113,66 → ~$95/bbl. Selisih $18,66 × sensitivitas Rp6,8T/$1 = <strong>penghematan potensial ~Rp126T</strong> dari tekanan defisit."
                    color="green"
                  />
                  <IntelCard 
                    tag="📈 IHSG MELONJAK"
                    title="IHSG +3,39% ke 7.207 di Sesi I"
                    description="IHSG dibuka +2,75% ke 7.162, sesi I ditutup di <strong>7.207,15 (+3,39%)</strong>. Ini rebound terbesar dalam beberapa bulan. 566 saham menguat vs 134 melemah."
                    color="green"
                  />
                  <IntelCard 
                    tag="💱 RUPIAH MENGUAT"
                    title="Rupiah Kembali ke Rp16.985"
                    description="Rupiah dibuka menguat ke <strong>Rp16.985/USD</strong> — kembali ke level 4 April. Dari titik terburuk Rp17.105 (kemarin). BI masih aktif intervensi."
                    color="green"
                  />
                  <IntelCard 
                    tag="⚠ TETAP BERLAKU"
                    title="Tarif Trump 19% — Tidak Berubah"
                    description="Gencatan Iran tidak mengubah posisi tarif AS. Indonesia tetap kena <strong>19%</strong> tarif resiprokal. Sektor tekstil, furnitur, alas kaki tetap tertekan."
                    color="orange"
                  />
                  <IntelCard 
                    tag="🪖 ISU DIPLOMATIK PANAS"
                    title="3 TNI Gugur di Lebanon"
                    description="Prabowo kecam keras serangan terhadap pasukan UNIFIL. PBB: <strong>'Berpotensi kejahatan perang.'</strong> DPR dorong opsi penarikan TNI dari UNIFIL."
                    color="red"
                  />
                  <IntelCard 
                    tag="🌐 PELUANG DIPLOMATIK"
                    title="Indonesia: Peluang Jadi Mediator"
                    description="Prabowo tawarkan diri terbang ke Teheran sebagai mediator. Indonesia anggota OIC — bisa dorong sesi darurat OIC. Non-blok memberi leverage."
                    color="blue"
                  />
                </div>
              </section>

              {/* Tabs Section */}
              <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="text-4xl text-muted-foreground/30 font-black">03</span>
                  DATA MAKROEKONOMI TERBARU
                </h2>
                <Tabs defaultValue="fiskal" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                    <TabsTrigger value="fiskal">📊 Fiskal & APBN</TabsTrigger>
                    <TabsTrigger value="energi">⚡ Energi</TabsTrigger>
                    <TabsTrigger value="pasar">📈 Pasar & Kurs</TabsTrigger>
                    <TabsTrigger value="tarif">🌏 Tarif Trump</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="fiskal" className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card className="p-6">
                        <CardHeader className="px-0 pt-0">
                          <CardTitle className="text-lg">Proyeksi Defisit APBN 2026</CardTitle>
                        </CardHeader>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={deficitData} layout="vertical">
                              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                              <XAxis type="number" domain={[0, 5]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                              <YAxis dataKey="scenario" type="category" width={100} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                              <Tooltip 
                                contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                                labelStyle={{ color: 'hsl(var(--foreground))' }}
                              />
                              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                {deficitData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="mt-4 flex items-center gap-4 text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-emerald-500" />
                            <span className="text-muted-foreground">&lt;3% UU</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-amber-500" />
                            <span className="text-muted-foreground">Target 2.68%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-red-500" />
                            <span className="text-muted-foreground">&gt;3% Bahaya</span>
                          </div>
                        </div>
                      </Card>

                      <div className="space-y-4">
                        <IntelCard 
                          tag="🔴 DEFISIT APBN"
                          title="Defisit Maret 2026: Rp240,1T (0,93% PDB)"
                          description="Naik <strong>2,4x</strong> dari 0,41% periode sama 2025. Target APBN: Rp689,1T (2,68% PDB). Sudah 34,8% terpakai dalam 3 bulan."
                          color="red"
                        />
                        <IntelCard 
                          tag="🛡 SAL — BANTALAN AKTIF"
                          title="Saldo Anggaran Lebih Rp420T"
                          description="Ini <em>game changer</em> fiskal 2026. SAL Rp420T siap digunakan sebagai bantalan defisit tanpa perlu tambah utang."
                          color="green"
                        />
                        <IntelCard 
                          tag="⚠ FITCH: OUTLOOK NEGATIF"
                          title="Risiko Downgrade Rating Kredit RI"
                          description="Fitch memberikan <strong>outlook negatif</strong> — tanda lembaga rating global ragukan ketahanan fiskal RI jangka menengah."
                          color="orange"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="energi" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <IntelCard 
                        tag="⚡ UPDATE — POSITIF"
                        title="Minyak Turun $18 — Subsidi Lebih Ringan"
                        description="WTI dari $113,66 → ~$95/bbl (turun 16%). BBM subsidi <strong>tidak naik hingga akhir 2026</strong> — pemerintah sudah hitung berdasarkan rata-rata $100/bbl."
                        color="teal"
                      />
                      <IntelCard 
                        tag="🔴 KERENTANAN STRUKTURAL"
                        title="Cadangan BBM Hanya 20–25 Hari"
                        description="Standar internasional: 90 hari. Indonesia hanya punya <strong>20–25 hari</strong> (22–27% dari standar). Gap struktural permanen."
                        color="red"
                      />
                      <IntelCard 
                        tag="⚠ SENSITIVITAS"
                        title="Masih ~Rp170T di Atas Asumsi APBN"
                        description="Asumsi APBN: $70/bbl. Aktual: ~$95/bbl. Selisih $25 × Rp6,8T = <strong>masih ~Rp170T tekanan</strong> yang belum ter-cover."
                        color="orange"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="pasar" className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card className="p-6">
                        <CardHeader className="px-0 pt-0">
                          <CardTitle className="text-lg">Pergerakan IHSG — April 2026</CardTitle>
                        </CardHeader>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={ihsgData}>
                              <defs>
                                <linearGradient id="ihsgGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                              <YAxis domain={[6800, 7400]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                              <Tooltip 
                                contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                                labelStyle={{ color: 'hsl(var(--foreground))' }}
                              />
                              <Area type="monotone" dataKey="value" stroke="#10b981" fillOpacity={1} fill="url(#ihsgGradient)" strokeWidth={2} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </Card>

                      <div className="space-y-4">
                        <IntelCard 
                          tag="📈 IHSG — REBOUND KUAT"
                          title="IHSG +3,39% ke 7.207 di Sesi I"
                          description="IHSG dibuka +2,75% ke 7.162, sesi I ditutup di <strong>7.207,15</strong>. Dari titik terendah kemarin 6.971. 566 saham menguat, 134 melemah."
                          color="teal"
                        />
                        <IntelCard 
                          tag="💱 RUPIAH MENGUAT"
                          title="Rp16.985 — Kembali ke Level Pra-Eskalasi"
                          description="Rupiah menguat 106 poin (+0,62%) ke Rp16.985 pagi ini. Indeks dolar AS melemah 0,96% ke 98,99."
                          color="green"
                        />
                        <IntelCard 
                          tag="⚠ OUTFLOW ASING"
                          title="Rp36T Outflow Sejak Awal Tahun"
                          description="Asing jual Rp1,78T (7 Apr) dan Rp36T total sejak Januari. FTSE: Indonesia tetap 'Secondary Emerging Market'."
                          color="orange"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="tarif" className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card className="p-6">
                        <CardHeader className="px-0 pt-0">
                          <CardTitle className="text-lg">Tarif Trump ASEAN (%)</CardTitle>
                        </CardHeader>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={tarifData} layout="vertical">
                              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                              <XAxis type="number" domain={[0, 50]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                              <YAxis dataKey="country" type="category" width={80} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                              <Tooltip 
                                contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                                labelStyle={{ color: 'hsl(var(--foreground))' }}
                              />
                              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                {tarifData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </Card>

                      <div className="space-y-4">
                        <IntelCard 
                          tag="✅ KEUNGGULAN RELATIF"
                          title="19% — Terendah di ASEAN"
                          description="Vietnam: 46% · Thailand: 36% · Malaysia: 25% · Filipina: 20% · <strong>Indonesia: 19%</strong>. Kompensasi: beli energi AS $15B, agrikultur $4,5B, 50 Boeing."
                          color="green"
                        />
                        <IntelCard 
                          tag="🔴 TEKANAN EKSPOR"
                          title="$6,5 Miliar Ekspor Terdampak"
                          description="Tekstil (3,98 juta pekerja): AS serap 60,5% ekspor knitwear. Furnitur: AS serap 58,2%. Alas kaki: 50,5%. Total: <strong>~$6,5 miliar</strong>."
                          color="red"
                        />
                        <IntelCard 
                          tag="🌏 STRATEGI DIVERSIFIKASI"
                          title="RCEP + OIC + Timur Tengah"
                          description="INDEF rekomendasikan optimalisasi RCEP (15 negara, 1/3 ekonomi global). Depresiasi rupiah tingkatkan daya saing di pasar non-AS."
                          color="purple"
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </section>

              {/* Politics Section */}
              <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="text-4xl text-muted-foreground/30 font-black">04</span>
                  SITUASI POLITIK DALAM NEGERI
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <IntelCard 
                    tag="🪖 TEKANAN TERTINGGI"
                    title="3 TNI Gugur — Kecaman Keras Prabowo"
                    description="Prabowo lepas jenazah 3 prajurit UNIFIL di Soetta (4 Apr). Pernyataan: <em>'Kami mengecam keras setiap tindakan keji yang merusak perdamaian.'</em> DPR dorong penarikan TNI."
                    color="orange"
                  />
                  <IntelCard 
                    tag="🍽 MBG — TETAP JALAN"
                    title="Program Andalan: 61,62 Juta Penerima"
                    description="MBG: Rp335T/tahun, <strong>61,62 juta penerima</strong>, Rp1,2T/hari, 31.000 dapur. Kepuasan publik 72,8%. Prabowo kekeh tidak potong MBG meski tekanan fiskal."
                    color="green"
                  />
                  <IntelCard 
                    tag="🌐 DIPLOMASI AKTIF"
                    title="Prabowo Tawarkan Diri sebagai Mediator"
                    description="Prabowo tawarkan terbang ke Teheran. Indonesia anggota OIC — bisa dorong sesi darurat. Non-blok memberi leverage di semua pihak."
                    color="blue"
                  />
                  <IntelCard 
                    tag="⚠ CATATAN: DEWAN PERDAMAIAN"
                    title='Indonesia Tangguhkan Keanggotaan "Board of Peace"'
                    description="Indonesia tangguhkan keanggotaan di Dewan Perdamaian akibat agresi AS–Israel ke Iran. <strong>Balancing act</strong> yang sangat sulit."
                    color="red"
                  />
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Conclusion */}
        <Separator className="my-12" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-amber-500/10 via-background to-teal-500/10 p-8"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative">
            <h2 className="text-2xl font-bold mb-6 text-center">
              <span className="gradient-text">✦ KESIMPULAN ANALISA REPORT — 8 APRIL 2026 ✦</span>
            </h2>
            
            <div className="space-y-4 text-muted-foreground max-w-4xl mx-auto">
              <p>
                <strong className="text-foreground">Gencatan senjata adalah kabar terbaik dalam 6 minggu terakhir.</strong> Dalam satu malam, tiga tekanan besar mereda sekaligus: minyak turun $18/bbl, rupiah menguat ke Rp16.985, dan IHSG melesat +3,39%. Ini bukan keajaiban — ini konsekuensi logis dari de-eskalasi Hormuz.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <h4 className="font-semibold text-emerald-400 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Yang Membaik
                  </h4>
                  <ul className="text-sm space-y-1">
                    <li>• Tekanan fiskal berkurang ~Rp126T</li>
                    <li>• SAL Rp420T jadi lebih kuat sebagai buffer</li>
                    <li>• Rupiah kembali ke zona lebih aman</li>
                    <li>• IHSG rebound +3,39%</li>
                    <li>• Inflasi sudah masuk target BI</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <h4 className="font-semibold text-red-400 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Yang Belum Selesai
                  </h4>
                  <ul className="text-sm space-y-1">
                    <li>• Defisit APBN Maret: Rp240,1T (0,93% PDB)</li>
                    <li>• Cadangan BBM hanya 20–25 hari</li>
                    <li>• Fitch outlook negatif belum dicabut</li>
                    <li>• Outflow asing Rp36T belum berbalik</li>
                    <li>• Gencatan hanya 2 minggu</li>
                  </ul>
                </div>
              </div>
              
              <p>
                <strong className="text-foreground">Prioritas 2 minggu ke depan:</strong> Pantau negosiasi Islamabad 10 April. Jika berhasil → rupiah berpeluang ke Rp16.500–16.700 dan IHSG ke 7.300–7.400. Jika gagal → skenario $115–$130 kembali, rupiah jeblok ke Rp17.300+, dan defisit berpotensi melampaui 3,5% PDB.
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <div>REPORT — EKONOMI INDONESIA | 8 APRIL 2026</div>
            <div className="text-center md:text-right">
              SUMBER: KEMENKEU · BI · INDEF · GREAT INSTITUTE · KOMPAS · BISNIS.COM
            </div>
            <div>UPDATE PASCA GENCATAN SENJATA AS-IRAN</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
