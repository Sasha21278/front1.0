import React from "react";

const MetadataCard = ({ metadata }) => {
    if (!metadata || Object.keys(metadata).length === 0) {
        return <p className="text-gray-500">Метаданные отсутствуют.</p>;
    }

    return (
        <div className="bg-gray-50 border rounded p-4 mt-4 shadow-sm">
            <h3 className="font-semibold mb-2 text-gray-700">Метаданные</h3>
            <ul className="text-sm space-y-1 text-gray-800">
                {Object.entries(metadata).map(([key, value]) => (
                    <li key={key}>
                        <span className="font-medium">{key}:</span> {value}
                    </li>
                ))}
                {metadata.keywords && (
                    <li>
                        <span className="font-medium">Ключевые слова:</span> {metadata.keywords.join(", ")}
                    </li>
                )}
            </ul>
        </div>
    );
};

export default MetadataCard;
