import { supabase } from '~/lib/supabase'; // Assuming you have configured the alias

async function getOutfitter(id: string) {
  const { data, error } = await supabase
    .from('outfitters') // Replace with your actual table name
    .select('*')
    .eq('id', id)
    .single(); // Use .single() if you expect only one result

  if (error) {
    console.error('Error fetching outfitter:', error);
    return null;
  }
  return data;
}

export default async function OutfitterProfilePage({ params }: { params: { id: string } }) {
  const outfitter = await getOutfitter(params.id);

  if (!outfitter) {
    return <div className="container mx-auto px-4 py-8">Outfitter not found.</div>;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{outfitter.name}</h1>
      <p className="text-xl text-gray-700 mb-6">{outfitter.tagline}</p>

      {/* Display all outfitter data - adjust as needed */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Details</h2>
        <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">{JSON.stringify(outfitter, null, 2)}</pre>
      </div>
    </main>
  );
}
