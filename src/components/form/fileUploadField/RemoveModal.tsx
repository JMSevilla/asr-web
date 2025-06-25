import { Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { Modal, Button } from '../..';



interface Props {
    prefix: string;
    isOpen: boolean;
    name: string;
    onRemove: () => void;
    onClose: () => void;
}

export const RemoveModal: React.FC<Props> = ({
    prefix,
    isOpen,
    name,
    onRemove,
    onClose,
}) => {
    const { labelByKey, buttonByKey, htmlByKey } = useGlobalsContext();
    const removeButton = buttonByKey(`${prefix}_modal_remove`);
    const cancelButton = buttonByKey(`${prefix}_modal_cancel`);
    const modalText = htmlByKey(`${prefix}_modal_text`, { 'ta_file_delete': name });

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            topCloseButton
            maxWidth="sm"
            aria-label={labelByKey('-')}
        >
            <Stack spacing={3}>
                <Typography textAlign="center" mb={3}>
                    {modalText}
                </Typography>
                <Button {...removeButton} fullWidth onClick={handleRemove}>
                    {removeButton?.text || `[[${prefix}_modal_remove]]`}
                </Button>
                <Button {...cancelButton} fullWidth onClick={handleClose}>
                    {cancelButton?.text || `[[${prefix}_modal_cancel]]`}
                </Button>
            </Stack>
        </Modal>
    );

    async function handleRemove() {
        onRemove()
    }

    function handleClose() {
        onClose();
    }
};
