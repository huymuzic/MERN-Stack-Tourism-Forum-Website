import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import PopUpBase from '../../../../components/pop-up/PopUpBase';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Button, FloatingLabel, Form, Stack, InputGroup } from 'react-bootstrap';
import { TiDelete } from 'react-icons/ti';
import { pushError } from '../../../../components/Toast';
import { baseUrl } from "../../../../config";

function getSvg(svg) {
  const _svg = {
    name: '',
    url: '',
  };

  if (typeof svg === 'string') {
    _svg.name = svg.split('/').pop() ?? '';
    _svg.url = svg;
  } else {
    _svg.name = svg.name;
    _svg.url = URL.createObjectURL(svg);
  }

  return _svg;
}

function UploadIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" fill="none" viewBox="0 0 16 15">
      <path
        fill="currentColor"
        d="M4 5.833a3.667 3.667 0 017.272-.676.667.667 0 00.445.511 3.335 3.335 0 01-1.05 6.498.667.667 0 000 1.334 4.667 4.667 0 001.83-8.96 5.002 5.002 0 00-9.826 1.493A4 4 0 004.667 13.5a.667.667 0 000-1.334 2.667 2.667 0 01-1.034-5.125.667.667 0 00.401-.705A3.704 3.704 0 014 5.833z"
      ></path>
      <path
        fill="currentColor"
        d="M7.557 9.001a.667.667 0 01.886 0l1 .89a.667.667 0 01-.776 1.075v3.2a.667.667 0 11-1.333 0v-3.2a.667.667 0 01-.777-1.076l1-.889z"
      ></path>
    </svg>
  );
}

