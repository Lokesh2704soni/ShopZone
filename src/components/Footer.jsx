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

          {/* Social Icons */}
          <div className="footer-socials">

            {/* GitHub */}
            <a
              href="https://github.com/Lokesh2704soni"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              title="GitHub"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                width="21"
                height="21"
              >
                <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.53 2.87 8.37 6.84 9.72.5.1.68-.22.68-.49v-1.72c-2.78.62-3.37-1.22-3.37-1.22-.46-1.2-1.11-1.52-1.11-1.52-.91-.64.07-.63.07-.63 1 .08 1.53 1.07 1.53 1.07.9 1.58 2.36 1.12 2.94.86.09-.67.35-1.12.64-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.05A9.2 9.2 0 0 1 12 7.96c.85 0 1.71.12 2.51.36 1.91-1.32 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.35 4.81-4.58 5.06.36.32.68.95.68 1.92v2.84c0 .27.18.59.69.49A10.27 10.27 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                width="21"
                height="21"
              >
                <path d="M20.45 20.45h-3.56v-5.58c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.68H9.35V8.99h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.26 2.37 4.26 5.46v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM3.56 20.45h3.56V8.99H3.56v11.46ZM22 0H2C.9 0 0 .9 0 2v20c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2Z" />
              </svg>
            </a>

            {/* Email */}
            <a
              href="mailto:shopzone@example.com"
              aria-label="Email"
              title="Email"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                width="21"
                height="21"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
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