# Offline RAG System Scripts

### ingest-data.ts
Use this script to populate the target Pinecone index (env PINECONE_INDEX_NAME) with embeddings from /docs/rag_content
run with:
```bash
node --loader ts-node/esm scripts/ingest-data.ts
```

### clear-pinecone-index.ts
Use this script to clear the target Pinecone index with a fresh slate. Obviously be careful using this.
run with:
```bash
node --loader ts-node/esm scripts/clear-pinecone-index.ts
```