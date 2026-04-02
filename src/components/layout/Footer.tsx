import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <section className="footer" id="footer">
      <div className="box-container">
        <div className="box">
          <Image src="/extra-img/logo.webp" alt="Cara Stores" width={120} height={40} />
          <h3>Visit Cara Stores</h3>
          <p><span>Address:</span> Westlands, Nairobi, Kenya</p>
          <p><span>Phone:</span> +254 712 345 678</p>
          <p><span>Hours:</span> Mon - Sat, 9:00 AM to 7:00 PM</p>
          <div className="follow">
            <h3>Follow Us</h3>
            <div className="social-links">
              <Link href="#" aria-label="Cara on Instagram"><i className="fa-brands fa-instagram" /></Link>
              <Link href="#" aria-label="Cara on TikTok"><i className="fa-brands fa-tiktok" /></Link>
              <Link href="#" aria-label="Cara on YouTube"><i className="fa-brands fa-youtube" /></Link>
              <Link href="#" aria-label="Cara on Pinterest"><i className="fa-brands fa-pinterest" /></Link>
            </div>
          </div>
        </div>
        <div className="box">
          <h3>Company</h3>
          <Link href="/about">About us</Link>
          <Link href="/blog">Editorial journal</Link>
          <Link href="#">Privacy policy</Link>
          <Link href="#">Terms and conditions</Link>
          <Link href="/contact">Press and partnerships</Link>
        </div>
        <div className="box">
          <h3>Customer Care</h3>
          <Link href="/shop">Shop all</Link>
          <Link href="#">Order tracking</Link>
          <Link href="#">Size and fit guide</Link>
          <Link href="#">Shipping and returns</Link>
          <Link href="/contact">Support center</Link>
        </div>
        <div className="box">
          <h3>Payment options</h3>
          <p>Cara Kenya currently accepts mobile money only.</p>
          <p><strong>M-Pesa</strong></p>
          <p><strong>Airtel Money</strong></p>
          <p>Card and bank payments are not supported on this platform.</p>
        </div>
      </div>
      <div className="credit">
        <p>Copyright 2026 Cara Stores. Built for modern shopping experiences.</p>
      </div>
    </section>
  );
}
