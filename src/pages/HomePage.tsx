import Layout from '../components/Layout';
import Navbar from '../components/Navbar';
import Hero from '../sections/Hero';
import About from '../sections/About';
import Services from '../sections/Services';
import Projects from '../sections/Projects';
import TechStack from '../sections/TechStack';
import Contact from '../sections/Contact';
import Footer from '../sections/Footer';

export default function HomePage() {
  return (
    <Layout>
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Projects />
      <TechStack />
      <Contact />
      <Footer />
    </Layout>
  );
}
