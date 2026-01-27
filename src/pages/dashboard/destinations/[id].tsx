import { useState, useEffect, FormEvent } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { withAuthRequired } from '@/components/hoc/withAuth';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/contexts/ToastContext';
import { Skeleton } from '@/components/ui/skeleton';

interface DestinationForm {
  name: string;
  location: string;
  province: string;
  city: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  facilities: string[];
  status: string;
}

function EditDestinationPage() {
  const router = useRouter();
  const { id } = router.query;
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<DestinationForm>({
    name: '',
    location: '',
    province: '',
    city: '',
    description: '',
    price: 0,
    category: 'BEACH',
    images: [''],
    facilities: [''],
    status: 'active',
  });

  useEffect(() => {
    if (id && id !== 'create') {
      fetchDestination();
    } else {
      setLoading(false);
    }
  }, [id]);

  const fetchDestination = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showError('Session expired. Please login again.');
        router.push('/login');
        return;
      }

      const response = await fetch(`/api/destinations/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setFormData({
        name: data.data.name,
        location: data.data.location,
        province: data.data.province,
        city: data.data.city,
        description: data.data.description,
        price: data.data.price,
        category: data.data.category,
        images: data.data.images.length > 0 ? JSON.parse(data.data.images) : [''],
        facilities: data.data.facilities ? JSON.parse(data.data.facilities) : [''],
        status: data.data.status,
      });
    } catch (error) {
      showError('Gagal memuat destinasi');
      router.push('/dashboard/destinations');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = id === 'create' ? '/api/destinations' : `/api/destinations/${id}`;
      const method = id === 'create' ? 'POST' : 'PUT';

      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        showError('Session expired. Please login again.');
        router.push('/login');
        return;
      }

      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          images: formData.images.filter(img => img.trim() !== ''),
          facilities: formData.facilities.filter(f => f.trim() !== ''),
        }),
      });

      if (!response.ok) throw new Error('Failed to save');

      showSuccess(id === 'create' ? 'Destinasi berhasil ditambahkan' : 'Destinasi berhasil diperbarui');
      router.push('/dashboard/destinations');
    } catch (error) {
      showError('Gagal menyimpan destinasi');
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const removeImageField = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages.length > 0 ? newImages : [''] });
  };

  const handleFacilityChange = (index: number, value: string) => {
    const newFacilities = [...formData.facilities];
    newFacilities[index] = value;
    setFormData({ ...formData, facilities: newFacilities });
  };

  const addFacilityField = () => {
    setFormData({ ...formData, facilities: [...formData.facilities, ''] });
  };

  const removeFacilityField = (index: number) => {
    const newFacilities = formData.facilities.filter((_, i) => i !== index);
    setFormData({ ...formData, facilities: newFacilities.length > 0 ? newFacilities : [''] });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <>
      <Head>
        <title>{id === 'create' ? 'Tambah' : 'Edit'} Destinasi - Jejakin</title>
      </Head>

      <DashboardLayout>
        <div className="max-w-3xl">
          {/* Header */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push('/dashboard/destinations')}
              className="mb-4"
            >
              ← Kembali
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">
              {id === 'create' ? 'Tambah Destinasi Baru' : 'Edit Destinasi'}
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Informasi Destinasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Destinasi *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Pantai Kuta"
                    required
                  />
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">Alamat Lengkap *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Contoh: Jl. Pantai Kuta No. 1"
                    required
                  />
                </div>

                {/* Province & City */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="province">Provinsi *</Label>
                    <Input
                      id="province"
                      value={formData.province}
                      onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                      placeholder="Contoh: Bali"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Kota/Kabupaten *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Contoh: Badung"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Deskripsikan destinasi ini..."
                    rows={5}
                    required
                  />
                </div>

                {/* Price & Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Harga (Rp) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      placeholder="500000"
                      min="0"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Kategori *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BEACH">Pantai</SelectItem>
                        <SelectItem value="MOUNTAIN">Gunung</SelectItem>
                        <SelectItem value="CULTURAL">Budaya</SelectItem>
                        <SelectItem value="ADVENTURE">Petualangan</SelectItem>
                        <SelectItem value="CULINARY">Kuliner</SelectItem>
                        <SelectItem value="NATURE">Alam</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Images */}
                <div className="space-y-2">
                  <Label>URL Gambar</Label>
                  {formData.images.map((image, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={image}
                        onChange={(e) => handleImageChange(index, e.target.value)}
                        placeholder="https://example.com/image.jpg"
                      />
                      {formData.images.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => removeImageField(index)}
                        >
                          Hapus
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addImageField}
                  >
                    + Tambah Gambar
                  </Button>
                </div>

                {/* Facilities */}
                <div className="space-y-2">
                  <Label>Fasilitas</Label>
                  {formData.facilities.map((facility, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={facility}
                        onChange={(e) => handleFacilityChange(index, e.target.value)}
                        placeholder="Contoh: Parkir, Toilet, Mushola"
                      />
                      {formData.facilities.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => removeFacilityField(index)}
                        >
                          Hapus
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addFacilityField}
                  >
                    + Tambah Fasilitas
                  </Button>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="status"
                    checked={formData.status === 'active'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'active' : 'inactive' })}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="status" className="cursor-pointer">
                    Aktifkan destinasi ini
                  </Label>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Menyimpan...' : 'Simpan'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/dashboard/destinations')}
                  >
                    Batal
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </DashboardLayout>
    </>
  );
}

export default withAuthRequired(EditDestinationPage);
