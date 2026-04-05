import Link from 'next/link';
import { supabase } from '~/lib/supabase';

interface Outfitter {
  id: string;
  name: string;
  tagline?: string;
  state?: string;
  state_full?: string;
  city?: string;
  species?: string[];
  rating?: number;
}

// Fetches outfitters by state, assuming 'state' column in Supabase is a string
async function getOutfittersByState(stateSlug: string): Promise<Outfitter[]> {
  // Convert slug back to a displayable state name for the query if needed,
  // but Supabase might store state abbreviations (e.g., 'WY') or full names.
  // For now, we'll assume the slug can be used directly or needs a lookup.
  // If your Supabase 'state' column stores full names (e.g., "Wyoming"), 
  // you'll need to map the slug to the full name.
  // If it stores abbreviations (e.g., "WY"), you'll need a mapping for that too.

  // TEMPORARY: Assuming stateSlug might be a full name like 'wyoming' that needs to match 'Wyoming' or 'WY' in DB.
  // For this example, let's assume the DB stores full state names and we need to match the title-cased version.
  
  const stateNameForDisplay = slugToName(stateSlug); // e.g., "Wyoming"

  // IMPORTANT: Adjust the query based on your Supabase 'state' column's data.
  // Option 1: If Supabase stores full names (e.g., "Wyoming") and we query with full name:
  const { data: outfitters, error } = await supabase
    .from('outfitters')
    .select('id, name, tagline, state, state_full, city, species, rating')
    .eq('state_full', stateNameForDisplay) // Match with full state name
    .order('rating', { ascending: false });

  // Option 2: If Supabase stores state abbreviations (e.g., "WY") and we need to map.
  // This would require a mapping object { 'wyoming': 'WY', ... }
  // const stateAbbreviation = stateToAbbreviationMap[stateSlug] || stateSlug; // example
  // .eq('state', stateAbbreviation)

  // Option 3: If Supabase stores lowercase full names and we query with lowercase slug
  // .eq('state', stateSlug)

  if (error) {
    console.error(`Error fetching outfitters for state slug "${stateSlug}" (querying "${stateNameForDisplay}"):`, error);
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

export default async function StatePage({ params }: { params: { state: string } }) {
  const stateSlug = params.state; // e.g., "wyoming"
  const stateNameForDisplay = slugToName(stateSlug); // e.g., "Wyoming"
  
  const outfitters = await getOutfittersByState(stateSlug);

  const outfitterCount = outfitters.length;
  const pageTitle = `${outfitterCount} ${stateNameForDisplay}${outfitterCount === 1 ? ' Outfitter' : ' Outfitters'} Found`;

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4 text-center text-bark font-sans gradient-text">{pageTitle}</h1>
      {outfitters.length === 0 ? (
        <p className="text-center text-gray-600">No outfitters found for {stateNameForDisplay}. Please check the state name and ensure it matches your database.</p>
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
  color: 'transparent'
};
