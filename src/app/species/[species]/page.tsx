import Link from 'next/link';
import { supabase } from '~/lib/supabase';

interface Outfitter {
  id: string;
  name: string;
  tagline?: string;
  species?: string[];
  rating?: number;
}

async function getOutfittersBySpecies(speciesName: string): Promise<Outfitter[]> {
  const { data: outfitters, error } = await supabase
    .from('outfitters')
    .select('id, name, tagline, species, rating')
    .contains('species', [speciesName])
    .order('rating', { ascending: false });

  if (error) {
    console.error(`Error fetching outfitters for species ${speciesName}:`, error);
    return [];
  }
  return outfitters ?? [];
}

function capitalizeFirstLetter(string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function slugToName(slug: string): string {
  if (!slug) return '';
  return slug.split('-').map(capitalizeFirstLetter).join(' ');
}

export default async function SpeciesPage({ params }: { params: { species: string } }) {
  const speciesSlug = params.species;
  const speciesName = slugToName(speciesSlug);
  const outfitters = await getOutfittersBySpecies(speciesName);

  const outfitterCount = outfitters.length;
  const pageTitle = `${outfitterCount} ${speciesName}${outfitterCount === 1 ? ' Outfitter' : ' Outfitters'} Found`;

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4 text-center text-bark font-sans gradient-text">{pageTitle}</h1>
      {outfitters.length === 0 ? (
        <p className="text-center text-gray-600">No outfitters found for this species. Please check back later or broaden your search.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {outfitters.map((outfitter) => (
            <Link key={outfitter.id} href={`/outfitter/${outfitter.id}`} passHref>
              <div className="rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out bg-white border border-stone/20 hover:bg-mist/30 h-full flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-semibold mb-2 text-bark">{outfitter.name}</h2>
                  {outfitter.tagline && <p className="text-amber/70 mb-4">{outfitter.tagline}</p>}
                </div>
                <div className="mt-4">
                  <button className="w-full bg-bronze hover:bg-amber text-white font-bold py-2 px-4 rounded transition duration-300">
                    View Details
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

// Basic styling for gradient text on h1
const gradientTextStyle = {
  background: 'linear-gradient(to right, #c17f3b, #e8a84c)',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
};

// Component to render the gradient text style
const GradientText: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={gradientTextStyle}>{children}</span>
);

// Export GradientText for use in the page if needed, or apply style directly
export { GradientText };
