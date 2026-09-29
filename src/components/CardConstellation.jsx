function Cluster({ className }) {
  return (
    <svg className={'cc-cluster ' + className} viewBox="0 0 40 40" aria-hidden="true">
      <line x1="9" y1="11" x2="25" y2="7" />
      <line x1="25" y1="7" x2="32" y2="21" />
      <line x1="9" y1="11" x2="15" y2="29" />
      <circle cx="9" cy="11" r="2.6" />
      <circle cx="25" cy="7" r="2.6" />
      <circle cx="32" cy="21" r="2.6" />
      <circle cx="15" cy="29" r="2.6" />
    </svg>
  );
}

// Two small, independent node clusters at opposite corners (echoing
// the background constellation's dots), each with its own internal
// lines that appear on hover — deliberately not connected to each
// other across the card.
export default function CardConstellation() {
  return (
    <div className="card-constellation" aria-hidden="true">
      <Cluster className="cc-cluster-tl" />
      <Cluster className="cc-cluster-br" />
    </div>
  );
}
