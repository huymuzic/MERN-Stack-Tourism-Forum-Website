import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import PopUpBase from '../../../../components/pop-up/PopUpBase';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Button, FloatingLabel, Form, Stack, InputGroup } from 'react-bootstrap';
import { pushError } from '../../../../components/Toast';
import { TiDelete } from 'react-icons/ti';
import { FaUpload } from 'react-icons/fa';

export default function PopUpAddTour({ open, onClose, onConfirm, isLoading }) {
  const [avatar, setAvatar] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
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
    setAvatarPreview(URL.createObjectURL(file));
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
    const tour = {
      title: data.title.trim(),
      country: data.country.trim(),
      city: data.city.trim(),
      price: parseFloat(data.price),
      ageRange: `${data.ageRangeFrom}-${data.ageRangeTo}`,
      duration: parseInt(data.duration, 10),
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
      ageRangeFrom: '',
      ageRangeTo: '',
      duration: '',
    });
    setAvatar('');
    setAvatarPreview('');
    setDirtyAvatar(false);
  }, [open, reset]);

  const isDataUnchanged = () => {
    const [ageRangeFrom, ageRangeTo] = ['', ''];
    return (
      watchedFields.title?.trim() === '' &&
      watchedFields.country?.trim() === '' &&
      watchedFields.city?.trim() === '' &&
      parseFloat(watchedFields.price) === '' &&
      watchedFields.ageRangeFrom === ageRangeFrom &&
      watchedFields.ageRangeTo === ageRangeTo &&
      parseInt(watchedFields.duration, 10) === '' &&
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
              {avatarPreview ? (
                <img src={avatarPreview} alt="" style={{ height: 40, maxHeight: 40 }} />
              ) : (
                <div style={{ display: "flex", width: 32, height: 32, borderRadius: '100%', backgroundColor: '#EEEEEE', justifyContent: 'center', alignItems: 'center' }}>
                  <FaUpload />
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
                      setAvatarPreview('');
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
            <Button variant="outline-primary" as="label" size="sm" style={{ fontSize: 12, padding: 8 }}>
              Upload Avatar
              <input
                type="file"
                accept=".svg, .png, .jpg, .gif"
                style={{ display: 'none' }}
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

PopUpAddTour.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};
