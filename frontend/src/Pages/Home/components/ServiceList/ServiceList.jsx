import { useState, useEffect } from "react";
import ServiceCard from "./ServiceCard";
import { Col, Container } from "react-bootstrap";
import { baseUrl, environment } from "../../../../config";
import CircularProgress from "../../../../components/CircularProgress";

const ServiceList = () => {
  const [serviceImages, setServiceImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchData = async () => {
    const response = await fetch(`${baseUrl}/api/v1/images/`);
    const Images = await response.json();
    if (Images && Images.data) {
      if (environment == "PROD") {
        setServiceImages(
          Images.data.filter((item) => item.type == "Service image")
        );
      } else {
        setServiceImages(
          Images.data
            .filter((item) => item.type == "Service image")
            .map((item) => {
              return {
                ...item,
                photo: `./src${item.photo}`,
              };
            })
        );
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {isLoading ? (
        <Container className="d-flex justify-content-center">
          <CircularProgress />
        </Container>
      ) : (
        <>
          {serviceImages.map((item, index) => (
            <Col lg="3" md="6" sm="12" key={index}>
              <ServiceCard item={item} />
            </Col>
          ))}
        </>
      )}
    </>
  );
};

export default ServiceList;