export default function PopUpUpdateTour({ open, onClose, onConfirm, isLoading, tour }) {
  const [avatar, setAvatar] = useState(tour?.photo || '');
  const [dirtyAvatar, setDirtyAvatar] = useState(false);

  function handleFileChange(e) {
    setDirtyAvatar(true);
    const file = e.target.files?.[0];

    if (!file) return;
    if (!file.type.match(/svg|png|jpeg|jpg|gif/)) {
      pushError('File type is not supported');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      pushError('Maximum file size is 10MB');
      return;
    }
    setAvatar(file);
  }

  const {
    handleSubmit,
    reset,
    control,
    formState: { isValid, isDirty },
  } = useForm({
    mode: 'all',
  });

  const watchedFields = useWatch({
    control,
    name: ["title", "country", "city", "price", "ageRangeFrom", "ageRangeTo", "duration"],
  });

  const handleConfirm = (data) => {
    const tourData = {
      _id: tour._id,
      title: data.title.trim(),
      country: data.country.trim(),
      city: data.city.trim(),
      price: parseFloat(data.price),
      ageRange: `${data.ageRangeFrom}-${data.ageRangeTo}`,
      duration: parseInt(data.duration, 10),
      photo: avatar
    };
    
    onConfirm(tourData);
  };
    
  useEffect(() => {
    if (!open) return;
    const [ageRangeFrom, ageRangeTo] = tour.ageRange.split('-');
    reset({
      title: tour.title,
      country: tour.country,
      city: tour.city,
      price: tour.price,
      ageRangeFrom,
      ageRangeTo,
      duration: tour.duration,
    });
    setAvatar(tour?.photo || '');
    setDirtyAvatar(false);
  }, [open, tour, reset]);

  const isDataUnchanged = () => {
    const [ageRangeFrom, ageRangeTo] = tour.ageRange.split('-');
    return (
      watchedFields.title?.trim() === tour.title &&
      watchedFields.country?.trim() === tour.country &&
      watchedFields.city?.trim() === tour.city &&
      parseFloat(watchedFields.price) === tour.price &&
      watchedFields.ageRangeFrom === ageRangeFrom &&
      watchedFields.ageRangeTo === ageRangeTo &&
      parseInt(watchedFields.duration, 10) === tour.duration &&
      !dirtyAvatar
    );
  };

  const disabled = !(isValid && (isDirty || dirtyAvatar)) || isDataUnchanged();

  return (
    <PopUpBase
      open={open}
      onClose={onClose}
      title={
        <Stack>
          <h4>Edit Tour</h4>
        </Stack>
      }
      hideClose
      hideConfirm
      customActions={
        <Stack direction='horizontal' className="w-100 justify-content-between">
          <Button style={{ width: "150px" }} variant="secondary" onClick={onClose}>
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
        <Stack gap={3}>
          <Stack direction='horizontal' gap={2} style={{ borderRadius: '10px', border: '1px dashed #C5C5C5', padding: '16px', alignItems: "center" }}>
            <Stack>
              {avatar ? (
                <img src={typeof avatar === 'string' ? `${baseUrl}/api/v1/tours/images/${avatar}` : URL.createObjectURL(avatar)} alt="" style={{ height: 40, maxHeight: 40 }} />
              ) : (
                <div style={{ display: "flex", width: 32, height: 32, borderRadius: '100%', backgroundColor: '#EEEEEE', justifyContent: 'center', alignItems: 'center' }}>
                  <UploadIcon />
                </div>
              )}
            </Stack>
            <Stack flex={1} height={40} justifyContent="center" maxHeight={40}>
              {avatar ? (
                <Stack direction='horizontal' gap={1}>
                  <p className='body-1'>{getSvg(avatar || '').name}</p>
                  <TiDelete fontSize={24} style={{ cursor: "pointer" }} onClick={() => {
                    setAvatar('');
                    const inputElement = document.getElementById('upload-input');
                    if (inputElement) {
                      inputElement.value = '';
                    }
                  }} />
                </Stack>
              ) : (
                <>
                  <h6>Upload logo</h6>
                  <p className="body-2" style={{ color: 'gray' }}>
                    SVG, PNG, JPG, GIF | 10MB max.
                  </p>
                </>
              )}
            </Stack>
            <label htmlFor="upload-input">
              <input
                id="upload-input"
                type="file"
                accept=".svg, .png, .jpg, .gif"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <Button
                variant="outline-primary"
                as="span"
                style={{
                  fontSize: 12,
                  padding: 8,
                }}
              >
                Upload Avatar
              </Button>
            </label>
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

          <Stack direction='horizontal' gap={3}>
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
                }}
                render={({ field, fieldState: { error } }) => (
                  <FloatingLabel label="Price">
                    <Form.Control {...field} type="number" placeholder="Price" />
                    {error && <div className="text-danger">{error.message}</div>}
                  </FloatingLabel>
                )}
              />
            </InputGroup>

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
                }}
                render={({ field, fieldState: { error } }) => (
                  <FloatingLabel label="Duration">
                    <Form.Control {...field} type="number" placeholder="Duration" />
                    {error && <div className="text-danger">{error.message}</div>}
                  </FloatingLabel>
                )}
              />
              <InputGroup.Text>days</InputGroup.Text>
            </InputGroup>
          </Stack>

          <Stack direction='horizontal' gap={3}>
            <Controller
              name="ageRangeFrom"
              control={control}
              rules={{
                required: "Age Range From is required",
                min: {
                  value: 0,
                  message: "Age Range cannot be negative",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <FloatingLabel label="Age Range From">
                  <Form.Control {...field} type="number" placeholder="From" />
                  {error && <div className="text-danger">{error.message}</div>}
                </FloatingLabel>
              )}
            />

            <Controller
              name="ageRangeTo"
              control={control}
              rules={{
                required: "Age Range To is required",
                min: {
                  value: 0,
                  message: "Age Range cannot be negative",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <FloatingLabel label="Age Range To">
                  <Form.Control {...field} type="number" placeholder="To" />
                  {error && <div className="text-danger">{error.message}</div>}
                </FloatingLabel>
              )}
            />
          </Stack>
        </Stack>
      }
    />
  );
}

PopUpUpdateTour.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  tour: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    city: PropTypes.string,
    price: PropTypes.number,
    ageRange: PropTypes.string,
    duration: PropTypes.number,
    photo: PropTypes.string,
  }).isRequired,
  isLoading: PropTypes.bool,
};
