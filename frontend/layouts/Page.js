import App from '../components/App';
import Footer from '../components/Footer';
import Header from '../components/Header';

export default ({ children }) => (
  <App>
    <Header />
    {children}
    <Footer />
  </App>
);
