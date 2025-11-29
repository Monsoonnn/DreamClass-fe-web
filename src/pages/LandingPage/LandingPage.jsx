import React from 'react';

// Dữ liệu mẫu
const GAME_DATA = {
  name: 'Dream Class',
  tagline: 'Khơi dậy đam mê học hỏi trong từng trò chơi.',
  logoUrl: '/images/logodcl.png',
  heroBackgroundUrl: '',
  about: {
    title: 'Về Trò Chơi',
    description:
      'Dream Class là tựa game mô phỏng học tập sáng tạo, nơi học sinh được trải nghiệm các thí nghiệm, bài học và kiến thức trong sách giáo khoa một cách sinh động và trực quan. Thay vì chỉ đọc lý thuyết, người chơi có thể thực hành, khám phá và tương tác với các mô hình, hiện tượng khoa học ngay trong trò chơi',
    features: [
      {
        title: 'Học Thông Qua Chơi',
        description: 'Trải nghiệm các bài học, thí nghiệm và trò chơi mô phỏng sinh động.',
        icon: 'map',
      },
      {
        title: 'Giao diện thân thiện',
        description: 'Dễ thao tác, phù hợp cho mọi lứa tuổi học sinh.',
        icon: 'sword',
      },
      {
        title: 'Học vui – Nhớ lâu',
        description: 'Cơ chế phần thưởng và thử thách giúp tăng hứng thú học tập.',
        icon: 'castle',
      },
    ],
  },
  screenshots: {
    title: 'Thư Viện Hình Ảnh',
    images: ['/images/quynhintao.jpg', '/images/lophoc.jpg', '/images/phongthuchanh.jpg', '/images/sachtailieu.jpg', '/images/cauhoi.jpg', '/images/nhiemvudung.jpg'],
  },
  download: {
    title: 'Tải Game Ngay',
    description: 'Sẵn sàng cho cuộc phiêu lưu? Chọn nền tảng của bạn và bắt đầu!',
    platforms: [
      { name: 'APK', link: '#', image: '/images/forapk.png' },
      { name: 'PC (Steam)', link: '#', image: '/images/meta.png' },
      { name: 'Meta', link: '#', image: '/images/steam2.png' },
      { name: 'Google Play', link: '#', image: '/images/googleplay.png' },
    ],
  },
};

