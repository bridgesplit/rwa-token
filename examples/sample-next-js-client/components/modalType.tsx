import React, { useState } from 'react';
import { FormInputValues, ModalProps, ModalPropsTyped } from './types';
import { toast } from 'react-toastify'

export const ModalTyped = <T extends FormInputValues>({ closeModal, handleSubmit, modalContent }: ModalPropsTyped<T>) => {

    if (!modalContent?.message || !modalContent.args) {
        return null; // Don't render the modal if there's no content
    }

    const [inputValues, setInputValues] = useState<T>(modalContent.args);

    // Function to handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, argName: string) => {
        const nestedKeys = argName.split('.');
        //TODO: Type fix
        let nestedObject: any = inputValues;

        // Traverse the nested keys to reach the innermost object
        for (let i = 0; i < nestedKeys.length - 1; i++) {
            nestedObject = nestedObject[nestedKeys[i]];
        }

        // Update the innermost object with the new value
        nestedObject[nestedKeys[nestedKeys.length - 1]] = e.target.value;

        setInputValues({ ...inputValues });
    };

    const renderInputs = <T extends FormInputValues>(args: T, parentKey = '') => {
        return Object.entries(args).map(([key, value]) => (
            <div key={parentKey + key} className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">{parentKey + key}</label>
                {
                    key === 'policy' ? <>{modalContent.message}</> :
                        typeof value === 'object' && value !== null ? (
                            Object.keys(value).length === 0 ? (
                                <input
                                    type="text"
                                    onChange={(e) => handleInputChange(e, parentKey + key)}
                                    className="border border-gray-300 p-2 w-full rounded-md"
                                    placeholder={`Enter ${parentKey + key}...`}
                                />
                            ) : (
                                renderInputs(value as Record<string, any>, parentKey + key + '.')
                            )
                        ) : (
                            <input
                                type="text"
                                onChange={(e) => handleInputChange(e, parentKey + key)}
                                className="border border-gray-300 p-2 w-full rounded-md"
                                placeholder={`Enter ${parentKey + key}...`}
                            />
                        )


                }
            </div>
        ));
    };
    return (
        <div className="fixed z-10 inset-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
            <div className="relative bg-white p-8 rounded-lg w-1/2 h-1/2 overflow-x-scroll">
                <span className="absolute top-0 right-0 p-4" onClick={closeModal}>
                    &times;
                </span>
                <p>{modalContent?.message}</p>
                {renderInputs<T>(modalContent.args)}
                <button
                    onClick={() => handleSubmit({ message: modalContent.message, inputValues: inputValues })}
                    className="btn bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md mt-4"
                >
                    Submit Transaction
                </button>
            </div>
        </div>
    );
}