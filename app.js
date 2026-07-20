
const { useState, useEffect, useMemo, useCallback, useRef } = React;
const {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} = Recharts;
 
/* ---------------------------------------------------------------------- */
/*  API URL — endpoint PHP backend                                         */
/* ---------------------------------------------------------------------- */
const API_URL = "api/bookings.php";
const API_TX_URL = "api/transactions.php";
 
/* ---------------------------------------------------------------------- */
/*  Icon (pengganti lucide-react, memakai lucide vanilla via window.lucide) */
/* ---------------------------------------------------------------------- */
function Icon({ name, size = 16, color = "currentColor", fill = "none", strokeWidth = 2, className = "", style = {} }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current || !window.lucide || !window.lucide[name]) return;
    ref.current.innerHTML = "";
    const svg = window.lucide.createElement(window.lucide[name]);
    svg.setAttribute("width", String(size));
    svg.setAttribute("height", String(size));
    svg.setAttribute("stroke", color);
    svg.setAttribute("fill", fill);
    svg.setAttribute("stroke-width", String(strokeWidth));
    svg.style.display = "block";
    ref.current.appendChild(svg);
  }, [name, size, color, fill, strokeWidth]);
  return <span ref={ref} className={className} style={{ display: "inline-flex", flexShrink: 0, lineHeight: 0, ...style }} />;
}
 
/* ---------------------------------------------------------------------- */
/*  Tokens                                                                  */
/* ---------------------------------------------------------------------- */
const C = {
  ink: "#0C2540",          // Traveloka Dark Navy
  muted: "#687176",        // Traveloka Muted Grey
  bg: "#F7F9FA",           // Traveloka Light Grey/Blue Background
  paper: "#FFFFFF",        // White
  line: "#E9ECED",         // Light border
  blueDeep: "#0056B3",     // Traveloka Deep Blue
  blue: "#0194F3",         // Traveloka Sky Blue
  cyan: "#E0F2FE",         // Soft Blue
  blueSoft: "#F0F9FF",     // Extra Light Blue
  orange: "#FF5E1F",       // Traveloka Orange
  orangeSoft: "#FFF0E9",   // Soft Orange
  amber: "#FF9800",        // Amber
  amberSoft: "#FFF3E0",    // Soft Amber
  green: "#05A55C",        // Traveloka Green
  greenSoft: "#E6F6ED",    // Soft Green
  red: "#D32F2F",          // Red
  redSoft: "#FFEBEE",      // Soft Red
  gold: "#FFB300",         // Gold
};
const HEADER_GRAD = `linear-gradient(135deg, #0194F3 0%, #0056B3 100%)`;
const BTN_GRAD = `linear-gradient(90deg, #0194F3 0%, #007CEF 100%)`;
 
const ADMIN_PIN = window.APP_SETTINGS?.admin_pin || "2024";
const OWNER_PIN = window.APP_SETTINGS?.owner_pin || "9999";
const ADMIN_WA = window.APP_SETTINGS?.admin_wa || "6281234567890"; // dinamis dari database via PHP
 
const FREE_STANDARD = [
  "Transport 70 km",
  "Handbucket",
  "1 Pagar pengantin",
  "2 Buffer taman",
  "Smoke area & Meeting konsep",
];
 
const PACKAGES = [
  {
    id: "tenda-f", name: "Paket Tenda F", price: 11000000,
    tendaSize: "Tenda 80 m", panggung: "Panggung + pelaminan 4–5 m",
    grad: "linear-gradient(135deg,#005FBF,#0194F3)",
    features: [
      "Kursi pengantin 1 set (ready stok, tidak bisa pilih)",
      "Setting meja akad", "Full karpet",
      "Kursi plastik 70 pcs + cover",
      "Gazebo/Gate jalan", "Gapura masuk", "Welcome sign", "Stand box", "Mini garden",
      "Blower 2 pcs", "Rolltop 4 pcs",
      "Meja prasmanan 1 pcs", "Tempat nasi 1 pcs", "Termos nasi 1 pcs",
      "Alat makan (PSG) 150 pcs", "Toples kerupuk 1 pcs", "Wadah es buah 1 pcs",
      "Gubukan 2 pcs", "Meja penerima tamu 2 pcs", "Kotak amplop 2 pcs",
      "Semawar 1", "Kenceng 1", "Langseng 1",
    ],
    freeItems: FREE_STANDARD,
  },
  {
    id: "tenda-e", name: "Paket Tenda E", price: 12000000,
    tendaSize: "Tenda 100 m", panggung: "Panggung + pelaminan 4–6 m",
    grad: "linear-gradient(135deg,#0194F3,#00A5FF)",
    features: [
      "Kursi pengantin 1 set (ready stok, tidak bisa pilih)",
      "Setting meja akad", "Full karpet",
      "Kursi plastik 100 pcs + cover",
      "Gazebo/Gate jalan", "Gapura masuk", "Welcome sign", "Stand box", "Mini garden",
      "Blower 2 pcs", "Rolltop 4 pcs",
      "Meja prasmanan 1 pcs", "Tempat nasi 1 pcs", "Termos nasi 2 pcs",
      "Alat makan (PSG) 200 pcs", "Toples kerupuk 1 pcs", "Wadah es buah 1 pcs",
      "Gubukan 2 pcs", "Meja penerima tamu 2 pcs", "Kotak amplop 2 pcs",
      "Semawar 1", "Kenceng 1", "Langseng 1",
    ],
    freeItems: FREE_STANDARD,
  },
  {
    id: "tenda-d", name: "Paket Tenda D", price: 13500000,
    tendaSize: "Tenda 100 m", panggung: "Panggung + pelaminan 4–6 m",
    grad: "linear-gradient(135deg,#0A64C2,#005FBF)",
    features: [
      "Kursi pengantin 1 set (ready stok, tidak bisa pilih)",
      "Setting meja akad", "Full karpet",
      "Kursi Futura 100 pcs + cover",
      "Gazebo/Gate jalan", "Gapura masuk", "Welcome sign", "Stand box", "Mini garden",
      "Blower 2 pcs", "Rolltop 6 pcs",
      "Meja prasmanan 2 pcs", "Tempat nasi 2 pcs", "Termos nasi 2 pcs",
      "Alat makan (PSG) 200 pcs", "Toples kerupuk 1 pcs", "Wadah es buah 1 pcs",
      "Gubukan 2 pcs", "Meja penerima tamu 2 pcs", "Kotak amplop 2 pcs",
      "Semawar 2", "Kenceng 1", "Langseng 1",
    ],
    freeItems: FREE_STANDARD,
  },
  {
    id: "tenda-c", name: "Paket Tenda C", price: 14500000,
    tendaSize: "Tenda 120 m", panggung: "Panggung + pelaminan 4–6 m",
    grad: "linear-gradient(135deg,#0056B3,#0A64C2)",
    tag: "Tenda dan Dekorasi Only",
    features: [
      "Kursi pengantin 1 set (ready stok, tidak bisa pilih)",
      "Setting meja akad", "Full karpet",
      "Kursi Futura 100 pcs + cover",
      "Gazebo/Gate jalan", "Gapura masuk", "Welcome sign", "Stand box", "Mini garden",
      "Blower 2 pcs", "Rolltop 8 pcs",
      "Meja prasmanan 2 pcs", "Tempat nasi 2 pcs", "Termos nasi 2 pcs",
      "Alat makan (PSG) 200 pcs", "Toples kerupuk 1 pcs", "Wadah es buah 1 pcs",
      "Gubukan 2 pcs", "Meja penerima tamu 2 pcs", "Kotak amplop 2 pcs",
      "Semawar 2", "Kenceng 1", "Langseng 1",
    ],
    freeItems: [],
  },
  {
    id: "tenda-b", name: "Paket Tenda B", price: 16000000,
    tendaSize: "Tenda 160 m", panggung: "Panggung + pelaminan 4–6 m",
    grad: "linear-gradient(135deg,#0041A3,#0056B3)",
    tag: "Tenda dan Dekorasi Only",
    features: [
      "Kursi pengantin 1 set (ready stok, tidak bisa pilih)",
      "Setting meja akad", "Full karpet",
      "Kursi Futura 120 pcs + cover",
      "Gazebo/Gate jalan", "Gapura masuk", "Welcome sign", "Stand box", "Mini garden",
      "Blower 3 pcs", "Rolltop 8 pcs",
      "Meja prasmanan 2 pcs", "Tempat nasi 2 pcs", "Termos nasi 2 pcs",
      "Alat makan (PSG) 200 pcs", "Toples kerupuk 2 pcs", "Wadah es buah 1 pcs",
      "Gubukan 2 pcs", "Meja penerima tamu 2 pcs", "Kotak amplop 2 pcs",
      "Semawar 2", "Kenceng 2", "Langseng 2",
    ],
    freeItems: [],
  },
  {
    id: "tenda-a", name: "Paket Tenda A", price: 19000000,
    tendaSize: "Tenda 200 m", panggung: "Panggung + pelaminan 6 m",
    grad: "linear-gradient(135deg,#00337A,#0041A3)",
    tag: "Tenda dan Dekorasi Only",
    features: [
      "Kursi pengantin 1 set (ready stok, tidak bisa pilih)",
      "Setting meja akad", "Full karpet",
      "Kursi Futura 150 pcs + cover",
      "Gazebo/Gate jalan", "Gapura masuk", "Welcome sign", "Stand box", "Mini garden",
      "Blower 3 pcs", "Rolltop 8 pcs",
      "Meja prasmanan 2 pcs", "Tempat nasi 2 pcs", "Termos nasi 2 pcs",
      "Alat makan (PSG) 250 pcs", "Toples kerupuk 2 pcs", "Wadah es buah 1 pcs",
      "Gubukan 2 pcs", "Meja penerima tamu 2 pcs", "Kotak amplop 2 pcs",
      "Semawar 2", "Kenceng 2", "Langseng 2",
    ],
    freeItems: [],
  },
];
 