// Component Icon (Sử dụng SVG inline)
const GameIcon = ({ type, className }) => {
  const icons = {
    map: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13v-6m0-6l6-3m-6 9l6 3m7.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-.553-.894L15 2m0 13v-6m0 6l-6-3"
      />
    ),
    sword: <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l-7-7 7-7m-7 7h18" />,
    castle: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0v-4m0 4h5m0-4v-4m0 4H5m14 0v-4m0 4h-2m0-4v-4m0 4H12m-2-4h2"
      />
    ),
    steam: (
      <path
        d="M0 8a8 8 0 0 0 13.865 5.066l-2.58-1.106A5.5 5.5 0 1 1 11.5 3H1.285a8 8 0 0 0-1.285 5z m15.42 1.634a3.5 3.5 0 1 1-4.95-4.95 3.5 3.5 0 0 1 4.95 4.95z"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    ),
    playstation: (
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-2.43 18.026v-3.87l-3.23-1.86v3.31l3.23 2.42zm0-7.39l-3.23-1.86V5.466l3.23 2.42v2.75zm5.13 4.416l-3.23 2.42v-3.87l3.23-1.86v3.31zM14.7 9.296l-3.23 2.42V5.466l3.23 1.86v1.97z" />
    ),
    xbox: (
      <path d="M21.87 3.19C19.7 1.25 16.27 0 12 0S4.3 1.25 2.13 3.19C.1 5.07 0 10.33 0 12s.1 6.93 2.13 8.81C4.3 22.75 7.73 24 12 24s7.7-1.25 9.87-3.19C23.9 18.93 24 13.67 24 12s-.1-6.93-2.13-8.81zM8.53 18.06l-3.7-3.69 3.7-3.7 2.12 2.12-1.58 1.57 1.58 1.58-2.12 2.12zm9.15-2.22l-1.57-1.57 1.57-1.58-2.12-2.12-3.7 3.7 3.7 3.69 2.12-2.12z" />
    ),
    apple: (
      <path d="M15.54 8.71c0-2.3-1.58-3.99-3.74-3.99-2.31 0-3.93 1.76-3.93 4.14 0 2.87 2.1 4.3 4.09 4.3.56 0 1.25-.19 1.76-.48.16-.09.3-.18.3-.18s-.01.01 0 0c-.55.29-1.23.47-1.89.47-1.86 0-3.26-1.22-4.08-3.05-1.28-2.82-.6-6.13 1.63-7.53 1.12-.7 2.42-1.09 3.69-1.09 1.2 0 2.37.33 3.32 1 .73.51 1.32 1.21 1.73 2.01-.2.12-.4.24-.59.36-1.76-1.53-4.32-1.42-5.9.31-.9.98-1.12 2.42-.51 3.66.61 1.24 1.88 2 3.23 2 .61 0 1.2-.18 1.69-.48l.11-.06c.03-.02.06-.04.08-.06.01-.01.01-.01.02-.02.6-.33.99-.96.99-1.7z M15.17 1.63c-1.38-.9-3.15-1.1-4.66-.52-2 .76-3.35 2.5-3.8 4.54-.15.68-.21 1.38-.21 2.09 0 .15.01.3.02.45.24-2.29 2.1-4.13 4.4-4.13 1.05 0 2.02.35 2.78 1 .18-.21.35-.43.51-.65-.4-.32-.83-.59-1.3-.81z" />
    ),
    android: <path d="M4 16h16V8H4v8zm4-6h8v4h-8v-4z" clipRule="evenodd" fillRule="evenodd" />,
  };
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      {icons[type]}
    </svg>
  );
};

// Component Header
const Header = () => (
  <header className="bg-black bg-opacity-60 fixed w-full top-0 z-50 backdrop-blur-sm">
    <div className="container mx-auto flex items-center p-4 text-white">
      {/* Logo bên trái */}
      <a href="#" className="flex items-center space-x-2 ml-20">
        <img src={GAME_DATA.logoUrl} alt="Game Logo" className="h-10 md:h-12" />
      </a>

      {/* Nav chính giữa */}
      <nav className="hidden md:flex flex-1 justify-center space-x-8 ml-20 font-semibold">
        <a href="#about" className="hover:text-cyan-400 transition-colors duration-300">
          GIỚI THIỆU
        </a>
        <a href="#screenshots" className="hover:text-cyan-400 transition-colors duration-300">
          HÌNH ẢNH
        </a>
        <a href="#download" className="hover:text-cyan-400 transition-colors duration-300">
          TẢI GAME
        </a>
      </nav>

      {/* Nút bên phải */}
      <div className="hidden md:flex items-center space-x-4">
        <a href="#download" className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105">
          Tải Ngay
        </a>
        <button className="bg-transparent border border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-black font-bold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105">
          Đăng Nhập
        </button>
      </div>
    </div>
  </header>
);

// Component Hero Section
const Hero = () => (
  <section className="h-screen flex items-center justify-center text-white relative overflow-hidden">
    {/* YouTube Background */}
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      <iframe
        className="absolute top-1/2 left-1/2 w-screen h-screen"
        style={{
          transform: 'translate(-50%, -50%) scale(1.5)',
          minWidth: '100vw',
          minHeight: '100vh',
        }}
        src="https://www.youtube.com/embed/m7IbfQZUbRQ?autoplay=1&mute=1&loop=1&playlist=m7IbfQZUbRQ&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1"
        title="YouTube video background"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>

    {/* Overlay gradient để content dễ đọc hơn */}
    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />

    {/* Content */}
    <div className="text-center p-6 relative z-10">
      <h1 className="text-5xl md:text-7xl font-extrabold uppercase" style={{ textShadow: '0 0 20px rgba(8, 145, 178, 0.8)' }}>
        {GAME_DATA.name}
      </h1>
      <p className="mt-4 text-xl md:text-2xl font-light text-gray-300">{GAME_DATA.tagline}</p>

      <a
        href="#download"
        className="mt-8 inline-block bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-4 px-12 rounded-lg text-lg uppercase transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/30"
      >
        Tải Game Miễn Phí
      </a>
    </div>
  </section>
);

