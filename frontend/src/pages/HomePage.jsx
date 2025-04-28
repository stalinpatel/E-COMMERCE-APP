import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import FeaturedProductsSlider from '../components/FeaturedProductsSlider';
import { useCartStore } from "../store/useCartStore";
import { useProductStore } from '../store/useProductStore';
import { useUserStore } from "../store/useUserStore";

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
  const { user, } = useUserStore();
  const { getCartProducts } = useCartStore();

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
      {
        !screenLoading && featuredProducts.length > 0 && <FeaturedProductsSlider />
      }

    </div >
  );
};

export default HomePage;
