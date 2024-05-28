import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import PopUpBase from "../../../../components/pop-up/PopUpBase";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  FloatingLabel,
  Form,
  Stack,
  InputGroup,
  Row,
  Col,
} from "react-bootstrap";
import { pushError } from "../../../../components/Toast";
import { FaUpload } from "react-icons/fa";

export default function PopUpAddTour({ open, onClose, onConfirm, isLoading }) {
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [dirtyAvatar, setDirtyAvatar] = useState(false);

  function handleFileChange(e) {
    setDirtyAvatar(true);
    const file = e.target.files?.[0];

    if (!file) return;
    if (!file.type.match(/svg|png|jpeg|jpg|gif/)) {
      pushError("File type is not supported");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      pushError("Maximum file size is 10MB");
      return;
    }

    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  const {
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { isValid, isDirty },
  } = useForm({
    mode: "all",
  });

  const handleConfirm = (data) => {
    const tour = {
      title: data.title.trim(),
      country: data.country.trim(),
      city: data.city.trim(),
      description: data.description.trim(),
      price: parseFloat(data.price),
      ageRange: `${data.ageFrom}-${data.ageTo}`,
      duration: parseInt(data.duration, 10),
      featured: data.featured,
    };

    onConfirm({ tour, avatar: dirtyAvatar ? avatar : null });
  };

  useEffect(() => {
    if (!open) return;
    reset({
      title: "",
      country: "",
      city: "",
      description: "",
      price: "",
      ageFrom: "",
      ageTo: "",
      duration: "",
      featured: false,
    });
    setAvatar("");
    setAvatarPreview("");
    setDirtyAvatar(false);
  }, [open, reset]);

  const allFields = watch([
    "title",
    "country",
    "city",
    "description",
    "price",
    "ageFrom",
    "ageTo",
    "duration",
  ]);
  const allFieldsFilled = allFields.every((field) => field);

  const disabled = !(isValid && (isDirty || dirtyAvatar) && allFieldsFilled);

  return (
    <PopUpBase
      open={open}
      onClose={onClose}
      title={
        <Stack>
          <h4>Add New Tour</h4>
        </Stack>
      }
      hideClose
      hideConfirm
      customActions={
        <Stack direction="horizontal" className="w-100 justify-content-between">
          <Button
            style={{ width: "150px" }}
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            style={{ width: "150px" }}
            variant="primary"
            onClick={handleSubmit(handleConfirm)}
            disabled={disabled || isLoading}
          >
            Save
          </Button>
        </Stack>
      }
      desc={
        <Stack gap={2}>
          <Stack
            direction="horizontal"
            gap={2}
            style={{
              borderRadius: "10px",
              border: "1px dashed #C5C5C5",
              padding: "16px",
              alignItems: "center",
            }}
          >
            <Stack>
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt=""
                  style={{ height: 40, maxHeight: 40 }}
                />
              ) : (
                <div
                  style={{
                    display: "flex",
                    width: 32,
                    height: 32,
                    borderRadius: "100%",
                    backgroundColor: "#EEEEEE",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FaUpload />
                </div>
              )}
            </Stack>
            <Stack flex={1} height={40} justifyContent="center" maxHeight={40}>
              {avatar ? (
                <Stack direction="horizontal" gap={1}>
                  <p className="body-1">{avatar.name}</p>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => {
                      setAvatar("");
                      setAvatarPreview("");
                      setDirtyAvatar(false);
                      const inputElement =
                        document.getElementById("upload-input");
                      if (inputElement) {
                        inputElement.value = "";
                      }
                    }}
                  >
                    Remove
                  </Button>
                </Stack>
              ) : (
                <>
                  <h6>Upload tour image</h6>
                  <p className="body-2" style={{ color: "gray" }}>
                    SVG, PNG, JPG, GIF | 10MB max.
                  </p>
                </>
              )}
            </Stack>
            <Button
              variant="outline-primary"
              as="label"
              size="sm"
              style={{ fontSize: 12, padding: 8 }}
            >
              Upload Image
              <input
                type="file"
                accept=".svg, .png, .jpg, .gif"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </Button>
          </Stack>

          <Controller
            name="title"
            control={control}
            rules={{
              required: "Title is required",
              maxLength: {
                value: 100,
                message: "Max length is 100 characters",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <FloatingLabel label="Title">
                <Form.Control {...field} type="text" placeholder="Title" />
                {error && <div className="text-danger">{error.message}</div>}
              </FloatingLabel>
            )}
          />

          <Controller
            name="country"
            control={control}
            rules={{
              required: "Country is required",
            }}
            render={({ field, fieldState: { error } }) => (
              <FloatingLabel label="Country">
                <Form.Control {...field} type="text" placeholder="Country" />
                {error && <div className="text-danger">{error.message}</div>}
              </FloatingLabel>
            )}
          />

          <Controller
            name="city"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FloatingLabel label="City">
                <Form.Control {...field} type="text" placeholder="City" />
                {error && <div className="text-danger">{error.message}</div>}
              </FloatingLabel>
            )}
          />

          <Controller
            name="description"
            control={control}
            rules={{
              required: "Description is required",
            }}
            render={({ field, fieldState: { error } }) => (
              <FloatingLabel label="Description">
                <Form.Control
                  {...field}
                  type="text"
                  placeholder="Description"
                />
                {error && <div className="text-danger">{error.message}</div>}
              </FloatingLabel>
            )}
          />

          <Row>
            <Col>
              <InputGroup>
                <InputGroup.Text>$</InputGroup.Text>
                <Controller
                  name="price"
                  control={control}
                  rules={{
                    required: "Price is required",
                    min: {
                      value: 0,
                      message: "Price cannot be negative",
                    },
                    max: {
                      value: 100000,
                      message: "Price cannot be more than 100000$!!",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <FloatingLabel label="Price">
                        <Form.Control
                          {...field}
                          type="number"
                          placeholder="Price"
                        />
                      </FloatingLabel>
                    </>
                  )}
                />
              </InputGroup>
              <Controller
                name="price"
                control={control}
                render={({ fieldState: { error } }) =>
                  error && <div className="text-danger">{error.message}</div>
                }
              />
            </Col>
            <Col>
              <InputGroup>
                <Controller
                  name="duration"
                  control={control}
                  rules={{
                    required: "Duration is required",
                    min: {
                      value: 1,
                      message: "Duration must be at least 1 day",
                    },
                    max: {
                      value: 100,
                      message: "Duration must be under 100 day!",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <FloatingLabel label="Duration">
                        <Form.Control
                          {...field}
                          type="number"
                          placeholder="Duration"
                        />
                      </FloatingLabel>
                      <InputGroup.Text>days</InputGroup.Text>
                    </>
                  )}
                />
              </InputGroup>
              <Controller
                name="duration"
                control={control}
                render={({ fieldState: { error } }) =>
                  error && <div className="text-danger">{error.message}</div>
                }
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <Controller
                name="ageFrom"
                control={control}
                rules={{
                  required: "From Age is required",
                  min: {
                    value: 0,
                    message: "Age must be at least 0",
                  },
                  max: {
                    value: 100,
                    message: "Age must be under 100!",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <FloatingLabel label="From Age">
                    <Form.Control
                      {...field}
                      type="number"
                      placeholder="From Age"
                    />
                    {error && (
                      <div className="text-danger">{error.message}</div>
                    )}
                  </FloatingLabel>
                )}
              />
            </Col>
            <Col>
              <Controller
                name="ageTo"
                control={control}
                rules={{
                  required: "To Age is required",
                  min: {
                    value: 0,
                    message: "Age must be at least 0",
                  },
                  max: {
                    value: 100,
                    message: "Age must be under 100!",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <FloatingLabel label="To Age">
                    <Form.Control
                      {...field}
                      type="number"
                      placeholder="To Age"
                    />
                    {error && (
                      <div className="text-danger">{error.message}</div>
                    )}
                  </FloatingLabel>
                )}
              />
            </Col>
          </Row>

          <Controller
            name="featured"
            control={control}
            render={({ field }) => (
              <Form.Group>
                <Form.Check
                  type="checkbox"
                  label="Featured"
                  {...field}
                  checked={field.value}
                />
              </Form.Group>
            )}
          />
        </Stack>
      }
    />
  );
}

PopUpAddTour.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};
