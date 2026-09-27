'use client';

import { useState } from 'react';

type Memory = {
  id: number;
  title: string;
  description: string | null;
  date: string;
  emoji: string | null;
  photos: string[];
  order: number;
  type: string;
  quote: string | null;
  showInJournal: boolean;
  showInTimeline: boolean;
};

export function ManageMemoriesClient({ initialMemories }: { initialMemories: Memory[] }) {
  const [memories, setMemories] = useState<Memory[]>(initialMemories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '', description: '', date: '', emoji: '', type: 'milestone', quote: '', order: 0, photos: [] as string[], showInJournal: true, showInTimeline: true
  });
  const [uploading, setUploading] = useState(false);

  const fetchMemories = async () => {
    try {
      const res = await fetch('/api/memories');
      if (res.ok) {
        const data = await res.json();
        setMemories(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenModal = (memory?: Memory) => {
    if (memory) {
      setEditingId(memory.id);
      setFormData({
        title: memory.title,
        description: memory.description || '',
        date: memory.date,
        emoji: memory.emoji || '',
        type: memory.type || 'milestone',
        quote: memory.quote || '',
        order: memory.order,
        photos: memory.photos || [],
        showInJournal: memory.showInJournal,
        showInTimeline: memory.showInTimeline
      });
    } else {
      setEditingId(null);
      setFormData({ title: '', description: '', date: '', emoji: '', type: 'milestone', quote: '', order: memories.length, photos: [], showInJournal: true, showInTimeline: true });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    const data = new FormData();
    data.append('file', file);
    
    setUploading(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });
      if (res.ok) {
        const result = await res.json();
        setFormData(prev => ({ ...prev, photos: [...prev.photos, result.url] }));
      }
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => {
      const newPhotos = [...prev.photos];
      newPhotos.splice(index, 1);
      return { ...prev, photos: newPhotos };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/memories/${editingId}` : '/api/memories';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        handleCloseModal();
        fetchMemories();
      }
    } catch (err) {
      console.error('Failed to save', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this memory?')) return;
    try {
      const res = await fetch(`/api/memories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchMemories();
      }
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto text-charcoal bg-cream min-h-screen font-body">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-heading text-rose-gold">Manage Memories</h1>
        <button 
          onClick={() => handleOpenModal()} 
          className="bg-charcoal text-warm-white px-6 py-2 rounded shadow hover:bg-charcoal/90 transition"
        >
          Add New Memory
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="p-4 font-semibold text-gray-700">Order</th>
              <th className="p-4 font-semibold text-gray-700">Title</th>
              <th className="p-4 font-semibold text-gray-700">Date</th>
              <th className="p-4 font-semibold text-gray-700">Type</th>
              <th className="p-4 font-semibold text-gray-700">Photos</th>
              <th className="p-4 font-semibold text-gray-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {memories.map((memory) => (
              <tr key={memory.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4 font-mono">{memory.order}</td>
                <td className="p-4 font-medium">{memory.emoji} {memory.title}</td>
                <td className="p-4 font-mono text-sm">{memory.date}</td>
                <td className="p-4 capitalize">{memory.type}</td>
                <td className="p-4">{memory.photos.length}</td>
                <td className="p-4 text-right">
                  <button onClick={() => handleOpenModal(memory)} className="text-blue-600 hover:underline mr-4">Edit</button>
                  <button onClick={() => handleDelete(memory.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
            {memories.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">No memories found. Add one!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-2xl font-heading text-rose-gold">{editingId ? 'Edit Memory' : 'Add Memory'}</h2>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-black">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border rounded p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full border rounded p-2" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Emoji</label>
                  <input type="text" value={formData.emoji} onChange={e => setFormData({...formData, emoji: e.target.value})} className="w-full border rounded p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full border rounded p-2">
                    <option value="milestone">Milestone</option>
                    <option value="photo">Photo</option>
                    <option value="letter">Letter</option>
                    <option value="quote">Quote</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Order</label>
                  <input type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 0})} className="w-full border rounded p-2" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border rounded p-2"></textarea>
              </div>

              {formData.type === 'quote' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Quote Text</label>
                  <textarea rows={2} value={formData.quote} onChange={e => setFormData({...formData, quote: e.target.value})} className="w-full border rounded p-2"></textarea>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Photos</label>
                <div className="border-2 border-dashed border-gray-300 rounded p-6 text-center">
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" id="photo-upload" disabled={uploading} />
                  <label htmlFor="photo-upload" className="cursor-pointer text-rose-gold hover:underline">
                    {uploading ? 'Uploading...' : 'Click to upload a photo'}
                  </label>
                </div>
                {formData.photos.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {formData.photos.map((p, i) => (
                      <div key={i} className="relative w-20 h-20 border rounded overflow-hidden">
                         <img src={p} alt="" className="object-cover w-full h-full" />
                        <button type="button" onClick={() => removePhoto(i)} className="absolute top-1 right-1 bg-white text-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs shadow hover:bg-gray-100">&times;</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.showInJournal} onChange={e => setFormData({...formData, showInJournal: e.target.checked})} className="rounded text-rose-gold focus:ring-rose-gold" />
                  <span className="text-sm">Show in Journal (Flipbook)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.showInTimeline} onChange={e => setFormData({...formData, showInTimeline: e.target.checked})} className="rounded text-rose-gold focus:ring-rose-gold" />
                  <span className="text-sm">Show in Timeline</span>
                </label>
              </div>

              <div className="pt-4 border-t flex justify-end gap-3">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-charcoal text-white rounded hover:bg-charcoal/90">Save Memory</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
