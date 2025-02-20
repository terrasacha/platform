import LOGO from '../../common/_images/suan_logo_white.png';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="footer pt-8 flex flex-col items-center justify-center text-center">
      <p className='pt-1'>Copyright © Suan {year}</p>
    </footer>
  );
};

export default Footer;
