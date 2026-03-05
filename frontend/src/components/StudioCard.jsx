// src/components/StudioCard.jsx
import { MapPinIcon, FilmIcon } from '@heroicons/react/24/outline';

// Fallback images per studio slug (Unsplash film/studio photos)
const STUDIO_IMAGES = {
  'tyler-perry-studios':   'https://images.unsplash.com/photo-1635859890085-ec38f2c5b1fb?w=600&q=80',
  'trilith-studios':       'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80',
  'assembly-studios-atlanta': 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&q=80',
  'eue-screen-gems-atlanta':  'https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=600&q=80',
  'atlanta-metro-studios': 'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=600&q=80',
  'third-rail-studios':    'https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=600&q=80',
};

const DEFAULT_IMG = 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=600&q=80';

const TYPE_COLORS = {
  'Major':           'bg-accent-red/20 text-accent-red border-accent-red/30',
  'Independent':     'bg-green-500/20  text-green-400  border-green-500/30',
  'Post-Production': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Animation':       'bg-blue-500/20   text-blue-400   border-blue-500/30',
};

export default function StudioCard({ studio }) {
  const img = studio.image || STUDIO_IMAGES[studio.slug] || DEFAULT_IMG;
  const tc  = TYPE_COLORS[studio.type] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  const allNotable = [
    ...(studio.notableFilms || []),
    ...(studio.notableShows || []),
  ].slice(0, 4);

  return (
    <div className="bg-cinema-card border border-cinema-border rounded-2xl overflow-hidden hover:border-cinema-border/60 transition-all group">

      {/* Photo */}
      <div className="relative h-48 overflow-hidden bg-cinema-card2">
        <img
          src={img}
          alt={studio.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { e.target.src = DEFAULT_IMG; }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-card via-transparent to-transparent" />

        {/* Type badge */}
        <span className={`absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full border font-medium backdrop-blur-sm ${tc}`}>
          {studio.type}
        </span>

        {/* Stat pills bottom-left */}
        <div className="absolute bottom-3 left-3 flex gap-2">
          {studio.stages && (
            <span className="bg-black/70 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm font-medium">
              {studio.stages} stages
            </span>
          )}
          {studio.acres && (
            <span className="bg-black/70 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm font-medium">
              {studio.acres} acres
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="text-white font-bold text-base mb-1 leading-snug">{studio.name}</h3>

        {/* Address */}
        {studio.address && (
          <div className="flex items-start gap-1.5 mb-2">
            <MapPinIcon className="w-3.5 h-3.5 text-accent-red mt-0.5 flex-shrink-0" />
            <p className="text-xs text-cinema-muted leading-snug">{studio.address}</p>
          </div>
        )}

        {/* Founded */}
        {studio.founded && (
          <p className="text-xs text-cinema-muted mb-2">Est. {studio.founded}</p>
        )}

        {/* Description */}
        {studio.description && (
          <p className="text-xs text-cinema-muted leading-relaxed line-clamp-3 mb-3">
            {studio.description}
          </p>
        )}

        {/* Notable productions */}
        {allNotable.length > 0 && (
          <div className="mt-3 pt-3 border-t border-cinema-border">
            <div className="flex items-center gap-1.5 mb-2">
              <FilmIcon className="w-3.5 h-3.5 text-accent-gold" />
              <span className="text-xs text-cinema-muted uppercase tracking-wider font-medium">Notable</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {allNotable.map(title => (
                <span key={title} className="text-xs bg-cinema-card2 border border-cinema-border text-cinema-text px-2 py-0.5 rounded-full truncate max-w-[160px]">
                  {title}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Website link */}
        {studio.website && (
          <a
            href={studio.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-xs text-accent-red hover:underline font-medium"
          >
            Visit Website →
          </a>
        )}
      </div>
    </div>
  );
}