// Component About Section
const About = () => (
  <section id="about" className="py-20 bg-gray-900 text-white">
    <div className="container mx-auto px-6 text-center">
      <h2 className="text-4xl font-bold mb-4 uppercase">{GAME_DATA.about.title}</h2>
      <div className="w-24 h-1 bg-cyan-500 mx-auto mb-10"></div>
      <p className="max-w-3xl mx-auto text-lg text-gray-400 mb-16">{GAME_DATA.about.description}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {GAME_DATA.about.features.map((feature) => (
          <div key={feature.title} className="bg-gray-800 p-8 rounded-lg border border-gray-700 hover:border-cyan-500 hover:-translate-y-2 transition-all duration-300">
            <div className="flex justify-center mb-4">
              <div className="bg-gray-700 p-4 rounded-full">
                <GameIcon type={feature.icon} className="h-8 w-8 text-cyan-400" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-cyan-400 mb-2">{feature.title}</h3>
            <p className="text-gray-400">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Component Screenshots Section
const Screenshots = () => (
  <section id="screenshots" className="py-20 bg-gray-950">
    <div className="container mx-auto px-6 text-center">
      <h2 className="text-4xl font-bold mb-4 text-white uppercase">{GAME_DATA.screenshots.title}</h2>
      <div className="w-24 h-1 bg-cyan-500 mx-auto mb-12"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {GAME_DATA.screenshots.images.map((img, index) => (
          <div key={index} className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer">
            <img src={img} alt={`Screenshot ${index + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300"></div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Component Download Section
const Download = () => (
  <section id="download" className="py-20 bg-gray-900 text-white">
    <div className="container mx-auto px-6 text-center">
      <h2 className="text-4xl font-bold mb-4 uppercase">{GAME_DATA.download.title}</h2>
      <div className="w-24 h-1 bg-cyan-500 mx-auto mb-10"></div>
      <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">{GAME_DATA.download.description}</p>
      <div className="flex flex-wrap justify-center items-center gap-4">
        {GAME_DATA.download.platforms.map((platform) => (
          <a href={platform.link} key={platform.name} className="transition-transform transform hover:scale-105">
            <img
              src={platform.image} // lấy ảnh riêng từng nền tảng
              alt={platform.name}
              className="h-14 sm:h-16 rounded-xl"
            />
          </a>
        ))}
      </div>
    </div>
  </section>
);

// Component Footer
const Footer = () => (
  <footer className="bg-black py-8 text-center text-gray-500">
    <div className="container mx-auto">
      <p>&copy; 2025 {GAME_DATA.name}. All Rights Reserved.</p>
      <div className="flex justify-center space-x-6 mt-4">
        <a href="#" className="hover:text-white transition-colors">
          Chính Sách
        </a>
        <a href="#" className="hover:text-white transition-colors">
          Điều Khoản
        </a>
        <a href="#" className="hover:text-white transition-colors">
          Liên Hệ
        </a>
      </div>
    </div>
  </footer>
);

// Main App Component
export default function LandingPage() {
  return (
    <React.Fragment>
      <style>
        {`
                    /* Custom scrollbar styles */
                    ::-webkit-scrollbar {
                        width: 8px;
                    }
                    ::-webkit-scrollbar-track {
                        background: #111827;
                    }
                    ::-webkit-scrollbar-thumb {
                        background: #0891b2;
                        border-radius: 10px;
                    }
                    ::-webkit-scrollbar-thumb:hover {
                        background: #06b6d4;
                    }
                    html {
                        scroll-behavior: smooth;
                    }
                `}
      </style>
      <div className="min-h-screen bg-[#030712] text-white">
        <Header />
        <main>
          <Hero />
          <About />
          <Screenshots />
          <Download />
        </main>
        <Footer />
      </div>
    </React.Fragment>
  );
}
