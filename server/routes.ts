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

  // Jicoo Webhookテスト用エンドポイント（実際のJicooデータ形式でテスト）
  app.post('/api/webhook/test', async (req, res) => {
    console.log('Jicoo Webhookテスト受信:', JSON.stringify(req.body, null, 2));
    
    // テスト用のJicooデータがない場合はサンプルデータを使用
    const testJicooData = req.body.event ? req.body : {
      event: 'booking.created',
      data: {
        id: 'test-reservation-' + Date.now(),
        title: 'エアコン取付工事',
        start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        end_time: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
        timezone: 'Asia/Tokyo',
        attendees: [
          {
            name: 'テスト太郎',
            email: 'test@example.com',
            status: 'confirmed'
          }
        ],
        host: {
          name: '電化のマンセイ',
          email: 'info@d-mansei.co.jp'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    };
    
    // 実際のJicooハンドラーを呼び出してテスト
    try {
      await handleJicooWebhook({ ...req, body: testJicooData } as any, res);
    } catch (error) {
      console.error('テストWebhook処理エラー:', error);
      res.status(500).json({
        success: false,
        error: 'Test webhook processing failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
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
