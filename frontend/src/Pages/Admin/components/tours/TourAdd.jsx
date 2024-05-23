import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import PopUpBase from '../../../../components/pop-up/PopUpBase';
import { Controller, useForm } from 'react-hook-form';
import { Button, FloatingLabel, Form, Stack } from 'react-bootstrap';
import { pushError } from '../../../../components/Toast';

export default function PopUpAddTour({ open, onClose, onConfirm, isLoading }) {
  const [avatar, setAvatar] = useState('');
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

  const handleConfirm = (data) => {
    const tour = {
      title: data.title.trim(),
      country: data.country.trim(),
      city: data.city.trim(),
      price: data.price,
      ageRange: data.ageRange.trim(),
      duration: data.duration,
    };

    onConfirm({ tour, avatar: dirtyAvatar ? avatar : null });
  };

  useEffect(() => {
    if (!open) return;
    reset({
      title: '',
      country: '',
      city: '',
      price: '',
      ageRange: '',
      duration: '',
    });
    setAvatar('');
    setDirtyAvatar(false);
  }, [open, reset]);

  const disabled = !(isValid && (isDirty || dirtyAvatar));

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
                <img src={URL.createObjectURL(avatar)} alt="" style={{ height: 40, maxHeight: 40 }} />
              ) : (
                <div style={{ display: "flex", width: 32, height: 32, borderRadius: '100%', backgroundColor: '#EEEEEE', justifyContent: 'center', alignItems: 'center' }}>
                  Upload Icon
                </div>
              )}
            </Stack>
            <Stack flex={1} height={40} justifyContent="center" maxHeight={40}>
              {avatar ? (
                <Stack direction='horizontal' gap={1}>
                  <p className='body-1'>{avatar.name}</p>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => {
                      setAvatar('');
                      setDirtyAvatar(false);
                      const inputElement = document.getElementById('upload-input');
                      if (inputElement) {
                        inputElement.value = '';
                      }
                    }}
                  >
                    Remove
                  </Button>
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
                size="sm"
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

          <Controller
            name="ageRange"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FloatingLabel label="Age Range">
                <Form.Control {...field} type="text" placeholder="Age Range" />
                {error && <div className="text-danger">{error.message}</div>}
              </FloatingLabel>
            )}
          />

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
              <FloatingLabel label="Duration (days)">
                <Form.Control {...field} type="number" placeholder="Duration" />
                {error && <div className="text-danger">{error.message}</div>}
              </FloatingLabel>
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
