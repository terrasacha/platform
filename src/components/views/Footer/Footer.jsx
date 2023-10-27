import LOGO from '../../common/_images/suan_logo.png';
const Footer = () => {
    const year = new Date().getFullYear();
  
    return <footer className='footer mt-3'>Copyright © <img src={LOGO} style={{width:'20px', heigth: 'auto'}}alt='logo'/> Suan {year}</footer>;
  };
  
  export default Footer;
  