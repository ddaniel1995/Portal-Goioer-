import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface SupabaseStorageConfig {
  url: string;
  anonKey: string;
  bucket: string;
  enabled: boolean;
}

const STORAGE_CONFIG_KEY = 'portal_supabase_storage_config';

// Default configuration checking environment variables first
const getInitialConfig = (): SupabaseStorageConfig => {
  const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env || {};
  const envUrl = metaEnv.VITE_SUPABASE_URL || '';
  const envKey = metaEnv.VITE_SUPABASE_ANON_KEY || '';
  const envBucket = metaEnv.VITE_SUPABASE_BUCKET || 'portal-images';

  try {
    const saved = localStorage.getItem(STORAGE_CONFIG_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        url: parsed.url || envUrl,
        anonKey: parsed.anonKey || envKey,
        bucket: parsed.bucket || envBucket,
        enabled: parsed.enabled !== undefined ? parsed.enabled : Boolean(parsed.url && parsed.anonKey),
      };
    }
  } catch (e) {
    console.error('Failed to load saved Supabase config:', e);
  }

  return {
    url: envUrl,
    anonKey: envKey,
    bucket: envBucket,
    enabled: Boolean(envUrl && envKey),
  };
};

let currentConfig: SupabaseStorageConfig = getInitialConfig();
let supabaseClientInstance: SupabaseClient | null = null;

const cleanUrl = (url: string): string => {
  return url.trim().replace(/\/+$/, '');
};

const getClient = (): SupabaseClient | null => {
  if (!currentConfig.url || !currentConfig.anonKey) {
    return null;
  }
  if (!supabaseClientInstance) {
    try {
      supabaseClientInstance = createClient(cleanUrl(currentConfig.url), currentConfig.anonKey.trim(), {
        auth: {
          persistSession: false,
        },
      });
    } catch (err) {
      console.error('Error creating Supabase client instance:', err);
      supabaseClientInstance = null;
    }
  }
  return supabaseClientInstance;
};

