# Project Evidence Map

Audit date: 2026-10-30. “Public repository” means the portfolio links to inspectable source. “Owner-provided” means the claim was supplied for the portfolio and is labelled accordingly rather than presented as repository-verified.

| Portfolio project | Primary evidence | Evidence boundary |
|---|---|---|
| Engineering Portfolio Delivery | [sebastroza1.github.io](https://github.com/sebastroza1/sebastroza1.github.io), `VALIDATION.md`, pull requests, GitHub Actions and Pages deployments | Static portfolio engineering only; Lighthouse is synthetic and no analytics, backend or real-user monitoring is claimed |
| Reproducible PyTorch Benchmarking | [mlops-gpu-benchmark-lab](https://github.com/sebastroza1/mlops-gpu-benchmark-lab), `RESULTS.md`, commit `a28eceb`, CI run `40824821285` | Quick CPU evidence only; no CUDA benchmark claim |
| Collaboration Ops Lab | [collaboration-ops-lab](https://github.com/sebastroza1/collaboration-ops-lab), commit `fef648a`, CI run `40959343791`, 15 tests | Synthetic fixtures and zero-write dry-run only; live Graph and tenant administration are not claimed |
| Web Performance Evidence Lab | [web-performance-evidence](https://github.com/sebastroza1/web-performance-evidence), commit `4cd204f`, CI run `40959346799`, 10 tests, reproducible Markdown/SVG | Owner-provided local p75 sample; not real-user telemetry or causal evidence |
| ML Experiment Tracking Lab | [ml-experiment-tracking-lab](https://github.com/sebastroza1/ml-experiment-tracking-lab), `RESULTS.md`, commit `c0fe10f`, CI run `40824830483` | One CPU quick search and seed |
| Scientific Anomaly Detection | [scientific-anomaly-detection](https://github.com/sebastroza1/scientific-anomaly-detection), `RESULTS.md`, commit `a008232`, CI run `40824834996` | AI4I is synthetic; not industrial validation |
| ML Model Serving & Operations | [ml-model-serving-ops](https://github.com/sebastroza1/ml-model-serving-ops), `RESULTS.md`, commit `015f893`, CI run `40824842705` | Synthetic classifier; Kubernetes not cluster-validated |
| Dataset Quality & Calibration | [dataset-quality-calibration-lab](https://github.com/sebastroza1/dataset-quality-calibration-lab), `RESULTS.md`, commit `6136d58`, CI run `40824845017` | Defects and review decisions are simulated |
| Embedding & RAG Retrieval Evaluation | [embedding-rag-evaluation-lab](https://github.com/sebastroza1/embedding-rag-evaluation-lab), `RESULTS.md`, commit `42b7838`, CI run `40824849304` | Small original corpus; retrieval only |
| Landmark Robustness Evaluation | [vision-landmark-robustness-lab](https://github.com/sebastroza1/vision-landmark-robustness-lab), `RESULTS.md`, commit `0572977`, CI run `40824852651` | Synthetic landmarks; no patient or clinical evidence |
| Distributed Storage Cluster Lab | [distributed-storage-cluster-lab](https://github.com/sebastroza1/distributed-storage-cluster-lab), `RESULTS.md`, commit `75444d3`, CI run `40822949914` | Implemented, but runtime/replication evidence is blocked and not claimed |
| C++ File Integrity Toolkit | [cpp-file-integrity-toolkit](https://github.com/sebastroza1/cpp-file-integrity-toolkit), `reports/RESULTS.md`, commit `3225ead`, CI run `40822967454` | Cached bounded benchmark; no raw-disk or fsync guarantee |
| RHEL Network Operations Lab | [rhel-network-operations-lab](https://github.com/sebastroza1/rhel-network-operations-lab), `reports/RESULTS.md`, commit `3045e89`, CI run `40825339512` | UBI is not a full RHEL host; privileged check remains skipped |
| Storage Performance & Observability | [storage-performance-observability](https://github.com/sebastroza1/storage-performance-observability), `reports/RESULTS.md`, commit `39089ee`, CI run `40822967312` | Cached Python I/O on one host; not an SLO or distributed-storage result |
| NeuroFAST | Owner-provided thesis/project description and UDD 2026 first-stage selection | Private academic prototype; non-clinical and not a medical device |
| Air Drum · Computer Vision | [bateria-peroles](https://github.com/sebastroza1/bateria-peroles) | Public implementation; third-party asset licensing still needs a release audit |
| Realidad Aumentada UCEN | [Prototipo-Realidad-Aumentada-Ucen](https://github.com/sebastroza1/Prototipo-Realidad-Aumentada-Ucen-2026-08-20_21-53-25) | Demonstrative academic prototype; no institutional deployment claim |
| LandFinder Chile | Authenticated inspection of the private repository and implementation README on 2026-10-29 | Substantial local Vue/FastAPI/PostGIS implementation; repository remains private, tests were not independently rerun for this release, no remote deployment and no completed-MVP/property-catalogue claim |
| Web Scraper FirstJob | [Web_Scraper_firstJob](https://github.com/sebastroza1/Web_Scraper_firstJob) | Public source; live-site stability and CI coverage not claimed |

The catalogue contains 19 projects. Category filters are tags over the same records; they do not create duplicate project cards.
