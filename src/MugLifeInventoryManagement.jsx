import React, { useState, useEffect } from 'react';
import { Trash2, ChevronDown, ChevronUp, ArrowUp } from 'lucide-react';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

export default function MugLifeInventoryManagement() {
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem('muglife-entries');
    return saved ? JSON.parse(saved) : [];
  });
  const [numFields, setNumFields] = useState('');
  const [search, setSearch] = useState('');
  const [sortAsc, setSortAsc] = useState(true);
  const [heading, setHeading] = useState('');
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem('muglife-entries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    const handleScroll = () => {
      const btn = document.getElementById('scrollToTop');
      if (btn) {
        btn.style.display = window.scrollY > 300 ? 'flex' : 'none';
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEntryChange = (index, field, value) => {
    const updated = [...entries];
    updated[index][field] = value;
    setEntries(updated);
  };

  const addEntryField = () => {
    if (!heading.trim()) return;
    setEntries([...entries, { name: '', count: '', remaining: '', remark: '', heading }]);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('MugLife Inventory Report', 20, 20);
    doc.setFontSize(12);
    let y = 30;

    const grouped = entries.reduce((acc, item) => {
      const group = item.heading || 'Uncategorized';
      acc[group] = acc[group] || [];
      acc[group].push(item);
      return acc;
    }, {});

    Object.entries(grouped).forEach(([group, items]) => {
      doc.text(`${group}`, 20, y);
      y += 10;
      items.forEach((item, index) => {
        if (item.name || item.count || item.remaining || item.remark) {
          doc.text(
            `${index + 1}. ${item.name} | Fridge Count: ${item.count} | Back Count: ${item.remaining} | Remark: ${item.remark}`,
            25,
            y
          );
          y += 10;
        }
      });
      y += 5;
    });

    doc.save('MugLife_Inventory_Report.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(entries);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory');
    XLSX.writeFile(workbook, 'MugLife_Inventory_Report.xlsx');
  };

  const handleNumFieldSubmit = () => {
    const count = parseInt(numFields);
    if (!isNaN(count) && count > 0 && heading.trim()) {
      const newFields = Array.from({ length: count }, () => ({ name: '', count: '', remaining: '', remark: '', heading }));
      setEntries(prev => [...prev, ...newFields]);
    }
  };

  const handleDelete = (index) => {
    const deletedItem = entries[index];
    const updated = entries.filter((_, i) => i !== index);
    setEntries(updated);
    setToast(`Deleted item: ${deletedItem.name || 'Unnamed Item'}`);
    setTimeout(() => setToast(null), 3000);
  };

  const toggleGroup = (heading) => {
    setCollapsedGroups(prev => ({ ...prev, [heading]: !prev[heading] }));
  };

  const groupedItems = entries.reduce((acc, item, index) => {
    const group = item.heading || 'Uncategorized';
    acc[group] = acc[group] || [];
    acc[group].push({ ...item, index });
    return acc;
  }, {});

  return (
    <div className="relative p-6 max-w-6xl mx-auto space-y-6 sm:p-8 bg-slate-50 min-h-screen">
      {toast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded shadow z-50">
          {toast}
        </div>
      )}

      <h1 className="text-3xl font-bold text-center text-blue-800 tracking-tight mb-4">MugLife Inventory</h1>

      <button
        id="scrollToTop"
        onClick={scrollToTop}
        className="hidden fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg"
        title="Scroll to top"
      >
        <ArrowUp size={20} />
      </button>

      <div className="bg-white shadow rounded-xl p-6 space-y-4 border border-slate-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Section Heading (e.g., Mugs, Bottles, Cups)"
            className="w-full border p-3 rounded-md text-sm"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
          />
          <input
            type="number"
            placeholder="Number of entries to start with"
            className="w-full border p-3 rounded-md text-sm"
            value={numFields}
            onChange={(e) => setNumFields(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleNumFieldSubmit}
            disabled={!heading.trim() || !numFields}
            className="flex-1 bg-blue-600 text-white py-2 rounded-md text-sm font-medium disabled:bg-gray-300"
          >
            Generate Fields
          </button>
          <button
            onClick={addEntryField}
            disabled={!heading.trim()}
            className="flex-1 bg-blue-500 text-white py-2 rounded-md text-sm font-medium disabled:bg-gray-300"
          >
            + Add Entry
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow border">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase text-left">
            <tr>
              <th className="p-3">Item Name</th>
              <th className="p-3">Fridge Count</th>
              <th className="p-3">Back Count</th>
              <th className="p-3">Remark</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-200">
            {entries.map((entry, index) => (
              <tr key={index} className="hover:bg-slate-50">
                <td className="p-3">
                  <input
                    className="w-full border p-2 rounded text-sm"
                    placeholder="Item Name"
                    value={entry.name}
                    onChange={(e) => handleEntryChange(index, 'name', e.target.value)}
                  />
                </td>
                <td className="p-3">
                  <input
                    className="w-full border p-2 rounded text-sm"
                    placeholder="Fridge Count"
                    value={entry.count}
                    onChange={(e) => handleEntryChange(index, 'count', e.target.value)}
                  />
                </td>
                <td className="p-3">
                  <input
                    className="w-full border p-2 rounded text-sm"
                    placeholder="Back Count"
                    value={entry.remaining}
                    onChange={(e) => handleEntryChange(index, 'remaining', e.target.value)}
                  />
                </td>
                <td className="p-3">
                  <input
                    className="w-full border p-2 rounded text-sm"
                    placeholder="Remark"
                    value={entry.remark}
                    onChange={(e) => handleEntryChange(index, 'remark', e.target.value)}
                  />
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleDelete(index)}
                    className="text-red-600 hover:text-red-800 border border-red-200 px-3 py-1 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <input
          className="border p-3 rounded-md flex-1 text-sm"
          placeholder="Search Items"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={() => setSortAsc(!sortAsc)}
          className="w-full sm:w-auto bg-gray-100 border border-gray-300 text-gray-800 py-2 px-4 rounded-md text-sm"
        >
          Sort {sortAsc ? '▲' : '▼'}
        </button>
      </div>

      {entries.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4">
          <button onClick={generatePDF} className="flex-1 bg-emerald-600 text-white py-3 rounded-md text-sm flex items-center justify-center gap-2">📄
            Generate PDF Report
          </button>
          <button onClick={exportToExcel} className="flex-1 bg-yellow-500 text-white py-3 rounded-md text-sm flex items-center justify-center gap-2">📊
            Export to Excel
          </button>
        </div>
      )}
    </div>
  );
}
