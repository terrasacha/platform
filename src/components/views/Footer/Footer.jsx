import LOGO from './logo.png';
const Footer = () => {
    const year = new Date().getFullYear();
  
    return <footer>Copyright © <img src={LOGO} style={{width:'20px', heigth: 'auto'}}alt='logo'/> Block-e {year}</footer>;
  };
  
  export default Footer;
  