import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <section className="footer" id="footer">
      <div className="box-container">
        <div className="box">
          <Image src="/extra-img/logo.png" alt="Cara Store" width={120} height={40} />
          <h3>contact</h3>
          <p><span>address:</span> 123 washington DC, st. john san francisco</p>
          <p><span>phone:</span> +124-456-7890 +098-765-4321</p>
          <p><span>hours:</span> 10:00AM - 18:00PM mon - sat</p>
          <div className="follow">
            <h3>follow us</h3>
            <i className="fa-brands fa-facebook-f" />
            <i className="fa-brands fa-twitter" />
            <i className="fa-brands fa-instagram" />
            <i className="fa-brands fa-pinterest" />
            <i className="fa-brands fa-youtube" />
          </div>
        </div>
        <div className="box">
          <h3>about</h3>
          <Link href="/about">about us</Link>
          <Link href="#">delivery information</Link>
          <Link href="#">privacy policy</Link>
          <Link href="#">terms &amp; conditions</Link>
          <Link href="/contact">contact us</Link>
        </div>
        <div className="box">
          <h3>my account</h3>
          <Link href="#">sign up</Link>
          <Link href="#">view cart</Link>
          <Link href="#">my wallet</Link>
          <Link href="#">track my order</Link>
          <Link href="#">help</Link>
        </div>
        <div className="box">
          <h3>install app</h3>
          <p>from <Link href="#">app store</Link> or <Link href="#">google play</Link></p>
          <div className="foot-img">
            <Image src="/pay-img/app.jpg" alt="App Store" width={120} height={40} />
            <Image src="/pay-img/play.jpg" alt="Google Play" width={120} height={40} />
          </div>
          <p>secured payment gateway</p>
          <Image src="/pay-img/pay.png" alt="Payment methods" width={200} height={40} />
        </div>
      </div>
      <div className="credit">
        <p>cloned by <span>tuma.dev</span> | all rights reserved</p>
      </div>
    </section>
  );
}
