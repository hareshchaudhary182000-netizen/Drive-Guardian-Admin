/**
 * Dummy data for the resource list pages (Feedback, Drivers, Partners,
 * Activity, Reports, Ads). The DASHBOARD still shows REAL data (it reads
 * Supabase directly); only these table views are mocked so no real user data
 * is exposed during demos.
 */

const iso = (daysAgo: number, hour = 10) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, Math.floor((daysAgo * 7) % 60), 0, 0);
  return d.toISOString();
};

const profiles = [
  { id: 'p1', name: 'Rahul Sharma', email: 'rahul.sharma@gmail.com', phone: '+91 98765 43210', role: 'Driver', member_since: iso(160) },
  { id: 'p2', name: 'Priya Patel', email: 'priya.patel@gmail.com', phone: '+91 99887 76655', role: 'Driver', member_since: iso(140) },
  { id: 'p3', name: 'Amit Verma', email: 'amit.verma@gmail.com', phone: '+91 91234 56780', role: 'Driver', member_since: iso(120) },
  { id: 'p4', name: 'Sneha Gupta', email: 'sneha.gupta@gmail.com', phone: '+91 90123 45678', role: 'Driver', member_since: iso(95) },
  { id: 'p5', name: 'Vikram Singh', email: 'vikram.singh@gmail.com', phone: '+91 98111 22334', role: 'Driver', member_since: iso(70) },
  { id: 'p6', name: 'Anjali Mehta', email: 'anjali.mehta@gmail.com', phone: '+91 97000 11223', role: 'Driver', member_since: iso(40) },
  { id: 'p7', name: 'Karan Joshi', email: 'karan.joshi@gmail.com', phone: '+91 96500 33445', role: 'Driver', member_since: iso(20) },
  { id: 'p8', name: 'Admin', email: 'admin@driveguardian.com', phone: '—', role: 'admin', member_since: iso(180) },
];

const partners = [
  { id: 'pa1', owner_id: 'p1', name: 'Suresh Sharma', email: 'suresh.sharma@gmail.com', phone: '+91 98765 00011', relation: 'Father', channels: ['Email', 'SMS'], created_at: iso(158) },
  { id: 'pa2', owner_id: 'p1', name: 'Meena Sharma', email: 'meena.sharma@gmail.com', phone: '+91 98765 00022', relation: 'Mother', channels: ['Email'], created_at: iso(157) },
  { id: 'pa3', owner_id: 'p2', name: 'Raj Patel', email: 'raj.patel@gmail.com', phone: '+91 99887 00033', relation: 'Spouse', channels: ['Email', 'SMS'], created_at: iso(139) },
  { id: 'pa4', owner_id: 'p3', name: 'Kiran Verma', email: 'kiran.verma@gmail.com', phone: '+91 91234 00044', relation: 'Brother', channels: ['SMS'], created_at: iso(118) },
  { id: 'pa5', owner_id: 'p4', name: 'Deepak Gupta', email: 'deepak.gupta@gmail.com', phone: '+91 90123 00055', relation: 'Father', channels: ['Email'], created_at: iso(94) },
  { id: 'pa6', owner_id: 'p5', name: 'Pooja Singh', email: 'pooja.singh@gmail.com', phone: '+91 98111 00066', relation: 'Sister', channels: ['Email', 'SMS'], created_at: iso(69) },
  { id: 'pa7', owner_id: 'p6', name: 'Ravi Mehta', email: 'ravi.mehta@gmail.com', phone: '+91 97000 00077', relation: 'Father', channels: ['Email'], created_at: iso(39) },
  { id: 'pa8', owner_id: 'p7', name: 'Nisha Joshi', email: 'nisha.joshi@gmail.com', phone: '+91 96500 00088', relation: 'Spouse', channels: ['SMS'], created_at: iso(18) },
];

const feedback = [
  { id: 'f1', user_id: 'p2', category: 'Suggest Feature', message: 'Please add a weekly summary email for partners.', rating: 5, created_at: iso(3) },
  { id: 'f2', user_id: 'p1', category: 'Report Issue', message: 'App crashed once when I opened the Reports tab.', rating: 3, created_at: iso(5) },
  { id: 'f3', user_id: 'p4', category: 'General', message: 'Love the safety score feature — keeps me accountable!', rating: 5, created_at: iso(7) },
  { id: 'f4', user_id: 'p3', category: 'Report Issue', message: 'GPS speed seems a little off on highways sometimes.', rating: 2, created_at: iso(9) },
  { id: 'f5', user_id: 'p5', category: 'Suggest Feature', message: 'Would love a dark mode in the app.', rating: 4, created_at: iso(12) },
  { id: 'f6', user_id: 'p6', category: 'General', message: 'Great app, very helpful for new drivers.', rating: 5, created_at: iso(16) },
  { id: 'f7', user_id: 'p7', category: 'Suggest Feature', message: 'Add a streak/reward system for safe driving.', rating: 4, created_at: iso(20) },
];

const EVENTS = ['message_sent', 'message_opened', 'call_answered', 'call_rejected', 'call_missed', 'call_outgoing'];
const driverIds = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'];

const activity_logs = Array.from({ length: 36 }, (_, i) => {
  const type = EVENTS[i % EVENTS.length];
  const speed = [0, 8, 22, 35, 48, 12][i % 6];
  return {
    id: `a${i + 1}`,
    user_id: driverIds[i % driverIds.length],
    event_type: type,
    speed,
    is_risk: speed >= 15 && type !== 'call_missed',
    occurred_at: iso(i % 12, 9 + (i % 10)),
  };
});

const REPORT_TYPES = [
  { type: 'Hourly', period: 'Today · 5 PM–6 PM' },
  { type: 'Daily', period: 'Today' },
  { type: 'Weekly', period: 'This Week' },
];

const reports = Array.from({ length: 14 }, (_, i) => {
  const t = REPORT_TYPES[i % REPORT_TYPES.length];
  const events = [0, 2, 6, 10, 1, 0, 4][i % 7];
  return {
    id: `r${i + 1}`,
    user_id: driverIds[i % driverIds.length],
    type: t.type,
    title: `${t.type} Report`,
    period: t.period,
    score: Math.max(0, 100 - events * 6),
    events,
    created_at: iso(i % 10, 6 + (i % 12)),
  };
});

const ads = [
  { id: 'ad1', title: 'Safe Drive Insurance — 20% Off', body: 'Trusted by 50,000+ drivers. Get a free quote in 2 minutes.', image_url: 'https://picsum.photos/seed/insurance/200/200', cta_label: 'Get quote', cta_url: 'https://example.com', active: true, created_at: iso(2) },
  { id: 'ad2', title: 'DashCam Pro — Limited Offer', body: 'Full HD dash cam with night vision. Free shipping this week.', image_url: 'https://picsum.photos/seed/dashcam/200/200', cta_label: 'Shop now', cta_url: 'https://example.com', active: true, created_at: iso(6) },
  { id: 'ad3', title: 'Roadside Assistance Plan', body: '24/7 help anywhere. First month free for DriveGuardian users.', image_url: 'https://picsum.photos/seed/roadside/200/200', cta_label: 'Learn more', cta_url: 'https://example.com', active: false, created_at: iso(11) },
];

export const mockData = {
  profiles,
  partners,
  feedback,
  activity_logs,
  reports,
  ads,
};
