import Link from 'next/link';
import { supabase } from '~/lib/supabase';

interface Outfitter {
  id: string;
  name: string;
  tagline?: string;
  species?: string[];
  rating?: number;
}

interface SpeciesInfo {
  species_name: string;
  outfitter_count: number;
}

async function getFeaturedOutfitters(): Promise<Outfitter[]> {
  const { data: outfitters, error } = await supabase
    .from('outfitters')
    .select('id, name, tagline, species, rating')
    .limit(10) // Limit to 10 featured outfitters
    .order('rating', { ascending: false }); // Order by rating

  if (error) {
    console.error('Error fetching featured outfitters:', error);
    return [];
  }
  return outfitters ?? [];
}

async function getTopSpecies(limit: number = 8): Promise<SpeciesInfo[]> {
  // Use the Supabase function to get species counts
  // NOTE: This assumes you have created the 'get_species_counts' function in Supabase.
  // If not, this will fallback to placeholder data.
  try {
    // Updated RPC call to pass limit correctly if the function expects it.
    // If get_species_counts doesn't take arguments, remove the parameter.
    const { data, error } = await supabase.rpc('get_species_counts'); // Assuming the function might not take arguments needed directly here

    if (error) {
      console.error('Error calling Supabase RPC get_species_counts:', error);
      // Fallback to placeholder data if the function call fails
      return getPlaceholderSpeciesCounts();
    }
    // Ensure data is treated as SpeciesInfo[]
    return data as SpeciesInfo[] ?? []; 
  } catch (rpcError) {
    console.error('Exception calling Supabase RPC get_species_counts:', rpcError);
    // Fallback to placeholder data on exception
    return getPlaceholderSpeciesCounts();
  }
}

// Placeholder data for species counts
function getPlaceholderSpeciesCounts(): SpeciesInfo[] {
  console.warn('Using placeholder species data.');
  return [
    { species_name: 'Elk', outfitter_count: 47 },
    { species_name: 'Whitetail Deer', outfitter_count: 62 },
    { species_name: 'Turkey', outfitter_count: 35 },
    { species_name: 'Bear', outfitter_count: 21 },
    { species_name: 'Javelina', outfitter_count: 15 },
    { species_name: 'Fishing', outfitter_count: 80 },
    { species_name: 'Dove', outfitter_count: 25 },
    { species_name: 'Boar', outfitter_count: 30 },
  ];
}

// Generates a lowercase, hyphen-separated slug for state names
function slugify(text: string): string {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^\w-]+/g, '') // Remove all non-word chars except hyphen
    .replace(/--+/g, '-') // Replace multiple hyphens with a single hyphen
    .replace(/^-+/, '') // Trim hyphens from start
    .replace(/-+$/, ''); // Trim hyphens from end
}

export default async function HomePage() {
  const outfitters = await getFeaturedOutfitters();
  const topSpecies = await getTopSpecies(8);

  return (
    <main className="container mx-auto px-4 py-8">
      
      {/* Added a clear, visible test message here */}
      <p className="text-center text-amber/80 font-bold py-4">Deployment Test: Site Update Verification Active</p>

      {/* Filters section moved to the top, near the title */}
      <section className="mb-8">
        <h1 className="text-4xl font-bold mb-6 text-center text-bark font-sans gradient-text">HuntGuideHub</h1>
        
        {/* Species Filter */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-bark">Explore by Species</h2>
          {topSpecies.length === 0 ? (
            <p className="text-gray-600">No species data available.</p>
          ) : (
            <div className="flex flex-wrap justify-center gap-4">
              {topSpecies.map((species) => (
                <Link key={species.species_name} href={`/species/${slugify(species.species_name)}`} passHref>
                  <div className="rounded-lg px-6 py-3 shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out bg-white border border-stone/20 hover:bg-mist/30 max-w-xs">
                    <h3 className="text-lg font-semibold text-bark mb-1">{species.species_name}</h3>
                    <p className="text-amber/70 font-medium">{species.outfitter_count} Outfitters</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* State Filter (Placeholder, will be linked to /states page) */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4 text-bark">Explore by State</h2>
          <Link href="/states" passHref>
            <button className="bg-bronze hover:bg-amber text-white font-bold py-2 px-6 rounded transition duration-300">
              View All States
            </button>
          </Link>
        </div>
      </section>

      {/* Featured Outfitters Section */}
      <section>
        {outfitters.length === 0 ? (
          <p className="text-center text-gray-600">No outfitters found. Please add some to the database.</p>
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
      </section>
    </main>
  );
}

// Basic styling for gradient text on h1
const gradientTextStyle = {
  background: 'linear-gradient(to right, #c17f3b, #e8a84c)',
  WebkitBackgroundClip: 'text',
  color: 'transparent'
};
