import { useState } from "react";

interface TransactionCountVelocity {
    limit: number;
    timeframe: number;
}

export const TransactionCountVelocity = () => {
    const [limit, setLimit] = useState<number>(100);
    const [timeframe, setTimeframe] = useState<number>(60);
    const [errors, setErrors] = useState<string[]>([]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const errors: string[] = [];

        if (isNaN(limit) || limit <= 0) {
            errors.push("Limit must be a positive number.");
        }

        if (isNaN(timeframe) || timeframe <= 0) {
            errors.push("Timeframe must be a positive number.");
        }

        if (errors.length === 0) {
            const transactionCountVelocity: TransactionCountVelocity = {
                limit: limit,
                timeframe: timeframe
            };

            console.log('Transaction Count Velocity:', transactionCountVelocity);

            // You can send this data to the server or use it as needed

            // Reset form after submission (optional)
            // setLimit(100);
            // setTimeframe(60);
        } else {
            setErrors(errors);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-4 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Transaction Count Velocity Form</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="limit" className="block text-gray-700">Limit:</label>
                    <input
                        type="number"
                        id="limit"
                        value={limit}
                        min={0}
                        onChange={(e) => setLimit(parseInt(e.target.value))}
                        className="w-full px-3 py-2 mt-1 text-gray-700 border rounded-md focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="timeframe" className="block text-gray-700">Timeframe:</label>
                    <input
                        type="number"
                        id="timeframe"
                        value={timeframe}
                        min={0}
                        onChange={(e) => setTimeframe(parseInt(e.target.value))}
                        className="w-full px-3 py-2 mt-1 text-gray-700 border rounded-md focus:outline-none focus:border-blue-500"
                    />
                </div>
                {errors.length > 0 && (
                    <div className="mb-4">
                        {errors.map((error, index) => (
                            <p key={index} className="text-red-500">{error}</p>
                        ))}
                    </div>
                )}
                <div>
                    <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Submit</button>
                </div>
            </form>
        </div>
    );
};