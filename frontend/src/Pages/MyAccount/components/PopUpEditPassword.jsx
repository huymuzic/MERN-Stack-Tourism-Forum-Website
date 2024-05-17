import { useEffect } from 'react'
import PopUpBase from '../../../components/pop-up/PopUpBase'
import { Button, FloatingLabel, Form, Stack } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form';

function validatePassword(value) {
    if (value.length < 8) return "Password must be at least 8 characters long.";
    if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter.";
    if (!/[a-z]/.test(value)) return "Password must contain at least one lowercase letter.";
    if (!/\d/.test(value)) return "Password must contain at least one number.";
    if (!/[!@#\$%\^&\*]/.test(value)) return "Password must contain at least one special character (!@#$%^&*).";
    return true;
}
export default function PopUpEditPassword(props) {
    const {
        handleSubmit,
        reset,
        control,
        // watch,
        setError,
        formState: { isValid, isDirty },
    } = useForm({
        mode: 'all',
    });

    const handleConfirm = (data) => {
        if (data.newPassword !== data.retypeNewPassword) {
            setError('retypeNewPassword', { type: 'manual', message: 'Passwords do not match.' });
            return;
        }

        props.onConfirm({ currentPassword: data.currentPassword, newPassword: data.retypeNewPassword });
    };

    const disabled = !(isValid && isDirty);

    useEffect(() => {
        if (!props.open) return;
        reset({
            currentPassword: "",
            newPassword: "",
            retypeNewPassword: ""
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.open]);
    return (
        <PopUpBase
            open={props.open}
            onClose={props.onClose}
            title={
                <Stack>
                    <h4>Edit Password</h4>
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
                        Save
                    </Button>
                </Stack>
            }

            desc={
                <Stack gap={3}>
                    <Controller
                        name="currentPassword"
                        control={control}
                        rules={{
                            required: {
                                value: true,
                                message: 'Please enter your current password.',
                            },
                        }}
                        render={({ field, fieldState: { error } }) => (
                            <FloatingLabel label="Current Password">
                                <Form.Control {...field} type="password" />
                                {error && <div className="text-danger">{error.message}</div>}
                            </FloatingLabel>
                        )}
                    />

                    <Controller
                        name="newPassword"
                        control={control}
                        rules={{
                            required: {
                                value: true,
                                message: 'Please enter your new password.',
                            },
                            validate: validatePassword
                        }}
                        render={({ field, fieldState: { error } }) => (
                            <FloatingLabel label="New Password">
                                <Form.Control {...field} type="password" />
                                {error && <div className="text-danger">{error.message}</div>}
                            </FloatingLabel>
                        )}
                    />

                    <Controller
                        name="retypeNewPassword"
                        control={control}
                        rules={{
                            required: {
                                value: true,
                                message: 'Please retype your new password.',
                            },
                            validate: validatePassword
                        }}
                        render={({ field, fieldState: { error } }) => (
                            <FloatingLabel label="Retype New Password">
                                <Form.Control {...field} type="password" />
                                {error && <div className="text-danger">{error.message}</div>}
                            </FloatingLabel>
                        )}
                    />
                </Stack>
            }
        />
    )
}
