import Link from 'next/link';

interface SpeciesCount {
  species_name: string;
  outfitter_count: number;
}

async function getSpeciesCounts(): Promise<SpeciesCount[]> {
  // Function to fetch species counts - assumes get_species_counts() function exists in Supabase
  const response = await fetch('/api/rpc/get_species_counts'); // Using a placeholder API route
  if (!response.ok) {
    console.error('Failed to fetch species counts');
    return [];
  }
  const data: SpeciesCount[] = await response.json();
  return data;
}

// Using a placeholder for demonstration, would ideally fetch from Supabase RPC
async function getSpeciesCountsPlaceholder(): Promise<SpeciesCount[]> {
  // Simulate fetching data from Supabase
  await new Promise(resolve => setTimeout(resolve, 50)); 
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

export default async function SpeciesListPage() {
  const speciesCounts = await getSpeciesCountsPlaceholder(); // Replace with getSpeciesCounts() when API route is set up

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-center text-bark font-sans gradient-text">Explore by Species</h1>
      {speciesCounts.length === 0 ? (
        <p className="text-center text-gray-600">No species data found. Please ensure the get_species_counts function is set up in Supabase.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {speciesCounts.map((species) => (
            <Link key={species.species_name} href={`/species/${species.species_name.toLowerCase().replace(/ /g, '-')}`} passHref>
              <div className="rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out bg-white border border-stone/20 hover:bg-mist/30 h-full flex flex-col justify-center items-center text-center">
                <h2 className="text-2xl font-semibold text-bark mb-2">{species.species_name}</h2>
                
                <p className="text-amber/70 text-lg font-medium">{species.outfitter_count} Outfitters</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

// Placeholder for gradient text style
const gradientTextStyle = {
  background: 'linear-gradient(to right, #c17f3b, #e8a84c)',
  WebkitBackgroundClip: 'text',
  color: 'transparent'
};
