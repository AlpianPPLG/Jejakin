import { useState } from 'react';
import { Button } from './button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

interface WishlistButtonProps {
  destinationId: string;
  isInWishlist?: boolean;
  onToggle?: (isInWishlist: boolean) => void;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}

export function WishlistButton({
  destinationId,
  isInWishlist: initialIsInWishlist = false,
  onToggle,
  size = 'default',
  variant = 'ghost',
}: WishlistButtonProps) {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [isInWishlist, setIsInWishlist] = useState(initialIsInWishlist);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (!user) {
      showError('Silakan login terlebih dahulu');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      if (isInWishlist) {
        // Remove from wishlist
        const response = await fetch(`/api/wishlists?destinationId=${destinationId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to remove from wishlist');

        setIsInWishlist(false);
        showSuccess('Dihapus dari wishlist');
        onToggle?.(false);
      } else {
        // Add to wishlist
        const response = await fetch('/api/wishlists', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ destinationId }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to add to wishlist');
        }

        setIsInWishlist(true);
        showSuccess('Ditambahkan ke wishlist');
        onToggle?.(true);
      }
    } catch (error: any) {
      showError(error.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggle}
      disabled={loading}
      className="gap-2"
    >
      <span className="text-xl">
        {isInWishlist ? '❤️' : '🤍'}
      </span>
      {size !== 'sm' && (
        <span>{isInWishlist ? 'Tersimpan' : 'Simpan'}</span>
      )}
    </Button>
  );
}
