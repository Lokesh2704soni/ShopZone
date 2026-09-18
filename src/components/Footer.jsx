function Footer() {
  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer>
      <div
        className="back-top"
        onClick={handleBackToTop}
      >
        Back to top ↑
      </div>

      <div className="footer-main">

        <div>
          <h3>Get to Know Us</h3>
          <p>About ShopZone</p>
          <p>Careers</p>
          <p>Press Releases</p>
          <p>Our Technology</p>
        </div>

        <div>
          <h3>Connect With Us</h3>
          <p>Facebook</p>
          <p>Instagram</p>
          <p>Twitter</p>
          <p>LinkedIn</p>
        </div>

        <div>
          <h3>Make Money With Us</h3>
          <p>Sell on ShopZone</p>
          <p>Become an Affiliate</p>
          <p>Advertise Products</p>
          <p>Become a Seller</p>
        </div>

        <div>
          <h3>Let Us Help You</h3>
          <p>Your Account</p>
          <p>Your Orders</p>
          <p>Shipping Rates</p>
          <p>Help Center</p>
        </div>

      </div>

      <div className="footer-bottom">
        <h2>ShopZone</h2>

        <p>
          © 2026 ShopZone. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;