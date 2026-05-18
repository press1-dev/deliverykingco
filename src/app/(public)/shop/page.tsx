"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ShopProductCard } from "@/components/reusable/shop-product-card";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  AlertCircle,
  Search,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { clientApi } from "@/lib/bigcommerce/client-api";
import {
  ShopSkeleton,
  ShopSidebarSkeleton,
} from "@/components/reusable/shop-skeleton";

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Advanced Stateful Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const brandIdParam = searchParams.get("brand");
  const selectedBrand = useMemo(() => {
    return brandIdParam ? parseInt(brandIdParam) : null;
  }, [brandIdParam]);
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc">("newest");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  // Stateful Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Fetch Real Data from Live Storefront (First 50 products to get everything!)
  const {
    data: products,
    isLoading: productsLoading,
    isError: productsError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: () => clientApi.products.list({ first: 50 }),
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => clientApi.categories.list(),
  });

  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: () => clientApi.brands.list(),
  });

  // Flatten the category tree with depth tracking for nested visual layout
  const allFlattenedCategories = useMemo(() => {
    if (!categories) return [];
    type FlatCategory = typeof categories[0] & { depth: number };
    const flat: FlatCategory[] = [];
    const traverse = (cats: typeof categories, depth = 0) => {
      cats.forEach((cat) => {
        flat.push({ ...cat, depth });
        if (cat.children && cat.children.length > 0) {
          traverse(cat.children, depth + 1);
        }
      });
    };
    traverse(categories);
    return flat;
  }, [categories]);

  // Dynamic Count Helpers using Real Category Data
  const getCategoryCount = (catId: number) => {
    if (!products) return 0;
    return products.filter((p) => {
      const prodCatIds = p.categories?.edges?.map(edge => edge.node.entityId) || [];
      return prodCatIds.includes(catId);
    }).length;
  };

  const getBrandCount = (brandName: string) => {
    if (!products) return 0;
    return products.filter((p) => p.brand?.name?.toLowerCase() === brandName.toLowerCase()).length;
  };

  // State Change Handlers (with synchronous page resets to satisfy set-state-in-effect)
  const handleCategoryChange = (catId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
    setCurrentPage(1);
  };

  const handleBrandChange = (brandId: number) => {
    const params = new URLSearchParams(window.location.search);
    if (selectedBrand === brandId) {
      params.delete("brand");
    } else {
      params.set("brand", brandId.toString());
    }
    router.push(`/shop?${params.toString()}`);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleSortChange = (val: "newest" | "price-asc" | "price-desc") => {
    setSortBy(val);
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery !== "" || selectedCategories.length > 0 || selectedBrand !== null;

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    router.push("/shop");
    setSortBy("newest");
    setCurrentPage(1);
  };

  // Real-time Filtering Engine using REAL data
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let list = [...products];

    // 1. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand?.name?.toLowerCase().includes(q)
      );
    }

    // 2. Category Filter (Matches actual category entity IDs from live data)
    if (selectedCategories.length > 0) {
      list = list.filter((p) => {
        const prodCatIds = p.categories?.edges?.map(edge => edge.node.entityId) || [];
        return selectedCategories.some(catId => prodCatIds.includes(catId));
      });
    }

    // 3. Brand Filter
    if (selectedBrand !== null) {
      const brandObj = brands?.find((b) => b.entityId === selectedBrand);
      if (brandObj) {
        list = list.filter((p) => p.brand?.name?.toLowerCase() === brandObj.name.toLowerCase());
      }
    }

    // 4. Sorting
    if (sortBy === "price-asc") {
      list.sort((a, b) => (a.prices?.price.value || 0) - (b.prices?.price.value || 0));
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => (b.prices?.price.value || 0) - (a.prices?.price.value || 0));
    }

    return list;
  }, [products, searchQuery, selectedCategories, selectedBrand, sortBy, brands]);

  // Compute Pagination Pages
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  return (
    <div className="min-h-screen bg-black pb-20">
      {/* Shop Header */}
      <div className="border-b border-white/5 bg-[#080808] py-8">
        <div className="container mx-auto flex flex-col justify-between gap-6 px-6 lg:flex-row lg:items-center lg:px-12">
          <div>
            <h1 className="font-heading text-2xl font-black tracking-tighter text-white uppercase lg:text-3xl">
              Premium Shop
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-2.5 text-sm text-[#C4C9AC]">
              {productsLoading ? (
                <span>Fetching latest live arrivals...</span>
              ) : (
                <span>
                  Showing {filteredProducts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-
                  {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} results
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {hasActiveFilters && (
              <button 
                onClick={handleClearFilters}
                className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-xs font-black tracking-widest text-red-500 uppercase transition-all hover:bg-red-500/10 active:scale-[0.98] cursor-pointer"
              >
                <X size={12} />
                Reset Filters
              </button>
            )}

            <button 
              onClick={() => setIsMobileFiltersOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-white/5 lg:hidden"
            >
              <SlidersHorizontal size={14} />
              Filters
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                className="flex items-center gap-3 rounded-lg border border-white/10 bg-[#0A0A0A] px-4 py-2.5 transition-colors hover:border-white/20"
              >
                <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase">
                  Sort By:
                </span>
                <span className="text-xs font-bold text-white">
                  {sortBy === "newest" && "Newest Arrivals"}
                  {sortBy === "price-asc" && "Price: Low to High"}
                  {sortBy === "price-desc" && "Price: High to Low"}
                </span>
                <ChevronDown size={14} className={cn("text-white/40 transition-transform", isSortDropdownOpen && "rotate-180")} />
              </button>

              {isSortDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsSortDropdownOpen(false)}
                  />
                  <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-xl border border-white/10 bg-[#0A0A0A] shadow-2xl overflow-hidden">
                    <button
                      onClick={() => { handleSortChange("newest"); setIsSortDropdownOpen(false); }}
                      className={cn(
                        "w-full px-4 py-3 text-left text-xs font-bold uppercase transition-colors hover:bg-[#CCFF00] hover:text-black",
                        sortBy === "newest" ? "bg-white/5 text-[#CCFF00]" : "text-white"
                      )}
                    >
                      Newest Arrivals
                    </button>
                    <button
                      onClick={() => { handleSortChange("price-asc"); setIsSortDropdownOpen(false); }}
                      className={cn(
                        "w-full px-4 py-3 text-left text-xs font-bold uppercase transition-colors hover:bg-[#CCFF00] hover:text-black",
                        sortBy === "price-asc" ? "bg-white/5 text-[#CCFF00]" : "text-white"
                      )}
                    >
                      Price: Low to High
                    </button>
                    <button
                      onClick={() => { handleSortChange("price-desc"); setIsSortDropdownOpen(false); }}
                      className={cn(
                        "w-full px-4 py-3 text-left text-xs font-bold uppercase transition-colors hover:bg-[#CCFF00] hover:text-black",
                        sortBy === "price-desc" ? "bg-white/5 text-[#CCFF00]" : "text-white"
                      )}
                    >
                      Price: High to Low
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 pt-12 lg:px-12">
        <div className="flex flex-col gap-12 lg:flex-row">
          {/* Sidebar - Desktop */}
          <aside className="hidden w-64 shrink-0 space-y-8 lg:block">
            {/* Search Input */}
            <div className="space-y-4">
              <h3 className="font-heading text-xs font-black tracking-[2.4px] text-white uppercase">
                Search Shop
              </h3>
              <div className="relative flex items-center rounded-xl border border-white/10 bg-[#080808] px-4 py-3 focus-within:border-[#CCFF00]/50 transition-all">
                <Search size={16} className="text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search products..."
                  className="ml-3 w-full bg-transparent text-xs text-white outline-none placeholder:text-white/20"
                />
                {searchQuery && (
                  <button 
                    onClick={() => handleSearchChange("")} 
                    className="text-white/40 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {categoriesLoading ? (
              <ShopSidebarSkeleton />
            ) : (
              <>
                {/* Device Type (Categories) */}
                <div className="space-y-6">
                  <h3 className="font-heading text-xs font-black tracking-[2.4px] text-white uppercase">
                    Device Type
                  </h3>
                  <div className="space-y-3.5 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                    {allFlattenedCategories?.map((category) => (
                      <label
                        key={category.entityId}
                        className={cn(
                          "group flex cursor-pointer items-center justify-between transition-all",
                          category.depth > 0 && "pl-4"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category.entityId)}
                            onChange={() => handleCategoryChange(category.entityId)}
                            className="h-4 w-4 rounded border-white/20 bg-transparent checked:bg-[#CCFF00]"
                          />
                          <span className={cn(
                            "font-medium transition-colors group-hover:text-white",
                            category.depth > 0 ? "text-[#9fa388] text-xs" : "text-sm text-[#C4C9AC]"
                          )}>
                            {category.depth > 0 && "— "}{category.name}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-white/20 group-hover:text-white/40">
                          {getCategoryCount(category.entityId)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                <div className="space-y-6">
                  <h3 className="font-heading text-xs font-black tracking-[2.4px] text-white uppercase">
                    Top Brands
                  </h3>
                  <div className="space-y-3.5 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                    {brands?.slice(0, 15).map((brand) => (
                      <label
                        key={brand.entityId}
                        className="group flex cursor-pointer items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedBrand === brand.entityId}
                            onChange={() => handleBrandChange(brand.entityId)}
                            className="h-4 w-4 rounded border-white/20 bg-transparent checked:bg-[#CCFF00]"
                          />
                          <span className="text-sm font-medium text-[#C4C9AC] transition-colors group-hover:text-white">
                            {brand.name}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-white/20 group-hover:text-white/40">
                          {getBrandCount(brand.name)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clear All Button */}
                {hasActiveFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="w-full rounded-xl border border-[#CCFF00] py-3 text-xs font-black tracking-widest text-[#CCFF00] uppercase transition-all hover:bg-[#CCFF00]/5 active:scale-[0.98]"
                  >
                    Clear All Filters
                  </button>
                )}
              </>
            )}
          </aside>

          {/* Product Grid Area */}
          <div className="flex-1 space-y-12">
            {productsError ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <AlertCircle size={48} className="text-red-500/50" />
                <h3 className="mt-4 text-xl font-bold">
                  Failed to load products
                </h3>
                <p className="mt-2 text-[#C4C9AC]">
                  Please check your connection or try again later.
                </p>
              </div>
            ) : productsLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <ShopSkeleton key={i} />
                ))}
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center border border-white/5 rounded-2xl bg-[#080808]">
                <Search size={48} className="text-white/10" />
                <h3 className="mt-4 text-lg font-bold text-white uppercase tracking-wider">
                  No products found
                </h3>
                <p className="mt-2 text-sm text-[#C4C9AC] max-w-sm">
                  We couldn&apos;t find any products matching your selected search query or filters.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="mt-6 rounded-xl bg-[#CCFF00] px-6 py-3 text-xs font-black tracking-widest text-black uppercase transition-all hover:bg-[#b3e600]"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {paginatedProducts.map((product, index) => (
                  <ShopProductCard
                    key={product.entityId}
                    slug={product.path.replace(/^\//, "")}
                    name={product.name}
                    brand={product.brand?.name || "Premium Brand"}
                    price={product.prices?.price.value.toString() || "0.00"}
                    image={
                      product.defaultImage?.url || "/products/productImg-1.jpg"
                    }
                    tag={product.entityId % 5 === 0 ? "NEW" : undefined}
                    priority={index < 3}
                  />
                ))}
              </div>
            )}

            {/* Dynamic Stateful Pagination */}
            {!productsLoading && !productsError && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-10 border-t border-white/5">
                <button 
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white/40 hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white/40 transition-all cursor-pointer"
                >
                  <ChevronLeft size={18} />
                </button>
                
                {[...Array(totalPages)].map((_, i) => {
                  const pageNumber = i + 1;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg text-[13px] font-bold transition-all cursor-pointer",
                        currentPage === pageNumber
                          ? "bg-[#CCFF00] text-black shadow-lg shadow-[#CCFF00]/20"
                          : "border border-white/10 text-white/40 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                <button 
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white/40 hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white/40 transition-all cursor-pointer"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer Overlay */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm lg:hidden">
          <div className="h-full w-80 overflow-y-auto bg-[#080808] p-6 shadow-2xl border-l border-white/5 space-y-8 custom-scrollbar">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h2 className="text-lg font-black uppercase text-white tracking-widest">Filters</h2>
              <button 
                onClick={() => setIsMobileFiltersOpen(false)}
                className="rounded-lg border border-white/10 p-2 text-white/60 hover:text-white cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Filter Content */}
            {/* Search */}
            <div className="space-y-4">
              <h3 className="font-heading text-xs font-black tracking-[2.4px] text-white uppercase">Search</h3>
              <div className="relative flex items-center rounded-xl border border-white/10 bg-[#080808] px-4 py-3">
                <Search size={16} className="text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search products..."
                  className="ml-3 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/20"
                />
                {searchQuery && (
                  <button onClick={() => handleSearchChange("")} className="text-white/40 hover:text-white">
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-4">
              <h3 className="font-heading text-xs font-black tracking-[2.4px] text-white uppercase">Device Type</h3>
              <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1 custom-scrollbar">
                {allFlattenedCategories?.map((category) => (
                  <label 
                    key={category.entityId} 
                    className={cn(
                      "flex items-center justify-between cursor-pointer group transition-all",
                      category.depth > 0 && "pl-4"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.entityId)}
                        onChange={() => handleCategoryChange(category.entityId)}
                        className="h-4 w-4 rounded border-white/20 bg-transparent checked:bg-[#CCFF00]"
                      />
                      <span className={cn(
                        "font-medium transition-colors group-hover:text-white",
                        category.depth > 0 ? "text-[#9fa388] text-xs" : "text-sm text-[#C4C9AC]"
                      )}>
                        {category.depth > 0 && "— "}{category.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-white/20">
                      {getCategoryCount(category.entityId)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div className="space-y-4">
              <h3 className="font-heading text-xs font-black tracking-[2.4px] text-white uppercase">Top Brands</h3>
              <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                {brands?.slice(0, 15).map((brand) => (
                  <label key={brand.entityId} className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedBrand === brand.entityId}
                        onChange={() => handleBrandChange(brand.entityId)}
                        className="h-4 w-4 rounded border-white/20 bg-transparent checked:bg-[#CCFF00]"
                      />
                      <span className="text-sm font-medium text-[#C4C9AC] group-hover:text-white">
                        {brand.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-white/20">
                      {getBrandCount(brand.name)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Clear All & View Results buttons */}
            <div className="space-y-3 pt-6 border-t border-white/5">
              <button 
                onClick={() => setIsMobileFiltersOpen(false)}
                className="w-full rounded-xl bg-[#CCFF00] py-3 text-xs font-black tracking-widest text-black uppercase transition-all cursor-pointer"
              >
                View {filteredProducts.length} Results
              </button>
              {hasActiveFilters && (
                <button 
                  onClick={handleClearFilters}
                  className="w-full rounded-xl border border-white/10 py-3 text-xs font-bold text-white uppercase transition-all cursor-pointer"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopSkeleton />}>
      <ShopContent />
    </Suspense>
  );
}
