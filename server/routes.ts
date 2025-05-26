import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { handleJicooWebhook } from "./webhook-handlers";

export async function registerRoutes(app: Express): Promise<Server> {
  // Jicoo Webhook エンドポイント（APIルートとして）
  app.post('/api/webhook/jicoo', handleJicooWebhook);

  // ヘルスチェック用エンドポイント
  app.get('/api/webhook/status', (req, res) => {
    res.json({
      status: 'active',
      timestamp: new Date().toISOString(),
      webhooks: {
        jicoo: '/api/webhook/jicoo'
      }
    });
  });

  // Webhookテスト用エンドポイント
  app.post('/api/webhook/test', (req, res) => {
    console.log('Webhookテスト受信:', JSON.stringify(req.body, null, 2));
    res.json({
      success: true,
      message: 'Test webhook received successfully',
      receivedData: req.body,
      timestamp: new Date().toISOString()
    });
  });

  // 見積りデータ取得API（オプション）
  app.get('/api/estimate/:id', (req, res) => {
    const estimateId = req.params.id;
    // 実際の実装では、ストレージから見積りデータを取得
    console.log('見積りデータ取得要求:', estimateId);
    res.json({
      success: true,
      message: 'Estimate endpoint ready',
      estimateId
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
