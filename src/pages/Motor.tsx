// import { ChevronDown } from 'lucide-react';
// import BrandFilter from '../components/Motor/BrandFilter';
// import CarListing from '../components/Motor/CarList';
// import SearchFilters from '../components/Motor/Searchfilter';
// import Pagination from '../components/Motor/Pagination';
// import { Outlet } from 'react-router-dom';

import { Outlet } from 'react-router-dom';

// const brands = [
//   { name: 'Mercedes-Benz', count: '4644' },
//   { name: 'BMW', count: '2017' },
//   { name: 'Nissan', count: '1952' },
//   { name: 'Land Rover', count: '1552' },
//   { name: 'Porsche', count: '1172' },
//   { name: 'Ford', count: '1144' },
//   { name: 'Audi', count: '916' },
// ];

export default function CarMarketplace() {
  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 py-4">
      <Outlet />
    </div>
  );
}
