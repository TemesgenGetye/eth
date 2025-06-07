import { useState } from 'react';

const areas = [
  {
    title: 'Downtown Dubai',
    description: "Home to the world's tallest tower and biggest mall",
    image:
      'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?q=80&w=3346&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    size: 'large',
  },
  {
    title: 'The Palm Jumeirah',
    description: 'Live on the 8th wonder of the world. Enough said!',
    image:
      'https://images.unsplash.com/photo-1470075801209-17f9ec0cada6?q=80&w=2912&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    title: 'Business Bay',
    description: 'A centrally-located district adorning the Dubai creek',
    image:
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&auto=format&fit=crop',
  },
  {
    title: 'Dubai Silicon Oasis',
    description: 'A family-friendly suburb bursting with amenities',
    image:
      'https://images.unsplash.com/photo-1494522358652-f30e61a60313?w=800&auto=format&fit=crop',
  },
  {
    title: 'JLT Jumeirah Lake Towers',
    description: 'Walk freely among high rises overlooking lakes',
    image:
      'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&auto=format&fit=crop',
  },
  {
    title: 'Dubai Marina',
    description: 'Vibrant waterfront community with amazing views',
    image:
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&auto=format&fit=crop',
    size: 'large',
  },
  {
    title: 'International City',
    description: 'An 800-hectare residential area inspired by countries',
    image:
      'https://images.unsplash.com/photo-1534008897995-27a23e859048?w=800&auto=format&fit=crop',
  },
  {
    title: 'Jumeirah Beach Residence',
    description: 'Live by the beach with stunning waterfront views',
    image:
      'https://images.unsplash.com/photo-1542361345-89e58247f2d5?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

export default function PopularAreas() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="mb-8">
      <h2 className="mb-6 text-2xl font-semibold">Popular Areas in Ethipia</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {areas.map((area, index) => (
          <div
            key={index}
            className={`group relative overflow-hidden rounded-lg bg-blue-50 transition-transform duration-300 ease-in-out ${
              area.size === 'large' ? 'md:col-span-2 md:row-span-2' : ''
            } ${hoveredIndex === index ? 'scale-[1.02]' : ''}`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div
              className={`aspect-w-14 aspect-h-9 max-h-72 ${area.size === 'large' ? 'md:aspect-h-12' : ''}`}
            >
              <img
                src={area.image || '/placeholder.svg'}
                alt={area.title}
                className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
              />
              <div className="absolute inset-x-0 bottom-0 h-0 bg-gradient-to-t from-blue-600/60 to-transparent transition-all duration-500 ease-out group-hover:h-full" />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute inset-0 flex translate-y-4 transform flex-col justify-end p-4 text-white transition-transform duration-300 group-hover:translate-y-0">
                <h3 className="mb-1 text-xl font-semibold opacity-0 transition-opacity delay-100 duration-300 group-hover:opacity-100">
                  {area.title}
                </h3>
                <p className="text-sm text-gray-200 opacity-0 transition-opacity delay-200 duration-300 group-hover:opacity-100">
                  {area.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
