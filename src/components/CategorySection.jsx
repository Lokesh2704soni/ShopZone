const categories = [
  {
    name: "Electronics",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600",
  },
  {
    name: "Fashion",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600",
  },
  {
    name: "Home & Kitchen",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600",
  },
  {
    name: "Gaming",
    image:
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600",
  },
];

function CategorySection() {
  return (
    <section className="categories-section">

      <div className="section-heading">

        <h2>Shop by Category</h2>

        <a href="#">See all</a>

      </div>

      <div className="categories">

        {categories.map((category) => (
          <div
            className="category-card"
            key={category.name}
          >

            <img
              src={category.image}
              alt={category.name}
            />

            <div className="category-overlay">

              <h3>{category.name}</h3>

              <span>
                Shop now →
              </span>

            </div>

          </div>
        ))}

      </div>

    </section>
  );
}

export default CategorySection;