import Link from 'next/link';
import { supabase } from '~/lib/supabase';

interface StateCount {
  state_name: string;
  outfitter_count: number;
}

async function getStateCounts(): Promise<StateCount[]> {
  // Supabase query to get unique states and their outfitter counts
  // This assumes a PostgreSQL function `get_state_counts()` exists in Supabase
  // or we can run a raw SQL query. For now, let's assume the function.
  // If the RPC function is not deployed, we'll use placeholder data.
  try {
    const { data, error } = await supabase.rpc('get_state_counts'); // Assuming the function takes no arguments or default ones

    if (error) {
      console.error('Error calling Supabase RPC get_state_counts:', error);
      return getPlaceholderStateCounts();
    }
    return data ?? [];
  } catch (rpcError) {
    console.error('Exception calling Supabase RPC get_state_counts:', rpcError);
    return getPlaceholderStateCounts();
  }
}

// Placeholder data for state counts
function getPlaceholderStateCounts(): StateCount[] {
  return [
    { state_name: 'Wyoming', outfitter_count: 55 },
    { state_name: 'Montana', outfitter_count: 68 },
    { state_name: 'Texas', outfitter_count: 92 },
    { state_name: 'Colorado', outfitter_count: 45 },
    { state_name: 'Alaska', outfitter_count: 73 },
    { state_name: 'Idaho', outfitter_count: 60 },
    { state_name: 'Utah', outfitter_count: 38 },
    { state_name: 'New Mexico', outfitter_count: 41 },
  ];
}

// Generates a lowercase, hyphen-separated slug for state names
function slugifyState(text: string): string {
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

export default async function StatesListPage() {
  const stateCounts = await getStateCounts();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-center text-bark font-sans gradient-text">Explore by State</h1>
      {stateCounts.length === 0 ? (
        <p className="text-center text-gray-600">No state data available. Please ensure the `get_state_counts` function in Supabase is set up correctly.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {stateCounts.map((state) => (
            <Link key={state.state_name} href={`/states/${slugifyState(state.state_name)}`} passHref>
              <div className="rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out bg-white border border-stone/20 hover:bg-mist/30 h-full flex flex-col justify-center items-center text-center">
                <h2 className="text-2xl font-semibold text-bark mb-2">{state.state_name}</h2>
                <p className="text-amber/70 font-medium">{state.outfitter_count} Outfitters</p>
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
