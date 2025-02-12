export default function BrandFilter({ brands }: { brands: any[] }) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      {brands.map((brand) => (
        <a
          key={brand.name}
          href="#"
          className="rounded-full border bg-white px-4 py-1.5 text-sm text-blue-400 hover:bg-gray-50"
        >
          {brand.name} <span className="text-gray-600">({brand.count})</span>
        </a>
      ))}
      <a href="#" className="ml-5 text-sm text-blue-600 hover:underline">
        View More...
      </a>
    </div>
  );
}
