import React from 'react';
import { footer } from './data';
import Logo from "../logo.svg";

function antCloudFooter() {
  const children = footer.map((item, i) => (<div key={i}><a href={item.src}>{item.text}</a></div>));
  return (<div>
    <div className="logo" key="logo">
      <img alt="Smart Team" src={Logo} width="60" height="60" style={{objectFit: "cover", objectPosition: "0% 50%"}}/>
    </div>
    <div key="nav" className="home-footer-nav-wrapper">
      {children}
    </div>
  </div>
  );
}

function Footer() {
  return (
    <div className="home-layout-wrapper home-footer-wrapper">
      <div className="home-layout">
        {antCloudFooter()}
        <p key="cop" className="copy">Copyright ©2019 Smart Team</p>
      </div>
    </div>
  );
}

export default Footer;
