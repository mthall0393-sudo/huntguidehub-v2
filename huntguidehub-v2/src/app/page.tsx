import Link from 'next/link';

async function getOutfitters() {
  // Placeholder for fetching data from Supabase
  // Replace with actual Supabase query
  await new Promise(resolve => setTimeout(resolve, 50)); // Simulate network delay

  // Mock data for now
  const mockOutfitters = [
    { id: '1', name: 'Rocky Mountain Guides', tagline: 'Adventure awaits!' },
    { id: '2', name: 'Teton Wilderness Expeditions', tagline: 'Explore the untamed' },
    { id: '3', name: 'Alaskan Big Game Hunts', tagline: 'The ultimate wilderness experience' },
  ];

  return mockOutfitters;
}

export default async function HomePage() {
  const outfitters = await getOutfitters();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Featured Outfitters</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {outfitters.map((outfitter) => (
          <Link key={outfitter.id} href={`/outfitter/${outfitter.id}`}>
            <div className="border rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
              <h2 className="text-2xl font-semibold mb-2">{outfitter.name}</h2>
              <p className="text-gray-600">{outfitter.tagline}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
