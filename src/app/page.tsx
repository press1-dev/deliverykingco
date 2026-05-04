import CategorySection from "@/components/section/homepage/category";
import { HeroSection } from "@/components/section/homepage/hero";
import { getCategories, getProducts } from "@/lib/bigcommerce/api";

export default async function Home() {
  // Fetch data in parallel
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ first: 4 }), // Fetch first 4 products
  ]);

  return (
    // <div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    //   <main className="max-w-4xl mx-auto flex flex-col gap-12">
    //     <header className="text-center">
    //       <h1 className="text-4xl font-bold mb-4">DeliveryKingCo Store</h1>
    //       <p className="text-lg text-gray-600 dark:text-gray-300">
    //         A clean Next.js storefront pulling data directly from BigCommerce.
    //       </p>
    //     </header>

    //     <section>
    //       <h2 className="text-2xl font-semibold mb-6">Categories</h2>
    //       {categories.length > 0 ? (
    //         <div className="flex gap-4 flex-wrap">
    //           {categories.map((category) => (
    //             <div
    //               key={category.entityId}
    //               className="px-4 py-2 rounded-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900"
    //             >
    //               {category.name}
    //             </div>
    //           ))}
    //         </div>
    //       ) : (
    //         <p className="text-gray-500">No categories found or API error.</p>
    //       )}
    //     </section>

    //     <section>
    //       <h2 className="text-2xl font-semibold mb-6">Featured Products</h2>
    //       {products.length > 0 ? (
    //         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
    //           {products.map((product) => (
    //             <div
    //               key={product.entityId}
    //               className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 flex flex-col items-center text-center"
    //             >
    //               {product.defaultImage && (
    //                 <img
    //                   src={product.defaultImage.url}
    //                   alt={product.defaultImage.altText || product.name}
    //                   className="w-full h-48 object-cover rounded-md mb-4"
    //                 />
    //               )}
    //               <h3 className="font-semibold mb-2">{product.name}</h3>
    //               {product.prices && (
    //                 <p className="font-bold text-lg">
    //                   {product.prices.price.value} {product.prices.price.currencyCode}
    //                 </p>
    //               )}
    //             </div>
    //           ))}
    //         </div>
    //       ) : (
    //         <p className="text-gray-500">No products found or API error.</p>
    //       )}
    //     </section>

    //   </main>
    // </div>

    <main>
      <HeroSection />
      <CategorySection categories={categories} />
    </main>
  );
}
