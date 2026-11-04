import { Link } from 'react-router';

export default function NotFound() {
  return (
    <>
      <div className="page-header">
        <p><Link className="back-link" to="/">← Home</Link></p>
        <h1>Page not found</h1>
      </div>
      <section className="section section--page" aria-labelledby="nf-title">
        <h2 id="nf-title" className="section__title">Go somewhere</h2>
        <p><Link to="/">Home</Link>{' '}<Link to="/ARC/">ARC</Link>{' '}<Link to="/MarketTesting/">MarketTesting</Link></p>
      </section>
    </>
  );
}
