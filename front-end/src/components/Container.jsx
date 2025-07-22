import Main from './Main';
import Header from './Header';
import './Container.css';

function Container({ activePage }) {
  return (
    <div className="Container">
      <Header />
      <Main activePage={activePage} />
    </div>
  );
}

export default Container;
