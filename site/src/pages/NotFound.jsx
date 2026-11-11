import { Link } from 'react-router';

export default function NotFound() {
  return (
    <div className="page-header">
      <p><Link className="back-link" to="/">← Home</Link></p>
      <h1>Page not found</h1>
      <ul className="link-list"><li><Link to="/">Home</Link></li><li><Link to="/ARC/">ARC</Link></li><li><Link to="/MarketTesting/">MarketTesting</Link></li></ul>
    </div>
  );
}