const STATUS_META = {
  pending:   { label: "Menunggu Konfirmasi", color: C.amber, soft: C.amberSoft },
  confirmed: { label: "Terkonfirmasi",        color: C.green, soft: C.greenSoft },
  rejected:  { label: "Ditolak",              color: C.red,   soft: C.redSoft   },
};
 
const MONTHS_ID = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
const DAYS_ID = ["Min","Sen","Sel","Rab","Kam","Jum","Sab"];
 
/* ---------------------------------------------------------------------- */
/*  Helpers                                                                */
/* ---------------------------------------------------------------------- */
const pad = (n) => String(n).padStart(2, "0");
const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fmtIDR = (n) => "Rp " + n.toLocaleString("id-ID");
const fmtDateID = (iso) => {
  if (!iso) return "-";
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS_ID[m - 1]} ${y}`;
};
const genCode = () => {
  const t = new Date();
  return `TS-${pad(t.getDate())}${pad(t.getMonth() + 1)}${String(t.getFullYear()).slice(2)}-${Math.floor(1000 + Math.random() * 9000)}`;
};
const monthMatrix = (year, month) => {
  const first = new Date(year, month, 1);
  const startOffset = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
};
const savePct = (original, promo) => Math.round((1 - promo / original) * 100);
const todayISO = toISO(new Date());
const uuid = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2));
const fmtMonthYear = (myStr) => {
  if (!myStr || myStr === "all") return "Semua Bulan";
  const [y, m] = myStr.split("-").map(Number);
  return `${MONTHS_ID[m - 1]} ${y}`;
};
 
/* ---------------------------------------------------------------------- */
/*  Storage hook — fetch dari PHP API                                      */
/* ---------------------------------------------------------------------- */
function useBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Gagal memuat data dari server.");
      const data = await res.json();
      setBookings(data);
    } catch (e) {
      setError(e.message || "Gagal memuat data.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);
 
  useEffect(() => { load(); }, [load]);
 
  const addBooking = useCallback(async (b) => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(b),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal menyimpan booking.");
      }
      setBookings((prev) => [...prev, b]);
    } catch (e) {
      setError(e.message || "Gagal menyimpan booking.");
    }
  }, []);
 
  const updateBooking = useCallback(async (id, patch) => {
    try {
      const res = await fetch(`${API_URL}?id=${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal mengupdate booking.");
      }
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
    } catch (e) {
      setError(e.message || "Gagal mengupdate booking.");
    }
  }, []);
 
  const removeBooking = useCallback(async (id) => {
    try {
      const res = await fetch(`${API_URL}?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal menghapus booking.");
      }
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (e) {
      setError(e.message || "Gagal menghapus booking.");
    }
  }, []);
 
  return { bookings, loading, error, reload: load, addBooking, updateBooking, removeBooking };
}
 
/* ---------------------------------------------------------------------- */
/*  Storage hook — fetch transaksi dari PHP API                            */
/* ---------------------------------------------------------------------- */
function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [txLoading, setTxLoading] = useState(true);
  const [txError, setTxError] = useState(null);
 
  const loadTx = useCallback(async () => {
    setTxLoading(true);
    setTxError(null);
    try {
      const res = await fetch(API_TX_URL);
      if (!res.ok) throw new Error("Gagal memuat data keuangan.");
      const data = await res.json();
      setTransactions(data);
    } catch (e) {
      setTxError(e.message || "Gagal memuat data keuangan.");
      setTransactions([]);
    } finally {
      setTxLoading(false);
    }
  }, []);
 
  useEffect(() => { loadTx(); }, [loadTx]);
 
  const addTransaction = useCallback(async (tx) => {
    try {
      const res = await fetch(API_TX_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tx),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal mencatat transaksi.");
      }
      setTransactions((prev) => [tx, ...prev]);
    } catch (e) {
      setTxError(e.message || "Gagal mencatat transaksi.");
    }
  }, []);
 
  const removeTransaction = useCallback(async (id) => {
    try {
      const res = await fetch(`${API_TX_URL}?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal menghapus transaksi.");
      }
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      setTxError(e.message || "Gagal menghapus transaksi.");
    }
  }, []);
 
  return { transactions, txLoading, txError, reloadTx: loadTx, addTransaction, removeTransaction };
}
 
/* ---------------------------------------------------------------------- */
/*  Small UI atoms                                                         */
/* ---------------------------------------------------------------------- */
const Badge = ({ status }) => {
  const m = STATUS_META[status];
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-body font-semibold" style={{ backgroundColor: m.soft, color: m.color }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: m.color }} />
      {m.label}
    </span>
  );
};
 