export const supabaseStorageService = {
  getConfig(): SupabaseStorageConfig {
    return { ...currentConfig };
  },

  saveConfig(newConfig: Partial<SupabaseStorageConfig>): SupabaseStorageConfig {
    currentConfig = {
      ...currentConfig,
      ...newConfig,
      url: newConfig.url !== undefined ? cleanUrl(newConfig.url) : currentConfig.url,
      anonKey: newConfig.anonKey !== undefined ? newConfig.anonKey.trim() : currentConfig.anonKey,
      bucket: newConfig.bucket !== undefined ? newConfig.bucket.trim() || 'portal-images' : currentConfig.bucket,
    };
    // Invalidate client instance to recreate with new credentials
    supabaseClientInstance = null;

    try {
      localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(currentConfig));
      window.dispatchEvent(new CustomEvent('portal_supabase_config_updated', { detail: currentConfig }));
    } catch (e) {
      console.error('Failed to save Supabase config to storage:', e);
    }

    return { ...currentConfig };
  },

  isConfigured(): boolean {
    return Boolean(
      currentConfig.enabled && 
      currentConfig.url && 
      currentConfig.anonKey && 
      currentConfig.bucket
    );
  },

  async testConnection(): Promise<{ 
    success: boolean; 
    message: string; 
    bucketExists?: boolean;
    isPublic?: boolean;
    details?: string;
  }> {
    if (!currentConfig.url || !currentConfig.anonKey) {
      return {
        success: false,
        message: 'Preencha a URL do Projeto Supabase e a Anon Public Key para testar.',
      };
    }

    const client = getClient();
    if (!client) {
      return {
        success: false,
        message: 'Não foi possível inicializar o cliente Supabase com os dados fornecidos.',
      };
    }

    try {
      // 1. Check if we can reach Supabase storage by listing buckets
      const { data: buckets, error: listError } = await client.storage.listBuckets();

      if (listError) {
        // Even if listBuckets fails due to RLS, let's try a direct ping to the specific bucket
        const testFileContent = new Blob(['ping'], { type: 'text/plain' });
        const testPath = `_test/ping_${Date.now()}.txt`;
        const { error: uploadError } = await client.storage
          .from(currentConfig.bucket)
          .upload(testPath, testFileContent, { upsert: true });

        if (uploadError) {
          return {
            success: false,
            message: `Falha na conexão com Supabase: ${uploadError.message}. Verifique se o bucket "${currentConfig.bucket}" existe e está com permissão pública (Public).`,
            details: uploadError.message,
          };
        } else {
          // Remove the ping test file
          await client.storage.from(currentConfig.bucket).remove([testPath]);
          return {
            success: true,
            bucketExists: true,
            message: `Conexão bem-sucedida com o bucket "${currentConfig.bucket}" no Supabase!`,
          };
        }
      }

      const bucketName = currentConfig.bucket.toLowerCase();
      const foundBucket = buckets?.find(b => b.name.toLowerCase() === bucketName);

      if (!foundBucket) {
        // Attempt to create bucket automatically if it does not exist
        const { error: createError } = await client.storage.createBucket(currentConfig.bucket, {
          public: true,
        });

        if (createError) {
          return {
            success: true,
            bucketExists: false,
            message: `Conectado ao Supabase! Porém o bucket "${currentConfig.bucket}" ainda não existe. Por favor, acesse o painel da Supabase > Storage e crie o bucket "${currentConfig.bucket}" marcado como "Public".`,
            details: createError.message,
          };
        } else {
          return {
            success: true,
            bucketExists: true,
            isPublic: true,
            message: `Conectado com sucesso! O bucket "${currentConfig.bucket}" foi criado como público automaticamente no Supabase.`,
          };
        }
      }

      return {
        success: true,
        bucketExists: true,
        isPublic: foundBucket.public,
        message: `Conexão validada com sucesso! O bucket "${foundBucket.name}" está pronto e ativo no Supabase.`,
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Erro ao conectar com o Supabase: ${err?.message || 'Verifique a URL e a Anon Key'}.`,
        details: String(err),
      };
    }
  },

  async uploadFile(
    file: File | Blob, 
    folder: string = 'geral',
    customFileName?: string
  ): Promise<{ success: boolean; url: string; error?: string }> {
    if (!this.isConfigured()) {
      return {
        success: false,
        url: '',
        error: 'Supabase Storage não está configurado ou ativado.',
      };
    }

    const client = getClient();
    if (!client) {
      return {
        success: false,
        url: '',
        error: 'Cliente Supabase não inicializado.',
      };
    }

    try {
      const extension = (file instanceof File && file.name.includes('.'))
        ? file.name.split('.').pop()?.toLowerCase() || 'jpg'
        : 'jpg';

      const safeName = customFileName 
        ? customFileName.replace(/[^a-zA-Z0-9_-]/g, '_')
        : `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

      const cleanFolder = folder.replace(/[^a-zA-Z0-9_-]/g, '_');
      const filePath = `${cleanFolder}/${safeName}.${extension}`;

      const { error: uploadError } = await client.storage
        .from(currentConfig.bucket)
        .upload(filePath, file, {
          cacheControl: '31536000', // 1 year cache
          upsert: true,
          contentType: file.type || 'image/jpeg',
        });

      if (uploadError) {
        console.error('Supabase Storage upload error:', uploadError);
        return {
          success: false,
          url: '',
          error: uploadError.message,
        };
      }

      // Get permanent public URL
      const { data } = client.storage
        .from(currentConfig.bucket)
        .getPublicUrl(filePath);

      return {
        success: true,
        url: data.publicUrl,
      };
    } catch (err: any) {
      console.error('Unexpected Supabase upload exception:', err);
      return {
        success: false,
        url: '',
        error: err?.message || 'Erro inesperado no envio ao Supabase',
      };
    }
  },
};
