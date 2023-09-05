import LOGO from './logo_suan_horizontal-web_white - Copy.png';
const Footer = () => {
    const year = new Date().getFullYear();
  
    return <footer className='footer mt-3'>Copyright © <img src={LOGO} style={{width:'20px', heigth: 'auto'}}alt='logo'/> Suan {year}</footer>;
  };
  
  export default Footer;
  