const Button = ({ children, variant = "primary", className = "", style = {}, ...props }) => {
  const classMap = {
    primary: "effect-3d-btn",
    outline: "effect-3d-btn-ghost",
    ghost: "effect-3d-btn-ghost",
    danger: "effect-3d-btn-danger",
  };
  return (
    <button
      className={`font-display font-semibold text-sm px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 ${classMap[variant]} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
};
 
const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "12px",
  border: "none",
  backgroundColor: C.bg,
  color: C.ink,
  fontFamily: "Inter, sans-serif",
  fontSize: "14px",
  outline: "none",
};
 
const Field = ({ label, required, children }) => (
  <label className="block mb-4">
    <span className="block font-body text-sm font-semibold mb-1.5" style={{ color: C.ink }}>
      {label}{required && <span style={{ color: C.red }}> *</span>}
    </span>
    {children}
  </label>
);
 
/* ---------------------------------------------------------------------- */
/*  Top bar                                                                */
/* ---------------------------------------------------------------------- */
function TopBar({ title, subtitle, onBack, gradient = false, right, brandMode = false }) {
  return (
    <div
      className="px-4 sm:px-6 pt-5 pb-6 sm:rounded-b-3xl effect-3d-header relative overflow-hidden"
      style={{ background: gradient ? HEADER_GRAD : C.blueDeep }}
    >
      {/* Decorative floating elements */}
      {gradient && (
        <>
          <div style={{ position: 'absolute', top: 8, right: 30, opacity: 0.12, fontSize: 50, pointerEvents: 'none' }}>✿</div>
          <div style={{ position: 'absolute', bottom: 5, left: 40, opacity: 0.10, fontSize: 35, pointerEvents: 'none' }}>❀</div>
          <div style={{ position: 'absolute', top: 20, left: '50%', opacity: 0.08, fontSize: 60, pointerEvents: 'none' }}>✦</div>
        </>
      )}
      <div className="max-w-6xl mx-auto flex items-center gap-3 relative z-10">
        {onBack && (
          <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.18)" }}>
            <Icon name="ChevronLeft" size={20} color="#fff" />
          </button>
        )}
        <div className="flex-1">
          {brandMode ? (
            <h1 className="brand-3d-text font-display font-extrabold text-2xl sm:text-3xl leading-tight">{title}</h1>
          ) : (
            <h1 className="font-display font-bold text-lg sm:text-xl text-white leading-tight">{title}</h1>
          )}
          {subtitle && <p className="font-body text-xs sm:text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.9)" }}>{subtitle}</p>}
        </div>
        {right}
      </div>
    </div>
  );
}
 
/* ---------------------------------------------------------------------- */
/*  Calendar                                                               */
/* ---------------------------------------------------------------------- */
function Calendar({ bookings, showNames = false, selectable = false, selected, onSelect }) {
  const now = new Date();
  const [view, setView] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const weeks = useMemo(() => monthMatrix(view.y, view.m), [view]);
 
  const findBooking = (iso) => bookings.find((b) => b.date === iso && (b.status === "confirmed" || b.status === "pending"));
 
  const changeMonth = (delta) => {
    let m = view.m + delta, y = view.y;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setView({ y, m });
  };
 
  return (
    <div className="rounded-2xl p-4" style={{ backgroundColor: C.paper, border: `1px solid ${C.line}` }}>
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => changeMonth(-1)} className="p-1.5 rounded-lg" style={{ backgroundColor: C.bg, color: C.blueDeep }}><Icon name="ChevronLeft" size={16} /></button>
        <span className="font-display text-sm font-semibold" style={{ color: C.ink }}>{MONTHS_ID[view.m]} {view.y}</span>
        <button onClick={() => changeMonth(1)} className="p-1.5 rounded-lg" style={{ backgroundColor: C.bg, color: C.blueDeep }}><Icon name="ChevronRight" size={16} /></button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAYS_ID.map((d) => <div key={d} className="text-center font-body text-[10px] font-bold py-1" style={{ color: C.muted }}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {weeks.flat().map((date, i) => {
          if (!date) return <div key={i} />;
          const iso = toISO(date);
          const booked = findBooking(iso);
          const isPast = iso < todayISO;
          const isToday = iso === todayISO;
          const isSelected = selected === iso;
          const canPick = selectable && !booked && !isPast;
          let bg = "transparent", fg = C.ink, border = "1px solid transparent";
          if (booked) { const m = STATUS_META[booked.status]; bg = m.soft; fg = C.ink; }
          if (isPast) fg = "#B7BEC9";
          if (isToday) border = `1.5px solid ${C.blue}`;
          if (isSelected) { bg = BTN_GRAD; fg = "#fff"; }
          return (
            <button key={i} disabled={!canPick && selectable} onClick={() => canPick && onSelect(iso)}
              title={showNames && booked ? `${booked.groomName} & ${booked.brideName} — ${STATUS_META[booked.status].label}` : undefined}
              className="aspect-square rounded-lg text-xs font-body font-semibold flex flex-col items-center justify-center"
              style={{ background: isSelected ? BTN_GRAD : bg, color: fg, border, opacity: isPast && !booked ? 0.4 : 1, cursor: canPick ? "pointer" : "default" }}>
              {date.getDate()}
              {booked && !isSelected && <span className="w-1 h-1 rounded-full mt-0.5" style={{ backgroundColor: STATUS_META[booked.status].color }} />}
            </button>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-3 mt-3 pt-3" style={{ borderTop: `1px solid ${C.line}` }}>
        {Object.entries(STATUS_META).filter(([k]) => k !== "rejected").map(([k, m]) => (
          <div key={k} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
            <span className="font-body text-xs" style={{ color: C.muted }}>{m.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
 
/* ---------------------------------------------------------------------- */
/*  PIN Gate                                                                */
/* ---------------------------------------------------------------------- */
function PinGate({ role, pin, onSuccess, onCancel }) {
  const [value, setValue] = useState("");
  const [err, setErr] = useState(false);
  const label = role === "admin" ? "Admin" : "Owner";
  const submit = (e) => {
    e.preventDefault();
    if (value === pin) onSuccess(); else { setErr(true); setValue(""); }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(15,20,30,0.55)" }}>
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl p-6" style={{ backgroundColor: C.paper }}>
        <div className="flex items-center gap-2 mb-1"><Icon name="Lock" size={18} color={C.blueDeep} /><h3 className="font-display text-lg font-bold" style={{ color: C.ink }}>Masuk sebagai {label}</h3></div>
        <p className="font-body text-sm mb-4" style={{ color: C.muted }}>Masukkan PIN akses untuk melanjutkan.</p>
        <input autoFocus type="password" inputMode="numeric" value={value}
          onChange={(e) => { setValue(e.target.value); setErr(false); }}
          style={{ ...inputStyle, boxShadow: err ? `0 0 0 1.5px ${C.red}` : "none", letterSpacing: "0.3em", textAlign: "center", fontSize: "20px" }}
          placeholder="••••" maxLength={6} />
        {err && <p className="font-body text-xs mt-2" style={{ color: C.red }}>PIN salah. Coba lagi.</p>}
        <p className="font-mono text-[10px] mt-2" style={{ color: C.muted }}>PIN demo: {pin}</p>
        <div className="flex gap-2 mt-5">
          <Button variant="ghost" type="button" className="flex-1" onClick={onCancel}>Batal</Button>
          <Button variant="primary" type="submit" className="flex-1">Masuk</Button>
        </div>
      </form>
    </div>
  );
}
 
/* ---------------------------------------------------------------------- */
/*  Package list screen                                                    */
/* ---------------------------------------------------------------------- */
function PackageCard({ pkg, onSelect }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="rounded-2xl overflow-hidden effect-3d-card" style={{ backgroundColor: C.paper, border: `1px solid ${C.line}` }}>
      <div className="h-28 relative flex items-end p-4" style={{ background: pkg.grad }}>
        <span className="font-display text-white font-bold text-lg drop-shadow relative z-10">{pkg.name}</span>
        {pkg.tag && (
          <span className="absolute top-3 left-3 px-2 py-1 rounded-lg font-body text-[10px] font-bold z-10" style={{ backgroundColor: "rgba(255,255,255,0.92)", color: C.ink }}>
            {pkg.tag}
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-1.5 mb-1">
          <Icon name="Warehouse" size={13} color={C.blueDeep} />
          <span className="font-body text-xs font-semibold" style={{ color: C.blueDeep }}>{pkg.tendaSize}</span>
        </div>
        <div className="flex items-center gap-1 mb-3">
          <Icon name="LayoutPanelTop" size={13} color={C.muted} />
          <span className="font-body text-xs" style={{ color: C.muted }}>{pkg.panggung}</span>
        </div>
        <div className="font-display text-xl font-bold mb-3" style={{ color: C.orange }}>{fmtIDR(pkg.price)}</div>
 
        <button type="button" onClick={() => setExpanded((e) => !e)} className="font-body text-xs font-semibold flex items-center gap-1 mb-3" style={{ color: C.blueDeep }}>
          {expanded ? "Sembunyikan detail" : `Lihat ${pkg.features.length} fasilitas`}
          <Icon name={expanded ? "ChevronUp" : "ChevronDown"} size={13} />
        </button>
        {expanded && (
          <ul className="font-body text-xs space-y-1.5 mb-4">
            {pkg.features.map((f, i) => (
              <li key={i} className="flex items-start gap-1.5" style={{ color: C.ink }}>
                <Icon name="Check" size={12} color={C.green} className="mt-0.5" /> <span>{f}</span>
              </li>
            ))}
            {pkg.freeItems.length > 0 && (
              <>
                <li className="font-semibold pt-1" style={{ color: C.ink }}>Gratis:</li>
                {pkg.freeItems.map((f, i) => (
                  <li key={"free" + i} className="flex items-start gap-1.5" style={{ color: C.muted }}>
                    <Icon name="Gift" size={12} color={C.amber} className="mt-0.5" /> <span>{f}</span>
                  </li>
                ))}
              </>
            )}
          </ul>
        )}
        <Button variant="primary" className="w-full effect-3d-btn" onClick={() => onSelect(pkg)}>
          Pilih Paket Ini <Icon name="ArrowRight" size={15} />
        </Button>
      </div>
    </div>
  );
}
 
function PackageListScreen({ bookings, onSelectPackage, onOpenCalendar, onOpenCheck }) {
  return (
    <div>
      <TopBar
        gradient
        brandMode
        title="FLOWLIZS02 DECORATION"
        subtitle="✨ Sewa dekorasi pernikahan premium & aesthetic"
        right={
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.22)", boxShadow: '0 0 15px rgba(255,255,255,0.15)' }}>
            <Icon name="Sparkles" size={20} color="#fff" />
          </div>
        }
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-3">
        <div className="rounded-2xl p-2 flex gap-2 mb-5 effect-3d-card" style={{ backgroundColor: C.paper, border: `1px solid ${C.line}` }}>
          <Button variant="ghost" onClick={onOpenCalendar} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-body text-sm font-semibold effect-3d-btn-ghost" style={{ color: C.blueDeep }}>
            <Icon name="Calendar" size={15} /> Cek Kalender
          </Button>
          <Button variant="ghost" onClick={onOpenCheck} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-body text-sm font-semibold effect-3d-btn-ghost" style={{ color: C.ink }}>
            <Icon name="Search" size={15} /> Cek Status
          </Button>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-base font-bold" style={{ color: C.ink }}>Pilih Paket Dekorasi</h2>
          <span className="font-body text-xs" style={{ color: C.muted }}>{PACKAGES.length} paket tersedia</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PACKAGES.map((p) => <PackageCard key={p.id} pkg={p} onSelect={onSelectPackage} />)}
        </div>
      </div>
    </div>
  );
}
 
/* ---------------------------------------------------------------------- */
/*  Booking form screen                                                    */
/* ---------------------------------------------------------------------- */
function BookingFormScreen({ pkg, bookings, addBooking, onBack, onSubmitted }) {
  const [form, setForm] = useState({ groomName: "", brideName: "", whatsapp: "", address: "", guests: "", notes: "", date: "" });
  const [showCal, setShowCal] = useState(false);
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const valid = form.groomName && form.brideName && form.whatsapp && form.address && form.date;
 
  const submit = async (e) => {
    e.preventDefault();
    if (!valid) return;
    setSaving(true);
    const booking = {
      id: uuid(),
      code: genCode(), groomName: form.groomName.trim(), brideName: form.brideName.trim(),
      whatsapp: form.whatsapp.trim(), address: form.address.trim(), date: form.date, packageId: pkg.id, packageName: pkg.name,
      price: pkg.price, bookingPay: 2000000, pelunasan: 0, guests: form.guests, notes: form.notes.trim(),
      status: "pending", createdAt: new Date().toISOString(),
    };
    await addBooking(booking);
    setSaving(false);
    onSubmitted(booking);
  };
 
  return (
    <div>
      <TopBar gradient title="FORM RESERVASI" subtitle="Silahkan isi form dengan benar" onBack={onBack} />
      <div className="max-w-xl mx-auto px-4 sm:px-6 -mt-4 pb-10">
        <div className="rounded-2xl p-3 mb-4 flex items-center gap-3 effect-3d-card" style={{ backgroundColor: C.paper, border: `1px solid ${C.line}` }}>
          <div className="w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: pkg.grad }}>
            <Icon name="Warehouse" size={24} color="#fff" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display text-sm font-bold truncate" style={{ color: C.ink }}>{pkg.name}</p>
            <p className="font-body text-xs" style={{ color: C.muted }}>{pkg.tendaSize} · Harga Paket: {fmtIDR(pkg.price)}</p>
          </div>
          <div className="flex-shrink-0 text-right">
            <p className="font-body text-[10px]" style={{ color: C.muted }}>Biaya Booking (DP)</p>
            <p className="font-display text-sm font-bold" style={{ color: C.orange }}>Rp 2.000.000</p>
          </div>
        </div>
 
        <form onSubmit={submit} className="rounded-2xl p-5 effect-3d-card" style={{ backgroundColor: C.paper, border: `1px solid ${C.line}` }}>
          <Field label="Nama Mempelai Pria" required>
            <input style={inputStyle} value={form.groomName} onChange={set("groomName")} placeholder="Masukan nama mempelai pria" />
          </Field>
          <Field label="Nama Mempelai Wanita" required>
            <input style={inputStyle} value={form.brideName} onChange={set("brideName")} placeholder="Masukan nama mempelai wanita" />
          </Field>
          <Field label="No. WhatsApp" required>
            <input style={inputStyle} value={form.whatsapp} onChange={set("whatsapp")} placeholder="Masukan no. whatsapp aktif" />
          </Field>
          <Field label="Alamat Lengkap Acara" required>
            <textarea style={{ ...inputStyle, minHeight: 60, resize: "vertical" }} value={form.address} onChange={set("address")} placeholder="Masukan alamat lengkap lokasi acara" />
          </Field>
          <Field label="Estimasi Jumlah Tamu">
            <input style={inputStyle} value={form.guests} onChange={set("guests")} placeholder="Masukan estimasi tamu" />
          </Field>
          <Field label="Pilih Tanggal Acara" required>
            <button type="button" onClick={() => setShowCal((s) => !s)} className="w-full flex items-center justify-between" style={inputStyle}>
              <span style={{ color: form.date ? C.ink : "#9AA2AF" }}>{form.date ? fmtDateID(form.date) : "Klik kalender"}</span>
              <Icon name="Calendar" size={17} color={C.blueDeep} />
            </button>
            {showCal && (
              <div className="mt-2">
                <Calendar bookings={bookings} selectable selected={form.date} onSelect={(iso) => { setForm((f) => ({ ...f, date: iso })); setShowCal(false); }} />
              </div>
            )}
          </Field>
          <Field label="Catatan / Keluhan Tambahan">
            <textarea style={{ ...inputStyle, minHeight: 70, resize: "vertical" }} value={form.notes} onChange={set("notes")} placeholder="Lokasi, tema warna, kebutuhan khusus…" />
          </Field>
          <Button type="submit" disabled={!valid || saving} className="w-full mt-2 py-3.5 text-base tracking-wide uppercase effect-3d-btn">
            {saving ? "Menyimpan…" : "Lanjut Booking"}
          </Button>
        </form>
      </div>
    </div>
  );
}
 
/* ---------------------------------------------------------------------- */
/*  Confirmation screen                                                    */
/* ---------------------------------------------------------------------- */
function ConfirmationScreen({ booking, onDone }) {
  const waMsg = encodeURIComponent(
    `Halo Admin FLOWLIZS02 DECORATION, saya ingin konfirmasi pembayaran DP booking:\n\nKode: ${booking.code}\nMempelai: ${booking.groomName} & ${booking.brideName}\nTanggal: ${fmtDateID(booking.date)}\nAlamat: ${booking.address || '-'}\nPaket: ${booking.packageName}\nBiaya DP: Rp 2.000.000\n\nMohon info rekening & langkah selanjutnya. Terima kasih.`
  );
  return (
    <div>
      <TopBar gradient title="Booking Diterima" subtitle="Satu langkah lagi menuju tanggal Anda" />
      <div className="max-w-md mx-auto px-4 sm:px-6 -mt-4 pb-10">
        <div className="rounded-2xl p-6 text-center effect-3d-card" style={{ backgroundColor: C.paper, border: `1px solid ${C.line}` }}>
          <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: C.amberSoft }}>
            <Icon name="Clock" size={26} color={C.amber} />
          </div>
          <h3 className="font-display text-lg font-bold mb-1" style={{ color: C.ink }}>Menunggu Pembayaran DP</h3>
          <p className="font-body text-sm mb-4" style={{ color: C.muted }}>Tanggal Anda kami tahan sementara. Bayar DP sebesar Rp 2.000.000 via WhatsApp admin agar resmi terkonfirmasi.</p>
          <div className="rounded-xl p-4 text-left mb-5 font-body text-sm space-y-1.5" style={{ backgroundColor: C.bg }}>
            <div className="flex justify-between"><span style={{ color: C.muted }}>Kode Booking</span><span className="font-mono font-semibold">{booking.code}</span></div>
            <div className="flex justify-between"><span style={{ color: C.muted }}>Mempelai</span><span className="font-semibold text-right">{booking.groomName} & {booking.brideName}</span></div>
            <div className="flex justify-between"><span style={{ color: C.muted }}>Tanggal</span><span className="font-semibold">{fmtDateID(booking.date)}</span></div>
            <div className="flex justify-between"><span style={{ color: C.muted }}>Alamat</span><span className="font-semibold text-right truncate max-w-[180px]" title={booking.address}>{booking.address}</span></div>
            <div className="flex justify-between"><span style={{ color: C.muted }}>Paket</span><span className="font-semibold">{booking.packageName}</span></div>
            <div className="flex justify-between" style={{ borderTop: `1px dashed ${C.line}`, paddingTop: '8px', marginTop: '8px' }}>
              <span className="font-display font-bold text-base" style={{ color: C.ink }}>Bayar DP</span>
              <span className="font-display font-bold text-lg" style={{ color: C.orange }}>Rp 2.000.000</span>
            </div>
          </div>
          <a href={`https://wa.me/${ADMIN_WA}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full font-display font-bold text-sm px-4 py-3.5 rounded-xl mb-3 effect-3d-btn" style={{ backgroundColor: "#25D366", color: "#fff", border: "1px solid #128C7E" }}>
            <Icon name="MessageCircle" size={17} color="#fff" /> Bayar DP Rp 2.000.000 via WhatsApp
          </a>
          <button onClick={onDone} className="font-body text-sm underline mt-2 block w-full text-center" style={{ color: C.blueDeep }}>Simpan kode & kembali ke beranda</button>
        </div>
      </div>
    </div>
  );
}
 
/* ---------------------------------------------------------------------- */
/*  Calendar / Check screens (simple wrappers)                             */
/* ---------------------------------------------------------------------- */
function CalendarScreen({ bookings, onBack }) {
  return (
    <div>
      <TopBar gradient title="Kalender Ketersediaan" subtitle="Tanggal berwarna sudah tidak tersedia" onBack={onBack} />
      <div className="max-w-md mx-auto px-4 sm:px-6 -mt-4 pb-10">
        <Calendar bookings={bookings} />
      </div>
    </div>
  );
}
 
function StatusChecker({ bookings, onBack }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const search = (e) => {
    e.preventDefault();
    const q = query.trim().toLowerCase();
    if (!q) return setResults([]);
    setResults(bookings.filter((b) => b.code.toLowerCase() === q || b.whatsapp.replace(/\D/g, "").includes(q.replace(/\D/g, ""))));
  };
  return (
    <div>
      <TopBar gradient title="Cek Status Booking" subtitle="Gunakan kode booking atau nomor WhatsApp" onBack={onBack} />
      <div className="max-w-md mx-auto px-4 sm:px-6 -mt-4 pb-10">
        <div className="rounded-2xl p-5" style={{ backgroundColor: C.paper, border: `1px solid ${C.line}`, boxShadow: "0 4px 14px rgba(15,20,30,0.06)" }}>
          <form onSubmit={search} className="flex gap-2 mb-4">
            <input style={inputStyle} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Contoh: TS-190726-4821" />
            <Button variant="primary" type="submit"><Icon name="Search" size={16} color="#fff" /></Button>
          </form>
          {results && results.length === 0 && <p className="font-body text-sm" style={{ color: C.red }}>Tidak ditemukan. Periksa kembali kode atau nomor WhatsApp Anda.</p>}
          {results && results.length > 0 && (
            <div className="space-y-3">
              {results.map((b) => (
                <div key={b.id} className="rounded-xl p-4" style={{ backgroundColor: C.bg }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-semibold" style={{ color: C.muted }}>{b.code}</span>
                    <Badge status={b.status} />
                  </div>
                  <p className="font-body text-sm font-semibold">{b.groomName} & {b.brideName}</p>
                  <p className="font-body text-sm" style={{ color: C.muted }}>{fmtDateID(b.date)} · {b.packageName}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
 
/* ---------------------------------------------------------------------- */
/*  User flow controller                                                   */
/* ---------------------------------------------------------------------- */
function UserView({ bookings, addBooking }) {
  const [screen, setScreen] = useState("packages"); // packages | form | confirmation | calendar | check
  const [pkg, setPkg] = useState(null);
  const [lastBooking, setLastBooking] = useState(null);
 
  if (screen === "form" && pkg) {
    return <BookingFormScreen pkg={pkg} bookings={bookings} addBooking={addBooking}
      onBack={() => setScreen("packages")}
      onSubmitted={(b) => { setLastBooking(b); setScreen("confirmation"); }} />;
  }
  if (screen === "confirmation" && lastBooking) {
    return <ConfirmationScreen booking={lastBooking} onDone={() => setScreen("packages")} />;
  }
  if (screen === "calendar") return <CalendarScreen bookings={bookings} onBack={() => setScreen("packages")} />;
  if (screen === "check") return <StatusChecker bookings={bookings} onBack={() => setScreen("packages")} />;
 
  return (
    <PackageListScreen
      bookings={bookings}
      onSelectPackage={(p) => { setPkg(p); setScreen("form"); }}
      onOpenCalendar={() => setScreen("calendar")}
      onOpenCheck={() => setScreen("check")}
    />
  );
}
 
/* ---------------------------------------------------------------------- */
/*  Admin Booking Card with Inline Pelunasan Editor                       */
/* ---------------------------------------------------------------------- */
function AdminBookingCard({ b, updateBooking, removeBooking }) {
  const [pelunasanVal, setPelunasanVal] = useState(b.pelunasan || 0);
 
  const dp = b.bookingPay || 2000000;
  const total = b.price || 0;
  const currentPelunasan = b.pelunasan || 0;
  const sisa = total - dp - currentPelunasan;
  const isLunas = sisa <= 0;
 
  useEffect(() => {
    setPelunasanVal(b.pelunasan || 0);
  }, [b.pelunasan]);
 
  const handleSave = () => {
    updateBooking(b.id, { pelunasan: Number(pelunasanVal) });
  };
 
  return (
    <div className="rounded-2xl p-5 effect-3d-card" style={{ backgroundColor: C.paper, border: `1px solid ${C.line}` }}>
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs" style={{ color: C.muted }}>{b.code}</span>
            <Badge status={b.status} />
            {b.status === "confirmed" && (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${isLunas ? "bg-teal-100 text-teal-800" : "bg-amber-100 text-amber-800"}`}>
                {isLunas ? "LUNAS" : `Sisa Tagihan: ${fmtIDR(sisa)}`}
              </span>
            )}
          </div>
          <h3 className="font-display text-lg font-bold" style={{ color: C.ink }}>{b.groomName} & {b.brideName}</h3>
          <p className="font-body text-sm" style={{ color: C.ink }}>{fmtDateID(b.date)} · {b.packageName}</p>
          <p className="font-body text-xs mt-1.5" style={{ color: C.muted }}>
            WA: <a href={`https://wa.me/${b.whatsapp}`} target="_blank" rel="noopener noreferrer" className="underline hover:text-stone-900">{b.whatsapp || "-"}</a> {b.guests && `· ${b.guests} tamu`}
          </p>
          <p className="font-body text-xs mt-0.5" style={{ color: C.muted }}>
            Alamat: <span className="font-semibold text-stone-700">{b.address || "-"}</span>
          </p>
          {b.notes && <p className="font-body text-xs mt-1.5 italic" style={{ color: C.muted }}>"{b.notes}"</p>}
 
          {/* Financial Breakdown */}
          <div className="mt-3 pt-3 border-t border-dashed border-stone-200 flex flex-wrap gap-4 items-center text-xs font-body">
            <div>
              <span style={{ color: C.muted }}>Total Paket:</span>{" "}
              <strong className="text-stone-800">{fmtIDR(total)}</strong>
            </div>
            <div>
              <span style={{ color: C.muted }}>DP Booking:</span>{" "}
              <strong className="text-stone-800">{fmtIDR(dp)}</strong>
            </div>
            <div className="flex items-center gap-1.5">
              <span style={{ color: C.muted }}>Pelunasan:</span>{" "}
              {b.status === "confirmed" ? (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={pelunasanVal}
                    onChange={(e) => setPelunasanVal(e.target.value)}
                    className="px-2 py-1 rounded border border-stone-300 w-24 text-xs font-semibold text-stone-800"
                    placeholder="Pelunasan"
                  />
                  {Number(pelunasanVal) !== Number(b.pelunasan || 0) && (
                    <button onClick={handleSave} className="px-2 py-0.5 text-white bg-teal-600 rounded hover:bg-teal-700 font-bold text-[10px] shadow">
                      Simpan
                    </button>
                  )}
                </div>
              ) : (
                <strong className="text-stone-800">{fmtIDR(currentPelunasan)}</strong>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          {b.status === "pending" && (
            <>
              <Button variant="primary" className="effect-3d-btn" onClick={() => updateBooking(b.id, { status: "confirmed" })}><Icon name="CheckCircle2" size={15} color="#fff" /> ACC & Kunci Tanggal</Button>
              <Button variant="danger" className="effect-3d-btn-danger" onClick={() => updateBooking(b.id, { status: "rejected" })}><Icon name="XCircle" size={15} color="#fff" /> Tolak</Button>
            </>
          )}
          {b.status !== "pending" && <Button variant="ghost" className="effect-3d-btn-ghost text-stone-600 text-xs" onClick={() => updateBooking(b.id, { status: "pending" })}>Kembalikan ke Menunggu</Button>}
          <Button variant="danger" className="effect-3d-btn-danger" onClick={() => removeBooking(b.id)}><Icon name="Trash2" size={15} color="#fff" /></Button>
        </div>
      </div>
    </div>
  );
}
 
/* ---------------------------------------------------------------------- */
/*  Admin View                                                             */
/* ---------------------------------------------------------------------- */
function AdminView({ bookings, updateBooking, removeBooking, addBooking, reload, transactions, addTransaction, removeTransaction }) {
  const [filter, setFilter] = useState("all");
  const [manual, setManual] = useState(false);
  const [adminTab, setAdminTab] = useState("bookings"); // "bookings" | "finance"
  const [showTxModal, setShowTxModal] = useState(false);
 
  // Default to current month YYYY-MM
  const currentMonthISO = useMemo(() => new Date().toISOString().slice(0, 7), []);
  const [selectedMonth, setSelectedMonth] = useState(currentMonthISO);
 
  const filtered = bookings.filter((b) => filter === "all" || b.status === filter).sort((a, b) => (a.date < b.date ? 1 : -1));
  const counts = {
    all: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    rejected: bookings.filter((b) => b.status === "rejected").length,
  };
 
  const combinedLedger = useMemo(() => {
    const list = [];
    bookings.forEach((b) => {
      if (b.status === "confirmed") {
        const dp = b.bookingPay || 2000000;
        // DP Entry
        list.push({
          id: `booking-dp-${b.id}`,
          date: b.date,
          type: "pemasukan",
          amount: dp,
          description: `DP Booking: ${b.groomName} & ${b.brideName} (${b.packageName})`,
          isBooking: true,
          createdAt: b.createdAt,
        });
 
        // Pelunasan Entry if any
        if (b.pelunasan && b.pelunasan > 0) {
          list.push({
            id: `booking-pelunasan-${b.id}`,
            date: b.date,
            type: "pemasukan",
            amount: b.pelunasan,
            description: `Pelunasan Booking: ${b.groomName} & ${b.brideName} (${b.packageName})`,
            isBooking: true,
            createdAt: b.createdAt + "-pelunasan",
          });
        }
      }
    });
    transactions.forEach((t) => {
      list.push({
        id: t.id,
        date: t.date,
        type: t.type,
        amount: t.amount,
        description: t.description,
        isBooking: false,
        createdAt: t.createdAt,
      });
    });
    return list.sort((a, b) => {
      if (a.date !== b.date) return a.date < b.date ? 1 : -1;
      return a.createdAt < b.createdAt ? 1 : -1;
    });
  }, [bookings, transactions]);
 
  // Extract unique months from ledger
  const uniqueMonths = useMemo(() => {
    const months = new Set();
    combinedLedger.forEach((item) => {
      if (item.date) {
        months.add(item.date.slice(0, 7)); // "YYYY-MM"
      }
    });
    // Ensure current month is always in the list for filtering
    months.add(currentMonthISO);
    return Array.from(months).sort((a, b) => b.localeCompare(a));
  }, [combinedLedger, currentMonthISO]);
 
  // Filter ledger by selected month
  const filteredLedger = useMemo(() => {
    if (selectedMonth === "all") return combinedLedger;
    return combinedLedger.filter((item) => item.date && item.date.startsWith(selectedMonth));
  }, [combinedLedger, selectedMonth]);
 
  const financeSummary = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    filteredLedger.forEach((item) => {
      if (item.type === "pemasukan") totalIncome += item.amount;
      else totalExpense += item.amount;
    });
    return {
      income: totalIncome,
      expense: totalExpense,
      balance: totalIncome - totalExpense
    };
  }, [filteredLedger]);
 
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold" style={{ color: C.ink }}>Panel Admin</h2>
          <p className="font-body text-sm" style={{ color: C.muted }}>Kelola jadwal sewa tenda & keuangan operasional.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" className="effect-3d-btn-ghost" onClick={reload}><Icon name="RefreshCw" size={15} /> Muat Ulang</Button>
          {adminTab === "bookings" ? (
            <Button variant="primary" className="effect-3d-btn" onClick={() => setManual(true)}><Icon name="Plus" size={15} color="#fff" /> Booking Manual</Button>
          ) : (
            <Button variant="primary" className="effect-3d-btn" onClick={() => setShowTxModal(true)}><Icon name="Plus" size={15} color="#fff" /> Catat Kas</Button>
          )}
        </div>
      </div>
 
      {/* Tab Selector */}
      <div className="flex border-b" style={{ borderColor: C.line }}>
        <button onClick={() => setAdminTab("bookings")} className="px-4 py-2 font-display text-sm font-semibold border-b-2"
          style={{ borderColor: adminTab === "bookings" ? C.blueDeep : "transparent", color: adminTab === "bookings" ? C.blueDeep : C.muted }}>
          Data Booking
        </button>
        <button onClick={() => setAdminTab("finance")} className="px-4 py-2 font-display text-sm font-semibold border-b-2"
          style={{ borderColor: adminTab === "finance" ? C.blueDeep : "transparent", color: adminTab === "finance" ? C.blueDeep : C.muted }}>
          Buku Kas & Keuangan
        </button>
      </div>
 
      {adminTab === "bookings" ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[["all", "Semua"], ["pending", "Menunggu"], ["confirmed", "Terkonfirmasi"], ["rejected", "Ditolak"]].map(([k, l]) => (
              <button key={k} onClick={() => setFilter(k)} className="rounded-2xl p-4 text-left effect-3d-card" style={{ background: filter === k ? BTN_GRAD : C.paper, border: `1px solid ${C.line}` }}>
                <p className="font-body text-xs font-semibold mb-1" style={{ color: filter === k ? "rgba(255,255,255,0.85)" : C.muted }}>{l}</p>
                <p className="font-display text-2xl font-bold" style={{ color: filter === k ? "#fff" : C.ink }}>{counts[k]}</p>
              </button>
            ))}
          </div>
          <div className="grid lg:grid-cols-[1fr_320px] gap-6">
            <div className="space-y-3">
              {filtered.length === 0 && (
                <div className="rounded-2xl p-10 text-center effect-3d-card" style={{ backgroundColor: C.paper, border: `1px solid ${C.line}` }}>
                  <Icon name="ClipboardList" size={28} className="mx-auto mb-2" color={C.muted} />
                  <p className="font-body text-sm" style={{ color: C.muted }}>Belum ada booking pada kategori ini.</p>
                </div>
              )}
              {filtered.map((b) => (
                <AdminBookingCard
                  key={b.id}
                  b={b}
                  updateBooking={updateBooking}
                  removeBooking={removeBooking}
                />
              ))}
            </div>
            <div><Calendar bookings={bookings} showNames /></div>
          </div>
        </>
      ) : (
        /* UI Buku Kas & Keuangan */
        <>
          {/* Month Selector Filter Bar */}
          <div className="rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4" style={{ backgroundColor: C.paper, border: `1px solid ${C.line}` }}>
            <div className="flex items-center gap-2">
              <Icon name="Filter" size={16} color={C.blueDeep} />
              <span className="font-display font-bold text-sm" style={{ color: C.ink }}>Filter Buku Kas:</span>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              <button
                onClick={() => setSelectedMonth("all")}
                className="px-3.5 py-1.5 rounded-xl font-body text-xs font-bold border transition-all"
                style={{
                  background: selectedMonth === "all" ? BTN_GRAD : "transparent",
                  color: selectedMonth === "all" ? "#fff" : C.muted,
                  borderColor: selectedMonth === "all" ? "transparent" : C.line
                }}
              >
                Semua Bulan
              </button>
              {uniqueMonths.map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMonth(m)}
                  className="px-3.5 py-1.5 rounded-xl font-body text-xs font-bold border transition-all"
                  style={{
                    background: selectedMonth === m ? BTN_GRAD : "transparent",
                    color: selectedMonth === m ? "#fff" : C.muted,
                    borderColor: selectedMonth === m ? "transparent" : C.line
                  }}
                >
                  {fmtMonthYear(m)}
                </button>
              ))}
            </div>
          </div>
 
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl p-5" style={{ backgroundColor: C.paper, border: `1px solid ${C.line}` }}>
              <div className="flex items-center gap-2 mb-1">
                <Icon name="TrendingUp" size={18} color={C.green} />
                <p className="font-body text-xs font-semibold" style={{ color: C.muted }}>Pemasukan ({fmtMonthYear(selectedMonth)})</p>
              </div>
              <p className="font-display text-2xl font-bold" style={{ color: C.green }}>{fmtIDR(financeSummary.income)}</p>
            </div>
            <div className="rounded-2xl p-5" style={{ backgroundColor: C.paper, border: `1px solid ${C.line}` }}>
              <div className="flex items-center gap-2 mb-1">
                <Icon name="TrendingDown" size={18} color={C.red} />
                <p className="font-body text-xs font-semibold" style={{ color: C.muted }}>Pengeluaran ({fmtMonthYear(selectedMonth)})</p>
              </div>
              <p className="font-display text-2xl font-bold" style={{ color: C.red }}>{fmtIDR(financeSummary.expense)}</p>
            </div>
            <div className="rounded-2xl p-5" style={{ background: BTN_GRAD }}>
              <div className="flex items-center gap-2 mb-1">
                <Icon name="Wallet" size={18} color="#fff" />
                <p className="font-body text-xs font-semibold text-white opacity-85">Saldo Kas ({fmtMonthYear(selectedMonth)})</p>
              </div>
              <p className="font-display text-2xl font-bold text-white">{fmtIDR(financeSummary.balance)}</p>
            </div>
          </div>
 
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: C.paper, border: `1px solid ${C.line}` }}>
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: C.line }}>
              <h3 className="font-display font-bold text-sm" style={{ color: C.ink }}>Tabel Catatan Keuangan ({fmtMonthYear(selectedMonth)})</h3>
              <span className="font-body text-xs font-semibold" style={{ color: C.blueDeep }}>{filteredLedger.length} Transaksi</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-body text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b" style={{ borderColor: C.line }}>
                    <th className="px-5 py-3 font-semibold text-xs" style={{ color: C.muted }}>Tanggal</th>
                    <th className="px-5 py-3 font-semibold text-xs" style={{ color: C.muted }}>Keterangan</th>
                    <th className="px-5 py-3 font-semibold text-xs" style={{ color: C.muted }}>Jenis</th>
                    <th className="px-5 py-3 font-semibold text-xs text-right" style={{ color: C.muted }}>Jumlah</th>
                    <th className="px-5 py-3 font-semibold text-xs text-center" style={{ color: C.muted }}>Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: C.line }}>
                  {filteredLedger.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-5 py-8 text-center" style={{ color: C.muted }}>Belum ada catatan keuangan untuk periode ini.</td>
                    </tr>
                  ) : (
                    filteredLedger.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3.5 whitespace-nowrap">{fmtDateID(item.date)}</td>
                        <td className="px-5 py-3.5 max-w-xs sm:max-w-md truncate" title={item.description}>
                          {item.description}
                          {item.isBooking && <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700">Booking</span>}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          {item.type === "pemasukan" ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: C.greenSoft, color: C.green }}>Pemasukan</span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: C.redSoft, color: C.red }}>Pengeluaran</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap text-right font-mono font-bold" style={{ color: item.type === "pemasukan" ? C.green : C.red }}>
                          {item.type === "pemasukan" ? "+" : "-"}{fmtIDR(item.amount)}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap text-center">
                          {item.isBooking ? (
                            <span className="text-xs italic" style={{ color: C.muted }}>Otomatis (ACC)</span>
                          ) : (
                            <button onClick={() => removeTransaction(item.id)} className="p-1 rounded text-red-500 hover:bg-red-50 transition-colors" title="Hapus Catatan">
                              <Icon name="Trash2" size={14} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
 
      {manual && <ManualBookingModal onClose={() => setManual(false)} bookings={bookings} addBooking={addBooking} />}
      {showTxModal && <ManualTxModal onClose={() => setShowTxModal(false)} addTransaction={addTransaction} />}
    </div>
  );
}
 
function ManualTxModal({ onClose, addTransaction }) {
  const [form, setForm] = useState({ date: todayISO, type: "pengeluaran", amount: "", description: "" });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const valid = form.date && form.amount && form.description.trim();
 
  const submit = async (e) => {
    e.preventDefault();
    if (!valid) return;
    await addTransaction({
      id: uuid(),
      date: form.date,
      type: form.type,
      amount: parseInt(form.amount, 10),
      description: form.description.trim(),
      createdAt: new Date().toISOString(),
    });
    onClose();
  };
 
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(15,20,30,0.55)" }}>
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl p-6 effect-3d-card" style={{ backgroundColor: C.paper, border: `1px solid ${C.line}` }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-bold" style={{ color: C.ink }}>Catat Keuangan (Buku Kas)</h3>
          <button type="button" onClick={onClose}><Icon name="X" size={18} color={C.muted} /></button>
        </div>
        <Field label="Tanggal Transaksi" required>
          <input type="date" style={inputStyle} value={form.date} onChange={set("date")} />
        </Field>
        <Field label="Jenis Transaksi" required>
          <select style={inputStyle} value={form.type} onChange={set("type")}>
            <option value="pemasukan">Pemasukan (+)</option>
            <option value="pengeluaran">Pengeluaran (-)</option>
          </select>
        </Field>
        <Field label="Keterangan / Deskripsi" required>
          <input style={inputStyle} value={form.description} onChange={set("description")} placeholder="Contoh: Beli terpal tenda, Solar armada, crew fee" />
        </Field>
        <Field label="Jumlah Uang (Rp)" required>
          <input type="number" style={inputStyle} value={form.amount} onChange={set("amount")} placeholder="Contoh: 150000" />
        </Field>
        <Button type="submit" disabled={!valid} className="w-full mt-4 effect-3d-btn">Simpan Transaksi</Button>
      </form>
    </div>
  );
}
 
function ManualBookingModal({ onClose, bookings, addBooking }) {
  const [form, setForm] = useState({ groomName: "", brideName: "", whatsapp: "", address: "", package: PACKAGES[0].id, date: "", guests: "" });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const valid = form.groomName && form.brideName && form.address && form.date;
  const submit = async (e) => {
    e.preventDefault();
    if (!valid) return;
    const p = PACKAGES.find((x) => x.id === form.package);
    await addBooking({
      id: uuid(), code: genCode(),
      groomName: form.groomName, brideName: form.brideName, whatsapp: form.whatsapp, address: form.address, date: form.date,
      packageId: p.id, packageName: p.name, price: p.price, bookingPay: 2000000, pelunasan: 0, guests: form.guests,
      notes: "Booking dicatat manual oleh admin.", status: "confirmed", createdAt: new Date().toISOString(),
    });
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(15,20,30,0.55)" }}>
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl p-6 max-h-[90vh] overflow-y-auto effect-3d-card" style={{ backgroundColor: C.paper }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-bold" style={{ color: C.ink }}>Booking Manual</h3>
          <button type="button" onClick={onClose}><Icon name="X" size={18} color={C.muted} /></button>
        </div>
        <Field label="Nama Mempelai Pria" required><input style={inputStyle} value={form.groomName} onChange={set("groomName")} /></Field>
        <Field label="Nama Mempelai Wanita" required><input style={inputStyle} value={form.brideName} onChange={set("brideName")} /></Field>
        <Field label="WhatsApp"><input style={inputStyle} value={form.whatsapp} onChange={set("whatsapp")} /></Field>
        <Field label="Alamat Lengkap Acara" required><textarea style={{ ...inputStyle, minHeight: 60, resize: "vertical" }} value={form.address} onChange={set("address")} placeholder="Masukan alamat lengkap lokasi" /></Field>
        <Field label="Paket">
          <select style={inputStyle} value={form.package} onChange={set("package")}>
            {PACKAGES.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </Field>
        <Field label="Tanggal" required><Calendar bookings={bookings} selectable selected={form.date} onSelect={(iso) => setForm((f) => ({ ...f, date: iso }))} /></Field>
        <Button type="submit" disabled={!valid} className="w-full mt-2 effect-3d-btn">Simpan sebagai Terkonfirmasi</Button>
      </form>
    </div>
  );
}
 
/* ---------------------------------------------------------------------- */
/*  Owner View                                                             */
/* ---------------------------------------------------------------------- */
function OwnerView({ bookings, reload, transactions }) {
  const confirmed = bookings.filter((b) => b.status === "confirmed");
  const byMonth = useMemo(() => {
    const map = {};
    confirmed.forEach((b) => { const key = b.date.slice(0, 7); map[key] = (map[key] || 0) + 1; });
    return Object.entries(map).sort().map(([k, v]) => { const [y, m] = k.split("-"); return { bulan: `${MONTHS_ID[Number(m) - 1].slice(0, 3)} ${y.slice(2)}`, jumlah: v }; });
  }, [confirmed]);
  const byPackage = useMemo(() => PACKAGES.map((p) => ({ name: p.name, value: confirmed.filter((b) => b.packageId === p.id).length })).filter((p) => p.value > 0), [confirmed]);
  const pieColors = [C.blue, C.orange, C.green, C.blueDeep, C.amber, C.red];
 
  // Default to current month YYYY-MM
  const currentMonthISO = useMemo(() => new Date().toISOString().slice(0, 7), []);
  const [selectedMonth, setSelectedMonth] = useState(currentMonthISO);
 
  const combinedLedger = useMemo(() => {
    const list = [];
    bookings.forEach((b) => {
      if (b.status === "confirmed") {
        const dp = b.bookingPay || 2000000;
        // DP Entry
        list.push({
          id: `booking-dp-${b.id}`,
          date: b.date,
          type: "pemasukan",
          amount: dp,
          description: `DP Booking: ${b.groomName} & ${b.brideName} (${b.packageName})`,
          isBooking: true,
          createdAt: b.createdAt,
        });
 
        // Pelunasan Entry if any
        if (b.pelunasan && b.pelunasan > 0) {
          list.push({
            id: `booking-pelunasan-${b.id}`,
            date: b.date,
            type: "pemasukan",
            amount: b.pelunasan,
            description: `Pelunasan Booking: ${b.groomName} & ${b.brideName} (${b.packageName})`,
            isBooking: true,
            createdAt: b.createdAt + "-pelunasan",
          });
        }
      }
    });
    transactions.forEach((t) => {
      list.push({
        id: t.id,
        date: t.date,
        type: t.type,
        amount: t.amount,
        description: t.description,
        isBooking: false,
        createdAt: t.createdAt,
      });
    });
    return list.sort((a, b) => {
      if (a.date !== b.date) return a.date < b.date ? 1 : -1;
      return a.createdAt < b.createdAt ? 1 : -1;
    });
  }, [bookings, transactions]);
 
  // Extract unique months from ledger
  const uniqueMonths = useMemo(() => {
    const months = new Set();
    combinedLedger.forEach((item) => {
      if (item.date) {
        months.add(item.date.slice(0, 7)); // "YYYY-MM"
      }
    });
    months.add(currentMonthISO);
    return Array.from(months).sort((a, b) => b.localeCompare(a));
  }, [combinedLedger, currentMonthISO]);
 
  // Filter ledger by selected month
  const filteredLedger = useMemo(() => {
    if (selectedMonth === "all") return combinedLedger;
    return combinedLedger.filter((item) => item.date && item.date.startsWith(selectedMonth));
  }, [combinedLedger, selectedMonth]);
 
  const financeSummary = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    filteredLedger.forEach((item) => {
      if (item.type === "pemasukan") totalIncome += item.amount;
      else totalExpense += item.amount;
    });
    return {
      income: totalIncome,
      expense: totalExpense,
      balance: totalIncome - totalExpense
    };
  }, [filteredLedger]);
 
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold" style={{ color: C.ink }}>Laporan Owner</h2>
          <p className="font-body text-sm" style={{ color: C.muted }}>Ringkasan performa booking & audit buku kas.</p>
        </div>
        <Button variant="ghost" onClick={reload}><Icon name="RefreshCw" size={15} /> Muat Ulang</Button>
      </div>
 
      {/* Month Selector Filter Bar */}
      <div className="rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4" style={{ backgroundColor: C.paper, border: `1px solid ${C.line}` }}>
        <div className="flex items-center gap-2">
          <Icon name="Filter" size={16} color={C.blueDeep} />
          <span className="font-display font-bold text-sm" style={{ color: C.ink }}>Filter Laporan Bulanan:</span>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setSelectedMonth("all")}
            className="px-3.5 py-1.5 rounded-xl font-body text-xs font-bold border transition-all"
            style={{
              background: selectedMonth === "all" ? BTN_GRAD : "transparent",
              color: selectedMonth === "all" ? "#fff" : C.muted,
              borderColor: selectedMonth === "all" ? "transparent" : C.line
            }}
          >
            Semua Bulan
          </button>
          {uniqueMonths.map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMonth(m)}
              className="px-3.5 py-1.5 rounded-xl font-body text-xs font-bold border transition-all"
              style={{
                background: selectedMonth === m ? BTN_GRAD : "transparent",
                color: selectedMonth === m ? "#fff" : C.muted,
                borderColor: selectedMonth === m ? "transparent" : C.line
              }}
            >
              {fmtMonthYear(m)}
            </button>
          ))}
        </div>
      </div>
 
      {/* Keuangan Cards */}
      <div className="grid sm:grid-cols-4 gap-4">
        <div className="rounded-2xl p-5" style={{ background: BTN_GRAD }}>
          <Icon name="TrendingUp" size={18} color="#fff" className="mb-2" />
          <p className="font-body text-xs mb-1" style={{ color: "rgba(255,255,255,0.85)" }}>Total Pemasukan ({fmtMonthYear(selectedMonth)})</p>
          <p className="font-display text-2xl font-bold text-white">{fmtIDR(financeSummary.income)}</p>
        </div>
        <div className="rounded-2xl p-5" style={{ backgroundColor: C.paper, border: `1px solid ${C.line}` }}>
          <Icon name="TrendingDown" size={18} color={C.red} className="mb-2" />
          <p className="font-body text-xs mb-1" style={{ color: C.muted }}>Total Pengeluaran ({fmtMonthYear(selectedMonth)})</p>
          <p className="font-display text-2xl font-bold" style={{ color: C.red }}>{fmtIDR(financeSummary.expense)}</p>
        </div>
        <div className="rounded-2xl p-5" style={{ backgroundColor: C.paper, border: `1px solid ${C.line}` }}>
          <Icon name="Wallet" size={18} color={C.green} className="mb-2" />
          <p className="font-body text-xs mb-1" style={{ color: C.muted }}>Laba Bersih ({fmtMonthYear(selectedMonth)})</p>
          <p className="font-display text-2xl font-bold" style={{ color: C.green }}>{fmtIDR(financeSummary.balance)}</p>
        </div>
        <div className="rounded-2xl p-5" style={{ backgroundColor: C.paper, border: `1px solid ${C.line}` }}>
          <Icon name="CheckCircle2" size={18} color={C.blueDeep} className="mb-2" />
          <p className="font-body text-xs mb-1" style={{ color: C.muted }}>Booking Terkonfirmasi (Semua)</p>
          <p className="font-display text-2xl font-bold" style={{ color: C.ink }}>{confirmed.length}</p>
        </div>
      </div>
 
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-2xl p-5" style={{ backgroundColor: C.paper, border: `1px solid ${C.line}` }}>
          <h3 className="font-display text-base font-bold mb-4" style={{ color: C.ink }}>Booking per Bulan</h3>
          {byMonth.length === 0 ? <p className="font-body text-sm" style={{ color: C.muted }}>Belum ada data.</p> : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={byMonth}>
                <CartesianGrid stroke={C.line} vertical={false} />
                <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: C.ink, fontFamily: "Inter" }} axisLine={{ stroke: C.line }} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: C.ink, fontFamily: "Inter" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: `1px solid ${C.line}`, fontFamily: "Inter", fontSize: 12 }} />
                <Bar dataKey="jumlah" fill={C.blue} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="rounded-2xl p-5" style={{ backgroundColor: C.paper, border: `1px solid ${C.line}` }}>
          <h3 className="font-display text-base font-bold mb-4 flex items-center gap-2" style={{ color: C.ink }}><Icon name="PieChart" size={16} /> Popularitas Paket</h3>
          {byPackage.length === 0 ? <p className="font-body text-sm" style={{ color: C.muted }}>Belum ada data.</p> : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={byPackage} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={3}>
                  {byPackage.map((_, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 12, fontFamily: "Inter" }} />
                <Tooltip contentStyle={{ borderRadius: 8, border: `1px solid ${C.line}`, fontFamily: "Inter", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
 
      {/* Tabel Catatan Keuangan Buku Kas (Read-Only) */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: C.paper, border: `1px solid ${C.line}` }}>
        <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: C.line }}>
          <h3 className="font-display font-bold text-sm" style={{ color: C.ink }}>Laporan Buku Kas ({fmtMonthYear(selectedMonth)})</h3>
          <span className="font-body text-xs font-semibold" style={{ color: C.blueDeep }}>Audit Keuangan</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-body text-sm">
            <thead>
              <tr className="bg-slate-50 border-b" style={{ borderColor: C.line }}>
                <th className="px-5 py-3 font-semibold text-xs" style={{ color: C.muted }}>Tanggal</th>
                <th className="px-5 py-3 font-semibold text-xs" style={{ color: C.muted }}>Keterangan</th>
                <th className="px-5 py-3 font-semibold text-xs" style={{ color: C.muted }}>Jenis</th>
                <th className="px-5 py-3 font-semibold text-xs text-right" style={{ color: C.muted }}>Jumlah</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: C.line }}>
              {filteredLedger.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-5 py-8 text-center" style={{ color: C.muted }}>Belum ada riwayat transaksi keuangan untuk periode ini.</td>
                </tr>
              ) : (
                filteredLedger.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 whitespace-nowrap">{fmtDateID(item.date)}</td>
                    <td className="px-5 py-3.5 max-w-xs sm:max-w-md truncate" title={item.description}>
                      {item.description}
                      {item.isBooking && <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700">Booking</span>}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {item.type === "pemasukan" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: C.greenSoft, color: C.green }}>Pemasukan</span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: C.redSoft, color: C.red }}>Pengeluaran</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-right font-mono font-bold" style={{ color: item.type === "pemasukan" ? C.green : C.red }}>
                      {item.type === "pemasukan" ? "+" : "-"}{fmtIDR(item.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
 
/* ---------------------------------------------------------------------- */
/*  App shell                                                              */
/* ---------------------------------------------------------------------- */
function App() {
  const [role, setRole] = useState("user");
  const [gate, setGate] = useState(null);
  const { bookings, loading, error, reload, addBooking, updateBooking, removeBooking } = useBookings();
  const { transactions, txLoading, txError, reloadTx, addTransaction, removeTransaction } = useTransactions();
 
  const requestRole = (r) => { if (r === "admin" || r === "owner") setGate(r); else setRole("user"); };
 
  const combinedError = error || txError;
  const isAppLoading = loading || txLoading;
 
  return (
    <div className="min-h-screen font-body" style={{ backgroundColor: C.bg, color: C.ink }}>
      {role !== "user" && (
        <div className="flex items-center justify-between px-4 sm:px-6 py-3" style={{ backgroundColor: C.paper, borderBottom: `1px solid ${C.line}` }}>
          <div className="flex items-center gap-2">
            <Icon name="ShieldCheck" size={16} color={C.blueDeep} />
            <span className="font-display text-sm font-bold">Mode {role === "admin" ? "Admin" : "Owner"}</span>
          </div>
          <button onClick={() => setRole("user")} className="font-body text-xs flex items-center gap-1.5" style={{ color: C.muted }}><Icon name="LogOut" size={13} /> Keluar</button>
        </div>
      )}
 
      <div className="fixed bottom-4 right-4 z-30 flex gap-1.5 rounded-full p-1 shadow-lg" style={{ backgroundColor: C.paper, border: `1px solid ${C.line}` }}>
        {[["user", "User"], ["admin", "Admin"], ["owner", "Owner"]].map(([r, l]) => (
          <button key={r} onClick={() => requestRole(r)} className="font-body text-[11px] font-bold px-3 py-1.5 rounded-full"
            style={{ background: role === r ? BTN_GRAD : "transparent", color: role === r ? "#fff" : C.muted }}>
            {l}
          </button>
        ))}
      </div>
 
      {combinedError && <div className="rounded-xl p-3 m-4 font-body text-sm" style={{ backgroundColor: C.redSoft, color: C.red }}>{combinedError}</div>}
 
      {isAppLoading ? (
        <div className="py-24 text-center font-body text-sm" style={{ color: C.muted }}>Memuat data…</div>
      ) : role === "user" ? (
        <UserView bookings={bookings} addBooking={addBooking} />
      ) : role === "admin" ? (
        <AdminView
          bookings={bookings}
          updateBooking={updateBooking}
          removeBooking={removeBooking}
          addBooking={addBooking}
          reload={() => { reload(); reloadTx(); }}
          transactions={transactions}
          addTransaction={addTransaction}
          removeTransaction={removeTransaction}
        />
      ) : (
        <OwnerView
          bookings={bookings}
          reload={() => { reload(); reloadTx(); }}
          transactions={transactions}
        />
      )}
 
      <div className="h-16" />
 
      {gate && (
        <PinGate role={gate} pin={gate === "admin" ? ADMIN_PIN : OWNER_PIN}
          onSuccess={() => { setRole(gate); setGate(null); }} onCancel={() => setGate(null)} />
      )}
    </div>
  );
}
 
/* ---------------------------------------------------------------------- */
/*  Mount                                                                  */
/* ---------------------------------------------------------------------- */
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
