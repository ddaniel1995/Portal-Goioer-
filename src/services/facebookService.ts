import { Article, FacebookConfig } from '../types';
import { storageService } from './storageService';

export interface PublishResult {
  success: boolean;
  message: string;
  postId?: string;
  responseDetails?: any;
}

export const facebookService = {
  formatPublicationMessage(template: string, article: Article, appUrl: string): string {
    const articleUrl = `${appUrl.replace(/\/$/, '')}?noticia=${article.slug || article.id}`;
    
    return template
      .replace(/\[TITULO\]/gi, article.title)
      .replace(/\[RESUMO\]/gi, article.subtitle || '')
      .replace(/\[LINK\]/gi, articleUrl)
      .replace(/\[CATEGORIA\]/gi, article.categoryName)
      .replace(/\[AUTOR\]/gi, article.author || 'Redação');
  },

  async testConnection(config: FacebookConfig): Promise<{ success: boolean; message: string; pageName?: string }> {
    if (!config.pageId || !config.pageAccessToken) {
      return {
        success: false,
        message: 'Por favor, informe o Page ID e o Page Access Token da Página do Facebook.'
      };
    }

    // Check if it's the example/demo token
    if (config.pageAccessToken.includes('_TOKEN_EXEMPLO') || config.pageAccessToken.length < 20) {
      return {
        success: true,
        message: `Modo de Demonstração: Conexão simulada com sucesso para a página "${config.pageName || 'Portal Notícias'}" (ID: ${config.pageId}).`,
        pageName: config.pageName || 'Página de Notícias'
      };
    }

    try {
      // Real Meta Graph API call to check page access token
      const url = `https://graph.facebook.com/v19.0/${encodeURIComponent(config.pageId)}?fields=id,name,link&access_token=${encodeURIComponent(config.pageAccessToken)}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok || data.error) {
        const errorMsg = data.error ? `${data.error.message} (Código: ${data.error.code})` : 'Erro ao comunicar com a Meta Graph API.';
        return {
          success: false,
          message: `Falha na autenticação da Meta: ${errorMsg}`
        };
      }

      return {
        success: true,
        message: `Página "${data.name}" conectada com sucesso! Token verificado e ativo.`,
        pageName: data.name
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Erro de rede ou bloqueio de requisição: ${err.message || err}`
      };
    }
  },

  async publishArticleToFacebook(article: Article, isAutomatic: boolean = false): Promise<PublishResult> {
    const config = storageService.getFacebookConfig();

    if (!config.connected) {
      const msg = 'Integração com o Facebook está desativada no Painel ADM.';
      storageService.addFacebookLog({
        articleId: article.id,
        articleTitle: article.title,
        timestamp: new Date().toISOString(),
        status: 'error',
        message: msg
      });
      return { success: false, message: msg };
    }

    if (isAutomatic && !config.autoPublishEnabled) {
      return { success: false, message: 'Publicação automática desativada nas configurações.' };
    }

    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://portalnoticias.com.br';
    const messageText = this.formatPublicationMessage(config.defaultTemplate, article, currentOrigin);
    const articleUrl = `${currentOrigin}?noticia=${article.slug || article.id}`;

    // If demo token, simulate a successful publish with realistic generated ID
    if (config.pageAccessToken.includes('_TOKEN_EXEMPLO') || config.pageAccessToken.length < 20) {
      const simulatedPostId = `${config.pageId}_${Date.now()}`;
      
      // Update article record
      storageService.saveArticle({
        ...article,
        facebookPublished: true,
        facebookPostId: simulatedPostId,
        facebookPublishedAt: new Date().toISOString(),
        facebookError: undefined
      });

      // Update config last publish
      storageService.saveFacebookConfig({
        ...config,
        lastPublishStatus: 'success',
        lastPublishDate: new Date().toISOString()
      });

      // Record log
      const logMessage = `Post publicado com sucesso na Página "${config.pageName}" [Simulação com credenciais de demonstração].`;
      storageService.addFacebookLog({
        articleId: article.id,
        articleTitle: article.title,
        timestamp: new Date().toISOString(),
        status: 'success',
        message: logMessage,
        facebookPostId: simulatedPostId
      });

      return {
        success: true,
        message: logMessage,
        postId: simulatedPostId
      };
    }

    // Real Meta Graph API publication
    try {
      const endpoint = `https://graph.facebook.com/v19.0/${encodeURIComponent(config.pageId)}/feed`;
      
      const payload: Record<string, string> = {
        message: messageText,
        link: articleUrl,
        access_token: config.pageAccessToken
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        const errorMsg = data.error ? `${data.error.message} (Código ${data.error.code}, Subcódigo ${data.error.error_subcode || 'N/A'})` : 'Erro desconhecido retornado pela API da Meta.';
        
        // Update article with error note
        storageService.saveArticle({
          ...article,
          facebookError: errorMsg
        });

        storageService.saveFacebookConfig({
          ...config,
          lastPublishStatus: 'error',
          lastPublishDate: new Date().toISOString()
        });

        storageService.addFacebookLog({
          articleId: article.id,
          articleTitle: article.title,
          timestamp: new Date().toISOString(),
          status: 'error',
          message: `Falha na publicação: ${errorMsg}`
        });

        return {
          success: false,
          message: errorMsg,
          responseDetails: data
        };
      }

      const realPostId = data.id || `post_${Date.now()}`;

      // Update article record
      storageService.saveArticle({
        ...article,
        facebookPublished: true,
        facebookPostId: realPostId,
        facebookPublishedAt: new Date().toISOString(),
        facebookError: undefined
      });

      storageService.saveFacebookConfig({
        ...config,
        lastPublishStatus: 'success',
        lastPublishDate: new Date().toISOString()
      });

      storageService.addFacebookLog({
        articleId: article.id,
        articleTitle: article.title,
        timestamp: new Date().toISOString(),
        status: 'success',
        message: `Post publicado com sucesso na Página oficial (ID do Post: ${realPostId}).`,
        facebookPostId: realPostId
      });

      return {
        success: true,
        message: `Publicação realizada com sucesso no Facebook!`,
        postId: realPostId
      };
    } catch (err: any) {
      const errorMsg = `Erro na requisição: ${err.message || err}`;
      
      storageService.saveArticle({
        ...article,
        facebookError: errorMsg
      });

      storageService.addFacebookLog({
        articleId: article.id,
        articleTitle: article.title,
        timestamp: new Date().toISOString(),
        status: 'error',
        message: errorMsg
      });

      return {
        success: false,
        message: errorMsg
      };
    }
  }
};
