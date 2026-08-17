const API_BASE = '/api';

export async function sendChatMessage(message, history = []) {
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message, history })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(errorData.error || 'Failed to send message');
  }

  const result = await response.json();
  return result.data;
}

export async function fetchKnowledge() {
  const response = await fetch(`${API_BASE}/knowledge`);
  if (!response.ok) throw new Error('Failed to fetch knowledge base');
  return response.json();
}

export async function runEvaluation() {
  const response = await fetch(`${API_BASE}/eval/run`, {
    method: 'POST'
  });
  if (!response.ok) throw new Error('Failed to run benchmark evaluation');
  const result = await response.json();
  return result.report;
}

export async function fetchEvalDataset() {
  const response = await fetch(`${API_BASE}/eval/dataset`);
  if (!response.ok) throw new Error('Failed to fetch evaluation dataset');
  return response.json();
}
