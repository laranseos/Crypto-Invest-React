import styles from "../style";
import { Billing, Business, CardDeal, Clients, CTA, Footer, Navbar, Stats, Testimonials, Hero } from "../components";
import Login_Signup from "./Login-Signup";
import useScrollToTop from "../components/useScrollToTop";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Landing = () => {
  const { shown, scrollToTop } = useScrollToTop(300);

  return (
  <div className="bg-primary w-full overflow-hidden">
    <div className={`${styles.paddingX} ${styles.flexCenter}`}>
      <div className={`${styles.boxWidth}`}>
        <Navbar />
        <ToastContainer />
        <Login_Signup />
      </div>
    </div>

    <div className={`mt-20 bg-primary ${styles.flexStart}`}>
      <div className={`${styles.boxWidth}`}>
        <Hero />
      </div>
    </div>
    
    <div className={`bg-primary ${styles.paddingX} ${styles.flexCenter}`}>
      <div className={`${styles.boxWidth}`}>
        <Stats />
        <Business />
        <Billing />
        {/* <CardDeal /> */}
        <Testimonials />
        <Clients />
        <CTA />
        <Footer />
      </div>
    </div>

    <button
      aria-label='scroll to top'
      onClick={scrollToTop}
      className={`${
        shown ? 'scale-100 animate-bounce' : 'scale-0'
      } w-12 h-12 transition-transform duration-200 flex fixed right-10 bottom-10 bg-gray-800 rounded-full shadow-lg shadow-gray-900 justify-center items-center`}
    >
      <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={2}
          stroke='currentColor'
          className='w-6 h-6  stroke-white'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M4.5 15.75l7.5-7.5 7.5 7.5' />
        </svg>
    </button>
  </div>
  );
};

export default Landing;
