import { Link } from 'react-router';

export default function NotFound() {
  return (
    <div className="page-header">
      <p><Link className="back-link" to="/">← Home</Link></p>
      <h1>Page not found</h1>
      <p className="page-header__summary"><Link to="/">Home</Link>, <Link to="/ARC/">ARC</Link>, <Link to="/MarketTesting/">MarketTesting</Link></p>
    </div>
  );
}
