import React, { useState } from 'react';
import { FormInputValues, ModalProps } from './assetcontroller/types';
import { toast } from 'react-toastify'

export const Modal = ({ closeModal, handleSubmit, modalContent }: ModalProps) => {

    if (!modalContent?.message) {
        return null; // Don't render the modal if there's no content
    }

    const [inputValues, setInputValues] = useState<Record<string, string | number | undefined>>({});

    // Function to handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, argName: string) => {
        setInputValues({ ...inputValues, [argName]: e.target.value });
    };

    // Function to validate input values. This just makes sure user cant submit missing arguments for now.
    const validateInputValues = (): boolean => {
        // Iterate over modalContent.args and validate input values based on their types
        for (const arg of modalContent.args) {
            const inputValue = inputValues[arg.name];
            if (typeof inputValue === 'undefined') {
                toast.error('You have empty args.')
                return false;
            }
        }
        return true;
    };

    // Function to render input fields dynamically
    const renderInputs = () => {
        return modalContent?.args.map((arg) => (
            <div key={arg.name} className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">{arg.name}</label>
                <input
                    type="text"
                    onChange={(e) => handleInputChange(e, arg.name)}
                    className="border border-gray-300 p-2 w-full rounded-md"
                    placeholder={`Enter ${arg.name}...`}
                />
            </div>
        ));
    };

    // Function to handle form submission
    const handleSubmitForm = () => {
        if (validateInputValues()) {
            // All input values are valid, proceed with form submission
            handleSubmit({ message: modalContent.message, inputValues: inputValues as FormInputValues });
        } else {
            // Show error message or handle invalid input values
            console.error('Invalid input values');
        }
    };

    return (
        <div className="fixed z-10 inset-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
            <div className="relative bg-white p-8 rounded-lg w-1/2 h-1/2 overflow-x-scroll">
                <span className="absolute top-0 right-0 p-4" onClick={closeModal}>
                    &times;
                </span>
                <p>{modalContent?.message}</p>
                {renderInputs()}
                <button
                    onClick={handleSubmitForm}
                    className="btn bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md mt-4"
                >
                    Submit Transaction
                </button>
            </div>
        </div>
    );
}