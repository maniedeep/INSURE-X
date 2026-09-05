import { Link } from 'wouter';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="eyebrow">INSURE-X / ROUTING</div>
      <Compass size={38} />
      <h1>That desk does not exist.</h1>
      <p>The route you requested is outside this operator’s workspace.</p>
      <Link href="/" className="btn btn-primary" data-testid="link-return-command-center">
        <ArrowLeft size={15} /> Return to command center
      </Link>
    </div>
  );
}