// HuntGuideHub Homepage - Last updated by OpenClaw
import Link from 'next/link';
import { supabase } from '~/lib/supabase'; // Assuming you have configured the alias

interface Outfitter {
  id: string;
  name: string;
  tagline?: string;
  // Add other relevant fields here
}

async function getFeaturedOutfitters(): Promise<Outfitter[]> {
  const { data, error } = await supabase
    .from('outfitters')
    .select('id, name, tagline')
    .limit(10); // Limit to 10 featured outfitters

  if (error) {
    console.error('Error fetching featured outfitters:', error);
    return [];
  }
  return data ?? [];
}

export default async function HomePage() {
  const outfitters = await getFeaturedOutfitters();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-center text-bark font-sans">Featured Outfitters</h1>
      {outfitters.length === 0 ? (
        <p className="text-center text-gray-600">No outfitters found. Please add some to the database.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-grid-cols-3 gap-6 mt-8">
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
