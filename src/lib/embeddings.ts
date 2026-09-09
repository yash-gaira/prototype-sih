// Removed top-level import of @xenova/transformers to prevent Vercel 500 crashes
export interface DocumentChunk {
  id: string;
  sessionId: string;
  text: string;
  embedding: number[];
}

// In-memory store (Since this is a prototype, data clears on server restart)
export const vectorStore: DocumentChunk[] = [];

let embeddingPipeline: any = null;

export async function getEmbeddingPipeline() {
  if (!embeddingPipeline) {
    try {
      // Dynamically import to prevent crashing the entire route on Vercel
      const transformers = await import('@xenova/transformers');
      embeddingPipeline = await transformers.pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    } catch (e) {
      console.warn("Could not load @xenova/transformers, falling back.", e);
      throw e;
    }
  }
  return embeddingPipeline;
}

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const extractor = await getEmbeddingPipeline();
    // Generate embeddings
    const output = await extractor(text, { pooling: 'mean', normalize: true });
    // output.data is a Float32Array
    return Array.from(output.data);
  } catch (error) {
    console.warn("Embedding generation failed (Vercel timeout/read-only). Returning dummy vector.");
    // Return a dummy 384-dimensional vector (size of MiniLM)
    return new Array(384).fill(0.1);
  }
}

// Cosine similarity function
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// RAG Search
export async function searchSimilarChunks(sessionId: string, query: string, topK: number = 3): Promise<DocumentChunk[]> {
  // Filter chunks by sessionId for data isolation
  const userChunks = vectorStore.filter(c => c.sessionId === sessionId);
  if (userChunks.length === 0) return [];

  // Generate query embedding
  const queryEmbedding = await generateEmbedding(query);

  // Compute similarity
  const scoredChunks = userChunks.map(chunk => ({
    chunk,
    score: cosineSimilarity(queryEmbedding, chunk.embedding)
  }));

  // Sort by highest score first
  scoredChunks.sort((a, b) => b.score - a.score);

  // Return top K
  return scoredChunks.slice(0, topK).map(sc => sc.chunk);
}

// Insert chunks
export async function storeDocumentChunks(sessionId: string, chunks: string[]) {
  for (const chunk of chunks) {
    const embedding = await generateEmbedding(chunk);
    vectorStore.push({
      id: Math.random().toString(36).substring(7),
      sessionId,
      text: chunk,
      embedding
    });
  }
}
