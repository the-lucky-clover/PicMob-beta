// Cloudflare Worker - Telemetry Aggregation
// Sanitized & Anonymized Model Training Data

export default {
  async telemetry(request, env) {
    const url = new URL(request.url)
    
    if (request.method === 'POST') {
      const data = await request.json()
      await env.DB.prepare(`
        INSERT INTO telemetry (device_id, model_type, loss, accuracy, timestamp)
        VALUES (?, ?, ?, ?, ?)
      `).bind(
        data.deviceId,
        data.modelType,
        data.loss,
        data.accuracy,
        data.timestamp
      ).run()
      return new Response('OK', { status: 200 })
    }
    
    if (url.pathname === '/aggregate') {
      const stmt = await env.DB.prepare(`
        SELECT model_type, AVG(loss) as avg_loss, AVG(accuracy) as avg_accuracy, COUNT(*) as sample_count
        FROM telemetry WHERE timestamp > ? GROUP BY model_type
      `).bind(Date.now() - 86400000).all()
      return new Response(JSON.stringify(stmt.results), { status: 200 })
    }
    return new Response('Not found', { status: 404 })
  }
}
