import Main from './Main';
import Header from './Header';
import './Container.css';

function Container({ activePage, username }) {
  return (
    <div className="Container">
      <Header username={username} />
      <Main activePage={activePage} />
    </div>
  );
}

export default Container;