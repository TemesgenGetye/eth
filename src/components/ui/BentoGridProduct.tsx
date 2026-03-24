import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../Context/Languge';

interface Blog {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
}

export default function SolidBento() {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const blogs: Blog[] = [
    {
      id: 1,
      title: t('common.downtownDubai'),
      description: t('common.downtownDubaiDesc'),
      image:
        'https://images.unsplash.com/photo-1589371315231-096e33e8c55e?q=80&w=3024&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      link: '/',
    },
    {
      id: 2,
      title: t('common.palmJumeirah'),
      description: t('common.palmJumeirahDesc'),
      image:
        'https://images.unsplash.com/photo-1528702748617-c64d49f918af?q=80&w=2927&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      link: '/',
    },
    {
      id: 3,
      title: t('common.businessBay'),
      description: t('common.businessBayDesc'),
      image:
        'https://images.unsplash.com/photo-1554203576-3b7d50b086ee?q=80&w=3276&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      link: '/',
    },
    {
      id: 4,
      title: t('common.dubaiSiliconOasis'),
      description: t('common.dubaiSiliconOasisDesc'),
      image:
        'https://plus.unsplash.com/premium_photo-1689596510917-d337f077d559?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      link: '/',
    },
    {
      id: 5,
      title: t('common.jltJumeirahLakeTowers'),
      description: t('common.jltJumeirahLakeTowersDesc'),
      image:
        'https://images.unsplash.com/photo-1667716757139-aa1d88d0b795?q=80&w=3024&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      link: '/',
    },
  ];

  if (!mounted) return null;

  return (
    <div className="grid grid-cols-1 auto-rows-fr gap-3 px-3  sm:py-2 sm:gap-4 sm:px-4 sm:pt-3 pb-20 md:grid-cols-2 md:gap-4 lg:grid-cols-3 lg:grid-rows-3 lg:gap-4">
      {blogs.map((blog, index) => (
        <Link
          key={blog.id}
          to={blog.link}
          className={`group relative flex min-h-[200px] flex-col overflow-hidden rounded-xl bg-blue-50 transition-transform duration-300 ease-out hover:scale-[1.01] motion-reduce:transition-none motion-reduce:hover:scale-100 sm:min-h-[220px] sm:rounded-2xl md:min-h-[240px] ${
            index === 0
              ? 'md:col-span-2 md:row-span-2 md:min-h-[min(88vw,440px)] lg:min-h-[min(62vh,520px)]'
              : index === 1
                ? ''
                : 'lg:row-span-2 lg:min-h-[min(42vh,380px)]'
          }`}
        >
          <img
            src={blog.image}
            alt={blog.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:group-hover:scale-100"
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-blue-600/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:group-hover:opacity-0" />

          <div className="relative z-10 flex min-h-[inherit] flex-1 flex-col justify-end p-4 text-white sm:p-5 md:p-6">
            <h2 className="text-balance text-lg font-bold leading-tight sm:text-xl md:text-2xl">
              {blog.title}
            </h2>
            <p className="mt-2 max-w-prose text-pretty text-xs leading-snug text-gray-200 line-clamp-2 sm:line-clamp-3 sm:text-sm md:line-clamp-4">
              {blog.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
