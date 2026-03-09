import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItems from "../components/ProductItems";
import SearchBar from "../components/SearchBar";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);

  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [types, setTypes] = useState([]);
  const [sortType, setSortType] = useState("relevant");

  // Convert text to lowercase for matching
  const normalize = (str) => (str ? str.toLowerCase().trim() : "");

  // Toggle Brand
  const toggleBrand = (e) => {
    const value = normalize(e.target.value);
    setBrands((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  // Toggle Type
  const toggleType = (e) => {
    const value = normalize(e.target.value);
    setTypes((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  // Apply Filters
  const applyFilter = () => {
    let filtered = [...products];

    // Search filter
    if (showSearch && search.trim() !== "") {
      filtered = filtered.filter((item) =>
        normalize(item.name).includes(normalize(search))
      );
    }

    // Brand filter
    if (brands.length > 0) {
      filtered = filtered.filter((item) =>
        brands.includes(normalize(item.brand))
      );
    }

    // Type filter
    if (types.length > 0) {
      filtered = filtered.filter((item) =>
        types.includes(normalize(item.type))
      );
    }

    setFilterProducts(filtered);
  };

  // Sort Products
  const sortProduct = (type, list) => {
    let sorted = [...list];
    if (type === "low-high") sorted.sort((a, b) => a.price - b.price);
    else if (type === "high-low") sorted.sort((a, b) => b.price - a.price);
    return sorted;
  };

  // Show all products when loaded
  useEffect(() => {
    setFilterProducts(products);
  }, [products]);

  // Apply filter when anything changes
  useEffect(() => {
    applyFilter();
  }, [brands, types, search, showSearch, products]);

  // Apply sorting after filtering
  useEffect(() => {
    setFilterProducts((prev) => sortProduct(sortType, prev));
  }, [sortType]);

  return (
    <>
      <SearchBar />

      <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
        {/* Filter Section */}
        <div className="min-w-60">
          <p
            onClick={() => setShowFilter(!showFilter)}
            className="my-2 text-xl flex items-center cursor-pointer gap-2"
          >
            FILTERS
            <img
              src={assets.dropdown_icon}
              alt="dropdown"
              className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
            />
          </p>

          {/* Brand Filter */}
          <div
            className={`border border-gray-300 pl-5 py-3 mt-6 ${
              showFilter ? "" : "hidden"
            } sm:block`}
          >
            <p className="mb-3 text-sm font-medium">BRANDS</p>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
              {[
                "dermaco",
                "mamaearth",
                "uvdoux",
                "technic",
                "cetaphil",
                "lagirl",
                "lotus",
              ].map((brand) => (
                <label key={brand} className="flex gap-2 capitalize">
                  <input
                    type="checkbox"
                    value={brand}
                    onChange={toggleBrand}
                    checked={brands.includes(brand)}
                    className="w-3"
                  />
                  {brand}
                </label>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div
            className={`border border-gray-300 pl-5 py-3 my-5 ${
              showFilter ? "" : "hidden"
            } sm:block`}
          >
            <p className="mb-3 text-sm font-medium">TYPES</p>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
              {[
                "skincare",
                "makeup",
                "haircare",
                "body",
                "appliance",
                "accessories",
              ].map((type) => (
                <label key={type} className="flex gap-2 capitalize">
                  <input
                    type="checkbox"
                    value={type}
                    onChange={toggleType}
                    checked={types.includes(type)}
                    className="w-3"
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Product Section */}
        <div className="flex-1">
          <div className="flex justify-between text-base sm:text-2xl mb-4">
            <Title text1={"All"} text2={"COLLECTION"} />

            {/* Sorting */}
            <select
              onChange={(e) => setSortType(e.target.value)}
              className="border-2 border-gray-200 text-sm px-2 py-1 rounded"
            >
              <option value="relevant">Sort by: Relevant</option>
              <option value="low-high">Sort by: Low to High</option>
              <option value="high-low">Sort by: High to Low</option>
            </select>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-6">
            {filterProducts.length > 0 ? (
              filterProducts.map((item) => (
                <ProductItems
                  key={item._id}
                  id={item._id}
                  image={item.image}
                  name={item.name}
                  price={item.price}
                />
              ))
            ) : (
              <p className="text-gray-500 text-center col-span-full py-10">
                No products found for selected filters.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Collection;