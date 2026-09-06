# Master Router ONNX Model Directory

This directory houses the zero-API ONNX model artifact (`master_router.onnx`) utilized by `src/services/onnxOrchestrator.service.ts` to classify problem domain taxonomies and determine execution priorities locally on device/server without external latency.

### Heuristic & Neural Hybrid Routing
If `master_router.onnx` is present in this directory, `onnxruntime-node` loads the optimized computational graph and executes inference on the CPU runtime. If the model is absent or undergoing maintenance, the Master Orchestrator gracefully operates in local zero-API heuristic mode with sub-millisecond execution times.
