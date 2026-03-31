import Image from 'next/image';
import Newsletter from '@/components/Newsletter';
import FeaturesSection from '@/components/FeaturesSection';

export const metadata = {
  title: 'Cara Store - About',
  description: 'All you need to know about us',
};

export default function AboutPage() {
  return (
    <>
      <section className="about-banner">
        <div className="banner">
          <div className="content">
            <h1>#KnowUs</h1>
            <p>all you need to know about us here!</p>
          </div>
        </div>
      </section>

      <section className="about" id="about">
        <div className="box-container">
          <div className="box image">
            <Image src="/about-img/a6.jpg" alt="About Cara Store" width={500} height={400} />
          </div>
          <div className="box text">
            <h1>who we are?</h1>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nihil distinctio excepturi ad architecto,
              beatae vel deleniti quis ab incidunt illo eligendi accusamus in aut. Explicabo officiis consequuntur
              illo omnis nemo commodi soluta atque saepe esse. Repudiandae vel aperiam qui fugit.
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti, asperiores quae reiciendis sequi
              architecto enim ratione dicta voluptas. Ipsum sit illum quod repudiandae. Incidunt provident deserunt,
              voluptatum amet totam aut.
            </p>
          </div>
        </div>
      </section>

      <section className="video">
        <div className="video-desc">
          <h1>download our <a href="#">app</a></h1>
        </div>
        <div className="video-play">
          <video src="/about-img/1.mp4" autoPlay loop muted playsInline />
        </div>
      </section>

      <FeaturesSection />
      <Newsletter />
    </>
  );
}
