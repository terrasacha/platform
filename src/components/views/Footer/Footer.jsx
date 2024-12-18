import LOGO from '../../common/_images/suan_logo_white.png';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="footer pt-8 flex flex-col items-center justify-center text-center">
      <img 
        src={LOGO} 
        style={{ width: '20px', height: 'auto' }} 
        alt="logo" 
      />
      <p className='pt-1'>Suan {year}</p>
    </footer>
  );
};

export default Footer;
