import { useEffect } from 'react';
import PropTypes from 'prop-types';
import PopUpBase from '../../../components/pop-up/PopUpBase';
import { Controller, useForm } from 'react-hook-form';
import { Button, FloatingLabel, Form, Stack } from 'react-bootstrap';
import CircularProgress from '../../../components/CircularProgress';

export default function PopUpUpdateProfile(props) {
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

        props.onConfirm(user);
    };

    useEffect(() => {
        if (!props.open) return;
        reset({
            name: props.user.name,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.open, props.user]);
    const disabled = !(isValid && isDirty);

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
