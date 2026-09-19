function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="footer">

      <div className="footer-main">

        {/* Brand */}
        <div className="footer-brand">
          <h2>
            Shop<span>Zone</span>
          </h2>

          <p>
            A modern shopping experience built
            for simplicity, speed and convenience.
          </p>

          <div className="footer-socials">
            <a
              href="https://github.com/Lokesh2704soni"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>

            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>

            <a href="mailto:shopzone@example.com">
              Email
            </a>
          </div>
        </div>

        {/* Shop */}
        <div className="footer-column">
          <h3>Shop</h3>

          <a href="/">Electronics</a>
          <a href="/">Fashion</a>
          <a href="/">Home</a>
          <a href="/">Gaming</a>
        </div>

        {/* Customer Care */}
        <div className="footer-column">
          <h3>Customer Care</h3>

          <a href="/">Your Orders</a>
          <a href="/">Returns</a>
          <a href="/">Help Center</a>
          <a href="/">Contact Us</a>
        </div>

        {/* Company */}
        <div className="footer-column">
          <h3>ShopZone</h3>

          <a href="/">About Us</a>
          <a href="/">Careers</a>
          <a href="/">Privacy</a>
          <a href="/">Terms & Conditions</a>
        </div>

      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">

        <p>
          © 2026 ShopZone. All rights reserved.
        </p>

        <button
          className="back-to-top"
          onClick={scrollToTop}
        >
          ↑ Back to top
        </button>

      </div>

    </footer>
  );
}

export default Footer;