import React from 'react';
import { href, Link } from 'react-router-dom';

const HomePage = () => {
  const categories = [
    {
      id: 1,
      name: 'Jeans',
      href: "/jeans",
      imageUrl: './jeans.png',
    },
    {
      id: 2,
      name: 'Shoes',
      href: "/shoes",
      imageUrl: './shoes.png',
    },
    {
      id: 3,
      name: 'Glasses',
      href: "/glasses",
      imageUrl: './glasses.png',
    }, {
      id: 4,
      name: 'Jackets',
      href: "/jackets",
      imageUrl: './jackets.png',
    }, {
      id: 5,
      name: 'Suits',
      href: "/suits",
      imageUrl: './suits.png',
    },
    {
      id: 6,
      name: 'Bags',
      href: "/bags",
      imageUrl: './bags.png',
    },
    {
      id: 7,
      name: 'T-shirts',
      href: "/tshirts",
      imageUrl: './tshirts.png',
    },
  ];

  const featuredProducts = [
    {
      id: 1,
      name: 'Wireless Headphones',
      price: '99.99',
      image: 'https://via.placeholder.com/300x200?text=Headphones',
    },
    {
      id: 2,
      name: 'Sneakers',
      price: '129.99',
      image: 'https://via.placeholder.com/300x200?text=Sneakers',
    },
    {
      id: 3,
      name: 'LED Lamp',
      price: '39.99',
      image: 'https://via.placeholder.com/300x200?text=LED+Lamp',
    },
    {
      id: 4,
      name: 'Gaming Mouse',
      price: '49.99',
      image: 'https://via.placeholder.com/300x200?text=Gaming+Mouse',
    },
    {
      id: 5,
      name: 'Gaming Mouse',
      price: '449.99',
      image: 'https://via.placeholder.com/300x200?text=Gaming+Mouse',
    },
  ];

  return (
    <div className="w-full min-h-screen bg-slate-950 text-white px-20 ">
      {/* Categories */}
      <section className="py-10 px-6">
        <h2 className="text-4xl font-bold text-center mb-12">Shop by Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category${category.href}`}
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
      < section className="py-14 px-6" >
        <h2 className="text-4xl font-bold text-center mb-12">🔥 Featured Products</h2>
        <div className='flex justify-center'>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 ">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
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
                <span className="absolute top-2 right-2 bg-pink-600 text-white text-xs px-3 py-1 rounded-full">
                  Featured
                </span>
              </div>
            ))}
          </div>
        </div>

      </section>
    </div >
  );
};

export default HomePage;
