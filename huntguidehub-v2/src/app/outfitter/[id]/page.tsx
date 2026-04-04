import { supabase } from '~/lib/supabase';

interface Outfitter {
  id: string;
  name: string;
  tagline?: string;
  state?: string;
  state_full?: string;
  city?: string;
  website?: string;
  phone?: string;
  email?: string;
  species?: string[];
  price_starting?: number;
  price_notes?: string;
  trip_length?: string;
  group_size?: string;
  rating?: number;
  description?: string;
  highlights?: string[];
  // Add all other fields from your Supabase schema
}

async function getOutfitter(id: string): Promise<Outfitter | null> {
  const { data, error } = await supabase
    .from('outfitters')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching outfitter with ID ${id}:`, error);
    return null;
  }
  // Ensure data conforms to Outfitter interface, handling potential nulls
  return data ? {
    id: data.id,
    name: data.name || 'N/A',
    tagline: data.tagline,
    state: data.state,
    state_full: data.state_full,
    city: data.city,
    website: data.website,
    phone: data.phone,
    email: data.email,
    species: data.species || [],
    price_starting: data.price_starting ?? undefined,
    price_notes: data.price_notes,
    trip_length: data.trip_length,
    group_size: data.group_size,
    rating: data.rating ?? undefined,
    description: data.description,
    highlights: data.highlights || [],
  } : null;
}

export default async function OutfitterProfilePage({ params }: { params: { id: string } }) {
  const outfitter = await getOutfitter(params.id);

  if (!outfitter) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-600">Outfitter not found.</div>;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg p-8 border border-stone/20">
        <h1 className="text-4xl font-bold mb-4 text-bark font-sans">{outfitter.name}</h1>
        {outfitter.tagline && <p className="text-xl text-amber/70 mb-6 font-serif">{outfitter.tagline}</p>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-4 text-bark border-b pb-2">About</h2>
            {outfitter.description ? (
              <p className="text-gray-700 mb-6 whitespace-pre-wrap">{outfitter.description}</p>
            ) : (
              <p className="text-gray-500 italic">No description available.</p>
            )}

            {outfitter.highlights && outfitter.highlights.length > 0 && (
              <>
                <h2 className="text-2xl font-semibold mb-4 text-bark border-b pb-2">Highlights</h2>
                <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1">
                  {outfitter.highlights.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <div className="bg-mist/50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-bark border-b pb-2">Trip Details</h2>
            <ul className="space-y-3 text-gray-700">
              <li><strong>Location:</strong> {outfitter.city}, {outfitter.state_full ?? outfitter.state}</li>
              {outfitter.species && outfitter.species.length > 0 && (
                <li><strong>Species:</strong> {outfitter.species.join(', ')}</li>
              )}
              {outfitter.price_starting !== undefined && (
                <li><strong>Price Starting From:</strong> ${outfitter.price_starting.toLocaleString()} {outfitter.price_notes && `(${outfitter.price_notes})`}</li>
              )}
              {outfitter.trip_length && <li><strong>Trip Length:</strong> {outfitter.trip_length}</li>}
              {outfitter.group_size && <li><strong>Group Size:</strong> {outfitter.group_size}</li>}
              {outfitter.rating !== undefined && (
                <li><strong>Rating:</strong> {outfitter.rating}/5</li>
              )}
            </ul>

            <h2 className="text-2xl font-semibold my-4 text-bark border-b pb-2">Contact</h2>
            <ul className="space-y-3 text-gray-700">
              {outfitter.website && (
                <li><strong>Website:</strong> <a href={outfitter.website} target="_blank" rel="noopener noreferrer" className="text-bronze hover:underline">{outfitter.website.replace(/^https?:\/\//, '')}</a></li>
              )}
              {outfitter.phone && <li><strong>Phone:</strong> {outfitter.phone}</li>}
              {outfitter.email && <li><strong>Email:</strong> <a href={`mailto:${outfitter.email}`} className="text-bronze hover:underline">{outfitter.email}</a></li>}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
