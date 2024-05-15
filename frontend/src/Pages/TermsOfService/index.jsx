
import React from 'react'
import { Container, Row, Col } from 'react-bootstrap';

const TermsOfService = () => {
    
    return <>
        <Container className='mt-5'>
            <Row>
                <Col>
                    <h1>Terms of Use</h1>
                    <hr />
                    <section>
                        <h2>1. Introduction</h2>
                        <p>Welcome to our tourism booking platform! By using our website, you agree to comply with and be bound by these terms and conditions. If you do not agree with any part of these terms, please do not use our platform.</p>
                    </section>
                    <section>
                        <h2>2. Copyright</h2>
                        <p>We only display content (images, descriptions) for which we have obtained permission from the copyright holders. This includes content from travel providers, rights-managed stock photos from sources like Unsplash and Freepik, etc.</p>
                        <p>User-generated content, such as reviews or photos, will be subject to clear terms regarding ownership and usage. By submitting content, users grant us the right to use, modify, and display the content on our platform.</p>
                        <p>Unauthorized use of any content on this site may violate copyright, trademark, and other laws.</p>
                    </section>
                    <section>
                        <h2>3. User Responsibilities</h2>
                        <p>Users must ensure that any content they upload does not infringe on the intellectual property rights of others.</p>
                        <p>Users are responsible for providing accurate information during the booking process and for keeping their account information up to date.</p>
                    </section>
                    <section>
                        <h2>4. Limitation of Liability</h2>
                        <p>Our platform is provided "as is" without any warranties, express or implied. We do not guarantee that our site will be available at all times or that it will be free from errors.</p>
                        <p>We are not liable for any indirect, incidental, or consequential damages arising out of or in connection with the use of our platform.</p>
                    </section>
                    <section>
                        <h2>5. Changes to the Terms</h2>
                        <p>We reserve the right to modify these terms at any time. Users will be notified of any changes, and continued use of the platform constitutes acceptance of the new terms.</p>
                    </section>
                </Col>
            </Row>
        </Container>
    </>

}

export default TermsOfService