import { Link } from 'react-router-dom';
import './Footer.scss';

export const Footer: React.FC = () => {
  return (
    <div className="footer">
      <div className="footer__links">
        <img src="./logo.svg" alt="logo" className="footer__logo" />
        <div className="footer__links-container body-font-2">
          <Link to="/about" className="footer__link">About Us</Link>
          <Link to="/faqs" className="footer__link">FAQs</Link>
          <Link to="/contact" className="footer__link">Contact Us</Link>
          <Link to="/social-media" className="footer__link">Social Media</Link>
          <Link to="/feedback" className="footer__link">FeedBack</Link>
        </div>

        <div className="footer__links-container body-font-2">
          <Link to="/newsletter" className="footer__link">Newsletter</Link>
          <Link to="/updates" className="footer__link">Updates</Link>
          <Link to="/events" className="footer__link">Events</Link>
          <Link to="/blog-posts" className="footer__link">Blog Posts</Link>
          <Link to="/community" className="footer__link">Community</Link>
        </div>
      </div>
      <div className="footer__subscribe">
        <div className="footer__subscribe-top">
          <h5 className="footer__subscribe-title">Subscribe</h5>
          <span className="footer__subscribe-info body-font-2">
            Join our newsletter to stay updated on features and releases.
          </span>
        </div>
        <div className="footer__subscribe-bottom">
          <form className="footer__subscribe-form">
            <input
              type="email"
              className="footer__subscribe-input body-font-1"
              placeholder="Your Email Here"
              required
            />
            <button type="submit" className="footer__subscribe-button button-font">
              Send
            </button>
          </form>
          <span className="footer__subscribe-terms body-font-2">
            By subscribing, you agree to our Privacy Policy and consent to receive updates.
          </span>
        </div>
      </div>
    </div>
  )
};
