import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import PopUpBase from '../../../components/pop-up/PopUpBase';
import { Controller, useForm } from 'react-hook-form';
import { Button, FloatingLabel, Form, Stack, Tooltip } from 'react-bootstrap';
import CircularProgress from '../../../components/CircularProgress';
import { TiDelete } from 'react-icons/ti';
import { pushError } from '../../../components/Toast';


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

export default function PopUpUpdateProfile(props) {
    const [avatar, setAvatar] = useState(props.user?.avatar || '');
    const [dirtyAvatar, setDirtyAvatar] = useState(false);

    function handleFileChange(e) {
        setDirtyAvatar(true)
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
        setAvatar(e.target.files[0]);
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
        const user = {
            name: data.name.trim()
        };

        props.onConfirm({ user: user, avatar: dirtyAvatar ? avatar : null });
    };

    useEffect(() => {
        if (!props.open) return;
        reset({
            name: props.user.name,
        });
        setAvatar(props.user?.avatar || '')
        setDirtyAvatar(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.open, props.user]);

    const disabled = !(isValid && (isDirty || dirtyAvatar));

    return (
        <PopUpBase
            open={props.open}
            onClose={props.onClose}
            title={
                <Stack>
                    <h4>Edit User Profile</h4>
                </Stack>
            }
            hideClose
            hideConfirm
            customActions={
                <Stack direction='horizontal' className="w-100 justify-content-between">
                    <Button style={{ width: "150px" }} variant="secondary" onClick={() => props.onClose?.()}>
                        Cancel
                    </Button>

                    <Button
                        style={{ width: "150px" }}
                        variant="primary"
                        onClick={handleSubmit((data) => {
                            handleConfirm(data);
                        })}
                        disabled={disabled || props.isLoading}
                    >
                        {props.isLoading && <CircularProgress />}
                        Save
                    </Button>
                </Stack>
            }
            desc={
                <Stack gap={3}>
                    <Stack direction='horizontal' gap={2} style={{ borderRadius: '10px', border: '1px dashed #C5C5C5', padding: '16px', alignItems: "center" }}>
                        <Stack>
                            {avatar ? (
                                <img src={getSvg(avatar).url} alt="" style={{ height: 40, maxHeight: 40 }} />
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
                                        setDirtyAvatar(true)
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
                                    padding: 8
                                }}
                            >
                                Upload Avatar
                            </Button>
                        </label>
                    </Stack>
                    <FloatingLabel label="Email">
                        <Form.Control type="email" value={props.user?.email} placeholder="name@example.com" disabled />
                    </FloatingLabel>

                    <FloatingLabel label="Username">
                        <Form.Control type="text" value={props.user?.username} placeholder="Username" disabled />
                    </FloatingLabel>

                    <Controller
                        name="name"
                        control={control}
                        rules={{
                            maxLength: {
                                value: 50,
                                message: "Max length is 50 characters",
                            },
                        }}
                        render={({ field, fieldState: { error } }) => (
                            <FloatingLabel label="Name">
                                <Form.Control {...field} type="text" placeholder="Name" />
                                {error && <div className="text-danger">{error.message}</div>}
                            </FloatingLabel>
                        )}
                    />
                </Stack>
            }
        />
    );
}

PopUpUpdateProfile.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    user: PropTypes.shape({
        id: PropTypes.number,
        email: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        name: PropTypes.string,
    }).isRequired,
    disabled: PropTypes.bool,
    isLoading: PropTypes.bool,
};

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
