type NostrEvent = {
  content: string;
  created_at: number;
  id: string;
  kind: number;
  pubkey: string;
  sig: string;
  tags: string[][];
}

type RelayMap = { [url: string]: { read: boolean, write: boolean } }

type RelayStateMap = { [url: string]: { state: ConnectionState } };
