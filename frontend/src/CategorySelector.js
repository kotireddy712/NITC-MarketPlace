const categories = [
  "Electronics",
  "Books & Study Materials",
  "Hostel Essentials",
  "Clothing & Accessories",
  "Bicycles & Transportation",
  "Event Tickets & Passes",
  "Services"
];

function CategorySelector({ onSelect }) {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {categories.map((cat) => (
        <button
          key={cat}
          className="p-4 bg-blue-200 hover:bg-blue-300 rounded-xl"
          onClick={() => onSelect(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
