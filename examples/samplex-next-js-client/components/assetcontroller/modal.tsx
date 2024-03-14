import React, { useState } from 'react';


interface ModalProps {
    closeModal: () => void;
    handleSubmit: (inputValues: Record<string, string>) => void;
    modalContent: {
        message: string;
        args: { name: string }[];
    } | null;
}

export const Modal = ({ closeModal, handleSubmit, modalContent }: ModalProps) => {
    const [inputValues, setInputValues] = useState({});

    // Function to handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, argName: string) => {
        setInputValues({ ...inputValues, [argName]: e.target.value });
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
                    onClick={() => handleSubmit(inputValues)}
                    className="btn bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md mt-4"
                >
                    Submit Transaction
                </button>
            </div>
        </div>
    );
};