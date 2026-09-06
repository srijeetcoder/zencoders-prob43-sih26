import { app } from './app';
import { env } from './config/env';
import { onnxMasterOrchestrator } from './services/onnxOrchestrator.service';

async function bootstrap() {
  try {
    console.log('⚡ Initializing Master ONNX Orchestrator...');
    await onnxMasterOrchestrator.initSession();

    const server = app.listen(env.PORT, () => {
      console.log(`================================================================`);
      console.log(`🏛️  SOCIETAL INNOVATION INTELLIGENCE ENGINE (SIH PS-43)`);
      console.log(`📍 Government of Jharkhand Innovation Coordination Backend`);
      console.log(`🚀 Server running in [${env.NODE_ENV}] mode on port ${env.PORT}`);
      console.log(`🔗 API Base: http://localhost:${env.PORT}/api`);
      console.log(`💚 Health: http://localhost:${env.PORT}/api/health`);
      console.log(`================================================================`);
    });

    const shutdown = () => {
      console.log('\n🛑 Gracefully shutting down server...');
      server.close(() => {
        console.log('✅ HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error: any) {
    console.error('❌ Error during server startup:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  bootstrap();
}
