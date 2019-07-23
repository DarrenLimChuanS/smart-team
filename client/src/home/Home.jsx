import React from 'react';
import DocumentTitle from 'react-document-title';
import Header from './Header';
import Banner from './Banner';
import Page1 from './Page1';
import Footer from './Footer';
import './static/style';

class Home extends React.PureComponent {
  render() {
    return (
      <div className="home-page">
        <DocumentTitle title="Smart Team - Team Allocation Made Easy" />
        <Banner key="banner"/>
        <Page1 key="page1" />
        <Footer key="footer" />        
      </div>
    );
  }
}
export default Home;
