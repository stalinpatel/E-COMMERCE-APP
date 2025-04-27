import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProductStore } from '../store/useProductStore';
import { useCartStore } from "../store/useCartStore"
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import { useUserStore } from "../store/useUserStore"


const HomePage = () => {
  const categories = [
    {
      id: 1,
      name: 'Jeans',
      slug: 'jean',
      imageUrl: './jeans.png',
    },
    {
      id: 2,
      name: 'Shoes',
      slug: 'shoe',
      imageUrl: './shoes.png',
    },
    {
      id: 3,
      name: 'Glasses',
      slug: 'glasses',
      imageUrl: './glasses.png',
    },
    {
      id: 4,
      name: 'Jackets',
      slug: 'jacket',
      imageUrl: './jackets.png',
    },
    {
      id: 5,
      name: 'Suits',
      slug: 'suit',
      imageUrl: './suits.png',
    },
    {
      id: 6,
      name: 'Bags',
      slug: 'bag',
      imageUrl: './bags.png',
    },
    {
      id: 7,
      name: 'T-shirts',
      slug: 't-shirt',
      imageUrl: './tshirts.png',
    },
    {
      id: 8,
      name: "Accessories",
      slug: "accessories",
      imageUrl: "./accessories.png"

    }
  ];


  const { getFeaturedProducts, featuredProducts, screenLoading, } = useProductStore()
  const { getCartProducts } = useCartStore()
  const { user, } = useUserStore();

  useEffect(() => {
    getFeaturedProducts();
    if (user) {
      getCartProducts();
    }
  }, [])

  return (
    <div className="w-full min-h-screen bg-slate-950 text-white px-20 ">
      {/* Categories */}
      <section className="py-10 px-6">

        <h2 className="text-4xl font-bold text-center mb-12">Shop by Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              className="relative group bg-slate-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <img
                src={category.imageUrl}
                alt={category.name}
                className="w-full h-60 object-cover group-hover:opacity-90 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 flex items-end">
                <h3 className="text-xl font-semibold">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section >

      {/* Featured Products */}
      <section className="py-14 px-6">
        <h2 className="text-4xl font-bold text-center mb-12">🔥 Featured Products</h2>
        <div className='flex justify-center'>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 ">
            {
              screenLoading
                ? Array.from({ length: 8 }).map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))
                :
                featuredProducts.length === 0 ? (
                  <div className="col-span-full flex items-center justify-center ">
                    <div className="text-gray-400 text-2xl px-6 py-4 rounded-xl font-bold text-center">
                      No Featured Products Found
                    </div>
                  </div>
                ) :
                  featuredProducts.map((product) => (
                    <div
                      key={product._id}
                      className="bg-slate-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 relative"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="text-xl font-semibold mb-1">{product.name}</h3>
                        <p className="text-pink-400 font-bold">${product.price}</p>
                      </div>

                    </div>
                  ))}
          </div>
        </div>
      </section>
    </div >
  );
};

export default HomePage;
