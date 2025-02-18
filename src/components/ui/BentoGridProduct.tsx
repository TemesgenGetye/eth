import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Blog {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
}

const blogs: Blog[] = [
  {
    id: 1,
    title: 'Downtown Dubai',
    description: "Home to the world's tallest tower and biggest mall",
    image:
      'https://images.unsplash.com/photo-1589371315231-096e33e8c55e?q=80&w=3024&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    link: '/',
  },
  {
    id: 2,
    title: 'The Palm Jumeirah',
    description: 'Live on the 8th wonder of the world. Enough said!',
    image:
      'https://images.unsplash.com/photo-1528702748617-c64d49f918af?q=80&w=2927&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    link: '/',
  },
  {
    id: 3,
    title: 'Business Bay',
    description: 'A centrally-located district adorning the Dubai creek',
    image:
      'https://images.unsplash.com/photo-1554203576-3b7d50b086ee?q=80&w=3276&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    link: '/',
  },
  {
    id: 4,
    title: 'Dubai Silicon Oasis',
    description: 'A family-friendly suburb bursting with amenities',
    image:
      'https://plus.unsplash.com/premium_photo-1689596510917-d337f077d559?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    link: '/',
  },
  {
    id: 5,
    title: 'JLT Jumeirah Lake Towers',
    description: 'Walk freely among high rises overlooking lakes',
    image:
      'https://images.unsplash.com/photo-1667716757139-aa1d88d0b795?q=80&w=3024&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    link: '/',
  },
];

export default function SolidBento() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="grid h-auto max-h-screen gap-4 p-4 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-3 ">
      {blogs.map((blog, index) => (
        <Link
          key={blog.id}
          to={blog.link}
          className={`group relative flex overflow-hidden rounded-2xl  bg-blue-50  transition-transform  duration-300 ease-in-out hover:scale-[1.02] ${
            index === 0
              ? 'md:col-span-2 md:row-span-2'
              : index === 1
                ? 'md:col-span-1 md:row-span-1'
                : 'md:col-span-1 md:row-span-1 lg:row-span-2'
          }`}
        >
          <img
            src={blog.image}
            alt={blog.title}
            className="object-cover transition-transform duration-300 group-hover:scale-110 group-hover:opacity-50"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="relative flex h-full w-full flex-col justify-end p-6 text-white ">
            <h2 className="mb-2 text-2xl font-bold leading-tight">
              {blog.title}
            </h2>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-0 bg-gradient-to-t from-blue-600/60 to-transparent transition-all duration-500 ease-out group-hover:h-full" />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="absolute inset-0 flex translate-y-4 transform flex-col justify-end p-4 text-white transition-transform duration-300 group-hover:translate-y-0">
            <h3 className="mb-1 text-xl font-semibold opacity-0 transition-opacity delay-100 duration-300 group-hover:opacity-100">
              {blog.title}
            </h3>

            <p className="text-sm text-gray-200 opacity-0 transition-opacity delay-200 duration-300 group-hover:opacity-100">
              {blog.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

// {blogs.map((blog, index) => (
//     <div
//       key={index}
//       className={`group relative overflow-hidden rounded-lg bg-blue-50 transition-transform duration-300 ease-in-out `}
//       onMouseEnter={() => setHoveredIndex(index)}
//       onMouseLeave={() => setHoveredIndex(null)}
//     >
//       <div className={`aspect-w-14 aspect-h-9 max-h-72 `}>
//         <img
//           src={blog.image || '/placeholder.svg'}
//           alt={blog.title}
//           className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
//         />
//         <div className="absolute inset-x-0 bottom-0 h-0 bg-gradient-to-t from-blue-600/60 to-transparent transition-all duration-500 ease-out group-hover:h-full" />

//         <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
//         <div className="absolute inset-0 flex translate-y-4 transform flex-col justify-end p-4 text-white transition-transform duration-300 group-hover:translate-y-0">
//           <h3 className="mb-1 text-xl font-semibold opacity-0 transition-opacity delay-100 duration-300 group-hover:opacity-100">
//             {blog.title}
//           </h3>
//           <p className="text-sm text-gray-200 opacity-0 transition-opacity delay-200 duration-300 group-hover:opacity-100">
//             {blog.description}
//           </p>
//         </div>
//       </div>
//     </div>
//   ))}
