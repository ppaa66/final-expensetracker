'use client';

export default function TransactionList({ transactions, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-left">Description</th>
            <th className="border px-4 py-2 text-right">Amount</th>
            <th className="border px-4 py-2 text-left">Type</th>
            <th className="border px-4 py-2 text-left">Category</th>
            <th className="border px-4 py-2 text-left">Date</th>
            <th className="border px-4 py-2 text-center">Delete</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id} className="hover:bg-gray-50 transition-colors">
              <td className="border px-4 py-2">{t.description}</td>
              <td className={`border px-4 py-2 text-right ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                {parseFloat(t.amount).toLocaleString()}
              </td>
              <td className="border px-4 py-2">{t.type}</td>
              <td className="border px-4 py-2">{t.category}</td>
              <td className="border px-4 py-2">{t.date}</td>
              <td className="border px-4 py-2 text-center">
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  onClick={() => onDelete(t.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
