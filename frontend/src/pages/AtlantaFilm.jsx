// src/pages/AtlantaFilm.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrophyIcon, BriefcaseIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';

import AwardBadge     from '../components/AwardBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import StudioCard     from '../components/StudioCard';

import { getStudios }     from '../services/studioAPI';
import { getProductions } from '../services/productionAPI';
import { getJobs }        from '../services/jobAPI';
import { tmdbImg }        from '../services/movieAPI';

const TABS = [
  { id: 'studios',     label: 'Studios',     icon: BuildingOffice2Icon },
  { id: 'productions', label: 'Productions', icon: TrophyIcon          },
  { id: 'jobs',        label: 'Jobs & Calls',icon: BriefcaseIcon       },
];

const AWARD_FILTERS = ['All', 'Emmy', 'Oscar', 'Golden Globe', 'SAG'];

const JOB_COLORS = {
  'Open Call':       'bg-green-500/20  text-green-400  border-green-500/30',
  'Acting':          'bg-blue-500/20   text-blue-400   border-blue-500/30',
  'Crew':            'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Post-Production': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Writing':         'bg-pink-500/20   text-pink-400   border-pink-500/30',
  'Internship':      'bg-teal-500/20   text-teal-400   border-teal-500/30',
  'Union':           'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
};

export default function AtlantaFilm() {
  const [tab,         setTab]         = useState('studios');
  const [studios,     setStudios]     = useState([]);
  const [productions, setProductions] = useState([]);
  const [jobs,        setJobs]        = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [awardFilter, setAwardFilter] = useState('All');
  const [jobFilter,   setJobFilter]   = useState('All');
  const [selJob,      setSelJob]      = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        // Three separate, independent requests — each has its own fallback
        const [studiosData, prodsData, jobsData] = await Promise.all([
          getStudios().catch(() => []),
          getProductions().catch(() => []),
          getJobs({ limit: 50 }).catch(() => ({})),
        ]);

        setStudios(Array.isArray(studiosData) ? studiosData : []);
        setProductions(Array.isArray(prodsData) ? prodsData : []);

        // Jobs endpoint returns { jobs: [], total, page, pages }
        const jobArr = jobsData?.jobs ?? jobsData;
        setJobs(Array.isArray(jobArr) ? jobArr : []);
      } catch (err) {
        console.error('ATL Hub load failed:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Derived state — always safe because arrays are initialised as []
  const filteredProds = awardFilter === 'All'
    ? productions
    : productions.filter(p => p.awards?.some(a => a.type === awardFilter));

  const filteredJobs = jobFilter === 'All'
    ? jobs
    : jobs.filter(j => j.category === jobFilter);

  const jobCategories = ['All', ...new Set(jobs.map(j => j.category))];

  const totalWins = productions.flatMap(p => p.awards || []).filter(a => a.status === 'Won').length;
  const totalNoms = productions.flatMap(p => p.awards || []).length;

  if (loading) return (
    <div className="flex justify-center mt-32">
      <LoadingSpinner />
    </div>
  );

  return (
    <div className="min-h-screen bg-cinema-bg pb-20">

      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="bg-gradient-to-b from-red-950/30 to-cinema-bg py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">🎬</span>
            <div>
              <h1 className="text-3xl font-bold text-white">Atlanta Film Hub</h1>
              <p className="text-cinema-muted mt-1 text-sm">
                Studios · Emmy &amp; Oscar Productions · Open Calls &amp; Jobs
              </p>
            </div>
          </div>

          {/* Stats strip */}
          <div className="flex gap-8 mt-5 flex-wrap">
            {[
              { label: 'Studios',      value: studios.length     },
              { label: 'Productions',  value: productions.length },
              { label: 'Job Listings', value: jobs.length        },
              { label: 'Award Wins',   value: totalWins          },
              { label: 'Nominations',  value: totalNoms          },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-bold text-accent-red">{value}</div>
                <div className="text-xs text-cinema-muted uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tabs ────────────────────────────────────────────────── */}
      <div className="sticky top-14 z-10 bg-cinema-bg/95 backdrop-blur border-b border-cinema-border">
        <div className="max-w-6xl mx-auto px-6 flex gap-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-2 transition-colors ${
                tab === id
                  ? 'border-accent-red text-white'
                  : 'border-transparent text-cinema-muted hover:text-cinema-text'
              }`}
            >
              <Icon className="w-4 h-4" />{label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ─────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 mt-8">
        <AnimatePresence mode="wait">

          {/* ── STUDIOS ──────────────────────────────────────────── */}
          {tab === 'studios' && (
            <motion.div
              key="studios"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {studios.length === 0 ? (
                <EmptyState icon="🏢" message="No studios loaded. Run npm run seed in /backend." />
              ) : (
                <>
                  <p className="text-cinema-muted text-sm mb-6">
                    {studios.length} major film production facilities in the Atlanta metro area
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {studios.map(studio => (
                      <StudioCard key={studio._id} studio={studio} />
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* ── PRODUCTIONS ──────────────────────────────────────── */}
          {tab === 'productions' && (
            <motion.div
              key="productions"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {/* Award filter pills */}
              <div className="flex gap-2 flex-wrap mb-6">
                {AWARD_FILTERS.map(f => (
                  <button
                    key={f}
                    onClick={() => setAwardFilter(f)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                      awardFilter === f
                        ? 'bg-accent-red border-accent-red text-white'
                        : 'bg-cinema-card border-cinema-border text-cinema-muted hover:text-white'
                    }`}
                  >{f}</button>
                ))}
              </div>

              {productions.length === 0 ? (
                <EmptyState icon="🏆" message="No productions loaded. Run npm run seed in /backend." />
              ) : filteredProds.length === 0 ? (
                <EmptyState icon="🔍" message={`No ${awardFilter} productions found.`} />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProds.map(prod => (
                    <ProductionCard key={prod._id} prod={prod} />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ── JOBS ─────────────────────────────────────────────── */}
          {tab === 'jobs' && (
            <motion.div
              key="jobs"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {/* Category filter */}
              <div className="flex gap-2 flex-wrap mb-6">
                {jobCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setJobFilter(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                      jobFilter === cat
                        ? 'bg-accent-red border-accent-red text-white'
                        : 'bg-cinema-card border-cinema-border text-cinema-muted hover:text-white'
                    }`}
                  >{cat}</button>
                ))}
              </div>

              {/* Featured open calls */}
              {jobFilter === 'All' && jobs.some(j => j.featured) && (
                <div className="mb-8">
                  <h2 className="text-sm font-semibold text-cinema-muted uppercase tracking-wider mb-3">
                    ⭐ Featured Open Calls
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {jobs.filter(j => j.featured).map(j => (
                      <JobCard key={j._id} job={j} onClick={() => setSelJob(j)} featured />
                    ))}
                  </div>
                </div>
              )}

              {jobs.length === 0 ? (
                <EmptyState icon="💼" message="No jobs loaded. Run npm run seed in /backend." />
              ) : filteredJobs.length === 0 ? (
                <EmptyState icon="🔍" message={`No listings in the "${jobFilter}" category.`} />
              ) : (
                <>
                  <h2 className="text-sm font-medium text-cinema-muted mb-4">
                    {filteredJobs.length} listing{filteredJobs.length !== 1 ? 's' : ''}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredJobs.map(j => (
                      <JobCard key={j._id} job={j} onClick={() => setSelJob(j)} />
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── Job Detail Modal ─────────────────────────────────────── */}
      <AnimatePresence>
        {selJob && <JobModal job={selJob} onClose={() => setSelJob(null)} />}
      </AnimatePresence>
    </div>
  );
}

// ── Empty State ──────────────────────────────────────────────────
function EmptyState({ icon, message }) {
  return (
    <div className="text-center py-20">
      <p className="text-5xl mb-4">{icon}</p>
      <p className="text-cinema-muted text-sm">{message}</p>
    </div>
  );
}

// ── Production Card ──────────────────────────────────────────────
function ProductionCard({ prod }) {
  const poster  = prod.poster ? tmdbImg(prod.poster, 'w342') : null;
  const wins    = (prod.awards || []).filter(a => a.status === 'Won').length;
  const awardTypes = [...new Set((prod.awards || []).map(a => a.type))].slice(0, 2);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-cinema-card border border-cinema-border rounded-xl overflow-hidden hover:border-cinema-border/60 transition-colors"
    >
      {/* Poster */}
      <div className="relative h-64 bg-cinema-card2">
        {poster
          ? <img src={poster} alt={prod.title} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-5xl">🎬</div>
        }
        {/* Award badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {awardTypes.map(t => <AwardBadge key={t} type={t} small />)}
        </div>
        {/* Wins pill */}
        {wins > 0 && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full">
            {wins} WON
          </div>
        )}
        {/* Type pill */}
        <div className="absolute bottom-2 left-2">
          <span className="bg-black/70 text-cinema-muted text-xs px-2 py-0.5 rounded backdrop-blur-sm">
            {prod.type}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-white mb-1 line-clamp-1">{prod.title}</h3>

        <div className="flex items-center gap-1.5 text-xs text-cinema-muted mb-1 flex-wrap">
          {prod.years   && <span>{prod.years}</span>}
          {prod.network && <><span>·</span><span>{prod.network}</span></>}
          {prod.independent && <span className="text-green-400">· Indie</span>}
        </div>

        {/* Genre */}
        <p className="text-xs text-cinema-muted mb-2">
          {Array.isArray(prod.genre) ? prod.genre.join(', ') : prod.genre}
        </p>

        {/* All awards */}
        {prod.awards?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {prod.awards.slice(0, 3).map((a, i) => (
              <AwardBadge key={i} type={a.type} status={a.status} small />
            ))}
            {prod.awards.length > 3 && (
              <span className="text-xs text-cinema-muted self-center">+{prod.awards.length - 3} more</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Job Card ─────────────────────────────────────────────────────
function JobCard({ job, onClick, featured = false }) {
  const c = JOB_COLORS[job.category] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      className={`w-full text-left p-5 rounded-xl border transition-all ${
        featured
          ? 'bg-red-950/20 border-accent-red/40 hover:border-accent-red'
          : 'bg-cinema-card border-cinema-border hover:border-cinema-border/60'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-semibold text-white text-sm leading-snug">{job.title}</h3>
        <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full border ${c}`}>
          {job.category}
        </span>
      </div>
      <p className="text-xs text-cinema-muted mb-2">{job.company} · {job.location}</p>
      <p className="text-xs text-cinema-muted line-clamp-2 mb-3">{job.description}</p>
      <div className="flex items-center gap-3 flex-wrap">
        {job.payRange   && <span className="text-xs text-green-400 font-medium">{job.payRange}</span>}
        {job.union      && <span className="text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded">Union</span>}
        {job.shootDates && <span className="text-xs text-cinema-muted">📅 {job.shootDates}</span>}
      </div>
    </motion.button>
  );
}

// ── Job Detail Modal ─────────────────────────────────────────────
function JobModal({ job, onClose }) {
  const c = JOB_COLORS[job.category] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end md:items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="bg-cinema-card border border-cinema-border rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className={`inline-block text-xs px-2 py-0.5 rounded-full border mb-2 ${c}`}>
                {job.category}
              </span>
              <h2 className="text-xl font-bold text-white">{job.title}</h2>
              <p className="text-cinema-muted text-sm mt-1">{job.company} · {job.location}</p>
            </div>
            <button onClick={onClose} className="text-cinema-muted hover:text-white text-2xl leading-none ml-4">×</button>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {job.payRange   && <span className="bg-green-900/30 text-green-400 border border-green-700/40 text-xs px-3 py-1 rounded-full">{job.payRange}</span>}
            {job.type       && <span className="bg-cinema-card2 text-cinema-muted border border-cinema-border text-xs px-3 py-1 rounded-full">{job.type}</span>}
            {job.union      && <span className="bg-yellow-900/30 text-yellow-400 border border-yellow-700/40 text-xs px-3 py-1 rounded-full">Union</span>}
            {job.remote     && <span className="bg-blue-900/30 text-blue-400 border border-blue-700/40 text-xs px-3 py-1 rounded-full">Remote OK</span>}
            {job.shootDates && <span className="bg-cinema-card2 text-cinema-muted border border-cinema-border text-xs px-3 py-1 rounded-full">📅 {job.shootDates}</span>}
          </div>

          <p className="text-cinema-text text-sm leading-relaxed mb-5">{job.description}</p>

          {job.requirements?.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs text-cinema-muted uppercase tracking-wider mb-2">Requirements</h4>
              <ul className="space-y-1">
                {job.requirements.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-cinema-text">
                    <span className="text-accent-red mt-0.5 flex-shrink-0">•</span>{r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {job.responsibilities?.length > 0 && (
            <div className="mb-5">
              <h4 className="text-xs text-cinema-muted uppercase tracking-wider mb-2">Responsibilities</h4>
              <ul className="space-y-1">
                {job.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-cinema-text">
                    <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>{r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Apply buttons */}
          <div className="flex gap-3 pt-4 border-t border-cinema-border">
            {job.applyUrl && (
              <a href={job.applyUrl} target="_blank" rel="noopener noreferrer"
                className="flex-1 bg-accent-red text-white text-center py-3 rounded-lg font-semibold text-sm hover:bg-red-700 transition-colors">
                Apply Now →
              </a>
            )}
            {job.applyEmail && (
              <a href={`mailto:${job.applyEmail}?subject=Application: ${job.title}`}
                className="flex-1 border border-accent-red text-accent-red text-center py-3 rounded-lg font-semibold text-sm hover:bg-red-950/30 transition-colors">
                Email Application
              </a>
            )}
          </div>
          {job.contactName && (
            <p className="text-xs text-cinema-muted text-center mt-2">Contact: {job.contactName}</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

