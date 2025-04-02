import LOGO from '../../common/_images/suan_logo_white.png';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="flex flex-col bg-[#282c34] text-white items-center justify-center text-center py-3">
      <p className='mb-0'>Copyright © Suan {year}</p>
    </footer>
  );
};

export default Footer;
