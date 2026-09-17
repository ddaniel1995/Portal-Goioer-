import { supabaseStorageService } from './supabaseStorageService';

// IndexedDB database name and store for persistent offline/local images
const DB_NAME = 'PortalMediaDB';
const DB_VERSION = 1;
const STORE_NAME = 'media_files';

let dbPromise: Promise<IDBDatabase> | null = null;

const getIndexedDB = (): Promise<IDBDatabase> => {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        return reject(new Error('IndexedDB not supported'));
      }
      const req = window.indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  return dbPromise;
};

// Store image in IndexedDB
export const saveMediaToIndexedDB = async (id: string, dataUrlOrBlob: string | Blob): Promise<void> => {
  try {
    const db = await getIndexedDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put({
        id,
        data: dataUrlOrBlob,
        timestamp: Date.now(),
      });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.warn('Failed to save to IndexedDB:', e);
  }
};

// Compress and optimize image to WebP/JPEG using Canvas to avoid 5MB quota exhaustion
export const compressImage = (
  file: File, 
  maxWidth = 1400, 
  maxHeight = 1400, 
  quality = 0.82
): Promise<{ blob: Blob; dataUrl: string }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    reader.onerror = reject;

    img.onload = () => {
      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Canvas 2D context unavailable'));
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Determine output format (prefer image/webp, fallback to image/jpeg)
      const mimeType = 'image/jpeg';
      const dataUrl = canvas.toDataURL(mimeType, quality);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve({ blob, dataUrl });
          } else {
            resolve({ blob: file, dataUrl });
          }
        },
        mimeType,
        quality
      );
    };

    img.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export interface ProcessedImageResult {
  url: string;
  provider: 'supabase' | 'indexeddb_optimized';
  message?: string;
  originalSize: number;
  finalSize?: number;
}

export const mediaStorageService = {
  /**
   * Main upload pipeline:
   * 1. Compresses/optimizes the image to reasonable web size.
   * 2. If Supabase Storage is configured and active, uploads directly to Supabase cloud!
   *    -> Permanent public URL that never disappears or expires.
   * 3. If Supabase is not active, stores in persistent IndexedDB and returns optimized Data URL.
   */
  async processAndUploadImage(
    file: File, 
    folder: string = 'materias'
  ): Promise<ProcessedImageResult> {
    const originalSize = file.size;

    // 1. Optimize image
    let optimizedBlob: Blob = file;
    let dataUrl = '';
    try {
      const compressed = await compressImage(file);
      optimizedBlob = compressed.blob;
      dataUrl = compressed.dataUrl;
    } catch (err) {
      console.warn('Image compression fallback to raw file:', err);
    }

    // 2. Check if Supabase Storage is enabled
    if (supabaseStorageService.isConfigured()) {
      try {
        const uploadResult = await supabaseStorageService.uploadFile(optimizedBlob, folder, `${Date.now()}_${file.name}`);
        if (uploadResult.success && uploadResult.url) {
          return {
            url: uploadResult.url,
            provider: 'supabase',
            originalSize,
            finalSize: optimizedBlob.size,
            message: 'Imagem armazenada permanentemente no Supabase Storage!',
          };
        } else {
          console.warn('Supabase upload failed, falling back to durable local storage:', uploadResult.error);
        }
      } catch (err) {
        console.warn('Supabase upload exception, falling back to local:', err);
      }
    }

    // 3. Fallback: Store in IndexedDB and return optimized Base64
    const mediaId = `media_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    await saveMediaToIndexedDB(mediaId, optimizedBlob);

    return {
      url: dataUrl || (await new Promise<string>((res) => {
        const r = new FileReader();
        r.onload = () => res(r.result as string);
        r.readAsDataURL(optimizedBlob);
      })),
      provider: 'indexeddb_optimized',
      originalSize,
      finalSize: optimizedBlob.size,
      message: 'Imagem otimizada e salva com segurança no banco local.',
    };
  },

  isSupabaseActive(): boolean {
    return supabaseStorageService.isConfigured();
  },
};
