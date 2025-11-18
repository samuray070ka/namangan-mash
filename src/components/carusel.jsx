import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/autoplay';

// images
import Envato from "./assets/ham.png";

function Brands() {
    // Duplicate brands for seamless infinite loop
    const baseBrands = [
        { id: 1, name: 'envato', logo: Envato },
        { id: 2, name: 'envato', logo: Envato },
        { id: 3, name: 'envato', logo: Envato },
        { id: 4, name: 'envato', logo: Envato },
        { id: 5, name: 'envato', logo: Envato },
        { id: 6, name: 'envato', logo: Envato },
    ];

    const brands = [...baseBrands, ...baseBrands, ...baseBrands];

    return (
        <div className="w-full h-[180px] bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Title Line */}
                <div className="flex items-center justify-center mb-12">
                    <div className="flex-1 h-px bg-gray-100"></div>
                    <div className="px-8"></div>
                    <div className="flex-1 h-px bg-gray-100"></div>
                </div>

                {/* Swiper Container */}
                <div className="relative overflow-hidden">
                    <Swiper
                        slidesPerView={5}
                        spaceBetween={40} // Ko'proq masofa
                        loop={true}
                        autoplay={{
                            delay: 0,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        speed={2000}
                        modules={[Autoplay]}
                        className="brands-swiper"
                        breakpoints={{
                            320: {
                                slidesPerView: 2,
                                spaceBetween: 20,
                            },
                            480: {
                                slidesPerView: 3,
                                spaceBetween: 25,
                            },
                            640: {
                                slidesPerView: 3,
                                spaceBetween: 30,
                            },
                            768: {
                                slidesPerView: 4,
                                spaceBetween: 35,
                            },
                            1024: {
                                slidesPerView: 5,
                                spaceBetween: 40,
                            },
                            1280: {
                                slidesPerView: 5,
                                spaceBetween: 40,
                            },
                        }}
                    >
                        {brands.map((brand) => (
                            <SwiperSlide key={brand.id}>
                                <div className="group flex items-center justify-center p-4 h-20 bg-white">
                                    <img
                                        src={brand.logo}
                                        alt={brand.name}
                                        className="w-[300px] h-20 object-contain 
                                            opacity-40 
                                            group-hover:opacity-100
                                            transition-all duration-300 ease-in-out
                                            cursor-pointer hover:scale-110"
                                        loading="lazy"
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </div>
    );
}

export default Brands;