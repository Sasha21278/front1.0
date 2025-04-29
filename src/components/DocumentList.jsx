import React from "react";

const DocumentList = ({ documents }) => {
    if (!documents || documents.length === 0) {
        return <p className="text-gray-600 mt-4">Документов нет.</p>;
    }

    return (
        <div className="grid gap-4 mt-4">
            {documents.map((doc) => (
                <div key={doc.id} className="p-4 bg-white rounded shadow">
                    <h3 className="font-semibold text-lg">{doc.title}</h3>
                    <p className="text-sm text-gray-500">ID: {doc.id}</p>
                    <p className="text-sm text-gray-400">Владелец: {doc.user?.username}</p>
                </div>
            ))}
        </div>
    );
};

export default DocumentList;
