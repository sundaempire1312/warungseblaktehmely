'use client'
import { useEffect, useState } from "react";
import { GiBowlOfRice, GiNoodles, GiChiliPepper, GiFullPizza, GiSandwich, GiForkKnifeSpoon } from "react-icons/gi";
import { FaFireAlt, FaPepperHot, FaLeaf } from "react-icons/fa";

const Page = () => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Daftar icon yang akan digunakan
  const menuIcons = [
    <GiBowlOfRice className="text-4xl" />,
    <GiNoodles className="text-4xl" />,
    <GiChiliPepper className="text-4xl" />,
    <GiFullPizza className="text-4xl" />,
    <GiSandwich className="text-4xl" />,
    <GiForkKnifeSpoon className="text-4xl" />
  ];

  // Icon untuk level pedas
  const spicyLevelIcons = (level) => {
    const icons = [];
    for (let i = 0; i < level; i++) {
      icons.push(<FaPepperHot key={i} className="text-red-500" />);
    }
    return icons;
  };

  const fetchMenu = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/menu");

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      if (data.success) {
        setMenu(data.produk);
      } else {
        throw new Error(data.message || "Failed to fetch menu");
      }
    } catch (err) {
      console.error("Gagal ambil data menu:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = menu.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(menu.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Hero Section */}
      <section className="relative h-[70vh] bg-amber-900 overflow-hidden flex flex-col justify-center items-center text-center px-4 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/90 to-amber-700/90 z-10" />
        <div className="relative z-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-amber-300 drop-shadow-lg">
            Warung Seblak Teh Mely
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Nikmati kelezatan seblak pedas nan menggoda, kami siap antar sampai depan rumahmu!
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-full transition-all transform hover:scale-105">
              Pesan Sekarang
            </button>
            <button
              onClick={() => document.getElementById('menu').scrollIntoView({ behavior: 'smooth' })}
              className="border-2 border-white hover:bg-white/20 text-white font-bold py-3 px-6 rounded-full transition-all"
            >
              Lihat Menu
            </button>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-16 bg-amber-100 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-amber-800 mb-2">Menu Andalan Kami</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Pilihan seblak dengan level pedas yang bisa disesuaikan dengan selera Anda
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg">
                  <div className="h-48 bg-amber-200 animate-pulse"></div>
                  <div className="p-6">
                    <div className="h-6 bg-amber-100 rounded animate-pulse mb-4"></div>
                    <div className="h-4 bg-amber-100 rounded animate-pulse mb-2 w-3/4"></div>
                    <div className="h-10 bg-amber-100 rounded animate-pulse mt-4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              <p>Gagal memuat menu: {error}</p>
              <button
                onClick={fetchMenu}
                className="mt-4 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded"
              >
                Coba Lagi
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentItems.length === 0 ? (
                  <div className="col-span-3 text-center py-8">
                    <p className="text-lg">Belum ada menu tersedia</p>
                  </div>
                ) : (
                  currentItems.map((item, index) => (
                    <div
                      key={item.id_produk}
                      className="bg-white border border-amber-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col"
                    >
                      <div className="h-22 bg-amber-100 flex items-center justify-center">
                        <div className="text-amber-600">
                          {menuIcons[index % menuIcons.length]}
                        </div>
                      </div>
                      <div className="p-6 flex-grow">
                        <div className="flex flex-col gap-2 justify-start items-start mb-2">
                          <h3 className="text-xl font-bold text-gray-800">{item.nama_produk}</h3>
                          <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold">
                            Rp {item.harga.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination */}
              {menu.length > itemsPerPage && (
                <div className="flex justify-center mt-12">
                  <nav className="flex items-center gap-2">
                    <button
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg border border-amber-300 disabled:opacity-50"
                    >
                      &laquo;
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                      <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`px-4 py-2 rounded-lg ${currentPage === number ? 'bg-amber-500 text-white' : 'border border-amber-300'}`}
                      >
                        {number}
                      </button>
                    ))}

                    <button
                      onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-lg border border-amber-300 disabled:opacity-50"
                    >
                      &raquo;
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 px-4 bg-amber-800 text-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Apa Kata Pelanggan Kami</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Budi Santoso",
                comment: "Seblaknya pedasnya pas, bikin nagih! Sudah langganan sejak 2018.",
                rating: 5
              },
              {
                name: "Ani Wijaya",
                comment: "Pengirimannya cepat dan paketnya rapi. Rasanya autentik banget!",
                rating: 4
              },
              {
                name: "Rudi Hartono",
                comment: "Level pedasnya bisa request, cocok buat yang ga suka terlalu pedas.",
                rating: 5
              }
            ].map((testi, index) => (
              <div key={index} className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 ${i < testi.rating ? 'text-amber-300' : 'text-gray-400'}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="italic mb-4">"{testi.comment}"</p>
                <p className="font-semibold">- {testi.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Updated Version */}
      <section className="py-16 px-4 bg-amber-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Siap Menikmati Seblak Pedas Kami?</h2>
          <p className="text-xl mb-8">Pesan sekarang dan dapatkan promo khusus untuk pembelian pertama!</p>

          <div className="flex flex-col md:flex-row items-center gap-6 mt-8">
            {/* Nomor HP */}
            <div className="flex items-center gap-3 bg-white/10 p-4 rounded-lg backdrop-blur-sm w-full max-w-md">
              <div className="bg-amber-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-sm text-amber-200">Hubungi kami via:</p>
                <p className="text-xl font-semibold">0812-3456-7890</p>
              </div>
            </div>

            {/* Alamat */}
            <div className="flex items-center gap-3 bg-white/10 p-4 rounded-lg backdrop-blur-sm w-full max-w-md">
              <div className="bg-amber-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-sm text-amber-200">Kunjungi kami di:</p>
                <p className="text-xl font-semibold">Jl. Wado - Kirisik , Dusun Sukahurip, RT.001/RW.006, Pawenang, Kec. Jatinunggal</p>
              </div>
            </div>
          </div>

          <p className="mt-8 text-amber-200">Buka setiap hari 09.00 - 21.00 WIB</p>
        </div>
      </section>
    </div>
  );
}

export default Page;