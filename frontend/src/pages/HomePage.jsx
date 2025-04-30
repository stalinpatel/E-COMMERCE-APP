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
      slug: 'jeans',
      imageUrl: './jeans.png',
    },
    {
      id: 2,
      name: 'Shoes',
      slug: 'shoes',
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
      slug: 'jackets',
      imageUrl: './jackets.png',
    },
    {
      id: 5,
      name: 'Suits',
      slug: 'suits',
      imageUrl: './suits.png',
    },
    {
      id: 6,
      name: 'Bags',
      slug: 'bags',
      imageUrl: './bags.png',
    },
    {
      id: 7,
      name: 'T-shirts',
      slug: 't-shirts',
      imageUrl: './tshirts.png',
    },
    {
      id: 8,
      name: "Accessories",
      slug: "accessories",
      imageUrl: "./accessories.png"
    },
    {
      id: 9,
      name: "Payment Testing",
      slug: "rzp_test",
      imageUrl: "./rzp_test.png"
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
    <div className="w-full   min-h-screen bg-slate-950 text-white sm:px-10 md:px-20 lg:px-32 xl:px-40 ">
      {/* Categories */}
      <section className="py-4 px-6">

        {/* <h2 className=" text-4xl font-bold text-center mb-12">Shop by Categories</h2> */}
        <h2 className=" text-lg md:text-3xl lg:text-4xl font-bold text-center m-4">Shop by Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              className="relative group bg-slate-800 rounded-xl  overflow-hidden shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <img
                src={category.imageUrl}
                alt={category.name}
                className="w-full h-26  md:h-52 lg:60 object-cover group-hover:opacity-90 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-2 lg:p-3 md:p-4 flex items-end">
                <h3 className="text-sm  md:text-xl lg:text-2xl font-semibold ">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section >

      {/* Featured Products */}
      {
        !screenLoading && featuredProducts.length > 0 && <FeaturedProductsSlider />
      }
      {/* Footer */}
      <section className="w-full bg-slate-950 text-white border-t border-slate-800 mt-12 py-4  md:py-8 px-4 md:px-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
          {/* About Me */}
          <div className="text-center md:text-left">
            <h4 className=" text-md md:text-xl font-semibold mb-2">About Me: </h4>
            <p className="text-sm text-slate-400 max-w-xs">
              A developer crafting seamless web experiences with a nod to timeless design.
            </p>
          </div>

          {/* Designed By */}
          <div className="text-center">
            <h4 className="text-md md:text-xl font-semibold mb-2">Designed By</h4>
            <p className="text-sm text-slate-400">Stalin ✨</p>
          </div>

          {/* Contact */}
          <div className="text-center md:text-right">
            <h4 className="text-md md:text-xl font-semibold mb-2">Contact: 6371352739</h4>
            <p className="text-sm text-slate-400">Email: <a href="mailto:stalinpatel023@gmail.com" className="underline hover:text-indigo-400 transition-colors duration-200">stalinpatel023@gmail.com</a></p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 text-center border-t border-slate-800 pt-4 text-sm text-slate-500">
          © {new Date().getFullYear()} Stalin. All rights reserved.
        </div>
      </section>

    </div >
  );
};

export default HomePage;
