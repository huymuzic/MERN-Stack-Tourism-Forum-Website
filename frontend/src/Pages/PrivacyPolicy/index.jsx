import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link, Element, animateScroll as scroll } from "react-scroll";

const PrivacyPolicy = () => {
  useEffect(() => {
    scroll.scrollToTop();
  }, []);

  return (
    <>
      <Container className="mt-5">
        <Row>
          <Col>
            <h1>Privacy Policy</h1>
            <hr />
            <Element name="section1">
              <section>
                <h2>1. Introduction</h2>
                <br />
                <p>
                  We are committed to protecting your privacy. This policy
                  outlines how we collect, use, and safeguard your personal
                  information.
                </p>
              </section>
            </Element>
            <section>
              <h2>2. Information We Collect</h2>
              <br />
              <p>
                Personal Information: When you make a booking or create an
                account, we collect personal details such as your name, email
                address, phone number, and payment information.
              </p>
              <br />
              <p>
                Usage Data: We collect information on how you interact with our
                platform, such as your IP address, browser type, and pages
                visited.
              </p>
            </section>
            <section>
              <h2>3. How We Use Your Information</h2>
              <br />
              <p>
                To Provide Services: We use your personal information to process
                bookings, send confirmations, and provide customer support.
              </p>
              <br />
              <p>
                To Improve Our Platform: Usage data helps us understand how our
                platform is used, allowing us to make improvements.
              </p>
              <br />
              <p>
                Marketing: With your consent, we may send you promotional emails
                about new services, special offers, or other information we
                think you may find interesting.
              </p>
            </section>
            <section>
              <h2>4. Data Sharing and Security</h2>
              <br />
              <p>
                We take your privacy and data security very seriously. The
                personal information we collect, including email, username,
                password, and posts, is stored securely in our database.
              </p>
              <p>
                We use your email and username and password for authentication
                and to manage your account. We do not share your personal
                information with third parties without your consent
              </p>
              <p>
                We encryped your password so we do not have access to the actual
                password of your account. The password is hashed and store it in
                our database.
              </p>
            </section>
            <section>
              <h2>5. Your Rights</h2>
              <br />
              <p>
                Access and Correction: You have the right to access and correct
                your personal information held by us.
              </p>
              <br />
              <p>
                Consent Withdrawal: You can withdraw your consent to our use of
                your information at any time by contacting us.
              </p>
            </section>
            <section>
              <h2>6. Changes to the Privacy Policy</h2>
              <br />
              <p>
                We may update this policy from time to time. Any changes will be
                posted on this page, and you will be notified via email if the
                changes are significant.
              </p>
            </section>
            <section>
              <h2>7. Contact Us</h2>
              <br />
              <p>
                If you have any questions about this privacy policy, please
                contact us at cosmictravel123@gmail.com.
              </p>
            </section>
          </Col>
        </Row>
      </Container>
      {/* Links to sections */}
      <Link to="section1" smooth={true} duration={500}></Link>
    </>
  );
};

export default PrivacyPolicy;
