import React, { useState } from 'react';
import { Plus, Trash2, Edit2, X } from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';
import { Button } from '../../../components/ui/Button';

export default function ServiceManagement() {
  const { categories, addCategory, updateCategory, deleteCategory } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const initialForm = { name: '', icon: '', color: 'bg-blue-100 text-blue-600', subServices: [] };
  const [formData, setFormData] = useState(initialForm);

  const openAddModal = () => {
    setEditingId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingId(cat.id);
    setFormData(cat);
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (editingId) {
      updateCategory(editingId, formData);
    } else {
      addCategory(formData);
    }
    setIsModalOpen(false);
  };

  const addSubService = () => {
    setFormData({
      ...formData,
      subServices: [...(formData.subServices || []), { name: '', price: '' }]
    });
  };

  const updateSubService = (index, field, value) => {
    const updated = [...formData.subServices];
    updated[index][field] = value;
    setFormData({ ...formData, subServices: updated });
  };

  const removeSubService = (index) => {
    const updated = [...formData.subServices];
    updated.splice(index, 1);
    setFormData({ ...formData, subServices: updated });
  };

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Services Management</h1>
          <p className="text-text-muted">Add or edit service categories and pricing</p>
        </div>
        <Button onClick={openAddModal}>
          <Plus className="w-5 h-5 mr-2" /> Add Category
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cat.color}`}>
                <div className="w-6 h-6 bg-current opacity-50 rounded-full" />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => openEditModal(cat)}
                  className="p-2 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => deleteCategory(cat.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className="font-bold text-lg mb-2">{cat.name}</h3>
            <p className="text-sm text-text-muted mb-4">{cat.subServices?.length || 0} Sub-services</p>
            
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {cat.subServices?.map((sub, i) => (
                <div key={i} className="flex justify-between text-sm bg-gray-50 p-2 rounded-lg">
                  <span>{sub.name}</span>
                  <span className="font-bold text-primary">₹{sub.price}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[500px] max-h-[80vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">{editingId ? 'Edit Category' : 'Add New Category'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Category Name</label>
              <input 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 border rounded-xl"
                placeholder="e.g. Plumbing"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-text-muted">Sub-Services & Pricing</label>
                <button onClick={addSubService} className="text-xs text-primary font-bold">+ Add Row</button>
              </div>
              <div className="space-y-2">
                {formData.subServices?.map((sub, i) => (
                  <div key={i} className="flex gap-2">
                    <input 
                      placeholder="Service Name"
                      value={sub.name}
                      onChange={e => updateSubService(i, 'name', e.target.value)}
                      className="flex-1 p-2 border rounded-lg text-sm"
                    />
                    <input 
                      placeholder="Price"
                      type="number"
                      value={sub.price}
                      onChange={e => updateSubService(i, 'price', e.target.value)}
                      className="w-24 p-2 border rounded-lg text-sm"
                    />
                    <button onClick={() => removeSubService(i)} className="text-red-500 p-2 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button fullWidth onClick={handleSubmit}>{editingId ? 'Update' : 'Add'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
